import { NextResponse } from "next/server";
import { isNonDefaultLocale } from "@/lib/i18n/locales";
import { LOCALIZED_STATIC_PATHS, LOCALIZED_TOOL_SLUGS } from "@/lib/i18n/catalog";
import { localizePath } from "@/lib/i18n/paths";
import { hreflangPathPairs } from "@/lib/i18n/hreflang";
import { sitemapPublicOrigin } from "@/lib/content-engine/sitemap-data";
import { SITE_LAST_UPDATED_DATE_TIME } from "@/lib/site-freshness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET(_req: Request, ctx: { params: Promise<{ locale: string }> }) {
  const { locale } = await ctx.params;
  if (!isNonDefaultLocale(locale)) {
    return new NextResponse("Not Found", { status: 404 });
  }
  const origin = sitemapPublicOrigin();
  const englishPaths = [
    ...LOCALIZED_STATIC_PATHS,
    ...LOCALIZED_TOOL_SLUGS.map((slug) => `/tools/${slug}`),
  ];
  const lastmod = SITE_LAST_UPDATED_DATE_TIME;
  const urls = englishPaths
    .map((englishPath) => {
      const loc = `${origin}${localizePath(englishPath, locale)}`;
      const alts = hreflangPathPairs(englishPath)
        .map((a) => `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escapeXml(`${origin}${a.href}`)}"/>`)
        .join("");
      return `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.70</priority>${alts}</url>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
