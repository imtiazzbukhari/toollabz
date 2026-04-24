import type { PerformanceAggregates } from "../performance/types";
import { clusterIdForPath } from "./cluster-utils";

export type RevenueGraphPoint = { label: string; earnings: number; rpmAvg: number };

export type ClusterRevenueRow = {
  clusterId: string;
  earningsUsd: number;
  rpmWeighted: number;
  pageCount: number;
};

/**
 * Revenue graph + per-cluster rollups from merged `pageRevenue` + GSC paths.
 */
export function buildRevenueTrackingSnapshot(performance: PerformanceAggregates | null): {
  graph: RevenueGraphPoint[];
  byCluster: ClusterRevenueRow[];
  source: string;
} {
  const rev = performance?.pageRevenue ?? [];
  if (!rev.length) {
    return {
      graph: [],
      byCluster: [],
      source: performance?.source ?? "Import AdSense page export and merge via `npm run adsense:merge-csv` into aggregates.json.",
    };
  }

  const byCluster = new Map<string, { earnings: number; rpmSum: number; n: number }>();
  for (const r of rev) {
    const cid = clusterIdForPath(r.path) ?? "unclustered";
    const cur = byCluster.get(cid) ?? { earnings: 0, rpmSum: 0, n: 0 };
    cur.earnings += r.earnings ?? 0;
    cur.rpmSum += r.rpm;
    cur.n += 1;
    byCluster.set(cid, cur);
  }

  const clusterRows: ClusterRevenueRow[] = [...byCluster.entries()]
    .map(([clusterId, v]) => ({
      clusterId,
      earningsUsd: Number(v.earnings.toFixed(2)),
      rpmWeighted: v.n > 0 ? Number((v.rpmSum / v.n).toFixed(2)) : 0,
      pageCount: v.n,
    }))
    .sort((a, b) => b.earningsUsd - a.earningsUsd);

  const sortedPaths = [...rev].sort((a, b) => (b.earnings ?? 0) - (a.earnings ?? 0));
  const graph: RevenueGraphPoint[] = sortedPaths.slice(0, 10).map((r) => ({
    label: r.path.replace(/^\/tools\//, "T:").replace(/^\/blog\//, "B:").slice(0, 22),
    earnings: Number((r.earnings ?? 0).toFixed(2)),
    rpmAvg: r.rpm,
  }));

  if (graph.length === 1) {
    graph.push({ label: "portfolio", earnings: Number(rev.reduce((n, x) => n + (x.earnings ?? 0), 0).toFixed(2)), rpmAvg: rev[0]!.rpm });
  }

  return {
    graph,
    byCluster: clusterRows,
    source: performance?.source ?? "pageRevenue from merged GSC + AdSense export",
  };
}
