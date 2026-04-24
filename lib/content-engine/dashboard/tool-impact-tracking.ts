import type { PerformanceAggregates } from "../performance/types";
import type { GscPageMetric } from "../performance/types";
import type { ToolPerformanceRow } from "./tool-performance-engine";

export type ToolImpactRow = {
  slug: string;
  path: string;
  trafficChangePct: number | null;
  clicksChangePct: number | null;
  impressionsChangePct: number | null;
  /** Reserved until aggregates store a prior revenue snapshot per path. */
  revenueChangeUsd: number | null;
  rpmChange: number | null;
  note: string;
};

function n(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return 0;
}

function prevMap(pagesPrevious: readonly GscPageMetric[] | undefined) {
  const m = new Map<string, { clicks: number; impressions: number }>();
  if (!pagesPrevious) return m;
  for (const p of pagesPrevious) m.set(p.path, { clicks: n(p.clicks), impressions: n(p.impressions) });
  return m;
}

/**
 * Period-over-period deltas for tools when `pagesPrevious` exists in aggregates.
 * Revenue deltas stay null until a second revenue snapshot is modeled (fail-safe).
 */
export function buildToolImpactRows(
  topTools: readonly ToolPerformanceRow[],
  performance: PerformanceAggregates | null,
  limit = 16,
): ToolImpactRow[] {
  const prev = prevMap(performance?.pagesPrevious);
  const pages = performance?.pages ?? [];
  const pageByPath = new Map(pages.map((p) => [p.path, p]));

  const out: ToolImpactRow[] = [];
  for (const t of topTools.slice(0, limit)) {
    const cur = pageByPath.get(t.path);
    const before = prev.get(t.path);
    const hasPrev = before != null && (before.clicks > 0 || before.impressions > 0);

    const clicksNow = cur ? n(cur.clicks) : t.clicks;
    const imprNow = cur ? n(cur.impressions) : t.impressions;

    const clicksChangePct = hasPrev && before!.clicks > 0 ? Number((((clicksNow - before!.clicks) / before!.clicks) * 100).toFixed(1)) : null;
    const impressionsChangePct =
      hasPrev && before!.impressions > 0 ? Number((((imprNow - before!.impressions) / before!.impressions) * 100).toFixed(1)) : null;
    const trafficChangePct =
      clicksChangePct != null && impressionsChangePct != null
        ? Number(((clicksChangePct + impressionsChangePct) / 2).toFixed(1))
        : clicksChangePct ?? impressionsChangePct;

    out.push({
      slug: t.slug,
      path: t.path,
      trafficChangePct,
      clicksChangePct,
      impressionsChangePct,
      revenueChangeUsd: null,
      rpmChange: null,
      note: hasPrev ? "GSC deltas vs pagesPrevious." : "Import a prior GSC window as pagesPrevious to unlock tool traffic deltas.",
    });
  }
  return out;
}
