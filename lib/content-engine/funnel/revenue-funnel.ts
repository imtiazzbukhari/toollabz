import type { PrioritizedOpportunity } from "../types";
import { detectIntentStage } from "./intent-stage";

/** Small priority lift for decision-intent queries (RPM + conversion alignment). */
export function applyDecisionIntentBoost(rows: readonly PrioritizedOpportunity[]): PrioritizedOpportunity[] {
  return rows.map((r) => {
    const stage = detectIntentStage(r.keyword, r.suggestedBlogTitle);
    if (stage !== "decision") return r;
    return { ...r, priority: Math.min(100, r.priority + 4) };
  });
}
