import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { loadSprintExecutionLog, updateSprintExecution } from "@/lib/content-engine/dashboard/sprint-execution-tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = assertContentEngineAuthorized(req);
  if (denied) return denied;
  return Response.json({ ok: true, rows: loadSprintExecutionLog() });
}

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
  const id = typeof rec.id === "string" ? rec.id : "";
  const status = rec.status === "done" ? "done" : rec.status === "pending" ? "pending" : null;
  const completionDate = typeof rec.completionDate === "string" ? rec.completionDate : undefined;
  const actualRevenueImpactUsd =
    typeof rec.actualRevenueImpactUsd === "number" && Number.isFinite(rec.actualRevenueImpactUsd)
      ? rec.actualRevenueImpactUsd
      : undefined;
  if (!id || !status) {
    return Response.json({ ok: false, error: "Provide id and status (pending|done)." }, { status: 400 });
  }
  const updated = updateSprintExecution({ id, status, completionDate, actualRevenueImpactUsd });
  if (!updated) return Response.json({ ok: false, error: "Sprint action not found." }, { status: 404 });
  return Response.json({ ok: true, row: updated });
}

