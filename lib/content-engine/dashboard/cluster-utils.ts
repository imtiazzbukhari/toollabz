import { blogPosts } from "@/lib/blog/registry";
import { TOPIC_CLUSTERS, findClusterForKeyword } from "../topic-clusters";

function guessKeywordFromPath(path: string): string {
  if (path.startsWith("/blog/")) {
    const slug = path.replace(/^\/blog\//, "").replace(/\/+$/, "");
    const post = blogPosts.find((p) => p.slug === slug);
    if (post) return `${post.title} ${post.description}`.toLowerCase();
    return slug.replace(/-/g, " ").toLowerCase();
  }
  if (path.startsWith("/tools/")) {
    const slug = path.replace(/^\/tools\//, "").replace(/\/+$/, "");
    return slug.replace(/-/g, " ").toLowerCase();
  }
  return path.replace(/[-_/]+/g, " ").toLowerCase();
}

export function clusterIdForPath(path: string): string | null {
  if (path.startsWith("/tools/")) {
    const slug = path.replace(/^\/tools\//, "").replace(/\/+$/, "");
    const byTool = TOPIC_CLUSTERS.find((c) => c.pillarToolSlug === slug);
    if (byTool) return byTool.id;
  }
  const keyword = guessKeywordFromPath(path);
  return findClusterForKeyword(keyword)?.id ?? null;
}

