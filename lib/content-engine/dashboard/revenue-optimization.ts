import type { BehaviorAggregates } from "../growth/behavior-types";
import type { PerformanceAggregates } from "../performance/types";
import { buildConversionTrackingSnapshot } from "./conversion-tracking";
import { clusterIdForPath } from "./cluster-utils";

export type PageRevenueScoreRow = {
  path: string;
  clusterId: string | null;
  rpm: number;
  conversionRate: number;
  engagement: number;
  trueRevenueScore: number;
};

export type RevenueOptimizationSnapshot = {
  pageScores: PageRevenueScoreRow[];
  topRevenuePages: PageRevenueScoreRow[];
};

export function buildAdvancedRevenueOptimization(
  perf: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
  max = 30,
): RevenueOptimizationSnapshot {
  const conversionByPath = new Map(buildConversionTrackingSnapshot(behavior, 200).pages.map((p) => [p.path, p]));
  const revByPath = new Map((perf?.pageRevenue ?? []).map((r) => [r.path, r]));
  const out: PageRevenueScoreRow[] = [];
  for (const p of perf?.pages ?? []) {
    const rev = revByPath.get(p.path);
    const conv = conversionByPath.get(p.path);
    const b = behavior?.byPath[p.path];
    const rpm = rev?.rpm ?? 0;
    const conversionRate = conv?.conversionRate ?? 0;
    const engagement = b ? b.avgMaxScroll * 0.5 + Math.min(1, b.avgActiveMs / 90_000) * 0.5 : 0;
    const trueRevenueScore = Math.min(100, Math.round(rpm * 2.5 + conversionRate * 420 + engagement * 22));
    out.push({
      path: p.path,
      clusterId: clusterIdForPath(p.path),
      rpm,
      conversionRate,
      engagement,
      trueRevenueScore,
    });
  }
  out.sort((a, b) => b.trueRevenueScore - a.trueRevenueScore || a.path.localeCompare(b.path));
  return { pageScores: out.slice(0, max), topRevenuePages: out.slice(0, 10) };
}

