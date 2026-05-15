import type { PrioritizedOpportunity } from "../types";
import type { GscPageMetric, PerformanceAggregates } from "../performance/types";

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
  for (const t of b) if (a.has(t)) n += 1;
  return n;
}

function gscByPath(pages: readonly GscPageMetric[]): Map<string, GscPageMetric> {
  const m = new Map<string, GscPageMetric>();
  for (const p of pages) m.set(p.path, p);
  return m;
}

/**
 * Boost / penalize opportunities using optional `pageRevenue` RPM joined with GSC traffic on the same path.
 * Does not auto-edit pages - only discovery ranking.
 */
export function applyPageRpmSignals(
  rows: readonly PrioritizedOpportunity[],
  aggregates: PerformanceAggregates | null,
): PrioritizedOpportunity[] {
  const rev = aggregates?.pageRevenue;
  const pages = aggregates?.pages;
  if (!rev?.length || !pages?.length) return [...rows];

  const gsc = gscByPath(pages);
  const bags: { tokens: Set<string>; rpm: number; impressions: number; clicks: number }[] = [];

  for (const r of rev) {
    const g = gsc.get(r.path);
    const impressions = g?.impressions ?? 0;
    const clicks = g?.clicks ?? 0;
    const slug = r.path.replace(/^\//, "").replace(/\//g, " ");
    bags.push({
      tokens: tokenizeForOverlap(slug),
      rpm: r.rpm,
      impressions,
      clicks,
    });
  }

  return rows.map((row) => {
    const kw = tokenizeForOverlap(row.keyword);
    let rpmBoost = 0;
    let rpmPenalty = 0;
    for (const b of bags) {
      const o = overlapScore(kw, b.tokens);
      if (o === 0) continue;
      if (b.rpm >= 12 && b.clicks >= 8 && b.impressions >= 400) {
        rpmBoost += Math.min(12, o * 4);
      }
      if (b.rpm >= 0 && b.rpm < 3 && b.impressions >= 2500) {
        rpmPenalty += Math.min(8, o * 3);
      }
    }
    if (rpmBoost === 0 && rpmPenalty === 0) return row;
    const next = Math.min(100, Math.max(5, row.priority + rpmBoost - rpmPenalty));
    return {
      ...row,
      priority: next,
      rpmBoost: rpmBoost > 0 ? rpmBoost : row.rpmBoost,
      revenuePenalty: rpmPenalty > 0 ? (row.revenuePenalty ?? 0) + rpmPenalty : row.revenuePenalty,
    };
  });
}

export function topPageRevenuePaths(
  aggregates: PerformanceAggregates | null,
  limit = 12,
): Array<{ path: string; rpm: number; earnings?: number; monetizedImpressions?: number }> {
  const rev = aggregates?.pageRevenue;
  if (!rev?.length) return [];
  return [...rev]
    .filter((r) => Number.isFinite(r.rpm))
    .sort((a, b) => b.rpm - a.rpm)
    .slice(0, limit)
    .map((r) => ({
      path: r.path,
      rpm: r.rpm,
      earnings: r.earnings,
      monetizedImpressions: r.monetizedImpressions,
    }));
}
