import type { ToolPerformanceRow } from "./tool-performance-engine";

export type ToolRoiRow = {
  slug: string;
  path: string;
  traffic: number;
  conversionsProxy: number;
  revenueUsd: number;
  roiScore: number;
  scalingSuggestion: string;
};

/**
 * ROI score: revenue efficiency vs traffic with conversion quality from tool performance rows.
 */
export function buildToolRoiRows(tools: readonly ToolPerformanceRow[], limit = 16): ToolRoiRow[] {
  return tools
    .map((t) => {
      const traffic = t.clicks + Math.round(t.impressions / 200);
      const conversionsProxy = t.toolToActionRate / 100;
      const revenue = t.revenueContributionUsd;
      const roiScore = Math.min(
        100,
        Math.round(revenue * 4 + conversionsProxy * 180 + (t.ctr > 2.5 ? 12 : 0) - t.weaknessScore * 0.35),
      );
      const scalingSuggestion =
        revenue < 20 && t.impressions > 2000
          ? "Scale supporting comparison content + internal links from high-impression blog hubs."
          : conversionsProxy < 0.12
            ? "Improve post-result CTAs and add decision-stage FAQ to lift tool→action rate."
            : "Maintain; test new long-tail variants and programmatic expansions in-cluster.";
      return {
        slug: t.slug,
        path: t.path,
        traffic,
        conversionsProxy: Number(conversionsProxy.toFixed(3)),
        revenueUsd: revenue,
        roiScore,
        scalingSuggestion,
      };
    })
    .sort((a, b) => b.roiScore - a.roiScore)
    .slice(0, limit);
}
