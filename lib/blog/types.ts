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
  author?: BlogAuthor;
  Article: () => ReactNode;
};
