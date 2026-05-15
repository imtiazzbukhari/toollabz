/**
 * Phase-2 SEO reports: indexability heuristics + GSC-oriented hints.
 * Run: npx tsx scripts/seo-phase2-reports.ts
 */
import { writeFileSync, mkdirSync, readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { HUB_FEATURED_BLOG_SLUGS } from "../lib/blog/hub-featured-slugs";
import { tools } from "../lib/tools/data";
import { buildSitemapEntries, sitemapPublicOrigin } from "../lib/content-engine/sitemap-data";
import { toolMetadata } from "../lib/seo";
import { toolsInDirectoryGroup } from "../lib/tools/directory-groups";
import { isHighIntentTool } from "../lib/tools/faq-expansion";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "reports");

function walkAppTsFiles(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkAppTsFiles(full, acc);
    else if (/\.(tsx|ts)$/.test(name)) acc.push(full);
  }
  return acc;
}

function scanNoindex(): { file: string; line: string }[] {
  const hits: { file: string; line: string }[] = [];
  const files = walkAppTsFiles(path.join(ROOT, "app"));
  for (const full of files) {
    const text = readFileSync(full, "utf8");
    if (/noindex:\s*true|robots:\s*\{[\s\S]*?noindex:\s*true/.test(text)) {
      const rel = path.relative(ROOT, full);
      const lines = text.split("\n");
      lines.forEach((line, i) => {
        if (line.includes("noindex") && line.includes("true")) hits.push({ file: rel, line: `${i + 1}: ${line.trim()}` });
      });
    }
  }
  return hits;
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const origin = sitemapPublicOrigin();
  const entries = buildSitemapEntries(new Date());
  const locs = new Set(entries.map((e) => e.loc));
  const toolUrls = tools.map((t) => `${origin}/tools/${t.slug}`);
  const missingInSitemap = toolUrls.filter((u) => !locs.has(u));

  const noindexHits = scanNoindex();

  const canonicalSamples = tools.slice(0, 40).map((t) => ({
    slug: t.slug,
    canonical: toolMetadata(t).alternates?.canonical,
  }));
  const badCanonical = canonicalSamples.filter((c) => c.canonical !== `/tools/${c.slug}`);

  const indexability = {
    generatedAt: new Date().toISOString(),
    siteOrigin: origin,
    summary: {
      toolCount: tools.length,
      sitemapUrlCount: entries.length,
      toolsMissingFromSitemap: missingInSitemap.length,
      noindexLinesFound: noindexHits.length,
      canonicalMismatchesInSample: badCanonical.length,
    },
    toolsMissingFromSitemap: missingInSitemap.slice(0, 200),
    noindexOccurrences: noindexHits.slice(0, 80),
    canonicalMismatchesSample: badCanonical,
    notes: [
      "Orphan detection and crawl depth require a live crawl or GSC export; this script only compares tool slugs to buildSitemapEntries.",
      "Review noindex hits manually-some are intentional (e.g. 404, dashboards).",
    ],
  };

  const priorityManualIndexing = [
    "/",
    "/tools",
    "/finance-tools",
    "/uk-finance-tax",
    "/business-tools",
    "/marketing-tools",
    "/real-estate-tools",
    ...tools.filter((t) => isHighIntentTool(t)).slice(0, 45).map((t) => `/tools/${t.slug}`),
  ];

  const titleTestCandidates = tools
    .filter((t) => isHighIntentTool(t))
    .map((t) => {
      const m = toolMetadata(t);
      return { slug: t.slug, title: m.title, reason: "High-intent category; monitor CTR vs queries in GSC" };
    })
    .slice(0, 60);

  const nearTermRanking = tools
    .filter((t) => isHighIntentTool(t) && t.keywords.length >= 5 && t.howToUse.length >= 4)
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      category: t.category,
      rationale: "Strong on-page depth signals (keywords + steps); good candidate for internal links from hubs",
    }))
    .slice(0, 40);

  const featuredBlogSlugs = [...new Set(Object.values(HUB_FEATURED_BLOG_SLUGS).flat())];
  const developerUtilityPaths = toolsInDirectoryGroup(tools, "developer").map((t) => `/tools/${t.slug}`);
  const ukFinanceToolSlugs = [
    "salary-after-tax-calculator-uk",
    "self-employed-tax-calculator-uk",
    "dividend-tax-calculator-uk",
    "freelance-day-rate-calculator",
    "zakat-calculator",
  ];
  const gstPaths = tools.filter((t) => t.slug.includes("gst") || t.slug === "gst-calculator-australia").map((t) => `/tools/${t.slug}`);
  const businessHighIntent = tools
    .filter((t) => isHighIntentTool(t) && (t.slug.includes("roas") || t.slug.includes("stripe") || t.slug.includes("break-even") || t.slug.includes("cac") || t.slug.includes("churn")))
    .map((t) => `/tools/${t.slug}`);

  const manualIndexingPriority: Array<{
    tier: "P0" | "P1" | "P2";
    url: string;
    reason: string;
    expectedSeoOpportunity: string;
  }> = [];

  manualIndexingPriority.push({
    tier: "P0",
    url: `${origin}/uk-finance-tax`,
    reason: "New topical hub; UK + AU GST + Zakat cluster; strong internal links from finance nav and long-form guides.",
    expectedSeoOpportunity: "Capture long-tail UK pay and dividend intent; support E-E-A-T with disclaimers and companion blogs.",
  });
  for (const slug of ukFinanceToolSlugs) {
    manualIndexingPriority.push({
      tier: "P0",
      url: `${origin}/tools/${slug}`,
      reason:
        slug === "zakat-calculator"
          ? "Zakat calculator and respectful explainer cluster; educational arithmetic only."
          : "UK YMYL-adjacent calculators tied to the UK hub and cluster posts.",
      expectedSeoOpportunity:
        slug === "zakat-calculator"
          ? "Long-tail planning queries with careful intent matching; pair with the Zakat blog guide."
          : "Branded and long-tail queries for take-home and sole trader planning sketches.",
    });
  }
  for (const p of gstPaths) {
    manualIndexingPriority.push({
      tier: "P0",
      url: `${origin}${p}`,
      reason: "GST Australia tool plus supporting blog; commercial intent for SMB invoicing.",
      expectedSeoOpportunity: "Inclusive-exclusive and invoice sanity-check queries.",
    });
  }
  for (const p of developerUtilityPaths.slice(0, 18)) {
    manualIndexingPriority.push({
      tier: "P1",
      url: `${origin}${p}`,
      reason: "Developer utilities with deterministic outputs; strong snippet and referral potential.",
      expectedSeoOpportunity: "JWT, JSON, SQL, YAML long-tail; linkable from docs and Stack threads.",
    });
  }
  for (const p of businessHighIntent) {
    manualIndexingPriority.push({
      tier: "P1",
      url: `${origin}${p}`,
      reason: "High-intent SaaS and marketplace math; cited in business hub and ROAS content.",
      expectedSeoOpportunity: "Founder and growth marketer queries with spreadsheet alternatives.",
    });
  }
  for (const slug of featuredBlogSlugs.slice(0, 22)) {
    manualIndexingPriority.push({
      tier: "P2",
      url: `${origin}/blog/${slug}`,
      reason: "Hub-featured cluster posts; backlink and discovery amplifiers for tool URLs.",
      expectedSeoOpportunity: "Informational depth, FAQ rich results, and internal equity to calculators.",
    });
  }

  const gscHints = {
    generatedAt: new Date().toISOString(),
    recommendedPriorityForManualIndexing: [...new Set(priorityManualIndexing)],
    pagesForTitleCtrExperiments: titleTestCandidates,
    pagesLikelyClosestToRankingGains: nearTermRanking,
    reminder: "Export actual impressions, queries, and positions from Google Search Console-lists above are heuristics only.",
  };

  writeFileSync(path.join(OUT_DIR, "seo-indexability-audit.json"), JSON.stringify(indexability, null, 2));
  writeFileSync(path.join(OUT_DIR, "gsc-optimization-hints.json"), JSON.stringify(gscHints, null, 2));
  writeFileSync(path.join(OUT_DIR, "manual-indexing-priority.json"), JSON.stringify({ generatedAt: new Date().toISOString(), rows: manualIndexingPriority }, null, 2));
  console.log(`Wrote ${path.join(OUT_DIR, "seo-indexability-audit.json")}`);
  console.log(`Wrote ${path.join(OUT_DIR, "gsc-optimization-hints.json")}`);
  console.log(`Wrote ${path.join(OUT_DIR, "manual-indexing-priority.json")}`);
}

main();
