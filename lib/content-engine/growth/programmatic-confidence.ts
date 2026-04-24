import type { ProgrammaticQueryIdea } from "./programmatic-expand";
import type { GscPageMetric } from "../performance/types";
import { findClusterForKeyword } from "../topic-clusters";

export type ProgrammaticPick = {
  path: string;
  metric: GscPageMetric;
  idea: ProgrammaticQueryIdea;
  clusterId: string | null;
  confidence: "high" | "medium";
};

function isHighConfidenceIdea(idea: ProgrammaticQueryIdea, parent: GscPageMetric): boolean {
  if (idea.kind === "numeric_principal" && parent.clicks >= 20) return true;
  if (idea.kind === "intent_variation" && parent.clicks >= 15) return true;
  if (idea.kind === "numeric_term" && parent.clicks >= 25) return true;
  if (idea.kind === "location" && parent.clicks >= 45 && parent.impressions >= 3000) return true;
  return false;
}

/**
 * Picks one idea per parent path; dedupes by topic cluster so you do not stack duplicate authority targets in one run.
 */
export function pickHighConfidenceProgrammaticPicks(
  queue: ReadonlyArray<{ path: string; metric: GscPageMetric; ideas: ProgrammaticQueryIdea[] }>,
  existingBlogSlugs: ReadonlySet<string>,
  existingToolSlugs: ReadonlySet<string>,
  maxPicks = 3,
): ProgrammaticPick[] {
  const usedClusters = new Set<string>();
  const picks: ProgrammaticPick[] = [];

  outer: for (const row of queue) {
    if (picks.length >= maxPicks) break;
    const sorted = [...row.ideas].sort((a, b) => {
      const rank = (k: ProgrammaticQueryIdea["kind"]) =>
        k === "numeric_principal" ? 3 : k === "intent_variation" ? 2 : k === "numeric_term" ? 1 : 0;
      return rank(b.kind) - rank(a.kind);
    });

    for (const idea of sorted) {
      if (!isHighConfidenceIdea(idea, row.metric)) continue;
      const hint = idea.suggestedSlugHint.toLowerCase().replace(/[^a-z0-9-]/g, "");
      if (existingBlogSlugs.has(hint) || existingToolSlugs.has(hint)) continue;

      const cluster = findClusterForKeyword(idea.primaryKeyword);
      const cid = cluster?.id ?? null;
      if (cid && usedClusters.has(cid)) continue;

      picks.push({
        path: row.path,
        metric: row.metric,
        idea,
        clusterId: cid,
        confidence: idea.kind === "location" ? "medium" : "high",
      });
      if (cid) usedClusters.add(cid);
      continue outer;
    }
  }

  return picks;
}
