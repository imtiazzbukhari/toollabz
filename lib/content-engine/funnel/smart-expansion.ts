import type { GscPageMetric } from "../performance/types";

export type ExpansionIdea = {
  kind: "deep_guide" | "comparison" | "faq_expansion";
  titleHint: string;
  primaryKeywordHint: string;
  rationale: string;
};

function slugFromPath(path: string): string {
  const m = path.replace(/\/+$/, "").match(/\/(?:blog|tools)\/([^/?#]+)$/i);
  return m?.[1] ?? path;
}

/**
 * When a URL shows strong demand, suggest follow-on pages (human/PR pipeline — not auto-published).
 */
export function suggestExpansionsForUrl(path: string, metric: GscPageMetric): ExpansionIdea[] {
  const slug = slugFromPath(path);
  const ctr = metric.impressions > 0 ? metric.clicks / metric.impressions : 0;
  const strong = metric.clicks >= 25 || (metric.impressions >= 2000 && ctr >= 0.03);
  if (!strong) return [];

  const base = slug.replace(/-/g, " ");
  const ideas: ExpansionIdea[] = [
    {
      kind: "deep_guide",
      titleHint: `Deeper guide: edge cases and checklists for “${base}”`,
      primaryKeywordHint: `${base} advanced checklist`,
      rationale: "Strong traffic: capture long-tail depth and reduce pogo-sticking.",
    },
    {
      kind: "comparison",
      titleHint: `Comparison: alternatives and tradeoffs for “${base}”`,
      primaryKeywordHint: `${base} vs alternatives`,
      rationale: "Capture comparison intent that often monetizes adjacent queries.",
    },
    {
      kind: "faq_expansion",
      titleHint: `FAQ expansion: real objections readers still have about “${base}”`,
      primaryKeywordHint: `${base} common questions`,
      rationale: "FAQ depth supports featured snippets and on-page engagement.",
    },
  ];
  return ideas;
}

export function buildExpansionQueueFromAggregates(
  pages: readonly GscPageMetric[],
  limitPages = 8,
): Array<{ path: string; metric: GscPageMetric; ideas: ExpansionIdea[] }> {
  const sorted = [...pages].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);
  const out: Array<{ path: string; metric: GscPageMetric; ideas: ExpansionIdea[] }> = [];
  for (const p of sorted) {
    if (out.length >= limitPages) break;
    const ideas = suggestExpansionsForUrl(p.path, p);
    if (ideas.length === 0) continue;
    out.push({ path: p.path, metric: p, ideas });
  }
  return out;
}
