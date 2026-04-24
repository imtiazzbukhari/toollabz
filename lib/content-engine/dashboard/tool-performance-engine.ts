import type { BehaviorAggregates } from "../growth/behavior-types";
import type { PerformanceAggregates } from "../performance/types";
import { clusterIdForPath } from "./cluster-utils";

export type ToolPerformanceRow = {
  slug: string;
  path: string;
  clusterId: string | null;
  impressions: number;
  clicks: number;
  ctr: number;
  usageSessions: number;
  toolToActionRate: number;
  revenueContributionUsd: number;
  rpm: number;
  weaknessScore: number;
  suggestions: string[];
};

function slugFromToolPath(path: string): string | null {
  const m = path.replace(/\/+$/, "").match(/^\/tools\/([^/?#]+)$/i);
  return m?.[1]?.toLowerCase() ?? null;
}

/**
 * Tool analytics from GSC paths `/tools/*`, optional revenue merge, and behavior rollups.
 */
export function buildToolPerformanceEngine(
  performance: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
  limit = 24,
): {
  topTools: ToolPerformanceRow[];
  weakTools: ToolPerformanceRow[];
} {
  const revByPath = new Map((performance?.pageRevenue ?? []).map((r) => [r.path, r]));
  const rows: ToolPerformanceRow[] = [];

  for (const p of performance?.pages ?? []) {
    const slug = slugFromToolPath(p.path);
    if (!slug) continue;
    const rev = revByPath.get(p.path);
    const earnings = rev?.earnings ?? 0;
    const rpm = rev?.rpm ?? 0;
    const b = behavior?.byPath[p.path];
    const usageSessions = b?.sampleCount ?? 0;
    const toolClicks = b?.toolClickCount ?? 0;
    const conv = b?.conversionEventCount ?? 0;
    const toolToActionRate = toolClicks > 0 ? Math.min(1, conv / toolClicks) : b && usageSessions > 0 ? Math.min(1, conv / usageSessions) : 0;
    const ctr = p.impressions > 0 ? p.clicks / p.impressions : 0;

    const weaknessScore = Math.round(
      (p.impressions >= 800 && ctr < 0.02 ? 25 : 0) +
        (rpm > 0 && rpm < 4 ? 20 : 0) +
        (usageSessions > 20 && toolToActionRate < 0.08 ? 22 : 0) +
        (p.impressions < 200 ? 15 : 0),
    );

    const suggestions: string[] = [];
    if (ctr < 0.025 && p.impressions >= 500) suggestions.push("Refresh title/meta and first-screen value prop for CTR.");
    if (rpm < 6 && p.impressions >= 1000) suggestions.push("Add decision-intent sections + calculator CTA blocks to lift RPM.");
    if (toolToActionRate < 0.1 && usageSessions >= 15) suggestions.push("Improve in-tool guidance and post-result CTAs to lift tool→action conversion.");
    if (!suggestions.length) suggestions.push("Monitor weekly; expand supporting guides from this tool cluster.");

    rows.push({
      slug,
      path: p.path,
      clusterId: clusterIdForPath(p.path),
      impressions: p.impressions,
      clicks: p.clicks,
      ctr: Number((ctr * 100).toFixed(3)),
      usageSessions,
      toolToActionRate: Number((toolToActionRate * 100).toFixed(2)),
      revenueContributionUsd: Number(earnings.toFixed(2)),
      rpm: Number(rpm.toFixed(2)),
      weaknessScore,
      suggestions,
    });
  }

  const topTools = [...rows].sort((a, b) => b.revenueContributionUsd - a.revenueContributionUsd || b.clicks - a.clicks).slice(0, limit);
  const weakTools = [...rows].sort((a, b) => b.weaknessScore - a.weaknessScore || b.impressions - a.impressions).slice(0, 8);

  return { topTools, weakTools };
}
