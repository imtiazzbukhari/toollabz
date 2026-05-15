# SEO maintenance workflow (lightweight)

_No new dashboards: use Search Console, Postgres exports (optional), and the scripts already in this repo._

## Weekly (45–60 minutes)

1. **GSC health**: coverage spikes, manual actions, crawl anomalies.  
2. **Top movers**: sort last 28d by impressions; open 5 URLs with CTR below site baseline.  
3. **Ship one fix**: per URL choose **either** title/meta test **or** one content block (FAQ, table, internal link), not all three.  
4. **Run** `npm run seo:print-gsc-opportunities` (with `DATABASE_URL`, `GSC_SITE_URL`, optional `GA4_PROPERTY_ID`) and archive `reports/gsc-db-opportunities.md` with a date in filename if you keep history.  
5. **Run** `npm run seo:discoverability` and pick **two** `thinRelatedTools` or `thinBlogInterlinks` rows to improve.

## Monthly (half day)

1. **Refresh stale winners**: posts with traffic but `dateModified` older than 6–12 months; update examples, rates, product names.  
2. **Cannibalization pass**: fix clusters flagged in the GSC markdown export (`cannibalization` rows).  
3. **Internal link sweep**: hubs (`/developer-tools`, `/finance-tools`, `/business-tools`, `/utility-tools`, `/uk-finance-tax`) should each receive one new contextual link to a URL you improved this month.  
4. **Sitemap / registry**: `npm run validate:blog-sitemap`; `npx tsx scripts/seo-phase2-reports.ts` for tool vs sitemap parity.  
5. **Optional live crawl**: `BASE_URL=https://production.origin npx tsx scripts/audit-internal-links.ts` from a laptop.

## Priority triage (when time is short)

| Signal | First action |
| --- | --- |
| High impressions, low CTR | Title/meta + FAQ aligned to top queries |
| Position 8–20, solid impressions | Depth + hub links + comparison section |
| Declining clicks | Query-level position + competitor refresh |
| Low GA4 engagement (joined report) | Move tool CTA up, shorten intro, add jump links |
| Thin `related` graph (`seo-discoverability-heuristic.json`) | Add two inbound links from topical siblings |

## Artifacts

| Output | Command |
| --- | --- |
| Manual indexing queue | `npx tsx scripts/seo-phase2-reports.ts` → `reports/manual-indexing-priority.json` |
| Discoverability heuristics | `npm run seo:discoverability` → `reports/seo-discoverability-heuristic.json` |
| GSC + GA4 execution | `npm run seo:print-gsc-opportunities` → `reports/gsc-db-opportunities.md` |
