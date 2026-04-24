import type { GscPageMetric, PerformanceAggregates } from "../performance/types";

export type PagePerformanceRow = {
  path: string;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number | null;
  ctrChangePct: number | null;
  positionDelta: number | null;
  rankingMovement: "up" | "down" | "stable";
};

function ctr(p: GscPageMetric): number {
  if (p.impressions <= 0) return 0;
  return p.clicks / p.impressions;
}

function prevMap(pagesPrevious: readonly GscPageMetric[] | undefined): Map<string, GscPageMetric> {
  const m = new Map<string, GscPageMetric>();
  if (!pagesPrevious) return m;
  for (const p of pagesPrevious) m.set(p.path, p);
  return m;
}

/**
 * Per-page GSC metrics plus period-over-period deltas when `pagesPrevious` exists in aggregates.
 */
export function buildPagePerformanceRows(performance: PerformanceAggregates | null, limit = 40): PagePerformanceRow[] {
  const pages = performance?.pages ?? [];
  const prev = prevMap(performance?.pagesPrevious);
  const rows: PagePerformanceRow[] = [];

  for (const p of pages) {
    const c = ctr(p);
    const pos = p.position;
    const before = prev.get(p.path);
    let ctrChangePct: number | null = null;
    let positionDelta: number | null = null;
    let rankingMovement: PagePerformanceRow["rankingMovement"] = "stable";

    if (before) {
      const prevCtr = ctr(before);
      ctrChangePct = prevCtr > 0 ? Number((((c - prevCtr) / prevCtr) * 100).toFixed(2)) : c > 0 ? 100 : 0;
      if (pos != null && before.position != null) {
        positionDelta = Number((before.position - pos).toFixed(2));
        rankingMovement = positionDelta > 0.15 ? "up" : positionDelta < -0.15 ? "down" : "stable";
      }
    }

    rows.push({
      path: p.path,
      impressions: p.impressions,
      clicks: p.clicks,
      ctr: Number((c * 100).toFixed(3)),
      averagePosition: pos != null && Number.isFinite(pos) ? Number(pos.toFixed(2)) : null,
      ctrChangePct,
      positionDelta,
      rankingMovement,
    });
  }

  return rows
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
    .slice(0, limit);
}
