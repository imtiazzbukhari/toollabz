import type { ReactNode } from "react";

export type BlogAuthor = {
  name: string;
  jobTitle?: string;
  bio: string;
  /** Path on this site, e.g. /about */
  profilePath?: string;
  /** Public path under /public */
  imageSrc?: string;
};

export type BlogPostDefinition = {
  slug: string;
  /** Shown in <title> / sharing */
  seoTitle?: string;
  /** Meta description */
  description?: string;
  /** Visible H1 */
  title: string;
  excerpt?: string;
  publishedAt?: string;
  /** ISO-8601 timestamp used for sitemap/Article schema freshness */
  dateModified?: string;
  /** FAQ structured data + rendered FAQ section */
  faqSchema?: Array<{ question: string; answer: string }>;
  /** Shown after the article for internal discovery + SEO depth */
  relatedToolSlugs?: string[];
  /** Optional topic label for hub pages */
  category?: string;
  tags?: string[];
  /** Rough reading time shown in the template */
  readingTimeMinutes?: number;
  /** In-page anchors for table of contents */
  tableOfContents?: Array<{ id: string; label: string }>;
  /** Curated sibling posts for topical clusters (slugs must exist in registry). */
  relatedPostsSlugs?: string[];
  /** Snippet-friendly bullets shown above the article body */
  keyTakeaways?: string[];
  /** Short editorial framing (no fabricated credentials) */
  editorialNote?: string[];
  /** Optional references (prefer primary sources you actually cite in prose) */
  sources?: Array<{ label: string; href?: string }>;
  /** “Common mistakes” callouts rendered after the article */
  commonMistakes?: Array<{ title: string; body: string }>;
  /** When this guidance pairs best with live calculators */
  whenToUseTools?: string[];
  author?: BlogAuthor;
  Article: () => ReactNode;
};
