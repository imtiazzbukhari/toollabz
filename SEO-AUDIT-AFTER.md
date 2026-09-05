# ToolLabz SEO audit — after changes

**Date:** 2026-09-05  
**Domain:** https://toollabz.com  
**Scope:** Repository implementation + local tests/build. Live Google Search Console recrawl was **not** performed.

This report separates **IMPLEMENTED AND VERIFIED** (in code/tests) from **REQUIRES GOOGLE RECRAWL / SEARCH CONSOLE VALIDATION**.

It does **not** claim that GSC coverage counts are now zero.

---

## A. What was found

Inspected the existing SEO stack (`lib/seo.ts`, middleware, nginx example, sitemaps, robots, programmatic tiers, EEAT pages, tests). The English site already had a quality-first architecture:

- HTTPS / www→apex / no public `:3000` (nginx owns HTTP→HTTPS)
- Self-canonicals on tools; no fake `en-GB`/`en-US` hreflang on one URL
- robots.txt allows `/_next/` and legitimate AI crawlers; blocks private paths
- Programmatic value tiers (high / medium / low)
- EEAT surfaces: about, methodology, editorial, contact, legal, team, research, glossary
- `llms.txt` already existed as a supplementary citation file

Gaps:

- No multilingual routes, hreflang, or locale sitemaps
- Thin country / country×amount pages returned 200 + noindex (soft-404 / “alternative canonical” risk)
- No GSC URL classification module or full SEO validation scripts
- `<html lang="en">` was hardcoded

---

## B. What was fixed

### Technical indexing

- Thin stubs now **301** to the real calculator (`next.config.ts`):
  - `/loan-calculator/:country` → `/tools/loan-calculator`
  - `/salary-tax-calculator/:country` → `/tools/salary-after-tax-calculator`
  - `/salary-after-tax-calculator/{region}/:amount` → the matching regional tool (or the parent US tool)
- Existing hyphenated amount redirects and www→apex remain
- `/en/…` 301s to the unprefixed English URL (no duplicate English site), port stripped

### Multilingual architecture (quality-gated)

- Default English stays unprefixed: `/`, `/tools/loan-calculator`
- Other locales: `/fr/`, `/pt/`, `/es/`, `/da/`, `/sv/`, `/fi/`, `/cs/`, `/ro/`, `/hu/`, `/el/`, `/uk/`, `/bg/`, `/sk/`, `/hr/`, `/lt/`, `/lv/`, `/et/`, `/sl/`
- **No** browser/IP language redirects
- Only catalog pages exist as localized URLs (`lib/i18n/catalog.ts`): homepage, hubs, trust/legal, tools index, blog index, glossary/research hubs, and **12** curated tools
- Country-specific calculators (US paycheck, UK tax hub) stay English-only so we do not imply unsupported local tax law
- UK VAT / UK salary pages that *are* translated stay labelled as **UK rules** in every language

### Hreflang / canonical

- Each catalog page: self-canonical + reciprocal `hreflang` for every real language version + `x-default` → English
- Untranslated pages (most tools, all blog articles): `en` + `x-default` only — no broken alternates
- Translated pages are **not** canonicalized back to English

### Sitemaps / robots

- `/sitemap.xml`, tool shards, and blog sitemap unchanged in role
- New `/[locale]/sitemap.xml` per language (200, `application/xml`, xhtml hreflang)
- `robots.txt` lists every locale sitemap
- OAI-SearchBot and other listed AI crawlers remain allowed

### AI / EEAT / internal links

- Localized tool pages include what / who / how / formula / assumptions / limitations / example / FAQs
- Language switcher is crawlable `<a href>` links (not JS-only routing)
- Header/Footer internal links are locale-prefixed when a translation exists
- `llms.txt` notes the language prefixes; it does not replace sitemaps/robots/HTML

### Validation

- `scripts/seo-full-audit.ts`
- `scripts/validate-hreflang.ts`
- `scripts/validate-multilingual-sitemaps.ts`
- `scripts/validate-indexability.ts`
- `scripts/validate-canonical-integrity.ts`
- `lib/seo/url-classification.ts` + `reports/GSC-URL-CLASSIFICATION.md`

---

## C. What was intentionally NOT changed

- Login, signup, embed, dashboard, SEO console: remain noindex + robots-blocked
- High/medium programmatic amount and cm→feet pages: keep the existing value-tier policy (do not mass-index)
- All ~270 tools were **not** mass-translated
- Blog articles were **not** machine-translated
- Individual glossary terms were **not** cloned per language
- Fake country-tax clones were **not** created
- nginx proxy / SSL contract: unchanged (`X-Forwarded-Proto`, no public `:3000`)
- Pre-existing failing tests that already failed on `main` (SERP title/name mismatch, description length, domination-module trend snapshot) were not rewritten

---

## D. Multilingual architecture

| Item | Implementation |
|---|---|
| URL shape | `/` English; `/{locale}/…` otherwise |
| Rendering | Real crawlable HTML (`app/[locale]/[[...slug]]`) |
| Catalog | `lib/i18n/catalog.ts` |
| Copy | `lib/i18n/ui-messages.ts`, `page-messages.ts`, `tool-messages.ts` |
| Engine | Same calculator logic; field **names** stay English, labels translate |
| Build | Locale homes + a few hubs pre-rendered; other catalog URLs SSR on demand (`dynamicParams: true`) so VPS builds stay bounded |

---

## E. Hreflang implementation

- Built by `buildHreflangPaths()` / `hreflangLanguages()`
- Emitted on English catalog pages (home, about, blog index, methodology, editorial, hubs via `categoryLandingMetadata`, tools via `toolMetadata`) and on every localized page
- Reciprocal; `x-default` = English URL
- No hreflang for pages that do not exist

---

## F. Sitemap architecture

- `https://toollabz.com/sitemap.xml` — English hubs / EEAT / high-tier programmatic
- `https://toollabz.com/tools/sitemap/{id}.xml` — English tools
- `https://toollabz.com/blog/sitemap.xml` — English articles
- `https://toollabz.com/{locale}/sitemap.xml` — that locale’s catalog only

Sitemaps must not list redirects, 404s, noindex, or non-canonical URLs. Locale sitemaps only include catalog paths.

---

## G. Robots configuration

Unchanged protections: `/api/`, `/embed/`, `/admin/`, `/dashboard/`, `/seo-growth-console/`, `/login`, `/signup`.  
`/_next/` is not disallowed.  
AI crawlers (including **OAI-SearchBot**) explicitly `Allow: /`.  
Locale sitemaps added.

---

## H. Canonical strategy

- English page → self (`https://toollabz.com/…`)
- Translated page → self (`https://toollabz.com/fr/…`)
- Thin programmatic stubs → **redirect** to parent tool (no longer a competing 200)
- Private pages → noindex, not in sitemaps

---

## I. AI crawler accessibility

- robots.txt allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Gemini-User, and the previously listed agents
- Public HTML is not gated on JS language detection
- Private / API / console paths remain disallowed
- Middleware does not 403 legitimate crawlers; rate limits apply only to `/api/`

---

## J. GSC issue mapping

See `reports/GSC-URL-CLASSIFICATION.md`. Summary of **code** treatment (not live GSC counts):

| Bucket | Code treatment |
|---|---|
| Excluded by noindex | Keep for login/signup/embed/404 |
| Page with redirect | Keep http/www/legacy amount 301s; **added** stub 301s |
| Alternative canonical | Stubs now 301 instead of 200+canonical |
| 404 | Leave missing URLs as 404/410-equivalent; no fake 200s |
| Soft 404 | Targeted by stub 301s |
| Blocked by robots | Intentional private paths |
| Duplicate / no canonical | Tools/hubs have explicit self-canonical + hreflang |
| Crawled not indexed | Not force-indexed; quality gate + catalog translations only |
| Discovered not indexed | No junk pages added |

---

## K. Tests executed

**Passed (this change set):**

- `tests/i18n-hreflang.test.ts`
- `tests/seo-full-audit.test.ts` (includes robots, hreflang, sitemaps, indexability, canonical)
- `tests/url-classification.test.ts`
- `tests/sitemap-integrity.test.ts`
- `tests/seo-site.test.ts`
- `tests/middleware-canonical.test.ts` (`:3000` leak regression)

**Pre-existing failures on `main` (unchanged by this work):**

- `tests/tool-serp-metadata.test.ts` — some hardcoded SERP titles omit the exact `tool.name` substring; some override descriptions are &lt; 140 chars
- `tests/seo-tools.test.ts` — expects description to echo raw `tool.description` and a relative canonical
- `tests/seo-domination-modules.test.ts` — trend snapshot `revenueByCluster` empty in the fixture

`npx tsc --noEmit` passed after the i18n work.

---

## L. Build result

**IMPLEMENTED AND VERIFIED**

`npm run build` completed successfully (Next.js 15.5.14, ~111s).

- Compiled and type-checked
- Generated 684 static pages
- Locale routes present: `/[locale]/[[...slug]]` including `/fr`, `/fr/tools`, `/fr/about`, and 69 more pre-rendered locale paths
- `/[locale]/sitemap.xml` is dynamic (on-demand)
- Standalone assets copied and validated (CSS + JS chunks present)
- First Load JS for locale pages ~110 kB (same order as English tools)

Other catalog URLs (`/es/tools/bmi-calculator`, `/pt/methodology`, …) remain crawlable via on-demand SSR (`dynamicParams: true`).

### HTTP verification of the local standalone build (2026-09-05)

Started `.next/standalone/server.js` on `127.0.0.1:3999` after this build. Results are **local rendering**, not live GSC:

| Request | Result |
|---|---|
| `/fr`, `/pt/tools`, `/es/about`, `/sl/about` | 200 HTML; localized title/H1; self-canonical; `index, follow` |
| `/fr/tools/loan-calculator` | 200; French H1; self-canonical; reciprocal `hrefLang` + `x-default` → English tool |
| `/es/tools/bmi-calculator` (on-demand) | 200; Spanish H1 (`Calculadora de IMC`); self-canonical; crawlable HTML |
| `/fr/tools/paycheck-calculator-usa` | **404** (not a fake translation) |
| `/en/about` with `Host: toollabz.com` + `X-Forwarded-Proto: https` | **301** → `https://toollabz.com/about` (no `:3000`) |
| `/loan-calculator/usa` | **308** → `/tools/loan-calculator` (1 hop, then 200) |
| `/salary-tax-calculator/india` | **308** → `/tools/salary-after-tax-calculator` |
| `/salary-after-tax-calculator/uk/:amount` | **308** → `/tools/salary-after-tax-calculator-uk` |
| `/loan-calculator/p/10000` | **200** (amount pages not caught by country-stub rule) |
| `Host: toollabz.com` without forwarded proto | **200** (middleware does not invent `https://host:3000`) |
| `/robots.txt` | 200 `text/plain`; OAI-SearchBot/GPTBot allowed; private paths disallowed; 18 locale sitemaps listed |
| `/fr/sitemap.xml` | 200 XML; catalog URLs only; xhtml hreflang; no paycheck / country stubs |
| `/sitemap.xml` | English hubs only; no locale prefixes; no country stubs |

Next.js `permanent: true` config redirects emit **308** (existing Next.js behaviour). Middleware `/en/…` redirects emit **301**.

---

## M. Remaining issues

- Most tools and all blog articles remain English-only (intentional quality gate)
- Medium-tier programmatic pages can still appear as “crawled — not indexed”
- Live nginx/WAF 403s to crawlers cannot be proven from this repo alone
- Header language switcher uses `<details>` + crawlable links (fine for Google; not a dropdown of 200 hidden URLs)

---

## N. Manual actions still required in Google Search Console

**REQUIRES GOOGLE RECRAWL / SEARCH CONSOLE VALIDATION**

1. Submit `https://toollabz.com/robots.txt` and confirm the new locale sitemap lines appear
2. Submit each `https://toollabz.com/{locale}/sitemap.xml` (or wait for robots discovery)
3. Inspect a sample matrix after crawl:
   - `/`, `/tools/loan-calculator`, `/fr/`, `/fr/tools/loan-calculator`, `/es/tools/loan-calculator`
   - Confirm 200, self-canonical, reciprocal hreflang, indexable
4. Inspect a former stub (`/loan-calculator/usa`) — expect a permanent redirect (**308** from Next.js `permanent: true`, one hop) to `/tools/loan-calculator`
5. Confirm `/login`, `/dashboard`, `/seo-growth-console` stay excluded
6. Do not use URL Inspection “Request indexing” on every programmatic amount URL
7. Allow days/weeks for “Crawled — not indexed” and redirect buckets to move; **do not expect the reported counts to drop to zero on deploy day**

---

## Acceptance checklist (code)

- [x] TypeScript (`tsc --noEmit`)
- [x] SEO / i18n / sitemap / robots / canonical / hreflang tests
- [x] Important English pages remain indexable
- [x] Private pages remain protected in robots + classification
- [x] Sitemap generators exclude noindex stubs and locale junk
- [x] No `:3000` public URL helpers reintroduced
- [x] www/HTTPS contract preserved in middleware + nginx example
- [x] OAI-SearchBot not blocked
- [x] Multilingual URLs crawlable; self-canonical; reciprocal hreflang; x-default
- [x] Localized metadata / nav / internal links for catalog pages
- [x] No fake country pages; programmatic indexation strategy explicit
- [x] EEAT surfaces kept; important tools linked from localized hubs
- [x] Production `npm run build` (exit 0, standalone assets validated)
