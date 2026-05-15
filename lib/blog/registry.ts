import { statSync } from "node:fs";
import path from "node:path";
import type { BlogAuthor, BlogPostDefinition } from "./types";
import { BLOG_ARTICLE_MODULE_ENTRIES } from "./articles.manifest";
import { DEFAULT_BLOG_AUTHOR } from "./default-author";

export type BlogPostResolved = Omit<
  BlogPostDefinition,
  "seoTitle" | "description" | "excerpt" | "publishedAt" | "relatedToolSlugs" | "author" | "tags" | "readingTimeMinutes"
> & {
  seoTitle: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  dateModified: string;
  relatedToolSlugs: string[];
  sourceFile: string;
  author: BlogAuthor;
  tags: string[];
  readingTimeMinutes: number;
};

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function looksLikeBlogPost(value: unknown): value is BlogPostDefinition {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<BlogPostDefinition>;
  return typeof v.slug === "string" && typeof v.title === "string" && typeof v.Article === "function";
}

function extractPostsFromModule(mod: Record<string, unknown>): BlogPostDefinition[] {
  const out: BlogPostDefinition[] = [];
  for (const value of Object.values(mod)) {
    if (looksLikeBlogPost(value)) out.push(value);
    else if (Array.isArray(value)) {
      value.forEach((it) => {
        if (looksLikeBlogPost(it)) out.push(it);
      });
    }
  }
  return out;
}

function fileDates(sourceFile: string): { publishedAt: string; dateModified: string } {
  try {
    const abs = path.join(process.cwd(), "lib", "blog", "articles", sourceFile);
    const st = statSync(abs);
    const iso = st.mtime.toISOString();
    return { publishedAt: toIsoDate(st.mtime), dateModified: iso };
  } catch {
    const now = new Date();
    return { publishedAt: toIsoDate(now), dateModified: now.toISOString() };
  }
}

function normalizePost(raw: BlogPostDefinition, sourceFile: string): BlogPostResolved {
  const { publishedAt: filePublishedAt, dateModified: fileModifiedIso } = fileDates(sourceFile);
  const title = raw.title.trim();
  const description = (raw.description ?? raw.excerpt ?? `${title} on Toollabz.`).trim();
  const excerpt = (raw.excerpt ?? description).trim();
  const baseSeo = (raw.seoTitle ?? title).trim();
  const seoTitle = baseSeo.includes("Toollabz") ? baseSeo : `${baseSeo} | Toollabz - Free Online Tools`;
  const publishedAt = (raw.publishedAt ?? filePublishedAt).trim();
  const rawDm = raw.dateModified?.trim();
  const dateModified =
    rawDm && !Number.isNaN(Date.parse(rawDm)) ? new Date(rawDm).toISOString() : fileModifiedIso;
  const author = raw.author ?? DEFAULT_BLOG_AUTHOR;
  const tags = [...(raw.tags ?? [])];
  const readingTimeMinutes =
    raw.readingTimeMinutes ?? Math.max(4, Math.min(25, Math.round((description.length + excerpt.length) / 700)));
  return {
    ...raw,
    title,
    seoTitle,
    description,
    excerpt,
    publishedAt,
    dateModified,
    relatedToolSlugs: [...(raw.relatedToolSlugs ?? [])],
    relatedPostsSlugs: [...(raw.relatedPostsSlugs ?? [])],
    keyTakeaways: [...(raw.keyTakeaways ?? [])],
    editorialNote: [...(raw.editorialNote ?? [])],
    sources: [...(raw.sources ?? [])],
    commonMistakes: [...(raw.commonMistakes ?? [])],
    whenToUseTools: [...(raw.whenToUseTools ?? [])],
    sourceFile,
    author,
    tags,
    readingTimeMinutes,
  };
}

const collected = BLOG_ARTICLE_MODULE_ENTRIES.flatMap(({ sourceFile, module }) =>
  extractPostsFromModule(module as Record<string, unknown>).map((p) => normalizePost(p, sourceFile)),
);

const deduped = new Map<string, BlogPostResolved>();
for (const post of collected) {
  if (!deduped.has(post.slug)) deduped.set(post.slug, post);
}

export const blogPosts: BlogPostResolved[] = [...deduped.values()].sort((a, b) =>
  a.publishedAt < b.publishedAt ? 1 : -1,
);

export function blogPostBySlug(slug: string): BlogPostResolved | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export const blogPostSlugs = blogPosts.map((p) => p.slug);
