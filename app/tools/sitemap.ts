import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools/data";

const BASE_URL = "https://toollabz.com";
const TOOLS_PER_SITEMAP = 200;

export async function generateSitemaps() {
  const count = Math.ceil(tools.length / TOOLS_PER_SITEMAP);
  return Array.from({ length: count }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const start = id * TOOLS_PER_SITEMAP;
  return tools
    .filter((tool) => !tool.slug.startsWith("embed"))
    .slice(start, start + TOOLS_PER_SITEMAP)
    .map((tool) => ({
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));
}
