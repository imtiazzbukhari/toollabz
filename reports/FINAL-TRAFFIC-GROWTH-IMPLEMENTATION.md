# ToolLabz — final traffic-growth implementation

**Date:** 2026-09-06  
**Objective:** Increase real organic usefulness (impressions, rankings, clicks) — not page count.  
**Constraint:** No commit, push, deploy, nginx, SSL, secrets, or `:3000` exposure.

This pass implements only the highest-evidence items from the existing research reports and from the current repository. Recommendations that would add thin pages, fake tax law, or a translation farm were deliberately skipped.

---

## 1. What was implemented

### International (production-safe, quality-gated)

- Fixed locale **field-label key mismatches**. `localizeToolDefinition` maps `copy.fields[field.name]`. Many locale keys (`term`, `price`, `amount`/`rate` on VAT, `value`/`percent`, `from`/`to`, `files`) did not match engine field names, so French/Spanish/Portuguese (and the other 15 locales) still showed **English labels** on the calculator form.
- Localized **select option labels** via `fields["mode.add"]` style keys (VAT add/remove; percentage modes).
- Deepened **FR / ES / PT** copy for the high-value catalog tools: loan, generic salary, profit margin, UK-labelled VAT. Full `whoItsFor`, `howItWorks`, assumptions, limitations, how-to, and FAQs — without inventing local tax/TVA/IVA/IRS law.
- Localized **category hubs** now list topical catalog tools (finance → loan/salary/VAT/compound/currency; business → margin/ROI/percentage). Real-estate hubs link the English UK yield tool instead of inventing a localized yield page.
- Locale tool pages **no longer render the English insight panel**.
- Language switcher already maps equivalent catalog pages; related tools stay inside `LOCALIZED_RELATED_SLUGS`.

### Existing-tool SEO (no new slugs)

- **UK rental yield:** optional `monthlyMortgage`. Same gross/net yield formulas. Extra outputs: monthly and annual cash flow = rent − costs/12 − mortgage. Blank mortgage = operating cash flow only, with an explicit note. FAQ + insight + how-to updated. Related now includes `mortgage-affordability-calculator` (a real slug).
- **VAT:** add/remove mode. Default (missing mode) still **adds** VAT to `netAmount`, so existing tests and bookmarks keep working. Reverse: net = gross ÷ (1 + r).
- **Loan:** first-month interest and principal in `extra` (not a 360-row table).
- **Profit margin:** markup-on-cost in `extra` when cost > 0. Primary value remains margin.

### Internal linking / editorial

- Property ROI already related to UK yield (verified).
- Real-estate category hub gained a **UK buy-to-let** cluster nav (yield, generic yield, property ROI, loan, yield-vs-cash-flow article, UK rent guide).
- Yield-vs-cash-flow article CTA now says the UK yield tool can show cash flow when a mortgage payment is entered.

### Tests

- `tests/i18n-field-integrity.test.ts` — every locale field key must exist on the `ToolDefinition` (or be a select-option overlay); FR/ES/PT methodology completeness; hub tool lists.
- Engine assertions for yield cash flow, VAT reverse, loan first month, margin markup.

---

## 2. Why each change was necessary

| Change | Evidence |
|---|---|
| Field-key remap | Code inspection: labels never applied if keys ≠ `field.name`. Visible English UI on locale URLs. |
| FR/ES/PT body depth | GSC + opportunity matrix: loan, generic salary, margin are the international tools worth finishing. Other locales already have titles/H1; fabricating 15× full bodies would be a content farm. |
| Hub tool lists | `/fr/finance-tools` was intro-only — a dead end, not a cluster. |
| Hide English insight | Locale pages must not pretend to be localized while showing an English “Quick answer / Insights” block. |
| Yield cash flow on the existing URL | GSC: `/tools/rental-yield-calculator-uk` is the #1 impression URL (207, pos ~35). Research P1 was a new cash-flow slug. Adding an optional field keeps one indexable URL and matches “fair rent / cash flow” adjacent queries without a doorway page. |
| VAT reverse | Existing FAQ admitted reverse was missing. Same arithmetic, no extra URL. |
| Loan extras | Opportunity matrix: improve the existing loan page; do not ship an amortization table URL. |
| Markup extra | Margin vs markup is the documented confusion; same page already has the FAQ. |
| No new tools / no FR-ES-PT blogs | Research: do not grow the catalog; do not translate the archive until locales are live and measured. |

---

## 3. Which existing tools were prioritized

1. `/tools/rental-yield-calculator-uk` (GSC #1 impressions)
2. `/tools/salary-after-tax-calculator` (GSC #2; honesty already in place; locale bodies deepened)
3. `/tools/profit-margin-calculator` (GSC + cluster hub)
4. `/tools/loan-calculator` (catalog + international)
5. `/tools/vat-calculator` (UK-labelled in every language; reverse mode)
6. Locale catalog siblings used for linking: compound interest, ROI, percentage, currency

---

## 4. Which tools were deliberately NOT changed

- All **268+ non-priority English tools** (no word-count rewrite).
- **UK-only / US-only tax and housing tools** — not translated (`salary-after-tax-calculator-uk`, US paycheck family, GST AU, stamp duty, etc.).
- **Ukrainian `/uk`** — remains Ukrainian, not UK-English.
- Thin **property-ROI** body beyond related-link verification.
- Markup, break-even, SaaS valuation, emergency fund, compound interest English pages — already adequate or not GSC-supported enough to justify a rewrite this pass.
- Programmatic **amount / country** families — not expanded, not mass-indexed.

---

## 5. Which new tools, if any, were created

**None.**

The research P1 candidate `/tools/rental-cash-flow-calculator-uk` was **not** built. Cash flow is an optional output on the existing UK yield calculator.

Later candidates (contribution margin, NPV, IRR, cash-on-cash, simple interest, generic savings, payback, ICR/DSCR, amortization table, margin of safety, generic hours/pay) were **not** built.

---

## 6. Which locales were expanded

Architecture already covers all 18: `fr pt es da sv fi cs ro hu el uk bg sk hr lt lv et sl`.

This pass:

- **All 18:** correct field keys so calculator labels actually translate.
- **FR, ES, PT:** complete methodology/FAQ bodies for loan, salary, margin, VAT (UK-labelled).
- **da–sl:** titles/H1/field labels only. No fabricated long-form.

---

## 7. Which localized tools were created

**No new localized slugs.** The catalog remains 12 tools:

`loan-calculator`, `salary-after-tax-calculator`, `vat-calculator`, `compound-interest-calculator`, `roi-calculator`, `profit-margin-calculator`, `percentage-calculator`, `currency-converter`, `bmi-calculator`, `json-formatter`, `password-generator`, `pdf-merge`.

---

## 8. Which articles were updated

- `lib/blog/articles/rental-yield-vs-monthly-cash-flow-investment-property.tsx` — CTA: UK yield tool now also shows cash flow when a mortgage payment is entered. No new article.

---

## 9. Which articles were created

**None.** The 100+ archive was not farmed. CONTENT-CLUSTER-STRATEGY missing articles stay queued until the priority English tools and locales are live and measured.

---

## 10. Internal-link improvements

- Locale related map already topical (`LOCALIZED_RELATED_SLUGS`); not “first N in catalog”.
- Locale hubs now link their topical calculators.
- Locale real-estate hub → English `/tools/rental-yield-calculator-uk` (the only honest yield page).
- English real-estate category hub: UK buy-to-let cluster nav.
- UK yield related: `mortgage-affordability-calculator` (exists). An earlier draft used `mortgage-payment-calculator`, which **does not exist** — that would have failed `related-slug-integrity`.
- Property ROI ↔ UK yield already present.
- Article → calculator link on yield-vs-cash-flow updated to match the new field.

Broken `related[]` slugs from the earlier integrity pass remain covered by `tests/related-slug-integrity.test.ts`.

---

## 11. Indexing improvements

Followed INDEXING-RECOVERY-PLAN: **do not force the 329 “not indexed” URLs**.

- Locale sitemaps still emit **only** the 20 static catalog paths + 12 tools (32 URLs per locale).
- `/fr/tools/rental-yield-calculator-uk` returns **404** (not in catalog — correct).
- Country stubs remain classified as redirects, not index targets.
- Programmatic amount/country families were not multiplied.
- No mass noindex/index flip.

---

## 12. Technical SEO improvements

Already in place from the i18n architecture commit; re-verified this pass:

- English unprefixed; `/en/about` → `/about` (301 locally; path is `/about`).
- Reciprocal hreflang + `x-default` on catalog pages.
- Locale self-canonical (`https://toollabz.com/fr/tools/loan-calculator`).
- `robots.txt` lists all 18 locale sitemaps plus English page/blog sitemaps.
- Locale sitemap locs are real `https://toollabz.com/{locale}/…` catalog URLs only.
- No `toollabz.com:3000` in generated HTML, robots, or locale sitemaps.
- OAI-SearchBot / GPTBot / Googlebot remain allowed (seo:full-audit).

Local standalone `Location` for `/en/about` used host `0.0.0.0` because the test server binds there. Production still depends on nginx `X-Forwarded-*`. Middleware already strips the Node listen port.

---

## 13. Schema improvements

- Locale tool pages keep WebApplication + HowTo + FAQ + WebPage + BreadcrumbList, now matching **translated** visible FAQs/how-to on FR/ES/PT priority tools.
- FAQ schema is only emitted from real FAQ pairs on the page.
- No fake reviews or ratings.
- Remaining: HowTo step names still use English “Step N” / “How to use {name}” in `howToSchema` — cosmetic, not a fake claim.

---

## 14. Remaining authority gap

Unchanged and still the #1 page-one limiter after content/intent:

- Domain founded April 2026.
- No public third-party `toollabz.com` citations found in prior research.
- No Ahrefs/Moz/DR data in-repo.
- This pass did **not** buy links, submit directories, or add fake citations.
- Assets now slightly more pitchable: UK yield (formula + cash flow + GOV.UK-oriented honesty), margin/markup on one page, VAT reverse.

Outreach remains a **manual editorial** job after deploy.

---

## 15. Remaining content gaps

- English cluster tools that are still thin (generic rental yield, property ROI how-to, some personal-finance pages) were not rewritten.
- No new editorial articles (yield vs cash flow already exists).
- GSC “fair rent calculator” (pos ~99) is **wrong intent** for yield — do not retitle the yield page as a fair-rent tool.
- Programmatic loan/salary amount pages remain low-value; architecture left as-is.

---

## 16. Remaining international gaps

- **da–sl** tool bodies still fall back to English methodology where overrides are title-only. Safe, but not a full-language experience.
- VAT/percentage **select options** are fully translated only for FR/ES/PT (and EN). Other locales may show English option text with translated field labels.
- No localized blog articles.
- No localized UK yield (correct: UK BTL, not a French/Spanish tax product).
- Live production may still 404 `/fr/` until this work is **deployed** (not done in this pass).

---

## 17. Tests

**New / extended (all passing):**

- `tests/i18n-field-integrity.test.ts`
- `tests/engine.test.ts` (yield cash flow, VAT reverse, loan extras, markup extra)
- Existing: `i18n-hreflang`, `i18n-workspace`, `related-slug-integrity`, `ranking-recovery-priority-pages`, `salary-schema-honesty`, `seo-full-audit`

**Full `npm test`:** 107 passed, **4 failed** — same pre-existing suite, not caused by this pass:

| File | Why it fails (pre-existing) |
|---|---|
| `tests/seo-tools.test.ts` | Auto meta descriptions do not start with each tool’s `description` for dozens of older tools |
| `tests/tool-serp-metadata.test.ts` | Title overrides omit exact `tool.name`; many descriptions are not 140–160 chars |
| `tests/seo-domination-modules.test.ts` | Empty GSC/revenue fixture → 0 cluster revenue rows |

Those tests encode a “unique title contains exact name / 140–160 chars / non-empty GSC” policy that the live metadata layer already diverged from. Fixing them would mean rewriting ~50 tool titles for a test, not for traffic.

`npm run seo:full-audit`: **296 passed, 0 failed**.

---

## 18. Build result

```
npm run build
Next.js 15.5.14
✓ Compiled successfully
✓ Type check passed
✓ Generating static pages (684/684)
[validate-standalone-assets] OK
```

Locale route group `[locale]/[[...slug]]` includes `/fr`, `/fr/tools`, `/fr/about`, and 69 further catalog paths.

---

## 19. Known limitations

- **Not deployed.** Live `/fr/` can still 404 until a production release.
- Calculator **result strings** (`Monthly Payment`, `VAT summary`, currency `$`) stay English — they come from `engine.ts`. Translating them without a message catalog would be fabrication or a large i18n of outputs. Documented, not faked.
- Embedded Next.js **English 404 fallback** appears in the RSC payload of locale pages; the visible locale chrome is translated.
- `/fr/` (trailing slash) returns **308** → `/fr` (correct).
- Local `/en/about` Location host is `0.0.0.0` on standalone; path `/about` is correct.
- Browser E2E click-through of the new yield mortgage field was not run (no Playwright pass this session). Engine tests cover the math.
- Homepage was not stuffed with 250 tools; no homepage redesign.

---

## 20. Recommended next actions

1. **Deploy** this branch with the earlier i18n + salary-honesty work (together). Then `/fr/` = 200 and locale sitemaps appear in live robots.
2. **Request indexing** only for: `/`, `/tools/rental-yield-calculator-uk`, `/tools/salary-after-tax-calculator`, `/tools/profit-margin-calculator`, `/tools/loan-calculator`, `/fr/`, `/fr/tools/loan-calculator`, `/es/`, `/pt/`.
3. Re-export GSC after 2–4 weeks. Decide FR/ES/PT **blog** topics from actual locale queries — do not translate the archive first.
4. If yield cash-flow usage is high, tighten the first-screen English explanation only — still no second URL.
5. Manual editorial pitches for the UK yield + margin pages. No PBNs, no directories.
6. Leave programmatic amount pages alone unless GSC shows they cannibalize the parent tools after recrawl.
7. Do not build NPV/IRR/contribution-margin tools until a later GSC-backed pass.

---

## Live-ready verification (local standalone, 2026-09-06)

| Check | Result |
|---|---|
| `GET /` | 200 |
| `GET /fr` `/es` `/pt` | 200 |
| `GET /fr/tools/loan-calculator` | 200, H1 « Calculateur de prêt », field « Durée », self-canonical, reciprocal hreflang + x-default |
| `GET /es/tools/profit-margin-calculator` | 200 |
| `GET /pt/tools/salary-after-tax-calculator` | 200 |
| `GET /fr/finance-tools` | 200, lists prêt / salaire / TVA |
| `GET /fr/tools/rental-yield-calculator-uk` | 404 (not in locale catalog) |
| `GET /en/about` | 301 → `/about` |
| `toollabz.com:3000` in HTML/robots/sitemaps | none |
| `/fr/sitemap.xml` | 32 catalog URLs only, `https://toollabz.com/fr/…` |
| `robots.txt` | all 18 `/{locale}/sitemap.xml` lines |

---

## Success criteria (honest)

This implementation cannot create clicks by itself. What it *can* do:

- Stop locale pages from looking like English doorways.
- Make the one GSC-proven property URL answer cash-flow as well as yield.
- Keep the catalog size stable.
- Keep indexable locale URLs limited to pages that actually have translations.

Traffic, impressions, and top-10 movement require **deploy + recrawl + time + authority**.
