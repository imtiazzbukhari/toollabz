import { buildSitemapEntries, renderSitemapXml } from "@/lib/content-engine/sitemap-data";
import { setSystemStatus } from "@/lib/content-engine/system-status";
import { cacheGet, cacheSet } from "@/lib/cache/unified-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITEMAP_CACHE_KEY = "sitemap:xml:v1";

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
    const xml = renderSitemapXml(buildSitemapEntries(new Date()));
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
