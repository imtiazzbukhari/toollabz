import type { NextRequest } from "next/server";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import { getProspect, updateProspect, type ProspectStatus } from "@/lib/db/backlinks-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUS = new Set<ProspectStatus>([
  "new",
  "content_ready",
  "sent",
  "approved",
  "negotiating",
  "live",
  "rejected",
]);

type PatchBody = {
  status?: string;
  notes?: string;
  dr_estimate?: number;
  contact_email?: string | null;
};

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!getProspect(id)) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  let body: PatchBody;
  try {
    body = (await req.json()) as PatchBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (body.status != null && !VALID_STATUS.has(body.status as ProspectStatus)) {
    return Response.json({ ok: false, error: "invalid_status" }, { status: 400 });
  }
  const patch: Parameters<typeof updateProspect>[1] = {};
  if (body.status) patch.status = body.status;
  if (typeof body.notes === "string") patch.notes = body.notes;
  if (typeof body.dr_estimate === "number") patch.dr_estimate = body.dr_estimate;
  if (typeof body.contact_email === "string" || body.contact_email === null) patch.contact_email = body.contact_email ?? null;
  updateProspect(id, patch);
  const prospect = getProspect(id);
  return Response.json({ ok: true, prospect });
}
