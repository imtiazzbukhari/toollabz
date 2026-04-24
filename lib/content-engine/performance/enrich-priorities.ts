import type { PrioritizedOpportunity } from "../types";
import { findClusterForKeyword, findClusterForToolSlugs } from "../topic-clusters";
import { applyGscBoostToPrioritized } from "./gsc-merge";
import type { PerformanceAggregates } from "./types";
import { applyRevenueEngagementLayer, attachMonetizationTags } from "../monetization/revenue-merge";
import { applyDecisionIntentBoost } from "../funnel/revenue-funnel";
import type { BehaviorAggregates } from "../growth/behavior-types";
import { applyPageRpmSignals } from "../growth/revenue-priority";
import { applyBehaviorSignalsToPrioritized } from "../growth/behavior-priority";
import { activeClusterIds, businessModeEnabled } from "../config";
import { applyActiveClusterMode } from "../funnel/active-cluster-mode";
import { getConsoleAdminConfig } from "../console-admin-store";

/**
 * Re-rank opportunities using Search Console snapshot + topic cluster hints.
 */
export function enrichPrioritizedWithPerformanceAndClusters(
  rows: readonly PrioritizedOpportunity[],
  aggregates: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
  limit: number,
): PrioritizedOpportunity[] {
  const boosted = applyGscBoostToPrioritized([...rows], aggregates);
  let revenueAdjusted = applyRevenueEngagementLayer(boosted, aggregates);
  revenueAdjusted = applyPageRpmSignals(revenueAdjusted, aggregates);
  revenueAdjusted = applyBehaviorSignalsToPrioritized(revenueAdjusted, behavior);

  const tagged = revenueAdjusted.map((r) => {
    const byKw = findClusterForKeyword(r.keyword);
    const byTools = findClusterForToolSlugs(r.linkToolSlugs);
    const cluster = byKw ?? byTools;
    if (!cluster) return r;
    const siblingCount = cluster.supporting.length;
    const linkToolSlugs = r.linkToolSlugs.includes(cluster.pillarToolSlug)
      ? [...r.linkToolSlugs]
      : [cluster.pillarToolSlug, ...r.linkToolSlugs];
    return {
      ...r,
      linkToolSlugs,
      clusterId: cluster.id,
      clusterPillarToolSlug: cluster.pillarToolSlug,
      clusterSiblingCount: siblingCount,
      /** Slight nudge for topical authority alignment. */
      priority: Math.min(100, r.priority + 4),
    };
  });

  const boostedIntent = applyDecisionIntentBoost(tagged);
  const clusterFiltered = applyActiveClusterMode(boostedIntent, activeClusterIds()).rows;
  const businessMode = businessModeEnabled();
  const revenueBoost = getConsoleAdminConfig().revenueBoostMode === true;
  const kwLooksCalculator = (k: string) => /calculat|estimat|compare|vs\.|mortgage|loan|payment|roi|budget/i.test(k);

  const businessFiltered = businessMode
    ? clusterFiltered
        .filter(
          (r) =>
            (r.monetizationPotential ?? 0) >= 45 ||
            (r.cpcScore ?? 0) >= 40 ||
            (r.rpmBoost ?? 0) > 0 ||
            r.intent === "transactional",
        )
        .map((r) => ({
          ...r,
          priority: Math.min(
            100,
            r.priority +
              (r.intent === "transactional" ? 8 : 0) +
              Math.round((r.monetizationPotential ?? 0) / 20) +
              Math.round((r.cpcScore ?? 0) / 25),
          ),
        }))
    : revenueBoost && !businessMode
      ? clusterFiltered
          .filter((r) => {
            const lowValueInfo =
              r.intent === "informational" &&
              (r.monetizationPotential ?? 0) < 28 &&
              (r.cpcScore ?? 0) < 22 &&
              !r.clusterId;
            if (lowValueInfo) return false;
            return (
              r.intent === "transactional" ||
              kwLooksCalculator(r.keyword) ||
              (r.cpcScore ?? 0) >= 32 ||
              (r.monetizationPotential ?? 0) >= 38 ||
              Boolean(r.clusterId && (r.cpcScore ?? 0) >= 26)
            );
          })
          .map((r) => ({
            ...r,
            priority: Math.min(
              100,
              r.priority +
                (r.intent === "transactional" ? 10 : 0) +
                (kwLooksCalculator(r.keyword) ? 6 : 0) +
                Math.round((r.cpcScore ?? 0) / 22) +
                (r.clusterId ? 4 : 0),
            ),
          }))
      : clusterFiltered;
  const withTags = attachMonetizationTags(businessFiltered);
  withTags.sort((a, b) => b.priority - a.priority || a.keyword.localeCompare(b.keyword));
  return withTags.slice(0, limit);
}
