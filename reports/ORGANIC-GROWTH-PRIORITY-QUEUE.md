# Organic growth priority queue (top 20)

**Evidence window:** GSC export provided 2026-09-06 (all reported clicks = 0).  
**Repo GSC tables:** `lib/content-engine/gsc-data.json` is empty; `reports/gsc-db-opportunities.md` has no Postgres. This queue uses the **user-supplied page and query rows only**.

Scoring (documented, not a ranking promise):

`score ≈ impressions × proximity × intent × business × improvement`

| Factor | Scale |
|---|---|
| Proximity | 1–10 = 1.00; 11–20 = 0.85; 21–40 = 0.70; 41+ = 0.40 |
| Intent | Calculator / transactional = 1.0; mixed = 0.7; homepage/brand = 0.4 |
| Business | Finance / property / pricing = 1.0; AI utilities = 0.6; home = 0.4 |
| Improvement | Clear content gap = 1.0; small-sample CTR only = 0.3 |

Do **not** treat a 0-click cell at position 4 with 7–16 impressions as a CTR emergency. Expected clicks at those volumes are often &lt; 1.

| # | URL | Current evidence | Problem | Exact recommended change | SEO mechanism | Priority | Code/content? |
|---|---|---|---|---|---|---|---|
| 1 | `/tools/rental-yield-calculator-uk` | 207 impr, pos 35.54; queries “yield calculator” 101 / pos 23.8, “rental yield calculator”, “rental yield calculator uk”, “buy to let yield calculator” | Strongest impression page is a mid-SERP generic-yield result; page was thin vs UK buy-to-let intent | Title/H1/quick answer/formula/gross vs net/example/FAQs/sources; link from UK rent + yield blogs; put in popular tools | Relevance + internal PageRank to the URL Google already associates with the query | **P0** | **Done this sprint** |
| 2 | `/tools/salary-after-tax-calculator` | 121 impr, pos 30.91; “salary tax calculator” pos 20, “salary after tax calculator” pos 27 | Live page claimed UK take-home while the engine is flat-rate | Honest title/schema/FAQ; compare to UK + US tools; keep formula visible | Stop relevance mismatch; recover “salary after tax calculator” without fake UK claims | **P0** | **Done** (honesty + intent) |
| 3 | `/tools/profit-margin-calculator` | 22 impr, pos 44.86; “margin calculators” 10 / pos 60; “profit margin calculator” pos 18 | Weak position; quick answer talked about “percentage” instead of the margin formula | Formula-first snippet; markup contrast; blog links from markup/gross-vs-net posts | Intent match for “profit margin calculator” | **P1** | **Done this sprint** |
| 4 | `/tools/ai-linkedin-post-generator` | 26 impr, pos 62.46; “linkedin post drafts” 23 / pos 64 | Page 6–7; AI commodity SERP | Do **not** rewrite this sprint. Revisit after P0 pages recrawl. | Ranking, not CTR | P2 | No |
| 5 | `/loan-calculator/p/250000` | 16 impr, pos 58.25 | Amount template at page 6 | Keep as high-tier unique-math landing; do not spawn more amounts. Link users to `/tools/loan-calculator` | Avoid programmatic dilution | P2 | No (policy) |
| 6 | `/` | 16 impr, pos 4.81, 0 clicks | Tiny sample at page 1 | Do not redesign homepage. 0 clicks ≈ sampling noise | Not the growth lever | P3 | No |
| 7 | `/tools/ai-resume-summary-generator` | 13 impr, pos 20.15; “resume summary generator” 6 / pos 20 | Page 2, small volume | Optional later title tweak; not this sprint | Near-page-one with weak volume | P3 | No |
| 8 | `/loan-calculator/p/500000` | 13 impr, pos 55.00 | Same family as #5 | Same: no new URLs, no mass-noindex of high-tier amounts | Dilution risk if expanded | P2 | No |
| 9 | `/tools/saas-valuation-calculator` | 8 impr, pos 16.88 | Closest “almost page 1” after homepage/JWT | Later: one clearer valuation-range example. Not this sprint | Proximity with tiny volume | P3 | No |
| 10 | `/tools/jwt-decoder` | 7 impr, pos 4.00, 0 clicks | Page 1, statistically empty | Do not change title for CTR. Watch next GSC window | Not proven CTR failure | P3 | No |
| 11 | Query: buy to let yield calculator | 21 impr, pos 72.81 → URL #1 | Query is farther than “yield calculator” | Page #1 now states buy-to-let + monthly GBP explicitly | Query–page alignment | P0 | Covered by #1 |
| 12 | Query: fair rent calculator | 8 impr, pos 99.75 | Different intent (rent setting, not yield %) | Do **not** retarget yield page. Existing `/blog/how-much-can-i-rent-my-house-for-uk` already covers rent-setting | Avoid cannibalization | P2 | Link only (done) |
| 13 | `/tools/salary-after-tax-calculator-uk` | No row in this export | Correct engine for UK salary queries | Keep separate; generic page now disambiguates | Prevent future cannibalization | P1 | Already exists |
| 14 | `/tools/rental-yield-calculator` | Not in this export | Generic sibling of the UK page | Related-tool link both ways | Cluster, don’t merge URLs | P2 | **Done** related[] |
| 15 | `/tools/loan-calculator` | Not in this export; amount URLs are | Parent of weak amount landings | Leave parent as the canonical calculator | Consolidation already on country stubs | P2 | No |
| 16 | `/blog/how-much-can-i-rent-my-house-for-uk` | Supporting | Linked to generic yield tool | Primary CTA → UK yield tool | Contextual internal link | P1 | **Done** |
| 17 | `/blog/rental-yield-vs-monthly-cash-flow-investment-property` | Supporting | No UK tool CTA | Added UK yield link | Cluster | P1 | **Done** |
| 18 | `/blog/markup-vs-margin-formulas-pricing-mistakes` | Supporting | Linked to business-margin sibling only | Primary tool link → `/tools/profit-margin-calculator` | Cluster | P1 | **Done** |
| 19 | `/real-estate-tools` | Hub | Popular strip ignored UK yield (not in POPULAR) | UK yield now in POPULAR_TOOL_SLUGS | Hub + homepage discovery | P1 | **Done** |
| 20 | `/business-tools` | Hub | Margin cluster guides not featured | Featured markup + gross-vs-net posts | Hub discovery | P2 | **Done** |

**Not in the top 20 (do nothing this sprint):** remaining 200+ tools, locale expansion, new programmatic amounts, AI SEO layers.

After deploy: recrawl P0 URLs in GSC. Re-score when a new export has clicks or ≥4 weeks of data.
