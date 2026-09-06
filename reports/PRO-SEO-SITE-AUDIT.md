# ToolLabz — full-site SEO audit

**Date:** 2026-09-06  
**Catalog:** 280 tools, 13 categories, 102 blog posts  
**Evidence:** repository code, existing reports, user-supplied GSC export (all clicks = 0).  
**Not available:** Ahrefs/Semrush/Moz, GSC Links, Postgres GSC (`gsc-data.json` is empty).

No search volumes, keyword difficulties, or authority scores are invented here.

---

## 1. Critical problems

| Problem | Evidence | Why it matters |
|---|---|---|
| International routes not on production | Live `/fr/` = 404; live robots omits 18 locale sitemaps | Code is ready (`31b258c` + later work). Shipping English-only while hreflang/sitemaps exist in git creates a deploy mismatch. |
| Salary honesty still live-old | Production title still claims UK 2026/27 take-home; engine is flat-rate | GSC already sends 121 impressions to this URL. Mismatch is a trust and relevance bug. |
| Authority unmeasured and publicly invisible | No third-party `"toollabz.com"` citations found; founded April 2026 | Page-one on “rental yield calculator uk” / “salary after tax calculator” is not a content-only problem. |
| 329 “crawled — not indexed” URLs | `reports/GSC-URL-CLASSIFICATION.md` | Quality/duplication signal, not a crawl-budget emergency. Do **not** mass-index. |

These are **not** nginx/SSL/:3000 failures. Technical English SEO is largely correct in code.

---

## 2. High-priority problems

| Problem | Evidence |
|---|---|
| Locale tool pages linked the first 6 catalog slugs, not topical peers | `/fr/tools/loan-calculator` could surface BMI/JSON. **Fixed this pass** via `LOCALIZED_RELATED_SLUGS`. |
| Broken `related[]` slugs | Missing tools: `revenue-growth-calculator`, `email-open-rate-calculator`, `email-click-rate-calculator`, `customer-payback-period-calculator`, `engagement-rate-calculator-instagram`, `landing-page-conversion-calculator`. **Fixed this pass.** |
| English calculator chrome on every locale page | “Calculate”, “Copy”, “Your results”, newsletter “Subscribe”. **Fixed this pass** (`workspace-messages.ts`). |
| Mixed-language locale bodies | 15 locales have translated titles/H1/fields; FAQs/assumptions stay English. Indexable under `lang=cs` etc. |
| GSC winners still mid-SERP | UK yield 207 impr / pos 35.5; generic salary 121 / pos 30.9; profit margin 22 / pos 44.9. Content was already enriched in the ranking-recovery pass (undeployed). |
| Cannibalization clusters | Salary (generic + UK + 5 US states); rental yield generic vs UK; adsense earnings vs revenue; profit-margin vs profit-margin-business; break-even pair. |

---

## 3. Medium problems

- **227 tools** have no SERP title override, priority editorial, popular/homepage slot, or locale catalog entry. They rely on hub grids + insight registry.
- **59 tools** still use the generic 2-FAQ `makeFAQs()` template.
- Programmatic families: 169 loan amounts, 91 salary amounts, up to 1000 cm values — high-tier sitemap only (65 programmatic URLs). Two amount URLs already have GSC impressions.
- Footer English “top tools” previously included `paycheck-calculator-usa` on locale pages. **Fixed this pass** for non-English locales.
- Insight panel on locale pages remains English (`getToolInsight()`).
- Blog posts are English-only; locale `/blog` is an index that links to English articles.
- Header “UK tax” always points at `/uk-finance-tax` (intentional; not localized).

---

## 4. Low-priority problems

- Tiny page-1 GSC rows (`/`, `/tools/jwt-decoder`) with 7–16 impressions and 0 clicks — sampling noise, not a CTR crisis.
- `LanguageSwitcher` `aria-label` was hardcoded English. **Fixed this pass.**
- Image category has 1 tool.
- Legal/creator/AI generator tools are commodity SERPs with no GSC evidence.

---

## 5. Opportunities

1. Recrawl the three GSC impression URLs after deploy (content already improved).
2. Earn **page-level** links to UK yield, profit-margin + markup article, UK rent guide.
3. Deepen **fr / es / pt** body copy for `loan-calculator`, `salary-after-tax-calculator`, `profit-margin-calculator` only.
4. Strengthen English clusters that already have blogs: EMI/loan, VAT/GST, JWT/JSON, rent vs buy, markup/margin.
5. Keep programmatic families frozen.

---

## 6. Pages/tools with existing SEO potential

| URL | Why |
|---|---|
| `/tools/rental-yield-calculator-uk` | 207 impressions; Google already testing |
| `/tools/salary-after-tax-calculator` | 121 impressions; honest generic math |
| `/tools/profit-margin-calculator` | 22 impressions; formula-first page |
| `/tools/loan-calculator` | Parent of amount URLs; localized |
| `/tools/salary-after-tax-calculator-uk` | Correct UK PAYE engine (no GSC row yet) |
| `/tools/saas-valuation-calculator` | Pos 16.9, 8 impressions |
| `/tools/ai-resume-summary-generator` | Pos 20, 13 impressions |
| `/tools/jwt-decoder` | Pos 4, tiny volume |
| `/tools/vat-calculator`, `/tools/compound-interest-calculator`, `/tools/roi-calculator`, `/tools/percentage-calculator`, `/tools/currency-converter`, `/tools/bmi-calculator` | Localized + universal intent |
| Cluster blogs | EMI, UK rent, yield vs cash flow, markup vs margin, take-home salary |

---

## 7. Pages/tools that should NOT be indexed

| Family | Policy |
|---|---|
| `/login`, `/signup`, `/embed/*`, `/dashboard/*`, `/seo-growth-console/*`, `/api/*` | noindex / robots |
| Low-tier programmatic amounts / cm | noindex + parent canonical |
| Country stubs + country×amount mirrors | 301 to parent / regional tool |
| `/en/…` | 301 to unprefixed English |
| Non-catalog locale guesses (`/fr/tools/jwt-decoder`) | 404, noindex |
| Thin legal estimators that imply jurisdiction they do not implement | Keep indexable only if copy stays “estimate / not legal advice”; do not mass-clone by country |

Do **not** force-index the 329 crawled-not-indexed URLs.

---

## 8. Pages/tools that need content improvement

**P0 (already drafted, undeployed):** UK yield, generic salary honesty, profit margin.

**P1:** `/tools/rental-yield-calculator` (disambiguate vs UK), `/tools/salary-after-tax-calculator-uk` (real PAYE depth), `/tools/loan-calculator` (still `makeFAQs()` in `data.ts`; insight registry covers some), `/tools/markup-calculator` (pair with margin).

**P2:** 59 generic-FAQ tools in finance/converters; adsense pair (merge intent in copy, do not delete URLs yet).

**Do not:** rewrite AI generators, legal settlement estimators, or 200+ long-tail tools before GSC winners move.

---

## 9. Pages/tools that need localization

**Keep catalog at 12 tools.** Expand *depth*, not *count*.

| Tier | Action |
|---|---|
| A | Deploy locales; finish FR/ES/PT bodies for loan, generic salary, profit margin |
| B | Compound interest, ROI, percentage, currency, BMI — FR/ES/PT |
| C | Nordic/CEE: titles already exist; do not blanket-translate FAQs without traffic |
| D | UK/US/AU tax, UK yield, JWT, AI generators, PDF suite beyond merge, programmatic amounts |

VAT stays labelled **UK rates** in every language.

---

## 10. Pages/tools that need internal links

| Gap | Action this pass / next |
|---|---|
| Broken `related[]` | **Fixed** (7 missing slugs) |
| Locale related = catalog order | **Fixed** (topical map) |
| BMI inbound | **Fixed** (`daily-calorie`, `bmi-for-children`) |
| Tip / character-counter inbound | **Fixed** |
| Locale footer → US paycheck | **Fixed** (locale footers use catalog tools) |
| Remaining orphans (legal/creator long-tail) | Leave; hubs + sitemap are enough |
| Blog → tool | UK rent / yield / markup already pointed at GSC URLs |

---

## 11. Pages/tools that could become linkable assets

Existing (do not invent new ones first):

1. `/blog/rental-yield-vs-monthly-cash-flow-investment-property` + UK yield tool  
2. `/blog/markup-vs-margin-formulas-pricing-mistakes` + profit-margin tool  
3. `/blog/how-much-can-i-rent-my-house-for-uk`  
4. `/methodology` + `/editorial-policy`  
5. `/blog/how-to-calculate-emi-formula-examples-free-calculator`  
6. `/tools/jwt-decoder` (developer citations, small GSC)  
7. `/blog/gst-vs-vat-uk-au-cross-border-pricing-toollabz`  
8. `/blog/zakat-calculation-nisab-practical-guide-respectful`  
9. `/glossary`  
10. `/about` (founded date, editorial identity)

New assets only if outreach needs a unique dataset (e.g. worked GBP yield table). Not required to start outreach.

---

## Implementation this pass (code)

- Fixed broken `related[]` targets.
- Topical localized related tools.
- Workspace + newsletter chrome translated for all 18 locales.
- Locale footer top-tools use catalog slugs.
- Language switcher `aria-label` uses `ui.nav.language`.

**Not changed:** nginx/SSL/middleware architecture, programmatic URL count, localization catalog size, blog farm, buying links.
