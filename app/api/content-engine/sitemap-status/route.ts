import { buildSitemapEntries } from "@/lib/content-engine/sitemap-data";
import { getSystemStatuses } from "@/lib/content-engine/system-status";
import { siteUrl } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const errors: string[] = [];
  let accessible = false;
  try {
    const res = await fetch(`${siteUrl}/sitemap.xml`, { method: "GET", cache: "no-store" });
    accessible = res.ok;
    if (!res.ok) errors.push(`sitemap_http_${res.status}`);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "sitemap_fetch_failed");
  }
  const urlCount = buildSitemapEntries(new Date()).length;
  const sitemapSystem = getSystemStatuses().find((s) => s.name === "sitemap-generator");
  return Response.json({
    accessible,
    urlCount,
    lastGenerated: sitemapSystem?.lastRun ?? null,
    errors: errors.length ? errors : undefined,
  });
}
