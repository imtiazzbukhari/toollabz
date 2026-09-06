# Indexing recovery plan

**Date:** 2026-09-06  
**Source:** `reports/GSC-URL-CLASSIFICATION.md` + `lib/seo/url-classification.ts`  
Live URL list for each GSC row was **not** in the repo. This classifies **families**.

Do **not** request indexing for everything Google crawled.

---

## Bucket classification

| GSC bucket | Count | Intentional? | Real SEO problem? | Action |
|---|---|---|---|---|
| Excluded by noindex | 10 | Yes (`/login`, `/signup`, `/embed/*`) | No | Keep |
| Page with redirect | 182 | Yes (http/www, hyphen amounts, `/en/`, country stubs) | No — consolidation | Keep 301/308 |
| Alternative page with proper canonical | 116 | Yes (country stubs / mirrors) | Was a problem; now redirect-to-parent in code | Recrawl after deploy if still listed |
| Not found (404) | 10 | Retired / typo | Only if a useful successor exists | Keep 404 unless mapped |
| Soft 404 | 5 | Thin country stubs | **Was** a problem | Code already 301s to parent tools |
| Blocked by robots | 4 | `/api/`, `/dashboard/`, `/embed/`, `/seo-growth-console/` | No | Keep blocked |
| Duplicate without user-selected canonical | 2 | Edge case | Low | Self-canonical already on tools/hubs |
| Crawled — currently not indexed | 329 | Quality/duplication | **Partial** — Google chose not to index | Improve or leave; **no mass-index** |
| Discovered — currently not indexed | 8 | Weak internal links | Low | One hub/related link if the URL is useful |

---

## What “crawled not indexed” likely is

Typical members of the 329 (inferred from route families, not a GSC CSV):

- Medium-tier programmatic amounts (indexable but not sitemap-priority)  
- Near-duplicate tools (`profit-margin-calculator-business`, adsense pair, state salary clones)  
- Thin `makeFAQs()` converters  
- Possibly some blog/tool overlap  

Google is allowed to drop these. Forcing them into the index would recreate doorway/thin signals.

**Recovery = quality or consolidation**, not GSC “Request indexing” spam.

---

## Intentional non-index

| Pattern | Mechanism |
|---|---|
| Auth / console / API / embed | robots + noindex |
| Low-tier programmatic | noindex + parent canonical |
| Country×amount mirrors | noindex + 301 |
| Non-catalog locale paths | `notFound()` |
| `not-found.tsx` | noindex |

---

## Real recovery actions

### P0 — deploy what already exists

1. Ship i18n routes so `/fr/` is 200, not 404.  
2. Add locale sitemaps to **live** robots (already in `app/robots.txt/route.ts`).  
3. Recrawl the three GSC impression tools after salary honesty + yield/margin copy is live.

Until deploy, GSC will keep seeing the old English-only site.

### P1 — do not expand index surface

- No new loan/salary amounts  
- No new country clones  
- Do not add 268 tools to locale sitemaps  

### P1 — fix discovery for useful-not-indexed pages

If a **useful** tool is in “discovered not indexed”:

- Confirm it has inbound `related[]` from a cluster peer (BMI/tip/character-counter fixed this pass)  
- Confirm it is in a hub grid (`/tools`, category, directory)  
- Wait a crawl cycle  

### P2 — consolidate true duplicates

Only after GSC winners move:

- AdSense earnings vs revenue: pick a primary in copy  
- `*-business` twins: canonical-or-related disambiguation, not a mass 301 unless data shows they never get impressions  

---

## Locale indexing (after deploy)

Each locale sitemap has **32** URLs (20 static + 12 tools). That is the **maximum** we want Google to treat as translated.

Risk: mixed-language bodies (English FAQs under `lang=cs`) can look thin. Mitigation: deepen FR/ES/PT first; do not add more locale URLs.

Hreflang is reciprocal + `x-default` → English **in code**. Production will only be correct if locale routes ship in the **same** release as English hreflang.

---

## What not to do

- Do not submit 329 URLs to the Inspection API  
- Do not noindex all programmatic amounts that already have impressions (`/p/250000`, `/p/500000`)  
- Do not index `/en/…`  
- Do not expose `:3000`  
- Do not change nginx just to “fix” GSC 308s (Next `permanent: true` is fine)
