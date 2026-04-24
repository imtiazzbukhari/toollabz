import { blogPosts } from "@/lib/blog/registry";
import type { PerformanceAggregates } from "../performance/types";
import { TOPIC_CLUSTERS } from "../topic-clusters";
import { clusterIdForPath } from "./cluster-utils";
import { buildInternalLinkBoostSuggestions } from "./internal-link-boost";

export type ClusterDominationScoreRow = {
  clusterId: string;
  score: number;
  coverageScore: number;
  keywordCoverageScore: number;
  internalLinkDensityScore: number;
  authorityScore: number;
  missingAreas: string[];
};

export function buildTopicDominationScores(performance: PerformanceAggregates | null): ClusterDominationScoreRow[] {
  const pages = performance?.pages ?? [];
  const boosts = buildInternalLinkBoostSuggestions(performance, 30);

  const out: ClusterDominationScoreRow[] = [];
  for (const c of TOPIC_CLUSTERS) {
    const clusterPages = pages.filter((p) => clusterIdForPath(p.path) === c.id);
    const clusterBlogs = blogPosts.filter((p) => clusterIdForPath(`/blog/${p.slug}`) === c.id);
    const impressions = clusterPages.reduce((n, p) => n + p.impressions, 0);
    const clicks = clusterPages.reduce((n, p) => n + p.clicks, 0);
    const coverageScore = Math.min(100, Math.round((clusterBlogs.length / Math.max(1, c.supporting.length)) * 100));
    const keywordCoverageScore = Math.min(100, Math.round((clusterPages.length / Math.max(1, c.hubKeywords.length)) * 100));
    const weakLinkCount = boosts.filter((b) => clusterIdForPath(b.targetPath) === c.id).length;
    const internalLinkDensityScore = Math.max(0, 100 - weakLinkCount * 10);
    const authorityScore = Math.min(100, Math.round(clicks > 0 ? (clicks / Math.max(1, impressions)) * 2200 + Math.log10(clicks + 1) * 15 : 0));
    const score = Math.round(coverageScore * 0.3 + keywordCoverageScore * 0.22 + internalLinkDensityScore * 0.2 + authorityScore * 0.28);
    const missingAreas: string[] = [];
    if (coverageScore < 65) missingAreas.push("Supporting coverage gap");
    if (keywordCoverageScore < 60) missingAreas.push("Hub keyword coverage gap");
    if (internalLinkDensityScore < 65) missingAreas.push("Internal link flow weak");
    if (authorityScore < 55) missingAreas.push("Low authority signal (click share)");
    out.push({ clusterId: c.id, score, coverageScore, keywordCoverageScore, internalLinkDensityScore, authorityScore, missingAreas });
  }
  out.sort((a, b) => b.score - a.score || a.clusterId.localeCompare(b.clusterId));
  return out;
}

