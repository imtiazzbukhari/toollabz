import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { blogPosts } from "@/lib/blog/registry";
import { categories, tools } from "@/lib/tools/data";
import { siteUrl as configuredSiteUrl } from "@/lib/seo";
import { SITEMAP_CM_TO_FEET_SLUGS, SITEMAP_LOAN_PRINCIPALS, SITEMAP_SALARY_GROSS } from "@/lib/sitemap-programmatic";
import { GLOSSARY_TERMS } from "@/lib/glossary/terms";
import { SITE_LAST_UPDATED_DATE_TIME } from "@/lib/site-freshness";

/** Never emit raw IPs or non-public hosts in sitemap `<loc>` URLs. */
export function sitemapPublicOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const tryUrl = (s: string) => {
    const normalized = /^https?:\/\//i.test(s) ? s : `https://${s}`;
    const u = new URL(normalized);
    const host = u.hostname.toLowerCase();
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return null;
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") return null;
    if (host.startsWith("[") && host.includes("]")) return null;
    u.protocol = "https:";
    if (host.startsWith("www.")) u.hostname = host.slice(4);
    return u.origin.replace(/\/$/, "");
  };
  if (raw) {
    const o = tryUrl(raw);
    if (o) return o;
  }
  try {
    const o = tryUrl(configuredSiteUrl);
    if (o) return o;
  } catch {
    /* ignore */
  }
  return "https://toollabz.com";
}

const siteUrl = sitemapPublicOrigin();

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
};

const TOP_TOOLS = new Set([
  "loan-calculator",
  "salary-after-tax-calculator",
  "vat-calculator",
  "paycheck-calculator-usa",
  "roi-calculator",
  "pdf-merge",
  "pdf-compress",
  "net-worth-calculator",
  "compound-interest-calculator",
  "ai-content-humanizer",
  "break-even-calculator",
  "profit-margin-calculator",
  "currency-converter",
  "json-validator",
  "mortgage-affordability-calculator",
  "credit-card-payoff-calculator",
  "emi-calculator",
  "invoice-generator",
  "budget-planner-monthly-usa",
  "retirement-age-calculator",
]);

function getToolPriority(slug: string): number {
  return TOP_TOOLS.has(slug) ? 0.8 : 0.7;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

/** Stable ISO-8601 lastmod for blog URLs (falls back to published date). */
export function blogPostSitemapLastMod(post: { publishedAt: string; dateModified: string }): string {
  const dm = post.dateModified?.trim();
  if (dm && !Number.isNaN(Date.parse(dm))) return new Date(dm).toISOString();
  const pub = post.publishedAt?.trim();
  if (pub) {
    const t = Date.parse(pub);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }
  return new Date().toISOString();
}

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

/**
 * Page sitemap (hubs, legal, EEAT, categories, glossary, high-tier programmatic).
 * Tools and blog posts are intentionally omitted — they live in sharded sitemaps
 * advertised separately in robots.txt (avoids duplicate URLs across sitemap files).
 */
export function buildPageSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const seen = new Set<string>();
  // Prefer the editorial freshness stamp over request-time "now" (more honest lastmod).
  const contentStamp = SITE_LAST_UPDATED_DATE_TIME;
  const stableLegal = "2026-06-01T00:00:00.000Z";

  const staticPages: Array<{
    path: string;
    priority: number;
    changefreq: NonNullable<SitemapEntry["changefreq"]>;
    lastmod: string;
  }> = [
    { path: "/", priority: 1.0, changefreq: "daily", lastmod: contentStamp },
    { path: "/tools", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/blog", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/research", priority: 0.7, changefreq: "monthly", lastmod: contentStamp },
    { path: "/pricing", priority: 0.4, changefreq: "yearly", lastmod: stableLegal },
    { path: "/finance-tools", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/business-tools", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/developer-tools", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/pdf-tools", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/utility-tools", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/real-estate-tools", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/marketing-tools", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/ai-tools", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/uk-finance-tax", priority: 0.8, changefreq: "weekly", lastmod: contentStamp },
    { path: "/about", priority: 0.5, changefreq: "yearly", lastmod: stableLegal },
    { path: "/contact", priority: 0.4, changefreq: "yearly", lastmod: stableLegal },
    { path: "/methodology", priority: 0.55, changefreq: "monthly", lastmod: contentStamp },
    { path: "/editorial-policy", priority: 0.5, changefreq: "monthly", lastmod: contentStamp },
    { path: "/glossary", priority: 0.6, changefreq: "monthly", lastmod: contentStamp },
    { path: "/team/imtiaz-ahmad", priority: 0.45, changefreq: "yearly", lastmod: contentStamp },
    { path: "/team/editorial", priority: 0.45, changefreq: "yearly", lastmod: contentStamp },
    { path: "/privacy", priority: 0.4, changefreq: "yearly", lastmod: stableLegal },
    { path: "/terms", priority: 0.4, changefreq: "yearly", lastmod: stableLegal },
    { path: "/disclaimer", priority: 0.4, changefreq: "yearly", lastmod: stableLegal },
  ];

  for (const page of staticPages) {
    add(entries, seen, page.path, page.priority, page.changefreq, page.lastmod);
  }
  categories.forEach((category) => add(entries, seen, `/category/${category.slug}`, 0.7, "weekly", contentStamp));
  GLOSSARY_TERMS.forEach((term) => add(entries, seen, `/glossary/${term.slug}`, 0.55, "monthly", contentStamp));
  // High-tier programmatic only — never include noindex stubs here.
  SITEMAP_CM_TO_FEET_SLUGS.forEach((cm) =>
    add(entries, seen, `/cm-to-feet/${cm}-cm-to-feet`, 0.65, "monthly", contentStamp),
  );
  SITEMAP_LOAN_PRINCIPALS.forEach((amount) =>
    add(entries, seen, `/loan-calculator/p/${amount}`, 0.65, "monthly", contentStamp),
  );
  SITEMAP_SALARY_GROSS.forEach((amount) =>
    add(entries, seen, `/salary-after-tax/p/${amount}`, 0.65, "monthly", contentStamp),
  );
  return entries;
}

/** Full inventory for tests/dashboard: page sitemap + tool URLs + blog URLs (deduped). */
// Optional Date arg retained for call-site compatibility; lastmod uses SITE_LAST_UPDATED.
export function buildSitemapEntries(_now?: Date): SitemapEntry[] {
  void _now;
  const entries = buildPageSitemapEntries();
  const seen = new Set(entries.map((e) => e.loc));
  const contentStamp = SITE_LAST_UPDATED_DATE_TIME;

  tools.forEach((tool) => add(entries, seen, `/tools/${tool.slug}`, getToolPriority(tool.slug), "monthly", contentStamp));
  blogPosts.forEach((post) => {
    const m = blogPostSitemapLastMod(post);
    add(entries, seen, `/blog/${post.slug}`, 0.7, "yearly", m);
  });
  generatedPaths().forEach((p) => add(entries, seen, p, 0.7, "weekly", contentStamp));
  return entries;
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
  const rows = entries
    .map((e) => {
      const lastmod = e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : "";
      const changefreq = e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : "";
      const priority = typeof e.priority === "number" ? `<priority>${e.priority.toFixed(2)}</priority>` : "";
      return `<url><loc>${escapeXml(e.loc)}</loc>${lastmod}${changefreq}${priority}</url>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${rows}</urlset>`;
}
