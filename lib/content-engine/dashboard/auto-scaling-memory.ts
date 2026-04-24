import type { PerformanceAggregates } from "../performance/types";
import { clusterIdForPath } from "./cluster-utils";
import type { PatternSnapshot } from "./pattern-detection";
import { buildPageTypeClassification } from "./page-type-classifier";

export type AutoScalingOpportunity = {
  sourcePattern: string;
  targetPath: string;
  recommendedFixType: "rewrite" | "link" | "cta" | "ad_placement";
  reason: string;
};

export function buildAutoScalingOpportunities(
  patterns: PatternSnapshot,
  performance: PerformanceAggregates | null,
  max = 20,
): AutoScalingOpportunity[] {
  const pages = performance?.pages ?? [];
  const pageTypes = new Map(buildPageTypeClassification(pages.map((p) => p.path), 800).map((r) => [r.path, r.type]));
  const bestAction = patterns.highRoiActionTypes.find((p) => p.performanceLabel === "high_roi");
  const bestPageType = patterns.highRoiPageTypes.find((p) => p.performanceLabel === "high_roi");
  const bestCluster = patterns.highRoiClusters.find((p) => p.performanceLabel === "high_roi" && p.key !== "unclustered");
  if (!bestAction || !bestPageType) return [];

  const out: AutoScalingOpportunity[] = [];
  for (const p of pages) {
    const type = pageTypes.get(p.path);
    const clusterId = clusterIdForPath(p.path);
    const sameType = type === bestPageType.key;
    const sameCluster = bestCluster ? clusterId === bestCluster.key : false;
    if (!sameType && !sameCluster) continue;
    if (p.impressions < 900) continue;
    out.push({
      sourcePattern: `${bestAction.key} on ${bestPageType.key}${bestCluster ? ` in ${bestCluster.key}` : ""}`,
      targetPath: p.path,
      recommendedFixType: bestAction.key as AutoScalingOpportunity["recommendedFixType"],
      reason: sameType && sameCluster ? "Matches winning page type and cluster." : sameType ? "Matches winning page type." : "Matches winning cluster.",
    });
  }
  return out.slice(0, max);
}

