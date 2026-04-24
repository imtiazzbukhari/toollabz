import type { PerformanceAggregates } from "../performance/types";

export type TrendPoint = { label: string; clicks: number; impressions: number; ctr: number };

export type GscSiteTrends = {
  period7d: TrendPoint[];
  period30d: TrendPoint[];
  /** When true, series is linearly interpolated between current and prior aggregate totals (no daily export yet). */
  interpolated: boolean;
  note: string;
};

function sumPages(pages: readonly { clicks: number; impressions: number }[]) {
  return pages.reduce(
    (acc, p) => {
      acc.clicks += p.clicks;
      acc.impressions += p.impressions;
      return acc;
    },
    { clicks: 0, impressions: 0 },
  );
}

function interpolateSeries(from: TrendPoint, to: TrendPoint, steps: number): TrendPoint[] {
  const out: TrendPoint[] = [];
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 1 : i / (steps - 1);
    const clicks = Math.round(from.clicks + (to.clicks - from.clicks) * t);
    const impressions = Math.round(from.impressions + (to.impressions - from.impressions) * t);
    const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(3)) : 0;
    out.push({
      label: `W${i + 1}`,
      clicks,
      impressions,
      ctr,
    });
  }
  return out;
}

/**
 * Site-wide trend lines for dashboard charts. Uses `pages` vs `pagesPrevious` as two anchors when available.
 */
export function buildGscSiteTrends(performance: PerformanceAggregates | null): GscSiteTrends {
  const pages = performance?.pages ?? [];
  const prevPages = performance?.pagesPrevious ?? [];

  if (!pages.length) {
    return {
      period7d: [],
      period30d: [],
      interpolated: false,
      note: "No GSC aggregates loaded. Import GSC export into performance aggregates (see aggregates.example.json).",
    };
  }

  const current = sumPages(pages);
  const currentCtr = current.impressions > 0 ? (current.clicks / current.impressions) * 100 : 0;
  const end: TrendPoint = {
    label: "current",
    clicks: current.clicks,
    impressions: current.impressions,
    ctr: Number(currentCtr.toFixed(3)),
  };

  if (!prevPages.length) {
    const flat = Array.from({ length: 7 }, (_, i) => ({
      label: `D${i + 1}`,
      clicks: Math.round(current.clicks / 7),
      impressions: Math.round(current.impressions / 7),
      ctr: Number(currentCtr.toFixed(3)),
    }));
    return {
      period7d: flat,
      period30d: Array.from({ length: 6 }, (_, i) => ({
        label: `M${i + 1}`,
        clicks: Math.round(current.clicks / 6),
        impressions: Math.round(current.impressions / 6),
        ctr: Number(currentCtr.toFixed(3)),
      })),
      interpolated: true,
      note: "Only current period present; trend is evenly distributed for visualization until a prior period is imported.",
    };
  }

  const prev = sumPages(prevPages);
  const prevCtr = prev.impressions > 0 ? (prev.clicks / prev.impressions) * 100 : 0;
  const start: TrendPoint = {
    label: "prior",
    clicks: prev.clicks,
    impressions: prev.impressions,
    ctr: Number(prevCtr.toFixed(3)),
  };

  return {
    period7d: interpolateSeries(start, end, 7),
    period30d: interpolateSeries(start, end, 6),
    interpolated: true,
    note: "Trend derived from current vs prior GSC import window (linear interpolation between aggregate totals).",
  };
}
