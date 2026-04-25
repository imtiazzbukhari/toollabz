import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { blogPosts } from "@/lib/blog/registry";
import { categories, tools } from "@/lib/tools/data";
import { siteUrl } from "@/lib/seo";
import { SITEMAP_CM_TO_FEET_SLUGS, SITEMAP_LOAN_PRINCIPALS, SITEMAP_SALARY_GROSS } from "@/lib/sitemap-programmatic";

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: number;
};

function add(entries: SitemapEntry[], seen: Set<string>, pathName: string, priority: number, changefreq: SitemapEntry["changefreq"] = "weekly", lastmod?: string) {
  const cleanPath = pathName.startsWith("/") ? pathName : `/${pathName}`;
  const loc = `${siteUrl}${cleanPath}`;
  if (seen.has(loc)) return;
  seen.add(loc);
  entries.push({ loc, priority, changefreq, lastmod });
}

function generatedPaths(): string[] {
  const filePath = path.join(process.cwd(), "lib", "content-engine", "generated", "keywords.json");
  if (!existsSync(filePath)) return [];
  try {
    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as {
      items?: Array<{ keyword?: string; blog?: { result?: { draft?: { slugSuggestion?: string } } }; tool?: { spec?: { slug?: string } } }>;
    };
    const rows = Array.isArray(parsed.items) ? parsed.items : [];
    const out: string[] = [];
    for (const row of rows) {
      const blogSlug = row.blog?.result?.draft?.slugSuggestion?.trim();
      const toolSlug = row.tool?.spec?.slug?.trim();
      if (blogSlug) out.push(`/blog/${blogSlug.replace(/^\/+/, "")}`);
      if (toolSlug) out.push(`/tools/${toolSlug.replace(/^\/+/, "")}`);
    }
    return out;
  } catch {
    return [];
  }
}

export function buildSitemapEntries(now = new Date()): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const seen = new Set<string>();
  const nowIso = now.toISOString();
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
  ].forEach((p) => add(entries, seen, p, p === "/" ? 1 : 0.82, "weekly", nowIso));

  categories.forEach((category) => add(entries, seen, `/category/${category.slug}`, 0.8, "weekly", nowIso));
  tools.forEach((tool) => add(entries, seen, `/tools/${tool.slug}`, 0.86, "weekly", nowIso));
  blogPosts.forEach((post) => {
    const m = Number.isNaN(Date.parse(post.dateModified)) ? nowIso : new Date(post.dateModified).toISOString();
    add(entries, seen, `/blog/${post.slug}`, 0.76, "weekly", m);
  });

  SITEMAP_CM_TO_FEET_SLUGS.forEach((cm) => add(entries, seen, `/cm-to-feet/${cm}-cm-to-feet`, 0.72, "monthly", nowIso));
  SITEMAP_LOAN_PRINCIPALS.forEach((amount) => add(entries, seen, `/loan-calculator/p/${amount}`, 0.72, "monthly", nowIso));
  SITEMAP_SALARY_GROSS.forEach((amount) => add(entries, seen, `/salary-after-tax/p/${amount}`, 0.72, "monthly", nowIso));
  generatedPaths().forEach((p) => add(entries, seen, p, 0.7, "weekly", nowIso));
  return entries;
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
  const rows = entries
    .map((e) => {
      const lastmod = e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : "";
      const changefreq = e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : "";
      const priority = typeof e.priority === "number" ? `<priority>${e.priority.toFixed(2)}</priority>` : "";
      return `<url><loc>${e.loc}</loc>${lastmod}${changefreq}${priority}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${rows}</urlset>`;
}
