import { clusterPeerSlugs } from "@/lib/tools/clusters";
import { getMarketingHubForTool } from "@/lib/tools/directory-groups";
import { POPULAR_TOOL_SLUGS } from "@/lib/tools/popular-tools";
import type { ToolDefinition } from "@/lib/tools/types";

const hubCache = new Map<string, string>();
function hubHref(t: ToolDefinition): string {
  let href = hubCache.get(t.slug);
  if (!href) {
    href = getMarketingHubForTool(t).href;
    hubCache.set(t.slug, href);
  }
  return href;
}

/**
 * Related tools ranked by intent, never by catalog position:
 * 1. the tool's hand-written `related` list (in the order written),
 * 2. peers from the same topical cluster (lib/tools/clusters.ts),
 * 3. other tools in the same marketing hub, curated-popular first, then alphabetical,
 * 4. other tools in the same category, same ordering.
 * Every tier is deterministic and contains no duplicates.
 */
export function getRelatedToolsMergedDeduped(
  tool: ToolDefinition,
  catalog: readonly ToolDefinition[],
): ToolDefinition[] {
  const bySlug = new Map(catalog.map((t) => [t.slug, t] as const));
  const popularRank = new Map<string, number>(POPULAR_TOOL_SLUGS.map((s, i) => [s, i] as const));
  const ranked = (items: ToolDefinition[]) =>
    items.sort((a, b) => {
      const ra = popularRank.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const rb = popularRank.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
      return ra - rb || a.name.localeCompare(b.name);
    });

  const result: ToolDefinition[] = [];
  const seen = new Set<string>([tool.slug]);
  const push = (t: ToolDefinition | undefined) => {
    if (!t || seen.has(t.slug)) return;
    seen.add(t.slug);
    result.push(t);
  };

  tool.related.forEach((slug) => push(bySlug.get(slug)));
  clusterPeerSlugs(tool.slug).forEach((slug) => push(bySlug.get(slug)));

  const hub = hubHref(tool);
  const sameHub = catalog.filter((t) => t.slug !== tool.slug && hubHref(t) === hub);
  ranked(sameHub).forEach(push);

  const sameCategory = catalog.filter((t) => t.slug !== tool.slug && t.category === tool.category);
  ranked(sameCategory).forEach(push);

  return result;
}

/** Top related tools shown in ToolLayout (4-6 items). */
export function getRelatedToolsForLayout(
  tool: ToolDefinition,
  catalog: readonly ToolDefinition[],
): ToolDefinition[] {
  const merged = getRelatedToolsMergedDeduped(tool, catalog);
  if (merged.length >= 4) return merged.slice(0, 6);
  const seen = new Set<string>([tool.slug, ...merged.map((t) => t.slug)]);
  for (const slug of POPULAR_TOOL_SLUGS) {
    if (merged.length >= 4) break;
    const t = catalog.find((c) => c.slug === slug);
    if (!t || seen.has(t.slug)) continue;
    merged.push(t);
    seen.add(t.slug);
  }
  return merged.slice(0, 6);
}
