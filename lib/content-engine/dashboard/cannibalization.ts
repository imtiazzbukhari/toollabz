import { blogPosts } from "@/lib/blog/registry";

export type CannibalizationCluster = {
  token: string;
  paths: string[];
  reason: string;
};

function tokens(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4);
}

/**
 * Heuristic overlap: shared significant tokens between titles (editorial review, not auto-merge).
 */
export function detectTitleCannibalization(maxClusters = 12): CannibalizationCluster[] {
  const map = new Map<string, string[]>();
  for (const p of blogPosts) {
    for (const t of tokens(p.title)) {
      const arr = map.get(t) ?? [];
      arr.push(`/blog/${p.slug}`);
      map.set(t, arr);
    }
  }
  const out: CannibalizationCluster[] = [];
  for (const [token, paths] of map) {
    const uniq = [...new Set(paths)];
    if (uniq.length < 2) continue;
    out.push({
      token,
      paths: uniq.slice(0, 6),
      reason: "Shared title token may indicate overlapping intent; consider canonical, merge, or differentiate H1/angle.",
    });
  }
  out.sort((a, b) => b.paths.length - a.paths.length);
  return out.slice(0, maxClusters);
}
