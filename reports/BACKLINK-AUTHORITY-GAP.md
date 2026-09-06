# Backlink / authority gap

**Date:** 2026-09-06  
**Honesty rule:** this file does **not** invent referring-domain counts, Domain Rating, Domain Authority, or competitor link profiles.

## What data exists in the repo

| Source | Contents | Usable as backlink evidence? |
|---|---|---|
| `lib/content-engine/backlinks.json` | `{ "rows": [] }` | No |
| `reports/gsc-db-opportunities.md` | DATABASE_URL unset (2026-05-15) | No |
| `reports/SEO_BACKLINK_ASSET_REPORT.md` | Outreach *assets* (shareable posts), not live links | No RD counts |
| `lib/backlinks/*`, SEO console backlink UI | Prospecting / generation tooling | Not a measured link graph |
| `reports/HOMEPAGE_AUTHORITY_UPGRADE.md` | Notes “low referring domains” as a hypothesis | Qualitative only |

**Referring-domain evidence: unavailable.** No Ahrefs/Moz/Majestic/GSC links export is in the repository.

## What we can infer without fabricating numbers

1. **GSC performance:** impressions exist; clicks in this export are 0; best pages sit at average positions **20–36** (yield, salary) or worse. That pattern is typical of pages that are *eligible* but lose to stronger domains on the same query — it is **not proof** of a specific DR gap.
2. **Site age:** public Organization schema / content stamps are 2026. A new domain is usually at an authority disadvantage on “rental yield calculator” and “salary after tax calculator” against incumbents.
3. **No measured live backlinks** are stored. Outreach templates exist; that is not the same as acquired links.

## Priority-page competitor comparison (qualitative)

| Competitor class | Relevant page (typical SERP) | Referring-domain evidence | Content advantage we can control | Authority disadvantage |
|---|---|---|---|---|
| UK property portals / broker calculators | “Rental yield calculator UK” | **Unknown here** | We can show **gross and net** with a documented formula and GBP monthly rent — many SERP tools show only gross | Likely high: brands + property inventory + aged domains |
| Bank / comparison sites | “Yield calculator” / buy-to-let | **Unknown** | Transparent assumptions; no account wall | High |
| HMRC / payroll brands | “Salary after tax calculator” | **Unknown** | Honest flat-rate page + separate UK engine (avoid fake PAYE) | High on UK salary SERPs |
| Spreadsheet / accounting blogs | “Profit margin calculator” | **Unknown** | Margin vs markup on the same numbers | Medium–high |

Do not treat the empty backlink JSON as “zero backlinks.” Treat it as **not measured**.

## Realistic link opportunities (human outreach only)

From `reports/SEO_BACKLINK_ASSET_REPORT.md` — still valid, still not automatic:

- `/blog/how-much-can-i-rent-my-house-for-uk` + `/tools/rental-yield-calculator-uk` — UK landlord / BTL communities (follow each forum’s rules).
- `/blog/rental-yield-vs-monthly-cash-flow-investment-property` — “yield ≠ cash flow” is a citeable distinction.
- `/blog/markup-vs-margin-formulas-pricing-mistakes` — pricing / ops newsletters.
- `/blog/how-to-estimate-take-home-pay-from-gross-salary` — career / offer-negotiation posts (disclose planning-only).
- Developer posts already listed for JWT/JSON (supports `/tools/jwt-decoder` if that query grows).

Cap: cite a specific paragraph; no blast lists; no PBN.

## Verdict on authority

**Likely a real bottleneck, unquantified.** Content relevance was the *actionable* gap this sprint. Authority is the reason even a better page may stay at positions 15–30 until other sites cite it. Next measurement: import a GSC “Links” export or a single Ahrefs/Moz crawl into the repo before claiming RD movement.
