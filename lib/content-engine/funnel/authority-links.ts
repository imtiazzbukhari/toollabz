import { blogPosts } from "@/lib/blog/registry";
import { toolMap } from "@/lib/tools/data";
import { TOPIC_CLUSTERS } from "../topic-clusters";
import { suggestInternalLinks } from "../internal-linking";
import type { InternalLinkSuggestion } from "../types";

/**
 * Pillar tool + cluster-relevant blogs first, then overlap-based links.
 */
export function suggestAuthorityAugmentedLinks(
  topic: string,
  bodyPreview: string,
  opts: { clusterId?: string; pillarToolSlug?: string },
  limit = 6,
): InternalLinkSuggestion[] {
  const merged: InternalLinkSuggestion[] = [];
  const seen = new Set<string>();

  const push = (item: InternalLinkSuggestion) => {
    if (merged.length >= limit) return;
    if (seen.has(item.href)) return;
    seen.add(item.href);
    merged.push(item);
  };

  if (opts.pillarToolSlug) {
    const t = toolMap.get(opts.pillarToolSlug);
    if (t) {
      push({
        href: `/tools/${t.slug}`,
        anchor: t.name,
        reason: "Cluster pillar tool (authority hub)",
      });
    }
  }

  if (opts.clusterId) {
    const cluster = TOPIC_CLUSTERS.find((c) => c.id === opts.clusterId);
    if (cluster) {
      const scored = blogPosts
        .map((p) => {
          const text = `${p.title} ${p.description}`.toLowerCase();
          let score = 0;
          for (const h of cluster.hubKeywords) {
            if (text.includes(h.toLowerCase())) score += 1;
          }
          return { p, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score || a.p.title.localeCompare(b.p.title));

      for (const { p } of scored.slice(0, 3)) {
        push({
          href: `/blog/${p.slug}`,
          anchor: p.title,
          reason: "Topical cluster alignment",
        });
      }
    }
  }

  const base = suggestInternalLinks(topic, bodyPreview, Math.max(3, limit));
  for (const b of base) push(b);

  return merged.slice(0, limit);
}
