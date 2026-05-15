# Phase 3 - Content authority, internal linking, blog expansion (report)

_Generated as part of Toollabz Phase 3. Run `npm run validate:blog-sitemap` after adding posts; `reports/blog-sitemap-validation.json` is overwritten._

## New long-form posts (15)

| Slug | Topic cluster |
|------|----------------|
| `roi-vs-roas-when-to-trust-each-metric` | Marketing / paid media |
| `markup-vs-margin-formulas-pricing-mistakes` | Finance / pricing |
| `gross-profit-vs-net-profit-explained-for-operators` | Finance / P&L |
| `how-loan-amortization-schedules-work-principal-interest` | Finance / credit |
| `rental-yield-vs-monthly-cash-flow-investment-property` | Real estate |
| `apr-vs-interest-rate-mortgage-auto-loans` | Finance / credit |
| `salary-after-tax-explained-withholdings-deductions-net-pay` | Finance / payroll |
| `merge-pdf-without-losing-quality-metadata-fonts` | PDF |
| `compress-pdf-safely-for-email-and-archiving` | PDF |
| `best-free-pdf-workflows-merge-split-compress-archiving` | PDF |
| `how-ai-content-detectors-work-limits-ethics` | AI |
| `ai-prompts-small-business-templates-operations-sales-support` | AI |
| `ai-text-humanization-editorial-workflow-beyond-spinning` | AI |
| `json-formatting-and-validation-explained-developer` | Developer |
| `regex-beginner-guide-practical-patterns-toollabz` | Developer |

**Note on break-even:** The site already has `break-even-analysis-formula-examples-calculator`. A separate “how to calculate break-even” article would duplicate intent; new finance posts link into that canonical piece instead.

## Sitemap + indexing

- **Inclusion:** `buildSitemapEntries` emits one URL per registry blog slug; `blogPostSitemapLastMod` uses `dateModified` when valid, else `publishedAt`, else `now` (`lib/content-engine/sitemap-data.ts`).
- **Duplicates:** `add()` dedupes by full `<loc>` string; SEO test asserts unique URLs and one row per blog slug.
- **Canonical alignment:** Blog `generateMetadata` uses `alternates.canonical: /blog/${slug}`; sitemap uses the same path on `sitemapPublicOrigin()` - match by pathname.
- **lastmod:** Vitest asserts every `/blog/{slug}` sitemap row has parseable ISO `lastmod`.
- **robots.txt:** Existing test confirms `Sitemap: {origin}/sitemap.xml` matches sitemap origin.
- **Validation artifact:** `reports/blog-sitemap-validation.json` (from `npm run validate:blog-sitemap`).

**Blog URL count (latest run):** See `blogUrlsInSitemap` in `reports/blog-sitemap-validation.json` (equals `blogPostRegistryCount` when no orphan blog URLs exist).

## Blog UX / EEAT (architecture)

- **Table of contents:** `tableOfContents` on each new post; rendered in `app/blog/[slug]/page.tsx`.
- **Reading progress:** Lightweight `BlogReadingProgress` client bar (fixed 0.5px height).
- **Key takeaways / editorial note / sources / common mistakes / when to use tools:** Optional fields on `BlogPostDefinition`, rendered on the blog template; `registry.normalizePost` prefers explicit `dateModified` when parseable.
- **Related posts:** `getRelatedBlogPostsForPost` uses `relatedPostsSlugs` when present, else scored neighbors (`lib/blog/related-posts.ts`).
- **Reviewed line:** Visible “Reviewed” date uses `SITE_LAST_UPDATED_ISO` / `formatSiteLastUpdatedForDisplay()` alongside `publishedAt` (not a fabricated author credential).

## Internal linking + clusters

- Machine-readable map: `reports/phase3-internal-linking-and-clusters.json`.
- **Policy:** Descriptive anchors, 5–12 internal links per new article where relevant, cross-links between cluster siblings (finance, PDF, AI, developer hubs).

## Performance / safety

- No new heavy charting libraries for blog.
- Reading progress uses passive scroll listener and a thin fixed bar to avoid layout shift.

## SEO warnings + manual indexing

- **Warnings:** Long-form TSX content should be spot-checked in staging for factual claims (finance/legal/health). Toollabz copy is educational, not individualized advice.
- **Manual indexing:** After deploy, request indexing in Search Console for: `/blog` (if needed) and each of the 15 new article URLs; confirm `sitemap.xml` fetch succeeds.

## Commands

```bash
npm run blog:manifest
npm run validate:blog-sitemap
npx vitest run tests/seo-site.test.ts
```
