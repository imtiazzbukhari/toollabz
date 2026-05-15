# Final production SEO execution report

_Last updated with this execution pass. Replace narrative sections when strategy changes; regenerate JSON/Markdown artifacts from scripts._

## Part 1 - Global navigation (UK hub discoverability)

**Shipped**

- **Desktop**: Primary nav keeps **Calculators** (`/finance-tools`) and adds a thin separator plus a compact **UK tax** link to `/uk-finance-tax` in the same nav cluster (no dropdown, no extra top-level row).
- **Mobile**: Under the same block, **UK tax hub** appears as an indented secondary line so thumb reach stays predictable.
- **Contextual**: `/finance-tools` includes a single-line pointer to the **UK finance & tax** hub above `PageLastUpdated`.

This stays within the existing header chrome and avoids a crowded mega-menu.

## Part 2 - Manual indexing priority (production queue)

**Generator:** `npx tsx scripts/seo-phase2-reports.ts` writes **`reports/manual-indexing-priority.json`** with `tier`, `url`, `reason`, and `expectedSeoOpportunity`.

**Tiering logic (heuristic, PR-safe)**

| Tier | What is included |
| --- | --- |
| **P0** | `/uk-finance-tax`, core UK tool URLs, GST-related tool URLs |
| **P1** | Developer directory tools (capped), high-intent business tools (ROAS, Stripe, break-even, CAC, churn when present) |
| **P2** | Deduplicated hub-featured blog slugs (capped) |

Use Search Console **URL inspection → Request indexing** for P0 after deploy, then batch P1/P2 over a week to respect crawl politeness.

## Part 3 - Backlink and distribution targets

**Strongest linkable assets (editorial, cite-friendly)**

| Asset type | Examples (paths) | Why it earns links |
| --- | --- | --- |
| Developer reference | `/blog/json-formatting-and-validation-explained-developer`, `/blog/jwt-expiry-api-healthchecks-curl-playbook-toollabz`, `/blog/developer-text-json-yaml-html-csv-pipeline-toollabz` | Step-by-step, tool-agnostic language; good for HN, dev.to, Slack communities |
| UK finance education | `/blog/uk-self-employed-dividend-salary-effective-percent-toollabz`, `/uk-finance-tax` | Comparison framing; use careful disclaimers in outreach |
| Business metrics | `/blog/saas-roas-churn-retention-metrics-primer-toollabz`, `/blog/marketplace-seller-fees-stripe-paypal-etsy-ebay-toollabz` | Operator vocabulary; fits Indie Hackers, founder newsletters |
| Converters / SLA | `/blog/working-days-uk-timezones-business-slas-toollabz`, `/blog/imperial-metric-stone-feet-acres-hectares-conversion-guide` | Practical tables; fits Reddit r/UKPersonalFinance (follow rules), r/excel, r/smallbusiness |

**Community map (ethical use only)**

- **Reddit**: answer-first comments with the calculator as a secondary helper; disclose affiliation; avoid drive-by dumps.
- **Dev**: `r/webdev`, `r/node`, language Discords when someone asks JWT/Base64/SQL readability (thread-level help).
- **Startup / SaaS**: Indie Hackers, SaaS growth Slacks, founder Twitter replies where ROAS/CAC/churn threads appear.
- **Finance**: UK subs with strict self-promo rules: lead with a short excerpt + methodology, not a naked link blast.

Outreach copy patterns live in `lib/content-engine/dashboard/backlink-engine.ts` (human approval, low daily cap).

## Part 4 - GSC + GA4 execution workflows

**Single Markdown export**

```bash
export DATABASE_URL="postgres://..."
export GSC_SITE_URL="sc-domain:YOUR_PROPERTY"
export GA4_PROPERTY_ID="123456789"   # optional, enables weak-engagement join
npm run seo:print-gsc-opportunities
```

**Output:** `reports/gsc-db-opportunities.md`

**What it encodes**

- Rows from **`computeSeoOpportunitiesFromDb`** (low CTR, near page one, rising/declining clicks, cannibalization) with **editorial** title/meta suggestions where thresholds allow.
- Optional **GA4 weak engagement** slice via **`loadGa4GscJoinLast28d`** (needs numeric property id aligned with `ga4_landing_daily.property_id`).
- A short **execution playbook** for titles, FAQs, internal links, and snippet fixes.

**Operational rhythm**

1. Weekly: export Markdown, pick top 5 URLs per category, ship one change per URL (title **or** content **or** internal links, not all three at once).
2. After each release: re-run URL inspection for touched P0 URLs only.

## Part 5 - Content maintenance audit (practical heuristics)

**Stale pages**

- Sort `blogPosts` by `dateModified` in your CMS/registry; anything older than 12 months with traffic in GSC should get a freshness pass (rates, thresholds, product names).

**Weak / low-depth**

- Tools with fewer than 4 `howToUse` steps and thin FAQs: prioritize using existing FAQ expansion utilities (`lib/tools/faq-expansion.ts`) before inventing new routes.

**Overlapping intent**

- When two URLs compete for the same query cluster, use GSC **cannibalization** rows from the Markdown export, pick a **primary** URL, demote duplicate H2s on the secondary page, and add a single clarifying paragraph + link upward.

## Part 6 - Production review checklist

| Check | Command or action |
| --- | --- |
| Sitemap vs blog registry | `npm run validate:blog-sitemap` |
| Tool URLs vs sitemap | `npx tsx scripts/seo-phase2-reports.ts` then inspect `reports/seo-indexability-audit.json` |
| robots / canonicals | Spot-check `app/robots.txt/route.ts` and tool `alternates.canonical` via `toolMetadata` samples in the same JSON |
| Broken / orphan links (same-origin) | `BASE_URL=https://YOUR_ORIGIN npx tsx scripts/audit-internal-links.ts` (requires running server) |
| Hydration / bundle size | `npm run preflight:ci` before release; Lighthouse spot on `/`, `/tools`, `/uk-finance-tax` |
| Mobile | Verify new finance nav pair on a narrow device: primary tap target remains full-width row |

## Part 7 - 90-day realistic roadmap

**Days 0–30**

- Request indexing for P0 URLs; ship GSC title/meta tests for top 10 low-CTR URLs from `gsc-db-opportunities.md`.
- Publish one backlink-oriented update (tables, citations) on the strongest developer article.

**Days 31–60**

- Resolve top 3 cannibalization clusters; add hub → tool links from `CategoryHubLongform` cluster nav where GSC shows impression growth but weak CTR.
- Refresh two finance posts with dated regulatory disclaimers and new internal links to `/uk-finance-tax`.

**Days 61–90**

- Evaluate one **new** tool only if GSC query export shows repeated demand not covered by an existing slug (avoid tool sprawl).
- Re-run `audit-internal-links` monthly after large content merges.

## Strongest growth pages (qualitative)

- `/uk-finance-tax` and UK tool URLs (high intent, hub-supported).
- Developer utilities with repeat usage (JWT, JSON, SQL, YAML).
- ROAS, Stripe fee, and marketplace fee calculators (commercial adjacent).

## Weakest pages (risk pattern)

- URLs with impressions from GSC but **low GA4 engagement** (see Markdown export when GA4 is wired): usually bury the interactive tool or mismatch query intent.

## CTR opportunity pages

- Pulled dynamically into `reports/gsc-db-opportunities.md` under `high_impressions_low_ctr` with suggested SERP variants.

## Next tool opportunities (evidence-first)

- Only add tools backed by **query demand** in `gsc_query_page_daily` or Search Console exports; candidates often look like “optimizer”, “planner”, or “vs” comparisons adjacent to existing high-traffic slugs.

## Remaining technical debt

- Orphan detection still depends on a **live fetch crawl** (`audit-internal-links.ts`), not static analysis alone.
- GA4 join requires consistent `landing_path` alignment with GSC `page` paths; validate in BigQuery or GA4 UI when numbers look off.

---

**Artifacts this phase depends on**

| File | Produced by |
| --- | --- |
| `reports/manual-indexing-priority.json` | `npx tsx scripts/seo-phase2-reports.ts` |
| `reports/seo-indexability-audit.json` | same |
| `reports/gsc-optimization-hints.json` | same |
| `reports/gsc-db-opportunities.md` | `npm run seo:print-gsc-opportunities` |
