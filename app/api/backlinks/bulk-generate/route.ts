import type { NextRequest } from "next/server";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import { generateContentForProspect } from "@/lib/backlinks/run-content-generation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    return Response.json({ ok: false, error: "anthropic_missing" }, { status: 503 });
  }
  let body: { prospectIds?: string[] };
  try {
    body = (await req.json()) as { prospectIds?: string[] };
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const rawIds = Array.isArray(body.prospectIds) ? body.prospectIds.filter(Boolean) : [];
  if (rawIds.length > 10) {
    return Response.json({ ok: false, error: "max_10_ids" }, { status: 400 });
  }
  const ids = rawIds.slice(0, 10);
  const results: Array<{ id: string; ok: boolean; error?: string }> = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i]!;
    if (i > 0) await delay(400);
    try {
      await generateContentForProspect(id);
      results.push({ id, ok: true });
    } catch (e) {
      results.push({ id, ok: false, error: e instanceof Error ? e.message : "failed" });
    }
  }
  return Response.json({ ok: true, results });
}
