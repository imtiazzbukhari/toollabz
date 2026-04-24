import type { BehaviorAggregates } from "../growth/behavior-types";
import type { PerformanceAggregates } from "../performance/types";
import { TOPIC_CLUSTERS } from "../topic-clusters";
import { buildAdvancedRevenueOptimization } from "./revenue-optimization";

export type ClusterMoneyScoreRow = {
  clusterId: string;
  revenuePotential: number;
  conversionStrength: number;
  scalabilityScore: number;
  moneyScore: number;
};

export function buildClusterMoneyScores(
  performance: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
): ClusterMoneyScoreRow[] {
  const rev = buildAdvancedRevenueOptimization(performance, behavior, 400);
  const byCluster = new Map<string, { revSum: number; convSum: number; n: number; scalableHits: number }>();

  for (const c of TOPIC_CLUSTERS) byCluster.set(c.id, { revSum: 0, convSum: 0, n: 0, scalableHits: 0 });
  for (const row of rev.pageScores) {
    if (!row.clusterId || !byCluster.has(row.clusterId)) continue;
    const c = byCluster.get(row.clusterId)!;
    c.revSum += row.trueRevenueScore;
    c.convSum += row.conversionRate;
    c.n += 1;
    if (row.trueRevenueScore >= 55 && row.conversionRate >= 0.06) c.scalableHits += 1;
  }

  const out: ClusterMoneyScoreRow[] = [];
  for (const c of TOPIC_CLUSTERS) {
    const agg = byCluster.get(c.id)!;
    const revenuePotential = agg.n ? agg.revSum / agg.n : 0;
    const conversionStrength = agg.n ? (agg.convSum / agg.n) * 100 : 0;
    const scalabilityScore = Math.min(100, Math.round((agg.scalableHits / Math.max(1, agg.n)) * 100 + Math.min(25, agg.n * 4)));
    const moneyScore = Math.round(revenuePotential * 0.45 + conversionStrength * 0.3 + scalabilityScore * 0.25);
    out.push({
      clusterId: c.id,
      revenuePotential: Number(revenuePotential.toFixed(2)),
      conversionStrength: Number(conversionStrength.toFixed(2)),
      scalabilityScore,
      moneyScore,
    });
  }
  out.sort((a, b) => b.moneyScore - a.moneyScore || a.clusterId.localeCompare(b.clusterId));
  return out;
}

