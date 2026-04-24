import type { NextRequest } from "next/server";
import { getConsoleAdminConfig, updateConsoleAdminConfig } from "@/lib/content-engine/console-admin-store";
import { isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  return Response.json({ ok: true, config: getConsoleAdminConfig() });
}

export async function POST(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const patch: Record<string, unknown> = {};
  if (typeof rec.aiEnabled === "boolean") patch.aiEnabled = rec.aiEnabled;
  if (typeof rec.highIntentMode === "boolean") patch.highIntentMode = rec.highIntentMode;
  if (typeof rec.businessMode === "boolean") patch.businessMode = rec.businessMode;
  if (typeof rec.revenueBoostMode === "boolean") patch.revenueBoostMode = rec.revenueBoostMode;
  if (rec.dashboardMode === "analysis" || rec.dashboardMode === "execution") patch.dashboardMode = rec.dashboardMode;
  if (typeof rec.paused === "boolean") patch.paused = rec.paused;
  if (typeof rec.overrideDecisions === "boolean") patch.overrideDecisions = rec.overrideDecisions;
  if (typeof rec.activeCluster === "string") patch.activeCluster = rec.activeCluster;
  if (Array.isArray(rec.activeClusters)) patch.activeClusters = rec.activeClusters.filter((v): v is string => typeof v === "string");
  const config = updateConsoleAdminConfig(patch);
  return Response.json({ ok: true, config });
}
