import type { SprintExecutionRecord } from "./sprint-execution-tracker";

export type ImpactComparisonRow = {
  id: string;
  targetPage: string;
  expectedRevenueImpactUsd: number;
  actualRevenueImpactUsd: number;
  deviationUsd: number;
  deviationPct: number;
  accuracyScore: number;
};

export type ImpactComparisonSnapshot = {
  completed: ImpactComparisonRow[];
  averageAccuracyScore: number;
};

export function buildImpactComparisonSnapshot(rows: readonly SprintExecutionRecord[]): ImpactComparisonSnapshot {
  const completed: ImpactComparisonRow[] = [];
  for (const r of rows) {
    if (r.status !== "done") continue;
    if (!Number.isFinite(r.actualRevenueImpactUsd)) continue;
    const expected = Math.max(0, r.expectedRevenueImpactUsd);
    const actual = Math.max(0, Number(r.actualRevenueImpactUsd));
    const deviationUsd = actual - expected;
    const deviationPct = expected > 0 ? (deviationUsd / expected) * 100 : actual > 0 ? 100 : 0;
    const accuracyScore = Math.max(0, 100 - Math.min(100, Math.abs(deviationPct)));
    completed.push({
      id: r.id,
      targetPage: r.targetPage,
      expectedRevenueImpactUsd: expected,
      actualRevenueImpactUsd: actual,
      deviationUsd: Number(deviationUsd.toFixed(2)),
      deviationPct: Number(deviationPct.toFixed(2)),
      accuracyScore: Number(accuracyScore.toFixed(1)),
    });
  }
  const averageAccuracyScore = completed.length
    ? Number((completed.reduce((n, c) => n + c.accuracyScore, 0) / completed.length).toFixed(1))
    : 0;
  return { completed, averageAccuracyScore };
}

