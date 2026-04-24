import type { GscPageMetric } from "../performance/types";

export type PerformanceHintRow = {
  path: string;
  hints: string[];
};

/**
 * Editorial CWV / perf checklist (no RUM). Pair with field data or CrUX when available.
 */
export function buildPerformanceHintsForTopPages(pages: readonly GscPageMetric[] | undefined, max = 8): PerformanceHintRow[] {
  if (!pages?.length) return [];
  const sorted = [...pages].sort((a, b) => b.impressions - a.impressions);
  const out: PerformanceHintRow[] = [];
  for (const p of sorted.slice(0, max)) {
    if (!p.path.startsWith("/tools/") && !p.path.startsWith("/blog/")) continue;
    const hints = [
      "Defer below-the-fold images; keep LCP element small on mobile.",
      "Avoid layout shift on ad slots: reserve min-height and avoid injecting banners above first H2.",
      "Split very long MDX into accordions or anchor sections to reduce main-thread HTML parse cost.",
    ];
    if (p.impressions > 8000) {
      hints.push("High traffic: prioritize static generation + CDN cache headers for this template.");
    }
    out.push({ path: p.path, hints });
  }
  return out;
}
