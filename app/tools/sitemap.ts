import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools/data";
import { SITE_LAST_UPDATED_ISO } from "@/lib/site-freshness";

const BASE_URL = "https://toollabz.com";
const TOOLS_PER_SITEMAP = 200;

export async function generateSitemaps() {
  const indexable = tools.filter((tool) => !tool.slug.startsWith("embed"));
  const count = Math.max(1, Math.ceil(indexable.length / TOOLS_PER_SITEMAP));
  return Array.from({ length: count }, (_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const start = id * TOOLS_PER_SITEMAP;
  const lastModified = new Date(`${SITE_LAST_UPDATED_ISO}T12:00:00.000Z`);
  return tools
    .filter((tool) => !tool.slug.startsWith("embed"))
    .slice(start, start + TOOLS_PER_SITEMAP)
    .map((tool) => ({
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));
}
