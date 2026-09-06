# ToolLabz — UK finance implementation

**Date:** 2026-09-06
**Constraint:** no redesign, no UK-tax locale farm, no invented rates, no adsense-history commit.

This report does **not** claim rankings, clicks, or GSC coverage changed.

---

## Existing site audit

| Item | Count / note |
|---|---|
| Tools (after this change) | **281** (was 280; + `stamp-duty-calculator-uk`) |
| Categories | 13 (`finance`, `real-estate`, …) |
| Languages | English unprefixed + 18 prefixed locales. `uk` = Ukrainian |
| Localized tools | 12 catalog slugs only |
| Blogs | **69** article modules (was 67) |
| Important existing clusters | UK yield (GSC 207 impr), generic salary (121 impr), VAT, loan/EMI, US paycheck family, UK self-employed/dividend sketches |

**Overlap kept on purpose:** generic `salary-after-tax-calculator` (flat rate) vs `salary-after-tax-calculator-uk` (PAYE). Honesty tests still forbid branding the generic page as UK.

**Thin / not expanded:** US state salary clones, programmatic loan/salary amounts, self-employed and dividend tools remain user-entered effective %.

---

## Implemented

### New tool

| Field | Value |
|---|---|
| Name | Stamp Duty Calculator UK |
| URL | `/tools/stamp-duty-calculator-uk` |
| Primary keyword | stamp duty calculator |
| Secondary | stamp duty calculator UK, SDLT calculator, England / Scotland / Wales, LBTT, LTT |
| Market / language | UK nations; English only |
| Why | Semrush public competitor pages (July 2026) show 246,000 monthly volume for “stamp duty calculator”. No ToolLabz slug existed. One tool with nation modes avoids five doorway URLs. |

Rates last reviewed **2026-09-06** from GOV.UK SDLT, Scottish Budget 2026-27 LBTT, and GOV.WALES LTT.

### Upgraded tool (same URL)

| Field | Value |
|---|---|
| Name | Salary After Tax Calculator UK |
| URL | `/tools/salary-after-tax-calculator-uk` (not a new slug) |
| Primary cluster | UK take-home / salary calculator UK |
| What changed | User-typed tax/NI % replaced with 2026/27 published bands, employee NI, pension, salary sacrifice, student loan plans, Scotland vs rUK, monthly/weekly/yearly net, employer NI cost |

Generic `/tools/salary-after-tax-calculator` is unchanged.

### New / updated blogs

| Title | Language | Target | Related tool | URL |
|---|---|---|---|---|
| How is take-home pay calculated in the UK? | EN | take-home / Income Tax vs NI | salary-after-tax-calculator-uk | `/blog/uk-take-home-pay-income-tax-national-insurance` |
| How does stamp duty work in England, Scotland and Wales? | EN | stamp duty / SDLT vs LBTT vs LTT | stamp-duty-calculator-uk | `/blog/uk-stamp-duty-england-scotland-wales-guide` |
| How to calculate take-home salary (country guide) | EN | updated links | + UK PAYE tool | existing slug |
| UK self-employed / dividend / PAYE sketches | EN | copy now matches published PAYE engine | salary-after-tax-calculator-uk | existing slug |

### SEO / technical

- Self-canonical `/tools/{slug}` via existing `toolMetadata()`
- Hreflang: English + `x-default` only (not in `LOCALIZED_TOOL_SLUGS`)
- Auto-included in tools sitemap and blog sitemap
- robots.txt unchanged (still disallows `/api/`, `/admin/`, etc.)
- Title/meta overrides; GOV.UK / gov.scot / gov.wales sources; FAQ + WebApplication schema via existing tool template
- Hub links: `/uk-finance-tax`, finance + real-estate cluster nav, featured blogs
- No nginx, SSL, middleware, `.env`, or `:3000` changes

### Multilingual

**No new locale pages** for stamp duty or UK PAYE. Jurisdiction is labelled UK on the English pages. The 12-slug catalog is unchanged. FR/ES/PT were not given UK tax copies.

---

## Files changed

| File | Change |
|---|---|
| `lib/tools/uk-finance/published-rates-2026-27.ts` | Published bands + source URLs |
| `lib/tools/uk-finance/stamp-duty.ts` | SDLT / LBTT / LTT + cash required |
| `lib/tools/uk-finance/take-home.ts` | PAYE take-home |
| `lib/tools/data.ts` | UK salary fields + new stamp-duty definition; yield related + FAQ |
| `lib/tools/engine.ts` | Dispatch to the two compute modules |
| `lib/tools/content.ts` | Formulas |
| `lib/tools/insight-registry/registry-c.ts` | UK salary insight |
| `lib/tools/insight-registry/registry-j.ts` | Stamp duty insight |
| `lib/tools/phase1-seo.ts` | Profiles / FAQs |
| `lib/tools/category-sources.ts` | Official citations |
| `lib/seo.ts` | Title/meta overrides |
| `app/uk-finance-tax/page.tsx` | Hub tools, blogs, table copy |
| `components/CategoryHubLongform.tsx` | Cluster links |
| `lib/blog/hub-featured-slugs.ts` | Featured guides |
| `lib/tools/popular-tools.ts` | Authority extra slug |
| `lib/blog/articles/uk-stamp-duty-england-scotland-wales-guide.tsx` | New article |
| `lib/blog/articles/uk-take-home-pay-income-tax-national-insurance.tsx` | New article |
| `lib/blog/articles/how-to-calculate-take-home-salary-country-guide.tsx` | UK tool link |
| `lib/blog/articles/uk-self-employed-dividend-salary-effective-percent-toollabz.tsx` | PAYE copy |
| `lib/blog/articles.manifest.ts` | Regenerated (69 modules) |
| `tests/uk-stamp-duty.test.ts` | Official examples |
| `tests/uk-take-home.test.ts` | PAYE fixtures |
| `tests/engine.test.ts` | Form fixtures |
| `tests/seo-tools.test.ts` | New slug in country list |

`lib/content-engine/adsense/adsense-history.json` is a local runtime file and is **not** part of this work.

---

## Tests

| Check | Result |
|---|---|
| `tests/uk-stamp-duty.test.ts` | Pass (GOV.UK £4,750 / £10,000, Wales £3,300 / £15,950, Scottish FTB/ADS) |
| `tests/uk-take-home.test.ts` | Pass (£60,000 England net £45,357.40; Scotland; sacrifice vs pension; employer NI) |
| `tests/engine.test.ts` | Pass |
| system-integrity, insights, related slugs, FAQs | Pass |
| i18n hreflang / fields / workspace | Pass |
| sitemap-integrity, salary honesty, ranking-recovery | Pass |
| TypeScript (`next build`) | Pass |
| Production build | Pass — Next 15.5.14, 684 pages, standalone assets OK |
| Lint on changed new modules | Clean. `content.ts` still has two **pre-existing** unused-import warnings |
| `tests/seo-tools.test.ts` / `tool-serp-metadata.test.ts` | Still fail on **pre-existing** catalog titles/metas (paycheck USA, many auto descriptions). New UK pages meet the 140–155 description and name-in-title checks |

---

## Remaining opportunities (not built)

Documented only — no first-party GSC and/or would duplicate official calculators:

1. CIS calculator
2. IR35 / contractor take-home
3. Standalone employer-NI tool (employer cost is already an extra on the UK salary page)
4. Statutory dividend-band engine (existing tool stays effective %)
5. Holiday pay calculator
6. First-time-buyer **total-cost** wrapper (stamp duty + fees + deposit)
7. Locale translations of UK tax pages — **do not**

---

## AdSense / quality

Two substantial English guides, one new calculator, one upgraded calculator. No keyword-variant doorway set. YMYL pages cite official sources and state they are estimates.
