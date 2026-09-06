# ToolLabz — new tool opportunity research

**Date:** 2026-09-06  
**Rule:** research only. No tools built. No code changed. No commit. No deploy.

**Catalog:** 280 tools across 13 categories.  
**GSC window:** user export 2026-09-06 (all clicks = 0). Repo `gsc-data.json` is empty.  
**Keyword volumes / KD:** **unavailable.** Ahrefs, Semrush, and Keyword Planner are not in the repo. This file does **not** invent them.

Opportunities are judged on: existing GSC rows, adjacency to URLs Google already tests, honest formulas, observable SERP incumbents, and whether a **new URL** is required versus improving a tool that already exists.

---

## Executive answer

### 1. Should ToolLabz add any new tools at all?

**Almost none, and none as P0.**

Google is testing a handful of **existing** URLs. The catalog is already large. Authority and undeployed content/intent fixes are the growth limiters (`TOOLLABZ-PRO-SEO-GROWTH-PLAN.md`). Adding URLs to raise the tool count would dilute crawl attention and repeat the programmatic-page mistake.

**One** new calculator is the only addition with a clear cluster reason this quarter: a **rental cash-flow** tool next to the UK yield page. Everything else should wait for a new GSC export after deploy, or is an **improvement** to a tool that already exists.

### 2. Which exact tools are genuinely worth building?

See **TIER A** (1) + **TIER B** (11) below — **12** candidates. That is the full “worth building” list. There are not 20 independent gaps that survive a redundancy check.

### 3. Strongest international potential (5)

Generic **math**, not invented local tax:

1. Contribution margin  
2. NPV  
3. IRR  
4. Simple interest  
5. Generic savings (user-supplied rate)

Do **not** localize a UK cash-flow tool first. Do **not** add FR/ES/PT tax or TVA/IVA engines.

### 4. Strengthen existing successful clusters (5)

1. Rental cash flow → UK yield (207 GSC impressions)  
2. Contribution margin → profit margin (22 impressions) + markup/break-even blogs  
3. Cash-on-cash / ICR → same property cluster  
4. NPV → ROI / property-ROI  
5. Reverse-VAT **mode on the existing VAT tool** (not a new slug)

### 5. Could realistically earn editorial links

- Cash flow + the existing yield-vs-cash-flow article (landlord blogs already list **separate** cash-flow tools)  
- Contribution margin + markup-vs-margin article (accounting tutors)  
- NPV/IRR pair (university/finance explainers)  
- Existing assets remain more linkable than any new thin calculator

### 6. Redundant if created

Cap rate, second profit-margin, gross-margin-only, “generic VAT” as a new slug, extra EMI/loan twins, amount pages, city yield, country salary, Section 24 tax, stamp duty (GOV.UK already calculates it), rent-increase % (percentage tool + rent blog).

### 7. Improve instead of creating

`/tools/rental-yield-calculator-uk`, `/tools/salary-after-tax-calculator`, `/tools/profit-margin-calculator`, `/tools/loan-calculator` (show a real amortisation table), `/tools/vat-calculator` (add reverse/gross→net), `/tools/property-roi-calculator` (too thin: two-field ROI), `/tools/rental-yield-calculator`, `/tools/markup-calculator`, `/tools/salary-after-tax-calculator-uk`, `/tools/mortgage-payment-calculator`.

---

## Evidence baseline

### Existing GSC (only real demand signal)

| URL / query | Impr | Pos | Implication for **new** tools |
|---|---|---|---|
| `/tools/rental-yield-calculator-uk` | 207 | 35.54 | Strongest page. Adjacent gap is **cash flow**, not another yield % |
| Query: yield calculator | 101 | 23.8 | Same URL |
| Query: buy to let yield calculator | 21 | 72.81 | Same URL |
| Query: **fair rent calculator** | 8 | 99.75 | **Different intent** (market rent / increases). Do not build a data-scraping “fair rent” tool |
| `/tools/salary-after-tax-calculator` | 121 | 30.91 | Improve honesty. Do not add more country tax clones |
| `/tools/profit-margin-calculator` | 22 | 44.86 | Adjacent: **contribution margin**, not another profit-margin slug |
| `/loan-calculator/p/250000` + `/p/500000` | 16 + 13 | ~55–58 | Do **not** add more amounts |
| AI LinkedIn / resume, JWT, SaaS valuation, `/` | 7–26 | mixed | No new AI or developer twins |

No locale impressions exist: `/fr/` is not live.

### Categories already covered

Finance 69, Calculators 56, Developer 31, Business 23, Legal 21, Generators 18, Utility 15, Marketing 14, Converters 13, Real estate **7**, Creator 7, PDF 5, Image 1.

Real estate is small **and** is the only category with a real GSC winner. That is where a missing calculator (cash flow) matters. Legal/AI/creator are already over-supplied relative to evidence.

### Topic clusters vs calculators

| Cluster | Calculators today | Real gap? |
|---|---|---|
| UK property / yield | Yield UK, generic yield, property ROI (2 fields), rent vs buy, mortgage affordability | **Yes:** monthly cash flow (rent − mortgage − costs). Blog exists; no matching tool |
| Business pricing | Profit margin (+ business twin), markup, break-even (+ twin), ROI | **Maybe:** contribution margin (blog exists; formula is distinct) |
| Take-home pay | Generic flat-rate, UK PAYE, US paycheck/states, self-employed UK | **No.** Do not invent FR/ES tax |
| Loan / EMI | Loan, EMI, mortgage payment, refinance, early payoff | **Improve** amortisation on loan — do not clone EMI |
| VAT / GST | VAT (user-typed rate, UK-labelled copy), GST Australia | **Improve** reverse VAT on the same slug |
| Developer | JWT, JSON, SQL, Base64… | JWT already page-1 crumb. No new decoder |

---

## Keyword-volume disclaimer

Reliable search-volume and keyword-difficulty data are **not available**. Competition notes below are **observable SERP occupants** from public web search on 2026-09-06, not official ranked lists and not KD scores.

---

## TIER A — build now (after deploy, not instead of it)

P0 remains: deploy existing work and recrawl UK yield / salary / margin.

### A1. Rental cash flow calculator (UK-labelled, user-supplied costs)

| Field | Detail |
|---|---|
| **Name** | Rental Cash Flow Calculator (UK) |
| **URL** | `/tools/rental-cash-flow-calculator-uk` |
| **Category** | real-estate |
| **Primary intent** | “What is left each month after rent, mortgage, and running costs?” — pounds, not a yield % |
| **Locales** | English only at first |
| **Strengthens** | `/tools/rental-yield-calculator-uk` + `/blog/rental-yield-vs-monthly-cash-flow-investment-property` |
| **GSC** | No row for “cash flow calculator”. Indirect: 207 impr on the yield URL; yield-vs-cash-flow is the site’s own pillar |
| **Competitors (observed)** | [August rental cash flow](https://www.augustapp.com/calculators/rental-cash-flow-calculator), [DealFlow BTL](https://dealflow-ai.co.uk/tools/buy-to-let-calculator), [Landlord Studio](https://www.landlordstudio.com/uk/calculator/free-rental-yield-calculator) (yield + annual cash flow), [sum.money BTL](https://sum.money/uk/buy-to-let-calculator/) |
| **Intent** | Calculator / transactional. Distinct from yield %. Matches the blog’s thesis |
| **Competition** | Crowded **specialist** BTL tools. Many also model Section 24 / SDLT. A **simple** cash-flow screen (user types mortgage + costs) can exist without claiming those tax engines |
| **Why it deserves to exist** | Only missing calculator in the one cluster Google already tests. Competitors treat cash flow as its own tool. Formula is arithmetic, not invented law |
| **Priority** | **P1** (not P0) |
| **Localized?** | English-only initially. Same math could later be a generic `/tools/rental-cash-flow-calculator` |
| **Supporting blogs** | Existing yield-vs-cash-flow + UK rent guide. Optional later: “interest-only vs repayment cash flow” — one article max |
| **Internal links** | From UK yield, generic yield, property ROI, loan, mortgage-payment, real-estate hub, both property blogs |
| **Linkability** | Medium–high for landlord education (same outreach list as the yield tool). Pitch the pair, not a homepage |
| **Risks** | Cannibalizing yield if titles say “yield”; claiming Section 24/ICR/SDLT without sourced rules; becoming a second thin yield page |

**Must-nots if built:** no Rightmove scraper, no fake tax, no city clones. Mortgage payment and annual costs are **inputs the user types**.

---

## TIER B — build after data

Build only if a later GSC export shows movement on winners **or** queries that these tools would match. All are honest formulas.

### B1. Contribution margin calculator

| Field | Detail |
|---|---|
| **Name** | Contribution Margin Calculator |
| **URL** | `/tools/contribution-margin-calculator` |
| **Category** | business |
| **Intent** | Price − variable cost; CM ratio; optional break-even from CM |
| **Locales** | en first; later fr/es/pt (universal accounting) |
| **Strengthens** | `/tools/profit-margin-calculator`, `/tools/break-even-calculator`, `/blog/beyond-break-even-contribution-margin-profit-path`, markup-vs-margin article |
| **GSC** | None on this query. 22 impr on profit margin; “margin calculators” 10 / pos 60 |
| **Competitors** | MiniWebTool, Calculations.tools, Investopedia explainer (not always a widget) |
| **Intent** | Distinct from **gross** profit margin (COGS vs all variable costs). Classroom + operator |
| **Competition** | Calculator utilities + encyclopedias. Not a government SERP |
| **Why** | Cluster hole: blog exists, tool does not. Formula is not a second profit-margin clone if copy is explicit |
| **Priority** | P2 |
| **Localized?** | After English quality; good intl candidate |
| **Blogs** | Existing contribution-margin + markup posts. Do not write a third “what is margin” |
| **Links** | Margin, markup, break-even, `/business-tools` |
| **Linkability** | Medium (tutors, SMB ops). Weaker than yield/cash-flow |
| **Risks** | Users treat it as profit margin; `profit-margin-calculator-business` already clutters the cluster |

### B2. NPV calculator

| Field | Detail |
|---|---|
| **Name** | NPV Calculator |
| **URL** | `/tools/npv-calculator` |
| **Category** | finance or business |
| **Intent** | Discounted cash flows − initial outlay |
| **Locales** | en; later fr/es/pt |
| **Strengthens** | `/tools/roi-calculator`, `/tools/property-roi-calculator`, SaaS valuation |
| **GSC** | None |
| **Competitors** | [Omni NPV](https://www.omnicalculator.com/finance/net-present-value), Investopedia explainers |
| **Intent** | Capital-budgeting; not simple ROI % |
| **Competition** | Omni / textbook brands. Hard for a 2026 domain |
| **Why** | Real math gap; ROI tool is two fields only |
| **Priority** | P2 |
| **Localized?** | Yes later (notation is universal) |
| **Blogs** | One NPV vs ROI vs IRR explainer **if** the tool ships — not before |
| **Links** | ROI, IRR, property ROI, loan |
| **Linkability** | Medium if the explainer is citable |
| **Risks** | Thin if UI only has 2–3 cash-flow slots; Omni already does this well |

### B3. IRR calculator

| Field | Detail |
|---|---|
| **Name** | IRR Calculator |
| **URL** | `/tools/irr-calculator` |
| **Category** | finance / business |
| **Intent** | Rate that sets NPV = 0 |
| **Locales** | en; later fr/es/pt |
| **Strengthens** | NPV, ROI, property ROI |
| **GSC** | None |
| **Competitors** | [Omni IRR](https://www.omnicalculator.com/finance/internal-rate-of-return) |
| **Why** | Distinct metric; pair with NPV rather than a 4th “return %” |
| **Priority** | P2 — **or merge with B2** as one “NPV & IRR” tool to avoid twins |
| **Localized?** | With NPV |
| **Risks** | Multiple-IRR edge cases; near-duplicate of ROI if copy is sloppy |

### B4. Cash-on-cash return calculator

| Field | Detail |
|---|---|
| **Name** | Cash-on-Cash Return Calculator |
| **URL** | `/tools/cash-on-cash-return-calculator` |
| **Category** | real-estate |
| **Intent** | Annual pre-tax cash flow ÷ cash invested (deposit + purchase costs) |
| **Locales** | English first |
| **Strengthens** | UK yield, cash flow (A1), property ROI |
| **GSC** | None |
| **Competitors** | Landlord Studio (shows cash-on-cash on the yield page) |
| **Why** | Levered BTL metric; property-ROI today ignores financing |
| **Priority** | P2 — **prefer folding into A1** instead of a third property URL |
| **Risks** | Three property URLs fighting “return” queries |

### B5. Simple interest calculator

| Field | Detail |
|---|---|
| **Name** | Simple Interest Calculator |
| **URL** | `/tools/simple-interest-calculator` |
| **Category** | finance |
| **Intent** | I = P × r × t (education, invoices, some loans) |
| **Locales** | Strong intl (fr/es/pt/cs…) after English |
| **Strengthens** | Loan, compound interest, invoice late fee |
| **GSC** | None |
| **Competitors** | Calculator.net / Omni-style utilities (standard classroom SERP) |
| **Why** | Compound exists; simple does not. Honest and localizable |
| **Priority** | P2 |
| **Risks** | Commodity SERP; low linkability |

### B6. Generic savings / future-value calculator

| Field | Detail |
|---|---|
| **Name** | Savings Calculator |
| **URL** | `/tools/savings-calculator` |
| **Category** | finance |
| **Intent** | Principal + contributions + rate → future value |
| **Locales** | Good intl candidate |
| **Strengthens** | Compound interest, retirement, inflation |
| **GSC** | None |
| **Existing overlap** | `savings-interest-calculator-usa`, `compound-interest-calculator`, `retirement-calculator` |
| **Why** | USA-labelled savings + compound (lump sum) leave a **contribution** savings intent |
| **Priority** | P2 — first check whether compound + retirement already answer it |
| **Risks** | Fourth compounding URL |

### B7. Payback period calculator

| Field | Detail |
|---|---|
| **Name** | Payback Period Calculator |
| **URL** | `/tools/payback-period-calculator` |
| **Category** | business |
| **Intent** | Investment ÷ annual (or monthly) cash in |
| **Locales** | en then fr/es/pt |
| **Strengthens** | ROI, NPV, break-even |
| **GSC** | None. A **broken** `related[]` once pointed at a missing `customer-payback-period-calculator` |
| **Why** | Catalog already *wanted* this adjacency |
| **Priority** | P2 |
| **Risks** | Thin if it is one division |

### B8. Interest coverage / DSCR calculator (user-typed rent and interest)

| Field | Detail |
|---|---|
| **Name** | Rental Interest Coverage (ICR / DSCR) Calculator |
| **URL** | `/tools/rental-interest-coverage-calculator` |
| **Category** | real-estate |
| **Intent** | Annual rent ÷ annual mortgage interest (or NOI ÷ debt service) |
| **Locales** | English |
| **Strengthens** | Cash flow, UK yield, loan |
| **GSC** | None |
| **Competitors** | BTL suites (DealFlow, sum.money) mention ICR ≥ 125% at a **stress rate** |
| **Why** | Lenders talk ICR; ToolLabz has no ratio tool |
| **Priority** | P2 — **prefer a field on A1**, not a standalone page |
| **Risks** | Implying a lender decision; stressing at a made-up official rate. User must type the stress rate |

### B9. Loan amortisation schedule (named tool **or** loan-page upgrade)

| Field | Detail |
|---|---|
| **Name** | Loan Amortisation Schedule |
| **URL** | `/tools/loan-amortization-schedule` **only if** the loan page cannot show a table |
| **Category** | finance |
| **Intent** | Month-by-month principal / interest |
| **Locales** | With loan-calculator (already localized) |
| **Strengthens** | `/tools/loan-calculator` (amount URLs already have GSC crumbs) |
| **GSC** | Indirect (loan amount pages) |
| **Why** | Engine today returns monthly payment + totals only — no schedule. Blog on amortisation exists |
| **Priority** | P2 as **enhancement first** |
| **Risks** | New slug that duplicates `/tools/loan-calculator` |

### B10. Margin of safety calculator

| Field | Detail |
|---|---|
| **Name** | Margin of Safety Calculator |
| **URL** | `/tools/margin-of-safety-calculator` |
| **Category** | business |
| **Intent** | (Actual − break-even sales) / actual sales |
| **Strengthens** | Break-even + contribution margin |
| **GSC** | None |
| **Priority** | P2 after B1 exists |
| **Risks** | Tiny page; fold into break-even instead |

### B11. Time-and-wages / hours pay (generic)

| Field | Detail |
|---|---|
| **Name** | Hours Pay Calculator |
| **URL** | `/tools/hours-pay-calculator` |
| **Category** | finance |
| **Intent** | Hours × rate (+ optional overtime multiplier the **user types**) |
| **Locales** | Possible intl |
| **Existing** | `hourly-to-salary-converter-usa`, `overtime-pay-calculator-usa`, `nursing-shift-pay-calculator` |
| **GSC** | None |
| **Why** | USA-labelled overtime leaves a generic hours×rate need |
| **Priority** | P2 |
| **Risks** | Must not invent US/UK overtime law |

---

## TIER C — do not build

| Idea | Why not |
|---|---|
| **Stamp duty / SDLT calculator** | Official [HMRC SDLT calculator](https://www.tax.service.gov.uk/calculate-stamp-duty-land-tax/) occupies the intent. Rates change. Invented bands violate policy |
| **Fair rent / ONS postcode rent tool** | GSC: 8 impr at pos ~100. SERP is **data products** (RentCharter, RentVerify) + [GOV.UK tribunal guidance](https://www.gov.uk/guidance/apply-for-an-open-market-rent-determination). ToolLabz has no rental dataset. Blog already covers landlord rent-setting |
| **Section 24 / BTL income-tax engine** | Real tax code. Same failure mode as the old UK-branded flat-rate salary page |
| **FR/ES/PT/DA… salary or TVA/IVA “official” tools** | No sourced engines. Locales already have honest generic salary + UK-labelled VAT |
| **French “prêt immobilier” with HCSF 35% as law** | [service-public.gouv.fr](https://www.service-public.gouv.fr/particuliers/vosdroits/R54590) + banks own this. Localized `loan-calculator` is enough |
| **Cap rate calculator** | Same math as net yield (NOI / price). Cannibalizes yield URLs |
| **Gross margin / net margin / operating margin slugs** | `profit-margin-calculator` already explains gross vs net via the cost field |
| **Second VAT slug (“generic VAT”)** | Existing VAT tool **already** takes a user rate. Add **reverse VAT** on that page |
| **More loan/salary amount pages** | Two amount URLs already underperform at pos ~55 |
| **City / postcode yield doorways** | Doorway risk; no unique math |
| **More AI generators** | Commodity SERPs; LinkedIn tool already pos ~62 |
| **Legal settlement / malpractice twins** | No GSC; unverifiable awards |
| **UUID v7, JWT verifier, etc.** | JWT decoder is the only proven crumb; verification needs keys we must not pretend to have |

---

## Full proposed-tool cards (TIER A + B only)

The tables above are the cards. Count:

| Tier | Count | Build? |
|---|---|---|
| A | 1 | Only after deploy; P1 |
| B | 11 | After new GSC data; several should be **fields on existing pages** (B4, B8, B9, B10) |
| C | Do not | — |

If B4 + B8 fold into A1, and B9 + reverse-VAT + B10 stay as **improvements**, the true **new slug** list shrinks to about **6**: cash flow, contribution margin, NPV, IRR (or one combo), simple interest, generic savings/payback/hours (pick from evidence later).

---

## International note (18 locales)

Locales: `fr, pt, es, da, sv, fi, cs, ro, hu, el, uk, bg, sk, hr, lt, lv, et, sl` (`uk` = **Ukrainian**).

There is **no GSC locale demand**. Do not add locale-only tools.

| Locale group | If any new tool is localized later | Never |
|---|---|---|
| fr, es, pt | contribution margin, NPV/IRR, simple interest, generic savings | Official tax, TVA/IVA bands as “the law”, HCSF mortgage rules |
| Nordic / CEE / Baltic / el / uk / bg | same generic math, after FR/ES/PT quality | Country clones |

Existing catalog tools already cover the international calculator intents (loan, percentage, compound, BMI, currency, margin). **Ship those**, do not invent new ones for each language.

---

## SERP characteristics (observed)

| Query family | SERP type | New-tool implication |
|---|---|---|
| Yield / BTL UK | Specialist landlord SaaS + agents + some “AI deal” tools | One honest cash-flow sibling can sit beside yield; cannot out-brand Savills by cloning yield |
| Fair rent | Data + legal/tribunal | Do not enter without ONS-grade data |
| Stamp duty | **Government calculator** | Do not compete |
| Contribution margin | Utility calculators + textbooks | Buildable later; not a government wall |
| NPV / IRR | Omni + education | Buildable later; authority-heavy |
| VAT add/remove | Omni, Calculator.net, UK VAT microsites | Improve existing VAT page |
| FR mortgage | **Service-public + banks** | Do not add a “official French mortgage” tool |

---

## Recommended supporting content (only if a tool ships)

- Cash flow: use the **existing** yield-vs-cash-flow article; do not write a duplicate  
- Contribution margin: use the **existing** beyond-break-even article  
- NPV/IRR: **one** comparison article after the tool exists  
- Never: 20 city posts, translated blog farms, or “best 50 calculators”

---

## Final ranking

| Priority | Action |
|---|---|
| **P0** | No new tools. Deploy + recrawl existing winners |
| **P1** | At most **A1** rental cash flow (or add cash-flow **outputs** to the UK yield tool if product-wise cleaner) |
| **P2** | B-list after a new GSC export; prefer enhancements over slugs |
| **Do not** | Entire TIER C |

**Default recommendation:** add **zero** tools this month. If one URL is allowed, it is `/tools/rental-cash-flow-calculator-uk` with user-typed costs and a hard ban on fake tax.

---

## Sources used

- Repo catalog (`lib/tools/data.ts` and expansion/CPC definition files), 280 slugs  
- `reports/ORGANIC-GROWTH-PRIORITY-QUEUE.md`, `TOOL-SEO-OPPORTUNITY-MATRIX.md`, `CONTENT-CLUSTER-STRATEGY.md`  
- Public competitor pages cited above (August, DealFlow, Landlord Studio, sum.money, HMRC SDLT, GOV.UK rent determination, Omni NPV/IRR, Service-Public loan simulator)  
- No keyword planner, no invented volumes
