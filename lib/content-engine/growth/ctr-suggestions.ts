import type { GscPageMetric } from "../performance/types";

export type SerpVariantSuggestion = {
  variant: "A" | "B" | "C";
  title: string;
  metaDescription: string;
  rationale: string;
};

function slugToPhrase(path: string): string {
  const seg = path.replace(/\/+$/, "").split("/").pop() ?? "";
  return seg.replace(/-/g, " ").trim() || "this page";
}

function ctr(m: GscPageMetric): number {
  return m.impressions > 0 ? m.clicks / m.impressions : 0;
}

/**
 * A/B/C style SERP copy ideas for high-impression, low-CTR URLs (editorial; never auto-applied).
 */
export function suggestSerpVariantsForPage(metric: GscPageMetric): SerpVariantSuggestion[] | null {
  const c = ctr(metric);
  if (metric.impressions < 800 || c >= 0.022 || metric.clicks < 2) return null;
  const topic = slugToPhrase(metric.path);
  const titleCase = topic.replace(/\b\w/g, (x) => x.toUpperCase());

  return [
    {
      variant: "A",
      title: `${titleCase}: what to check first (with examples)`,
      metaDescription: `Walk through ${topic} with plain-language steps, realistic numbers, and common mistakes, so you leave with a clear decision.`,
      rationale: "Adds specificity + outcome; often lifts CTR vs generic phrasing.",
    },
    {
      variant: "B",
      title: `${titleCase} explained in under 5 minutes`,
      metaDescription: `Short, practical ${topic} guide: definitions, a quick checklist, and what to do next, built for scanning on mobile.`,
      rationale: "Time-bound promise + format hint can improve SERP relevance.",
    },
    {
      variant: "C",
      title: `Is ${topic} costing you money? A practical checklist`,
      metaDescription: `Use this checklist for ${topic}: where leaks hide, how to sanity-check results, and when to use a calculator vs rules of thumb.`,
      rationale: "Loss aversion + checklist framing; test against brand tone before shipping.",
    },
  ];
}

export function buildCtrOptimizationQueue(
  pages: readonly GscPageMetric[],
  max = 15,
): Array<{ path: string; impressions: number; ctr: number; variants: SerpVariantSuggestion[] }> {
  const out: Array<{ path: string; impressions: number; ctr: number; variants: SerpVariantSuggestion[] }> = [];
  for (const p of pages) {
    if (!p.path.startsWith("/blog/") && !p.path.startsWith("/tools/")) continue;
    const variants = suggestSerpVariantsForPage(p);
    if (!variants) continue;
    out.push({ path: p.path, impressions: p.impressions, ctr: ctr(p), variants });
  }
  out.sort((a, b) => b.impressions - a.impressions);
  return out.slice(0, max);
}
