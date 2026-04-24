import type { NextRequest } from "next/server";
import { appendConsoleLog } from "@/lib/content-engine/console-admin-store";
import { enrichHistoryRowWithImpact } from "@/lib/content-engine/execution/impact-tracker";
import { pageExecutionSnapshotFromAggregates, pageExecutionSnapshotFromUnknown } from "@/lib/content-engine/execution/metrics-snapshot";
import { recomputeExecutionLearningFromHistory, saveExecutionLearningState } from "@/lib/content-engine/execution/execution-learning";
import { loadExecutionHistory, updateExecutionHistoryRow } from "@/lib/content-engine/execution-store";
import { loadPerformanceAggregates } from "@/lib/content-engine/performance/load-aggregates";
import { isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
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
  const executionId = typeof rec.executionId === "string" ? rec.executionId.trim() : "";
  if (!executionId) return Response.json({ ok: false, error: "executionId required." }, { status: 400 });

  try {
    const history = loadExecutionHistory();
    const row = history.find((h) => h.id === executionId);
    if (!row) return Response.json({ ok: false, error: "Execution history row not found." }, { status: 404 });

    const pathOverride = typeof rec.path === "string" ? rec.path.trim() : "";
    const path = pathOverride || (typeof row.path === "string" ? row.path.trim() : "");
    const refreshFromAggregates = rec.refreshFromAggregates === true;

    let after =
      pageExecutionSnapshotFromUnknown(rec.afterMetrics as Record<string, unknown> | undefined) ?? null;
    if (refreshFromAggregates && path.startsWith("/")) {
      const perf = loadPerformanceAggregates();
      after = pageExecutionSnapshotFromAggregates(path, perf) ?? after;
    }

    if (!after) {
      return Response.json(
        {
          ok: false,
          error: "No after metrics: pass afterMetrics { impressions, clicks, ctr, position } or refreshFromAggregates with a GSC path on the row.",
        },
        { status: 400 },
      );
    }

    const revenueRaw = rec.revenueImpactUsd;
    const revenueImpactUsd = typeof revenueRaw === "number" && Number.isFinite(revenueRaw) ? revenueRaw : null;

    const patch = enrichHistoryRowWithImpact(row, after, revenueImpactUsd);
    const updated = updateExecutionHistoryRow(executionId, patch);
    if (!updated) return Response.json({ ok: false, error: "Update failed." }, { status: 500 });

    const nextLearning = recomputeExecutionLearningFromHistory(loadExecutionHistory());
    saveExecutionLearningState(nextLearning);

    appendConsoleLog({
      type: "ai_action",
      level: "info",
      message: `Mark impact: ${executionId} classification=${updated.impactClassification ?? "pending"}`,
    });

    return Response.json({
      ok: true,
      row: updated,
      learning: {
        updatedAt: nextLearning.updatedAt,
        kindKeys: Object.keys(nextLearning.kindMultipliers).length,
        pathKeys: Object.keys(nextLearning.pathMultipliers).length,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "mark_impact_error";
    appendConsoleLog({ type: "task_failed", level: "error", message });
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
