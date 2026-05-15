import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { runCompetitorIntelligence } from "@/lib/content-engine/competitor/intelligence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST JSON { ourPath, competitorUrls: string[] } - fetches https competitors, extracts headings, gaps vs our template.
 */
export async function POST(req: NextRequest) {
  const denied = assertContentEngineAuthorized(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const ourPath = typeof rec.ourPath === "string" ? rec.ourPath.trim() : "";
  const urls = Array.isArray(rec.competitorUrls) ? rec.competitorUrls.filter((u): u is string => typeof u === "string") : [];
  if (!ourPath.startsWith("/")) {
    return Response.json({ ok: false, error: "ourPath must start with /" }, { status: 400 });
  }
  if (urls.length === 0 || urls.length > 5) {
    return Response.json({ ok: false, error: "Provide 1–5 competitorUrls (https only)." }, { status: 400 });
  }

  try {
    const report = await runCompetitorIntelligence({ ourPath, competitorUrls: urls });
    return Response.json({ ok: true, report });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "analyze_failed";
    return Response.json({ ok: false, error: msg }, { status: 502 });
  }
}
