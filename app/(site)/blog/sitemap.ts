import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog/registry";

const BASE_URL = "https://toollabz.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    ...(post.hasExplicitDateModified ? { lastModified: new Date(post.dateModified) } : {}),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}
