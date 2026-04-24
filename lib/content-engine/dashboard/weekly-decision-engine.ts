import type { MoneyPagesSnapshot } from "./money-pages";
import type { RevenueFunnelSnapshot } from "./revenue-funnel";
import type { ClusterMoneyScoreRow } from "./cluster-money-score";
import { estimateRevenueImpact, type RevenueImpactEstimate } from "./revenue-impact-estimator";

export type WeeklyDecisionAction = {
  action: string;
  metricTarget: string;
  revenueImpact: RevenueImpactEstimate;
  type: "fix" | "build" | "scale";
};

export function buildWeeklyDecisionActions(input: {
  funnel: RevenueFunnelSnapshot;
  moneyPages: MoneyPagesSnapshot;
  clusterScores: ClusterMoneyScoreRow[];
  baselineRevenue: number;
}): WeeklyDecisionAction[] {
  const out: WeeklyDecisionAction[] = [];

  const topDrop = input.funnel.dropOffPoints[0];
  if (topDrop) {
    out.push({
      action: `Fix funnel drop-off ${topDrop.from} → ${topDrop.to} on top 3 money pages with stronger tool CTA and friction fixes.`,
      metricTarget: `Reduce drop-off by 12% this week.`,
      revenueImpact: estimateRevenueImpact({ baselineRevenue: input.baselineRevenue, liftPct: 9, confidenceHint: 11 }),
      type: "fix",
    });
  }

  const topMoney = input.moneyPages.topEarningPages[0];
  if (topMoney) {
    out.push({
      action: `Ship 2 expansion pieces from ${topMoney.path} idea set and interlink back to the money page.`,
      metricTarget: `+15% clicks to ${topMoney.path} cluster hub.`,
      revenueImpact: estimateRevenueImpact({ baselineRevenue: input.baselineRevenue, liftPct: 12, confidenceHint: 13 }),
      type: "build",
    });
  }

  const topConv = input.moneyPages.highestConversionPages[0];
  if (topConv) {
    out.push({
      action: `Clone high-converting conversion pattern from ${topConv.path} into 3 similar intent pages.`,
      metricTarget: `+2.0pp conversion rate on target pages.`,
      revenueImpact: estimateRevenueImpact({ baselineRevenue: input.baselineRevenue, liftPct: 10, confidenceHint: 10 }),
      type: "scale",
    });
  }

  const bestCluster = input.clusterScores[0];
  if (bestCluster) {
    out.push({
      action: `Focus cluster sprint on ${bestCluster.clusterId}: publish 3 decision-intent assets and 1 comparison piece.`,
      metricTarget: `+10% cluster revenue potential signal.`,
      revenueImpact: estimateRevenueImpact({ baselineRevenue: input.baselineRevenue, liftPct: 11, confidenceHint: 12 }),
      type: "scale",
    });
  }

  out.push({
    action: "Refresh title/meta + first-screen CTA on 5 low-CTR high-RPM pages from execution queue.",
    metricTarget: "+0.4pp CTR average uplift.",
    revenueImpact: estimateRevenueImpact({ baselineRevenue: input.baselineRevenue, liftPct: 8, confidenceHint: 9 }),
    type: "fix",
  });

  return out.slice(0, 5);
}

