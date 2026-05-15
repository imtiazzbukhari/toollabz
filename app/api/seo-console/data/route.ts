import type { NextRequest } from "next/server";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import { buildDashboardSnapshot } from "@/lib/content-engine/dashboard/build-dashboard-snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Full dashboard payload for scripts / authenticated clients. */
export async function GET(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  const snapshot = await buildDashboardSnapshot();
  return Response.json({ ok: true, snapshot });
}
