import type { NextRequest } from "next/server";
import { isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";
import { buildDashboardSnapshot } from "@/lib/content-engine/dashboard/build-dashboard-snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  const snapshot = await buildDashboardSnapshot();
  return Response.json({
    ok: true,
    score: snapshot.adsenseReadiness.score,
    approvalProbability: snapshot.adsenseReadiness.approvalProbability,
    history: snapshot.adsenseHistory,
    actions: snapshot.adsenseActions,
    alerts: snapshot.revenueAlerts.filter((a) => a.type.startsWith("adsense_") || a.type === "missing_policy_pages"),
    issues: snapshot.adsenseReadiness.issues,
    progress: snapshot.adsenseProgress,
  });
}
