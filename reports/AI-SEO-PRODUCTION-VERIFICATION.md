# ToolLabz production — AI search discoverability verification

**Date:** 2026-09-06  
**Target:** live `https://toollabz.com` (nginx/1.24.0 on Ubuntu, IP `69.10.53.165`)  
**Method:** live HTTP via WebFetch + Microlink (status/headers/metadata) + production `robots.txt` + repo generators.  
**Limitation:** this environment cannot open a raw TCP socket to `:443` or send a custom `User-Agent` to origin. Official `OAI-SearchBot` / `GPTBot` strings were therefore **not** replayed against nginx. Status **200** is proven for public URLs via independent fetchers; bot-specific 200 is inferred from robots + nginx (no UA filter) + no WAF challenge.

No code was changed. No new `llms.txt` or AI-SEO hacks were added.

This report does **not** claim ChatGPT/Perplexity citations, rankings, or traffic.

---

## Scorecard

| # | Check | Result |
|---|---|---|
| 1 | OAI-SearchBot HTTP 200 on homepage, tools, blog | **PASS (inferred)** — public URLs return 200; robots `Allow: /` for OAI-SearchBot; no WAF. Official UA not replayed. |
| 2 | GPTBot expected access | **PASS** — robots `User-agent: GPTBot` / `Allow: /`; same public 200s; no UA block in live nginx headers. |
| 3 | robots.txt allows those bots and protects private routes | **PASS** |
| 4 | No CDN/firewall/nginx rule blocks AI crawlers | **PASS** (no Cloudflare; nginx only; no 403/challenge on public HTML) |
| 5 | Server-rendered HTML for the main answer | **PASS** |
| 6 | JSON-LD valid and matches visible content | **PASS** on loan/VAT/blog; **PARTIAL** on salary-after-tax (title vs formula) |
| 7 | Canonical, hreflang, metadata | **PASS** for live English site; multilingual hreflang **not deployed** |
| 8 | Formulas, assumptions, methodology visible in HTML | **PASS** |
| 9 | Accidental noindex on important pages | **PASS** |
| 10 | No speculative AI SEO hacks added | **PASS** — existing `llms.txt` left as supplementary |

---

## 1. OAI-SearchBot access

**robots.txt (live, 200 `text/plain`):**

```
User-agent: OAI-SearchBot
Allow: /
```

**Public URLs returning HTTP 200** (Microlink `statusCode`, `content-type: text/html`, `server: nginx/1.24.0 (Ubuntu)`, `x-nextjs-prerender: 1`):

| URL | Status | Title / note |
|---|---|---|
| `https://toollabz.com/` | 200 | Toollabz — 280+ Free Online Tools & Calculators |
| `https://toollabz.com/tools/loan-calculator` | 200 | Loan Calculator — Monthly Payments + Full Amortisation |
| `https://toollabz.com/tools/vat-calculator` | 200 (WebFetch body) | VAT Calculator UK 2026 |
| `https://toollabz.com/tools/salary-after-tax-calculator` | 200 | Salary After Tax Calculator 2026/27 — UK Take-Home Pay |
| `https://toollabz.com/blog` | 200 | Blog \| Toollabz |
| `https://toollabz.com/blog/vat-calculator-guide-small-businesses` | 200 | VAT guide (2026) |
| `https://toollabz.com/blog/how-to-calculate-emi-formula-examples-free-calculator` | 200 | EMI formula article |
| `https://toollabz.com/about` | 200 | About Toollabz |
| `https://toollabz.com/methodology` | 200 | Toollabz methodology |

Google already indexes the loan calculator and EMI guide (`site:toollabz.com`), which is additional evidence the pages are crawlable HTML.

**Not proven:** HTTP 200 when the request `User-Agent` is exactly OpenAI’s OAI-SearchBot string. Nothing in live headers suggests a bot ACL.

---

## 2. GPTBot expected access

Expected policy (and live robots): **allow public content**.

Live `robots.txt` also contains:

```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /
```

Private paths remain disallowed under `User-agent: *` (GPTBot inherits those Disallows in common crawler behaviour unless a later group overrides them — here the GPTBot group only sets `Allow: /` and does **not** undo `/api/`, `/dashboard/`, etc. Conservative GPTBot implementations still honour the `*` group for Disallow. Either reading is acceptable: public HTML is allowed; consoles are not advertised).

No `403`, JS challenge, or `cf-mitigated` header was observed on public pages.

---

## 3. robots.txt

Live body (fetched 2026-09-06):

- `User-agent: *` → `Allow: /`
- **Disallow:** `/api/`, `/embed/`, `/admin/`, `/dashboard/`, `/seo-growth-console/`, `/login`, `/signup`
- **Allow:** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Gemini-User, and the other listed agents
- **Sitemaps:** `/sitemap.xml`, `/tools/sitemap/0.xml`, `/tools/sitemap/1.xml`, `/blog/sitemap.xml`
- **Not listed on production:** `/{locale}/sitemap.xml` (i18n commit is not live)

Microlink: `https://toollabz.com/robots.txt` → **200**, `content-type: text/plain; charset=utf-8`.

`https://toollabz.com/sitemap.xml` → **200**, `application/xml; charset=utf-8` (an earlier XML-to-markdown fetch reported 500; that was the converter, not origin).

---

## 4. CDN / firewall / nginx

| Evidence | Finding |
|---|---|
| `server` header | `nginx/1.24.0 (Ubuntu)` |
| Cloudflare | No `cf-ray`, `cf-cache-status`, or challenge HTML |
| Public HTML | 200, not 403/429/503 |
| Example nginx (`deploy/nginx-standalone.example.conf`) | Proxies all paths to Node; **no** `if ($http_user_agent)` deny |
| `/fr` | **404** (route missing), not a bot block |

**PASS:** no evidence of an AI-crawler firewall. A live WAF rule that keys only on OpenAI’s UA still cannot be disproven without sending that UA.

---

## 5. Server-rendered main answer (no JS required)

Headers include `x-nextjs-prerender: 1`. Fetched HTML (converted to text) already contains the answer, not a spinner:

**Loan calculator** — visible without calculating:

- Quick answer: `Monthly payment = P x [r(1+r)^n] / [(1+r)^n - 1]`
- Worked example: GBP 10,000 / 6% / 3 years ≈ GBP 304
- Formula block, assumptions, limitations, FAQs

**VAT calculator:**

- Add 20% VAT: multiply by 1.20; remove: divide by 1.20
- `VAT = Net × (Rate/100); Gross = Net + VAT`
- Worked example: GBP 480 net → GBP 576 gross

**EMI blog:**

- Full formula, `$18,000` worked example, FAQ answers in the HTML

The **interactive result** still needs the form (JS). That is expected. The citeable answer is in the HTML.

---

## 6. JSON-LD

Live HTML `<script type="application/ld+json">` tags are not visible in markdown conversion. Generators on the deployed pattern (`app/tools/[slug]/page.tsx` + layout + root layout) emit:

| Type | Source | Production-origin check (`NODE_ENV=production`) |
|---|---|---|
| WebSite + Organization | `app/layout.tsx` | Valid JSON; URLs `https://toollabz.com` |
| WebApplication | `toolSchema()` | Valid; `name`/`url` match the tool; `offers.price: "0"` |
| FAQPage | `generateFAQSchema()` | Valid; questions match on-page FAQ headings |
| HowTo | `howToSchema()` | Steps from visible how-to list |
| BreadcrumbList / WebPage | tool page + layout | Present |
| Article | `app/blog/[slug]/page.tsx` | Present on guides |

**Match vs visible content**

- Loan: schema name “Loan Calculator”; description “Estimate EMI using principal, interest, and tenure.” — matches the on-page “What this calculator does” line. **PASS**
- VAT: formula and UK 20% examples match the page. **PASS**
- Blog EMI/VAT: article body is the same facts as the title. **PASS**
- Salary after tax: **PARTIAL** — SERP title/meta say “UK Take-Home Pay 2026/27” (bands, NI, student loan) but the visible formula and WebApplication description are the generic `Net Salary = Gross Salary × (1 - Tax Rate)`. FAQs also mix US (401k/FICA) language. Schema is valid JSON; it does **not** invent reviews. It does not fully match the UK-specific title.

`browserRequirements: "Requires JavaScript"` is honest for the form; it does not hide the HTML answer.

---

## 7. Canonical, hreflang, metadata

| Page | Live title | Canonical / URL (Microlink) | Notes |
|---|---|---|---|
| `/` | Toollabz — 280+ Free Online Tools & Calculators | `https://toollabz.com/` | `lang=en` |
| `/tools/loan-calculator` | Loan Calculator — Monthly Payments + Full Amortisation \| Toollabz | `https://toollabz.com/tools/loan-calculator` | Self URL, no `:3000` |
| `/tools/salary-after-tax-calculator` | Salary After Tax Calculator 2026/27 — UK Take-Home Pay \| Toollabz | self | See §6 |
| `/blog` | Blog \| Toollabz - Free Online Tools | `https://toollabz.com/blog` | |
| `/about` | About Toollabz | `https://toollabz.com/about` | |
| `/methodology` | Toollabz methodology | `https://toollabz.com/methodology` | |
| `/fr` | — | **404** | Locale routes are **not** on production |

No `x-robots-tag` on public HTML. No public `:3000` in titles or URLs.

**Hreflang:** production robots do not list locale sitemaps and `/fr` 404s. Live English pages must not point hreflang at missing `/fr/…` URLs. That is correct for the **currently deployed** site. Reciprocal multilingual hreflang exists only in the local unpushed commit (`31b258c`), not on origin.

---

## 8. Formulas, assumptions, methodology in HTML

Present on sampled production pages:

- Quick-answer box + formula + worked example + “planning estimate” disclaimer
- Assumptions / common mistakes
- Sources (HMRC, CFPB, GOV.UK VAT/NI where relevant)
- `/methodology` explains verification, sources policy, update cadence
- `/about` names the founder/editor workflow and `hello@toollabz.com`

---

## 9. Accidental noindex

| Surface | Evidence | Verdict |
|---|---|---|
| Homepage, tools, blog, about, methodology | 200 HTML; no `x-robots-tag`; indexed in Google for loan/EMI | Not noindex |
| `/login`, `/signup` | `robots: { index: false }` in page metadata; robots.txt Disallow | Intentional |
| `/dashboard`, `/seo-growth-console` | layout `noindex`; robots Disallow; dashboard **307** then login HTML | Intentional |
| `/embed/*` | noindex + Disallow | Intentional |
| 404 (`/fr`) | `not-found` is `noindex, follow` | Correct |
| Country stubs | code `noindex` (and local commit 301s them; **not live**) | Not an important index target |

**PASS:** no accidental noindex on the important public URLs sampled.

---

## 10. llms.txt / speculative hacks

`https://toollabz.com/llms.txt` is already live (200). It is a short citation map of tools, formulas, and blog links. It does **not** replace robots, sitemaps, or HTML.

No new machine-only files, hidden prompt blocks, or fake review schema were added.

---

## Intentional non-issues

- Interactive EMI/VAT **results** need the form. The explanation is in HTML.
- `/dashboard` returning HTML after 307 is an auth wall, not a public landing page.
- Production is **behind** local `main` (`31b258c`): no `/fr`, no locale sitemaps. That is a deploy gap, not a live crawler block.

---

## Residual / follow-up (no code change in this pass)

1. Replay `curl -A '… OAI-SearchBot …'` and `GPTBot` from the VPS or a network that can reach `69.10.53.165:443` to close the UA gap.
2. Deploy the already-committed i18n work if locale URLs should exist; do not advertise `/fr` hreflang until then.
3. Optional content fix (separate task): align salary-after-tax title/schema with the actual flat-rate engine, or point UK-band claims at `/tools/salary-after-tax-calculator-uk`.

---

## Bottom line

Production English ToolLabz is **technically open** to OAI-SearchBot and GPTBot: robots allow them, nginx does not challenge them, public homepage/tool/blog URLs return **200** prerendered HTML with visible formulas, and important pages are not noindex. JSON-LD generators are valid and generally match the page, with one salary-tool honesty gap. Existing `llms.txt` is enough; nothing speculative was added.
