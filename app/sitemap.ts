import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog/registry";
import { categories, tools } from "@/lib/tools/data";
import { siteUrl } from "@/lib/seo";
import { SITEMAP_CM_TO_FEET_SLUGS, SITEMAP_LOAN_PRINCIPALS, SITEMAP_SALARY_GROSS } from "@/lib/sitemap-programmatic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  const push = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" = "weekly",
    lastModified: Date = now,
  ) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${siteUrl}${cleanPath}`;
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({
      url,
      lastModified,
      changeFrequency,
      priority,
    });
  };

  [
    "/",
    "/tools",
    "/blog",
    "/pricing",
    "/about",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/contact",
    "/finance-tools",
    "/business-tools",
    "/real-estate-tools",
    "/ai-tools",
    "/utility-tools",
    "/pdf-tools",
    "/developer-tools",
    "/marketing-tools",
  ].forEach((path) => push(path, path === "/" ? 1 : 0.82, "weekly"));

  categories.forEach((category) => push(`/category/${category.slug}`, 0.8, "weekly"));
  tools.forEach((tool) => push(`/tools/${tool.slug}`, 0.86, "weekly"));
  blogPosts.forEach((post) => {
    const lastModified = Number.isNaN(Date.parse(post.dateModified)) ? now : new Date(post.dateModified);
    push(`/blog/${post.slug}`, 0.76, "weekly", lastModified);
  });

  // Top programmatic examples only (full sets remain on-site; sitemap stays lean).
  SITEMAP_CM_TO_FEET_SLUGS.forEach((cm) => {
    push(`/cm-to-feet/${cm}-cm-to-feet`, 0.72, "monthly");
  });

  SITEMAP_LOAN_PRINCIPALS.forEach((amount) => {
    push(`/loan-calculator/p/${amount}`, 0.72, "monthly");
  });
  SITEMAP_SALARY_GROSS.forEach((amount) => {
    push(`/salary-after-tax/p/${amount}`, 0.72, "monthly");
  });

  return entries;
}
