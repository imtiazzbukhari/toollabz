import type { WeeklyDecisionAction } from "./weekly-decision-engine";
import type { MonetizationScorecard } from "./monetization-scorecard";
import type { PerformanceAggregates } from "../performance/types";
import type { BehaviorAggregates } from "../growth/behavior-types";

export type SmartDecisionAction = {
  id: string;
  title: string;
  type: "revenue" | "traffic" | "authority" | "quality";
  expectedTrafficGainPct: number;
  expectedRevenueGainUsd: number;
  confidence: number;
  sources: string[];
  /** Filled when merged with execution store in dashboard snapshot. */
  executionStatus?: "pending" | "approved" | "executed";
  sprintQueued?: boolean;
  /** Applied from execution learning loop (1 = neutral). */
  learningMultiplier?: number;
};

function stableActionId(prefix: string, parts: readonly string[]): string {
  const s = parts.join("|");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return `${prefix}_${Math.abs(h).toString(36)}`;
}

function estimateTrafficFromPath(performance: PerformanceAggregates | null, path: string): number {
  const p = performance?.pages.find((x) => x.path === path);
  return p?.clicks ?? 0;
}

/**
 * Upgraded decision layer: merges monetization scorecard + weekly engine with explicit traffic/revenue estimates.
 */
export function buildSmartDecisionActions(input: {
  scorecard: MonetizationScorecard;
  weekly: readonly WeeklyDecisionAction[];
  performance: PerformanceAggregates | null;
  behavior: BehaviorAggregates | null;
  max?: number;
}): SmartDecisionAction[] {
  const out: SmartDecisionAction[] = [];

  for (const a of input.scorecard.actions.slice(0, 5)) {
    const clicks = estimateTrafficFromPath(input.performance, a.targetPage);
    const b = input.behavior?.byPath[a.targetPage];
    const engagementLift = b && b.avgMaxScroll < 0.45 ? 8 : 5;
    const expectedTrafficGainPct = Math.min(35, 6 + engagementLift + (clicks > 40 ? 6 : 0));
    out.push({
      id: stableActionId("sc", [a.targetPage, a.exactFix]),
      title: `${a.exactFix.toUpperCase()} on ${a.targetPage}`,
      type: "revenue",
      expectedTrafficGainPct,
      expectedRevenueGainUsd: a.expectedRevenueImpactUsd,
      confidence: a.confidence === "high" ? 0.82 : a.confidence === "medium" ? 0.68 : 0.52,
      sources: ["monetization_scorecard", "gsc_pages", input.behavior ? "behavior_rollups" : "gsc_only"],
    });
  }

  input.weekly.slice(0, 4).forEach((w, idx) => {
    out.push({
      id: stableActionId("wk", [w.action, String(idx), w.type]),
      title: w.action.slice(0, 160),
      type: w.type === "scale" ? "traffic" : w.type === "fix" ? "quality" : "authority",
      expectedTrafficGainPct: 9 + (w.type === "fix" ? 3 : 0),
      expectedRevenueGainUsd: w.revenueImpact.expectedRevenueIncreaseUsd,
      confidence: w.revenueImpact.confidence === "high" ? 0.78 : 0.62,
      sources: ["weekly_decision_engine", "revenue_funnel", "cluster_money_scores"],
    });
  });

  return out
    .sort((a, b) => b.expectedRevenueGainUsd - a.expectedRevenueGainUsd || b.confidence - a.confidence)
    .slice(0, input.max ?? 12);
}
