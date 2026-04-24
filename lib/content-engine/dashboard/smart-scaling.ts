import { TOPIC_CLUSTERS } from "../topic-clusters";
import { buildAdvancedRevenueOptimization } from "./revenue-optimization";
import { buildConversionTrackingSnapshot } from "./conversion-tracking";
import type { PerformanceAggregates } from "../performance/types";
import type { BehaviorAggregates } from "../growth/behavior-types";

export type SmartScalingRow = {
  clusterId: string;
  scaleDecision: "scale" | "hold";
  reasons: string[];
};

export function buildSmartScalingRecommendations(
  perf: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
): SmartScalingRow[] {
  const rev = buildAdvancedRevenueOptimization(perf, behavior, 300);
  const conv = buildConversionTrackingSnapshot(behavior, 300);
  const out: SmartScalingRow[] = [];
  for (const c of TOPIC_CLUSTERS) {
    const clusterRev = rev.pageScores.filter((p) => p.clusterId === c.id);
    const clusterConv = conv.pages.filter((p) => p.path.includes(c.pillarToolSlug) || p.path.includes(c.id.split("-")[0] ?? ""));
    const avgRev = clusterRev.length ? clusterRev.reduce((n, p) => n + p.trueRevenueScore, 0) / clusterRev.length : 0;
    const avgConv = clusterConv.length ? clusterConv.reduce((n, p) => n + p.conversionRate, 0) / clusterConv.length : 0;
    const scale = avgRev >= 45 && avgConv >= 0.05;
    out.push({
      clusterId: c.id,
      scaleDecision: scale ? "scale" : "hold",
      reasons: [
        `avg true revenue score ${avgRev.toFixed(1)}`,
        `avg conversion rate ${(avgConv * 100).toFixed(2)}%`,
      ],
    });
  }
  return out.sort((a, b) => (a.scaleDecision === b.scaleDecision ? a.clusterId.localeCompare(b.clusterId) : a.scaleDecision === "scale" ? -1 : 1));
}

