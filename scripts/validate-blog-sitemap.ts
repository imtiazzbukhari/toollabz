/**
 * Validates that every published blog post slug appears exactly once in the sitemap
 * with parseable lastmod. Writes reports/blog-sitemap-validation.json
 *
 * Run: npx tsx scripts/validate-blog-sitemap.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { buildSitemapEntries, sitemapPublicOrigin } from "../lib/content-engine/sitemap-data";
import { blogPostSlugs, blogPosts } from "../lib/blog/registry";

const origin = sitemapPublicOrigin();

function main() {
  const entries = buildSitemapEntries(new Date());
  const byPath = new Map<string, { loc: string; lastmod?: string }>();
  const dupes: string[] = [];
  for (const e of entries) {
    const u = new URL(e.loc);
    if (u.origin !== origin) continue;
    const p = u.pathname;
    if (byPath.has(p)) dupes.push(p);
    byPath.set(p, { loc: e.loc, lastmod: e.lastmod });
  }

  const blogPaths = blogPostSlugs.map((s) => `/blog/${s}`);
  const missing: string[] = [];
  const extraBlogLocs: string[] = [];
  const badLastmod: string[] = [];

  for (const bp of blogPaths) {
    const row = byPath.get(bp);
    if (!row) {
      missing.push(bp);
      continue;
    }
    if (!row.lastmod || Number.isNaN(Date.parse(row.lastmod))) badLastmod.push(bp);
  }

  for (const [p, row] of byPath) {
    if (p.startsWith("/blog/") && p !== "/blog" && !blogPostSlugs.includes(p.slice("/blog/".length))) {
      extraBlogLocs.push(row.loc);
    }
  }

  const blogInSitemap = [...byPath.keys()].filter((p) => p.startsWith("/blog/") && p !== "/blog").length;

  const ok = missing.length === 0 && dupes.length === 0 && badLastmod.length === 0 && blogInSitemap === blogPostSlugs.length;

  const outDir = path.join(process.cwd(), "reports");
  mkdirSync(outDir, { recursive: true });
  const out = {
    generatedAt: new Date().toISOString(),
    origin,
    blogPostRegistryCount: blogPostSlugs.length,
    blogUrlsInSitemap: blogInSitemap,
    ok,
    missingBlogPaths: missing,
    duplicatePaths: [...new Set(dupes)],
    blogPathsWithInvalidLastmod: badLastmod,
    extraBlogUrlsNotInRegistry: extraBlogLocs.slice(0, 50),
    sampleBlogLastmods: blogPosts.slice(0, 5).map((p) => ({
      slug: p.slug,
      lastmod: byPath.get(`/blog/${p.slug}`)?.lastmod,
    })),
  };
  writeFileSync(path.join(outDir, "blog-sitemap-validation.json"), JSON.stringify(out, null, 2), "utf8");
  console.log(`[validate-blog-sitemap] ok=${ok} blogUrls=${blogInSitemap} registry=${blogPostSlugs.length}`);
  if (!ok) {
    console.error(JSON.stringify(out, null, 2));
    process.exitCode = 1;
  }
}

main();
