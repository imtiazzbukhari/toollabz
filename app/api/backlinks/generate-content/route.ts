import type { NextRequest } from "next/server";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import { generateContentForProspect } from "@/lib/backlinks/run-content-generation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    return Response.json(
      {
        ok: false,
        error: "anthropic_missing",
        message: "Add ANTHROPIC_API_KEY for AI content generation.",
      },
      { status: 503 },
    );
  }
  let body: { prospectId?: string };
  try {
    body = (await req.json()) as { prospectId?: string };
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const prospectId = body.prospectId?.trim();
  if (!prospectId) return Response.json({ ok: false, error: "prospectId_required" }, { status: 400 });
  try {
    const { content, warnings } = await generateContentForProspect(prospectId);
    return Response.json({ ok: true, content, warnings });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "generate_failed";
    const status = msg.includes("gate") || msg.includes("rejected") || msg.includes("below minimum") ? 403 : 500;
    return Response.json({ ok: false, error: msg }, { status });
  }
}
