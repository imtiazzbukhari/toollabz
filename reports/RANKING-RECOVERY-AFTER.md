# Ranking recovery — diagnosis and changes

**Date:** 2026-09-06  
**Not claimed:** rankings, clicks, or AI citations will rise automatically.

---

## 1. Current GSC diagnosis

**Source of truth:** the page/query rows in the sprint brief.  
**Not usable:** `lib/content-engine/gsc-data.json` (empty), Postgres GSC (`DATABASE_URL` unset).

All reported **clicks = 0**.

| Group | URLs / queries | Read |
|---|---|---|
| **A. Positions 1–10, low CTR** | Homepage pos 4.81 (16 impr); `/tools/jwt-decoder` pos 4 (7 impr) | Volume is too small to call a snippet failure. Expected clicks are far below 1. |
| **B. Positions 11–20** | `/tools/saas-valuation-calculator` 16.9; resume summary ~20; some salary/margin *queries* | Near page one, tiny impressions. Watch, don’t rebuild. |
| **C. Positions 21–40, meaningful impressions** | **UK rental yield** 207 / 35.5; **salary after tax** 121 / 30.9; “yield calculator” 101 / 23.8 | **This is the growth set.** |
| **D. Positions 41+** | LinkedIn drafts, profit margin page, loan `/p/250000` and `/p/500000`, “fair rent”, “buy to let yield” | Weak rank or wrong intent. Do not mass-create pages. |

Country is **not in the export**. Queries like “rental yield calculator uk” imply a UK-weighted set for the yield URL.

---

## 2. Why impressions without clicks

**Primary reason: the pages with volume are not on page one.**

Typical CTR at average position 30–35 is near zero. 207 impressions at 35.5 with 0 clicks is **normal**, not a broken snippet.

**Secondary reason: 0 clicks on the two page-1 URLs is sampling noise**, not proven CTR failure (7 and 16 impressions).

**Tertiary reason: intent mismatch on salary.** Live origin still titled the generic tool as UK 2026/27 take-home while the formula is `gross × (1 − rate)`. Google can show the URL for “salary after tax calculator” and still withhold rank/clicks when the snippet and page disagree.

**Not the reason (evidence against):**

- Missing robots / AI blocks — already allowed.
- Missing sitemaps / canonicals as a site-wide failure — English infrastructure exists.
- “Every not-indexed URL must be indexed” — 329 crawled-not-indexed is mostly quality-gated duplicates (see classification report).

---

## 3. Top ranking opportunities

See `reports/ORGANIC-GROWTH-PRIORITY-QUEUE.md`.

1. `/tools/rental-yield-calculator-uk` — 207 impressions, already ranking for “yield calculator”.
2. `/tools/salary-after-tax-calculator` — 121 impressions; fix honesty + disambiguate UK/US.
3. `/tools/profit-margin-calculator` — smaller, formula-first page + existing margin articles.

---

## 4. Programmatic SEO quality

| Family | Approx. URL count | Unique content | Repeated text | Intent | Sitemap | Index | Class |
|---|---|---|---|---|---|---|---|
| `/loan-calculator/p/[amount]` | **169** principals | Unique **numeric** scenario table per amount | High template reuse | Long-tail “$N loan payment” | High tier only | High+medium | **C** near-duplicate with useful math; **D** for round principals (250k/500k have GSC rows at pos ~55–58) |
| `/salary-after-tax/p/[amount]` | **91** | Unique numbers at a stated effective rate | High template reuse | Long-tail gross salary | High tier only | High+medium | **C / D** |
| `/salary-after-tax-calculator/[country]/[amount]` | Mirrors | Duplicate of regional tools | Very high | None unique | No | **Redirect** to regional tool | **E → B** (already consolidated) |
| `/salary-tax-calculator/[country]`, `/loan-calculator/[country]` | Stubs | Thin | Very high | None | No | **Redirect** to parent tool | **E → B** |
| `/cm-to-feet/[slug]` | Up to **1000** cm values (SSG capped) | Unique conversion | High template | “N cm to feet” | High heights only | High+medium; low noindex | **D** for common heights; **C/E** for obscure cm |

**Internal-link visibility:** amount pages are linked from `PopularCalculationsBlock` on some hubs, not from the main tool how-to. They should not become the site’s “loan calculator” identity.

**Decision this sprint:** do **not** delete or mass-noindex high-tier amount URLs that already have impressions. Do **not** add more amounts. Country stubs stay redirected.

---

## 5. Priority pages (what “better” means)

### `/tools/rental-yield-calculator-uk`

Must answer: yield calculator / rental yield UK / buy-to-let / gross yield.

Now: formula-first quick answer, gross vs net, £1,450 / £320,000 worked example, stamp duty vs annual costs, Section 24 called out as **out of scope**, GOV.UK renting sources, UK rent + cash-flow articles.

### `/tools/salary-after-tax-calculator`

Must answer: salary after tax / salary tax calculator **without** claiming UK PAYE.

Now: flat-rate formula, FAQ “this is not the UK engine”, related UK + US tools, take-home guides (not a fake “UK title” related card).

### `/tools/profit-margin-calculator`

Must answer: profit margin / calculate margin / markup vs margin.

Now: formula-first answer, product example, markup sibling + existing articles.

---

## 6. Changes implemented

| Area | Change |
|---|---|
| Titles/meta | UK yield; profit margin (gross vs markup); salary already honest from prior pass |
| Editorial | Quick answers, insights, mistakes, benchmarks, FAQs, formulas, sources |
| Discovery | `rental-yield-calculator-uk` added to `POPULAR_TOOL_SLUGS` (replaced `ai-prompt-optimizer`) |
| Blog → tool | UK rent guide, yield-vs-cash-flow, markup-vs-margin, gross-vs-net |
| Hubs | Real-estate featured guides include UK rent + yield-vs-cash-flow; business hub includes markup + gross-vs-net |
| Related tools | Yield UK ↔ generic yield; margin ↔ markup / business margin / break-even |
| Not changed | URLs, nginx, SSL, locales expansion, programmatic families, JWT/homepage titles |

---

## 7. Internal-link improvements

Contextual only (no footer dump):

- UK rent article CTA → UK yield tool (was generic yield).
- Yield vs cash-flow → both generic and UK tools.
- Markup and gross-vs-net articles → `/tools/profit-margin-calculator` (the GSC URL).
- Homepage / tools popular row and real-estate “popular” strip include UK yield.

Orphans: most tools still rely on `/tools` + category grids. That is acceptable. We did not invent hundreds of footer links.

---

## 8. Content improvements

Added **extractable** facts (formula, example, limitation) rather than word-count. No fake FAQs. No keyword stuffing.

Existing articles reused; **no new blog URLs**.

---

## 9. Authority / backlink gap

See `reports/BACKLINK-AUTHORITY-GAP.md`.

**Referring-domain data is not in the repo.** Authority is a likely constraint, unmeasured.

---

## 10. International strategy

Keep the approved 18-locale catalog. **Do not** translate 240+ tools.

After the English P0 pages are deployed and recrawled, localize only if demand appears: **fr, es, pt** first. International work must not outrank English yield/salary/margin fixes.

---

## 11. AI search readiness

No new AI-SEO layer. Priority pages now have a short formula, worked example, and explicit limitations in HTML — the same text a search engine or LLM would extract. Existing robots allow listed AI crawlers. `llms.txt` remains supplementary.

---

## 12. Remaining blockers

1. **These edits are not on production** until commit + deploy.
2. **Live salary page still has the old UK title** until that deploy.
3. **Authority** unknown; may cap page-1 even after relevance fixes.
4. **GSC export has no country, device, or query×page matrix** beyond the listed rows.
5. **329 crawled-not-indexed** should stay mostly excluded (duplicates / medium programmatic).
6. Pre-existing unit tests (`seo-tools`, `tool-serp-metadata`, `seo-domination-modules`) still fail on unrelated title-length rules.

---

## 13. Next 30-day action plan

1. Commit this sprint + prior salary honesty files; deploy once.
2. GSC URL inspection + request indexing for the three P0 tool URLs and the two updated UK/margin articles.
3. Wait 2–4 weeks; export pages **and** queries (clicks, impr, position, CTR).
4. If yield position improves but CTR stays 0 at pos ≤10 with ≥200 impressions, then test titles.
5. One human outreach pass from `SEO_BACKLINK_ASSET_REPORT.md` (yield + markup posts).
6. Do **not** add loan/salary amount URLs. Do **not** mass-translate.
7. Import a links export before any “authority sprint.”

---

## Blunt verdict

**Multiple bottlenecks**

| Rank | Bottleneck | Impact | Evidence |
|---|---|---|---|
| 1 | **Content relevance / intent match** | Highest *actionable* | Salary UK title vs flat-rate formula (live). Yield page ranking for “yield calculator” at pos ~24–35 without a sharp gross/net + BTL answer. Margin quick answer was off-intent. |
| 2 | **Authority / backlinks** | High, **unmeasured** | Positions 20–40 with impressions, new 2026 domain, empty backlink JSON. |
| 3 | **Programmatic page quality** | Medium | 169+91 amount templates; 250k/500k loan URLs already impress at pos 55+. Country stubs correctly redirected. |
| 4 | **Indexing quality** | Low for this export | Coverage buckets are mostly intentional. Do not chase 329 not-indexed URLs. |
| 5 | **CTR / snippets** | Low given current positions | 0 clicks at pos 30+ is expected. Page-1 0-click rows are too small. |
| — | **Technical SEO** | **Not the bottleneck** | Canonicals, sitemaps, robots, structured data, prerender already exist. |

**Not:** “Technical SEO is the bottleneck.”
