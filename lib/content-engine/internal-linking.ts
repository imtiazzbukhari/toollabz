import { blogPosts } from "@/lib/blog/registry";
import { categories, tools } from "@/lib/tools/data";
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

/** Adjacent token pairs for slightly stronger topical overlap than single words alone. */
function bigrams(input: string): Set<string> {
  const words = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length >= 3 && !STOP.has(w));
  const out = new Set<string>();
  for (let i = 0; i < words.length - 1; i += 1) {
    out.add(`${words[i]} ${words[i + 1]}`);
  }
  return out;
}

function scoreOverlap(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of b) if (a.has(t)) n += 1;
  return n;
}

function categoryMatchBoost(topicLower: string, toolCategory: string): number {
  const cat = categories.find((c) => c.slug === toolCategory);
  if (!cat) return 0;
  const label = cat.name.toLowerCase();
  if (topicLower.includes(label)) return 3;
  if (topicLower.includes(toolCategory)) return 2;
  return 0;
}

/**
 * Suggest 2–4 contextual internal links (tools + relevant blog posts) for a topic string.
 */
export function suggestInternalLinks(topic: string, bodyPreview: string, limit = 4): InternalLinkSuggestion[] {
  const raw = `${topic} ${bodyPreview}`;
  const bag = tokens(raw);
  const bi = bigrams(raw);
  const topicLower = raw.toLowerCase();
  const out: InternalLinkSuggestion[] = [];
  const seen = new Set<string>();

  const toolScored = tools
    .map((t) => {
      const meta = `${t.name} ${t.slug} ${t.keywords.join(" ")} ${t.description}`;
      const bagT = tokens(meta);
      const biT = bigrams(meta);
      const tok = scoreOverlap(bag, bagT);
      const bg = scoreOverlap(bi, biT);
      const score = tok + bg * 2 + categoryMatchBoost(topicLower, t.category);
      return { t, score, tok, bg };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.t.name.localeCompare(b.t.name));

  for (const { t, tok, bg } of toolScored) {
    if (out.length >= limit) break;
    const href = `/tools/${t.slug}`;
    if (seen.has(href)) continue;
    seen.add(href);
    const parts = ["Topical match vs tool metadata"];
    if (bg > 0) parts.push("phrase overlap");
    if (tok > 0) parts.push("token overlap");
    out.push({
      href,
      anchor: t.name,
      reason: parts.join("; "),
    });
  }

  const postScored = blogPosts
    .map((p) => {
      const meta = `${p.title} ${p.description} ${p.slug}`;
      const bagP = tokens(meta);
      const biP = bigrams(meta);
      const score = scoreOverlap(bag, bagP) + scoreOverlap(bi, biP) * 2;
      return { p, score };
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
      reason: "Topic overlap with existing blog post (tokens + short phrases)",
    });
  }

  return out.slice(0, limit);
}
