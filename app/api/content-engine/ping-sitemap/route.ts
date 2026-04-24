import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { pingGoogleSitemap } from "@/lib/content-engine/google-indexing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const denied = assertContentEngineAuthorized(req);
  if (denied) return denied;

  const sitemapUrlRaw = req.nextUrl.searchParams.get("sitemapUrl");
  const sitemapUrl = sitemapUrlRaw?.trim() || undefined;
  const ping = await pingGoogleSitemap(sitemapUrl);
  return Response.json({ ok: ping.ok, ping });
}
