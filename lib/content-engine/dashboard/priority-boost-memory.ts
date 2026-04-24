import type { MonetizationScorecardAction } from "./monetization-scorecard";
import type { PatternSnapshot } from "./pattern-detection";

export function applyMemoryPriorityBoost(
  actions: readonly MonetizationScorecardAction[],
  patterns: PatternSnapshot,
): MonetizationScorecardAction[] {
  const actionPerf = new Map(patterns.highRoiActionTypes.map((p) => [p.key, p.performanceLabel]));
  return actions.map((a) => {
    const perf = actionPerf.get(a.exactFix);
    const delta = perf === "high_roi" ? 6 : perf === "underperforming" ? -4 : 0;
    return {
      ...a,
      score: Math.max(0, Math.min(100, a.score + delta)),
    };
  });
}

