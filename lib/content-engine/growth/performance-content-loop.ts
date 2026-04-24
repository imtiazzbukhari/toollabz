import type { PerformanceAggregates } from "../performance/types";
import type { BehaviorAggregates } from "./behavior-types";
import { buildExpansionQueueFromAggregates } from "../funnel/smart-expansion";
import { buildCtrOptimizationQueue } from "./ctr-suggestions";
import { buildProgrammaticExpansionQueue } from "./programmatic-expand";
import { topEngagementFeedbackHints } from "./engagement-feedback";

export type ContentPerformanceLoopSnapshot = {
  expansionQueue: ReturnType<typeof buildExpansionQueueFromAggregates>;
  ctrQueue: ReturnType<typeof buildCtrOptimizationQueue>;
  programmaticQueue: ReturnType<typeof buildProgrammaticExpansionQueue>;
  engagementHints: ReturnType<typeof topEngagementFeedbackHints>;
};

/**
 * Single cron-friendly snapshot: GSC performance + optional behavior → queues and hints.
 */
export function buildContentPerformanceLoopSnapshot(
  performance: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
): ContentPerformanceLoopSnapshot | null {
  if (!performance?.pages?.length) return null;
  const pages = performance.pages;
  return {
    expansionQueue: buildExpansionQueueFromAggregates(pages, 8),
    ctrQueue: buildCtrOptimizationQueue(pages, 15),
    programmaticQueue: buildProgrammaticExpansionQueue(pages, 6),
    engagementHints: behavior?.byPath ? topEngagementFeedbackHints(behavior.byPath, 8) : [],
  };
}
