import { renderSitemapXml, type SitemapEntry } from "@/lib/content-engine/sitemap-data";
import { setSystemStatus } from "@/lib/content-engine/system-status";
import { cacheGet, cacheSet } from "@/lib/cache/unified-cache";
import { categories } from "@/lib/tools/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITEMAP_CACHE_KEY = "sitemap:pages:xml:v1";
const BASE_URL = "https://toollabz.com";

function pageSitemapEntries(now = new Date()): SitemapEntry[] {
  const nowIso = now.toISOString();
  const staticPages: Array<{ path: string; priority: number; changefreq: SitemapEntry["changefreq"]; lastmod?: string }> = [
    { path: "/", priority: 1.0, changefreq: "daily", lastmod: nowIso },
    { path: "/tools", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/blog", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/research", priority: 0.7, changefreq: "monthly", lastmod: nowIso },
    { path: "/finance-tools", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/business-tools", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/developer-tools", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/pdf-tools", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/utility-tools", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/real-estate-tools", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/marketing-tools", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/ai-tools", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/uk-finance-tax", priority: 0.8, changefreq: "weekly", lastmod: nowIso },
    { path: "/about", priority: 0.5, changefreq: "yearly", lastmod: "2026-06-01T00:00:00.000Z" },
    { path: "/contact", priority: 0.4, changefreq: "yearly", lastmod: "2026-06-01T00:00:00.000Z" },
    { path: "/privacy", priority: 0.4, changefreq: "yearly", lastmod: "2026-06-01T00:00:00.000Z" },
    { path: "/terms", priority: 0.4, changefreq: "yearly", lastmod: "2026-06-01T00:00:00.000Z" },
    { path: "/disclaimer", priority: 0.4, changefreq: "yearly", lastmod: "2026-06-01T00:00:00.000Z" },
  ];
  return [
    ...staticPages.map((entry) => ({
      loc: `${BASE_URL}${entry.path}`,
      priority: entry.priority,
      changefreq: entry.changefreq,
      lastmod: entry.lastmod,
    })),
    ...categories.map((category) => ({
      loc: `${BASE_URL}/category/${category.slug}`,
      priority: 0.7,
      changefreq: "weekly" as const,
      lastmod: nowIso,
    })),
  ];
}

export async function GET() {
  const cached = await cacheGet(SITEMAP_CACHE_KEY);
  if (cached) {
    return new Response(cached, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }
  setSystemStatus({ name: "sitemap-generator", status: "running" });
  try {
    const xml = renderSitemapXml(pageSitemapEntries(new Date()));
    await cacheSet(SITEMAP_CACHE_KEY, xml, 3600);
    setSystemStatus({ name: "sitemap-generator", status: "idle" });
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    setSystemStatus({
      name: "sitemap-generator",
      status: "failed",
      error: error instanceof Error ? error.message : "sitemap_generation_failed",
    });
    return new Response("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>", {
      status: 500,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
