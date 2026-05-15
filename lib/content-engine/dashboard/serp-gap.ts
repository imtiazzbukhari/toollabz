import type { GscPageMetric } from "../performance/types";

export type SerpGapRow = {
  path: string;
  suggestions: string[];
};

function ctr(p: GscPageMetric): number {
  return p.impressions > 0 ? p.clicks / p.impressions : 0;
}

/**
 * Section-level ideas for URLs with demand but weak CTR (no third-party SERP scrape - safe default).
 */
export function buildSerpGapSuggestions(pages: readonly GscPageMetric[] | undefined, max = 8): SerpGapRow[] {
  if (!pages?.length) return [];
  const rows = pages
    .filter((p) => (p.path.startsWith("/blog/") || p.path.startsWith("/tools/")) && p.impressions >= 600 && ctr(p) < 0.02)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, max);

  return rows.map((p) => ({
    path: p.path,
    suggestions: [
      "Compare top 3 ranking URLs for this query cluster: add missing comparison table or FAQ they cover.",
      "Add explicit 'Who this is for / not for' section to sharpen intent match.",
      "Add numeric example + counterexample block (reduces generic bounce patterns).",
    ],
  }));
}
