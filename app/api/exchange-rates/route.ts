import type { NextRequest } from "next/server";
import { checkRateLimit, rateLimitKey } from "@/lib/api-rate-limit";
import { cacheGet, cacheSet } from "@/lib/cache/unified-cache";
import { MAJOR_CURRENCY_CODES } from "@/lib/tools/currency-options";

export const runtime = "nodejs";

const ALLOW = new Set<string>(MAJOR_CURRENCY_CODES as unknown as string[]);
const CACHE_KEY_PREFIX = "fx:frankfurter:";

function clientIp(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "local";
}

export async function GET(req: NextRequest) {
  const ip = clientIp(req);
  const rl = checkRateLimit(rateLimitKey("fx", ip), 60, 60_000);
  if (!rl.ok) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }

  const from = (req.nextUrl.searchParams.get("from") ?? "").toUpperCase();
  const to = (req.nextUrl.searchParams.get("to") ?? "").toUpperCase();
  if (!ALLOW.has(from) || !ALLOW.has(to)) {
    return Response.json({ error: "invalid_currency" }, { status: 400 });
  }
  if (from === to) {
    return Response.json(
      { from, to, rate: 1, source: "identity", asOf: new Date().toISOString().slice(0, 10) },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  }

  const cacheKey = `${CACHE_KEY_PREFIX}${from}:${to}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }

  const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  const upstream = await fetch(url, { headers: { Accept: "application/json" } });
  if (!upstream.ok) {
    return Response.json({ error: "upstream_unavailable" }, { status: 502 });
  }
  const data = (await upstream.json()) as { date?: string; rates?: Record<string, number> };
  const rate = data.rates?.[to];
  if (typeof rate !== "number" || !Number.isFinite(rate)) {
    return Response.json({ error: "bad_upstream_payload" }, { status: 502 });
  }

  const payload = {
    from,
    to,
    rate,
    asOf: data.date ?? new Date().toISOString().slice(0, 10),
    source: "frankfurter.app",
  };
  const json = JSON.stringify(payload);
  await cacheSet(cacheKey, json, 3600);
  return new Response(json, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
