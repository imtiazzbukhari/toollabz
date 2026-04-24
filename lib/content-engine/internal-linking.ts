import { blogPosts } from "@/lib/blog/registry";
import { tools } from "@/lib/tools/data";
import type { InternalLinkSuggestion } from "./types";

const STOP = new Set(["the", "and", "for", "with", "from", "that", "this", "into", "your", "about", "when", "what", "how"]);

function tokens(input: string): Set<string> {
  return new Set(
    input
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/[\s-]+/)
      .filter((w) => w.length >= 4 && !STOP.has(w)),
  );
}

function scoreOverlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of b) if (a.has(t)) n += 1;
  return n;
}

/**
 * Suggest 2–4 contextual internal links (tools + relevant blog posts) for a topic string.
 */
export function suggestInternalLinks(topic: string, bodyPreview: string, limit = 4): InternalLinkSuggestion[] {
  const bag = tokens(`${topic} ${bodyPreview}`);
  const out: InternalLinkSuggestion[] = [];
  const seen = new Set<string>();

  const toolScored = tools
    .map((t) => {
      const bagT = tokens(`${t.name} ${t.slug} ${t.keywords.join(" ")} ${t.description}`);
      return { t, score: scoreOverlap(bag, bagT) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.t.name.localeCompare(b.t.name));

  for (const { t } of toolScored) {
    if (out.length >= limit) break;
    const href = `/tools/${t.slug}`;
    if (seen.has(href)) continue;
    seen.add(href);
    out.push({
      href,
      anchor: t.name,
      reason: "Keyword overlap with tool metadata",
    });
  }

  const postScored = blogPosts
    .map((p) => {
      const bagP = tokens(`${p.title} ${p.description} ${p.slug}`);
      return { p, score: scoreOverlap(bag, bagP) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.p.title.localeCompare(b.p.title));

  for (const { p } of postScored) {
    if (out.length >= limit) break;
    const href = `/blog/${p.slug}`;
    if (seen.has(href)) continue;
    seen.add(href);
    out.push({
      href,
      anchor: p.title,
      reason: "Topic overlap with existing blog post",
    });
  }

  return out.slice(0, limit);
}
