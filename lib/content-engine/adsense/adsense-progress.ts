import type { AdsenseHistoryRow } from "./adsense-history";
import type { AdsenseReadinessIssue } from "./adsense-readiness";

export type AdsenseProgressSnapshot = {
  weeklyImprovementPct: number;
  readinessTrend: "up" | "flat" | "down";
  topFixesCompleted: string[];
  pendingBlockers: string[];
};

export function buildAdsenseProgress(history: readonly AdsenseHistoryRow[], issues: readonly AdsenseReadinessIssue[]): AdsenseProgressSnapshot {
  const current = history[0];
  const weekAgo = history[6] ?? history[history.length - 1];
  const weeklyImprovementPct =
    current && weekAgo && weekAgo.score > 0 ? Number((((current.score - weekAgo.score) / weekAgo.score) * 100).toFixed(1)) : 0;
  const readinessTrend = weeklyImprovementPct > 1 ? "up" : weeklyImprovementPct < -1 ? "down" : "flat";
  const pendingBlockers = issues.filter((i) => i.severity === "high").slice(0, 5).map((i) => i.message);
  const topFixesCompleted =
    history.length >= 2 && history[0] && history[1] && history[0].issuesCount < history[1].issuesCount
      ? ["Reduced total blocking issues compared to previous snapshot."]
      : [];
  return {
    weeklyImprovementPct,
    readinessTrend,
    topFixesCompleted,
    pendingBlockers,
  };
}
