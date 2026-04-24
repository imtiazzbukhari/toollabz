import type { MonetizationScorecardAction } from "./monetization-scorecard";
import type { SprintExecutionRecord } from "./sprint-execution-tracker";

export type LearningInsight = {
  fixType: MonetizationScorecardAction["exactFix"];
  winRate: number;
  avgActualLiftUsd: number;
  recommendation: string;
  confidenceAdjustment: -1 | 0 | 1;
};

export type LearningSnapshot = {
  insights: LearningInsight[];
};

export function buildLearningSnapshot(rows: readonly SprintExecutionRecord[]): LearningSnapshot {
  const fixTypes: MonetizationScorecardAction["exactFix"][] = ["rewrite", "link", "cta", "ad_placement"];
  const insights: LearningInsight[] = [];
  for (const fixType of fixTypes) {
    const done = rows.filter((r) => r.exactFix === fixType && r.status === "done" && Number.isFinite(r.actualRevenueImpactUsd));
    const wins = done.filter((r) => (r.actualRevenueImpactUsd ?? 0) >= r.expectedRevenueImpactUsd * 0.85);
    const winRate = done.length ? (wins.length / done.length) * 100 : 0;
    const avgActualLiftUsd = done.length
      ? Number((done.reduce((n, r) => n + Math.max(0, r.actualRevenueImpactUsd ?? 0), 0) / done.length).toFixed(2))
      : 0;
    const confidenceAdjustment: -1 | 0 | 1 = winRate >= 65 ? 1 : winRate > 0 && winRate < 40 ? -1 : 0;
    const recommendation =
      confidenceAdjustment > 0
        ? `${fixType} performs well; prioritize more often.`
        : confidenceAdjustment < 0
          ? `${fixType} underperforms; tighten criteria and reduce priority.`
          : `${fixType} needs more data before changing weight.`;
    insights.push({
      fixType,
      winRate: Number(winRate.toFixed(1)),
      avgActualLiftUsd,
      recommendation,
      confidenceAdjustment,
    });
  }
  return { insights };
}

export function applyLearningToScorecard(actions: readonly MonetizationScorecardAction[], learning: LearningSnapshot): MonetizationScorecardAction[] {
  const adj = new Map(learning.insights.map((i) => [i.fixType, i.confidenceAdjustment]));
  return actions.map((a) => {
    const d = adj.get(a.exactFix) ?? 0;
    const confidence =
      d > 0 ? (a.confidence === "low" ? "medium" : "high") : d < 0 ? (a.confidence === "high" ? "medium" : "low") : a.confidence;
    const score = Math.max(0, Math.min(100, a.score + d * 4));
    return { ...a, confidence, score };
  });
}

