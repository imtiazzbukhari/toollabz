import { blogPostBySlug, type BlogPostResolved } from "@/lib/blog/registry";
import { HUB_FEATURED_BLOG_SLUGS } from "@/lib/blog/hub-featured-slugs";
import { hubCollectionPageSchema } from "@/lib/seo";
import { tools } from "@/lib/tools/data";
import { getDirectoryGroup, toolsInDirectoryGroup, type DirectoryGroupId } from "@/lib/tools/directory-groups";
import { POPULAR_TOOL_SLUGS } from "@/lib/tools/popular-tools";
import type { ToolDefinition } from "@/lib/tools/types";

export function hubFeaturedPostsForGroup(group: DirectoryGroupId, max = 3): BlogPostResolved[] {
  const slugs = HUB_FEATURED_BLOG_SLUGS[group] ?? [];
  return slugs
    .map((slug) => blogPostBySlug(slug))
    .filter((p): p is BlogPostResolved => Boolean(p))
    .slice(0, max);
}

export function hubPopularToolsForGroup(group: DirectoryGroupId, limit = 6): ToolDefinition[] {
  const filtered = toolsInDirectoryGroup(tools, group);
  const out: ToolDefinition[] = [];
  const seen = new Set<string>();
  for (const slug of POPULAR_TOOL_SLUGS) {
    const t = tools.find((x) => x.slug === slug);
    if (!t || seen.has(t.slug)) continue;
    if (getDirectoryGroup(t) !== group) continue;
    out.push(t);
    seen.add(t.slug);
    if (out.length >= limit) return out;
  }
  for (const t of filtered) {
    if (out.length >= limit) break;
    if (seen.has(t.slug)) continue;
    out.push(t);
    seen.add(t.slug);
  }
  return out;
}

export function hubCollectionLdForGroup(
  group: DirectoryGroupId,
  opts: { name: string; description: string; path: string },
) {
  const filtered = toolsInDirectoryGroup(tools, group);
  return hubCollectionPageSchema({
    name: opts.name,
    description: opts.description,
    path: opts.path,
    items: filtered.map((t) => ({ name: t.name, slug: t.slug, description: t.shortDescription })),
  });
}
