import { siteUrl } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /login",
    "Disallow: /login/",
    "Disallow: /signup",
    "Disallow: /signup/",
    "Disallow: /api/",
    "Disallow: /seo-growth-console",
    "Disallow: /seo-growth-console/",
    "Disallow: /api/seo-console/",
    "Disallow: /api/outreach/",
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join("\n");
  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
