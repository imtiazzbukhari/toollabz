/**
 * Lightweight discoverability audit (no crawl): thin related-tool graphs, thin blog interlinks,
 * and sitemap scale hints. Run: npx tsx scripts/seo-discoverability-heuristic.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { blogPosts } from "../lib/blog/registry";
import { buildSitemapEntries, sitemapPublicOrigin } from "../lib/content-engine/sitemap-data";
import { tools } from "../lib/tools/data";
import { getDirectoryGroup, toolsInDirectoryGroup, type DirectoryGroupId } from "../lib/tools/directory-groups";
import { HUB_FEATURED_BLOG_SLUGS } from "../lib/blog/hub-featured-slugs";

const OUT_DIR = path.join(process.cwd(), "reports");

const CLUSTER_GROUPS: DirectoryGroupId[] = ["finance", "developer", "business-saas", "utility"];

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const origin = sitemapPublicOrigin();
  const entries = buildSitemapEntries(new Date());

  const thinRelatedTools = tools
    .filter((t) => (t.related?.length ?? 0) < 4)
    .map((t) => ({
      slug: t.slug,
      group: getDirectoryGroup(t),
      relatedCount: t.related?.length ?? 0,
      url: `${origin}/tools/${t.slug}`,
    }))
    .sort((a, b) => a.relatedCount - b.relatedCount || a.slug.localeCompare(b.slug));

  const thinBlogInterlinks = blogPosts
    .map((p) => ({
      slug: p.slug,
      relatedPosts: p.relatedPostsSlugs?.length ?? 0,
      relatedTools: p.relatedToolSlugs?.length ?? 0,
      url: `${origin}/blog/${p.slug}`,
    }))
    .filter((p) => p.relatedPosts < 2 || p.relatedTools < 2)
    .sort((a, b) => a.relatedPosts - b.relatedPosts || a.slug.localeCompare(b.slug));

  const hubFeatured = [...new Set(Object.values(HUB_FEATURED_BLOG_SLUGS).flat())];
  const missingFromHub = hubFeatured.filter((slug) => !blogPosts.some((p) => p.slug === slug));

  const clusterPreview: Record<string, { toolCount: number; samplePaths: string[] }> = {};
  for (const g of CLUSTER_GROUPS) {
    const list = toolsInDirectoryGroup(tools, g);
    clusterPreview[g] = {
      toolCount: list.length,
      samplePaths: list.slice(0, 5).map((t) => `/tools/${t.slug}`),
    };
  }

  const lowImpressionHeuristic = {
    note: "True low-impression URLs require GSC export or Postgres gsc_page_daily; this block lists programmatic and niche routes to spot-check manually.",
    programmaticSalaryPaths: entries.filter((e) => e.loc.includes("/salary-after-tax/p/")).length,
    programmaticLoanPaths: entries.filter((e) => e.loc.includes("/loan-calculator/p/")).length,
    cmToFeetPaths: entries.filter((e) => e.loc.includes("/cm-to-feet/")).length,
  };

  const payload = {
    generatedAt: new Date().toISOString(),
    siteOrigin: origin,
    sitemapUrlCount: entries.length,
    thinRelatedTools: thinRelatedTools.slice(0, 80),
    thinBlogInterlinks: thinBlogInterlinks.slice(0, 60),
    hubFeaturedSlugsMissingInRegistry: missingFromHub,
    clusterPreview,
    lowImpressionHeuristic,
    actions: [
      "For each thinRelatedTools row: add one contextual inbound link from the matching hub or a sibling tool page.",
      "For each thinBlogInterlinks row: add 2 related posts + 2 related tools using real topical adjacency.",
      "Re-run npm run validate:blog-sitemap after blog manifest changes.",
      "Use reports/manual-indexing-priority.json for URL Inspection queue after substantive edits.",
    ],
  };

  writeFileSync(path.join(OUT_DIR, "seo-discoverability-heuristic.json"), JSON.stringify(payload, null, 2));
  console.log(`Wrote ${path.join(OUT_DIR, "seo-discoverability-heuristic.json")}`);
}

main();
