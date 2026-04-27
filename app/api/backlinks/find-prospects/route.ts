import type { NextRequest } from "next/server";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import { runProspectFinder } from "@/lib/backlinks/run-prospect-finder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  let body: { category?: string; analyze_limit?: number };
  try {
    body = (await req.json()) as { category?: string; analyze_limit?: number };
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const category = (body.category ?? "tools").trim();
  const analyzeLimit = typeof body.analyze_limit === "number" && body.analyze_limit > 0 ? Math.min(200, body.analyze_limit) : 40;
  try {
    const result = await runProspectFinder(category, analyzeLimit);
    return Response.json({ ok: true, ...result });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "find_failed" },
      { status: 500 },
    );
  }
}
