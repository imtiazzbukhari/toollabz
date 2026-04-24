import type { BehaviorAggregates } from "../growth/behavior-types";
import type { PerformanceAggregates } from "../performance/types";
import { buildAdvancedRevenueOptimization } from "./revenue-optimization";

export type MoneyPageRow = {
  path: string;
  reason: "top_earning" | "high_conversion";
  rpm: number;
  conversionRate: number;
  trueRevenueScore: number;
  expansionIdeas: string[];
};

export type MoneyPagesSnapshot = {
  topEarningPages: MoneyPageRow[];
  highestConversionPages: MoneyPageRow[];
};

function ideasForPath(path: string): string[] {
  const seed = path.replace(/^\/(blog|tools)\//, "").replace(/-/g, " ").trim();
  return [
    `${seed}: advanced scenario guide`,
    `${seed}: comparison and alternatives`,
    `${seed}: conversion-focused implementation guide`,
    `${seed}: ROI calculator walkthrough with decision matrix`,
  ];
}

export function buildMoneyPagesSnapshot(
  performance: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
): MoneyPagesSnapshot {
  const rev = buildAdvancedRevenueOptimization(performance, behavior, 200);
  const topEarningPages = rev.pageScores
    .filter((r) => r.rpm >= 10 || r.trueRevenueScore >= 60)
    .slice(0, 10)
    .map((r) => ({
      path: r.path,
      reason: "top_earning" as const,
      rpm: r.rpm,
      conversionRate: r.conversionRate,
      trueRevenueScore: r.trueRevenueScore,
      expansionIdeas: ideasForPath(r.path),
    }));
  const highestConversionPages = rev.pageScores
    .filter((r) => r.conversionRate >= 0.08 || r.trueRevenueScore >= 65)
    .slice(0, 10)
    .map((r) => ({
      path: r.path,
      reason: "high_conversion" as const,
      rpm: r.rpm,
      conversionRate: r.conversionRate,
      trueRevenueScore: r.trueRevenueScore,
      expansionIdeas: ideasForPath(r.path),
    }));
  return { topEarningPages, highestConversionPages };
}

