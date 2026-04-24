import { blogPosts } from "./registry";
import { toolMap } from "../tools/data";

export type ToolGuideLink = {
  slug: string;
  title: string;
  description: string;
};

/** Blog posts that list this tool in `relatedToolSlugs` (newest first). */
export function getGuideLinksForTool(toolSlug: string, limit = 4): ToolGuideLink[] {
  const explicit = blogPosts
    .filter((p) => p.relatedToolSlugs?.includes(toolSlug))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  if (explicit.length >= Math.min(2, limit)) {
    return explicit.slice(0, limit).map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
    }));
  }

  const tool = toolMap.get(toolSlug);
  if (!tool) return [];
  const tokens = new Set(
    `${tool.name} ${tool.slug} ${tool.keywords.join(" ")}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((w) => w.length >= 3),
  );
  const scored = blogPosts
    .filter((p) => !explicit.some((e) => e.slug === p.slug))
    .map((p) => {
      const text = `${p.slug} ${p.title} ${p.description} ${p.excerpt}`.toLowerCase();
      let score = 0;
      for (const token of tokens) {
        if (text.includes(token)) score += 1;
      }
      return { p, score };
    })
    .filter((it) => it.score > 0)
    .sort((a, b) => b.score - a.score || (a.p.publishedAt < b.p.publishedAt ? 1 : -1))
    .map((it) => it.p);

  return [...explicit, ...scored].slice(0, limit).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
  }));
}
