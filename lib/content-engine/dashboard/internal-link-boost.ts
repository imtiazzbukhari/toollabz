import type { PerformanceAggregates } from "../performance/types";
import { suggestAuthorityAugmentedLinks } from "../funnel/authority-links";
import { clusterIdForPath } from "./cluster-utils";
import { TOPIC_CLUSTERS } from "../topic-clusters";

export type InternalLinkBoostRow = {
  targetPath: string;
  sourceCandidates: string[];
  suggestions: Array<{ href: string; anchor: string; reason: string }>;
  priority: number;
};

export function buildInternalLinkBoostSuggestions(
  performance: PerformanceAggregates | null,
  max = 12,
): InternalLinkBoostRow[] {
  const pages = performance?.pages ?? [];
  const authority = [...pages].sort((a, b) => b.clicks - a.clicks).slice(0, 30).map((p) => p.path);
  const weak = [...pages]
    .filter((p) => p.impressions >= 400 && p.clicks / Math.max(1, p.impressions) < 0.02)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, max);

  const out: InternalLinkBoostRow[] = [];
  for (const w of weak) {
    const clusterId = clusterIdForPath(w.path) ?? undefined;
    const pillar = clusterId ? TOPIC_CLUSTERS.find((c) => c.id === clusterId)?.pillarToolSlug : undefined;
    const suggestions = suggestAuthorityAugmentedLinks(w.path, w.path.replace(/[-/]/g, " "), { clusterId, pillarToolSlug: pillar }, 4);
    if (suggestions.length === 0) continue;
    const sourceCandidates = authority
      .filter((p) => p !== w.path && (clusterIdForPath(p) === clusterId || p.startsWith("/blog/")))
      .slice(0, 6);
    const priority = Math.min(100, Math.round(w.impressions / 150 + (0.025 - w.clicks / Math.max(1, w.impressions)) * 1000));
    out.push({
      targetPath: w.path,
      sourceCandidates,
      suggestions,
      priority,
    });
  }
  out.sort((a, b) => b.priority - a.priority || a.targetPath.localeCompare(b.targetPath));
  return out.slice(0, max);
}

