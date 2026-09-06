# GSC SEO opportunity queue

**Export date:** 2026-09-06 (user-supplied).  
**Clicks in export:** 0 for every row.  
**Repo DB:** `lib/content-engine/gsc-data.json` = `{ "rows": [] }`; Postgres unset.

Google is **testing** a small set of URLs. Those beat hypothetical new pages.

Scoring (not a ranking promise):

`score ≈ impressions × proximity × intent × improvement`

| Factor | Scale |
|---|---|
| Proximity | 1–10 = 1.00; 11–20 = 0.85; 21–40 = 0.70; 41+ = 0.40 |
| Intent | Calculator = 1.0; mixed = 0.7; brand/home = 0.4 |
| Improvement | Clear content/authority gap = 1.0; tiny-sample CTR = 0.3 |

Expected clicks at 7–16 impressions near position 4 are often **&lt; 1**. Do not treat those as CTR failures.

---

## Ranked queue

| # | URL / query | Impr | Pos | Why Google is testing it | Intent match | Content quality | Can improve? | Competition (public) | Intl? | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/tools/rental-yield-calculator-uk` | 207 | 35.54 | Strongest impression page | High (UK BTL) | Enriched in ranking-recovery (undeployed) | Recrawl + links | Aged property brands | No — keep English UK | **P0** |
| 2 | Query: yield calculator | 101 | 23.8 | Same URL | High | Same | Same | Omni / property portals | No | **P0** |
| 3 | `/tools/salary-after-tax-calculator` | 121 | 30.91 | Generic salary queries | High if honest; **was** UK-mismatched | Honesty in repo | Deploy | Specialist tax sites | Yes — already localized | **P0** |
| 4 | Query: salary after tax / salary tax calculator | — | 20–27 | Same URL | High | Same | Same | LTTM, TSC | Yes | **P0** |
| 5 | `/tools/profit-margin-calculator` | 22 | 44.86 | “margin calculators” + exact query | High | Formula-first done | Recrawl + markup cluster | Omni / CFI | Yes — localized | **P1** |
| 6 | Query: profit margin calculator | — | 18 | Same URL | High | Same | Same | Same | Yes | **P1** |
| 7 | Query: buy to let yield calculator | 21 | 72.81 | Same as #1, farther | High | Page now states BTL + GBP | Covered by #1 | UK property | No | **P0** |
| 8 | `/tools/ai-linkedin-post-generator` | 26 | 62.46 | Commodity | Medium | Adequate | Not this cycle | Saturated AI | No | P2 |
| 9 | `/loan-calculator/p/250000` | 16 | 58.25 | Amount template | Medium | Unique math | Do not spawn more | Parent loan SERP | No | P2 |
| 10 | `/loan-calculator/p/500000` | 13 | 55.00 | Same family | Medium | Same | Same | Same | No | P2 |
| 11 | `/tools/ai-resume-summary-generator` | 13 | 20.15 | Near page 2 | Medium | Adequate | Watch | Saturated | No | P3 |
| 12 | `/` | 16 | 4.81 | Brand / sitelinks-ish | Low | Fine | No redesign | — | Locales exist in code | P3 |
| 13 | `/tools/saas-valuation-calculator` | 8 | 16.88 | Almost page 1 | Medium | Thin volume | Later example | Heavy SaaS content | No | P3 |
| 14 | `/tools/jwt-decoder` | 7 | 4.00 | Page 1 | High | Fine | Watch CTR next window | jwt.io | No | P3 |
| 15 | Query: fair rent calculator | 8 | 99.75 | **Wrong** for yield page | Rent-setting | Rent blog exists | Do not retarget yield | — | No | P2 (link only) |
| 16 | `/tools/salary-after-tax-calculator-uk` | — | — | Not in export | High for UK PAYE | Real engine | Discovery, not rewrite | HMRC / LTTM | **Do not localize** | P1 |
| 17 | `/tools/loan-calculator` | — | — | Parent of #9–10 | High | Localized | Keep canonical | Bank/Omni | Yes | P2 |
| 18 | Locale `/fr/…` etc. | — | — | **Not live** | — | Chrome + 12 tools | Deploy atomically | Local incumbents | Yes | P0 infra |

---

## Pages Google is already testing (do more of this)

1. UK yield tool + yield/BTL queries  
2. Generic salary tool + “salary after tax calculator”  
3. Profit margin tool  
4. Two loan **amount** URLs (do not expand the family)

Everything else in the 280-tool catalog is **unproven** in this export.

---

## High impressions + poor CTR

There are **no high-impression page-1 CTR failures**. 0 clicks at positions 20–36 is the expected CTR curve.

Do not rewrite titles on `/` or JWT for “CTR optimization.”

---

## International GSC

No locale impressions exist because **locale URLs 404 on production**. After deploy, monitor:

- `/{locale}/tools/loan-calculator`
- `/{locale}/tools/salary-after-tax-calculator`
- `/{locale}/tools/profit-margin-calculator`
- `/{locale}/` and `/{locale}/tools`

If a locale gets impressions with mixed English body, deepen that locale’s FAQs before adding more tools.

---

## What to ignore in GSC coverage

| Bucket | Count | Action |
|---|---|---|
| Crawled not indexed | 329 | Quality gate; no mass request |
| Redirects | 182 | Keep |
| Alt canonical | 116 | Keep consolidation |
| Discovered not indexed | 8 | Wait / one hub link if a useful URL |
| Soft 404 | 5 | Already redirected in code |
| Excluded noindex | 10 | Intentional |

See `reports/INDEXING-RECOVERY-PLAN.md`.
