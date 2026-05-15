# Final growth execution (next phase)

_Real rankings, real traffic, real authority. No vector DBs, embeddings, or new dashboards._

## Strongest traffic opportunities (qualitative + cluster alignment)

1. **UK finance + AU GST cluster** (`/uk-finance-tax`, UK tools, GST tools, new comparison `/blog/gst-vs-vat-uk-au-cross-border-pricing-toollabz`).  
2. **Developer utilities** (JWT, JSON, SQL, YAML, regex) with playbook posts.  
3. **SaaS metrics** (ROAS, churn, CAC, marketplace fees) with primer + calculator pairing.

## Highest RPM opportunities (typical patterns)

- UK and AU tax-adjacent pages (finance RPM bands) with clear disclaimers.  
- Loan / paycheck / mortgage clusters (US-heavy).  
- Long blog posts with natural mid-content ad slots (see `lib/content-engine/monetization/adsense-strategy.ts`).

## Best backlink opportunities

See **`reports/SEO_BACKLINK_ASSET_REPORT.md`**. Prioritize **comparison tables** and **curl-first developer playbooks** in community answers.

## Pages closest to ranking gains

- Use **near_page_one** rows in `reports/gsc-db-opportunities.md` (from Postgres).  
- Heuristic fallback: tools with **≥5 keywords** and **≥4 how-to steps** in `reports/gsc-optimization-hints.json` (`pagesLikelyClosestToRankingGains`).

## Weakest engagement pages

- **GA4 join** section in `gsc-db-opportunities.md` (requires `GA4_PROPERTY_ID`).  
- On-site: pages with long intros before the interactive tool (improve scroll-to-tool).

## Topical clusters

| Strongest | Weakest (investigate with GSC queries) |
| --- | --- |
| Developer JSON/JWT/SQL + hubs | Niche converters with few inbound links (see discoverability JSON) |
| UK + GST finance | Any tool with `<4` related slugs until graph thickens |
| SaaS ROAS / fees | Legacy posts missing `relatedPostsSlugs` |

## Indexing priorities

- **`reports/manual-indexing-priority.json`** (P0 UK/GST, P1 dev/business, P2 featured blogs).  
- After each meaningful content deploy: URL Inspection for **P0** only.

## Next blog topics (evidence-led)

- Only add topics when **GSC Queries** or `gsc_query_page_daily` show repeated gaps.  
- **Shipped now**: GST vs VAT AU/UK comparison (long-tail cross-border intent).  
- Candidates to validate with data first: “payment on account calendar (UK) explainer”, “contribution margin vs gross margin one-pager”, “Kubernetes YAML vs JSON for configs”.

## Next tool opportunities (requires REAL search signals)

- Use Search Console exports or Postgres `gsc_query_page_daily` to find repeated “calculator” or “template” queries without a matching `/tools/{slug}`.  
- Avoid speculative tools that duplicate existing math with a new slug.

## Technical debt (non-vanity)

- Orphan and broken-link detection still needs **`audit-internal-links.ts`** against a running origin.  
- Align GA4 `landing_path` with GSC `page` paths when engagement join looks sparse.

## Commands (copy/paste)

```bash
npm run validate:blog-sitemap
npx tsx scripts/seo-phase2-reports.ts
npm run seo:discoverability
export DATABASE_URL=... GSC_SITE_URL=...   # optional GA4_PROPERTY_ID=...
npm run seo:print-gsc-opportunities
```

## Engagement improvements (ongoing)

- Prefer **clear TOC** (`tableOfContents` in posts), **comparison tables**, and **worked numbers** near the top.  
- Tool pages already render comparison + long-tail blocks via `ToolLayout` and `tool-longtail-blocks`; keep related tools curated.

## Maintenance cadence

See **`reports/SEO_MAINTENANCE_WORKFLOW.md`**.
