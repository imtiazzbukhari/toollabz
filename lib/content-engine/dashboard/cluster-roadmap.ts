import { TOPIC_CLUSTERS, type TopicCluster } from "../topic-clusters";

export type RoadmapItem = {
  kind: "blog" | "comparison" | "programmatic_tool" | "programmatic_blog";
  title: string;
  primaryKeyword: string;
  clusterId: string;
};

function expandCluster(c: TopicCluster, maxItems: number): RoadmapItem[] {
  const items: RoadmapItem[] = [];

  for (const s of c.supporting) {
    if (items.length >= maxItems) return items;
    items.push({ kind: "blog", title: s.title, primaryKeyword: s.primaryKeyword, clusterId: c.id });
  }

  for (const hub of c.hubKeywords) {
    if (items.length >= maxItems) return items;
    items.push({
      kind: "comparison",
      title: `${hub}: comparison and tradeoffs`,
      primaryKeyword: `${hub} vs alternatives`,
      clusterId: c.id,
    });
  }

  const tiers = ["5k", "10k", "25k", "50k", "100k", "150k", "200k"] as const;
  for (const hub of c.hubKeywords) {
    for (const tier of tiers) {
      if (items.length >= maxItems) return items;
      items.push({
        kind: "programmatic_blog",
        title: `${hub} ${tier} scenario walkthrough`,
        primaryKeyword: `${hub} ${tier} example`,
        clusterId: c.id,
      });
    }
  }

  for (const hub of c.hubKeywords.slice(0, 6)) {
    if (items.length >= maxItems) return items;
    items.push({
      kind: "programmatic_tool",
      title: `Tool spin: ${hub} (requires new spec + PR)`,
      primaryKeyword: `${hub} calculator variant`,
      clusterId: c.id,
    });
  }

  const longTails = [
    "checklist",
    "common mistakes",
    "spreadsheet template",
    "examples walkthrough",
    "FAQ for busy readers",
    "beginner guide",
    "2026 update",
    "when rates move",
    "with taxes (high level)",
    "for side income",
    "reddit myths debunked",
    "long-form outline",
    "internal links map",
    "comparison table",
    "decision worksheet",
    "state quirks (editorial)",
    "video script outline",
    "newsletter edition",
    "pillar → supporting map",
    "snippet targets",
  ] as const;

  for (const hub of c.hubKeywords) {
    for (const lt of longTails) {
      if (items.length >= maxItems) return items;
      items.push({
        kind: "blog",
        title: `${hub}: ${lt}`,
        primaryKeyword: `${hub} ${lt}`,
        clusterId: c.id,
      });
    }
  }

  return items;
}

/**
 * Editorial roadmap per cluster (ideas only). Tuned for 50–200+ ideas per cluster when maxPerCluster is high.
 */
export function buildClusterDominationRoadmaps(maxPerCluster = 150, maxTotal = 1200): Record<string, RoadmapItem[]> {
  const out: Record<string, RoadmapItem[]> = {};
  let total = 0;
  for (const c of TOPIC_CLUSTERS) {
    if (total >= maxTotal) break;
    const room = Math.min(maxPerCluster, maxTotal - total);
    const chunk = expandCluster(c, room);
    out[c.id] = chunk;
    total += chunk.length;
  }
  return out;
}

export type ClusterRoadmapSummary = { clusterId: string; total: number; sample: RoadmapItem[] };

export function summarizeClusterRoadmaps(
  roadmaps: Record<string, RoadmapItem[]>,
  sampleSize = 8,
): ClusterRoadmapSummary[] {
  return Object.entries(roadmaps).map(([clusterId, items]) => ({
    clusterId,
    total: items.length,
    sample: items.slice(0, sampleSize),
  }));
}
