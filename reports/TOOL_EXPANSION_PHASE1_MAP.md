# Tool expansion - Phase 1 map & SEO notes

**Ship date context:** 2026-05-15  
**Goal:** Production-quality tools using existing `ToolDefinition` + `ToolLayout` + `computeTool` + merged `phase1Profiles` + formulas in `content.ts`. No duplicate slugs; existing tools enhanced where noted.

---

## Implementation order (dependency / cluster)

1. **Core plumbing** - `expansion-phase1-tool-definitions.ts`, `expansion-phase1-compute.ts`, `engine.ts` dispatch, `data.ts` spread, `content.ts` formulas + merged SEO profiles, `tool-longtail-blocks.ts` snippet regex.
2. **Developer cluster** - JWT, UUID, SQL formatter, cron helper, Markdown→HTML, Unix timestamp (client-side).
3. **Finance / ethics-sensitive** - GST Australia, Zakat (user-supplied nisab).
4. **Business cluster** - Freelance day rate, employee loaded cost, invoice late fee.
5. **Converters** - Stone↔kg, feet+inches↔cm, acres↔hectares.
6. **Existing tool upgrades** - `json-validator` split from formatter: valid + pretty-print + clearer errors; `json-formatter` unchanged semantics for format-only.
7. **Internal content** - Blog `relatedToolSlugs` on JSON formatting article; optional future posts from blog topic map below.

---

## Created slugs (16 new)

| # | Slug | Category |
|---|------|----------|
| 1 | `jwt-decoder` | developer |
| 2 | `uuid-generator` | developer |
| 3 | `sql-formatter` | developer |
| 4 | `cron-expression-generator` | developer |
| 5 | `markdown-to-html-converter` | developer |
| 6 | `unix-timestamp-converter` | developer |
| 7 | `gst-calculator-australia` | finance |
| 8 | `zakat-calculator` | finance |
| 9 | `freelance-day-rate-calculator` | business |
| 10 | `employee-cost-calculator` | business |
| 11 | `invoice-late-fee-calculator` | business |
| 12 | `stone-to-kg-converter` | converters |
| 13 | `feet-inches-to-cm-converter` | converters |
| 14 | `acres-to-hectares-converter` | converters |

**Already in codebase (requested list - not re-added):**  
`json-validator`, `regex-tester`, `base64-encoder-decoder`, `url-encoder-decoder`, `break-even-calculator` (and `break-even-calculator-business`), `freelance-rate-calculator` (hourly/project complement to new day-rate tool).

---

## Category mapping

- **developer:** JWT, UUID, SQL formatter, cron helper, Markdown→HTML, Unix timestamp; plus existing JSON/Base64/URL/Regex tools.
- **finance:** GST Australia, Zakat; disclaimers in copy + category template FAQs.
- **business:** Freelance day rate, employee loaded cost, invoice late fee.
- **converters:** Stone↔kg, feet+inches↔cm, acres↔ha.

---

## Internal linking map (clusters)

**Developer**

- `jwt-decoder` ↔ `json-validator`, `json-formatter`, `base64-encoder-decoder`, `unix-timestamp-converter`, `regex-tester`
- `uuid-generator` ↔ `jwt-decoder`, `sql-formatter`, `cron-expression-generator`, `markdown-to-html-converter`, `json-validator`
- `sql-formatter` ↔ `json-validator`, `regex-tester`, `jwt-decoder`, `api-response-formatter`, `markdown-to-html-converter`
- `cron-expression-generator` ↔ `unix-timestamp-converter`, `uuid-generator`, `sql-formatter`, `jwt-decoder`, `json-validator`
- `markdown-to-html-converter` ↔ `json-formatter`, `html-to-json-converter`, `json-to-html-converter`, `sql-formatter`, `regex-tester`
- `unix-timestamp-converter` ↔ `jwt-decoder`, `json-validator`, `regex-tester`, `url-encoder-decoder`, `api-response-formatter`
- `json-formatter` related updated to include `jwt-decoder`, `sql-formatter`

**Finance / business**

- `gst-calculator-australia` ↔ `vat-calculator`, `invoice-late-fee-calculator`, `profit-margin-calculator-business`, `freelance-day-rate-calculator`, `break-even-calculator`
- `zakat-calculator` ↔ `gst-calculator-australia`, `net-worth-calculator`, `emergency-fund-calculator`, `invoice-late-fee-calculator`, `currency-converter`
- `freelance-day-rate-calculator` ↔ `freelance-rate-calculator`, `employee-cost-calculator`, `invoice-late-fee-calculator`, `break-even-calculator`, `profit-margin-calculator`
- `employee-cost-calculator` ↔ `freelance-day-rate-calculator`, `meeting-cost-calculator`, `break-even-calculator-business`, `profit-margin-calculator-business`, `roi-calculator`
- `invoice-late-fee-calculator` ↔ `gst-calculator-australia`, `vat-calculator`, `profit-margin-calculator-business`, `freelance-day-rate-calculator`, `discount-calculator`

**Converters**

- `stone-to-kg-converter` ↔ `kg-to-lbs`, `feet-inches-to-cm-converter`, `acres-to-hectares-converter`, `cm-to-feet`, `celsius-to-fahrenheit`
- `feet-inches-to-cm-converter` ↔ `cm-to-feet`, `stone-to-kg-converter`, `kg-to-lbs`, `acres-to-hectares-converter`, `km-to-miles`
- `acres-to-hectares-converter` ↔ `stone-to-kg-converter`, `feet-inches-to-cm-converter`, `km-to-miles`, `fuel-efficiency-calculator`, `cm-to-feet`

**Cross-link from existing hourly tool**

- `freelance-rate-calculator` `related` now includes `freelance-day-rate-calculator`.

---

## Blog topic map (3–5 ideas per new tool - publish via existing blog engine)

| Tool slug | Supporting blog angles |
|-----------|-------------------------|
| `jwt-decoder` | JWT structure for beginners; exp/nbf debugging; why decode ≠ verify; rotating keys vs long-lived tokens |
| `uuid-generator` | UUID v4 vs ULID in APIs; collision probability intuition; test data hygiene |
| `sql-formatter` | Readable SQL for code review; dialect pitfalls; when not to auto-format |
| `cron-expression-generator` | Cron vs Quartz vs K8s schedules; DST war stories; naming conventions for jobs |
| `markdown-to-html-converter` | Sanitizing user Markdown; CMS preview pipelines; subset vs CommonMark |
| `unix-timestamp-converter` | Log correlation in UTC; ms vs s bugs; ISO-8601 in APIs |
| `gst-calculator-australia` | Inclusive vs exclusive GST on invoices; rounding per line; BAS orientation (not filing advice) |
| `zakat-calculator` | Nisab concepts (non-ruling); asset classes; multi-currency zakatable wealth |
| `freelance-day-rate-calculator` | Day vs hourly quotes; bench time; annual target gross-up |
| `employee-cost-calculator` | Fully loaded cost for pricing; burden rates by country |
| `invoice-late-fee-calculator` | Contractual simple interest; usury/regulatory caps; AR aging |
| `stone-to-kg-converter` | UK stone usage; medical forms; precision vs display |
| `feet-inches-to-cm-converter` | Height on visas; normalizing 5'14" mistakes |
| `acres-to-hectares-converter` | International acre vs US survey acre; farmland listings |

**Existing blog wired:** `json-formatting-and-validation-explained-developer.tsx` now lists `jwt-decoder` and `sql-formatter` in `relatedToolSlugs`.

---

## SEO notes / warnings

1. **YMYL / legal-tax:** GST Australia, Zakat, invoice late fees include explicit “not advice / not ruling” language; keep category template FAQs (finance) merged.
2. **JWT security:** Tool copy states **no signature verification** - do not imply trust from decode output.
3. **Markdown → HTML:** Output must be **sanitized** before rendering user-supplied Markdown on a live site; Toollabz shows string output in `ResultBox`, not auto-executed HTML.
4. **Cron:** Five-field Unix assumption - document Quartz six-field / macros as out of scope.
5. **SQL formatter:** Heuristic whitespace only - not a validator or optimizer.
6. **Duplicate intent:** Day-rate tool complements existing `freelance-rate-calculator` (hourly/project); break-even remains on existing slugs.
7. **Sitemap / indexing:** New tools are in `tools` array → `generateStaticParams` + `toolMetadata` continue to apply; no `noindex` added.

---

## Remaining technical debt (future)

- Optional **ResultBox** copy/clear buttons for developer tools (pattern not yet global).
- **JSON Schema** validation mode (opt-in) for `json-validator`.
- **Cron:** Optional integration with a small tz database for “next run” preview.
- **Markdown:** Tables, GFM task lists, autolinks if demand warrants a vetted library.
- **Insights registry:** Add `ToolPageInsight` rows for new slugs if product wants richer aside cards.

---

## Recommended scaling limits

- **UUID batch:** capped at 50 per submit (client performance).
- **Markdown/SQL large pastes:** soft UX warning if > ~200KB (not implemented).
- **Static generation:** `capStaticParams` may still bound prerender count - dynamic SSR covers tail.
