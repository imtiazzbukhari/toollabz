# Tool SEO opportunity matrix

**Date:** 2026-09-06  
**Catalog size:** 280  
**GSC window:** user export 2026-09-06, all clicks = 0. Repo `gsc-data.json` empty.

Priorities use **existing Google evidence first**, then intent, content quality, and whether we can improve the page without fabricating jurisdiction.

No keyword volumes or difficulty scores.

---

## How tools were classified

| Class | Rule |
|---|---|
| **A. Existing winners** | GSC impressions on the exact URL, or page-1 with any impressions |
| **B. Almost-winners** | Position ~10–25 or a parent of impression URLs |
| **C. Low-hanging fruit** | Strong intent + existing editorial + weak current elevation |
| **D. International** | Already in `LOCALIZED_TOOL_SLUGS` or generic math with honest copy |
| **E. Weak SEO potential** | Commodity AI, unverifiable legal, duplicate intent, no GSC, no unique formula |
| **F. Cannibalization** | Multiple URLs targeting the same query |
| **G. Thin** | `makeFAQs()` only and/or short description |
| **H. Intent mismatch** | Title/schema/engine disagree, or GSC query ≠ page purpose |

---

## A. Existing winners

| Tool | URL | Category | Target intent | Evidence | Audience | Competition (public) | Weakness | Action | Pri |
|---|---|---|---|---|---|---|---|---|---|
| UK rental yield | `/tools/rental-yield-calculator-uk` | real-estate | rental yield / yield calculator / BTL UK | 207 impr, pos 35.54; “yield calculator” 101 / pos 23.8 | UK landlords | Savills, Landlord Studio, Omni, Zoopla | Authority; was thin (now enriched) | Recrawl after deploy; outreach | P0 |
| Salary after tax (flat-rate) | `/tools/salary-after-tax-calculator` | finance | salary after tax calculator (generic) | 121 impr, pos 30.91 | Anyone sketching net from a rate | Listen To Taxman, The Salary Calculator, GOV.UK (UK-specific) | Live title still UK (undeployed honesty fix) | Deploy honesty; do not claim PAYE | P0 |
| Profit margin | `/tools/profit-margin-calculator` | business | profit margin calculator | 22 impr, pos 44.86; query pos 18 | Operators / students | Omni, Calculator.net, CFI | Mid-SERP; sibling business URL | Keep formula-first; link markup | P1 |
| JWT decoder | `/tools/jwt-decoder` | developer | jwt decoder | 7 impr, pos 4.00 | Developers | jwt.io | Tiny sample | Watch; no CTR rewrite | P3 |
| Homepage | `/` | — | brand | 16 impr, pos 4.81 | Direct / brand | — | 0 clicks = noise | No redesign | P3 |

---

## B. Almost-winners

| Tool | URL | Category | Intent | Evidence | Weakness | Action | Pri |
|---|---|---|---|---|---|---|---|
| AI resume summary | `/tools/ai-resume-summary-generator` | generators | resume summary generator | 13 impr, pos 20.15 | Commodity AI SERP | Optional title later | P3 |
| SaaS valuation | `/tools/saas-valuation-calculator` | business | saas valuation | 8 impr, pos 16.88 | Tiny volume | One clearer example later | P3 |
| Loan calculator (parent) | `/tools/loan-calculator` | finance | loan / EMI | Amount URLs have 16+13 impr at pos ~55–58 | Parent not in export | Keep parent canonical; no new amounts | P2 |
| UK salary PAYE | `/tools/salary-after-tax-calculator-uk` | finance | UK take-home | Not in this export | Correct engine, less discovery | Keep disambiguated from generic | P1 |
| AI LinkedIn | `/tools/ai-linkedin-post-generator` | generators | linkedin post drafts | 26 impr, pos 62.46 | Page 6–7 commodity | Do not rewrite now | P2 |

---

## C. Low-hanging fruit (English)

Tools with **real search intent**, existing blogs or priority editorial, and no fabricated volumes.

| Tool | URL | Category | Intent | Evidence | Weakness | Action | Pri |
|---|---|---|---|---|---|---|---|
| Generic rental yield | `/tools/rental-yield-calculator` | real-estate | rental yield (non-UK) | Not in GSC export; sibling of #1 URL | Thin `makeFAQs`; must not steal UK queries | Cross-link UK tool; keep generic formula | P2 |
| Markup | `/tools/markup-calculator` | business | markup vs margin | Blog already points at margin tool | Weaker discovery than margin | Reciprocal related (already on margin) | P2 |
| VAT (UK labelled) | `/tools/vat-calculator` | finance | VAT calculator UK | Localized; blogs exist | Must stay UK-rate honest | No locale tax invention | P2 |
| Compound interest | `/tools/compound-interest-calculator` | finance | compound interest | Localized; related to retirement | Generic FAQs in data.ts | Cluster with savings/retirement | P2 |
| EMI | `/tools/emi-calculator` | finance | EMI calculator | Multiple EMI blogs | Duplicate-ish with loan | Keep both; loan is localized | P2 |
| Percentage | `/tools/percentage-calculator` | calculators | percentage calculator | Localized | Generic FAQs | Fine as supporting tool | P2 |
| BMI | `/tools/bmi-calculator` | calculators | bmi calculator | Localized; inbound links added this pass | Orphan inbound was weak | Do not invent medical claims | P2 |
| Paycheck USA | `/tools/paycheck-calculator-usa` | finance | US paycheck | Popular strip | Jurisdiction-specific | English-only | P2 |
| Break-even | `/tools/break-even-calculator` | business | break-even | Blog cluster exists | Sibling `*-business` | Disambiguate in copy | P2 |

---

## D. International opportunities

Only the **12 catalog tools**. Same set for all 18 locales in code; **demand is not equal**.

| Locale group | Best tools | Why | Do not add |
|---|---|---|---|
| **fr, es, pt** | loan, generic salary, profit margin, percentage, compound, ROI, currency, BMI | Largest language reach in the catalog; FR already has the deepest loan copy | UK yield, US paycheck, GST AU |
| **da, sv, fi** | percentage, loan, compound, BMI, currency | Universal math; body still English | Country tax clones |
| **cs, sk, pl-adjacent CEE** (cs, sk, hu, ro, hr, sl) | loan, percentage, VAT-as-UK-labelled, margin | Titles exist; mixed-language risk | Fake local VAT law |
| **el, uk, bg** | same generic set | Script/language value; no GSC locale data | Expanding catalog |
| **lt, lv, et** | percentage, currency, BMI | Small markets; chrome is enough until impressions appear | Blog translations |

`uk` locale = **Ukrainian**, not United Kingdom.

---

## E. Weak / no realistic SEO potential (now)

Do not spend a sprint here:

- AI generators except the two with tiny GSC rows (`ai-linkedin-post-generator`, `ai-resume-summary-generator`)
- Legal settlement / malpractice / mesothelioma estimators
- Creator trend predictors / hook analyzers
- Duplicate AdSense revenue vs earnings (until one is canonicalized in copy)
- Crypto tax trio without a sourced method
- Image background remover (1-tool category)
- 940 noindex cm-to-feet values

---

## F. Cannibalization

| Cluster | URLs | Treatment |
|---|---|---|
| Salary | generic + UK + CA/TX/NY/FL | Generic = flat-rate; UK/states keep engines; related[] already disambiguates |
| Paycheck | USA + CA + TX | Keep state pages English-only |
| Yield | generic + UK | UK is GSC target; generic is formula sibling |
| Margin | `profit-margin-calculator` + `*-business` | Primary = first; business is duplicate-ish |
| Break-even | pair | Same |
| ROI | general + marketing | Different examples |
| CAC / LTV | general + SaaS | Keep SaaS pair together |
| AdSense | earnings + revenue | High duplicate; do not create a third |
| Tip / password / hourly↔salary | close pairs | Low risk |
| Programmatic amounts vs parent | 169 + 91 | Parent is the calculator; amounts are examples |

---

## G. Thin content

~59 tools use `makeFAQs()`. Highest-cost to ignore among them: `loan-calculator`, `emi-calculator`, `rental-yield-calculator`, `roi-calculator`, `pdf-merge` — insight registry already adds body, so this is **FAQ/schema thinness**, not empty pages.

Do not batch-write 59 unique FAQ sets this sprint.

---

## H. Intent matching issues

| Tool | Issue | Status |
|---|---|---|
| Generic salary | Claimed UK PAYE | Honesty copy in repo, **not live** |
| VAT locale pages | Could look like local VAT | Copy already says UK |
| Yield page vs “fair rent calculator” | Different intent | Do not retarget; rent blog exists |
| Legal calculators | Users want jurisdiction awards | Keep “estimate / not advice” |

---

## Full-catalog note

280 tools are indexed (or indexable) via tool sitemaps. **Success is not 280 page-one rankings.** Success is moving the URLs Google already tests, then the next honest cluster (loan/EMI, VAT, UK salary, markup).

The other ~250 tools should remain useful, linked from hubs, and left alone until GSC shows impressions.
