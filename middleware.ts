import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSeoConsoleSecret, isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";
import { checkRateLimit, rateLimitKey } from "@/lib/api-rate-limit";

/** Valid IPv4 in Host header (no port). */
const IPV4_HOST =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

function canonicalApexHostname(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CANONICAL_HOST?.trim();
  if (fromEnv) {
    try {
      const normalized = fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
      return new URL(normalized).hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
      /* fall through */
    }
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    try {
      const normalized = site.startsWith("http") ? site : `https://${site}`;
      return new URL(normalized).hostname.replace(/^www\./i, "").toLowerCase();
    } catch {
      /* fall through */
    }
  }
  return "toollabz.com";
}

/** Dev / loopback: skip host canonicalization only (SEO console auth still runs below). */
function isLocalDevHost(hostNoPort: string): boolean {
  const h = hostNoPort.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h.endsWith(".local");
}

/** IP literals and non-domain hosts: no www/apex enforcement (VPS by IP, bind addresses). */
function isIpOrNonDomainHost(hostNoPort: string): boolean {
  if (!hostNoPort) return true;
  if (hostNoPort === "0.0.0.0") return true;
  if (IPV4_HOST.test(hostNoPort)) return true;
  if (hostNoPort.startsWith("[") && hostNoPort.includes("]")) return true;
  return false;
}

function shouldEnforceHostCanonicalization(hostNoPort: string): boolean {
  return !isLocalDevHost(hostNoPort) && !isIpOrNonDomainHost(hostNoPort);
}

/** Never emit redirects to these (or to raw IPs as mistaken “canonical”). */
function isUnsafeRedirectTargetHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0") return true;
  if (h === "[::1]" || h === "::1") return true;
  if (IPV4_HOST.test(h)) return true;
  if (h.startsWith("[")) return true;
  return false;
}

function isTrustedProductionApex(apex: string): boolean {
  return Boolean(apex) && apex.includes(".") && !isUnsafeRedirectTargetHostname(apex);
}

/**
 * Public HTTPS detection behind nginx.
 * Prefer forwarded headers — Next's internal URL is almost always `http://…:3000`.
 */
export function requestIsHttps(request: NextRequest): boolean {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  if (forwardedProto === "https") return true;
  if (forwardedProto === "http") return false;
  if (request.headers.get("x-forwarded-ssl")?.toLowerCase() === "on") return true;
  const forwarded = request.headers.get("forwarded");
  if (forwarded && /(?:^|[;,]\s*)proto=https(?:[;,]|$)/i.test(forwarded)) return true;
  return request.nextUrl.protocol === "https:";
}

/**
 * Build a public absolute URL for redirects.
 * CRITICAL: clear `port` — `request.nextUrl` behind Node often carries `:3000`,
 * which produces `https://toollabz.com:3000/` → browser ERR_SSL_PROTOCOL_ERROR
 * (TLS handshake against plain HTTP on the Node port).
 */
export function buildPublicHttpsUrl(request: NextRequest, hostname: string): URL {
  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.hostname = hostname;
  url.port = "";
  return url;
}

function withHsts(res: NextResponse, hostForHsts: string, apex: string) {
  // Match next.config: includeSubDomains only — do not send preload until every subdomain is verified.
  if (isTrustedProductionApex(apex) && hostForHsts === apex) {
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
  }
  return res;
}

function redirectOrNext(hostForHsts: string, target: URL, apex: string): NextResponse {
  if (isUnsafeRedirectTargetHostname(target.hostname)) {
    return NextResponse.next();
  }
  // Belt-and-suspenders: never leak the Node listen port into Location.
  target.port = "";
  const res = NextResponse.redirect(target, 301);
  return withHsts(res, hostForHsts, apex);
}

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? "";
  const hostNoPort = hostHeader.split(":")[0]?.toLowerCase() ?? "";

  const apex = canonicalApexHostname();
  const apexOk = isTrustedProductionApex(apex);
  const enforceHost = shouldEnforceHostCanonicalization(hostNoPort);

  /**
   * HTTP → HTTPS is owned by nginx (listen 80 → 443).
   * Middleware must NOT invent https://host:3000 redirects when X-Forwarded-Proto is missing —
   * that is the proven production outage (ERR_SSL_PROTOCOL_ERROR).
   *
   * Only canonicalize www → apex on the public hostname, with port stripped.
   */
  if (enforceHost && apexOk && hostNoPort === `www.${apex}`) {
    return redirectOrNext(apex, buildPublicHttpsUrl(request, apex), apex);
  }

  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/api/")) {
    const xf = request.headers.get("x-forwarded-for");
    const ip = xf ? xf.split(",")[0]!.trim() : (request.headers.get("x-real-ip") ?? "local");
    const rl = checkRateLimit(rateLimitKey("api", ip), 240, 60_000);
    if (!rl.ok) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfter), "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isSeoConsole = pathname.startsWith("/seo-growth-console");
  if (isSeoConsole || isDashboard) {
    const loginPath = "/seo-growth-console/login";
    if (pathname.startsWith("/seo-growth-console/login")) {
      const res = NextResponse.next();
      return withHsts(res, hostNoPort, apex);
    }
    const secret = getSeoConsoleSecret();
    if (!secret) {
      // Path-only Location (no host/port) — safe behind nginx; avoids :3000 absolute URLs.
      const res = NextResponse.redirect(new URL(`${loginPath}?error=not_configured`, request.url));
      return withHsts(res, hostNoPort, apex);
    }
    if (!isSeoConsoleAuthenticated(request)) {
      const res = NextResponse.redirect(
        new URL(`${loginPath}?next=${encodeURIComponent(pathname)}`, request.url),
      );
      return withHsts(res, hostNoPort, apex);
    }
    const res = NextResponse.next();
    return withHsts(res, hostNoPort, apex);
  }

  const res = NextResponse.next();
  return withHsts(res, hostNoPort, apex);
}

/**
 * Skip middleware for Next static assets and favicon so:
 * - `/_next/static/*` always gets correct Content-Type and no extra work (rate limits, redirects).
 * - Production cannot regress into “HTML loads but CSS/JS 404 or wrong handler” due to proxy + middleware edge cases.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
