# ToolLabz — final SEO + AI search + international audit

**Date:** 2026-09-06  
**Domain:** https://toollabz.com  
**Local HEAD (international SEO):** `31b258c4802fad247a31671d49648fa7bec94738`  
**This pass:** salary-after-tax honesty fix on top of that commit (uncommitted at report time)

This report does **not** claim that Google, ChatGPT, Perplexity, or any other engine will rank or cite ToolLabz. It only verifies technical eligibility and discoverability signals.

Evidence labels:

| Label | Meaning |
|---|---|
| **CODE VERIFIED** | Repository generators, tests, or production build |
| **LIVE VERIFIED** | HTTP fetch of current origin `https://toollabz.com` |
| **INFERRED** | Safe conclusion from robots/nginx/headers without replaying a named bot UA |
| **REQUIRES GOOGLE RECRAWL** | Indexing outcome after deploy; not proven here |

---

## Scorecard

| Area | Status | Evidence | Changed? |
|---|---|---|---|
| 1. Technical SEO | **PASS (code)** / **PARTIAL (live)** | CODE: self-canonical, HTTPS origin, no `:3000` in generators, indexable public HTML. LIVE: English site already prerendered 200s; locales not on origin. | No architecture change |
| 2. Google indexing | **CLASSIFIED** | GSC families in `reports/GSC-URL-CLASSIFICATION.md`. “Not indexed” is not treated as a bug. | No |
| 3. Canonical | **PASS (code)** | Tools/hubs self-canonical to `https://toollabz.com…`. `/en/…` is not a canonical English architecture. | No (already in `31b258c`) |
| 4. Redirects | **PASS (code)** | HTTP/www/country stubs/`/en/…` handled. Next.js permanent redirects may emit **308**. | No |
| 5. 404 / soft 404 | **PASS (policy)** | Thin stubs redirect; private/retired stay excluded or 404. | No |
| 6. Sitemaps | **PASS (code)** / **NOT LIVE** | 18 locale sitemaps in repo + robots. LIVE robots has no locale sitemap lines. | No this pass |
| 7. Robots | **PASS** | Public `Allow: /`; private paths disallowed; `/_next/` not blocked. | No |
| 8. AI crawler access | **PASS (robots + public 200)** / **INFERRED for named UAs** | Official bot UAs were **not** replayed against origin `:443`. | No |
| 9. AI-search / GEO readiness | **PASS (eligibility)** | Prerendered formulas, honest metadata after this fix, `llms.txt` supplementary only. No speculative AI hacks. | Salary copy / `llms.txt` line |
| 10. JSON-LD | **PASS (code after fix)** / **LIVE still old** | Generic salary schema no longer claims UK. Other audited types valid. | **Yes — salary honesty** |
| 11. International SEO | **PASS (code)** / **NOT LIVE** | Quality-gated `/fr`…`/sl`; English unprefixed. LIVE `/fr/` = **404**. | No this pass |
| 12. Hreflang | **PASS (code)** / **NOT LIVE** | Reciprocal + `x-default` only for catalog URLs. | No this pass |
| 13. Content quality | **PASS (gated)** | 12 translated tools + static hubs; no country×amount explosion. | Salary EN/locale copy aligned to flat-rate |
| 14. Internal linking | **PASS (code)** | Locale switcher is `<a href>`; hubs/tools linked. | ToolCard subtitle only |
| 15. Performance | **PASS (gated)** | 684 static pages; locale catalog SSR-on-demand except a small SSG set. | No |
| 16. Production safety | **PASS** | No `.env`, secrets, nginx/SSL, or `:3000` public URLs changed. | No |

---

## 1. Technical SEO

**CODE VERIFIED**

- Canonical origin helper uses `https://toollabz.com` in production and strips `www` / localhost.
- Middleware refuses HTTPS redirects that would leak `:3000` (`middleware.ts`).
- Public tool/blog/home routes are App Router pages with metadata + JSON-LD.
- Production build succeeded: Next.js 15.5.14, types valid, 684 static pages generated.

**LIVE VERIFIED**

- `https://toollabz.com/robots.txt` → 200 `text/plain`.
- `https://toollabz.com/tools/salary-after-tax-calculator` → 200 HTML (still the **old** UK-branded title until this fix is deployed).
- `https://toollabz.com/fr/` → **404** (i18n commit not on origin).

---

## 2. Google indexing

**CODE VERIFIED** via `lib/seo/url-classification.ts` and `reports/GSC-URL-CLASSIFICATION.md`.

| Pattern | Class | Action |
|---|---|---|
| Homepage, hubs, catalog tools, blog index, high-tier programmatic | **A. should be indexed** | Already indexable |
| `/en/…`, www, http, hyphenated amount aliases | **B. should redirect** | Already redirect |
| `/login`, `/signup`, `/embed/`, `/dashboard/`, `/seo-growth-console/`, `/api/` | **C. should remain excluded** | noindex + robots |
| Medium/low programmatic, near-duplicate tools | **C. should remain excluded** from forced indexing | Quality gate kept |
| Retired / typo URLs | **D. 404/410** | Keep 404 |
| GSC “crawled/discovered not indexed” (329 + 8) | **C / E** | Not mass-indexed; wait for crawl or quality, not new URLs |

No GSC “not indexed” URL was blindly turned into an index target.

**REQUIRES GOOGLE RECRAWL** after deploy for locale URLs and the salary title change.

---

## 3. Canonical

**CODE VERIFIED**

- English tools: `alternates.canonical` = unprefixed `https://toollabz.com/tools/{slug}`.
- Localized catalog pages: self-canonical on `/{locale}/…` (not forced back to English).
- Untranslated pages: `en` + `x-default` only — no hreflang to missing locales.
- `/en/…` is a compatibility redirect to the unprefixed English URL, not a second English site.

**LIVE VERIFIED (English only):** production English salary page is indexable HTML. Locale canonicals are not live.

---

## 4. Redirects

**CODE VERIFIED**

- HTTP → HTTPS and www → apex: nginx (untouched this pass).
- `/en/…` → unprefixed English (port stripped).
- Country / country×amount stubs: Next `permanent: true` (often **308**). That is intentional SEO consolidation, not a bug.
- No redirect loops or `:3000` Location targets in middleware tests.

**LIVE VERIFIED:** `/fr/` is a real 404 today, not a redirect (commit not deployed).

Do not replace 308 with 301 merely because GSC shows 308.

---

## 5. 404 / soft 404

**CODE VERIFIED** against the GSC classification report.

- Soft-404 thin stubs were already converted to redirects in `31b258c`.
- Localized unknown paths `notFound()`.
- `not-found.tsx` is noindex.

**LIVE VERIFIED:** `/fr/` 404 on production is expected until deploy (class D today; class A after deploy).

---

## 6. Sitemaps

**CODE VERIFIED** (`tests/sitemap-integrity.test.ts`, `npm run seo:validate-sitemaps`, `seo:full-audit`)

- Page / tool-shard / blog sitemaps: `https://toollabz.com`, no localhost, no `:3000`.
- 18 locale sitemaps: `/fr/sitemap.xml` … `/sl/sitemap.xml`.
- Each locale sitemap lists only catalog static paths + 12 localized tools.
- Sitemap index / robots reference those child sitemaps in **code**.

**LIVE VERIFIED:** production `robots.txt` currently lists only:

```
Sitemap: https://toollabz.com/sitemap.xml
Sitemap: https://toollabz.com/tools/sitemap/0.xml
Sitemap: https://toollabz.com/tools/sitemap/1.xml
Sitemap: https://toollabz.com/blog/sitemap.xml
```

No locale sitemap lines on origin. **NOT LIVE.**

---

## 7. Robots

**CODE VERIFIED** and **LIVE VERIFIED** (body matches the public allow/deny policy).

Public: `Allow: /`

Private (remain protected; not opened to AI crawlers):

- `/api/`
- `/embed/`
- `/admin/`
- `/dashboard/`
- `/seo-growth-console/`
- `/login`
- `/signup`

`/_next/` is **not** disallowed.

**Gap (live only):** locale sitemap advertisements exist in repo robots, not on origin.

---

## 8. AI crawler access

Listed agents in repo **and** live robots:

GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, Gemini-User, cohere-ai, meta-externalagent, YouBot — each `Allow: /`.

**LIVE VERIFIED:** public HTML returns 200 for normal fetchers; no Cloudflare/WAF challenge on the salary page fetch used for this report.

**INFERRED (not directly verified):** HTTP 200 when `User-Agent` is exactly `OAI-SearchBot` / `GPTBot` / etc. This environment cannot open a raw TCP socket to origin `:443` with those strings. Nothing in live robots or previously observed nginx headers suggests a UA ACL.

Do not treat this as a passed official-bot access test.

---

## 9. AI-search / GEO readiness

Eligibility only:

- Main formulas are in HTML (salary: `Net Salary = Gross Salary × (1 - Tax Rate)`).
- After this fix, title / H1 / meta / WebApplication / FAQ insight no longer brand the generic tool as UK PAYE or US FICA.
- `public/llms.txt` and `public/llm.txt` now describe the flat-rate tool and point to `/tools/salary-after-tax-calculator-uk`.
- No new `llms` hacks, no fake citations, no invented AI-overview features.

**LIVE VERIFIED:** origin still serves the old UK title and mixed FICA/NI editorial until deploy.

---

## 10. JSON-LD

Audited generators: `WebSite`, `Organization`, `BreadcrumbList`, `WebApplication` (`toolSchema`), `FAQPage`, `HowTo`, `Article`, `WebPage`, `CollectionPage`, author/Person on team/about.

| Check | Result |
|---|---|
| Valid objects (`@context` + `@type`) | **CODE VERIFIED** |
| URL matches canonical path helper | **CODE VERIFIED** (production origin; local NODE_ENV may show localhost in ad-hoc scripts) |
| Fake reviews / ratings | None in tool schema |
| Wrong country on generic salary | **Fixed in code** |
| Schema for invisible content | FAQ insight for generic salary was US/FICA while the form is flat-rate — **fixed** (insight feeds FAQ JSON-LD) |
| Duplicate WebSite on homepage | Layout + homepage both emit `WebSite` + SearchAction. Same entity, not conflicting claims. **Not changed.** |

### Salary-after-tax (the demonstrated bug)

| Surface | Before (live) | After (code) |
|---|---|---|
| Title | “Salary After Tax Calculator 2026/27 — UK Take-Home Pay” | “Salary After Tax Calculator — Net Pay From Gross and a Tax Rate” |
| WebApplication `name` | “Salary After Tax Calculator” | unchanged (already honest) |
| WebApplication `description` | generic / mixed | “Estimates net pay as gross salary × (1 − tax rate). Not a UK or US tax-code engine.” |
| FAQ insight | “federal brackets, FICA…” | Flat-rate formula; explicitly not a tax-code engine |
| UK dedicated tool | `/tools/salary-after-tax-calculator-uk` | Unchanged; still UK NI/pension fields |

Calculator math was **not** changed (`lib/tools/engine.ts` still `net = gross × (1 − taxRate)`).

### Other calculators (same-class mismatch scan)

| Tool | Title flavor | Schema / formula | Verdict |
|---|---|---|---|
| `salary-after-tax-calculator-uk` | UK | UK fields + NI formula | Match — keep |
| `vat-calculator` | “VAT Calculator UK 2026” | Generic rate formula; visible UK VAT editorial | Editorial UK labeling, **not** a false engine. No change. |
| `bmi-calculator` | “BMI Calculator UK” | Standard kg/m²; NHS/WHO copy on page | Editorial, not a false formula. No change. |
| `paycheck-calculator-usa` | US 2026 | US paycheck tool | Match — keep |
| `loan-calculator` | generic | EMI formula | Match — keep |

No other objective “schema claims a country engine the form does not implement” bugs were found.

---

## 11. International SEO

**CODE VERIFIED** in `31b258c` (`lib/i18n/locales.ts`, catalog, messages, `app/[locale]/[[...slug]]`).

English remains unprefixed. Locales:

`/fr/` `/pt/` `/es/` `/da/` `/sv/` `/fi/` `/cs/` `/ro/` `/hu/` `/el/` `/uk/` `/bg/` `/sk/` `/hr/` `/lt/` `/lv/` `/et/` `/sl/`

- Catalog only: static hubs + **12** tools (including salary-after-tax, loan, VAT, BMI).
- Titles, H1s, descriptions, FAQs are curated translations (`tests/i18n-hreflang.test.ts`, `seo:full-audit` page/tool copy coverage).
- Country-specific tax tools stay English-only.
- No `/en/` canonical tree. `/en/…` redirects.
- This pass updated **salary** locale packs so they do not brand the flat-rate tool as UK.

**LIVE VERIFIED:** `/fr/` 404. International SEO is **not deployed**.

---

## 12. Hreflang

**CODE VERIFIED**

- Catalog page: all 19 language codes + `x-default` → English unprefixed path.
- Reciprocal maps (`isHreflangReciprocal`).
- No locale pointer to a non-catalog URL.
- Correct BCP 47 codes (`uk` = Ukrainian, not United Kingdom).

**NOT LIVE** until deploy. Live English pages must not advertise `/fr/…` while those URLs 404 — current production (without `31b258c`) is consistent with that.

---

## 13. Content quality

Quality gate preserved: no mass-generated locale × catalog explosion, no new country/amount thin pages.

Remaining (not treated as deploy blockers):

- Localized tool views still mount English `ToolWorkspaceShell` insight under the translated chrome. After this fix the English insight is formula-honest. Full in-form translation of the workspace is out of scope.
- Homepage emits two `WebSite` JSON-LD blocks (same org). Not a false claim.

---

## 14. Internal linking

**CODE VERIFIED:** locale nav/footer use real `<a href>` paths; related localized tools link inside the locale.

**Changed:** `ToolCard` subtitle for salary is “Net pay from gross and a tax rate” (was UK take-home).

---

## 15. Performance / crawl efficiency

**CODE VERIFIED** from `next build`:

- 684 static pages (not thousands of locale × tool combos).
- Locale route `generateStaticParams` pre-renders home / tools / about / loan-calculator per locale; remaining catalog SSR (`dynamicParams`).
- First Load JS ~102–114 kB on public pages; salary/tool pages ~112 kB.
- Sitemap sharding unchanged (200 tools/shard).

No blind performance rewrite.

---

## 16. Production safety

Checked before recommending deploy:

| Check | Result |
|---|---|
| `.env` / secrets / credentials | **Not changed** |
| localhost or `:3000` in production URL helpers | **Not introduced** |
| nginx / SSL | **Untouched** |
| Port 3000 public | **Still not exposed** |
| Middleware HTTPS → `:3000` | **Still stripped** |
| Private robots routes | **Still disallowed** |

---

## What this pass changed

Only the demonstrated salary honesty gap (title/meta/JSON-LD/FAQ insight/locale copy/citation files). International architecture was already in `31b258c`.

### Files

- `lib/seo.ts`
- `lib/tools/data.ts`
- `lib/i18n/tool-messages.ts`
- `lib/tools/insight-registry/registry-c.ts`
- `lib/tools/priority-benchmarks.ts`
- `lib/tools/priority-tool-content.ts`
- `lib/tools/category-sources.ts`
- `components/ToolCard.tsx`
- `public/llms.txt`
- `public/llm.txt`
- `tests/salary-schema-honesty.test.ts` *(new)*
- `reports/FINAL-SEO-AI-INTERNATIONAL-AUDIT.md` *(this file)*

---

## Tests run and results

| Command | Result |
|---|---|
| `npx vitest run` `tests/salary-schema-honesty.test.ts` `tests/tool-insights-coverage.test.ts` `tests/i18n-hreflang.test.ts` `tests/seo-full-audit.test.ts` `tests/url-classification.test.ts` `tests/sitemap-integrity.test.ts` `tests/seo-site.test.ts` `tests/middleware-canonical.test.ts` | **28/28 passed** |
| `npm run seo:full-audit` | **PASS** (robots, locale sitemaps, hreflang, copy coverage, AI crawlers) |
| `npm run seo:validate-hreflang` | **PASS** |
| `npm run seo:validate-sitemaps` | **PASS** |
| `npm run seo:validate-indexability` | **PASS** |
| `npm run seo:validate-canonical` | **PASS** |
| `npm run build` | **SUCCESS** — compiled, types OK, 684 pages, standalone assets validated |
| Lint on touched TS files | **No linter errors** |
| `tests/seo-tools.test.ts` `tests/tool-serp-metadata.test.ts` `tests/seo-domination-modules.test.ts` | **Still fail** — pre-existing (e.g. title must contain exact `tool.name`; all descriptions 140–160). **Not caused by this pass; not “fixed”.** |

Build skips ESLint (`Skipping linting` in Next). Touched files were checked via IDE diagnostics.

---

## Deploy recommendation

| Item | Safe? |
|---|---|
| Commit `31b258c` (already on `main` locally) | Yes — international SEO |
| Uncommitted salary honesty files | Yes — should ship **with** that commit, not after a half-deploy that would advertise `/fr` while leaving the live UK salary title |
| Auto-deploy from this session | **No — not deployed** |
| nginx/SSL/port changes | None required |

**Safe to deploy** after the salary files are committed: one release that (1) publishes quality-gated locales + locale sitemaps, and (2) makes salary JSON-LD/title match the flat-rate calculator.

After deploy, manually confirm:

1. `https://toollabz.com/fr/` → 200, French H1, self-canonical, hreflang.
2. `https://toollabz.com/robots.txt` lists 18 `/{locale}/sitemap.xml` lines.
3. Salary title/JSON-LD no longer say UK 2026/27 take-home.
4. `/en/tools/loan-calculator` still redirects to `/tools/loan-calculator`.
5. `/login` still noindex; `/api/` still disallowed.

Then **REQUIRES GOOGLE RECRAWL** (and AI crawler recrawl). Indexing is not guaranteed.

---

## Remaining real issues

1. **International SEO and this salary fix are not on production.** Live salary page still shows the UK title; `/fr/` 404s.
2. Official crawler UAs were not replayed here.
3. Three older SEO unit files still fail unrelated assertions (do not block this deploy).
4. Localized tool workspace still shows English insight under translated chrome (honest after this fix; not a fake-translation URL).

## Further code changes

**No further code changes are recommended** for this hardening pass. Do not mass-translate, do not force-index GSC leftovers, do not add speculative AI SEO features.
