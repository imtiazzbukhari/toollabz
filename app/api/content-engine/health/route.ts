import { getSystemStatuses } from "@/lib/content-engine/system-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const systems = getSystemStatuses();
  const degraded = systems.some((s) => s.status === "failed");
  return Response.json({
    status: degraded ? "degraded" : "ok",
    systems,
  });
}
