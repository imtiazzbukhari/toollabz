import type { NextRequest } from "next/server";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import { verifyAndRecordLiveLink } from "@/lib/backlinks/verify-live-link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  let body: {
    prospectId?: string;
    liveUrl?: string;
    relevance?: number;
    dr?: number | null;
    anchor?: string | null;
    dofollow?: boolean;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const prospectId = body.prospectId?.trim();
  const liveUrl = body.liveUrl?.trim();
  if (!prospectId || !liveUrl) return Response.json({ ok: false, error: "missing_fields" }, { status: 400 });
  const result = await verifyAndRecordLiveLink({
    prospectId,
    liveUrl,
    relevance: typeof body.relevance === "number" ? body.relevance : undefined,
    drOverride: typeof body.dr === "number" ? body.dr : body.dr === null ? null : undefined,
    anchorOverride: body.anchor ?? undefined,
    dofollowOverride: typeof body.dofollow === "boolean" ? (body.dofollow ? 1 : 0) : undefined,
  });
  if (!result.ok) {
    return Response.json({ ok: false, error: result.reason, message: result.reason }, { status: 400 });
  }
  return Response.json({
    ok: true,
    found: result.found,
    message: result.message,
  });
}
