import type { ClusterMoneyScoreRow } from "./cluster-money-score";
import type { WeeklyDecisionAction } from "./weekly-decision-engine";
import type { PriorityExecutionPlan } from "./priority-execution-plan";

export type BusinessCommandCenter = {
  weeklyActions: WeeklyDecisionAction[];
  expectedRevenueImpactUsd: number;
  risks: string[];
  focusCluster: string | null;
  executionPlan: PriorityExecutionPlan;
};

export function buildBusinessCommandCenter(input: {
  weeklyActions: WeeklyDecisionAction[];
  clusterScores: ClusterMoneyScoreRow[];
  executionPlan: PriorityExecutionPlan;
}): BusinessCommandCenter {
  const expectedRevenueImpactUsd = Number(
    input.weeklyActions.reduce((n, a) => n + a.revenueImpact.expectedRevenueIncreaseUsd, 0).toFixed(2),
  );
  const focusCluster = input.clusterScores[0]?.clusterId ?? null;
  const risks = [
    "Over-focusing on monetization can reduce trust if informational quality slips.",
    "Funnel fixes require consistent event instrumentation to avoid false positives.",
    "Cluster sprint can starve secondary clusters; review weekly.",
  ];
  return {
    weeklyActions: input.weeklyActions,
    expectedRevenueImpactUsd,
    risks,
    focusCluster,
    executionPlan: input.executionPlan,
  };
}

