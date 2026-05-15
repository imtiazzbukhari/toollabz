# Blog expansion, cluster reinforcement, indexing readiness (Phase 1 + 2 tools)

**Date:** 2026-05-16  
**Scope:** No new tools added. Blogs, internal links, SERP helpers, typography cleanup on high-traffic surfaces, sitemap validation.

---

## Part 1 | New supporting blog posts (slugs + primary keywords)

| Slug | Primary keyword intent | Tools reinforced |
|------|------------------------|------------------|
| `developer-text-json-yaml-html-csv-pipeline-toollabz` | json yaml html csv developer pipeline | `json-minifier`, `json-formatter`, `json-validator`, `yaml-validator`, `csv-to-json-converter`, `html-formatter`, `css-minifier`, `api-status-checker` |
| `jwt-expiry-api-healthchecks-curl-playbook-toollabz` | jwt expiry clock skew curl api health | `jwt-expiry-checker`, `jwt-decoder`, `unix-timestamp-converter`, `api-status-checker`, `json-validator` |
| `uk-self-employed-dividend-salary-effective-percent-toollabz` | uk self employed dividend salary take home | `self-employed-tax-calculator-uk`, `dividend-tax-calculator-uk`, `salary-after-tax-calculator-uk`, `freelance-day-rate-calculator`, `employee-cost-calculator`, `invoice-late-fee-calculator` |
| `marketplace-seller-fees-stripe-paypal-etsy-ebay-toollabz` | stripe paypal etsy ebay seller fees | `stripe-fee-calculator`, `paypal-fee-calculator`, `etsy-fee-calculator`, `ebay-fee-calculator`, `unit-price-calculator`, `profit-margin-calculator-business` |
| `saas-roas-churn-retention-metrics-primer-toollabz` | roas churn ltv cac saas metrics | `roas-calculator`, `churn-calculator`, `ltv-calculator-saas`, `cac-calculator-saas`, `google-ads-roi-calculator`, `conversion-rate-calculator` |
| `working-days-uk-timezones-business-slas-toollabz` | working days uk business days timezone sla | `working-days-calculator-uk`, `business-days-calculator`, `time-zone-converter`, `date-difference-calculator`, `notice-period-calculator` |

**Already strong (not duplicated as new URLs):**  
`jwt-token-decode-vs-verify-security-guide-toollabz`, `sql-cron-readability-schedulers-developer-guide-toollabz`, `json-formatting-and-validation-explained-developer`, `regex-beginner-guide-practical-patterns-toollabz`, `gst-australia-inclusive-exclusive-10-percent-small-business`, `zakat-calculation-nisab-practical-guide-respectful`, `freelance-pricing-hourly-day-rate-mistakes-calculator-guide`, `employee-loaded-cost-pricing-seat-economics-toollabz`, `imperial-metric-stone-feet-acres-hectares-conversion-guide`, `roi-vs-roas-when-to-trust-each-metric`. These received **reciprocal `relatedPostsSlugs` / `relatedToolSlugs` updates** instead of thin clones.

**Word-count note:** New posts are structurally complete (TOC, FAQs, tables, mistakes, when-to-use) and long-form relative to typical tool posts. If you want a strict **1800–3000 word** floor per URL, schedule a second editorial pass to add more worked numeric examples per section without changing slugs.

---

## Part 2 | Reciprocal linking map (blog ↔ blog ↔ tool)

| Source post | Added / strengthened links toward |
|-------------|-----------------------------------|
| `json-formatting-and-validation-explained-developer` | Tools: `json-minifier`, `yaml-validator`, `csv-to-json-converter`. Posts: `developer-text-…`, `jwt-expiry-…`, `regex-beginner-…` |
| `jwt-token-decode-vs-verify-security-guide-toollabz` | Tools: `jwt-expiry-checker`, `api-status-checker`. Posts: `developer-text-…`, `jwt-expiry-…` |
| `sql-cron-readability-schedulers-developer-guide-toollabz` | Post: `developer-text-…` |
| `regex-beginner-guide-practical-patterns-toollabz` | Posts: `developer-text-…`, `jwt-expiry-…`, `sql-cron-…`, `json-formatting-…` |
| `gst-australia-inclusive-exclusive-10-percent-small-business` | Post: `freelance-pricing-hourly-day-rate-mistakes-calculator-guide` |
| `roi-vs-roas-when-to-trust-each-metric` | Tool: `roas-calculator`. Posts: `saas-roas-churn-…`, `marketplace-seller-fees-…` |
| `freelance-pricing-hourly-day-rate-mistakes-calculator-guide` | Posts: `uk-self-employed-…`, `gst-australia-…` |
| `employee-loaded-cost-pricing-seat-economics-toollabz` | Post: `uk-self-employed-…` |
| `imperial-metric-stone-feet-acres-hectares-conversion-guide` | Tools: `feet-to-cm-converter`, `lbs-to-kg-converter`, `working-days-calculator-uk`. Post: `working-days-uk-timezones-…` |

**Tool → blog:** Unchanged mechanically (Toollabz uses `getGuideLinksForTool` from `relatedToolSlugs` on posts). Increasing `relatedToolSlugs` on posts **raises guide coverage** for the new and existing tools.

---

## Part 3 | Orphan / weak-link heuristic (manual)

| Risk | Mitigation already applied |
|------|----------------------------|
| New Phase 2 tools had few blog backlinks | Six cluster posts + expansions on JSON/JWT/SQL/regex/GST/freelance/ROI hubs |
| UK finance tools YMYL | Copy stays “effective % sketch” with disclaimers; links to freelance, employee, GST for context |
| `api-status-checker` could be misunderstood as live ping | Blog + tool copy stress **curl second step** |

**Suggested next crawl (GSC):** after deploy, watch **“Discovered not indexed”** for new blog URLs; if any linger 14+ days, add one more in-body link from a hub page (`/developer-tools`, `/finance-tools`) paragraph (not footer spam).

---

## Part 4 | Indexing & sitemap

| Check | Result |
|-------|--------|
| Tools in sitemap | `buildSitemapEntries` iterates **`tools` from `lib/tools/data`** → all tools including Phase 1 + 2 |
| Blogs in sitemap | Iterates **`blogPosts` from registry** → 64 modules after manifest |
| Canonical URLs | `toolMetadata` / blog layout use `/tools/{slug}` and `/blog/{slug}` (unchanged pattern) |
| `robots.txt` | `app/robots.txt/route.ts` emits `Sitemap: {origin}/sitemap.xml` |
| Sitemap generator | `app/sitemap.xml/route.ts` uses `buildSitemapEntries` (dynamic, cached 1h) |
| Blog slug integrity | `npm run validate:blog-sitemap` → **ok=true**, blogUrls=99, registry=99 |

**Manual indexing priority (URL Inspection order):**

1. `developer-text-json-yaml-html-csv-pipeline-toollabz` (broad developer intent)  
2. `jwt-expiry-api-healthchecks-curl-playbook-toollabz` (JWT long-tail)  
3. `uk-self-employed-dividend-salary-effective-percent-toollabz` (UK YMYL, monitor quality)  
4. `marketplace-seller-fees-stripe-paypal-etsy-ebay-toollabz` (commercial intent)  
5. `saas-roas-churn-retention-metrics-primer-toollabz`  
6. `working-days-uk-timezones-business-slas-toollabz`  

Then request indexing for **new high-intent tools** (`yaml-validator`, `stripe-fee-calculator`, `self-employed-tax-calculator-uk`, `roas-calculator`) if GSC shows crawl lag.

---

## Part 5 | CTR + title optimization

| File | Change |
|------|--------|
| `lib/tools/tool-ctr-titles.ts` | Added CTR primary lines for `html-formatter`, `yaml-validator`, `stripe-fee-calculator`, `self-employed-tax-calculator-uk`, `roas-calculator`, `working-days-calculator-uk` (pipe separators, include tool `name` substring for tests). |
| `lib/seo.ts` | Meta description closers: em dash → **pipe `|`** in `buildToolMetaDescription` / `normalizeToolMetaDescription` filler strings; default tool description fallback uses `\|` instead of em dash. |

---

## Part 6 | Global typography (em dash cleanup)

| Area | Action |
|------|--------|
| `lib/blog/articles/*.tsx` | Bulk replace `-` (U+2014) with ` - ` via `perl -pi` |
| `components/ToolLayout.tsx` | Same replacement |
| `lib/seo.ts` | Same + manual string edits for closers |

**Not bulk-replaced (risk to data / code):** `lib/tools/data.ts` (large CPC payloads), JSON under `/reports`, generated hints JSON, dashboard client strings. Schedule a **scoped second pass** for `expansion-phase*-tool-definitions.ts` and `phase*-seo-*.ts` if you want 100% em-dash elimination in tool SEO prose.

---

## Part 7 | Performance / UX

No layout or hydration changes in this phase (content + metadata only). Tool hero / workspace patterns untouched.

---

## Part 8 | Strongest / weakest pages (actionable)

**Strongest opportunity (post-publish):**  
Cluster hubs (`developer-text-…`, `marketplace-seller-fees-…`, `saas-roas-churn-…`) plus updated `json-formatting-…` and `jwt-token-decode-…` (high internal out-degree).

**Weakest (reinforce later):**  
Any Phase 2 tool still under **two** distinct blog `relatedToolSlugs` mentions after crawl; fix by adding one contextual paragraph link inside an older high-traffic post (not footer lists).

---

## Part 9 | Future backlinks (earned media angles)

- **Developer:** “YAML + Helm footguns” HN / Reddit r/kubernetes comment resource linking the pipeline post.  
- **Marketplace fees:** Seller subreddit threads comparing Stripe vs PayPal blended rates (link to calculator + disclosure).  
- **UK tax sketches:** Accountant newsletters / Indie Hackers UK with strict “not advice” framing.

---

## Confirmation checklist

- [x] New blogs registered (manifest **64** articles)  
- [x] `npm test` all green  
- [x] `npm run validate:blog-sitemap` green  
- [x] Sitemap pipeline includes all tools + blogs  
- [x] `robots.txt` points to `/sitemap.xml`  
- [x] Em dash reduced on **blog + ToolLayout + seo closers**  
- [ ] Optional: second pass em dash in `lib/tools/data.ts` + expansion SEO TS (large diff)  
- [ ] Optional: word-count expansion to hit 1800–3000 words per new slug  
