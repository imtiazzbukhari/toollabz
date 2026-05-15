import type { BlogPostResolved } from "./registry";
import { blogPostBySlug, blogPosts } from "./registry";

function scoreRelated(current: BlogPostResolved, candidate: BlogPostResolved): number {
  if (candidate.slug === current.slug) return -1;
  let s = 0;
  if (current.category && candidate.category === current.category) s += 4;
  const a = new Set((current.tags ?? []).map((t) => t.toLowerCase()));
  for (const t of candidate.tags ?? []) {
    if (a.has(t.toLowerCase())) s += 2;
  }
  const cur = `${current.slug} ${current.title} ${current.description}`.toLowerCase();
  const cand = `${candidate.slug} ${candidate.title}`.toLowerCase();
  for (const w of cur.split(/[^a-z0-9]+/).filter((x) => x.length > 4)) {
    if (cand.includes(w)) s += 0.25;
  }
  return s;
}

/** Curated or scored sibling posts for topical clusters (no URL changes). */
export function getRelatedBlogPostsForPost(current: BlogPostResolved, limit = 5): BlogPostResolved[] {
  const curated = (current.relatedPostsSlugs ?? []).flatMap((s) => {
    const p = blogPostBySlug(s);
    return p != null && p.slug !== current.slug ? [p] : [];
  });
  if (curated.length >= limit) return curated.slice(0, limit);

  const rest = blogPosts
    .filter((p) => p.slug !== current.slug && !curated.some((c) => c.slug === p.slug))
    .map((p) => ({ p, s: scoreRelated(current, p) }))
    .sort((a, b) => b.s - a.s || (a.p.publishedAt < b.p.publishedAt ? 1 : -1))
    .map((x) => x.p);

  const merged = [...curated, ...rest];
  return merged.slice(0, limit);
}
