import { statSync } from "node:fs";
import path from "node:path";
import type { BlogPostDefinition } from "./types";
import { BLOG_ARTICLE_MODULE_ENTRIES } from "./articles.manifest";

export type BlogPostResolved = Omit<BlogPostDefinition, "seoTitle" | "description" | "excerpt" | "publishedAt" | "relatedToolSlugs"> & {
  seoTitle: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  dateModified: string;
  relatedToolSlugs: string[];
  sourceFile: string;
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
  const { publishedAt: filePublishedAt, dateModified } = fileDates(sourceFile);
  const title = raw.title.trim();
  const description = (raw.description ?? raw.excerpt ?? `${title} on Toollabz.`).trim();
  const excerpt = (raw.excerpt ?? description).trim();
  const seoTitle = (raw.seoTitle ?? `${title} | Toollabz`).trim();
  const publishedAt = (raw.publishedAt ?? filePublishedAt).trim();
  return {
    ...raw,
    title,
    seoTitle,
    description,
    excerpt,
    publishedAt,
    dateModified,
    relatedToolSlugs: [...(raw.relatedToolSlugs ?? [])],
    sourceFile,
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
