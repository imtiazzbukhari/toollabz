# ToolLabz SEO audit — before changes

**Date:** 2026-09-05  
**Scope:** Repository inspection only (no production GSC live recrawl).  
**Domain:** https://toollabz.com  
**Stack:** Next.js 15 App Router, standalone Node behind nginx.

This report records the state of the SEO architecture **before** the international / indexing / AI-discoverability work in this change set. It does not claim live Google index counts.

---

## 1. What already exists and is working

The site already has a substantial, quality-first SEO system. The following should be **preserved**, not replaced.

### Canonical / host / SSL

- `lib/seo.ts` forces HTTPS, strips `www`, falls back to `https://toollabz.com` in production, and never emits localhost in prod metadata.
- `middleware.ts` www→apex with `url.port = ""` so Location cannot become `https://toollabz.com:3000/` (known production outage).
- HTTP→HTTPS is owned by nginx (`deploy/nginx-standalone.example.conf`), not middleware — correct.
- `next.config.ts` also has www→apex host redirect.
- Root `app/layout.tsx` does **not** set a root canonical (avoids inheriting homepage canonical on child pages).

### Robots

- `app/robots.txt/route.ts` allows `/`, does **not** block `/_next/` (correct for JS rendering).
- Disallows: `/api/`, `/embed/`, `/admin/`, `/dashboard/`, `/seo-growth-console/`, `/login`, `/signup`.
- Explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Gemini-User, and other AI crawlers.
- Lists page sitemap, sharded tool sitemaps, and blog sitemap.

### Sitemaps

- `/sitemap.xml` = hubs, legal, EEAT, categories, glossary, **high-tier programmatic only**.
- `/tools/sitemap/{id}.xml` = tool URLs (embed slugs excluded).
- `/blog/sitemap.xml` = blog posts.
- Tools/blog are omitted from the page sitemap to avoid duplicate URL listing.
- Programmatic inclusion is gated by `lib/programmatic-seo/value-tier.ts` (high → sitemap; medium → indexable via links; low → noindex + parent canonical).

### Indexation policy already in code

| Pattern | Status | Verdict |
|---|---|---|
| `/tools/{slug}` | index, self-canonical | Keep |
| High-tier `/loan-calculator/p/{n}`, `/salary-after-tax/p/{n}`, `/cm-to-feet/{n}-cm-to-feet` | index + sitemap | Keep |
| Medium-tier amount/cm pages | index, not sitemap | Keep |
| Low-tier cm values | noindex | Keep |
| `/loan-calculator/{country}` thin stubs | noindex + canonical to `/tools/loan-calculator` | Should consolidate (301) |
| `/salary-tax-calculator/{country}` thin stubs | noindex + canonical to parent tool | Should consolidate (301) |
| `/salary-after-tax-calculator/{country}/{amount}` mirrors | noindex + parent canonical | Should consolidate (301) |
| `/embed/*`, `/login`, `/signup`, `/dashboard/*`, `/seo-growth-console/*` | noindex + robots.txt | Keep private |
| `app/not-found.tsx` | noindex, follow | Keep |

### Structured data / EEAT

- WebSite + Organization on root layout.
- WebApplication, FAQPage, HowTo, BreadcrumbList, WebPage, ItemList on tools.
- Article schema helper for blog.
- Honest claims (price 0, no fake reviews/ratings).
- Trust surfaces exist: `/about`, `/methodology`, `/editorial-policy`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, `/team/*`, `/research`, `/glossary`.
- `public/llms.txt` already exists as a supplementary citation file (not a ranking substitute).

### Tests already covering SEO

- `tests/seo-site.test.ts` — robots, sitemap membership, tool metadata/canonical.
- `tests/sitemap-integrity.test.ts` — page sitemap, programmatic tiers, XML.
- `tests/middleware-canonical.test.ts` — :3000 leak regression.
- `tests/tool-serp-metadata.test.ts`, `tests/e2e/seo.spec.ts`, and others.

---

## 2. Gaps (root causes to fix)

### A. No multilingual architecture

- No locale routing, no `hreflang`, no localized sitemaps, no language switcher.
- `lib/seo.ts` explicitly avoids fake `en-GB`/`en-US`/`en-AU` hreflang on the same URL (correct).
- `<html lang="en">` is hardcoded.
- Header/Footer links are English-only.

### B. Thin country / country×amount URLs still return 200

These are the most likely contributors to GSC **soft 404**, **excluded by noindex**, and **alternative page with proper canonical**:

- `/loan-calculator/{usa,uk,canada,india,pakistan}` — a rate number + CTA, no calculator.
- `/salary-tax-calculator/{pakistan,usa,uk,uae,india}` — same pattern.
- `/salary-after-tax-calculator/{country}/{amount}` — re-hosts the parent tool (duplicate).

They are already noindex + parent-canonical. That is a valid signal, but a **301 to the real tool** is a cleaner crawl treatment for pages with no unique value.

### C. Large programmatic inventory vs unique value

- ~169 loan principal URLs (`5000…1000000`).
- ~91 salary gross URLs (`25000…250000`).
- High-tier subset is sitemap-eligible; medium stays indexable.
- This family is a primary suspect for **Crawled — currently not indexed (329)** together with near-duplicate converter/tool pages. Forcing indexation would be wrong.

### D. GSC coverage categories (investigation, not auto-delete)

Latest reported GSC buckets (URL lists were **not** in the repo; classification is by **URL family**):

| GSC status | Count | Likely families | Default action |
|---|---|---|---|
| Excluded by noindex | 10 | login, signup, 404, embed, thin country stubs | Keep noindex **or** 301 stubs |
| Page with redirect | 182 | http→https, www→apex, `/loan-calculator-{n}` → `/loan-calculator/p/{n}`, trailing slash | Intentional — do not “un-redirect” |
| Alternative page with proper canonical | 116 | country stubs, country×amount mirrors, low-tier programmatic | Keep canonical **or** 301 stubs |
| Not found (404) | 10 | retired/typo URLs | Leave 404 unless a real successor exists |
| Soft 404 | 5 | thin 200 country stubs | 301 to parent tool |
| Blocked by robots.txt | 4 | `/api/`, `/dashboard/`, `/embed/`, `/seo-growth-console/` | Intentional |
| Duplicate without user-selected canonical | 2 | likely a missing/relative canonical edge case | Add explicit self-canonical where missing |
| Crawled — currently not indexed | 329 | thin/near-duplicate tools + medium programmatic | Quality gate; do not mass-index |
| Discovered — currently not indexed | 8 | low-priority / poorly linked | Discoverability via hubs, not junk pages |

### E. Missing technical validation suite

- No `scripts/seo-full-audit.ts`.
- No dedicated hreflang / multilingual sitemap / indexability / canonical-integrity validators (beyond existing unit tests).

### F. AI / international discoverability

- robots.txt already allows legitimate AI crawlers — keep that.
- No crawlable localized HTML for FR/ES/PT/… (JS language switching would be invalid; none exists).
- English tool pages already have methodology/formula/FAQ structure suitable for citation; localized pages must meet the same bar or not be indexed.

---

## 3. Explicit non-goals (will not “fix”)

- Will not remove noindex from login, signup, embed, dashboard, SEO console, or 404.
- Will not turn www/http/legacy amount redirects into indexable 200s.
- Will not index all ~260 programmatic amount URLs.
- Will not mass-translate all ~270 tools × 19 languages.
- Will not create fake country-tax clones (e.g. “French VAT calculator” that still computes UK VAT).
- Will not invent credentials, reviews, ratings, or citations.
- Will not reintroduce `:3000` public URLs or change nginx proxy header contract.
- Will not promise GSC counts will drop to zero after deploy.

---

## 4. Inventory snapshot (from source)

- Tools: 200+ (prior audit recorded 276; embed slugs excluded from sitemaps).
- Blog posts: registry-driven; all slugs in `/blog/sitemap.xml`.
- Glossary terms: included in page sitemap.
- High-tier programmatic sitemap lists: curated cm heights + high loan principals + high salary amounts.
- First-party origin used in sitemaps: `https://toollabz.com`.

---

## 5. Implementation plan (this change set)

1. Keep English URLs stable (`/`, `/tools/loan-calculator`, …).
2. Add prefix locales: `/fr/`, `/pt/`, `/es/`, … (no `/en/` prefix; `/en/*` 301s to unprefixed).
3. Quality-gated localization catalog — only pages with real translated copy get locale URLs, hreflang, and locale sitemaps.
4. Reciprocal hreflang + `x-default` + per-locale self-canonical.
5. Locale sitemaps advertised in robots.txt.
6. 301 thin country / country×amount stubs to the real tool.
7. URL classification module + full SEO validation scripts.
8. Language switcher as crawlable `<a>` links (no IP/Accept-Language redirects).
9. Tests + `npm test` + `npm run build`.
