import type { PrioritizedOpportunity } from "../types";
import type { GscPageMetric, PerformanceAggregates } from "./types";

function slugFromBlogPath(path: string): string | null {
  const m = path.replace(/\/+$/, "").match(/\/blog\/([^/?#]+)$/i);
  return m?.[1]?.toLowerCase() ?? null;
}

function tokenizeForOverlap(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of a) if (b.has(t)) n += 1;
  return n;
}

/** Strong pages: enough signal to infer topical demand (tunable). */
function isStrongPage(p: GscPageMetric): boolean {
  return p.clicks >= 8 || p.impressions >= 400;
}

/**
 * Boost opportunities whose keywords overlap high-performing blog slugs / paths.
 */
export function applyGscBoostToPrioritized(
  rows: readonly PrioritizedOpportunity[],
  aggregates: PerformanceAggregates | null,
): PrioritizedOpportunity[] {
  if (!aggregates?.pages?.length) return [...rows];

  const strong = aggregates.pages.filter(isStrongPage);
  const slugTokens = new Map<string, Set<string>>();
  for (const p of strong) {
    const slug = slugFromBlogPath(p.path);
    if (!slug) continue;
    slugTokens.set(slug, tokenizeForOverlap(slug.replace(/-/g, " ")));
  }

  const scored = rows.map((row) => {
    const kwTokens = tokenizeForOverlap(row.keyword);
    let boost = 0;
    for (const [, tokens] of slugTokens) {
      const o = overlapScore(kwTokens, tokens);
      if (o > 0) boost += Math.min(18, o * 6);
    }
    const priority = Math.min(100, row.priority + Math.round(boost));
    return {
      ...row,
      priority,
      performanceBoost: boost > 0 ? Math.round(boost) : undefined,
    };
  });

  scored.sort((a, b) => b.priority - a.priority || a.keyword.localeCompare(b.keyword));
  return scored;
}
