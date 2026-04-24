import { toolMap, tools } from "@/lib/tools/data";
import { POPULAR_TOOL_SLUGS } from "@/lib/tools/popular-tools";
import type { ToolDefinition } from "@/lib/tools/types";
import type { BlogPostResolved } from "./registry";

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "into",
  "your",
  "about",
  "when",
  "what",
  "how",
  "best",
  "free",
  "guide",
  "tools",
  "tool",
]);

function tokenSet(input: string): Set<string> {
  const words = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length >= 3 && !STOP.has(w));
  return new Set(words);
}

function scoreToolForPost(postTokens: Set<string>, t: ToolDefinition): number {
  let score = 0;
  const tTokens = tokenSet(`${t.name} ${t.slug} ${t.keywords.join(" ")}`);
  for (const token of tTokens) {
    if (postTokens.has(token)) score += 1;
  }
  return score;
}

export function getRelatedToolsForBlogPost(post: BlogPostResolved, limit = 6): ToolDefinition[] {
  const explicit = (post.relatedToolSlugs ?? [])
    .map((slug) => toolMap.get(slug))
    .filter((t): t is ToolDefinition => Boolean(t));
  if (explicit.length >= Math.min(2, limit)) return explicit.slice(0, limit);

  const used = new Set(explicit.map((t) => t.slug));
  const postTokens = tokenSet(`${post.title} ${post.description} ${post.excerpt} ${post.slug}`);
  const scored = tools
    .filter((t) => !used.has(t.slug))
    .map((t) => ({ t, score: scoreToolForPost(postTokens, t) }))
    .filter((it) => it.score > 0)
    .sort((a, b) => b.score - a.score || a.t.name.localeCompare(b.t.name))
    .map((it) => it.t);

  const fallback = POPULAR_TOOL_SLUGS.map((slug) => toolMap.get(slug)).filter((t): t is ToolDefinition => Boolean(t));
  const merged: ToolDefinition[] = [...explicit, ...scored];
  const seen = new Set(merged.map((t) => t.slug));
  for (const t of fallback) {
    if (merged.length >= limit) break;
    if (seen.has(t.slug)) continue;
    merged.push(t);
    seen.add(t.slug);
  }
  return merged.slice(0, limit);
}
