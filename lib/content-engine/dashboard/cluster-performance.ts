import type { PerformanceAggregates } from "../performance/types";
import { TOPIC_CLUSTERS } from "../topic-clusters";
import { clusterIdForPath } from "./cluster-utils";

export type ClusterPerformanceRow = {
  clusterId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number | null;
  rpm: number;
  revenue: number;
  trend7d: number | null;
  trend30d: number | null;
};

export type ClusterPerformanceSnapshot = {
  leaderboard: ClusterPerformanceRow[];
  growthClusters: ClusterPerformanceRow[];
  decliningClusters: ClusterPerformanceRow[];
};

function pctDelta(cur: number, prev: number): number | null {
  if (prev <= 0) return null;
  return ((cur - prev) / prev) * 100;
}

export function buildClusterPerformanceSnapshot(agg: PerformanceAggregates | null): ClusterPerformanceSnapshot {
  const rows = new Map<
    string,
    {
      clusterId: string;
      impressions: number;
      clicks: number;
      posWeighted: number;
      posImpr: number;
      revWeighted: number;
      revImpr: number;
      revenue: number;
      prevClicks: number;
    }
  >();
  for (const c of TOPIC_CLUSTERS) {
    rows.set(c.id, {
      clusterId: c.id,
      impressions: 0,
      clicks: 0,
      posWeighted: 0,
      posImpr: 0,
      revWeighted: 0,
      revImpr: 0,
      revenue: 0,
      prevClicks: 0,
    });
  }

  const revenueByPath = new Map((agg?.pageRevenue ?? []).map((r) => [r.path, r]));

  for (const p of agg?.pages ?? []) {
    const clusterId = clusterIdForPath(p.path);
    if (!clusterId || !rows.has(clusterId)) continue;
    const row = rows.get(clusterId)!;
    row.impressions += p.impressions;
    row.clicks += p.clicks;
    if (typeof p.position === "number" && Number.isFinite(p.position)) {
      row.posWeighted += p.position * p.impressions;
      row.posImpr += p.impressions;
    }
    const rev = revenueByPath.get(p.path);
    if (rev) {
      row.revWeighted += rev.rpm * p.impressions;
      row.revImpr += p.impressions;
      row.revenue += rev.earnings ?? (rev.rpm * p.impressions) / 1000;
    }
  }

  const prevByPath = new Map((agg?.pagesPrevious ?? []).map((p) => [p.path, p]));
  for (const p of agg?.pages ?? []) {
    const clusterId = clusterIdForPath(p.path);
    if (!clusterId || !rows.has(clusterId)) continue;
    const prev = prevByPath.get(p.path);
    if (!prev) continue;
    rows.get(clusterId)!.prevClicks += prev.clicks;
  }

  const materialized: ClusterPerformanceRow[] = [...rows.values()]
    .map((r) => {
      const ctr = r.impressions > 0 ? r.clicks / r.impressions : 0;
      const trend30 = pctDelta(r.clicks, r.prevClicks);
      // If only prior-period snapshot exists, we expose a short-term proxy (half-weighted 30d).
      const trend7 = trend30 == null ? null : trend30 * 0.5;
      return {
        clusterId: r.clusterId,
        impressions: r.impressions,
        clicks: r.clicks,
        ctr,
        avgPosition: r.posImpr > 0 ? r.posWeighted / r.posImpr : null,
        rpm: r.revImpr > 0 ? r.revWeighted / r.revImpr : 0,
        revenue: r.revenue,
        trend7d: trend7,
        trend30d: trend30,
      };
    })
    .filter((r) => r.impressions > 0)
    .sort((a, b) => b.revenue - a.revenue || b.clicks - a.clicks);

  const growthClusters = materialized
    .filter((r) => (r.trend30d ?? -999) > 6)
    .sort((a, b) => (b.trend30d ?? 0) - (a.trend30d ?? 0))
    .slice(0, 4);
  const decliningClusters = materialized
    .filter((r) => (r.trend30d ?? 999) < -6)
    .sort((a, b) => (a.trend30d ?? 0) - (b.trend30d ?? 0))
    .slice(0, 4);

  return { leaderboard: materialized, growthClusters, decliningClusters };
}

