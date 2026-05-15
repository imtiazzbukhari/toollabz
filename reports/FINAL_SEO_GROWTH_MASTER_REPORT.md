# Final SEO growth and authority report (Toollabz)

_Generated as part of the controlled “final hardening” pass. Operational numbers require your live Search Console, Postgres data plane, and (optionally) a local crawl._

## Executive summary

Toollabz now pairs **deterministic calculators**, **clustered blog explainers**, and **hub pages** with a Postgres-backed **GSC/GA4 data plane**. This report consolidates what shipped in-repo, what to run in production for evidence, and where the next marginal wins sit without mass thin pages or speculative AI systems.

## Part 1 - Typography (em dash cleanup)

**Done in code:** Long em dashes (`-`) were removed or rewritten across expansion tool definitions, expansion compute copy, `phase1-seo-expansion-batch1.ts`, `phase2-seo-expansion-batch2.ts`, `phase1-seo.ts`, and selected content-engine templates (`ctr-suggestions`, AdSense placement guide, dashboard sprint helpers, outreach templates). FAQ answers in expansion batches now favor commas, periods, and semicolons instead of “No - …” cadence.

**Explicitly avoided:** JSON-LD builders, raw JSON fixtures, formulas, and API response shapes were not targeted for punctuation edits.

## Part 2 - Content depth (priority tools)

**Expanded (SEO profiles / FAQs):**

- `jwt-decoder`, `sql-formatter`, `gst-calculator-australia`, `zakat-calculator` in `lib/tools/phase1-seo-expansion-batch1.ts` (worked examples, incident-style JWT FAQ, GST inclusive math callout, FX consistency for Zakat planning, CTE note for SQL).
- `self-employed-tax-calculator-uk`, `dividend-tax-calculator-uk`, `stripe-fee-calculator`, `roas-calculator` in `lib/tools/phase2-seo-expansion-batch2.ts` (payments on account, effective dividend % derivation, Stripe line-item reconciliation, attribution-window caveat for ROAS).

**Still editorially owned:** UK tax tools remain **non-advice sketches**; keep disclaimers visible wherever numbers touch HMRC-sensitive topics.

## Part 3 - Internal linking (final hub pass)

**Shipped:**

- `components/CategoryHubLongform.tsx` now supports optional **cluster navigation** for `developer`, `finance`, `business-saas`, and `utility` directory groups (contextual tool + blog links, varied anchors).
- `lib/blog/hub-featured-slugs.ts` now surfaces **cluster guides** on finance, business, utility, and developer hubs (UK tax, ROAS/churn, working days / imperial, JSON/JWT/SQL pipelines).

**How to measure weak links and orphans:**

1. `BASE_URL=https://YOUR_ORIGIN npx tsx scripts/audit-internal-links.ts` (requires a running site; reports orphan-ish URLs and broken targets).
2. `npx tsx scripts/seo-phase2-reports.ts` → `reports/seo-indexability-audit.json` compares **every tool slug** to `buildSitemapEntries` (catches sitemap gaps, not crawl depth).

**Strong authority hubs (curated):**

| Hub | Route | Role |
| --- | --- | --- |
| Developer tools | `/developer-tools` | JSON/JWT/SQL/regex/YAML cluster |
| Finance tools | `/finance-tools` | Global finance directory + UK cluster entry |
| UK finance and tax | `/uk-finance-tax` | UK + AU GST + Zakat narrative hub |
| Business / SaaS | `/business-tools` | ROAS, churn, CAC, fees, seat economics |
| Utilities / converters | `/utility-tools` | Measurement + business-day SLAs |

## Part 4 - Topical hub pages

| Required hub | Implementation |
| --- | --- |
| Developer tools hub | `/developer-tools` + long-form `CategoryHubLongform` + cluster nav + featured guides |
| UK finance and tax hub | **`/uk-finance-tax`** (new): comparison table, curated tools, guides, FAQs, cross-links to `/finance-tools` and `/business-tools` |
| Business growth hub | `/business-tools` + cluster nav + expanded featured posts |
| Converter and utility hub | `/utility-tools` + cluster nav + measurement / SLA guides |

The new UK hub is listed in `lib/content-engine/sitemap-data.ts` with the same priority band as other marketing hubs.

## Part 5 - GSC-driven optimization (real stored data)

**Code:** `lib/content-engine/seo-metrics/real-opportunities.ts` already classifies high-impression/low-CTR URLs, near-page-one bands, declining clicks, rising clicks, and cannibalized queries using **`gsc_page_daily`** + **`gsc_query_page_daily`**.

**Run locally / CI with secrets:**

```bash
export DATABASE_URL="postgres://..."
export GSC_SITE_URL="sc-domain:toollabz.com"   # must match ingested site_url
npm run seo:print-gsc-opportunities
```

Output: `reports/gsc-db-opportunities.md` (includes optional CTR title/meta lab ideas for eligible URLs via `suggestSerpVariantsForPage`).

## Part 6 - Indexing and discovery

**Automated checks:**

- `npm run validate:blog-sitemap` - blog manifest vs sitemap entries.
- `npx tsx scripts/seo-phase2-reports.ts` - tool coverage vs sitemap, canonical samples, noindex scan.

**Manual indexing priority (seed list):** see `reports/gsc-optimization-hints.json` after running `seo-phase2-reports.ts` (now includes `/uk-finance-tax`).

## Part 7 - Performance and UX hardening

No layout or bundle refactors were introduced in this pass. Recommended checks (unchanged baseline):

- `npm run preflight` / `npm run preflight:ci` for Next build hygiene.
- Spot-check LCP/CLS in Lighthouse on `/uk-finance-tax`, `/developer-tools`, and top revenue tools after deploy.

## Part 8 - Backlink asset inventory (editorial candidates)

High outreach potential (citation-friendly, explain-first):

- `developer-text-json-yaml-html-csv-pipeline-toollabz`
- `jwt-expiry-api-healthchecks-curl-playbook-toollabz`
- `json-formatting-and-validation-explained-developer`
- `uk-self-employed-dividend-salary-effective-percent-toollabz`
- `gst-australia-inclusive-exclusive-10-percent-small-business`
- `zakat-calculation-nisab-practical-guide-respectful`
- `saas-roas-churn-retention-metrics-primer-toollabz`
- `marketplace-seller-fees-stripe-paypal-etsy-ebay-toollabz`
- `working-days-uk-timezones-business-slas-toollabz`
- `imperial-metric-stone-feet-acres-hectares-conversion-guide`

Outreach templates live in `lib/content-engine/dashboard/backlink-engine.ts` (human-in-the-loop, capped cadence).

## Part 9 - Monetization readiness

**High RPM / finance adjacency:** UK hub, GST, loan and paycheck clusters, real-estate comparison guides (pair with conservative ad placement per `lib/content-engine/monetization/adsense-strategy.ts`).

**Developer sponsorship adjacency:** JWT/SQL/JSON explainers and pipeline articles (good for docs vendors, auth vendors, API monitoring).

**SaaS affiliate adjacency:** ROAS/churn/marketplace fee content (Stripe/PayPal/Etsy calculators already linked in-cluster).

## Part 10 - Consolidated backlog

| Theme | Weakest risk | Mitigation |
| --- | --- | --- |
| Cannibalization | Multiple URLs answering the same query | Use GSC query-page export + `real-opportunities` cannibalization rows to pick primaries |
| CTR | Snippet mismatch on high-impression URLs | Title/meta experiments + FAQ depth (see GSC markdown export) |
| Orphans | Programmatic or rarely linked tools | `audit-internal-links.ts` + hub cluster nav |
| YMYL | UK tax sketches misunderstood as filings | Keep “effective % you supply” framing + accountant disclaimers |

**Phase 3 tool ideas (high level, not spec’d):**

- PAYE vs dividend optimizer (UK) as a **scenario planner** with explicit non-filing disclaimers.
- Employer NI / apprenticeship levy sketch (UK) companion to loaded-cost tools.
- Contribution margin calculator tied to ROAS content cluster.
- Kubernetes manifest validator (syntax-only) to extend developer cluster without overlapping YAML validator.

---

## Change log (repository touchpoints)

- `components/CategoryHubLongform.tsx` - cluster navigation sections.
- `components/HubFeaturedGuides.tsx` - punctuation cleanup in helper copy.
- `app/uk-finance-tax/page.tsx` - new UK/AU/Zakat hub route.
- `lib/content-engine/sitemap-data.ts` - `/uk-finance-tax` in static sitemap list.
- `lib/blog/hub-featured-slugs.ts` - richer featured slugs per hub.
- `lib/tools/phase1-seo-expansion-batch1.ts`, `lib/tools/phase2-seo-expansion-batch2.ts` - depth + punctuation normalization.
- `lib/tools/expansion-phase{1,2}-tool-definitions.ts`, `expansion-phase{1,2}-compute.ts`, `phase1-seo.ts` - typography pass.
- `lib/content-engine/growth/ctr-suggestions.ts`, `lib/content-engine/monetization/adsense-strategy.ts`, dashboard helpers, `backlink-engine.ts` - template punctuation.
- `scripts/print-gsc-db-opportunities.ts`, `package.json` script `seo:print-gsc-opportunities`.
- `scripts/seo-phase2-reports.ts` - manual indexing seed includes `/uk-finance-tax`.

When this file and the scripts diverge from production reality, regenerate JSON/Markdown artifacts rather than editing this narrative by hand.
