import type { ReactNode } from "react";

export type BlogPostDefinition = {
  slug: string;
  /** Shown in <title> / sharing */
  seoTitle: string;
  /** Meta description */
  description: string;
  /** Visible H1 */
  title: string;
  excerpt: string;
  publishedAt: string;
  /** FAQ structured data + rendered FAQ section */
  faqSchema?: Array<{ question: string; answer: string }>;
  /** Shown after the article for internal discovery + SEO depth */
  relatedToolSlugs?: string[];
  Article: () => ReactNode;
};
