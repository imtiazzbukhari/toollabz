import type { BehaviorPrAction } from "../growth/behavior-actions";

export type FastDeployCandidate = {
  lane: "ctr" | "behavior" | "programmatic" | "scaling";
  id: string;
  path: string;
  confidence: "high" | "medium";
  score: number;
  reason: string;
  fastApprovalEligible: boolean;
};

export type FastDeploymentSnapshot = {
  fastApprovalMode: boolean;
  highConfidence: FastDeployCandidate[];
  bulkReviewBatches: Array<{ lane: FastDeployCandidate["lane"]; items: FastDeployCandidate[] }>;
};

function scoreCtr(row: { path: string; impressions: number; ctr: number }): FastDeployCandidate {
  const score = Math.min(100, Math.round((row.impressions / 120) * 0.6 + (0.03 - row.ctr) * 1900));
  const high = score >= 68;
  return {
    lane: "ctr",
    id: `ctr:${row.path}`,
    path: row.path,
    confidence: high ? "high" : "medium",
    score,
    reason: `High impressions (${row.impressions}) with low CTR (${(row.ctr * 100).toFixed(2)}%).`,
    fastApprovalEligible: high,
  };
}

function scoreBehavior(action: BehaviorPrAction): FastDeployCandidate {
  const base =
    action.trigger === "high_exit_section" || action.trigger === "low_scroll"
      ? 72
      : action.trigger === "early_exit_histogram"
        ? 69
        : 63;
  return {
    lane: "behavior",
    id: `behavior:${action.path}:${action.trigger}`,
    path: action.path,
    confidence: base >= 68 ? "high" : "medium",
    score: base,
    reason: `${action.title} (${action.trigger})`,
    fastApprovalEligible: base >= 68,
  };
}

export function buildFastDeploymentSnapshot(input: {
  fastApprovalMode: boolean;
  ctrQueue: ReadonlyArray<{ path: string; impressions: number; ctr: number }>;
  behaviorActions: readonly BehaviorPrAction[];
  programmaticPick?: { path: string } | null;
  scalingBlog?: { parentPath: string } | null;
}): FastDeploymentSnapshot {
  const candidates: FastDeployCandidate[] = [];
  for (const row of input.ctrQueue.slice(0, 8)) candidates.push(scoreCtr(row));
  for (const a of input.behaviorActions.slice(0, 8)) candidates.push(scoreBehavior(a));
  if (input.programmaticPick?.path) {
    candidates.push({
      lane: "programmatic",
      id: `programmatic:${input.programmaticPick.path}`,
      path: input.programmaticPick.path,
      confidence: "high",
      score: 78,
      reason: "Programmatic pick passed confidence gate.",
      fastApprovalEligible: true,
    });
  }
  if (input.scalingBlog?.parentPath) {
    candidates.push({
      lane: "scaling",
      id: `scaling:${input.scalingBlog.parentPath}`,
      path: input.scalingBlog.parentPath,
      confidence: "medium",
      score: 66,
      reason: "Scaling candidate derived from high-performing parent page.",
      fastApprovalEligible: false,
    });
  }

  candidates.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
  const highConfidence = candidates.filter((c) => c.confidence === "high");
  const lanes = ["ctr", "behavior", "programmatic", "scaling"] as const;
  const bulkReviewBatches: FastDeploymentSnapshot["bulkReviewBatches"] = lanes.map((lane) => ({
    lane,
    items: candidates.filter((c) => c.lane === lane).slice(0, 6),
  }));
  return { fastApprovalMode: input.fastApprovalMode, highConfidence, bulkReviewBatches };
}
