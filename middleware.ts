import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

function isLocalHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h.endsWith(".local");
}

function withHsts(res: NextResponse, hostNoPort: string, apex: string) {
  if (hostNoPort === apex) {
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return res;
}

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? "";
  const hostNoPort = hostHeader.split(":")[0]?.toLowerCase() ?? "";
  if (!hostNoPort || isLocalHost(hostNoPort)) {
    return NextResponse.next();
  }

  const apex = canonicalApexHostname();
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const url = request.nextUrl.clone();
  const isHttps =
    forwardedProto === "https" ||
    (forwardedProto == null && url.protocol === "https:");

  if (!isHttps) {
    url.protocol = "https:";
    const res = NextResponse.redirect(url, 301);
    return withHsts(res, hostNoPort, apex);
  }

  if (hostNoPort === `www.${apex}`) {
    url.hostname = apex;
    url.protocol = "https:";
    const res = NextResponse.redirect(url, 301);
    return withHsts(res, apex, apex);
  }

  const res = NextResponse.next();
  return withHsts(res, hostNoPort, apex);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|woff2)$).*)",
  ],
};
