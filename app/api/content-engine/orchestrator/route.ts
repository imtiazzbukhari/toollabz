import { readOrchestratorLogs, readOrchestratorState } from "@/lib/content-engine/orchestrator-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const state = readOrchestratorState();
  const recentLogs = readOrchestratorLogs(40);
  return Response.json({
    ...state,
    recentLogs,
  });
}
