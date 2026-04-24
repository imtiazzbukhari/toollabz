import type { MoneyPagesSnapshot } from "./money-pages";
import type { RevenueFunnelSnapshot } from "./revenue-funnel";
import type { ClusterMoneyScoreRow } from "./cluster-money-score";

export type PriorityExecutionPlan = {
  build: string[];
  fix: string[];
  scale: string[];
};

export function buildPriorityExecutionPlan(input: {
  funnel: RevenueFunnelSnapshot;
  moneyPages: MoneyPagesSnapshot;
  clusterScores: ClusterMoneyScoreRow[];
}): PriorityExecutionPlan {
  const topCluster = input.clusterScores[0]?.clusterId;
  const drop = input.funnel.dropOffPoints[0];
  const topMoney = input.moneyPages.topEarningPages[0];
  const topConv = input.moneyPages.highestConversionPages[0];
  return {
    build: [
      topMoney ? `Create 2 expansions from ${topMoney.path} idea backlog.` : "Create 2 revenue-intent expansions from top earning pages.",
      topCluster ? `Launch decision/comparison content pair in cluster ${topCluster}.` : "Launch one high-intent cluster pair.",
    ],
    fix: [
      drop ? `Patch ${drop.from}→${drop.to} drop-off via CTA/tool placement and section reorder.` : "Improve top funnel drop-off with UX friction fixes.",
      "Improve snippet + intro alignment on low-CTR high-RPM pages.",
    ],
    scale: [
      topConv ? `Replicate conversion pattern from ${topConv.path} across 3 related pages.` : "Replicate top conversion pattern across related pages.",
      topCluster ? `Activate cluster sprint mode for ${topCluster}.` : "Activate sprint mode for top money cluster.",
    ],
  };
}

