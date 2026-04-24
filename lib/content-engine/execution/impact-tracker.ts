import type { ExecutionHistoryRow } from "../execution-store";
import type { PageExecutionSnapshot } from "./metrics-snapshot";
import { pageExecutionSnapshotFromUnknown } from "./metrics-snapshot";

export type MetricDeltas = {
  ctrChangePct: number | null;
  trafficChangePct: number | null;
  /** Positive = average position worsened (higher number); negative = improved. */
  positionChange: number | null;
};

export type ImpactClassification = "success" | "neutral" | "failed";

export function computeMetricDeltas(before: PageExecutionSnapshot, after: PageExecutionSnapshot): MetricDeltas {
  const ctrChangePct =
    before.ctr > 0.0001 ? Number((((after.ctr - before.ctr) / before.ctr) * 100).toFixed(2)) : after.ctr > before.ctr ? 100 : 0;
  const trafficChangePct =
    before.clicks > 0
      ? Number((((after.clicks - before.clicks) / before.clicks) * 100).toFixed(2))
      : after.clicks > before.clicks
        ? 100
        : null;
  const positionChange =
    before.position != null && after.position != null ? Number((after.position - before.position).toFixed(2)) : null;
  return { ctrChangePct, trafficChangePct, positionChange };
}

/**
 * 0–100 heuristic from deltas and optional observed revenue impact.
 */
export function computeSuccessScore(
  deltas: MetricDeltas,
  revenueImpactUsd: number | null | undefined,
): number {
  let s = 50;
  if (deltas.ctrChangePct != null) s += Math.max(-25, Math.min(25, deltas.ctrChangePct * 2));
  if (deltas.trafficChangePct != null) s += Math.max(-20, Math.min(20, deltas.trafficChangePct * 0.35));
  if (deltas.positionChange != null) s += Math.max(-15, Math.min(15, -deltas.positionChange * 3));
  if (revenueImpactUsd != null && Number.isFinite(revenueImpactUsd)) {
    s += Math.max(-10, Math.min(15, revenueImpactUsd / 5));
  }
  return Math.max(0, Math.min(100, Math.round(s)));
}

export function classifyImpact(
  deltas: MetricDeltas,
  successScore: number,
  revenueImpactUsd: number | null | undefined,
): ImpactClassification {
  const revBoost = revenueImpactUsd != null && revenueImpactUsd > 2;
  const strongScore = successScore >= 62;
  const weakScore = successScore <= 38;
  const ctrWin = deltas.ctrChangePct != null && deltas.ctrChangePct >= 2;
  const trafficWin = deltas.trafficChangePct != null && deltas.trafficChangePct >= 4;
  const rankWin = deltas.positionChange != null && deltas.positionChange <= -0.25;
  const ctrLoss = deltas.ctrChangePct != null && deltas.ctrChangePct <= -3;
  const trafficLoss = deltas.trafficChangePct != null && deltas.trafficChangePct <= -8;
  const rankLoss = deltas.positionChange != null && deltas.positionChange >= 0.45;

  if (revBoost || strongScore || ctrWin || trafficWin || rankWin) return "success";
  if (weakScore || ctrLoss || trafficLoss || rankLoss) return "failed";
  return "neutral";
}

export type ExecutionPerformanceSummary = {
  actionsWithImpact: number;
  successCount: number;
  neutralCount: number;
  failedCount: number;
  successRate: number | null;
  avgSuccessScore: number | null;
  avgCtrChangeWhenMeasured: number | null;
  avgTrafficChangeWhenMeasured: number | null;
  topFixes: Array<{ actionId: string; kind: string; title: string; successScore: number; classification: ImpactClassification }>;
  note: string;
};

function rowTitle(r: ExecutionHistoryRow): string {
  const snap = typeof r.titleSnapshot === "string" ? r.titleSnapshot.trim() : "";
  return snap.length > 0 ? snap.slice(0, 100) : r.result.slice(0, 100);
}

export function buildExecutionPerformanceSummary(history: readonly ExecutionHistoryRow[]): ExecutionPerformanceSummary {
  const scored = history.filter((h) => h.successScore != null && Number.isFinite(h.successScore));
  const classified = history.filter((h) => h.impactClassification);
  const successCount = classified.filter((h) => h.impactClassification === "success").length;
  const neutralCount = classified.filter((h) => h.impactClassification === "neutral").length;
  const failedCount = classified.filter((h) => h.impactClassification === "failed").length;
  const denom = successCount + neutralCount + failedCount;
  const ctrRows = history.filter((h) => h.metricDeltas?.ctrChangePct != null);

  const avgSuccessScore =
    scored.length > 0 ? Number((scored.reduce((a, h) => a + (h.successScore ?? 0), 0) / scored.length).toFixed(1)) : null;
  const avgCtr =
    ctrRows.length > 0
      ? Number((ctrRows.reduce((a, h) => a + (h.metricDeltas?.ctrChangePct ?? 0), 0) / ctrRows.length).toFixed(2))
      : null;
  const trafficRows = history.filter((h) => h.metricDeltas?.trafficChangePct != null);
  const avgTraffic =
    trafficRows.length > 0
      ? Number(
          (
            trafficRows.reduce((a, h) => a + (h.metricDeltas?.trafficChangePct ?? 0), 0) /
            trafficRows.length
          ).toFixed(2),
        )
      : null;

  const topFixes = [...history]
    .filter((h) => h.successScore != null && (h.kind === "fix_now" || h.kind === "queue_sprint"))
    .sort((a, b) => (b.successScore ?? 0) - (a.successScore ?? 0))
    .slice(0, 5)
    .map((h) => ({
      actionId: h.actionId,
      kind: h.kind,
      title: rowTitle(h),
      successScore: h.successScore ?? 0,
      classification: (h.impactClassification ?? "neutral") as ImpactClassification,
    }));

  return {
    actionsWithImpact: denom,
    successCount,
    neutralCount,
    failedCount,
    successRate: denom > 0 ? Number(((successCount / denom) * 100).toFixed(1)) : null,
    avgSuccessScore,
    avgCtrChangeWhenMeasured: avgCtr,
    avgTrafficChangeWhenMeasured: avgTraffic,
    topFixes,
    note:
      denom === 0
        ? "Record after-metrics via mark-impact (or refresh from aggregates) to populate success rates."
        : "Impact is heuristic from GSC deltas plus optional revenue; tune thresholds as your traffic grows.",
  };
}

/** Recompute deltas + scores from before/after snapshots on a row patch. */
export function enrichHistoryRowWithImpact(
  row: ExecutionHistoryRow,
  afterOverride?: PageExecutionSnapshot | null,
  revenueImpactUsd?: number | null,
): Partial<ExecutionHistoryRow> {
  const before =
    row.beforeSnapshot ?? pageExecutionSnapshotFromUnknown(row.beforeMetrics as Record<string, unknown> | undefined);
  const after = afterOverride ?? row.afterSnapshot ?? pageExecutionSnapshotFromUnknown(row.afterMetrics as Record<string, unknown> | undefined);
  if (!after) {
    return { revenueImpactUsd: revenueImpactUsd ?? row.revenueImpactUsd ?? null };
  }
  if (!before) {
    const revenue = revenueImpactUsd ?? row.revenueImpactUsd ?? null;
    return {
      afterSnapshot: after,
      afterMetrics: { ...after } as Record<string, unknown>,
      metricDeltas: { ctrChangePct: null, trafficChangePct: null, positionChange: null },
      successScore: revenue != null && revenue > 1 ? 58 : 50,
      impactClassification: "neutral" as ImpactClassification,
      revenueImpactUsd: revenue,
    };
  }
  const metricDeltas = computeMetricDeltas(before, after);
  const revenue = revenueImpactUsd ?? row.revenueImpactUsd ?? null;
  const successScore = computeSuccessScore(metricDeltas, revenue);
  const impactClassification = classifyImpact(metricDeltas, successScore, revenue);
  return {
    afterSnapshot: after,
    afterMetrics: { ...after } as Record<string, unknown>,
    metricDeltas,
    successScore,
    impactClassification,
    revenueImpactUsd: revenue,
  };
}
