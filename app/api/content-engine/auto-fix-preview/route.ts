import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { buildDashboardSnapshot } from "@/lib/content-engine/dashboard/build-dashboard-snapshot";
import { buildAutoFixPrFiles } from "@/lib/content-engine/auto-fix/build-fix-queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Returns markdown payloads for `content-engine:autofix-pr` (no disk write). */
export async function GET(req: NextRequest) {
  const denied = assertContentEngineAuthorized(req);
  if (denied) return denied;
  const dash = await buildDashboardSnapshot();
  const gl = dash.growthLoop;
  const files = buildAutoFixPrFiles({
    ctrRows: gl?.ctrQueue ?? [],
    behaviorActions: dash.behaviorPrActions,
  });
  return Response.json({ ok: true, files });
}
