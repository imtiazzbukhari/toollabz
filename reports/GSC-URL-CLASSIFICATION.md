# GSC coverage classification

Google Search Console reported coverage buckets. A status is **not automatically a bug**. This table classifies URL **families** (the live URL list was not in the repo).

Use `classifyUrl()` in `lib/seo/url-classification.ts` for a single URL.

| GSC bucket | Count | Typical URLs | Intended treatment | Action taken |
|---|---|---|---|---|
| Excluded by noindex | 10 | `/login`, `/signup`, `/embed/*`, 404 | Keep noindex | Unchanged (intentional) |
| Page with redirect | 182 | http→https, www→apex, `/loan-calculator-{n}`, trailing slash | Keep 301 | Unchanged + new 301s for thin country stubs |
| Alternative page with proper canonical | 116 | country stubs, country×amount mirrors | Consolidate | **301 to parent tool** (was 200+noindex+canonical) |
| Not found (404) | 10 | retired / typo URLs | Keep 404 unless a real successor exists | Unchanged |
| Soft 404 | 5 | thin 200 country stubs | Redirect or 404 | **301 to parent tool** |
| Blocked by robots.txt | 4 | `/api/`, `/dashboard/`, `/embed/`, `/seo-growth-console/` | Keep blocked | Unchanged |
| Duplicate without user-selected canonical | 2 | missing/relative canonical edge | Self-canonical | Tool/hub metadata already self-canonical; hreflang added where translations exist |
| Crawled — currently not indexed | 329 | near-duplicate tools + medium programmatic amounts | Do **not** mass-index | Quality gate kept; only high-tier programmatic in sitemap |
| Discovered — currently not indexed | 8 | poorly linked / low priority | Wait for crawl or add one hub link | No junk pages created |

## Programmatic indexation strategy (unchanged, documented)

- **High** unique-intent amount/cm pages: index + sitemap
- **Medium** useful unique maths: index, discover via internal links, not sitemap-priority
- **Low** stubs / mirrors: do not index; now **301** to the parent calculator

## Multilingual pages

Localized URLs are a new family. They are indexable only when they exist in the quality-gated catalog (`lib/i18n/catalog.ts`). Each has a self-canonical and reciprocal hreflang. They are **not** fake country clones.
