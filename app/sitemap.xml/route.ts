import { buildSitemapEntries, renderSitemapXml } from "@/lib/content-engine/sitemap-data";
import { setSystemStatus } from "@/lib/content-engine/system-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  setSystemStatus({ name: "sitemap-generator", status: "running" });
  try {
    const xml = renderSitemapXml(buildSitemapEntries(new Date()));
    setSystemStatus({ name: "sitemap-generator", status: "idle" });
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
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
