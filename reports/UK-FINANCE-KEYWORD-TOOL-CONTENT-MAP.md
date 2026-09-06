# UK finance keyword → tool → content map

**Date:** 2026-09-06
**Rule:** volumes and CPC below are copied from **public Semrush website-overview pages** dated July 2026. Keyword difficulty (KD) was **not** shown. ToolLabz GSC clicks remain 0 in the 2026-09-06 export.

Do not treat CPC as SEO difficulty.

---

## Evidence (verified public sources)

| Keyword | Intent (Semrush label) | Volume | CPC (USD) | KD | Source |
|---|---|---|---|---|---|
| stamp duty calculator | I | 246,000 | 0.11 | N/A | [stampdutycalculator.org.uk](https://www.semrush.com/website/stampdutycalculator.org.uk/overview/), [moneyhelper.org.uk](https://www.semrush.com/website/moneyhelper.org.uk/overview/) |
| sdlt calculator | C | 40,500 | 0.23 | N/A | stampdutycalculator.org.uk Semrush overview |
| stamp duty calculator uk | I | 40,500 | 0.08 | N/A | same |
| stamp duty | I | 74,000 | 0.11 | N/A | same |
| salary calculator | C | 368,000 | 0.97 | N/A | [thesalarycalculator.co.uk](https://www.semrush.com/website/thesalarycalculator.co.uk/overview/) |
| take home pay calculator | C | 301,000 | 1.35 | N/A | same |
| salary calculator uk | C I | 90,500 | 0.93 | N/A | same |
| uk salary calculator | I | 33,100 | 0.93 | N/A | same |
| tax calculator | C | 246,000 | 1.02 | N/A | same |

Organic SEO difficulty: **N/A**. Paid Ads competition: **N/A** beyond the CPC column above. Incumbents observed in public search: HMRC SDLT calculator, MoneyHelper, dedicated stamp-duty sites, thesalarycalculator.co.uk.

ToolLabz GSC (2026-09-06 export, clicks = 0): `/tools/rental-yield-calculator-uk` 207 impressions; `/tools/salary-after-tax-calculator` 121 impressions. No stamp-duty URL existed.

---

## Clusters (one URL per intent)

| Primary keyword | Secondary | Intent | Existing URL | Action | Language | Country | Cannibalization | Priority |
|---|---|---|---|---|---|---|---|---|
| stamp duty calculator | SDLT / stamp duty UK / England / Scotland / Wales / LBTT / LTT | Calculate residential purchase tax + cash needed | none | **New** `/tools/stamp-duty-calculator-uk` with nation modes | English only | UK nations | Do not split into five tools | P1 |
| take home pay / salary calculator UK | salary after tax UK, PAYE, net salary UK | Estimate PAYE net | `/tools/salary-after-tax-calculator-uk` | **Upgrade in place** (bands, NI, pension, sacrifice, student loan, Scotland) | English only | UK | Do not clone generic or US paycheck URLs | P1 |
| salary after tax (generic) | net from a rate | Flat-rate planner | `/tools/salary-after-tax-calculator` | Keep as-is (honesty tests) | Localized catalog | none | Must not claim UK PAYE | Keep |
| self-employed UK / dividend UK | effective % sketches | Planning with user rates | existing UK slugs | Keep sketches; do not invent HMRC self-employed engines | English only | UK | Separate from PAYE | Later |
| CIS / IR35 / holiday pay / FTB total cost | — | Unverified as ToolLabz demand | none | **Not built** — no first-party GSC; official/specialist incumbents | — | UK | Would dilute PAYE/SDLT | Later |

---

## Supporting articles (built)

| Title | Language | Target | Related tool | URL |
|---|---|---|---|---|
| How is take-home pay calculated in the UK? | English | UK take-home / Income Tax vs NI | `salary-after-tax-calculator-uk` | `/blog/uk-take-home-pay-income-tax-national-insurance` |
| How does stamp duty work in England, Scotland and Wales? | English | stamp duty / SDLT vs LBTT vs LTT | `stamp-duty-calculator-uk` | `/blog/uk-stamp-duty-england-scotland-wales-guide` |

Not built as separate posts (same intent or already covered): “SDLT explained” as a twin URL; “salary calculator UK” as a second article; country clones.

---

## Localisation decision

UK statutory tools stay **English-only**. `uk` in the locale list is **Ukrainian**, not United Kingdom. Translating PAYE or SDLT into FR/ES/PT would imply unsupported local tax law.
