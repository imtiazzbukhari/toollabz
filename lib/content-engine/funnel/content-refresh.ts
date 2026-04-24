import type { GscPageMetric, PerformanceAggregates } from "../performance/types";

export type RefreshCandidate = {
  path: string;
  signal: "low_ctr" | "declining_clicks";
  clicks: number;
  impressions: number;
  ctr: number;
  suggestions: readonly string[];
};

function ctr(p: GscPageMetric): number {
  if (p.impressions <= 0) return 0;
  return p.clicks / p.impressions;
}

function suggestionsFor(path: string, signal: RefreshCandidate["signal"]): string[] {
  const base = [
    "Rewrite the first 120–180 words with a sharper promise + one concrete outcome.",
    "Refresh numeric examples (rates, amounts, timelines) to current plausible ranges.",
    "Add or tighten 2 FAQ pairs that match real 'People Also Ask' style questions.",
  ];
  if (signal === "low_ctr") {
    return [...base, "Improve title/H1 alignment with the winning query; reduce generic phrasing in meta-like opener."];
  }
  return [...base, "Check for topic drift vs newer competing pages; add a short 'what changed' section if regulations or norms shifted."];
}

/**
 * Pages that likely need a content refresh (editorial queue — does not auto-edit).
 */
export function findRefreshCandidates(aggregates: PerformanceAggregates | null, max = 12): RefreshCandidate[] {
  if (!aggregates?.pages?.length) return [];
  const prevMap = new Map<string, number>();
  if (aggregates.pagesPrevious?.length) {
    for (const p of aggregates.pagesPrevious) {
      prevMap.set(p.path, p.clicks);
    }
  }

  const out: RefreshCandidate[] = [];

  for (const p of aggregates.pages) {
    if (!p.path.startsWith("/blog/") && !p.path.startsWith("/tools/")) continue;
    const c = ctr(p);
    if (p.impressions >= 1200 && c < 0.018 && p.clicks >= 3) {
      out.push({
        path: p.path,
        signal: "low_ctr",
        clicks: p.clicks,
        impressions: p.impressions,
        ctr: c,
        suggestions: suggestionsFor(p.path, "low_ctr"),
      });
    } else if (prevMap.size > 0) {
      const prevClicks = prevMap.get(p.path);
      if (prevClicks != null && p.impressions >= 400 && p.clicks < prevClicks * 0.65 && prevClicks >= 8) {
        out.push({
          path: p.path,
          signal: "declining_clicks",
          clicks: p.clicks,
          impressions: p.impressions,
          ctr: c,
          suggestions: suggestionsFor(p.path, "declining_clicks"),
        });
      }
    }
  }

  out.sort((a, b) => b.impressions - a.impressions || b.ctr - a.ctr);
  return out.slice(0, max);
}
