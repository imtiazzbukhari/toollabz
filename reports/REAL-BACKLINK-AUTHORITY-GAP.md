# ToolLabz — real authority and backlink gap

**Date:** 2026-09-06  
**Scope:** priority URLs only  
- `/tools/rental-yield-calculator-uk`  
- `/tools/salary-after-tax-calculator`  
- `/tools/profit-margin-calculator`  

**Method:** repository files + public web research. No Ahrefs, Semrush, Moz, Majestic, or GSC Links export was available.

**This file does not invent referring-domain counts, Domain Rating, Domain Authority, spam scores, or “ToolLabz has N backlinks.”**

---

## 0. Data availability (read this first)

| Source | Status |
|---|---|
| Ahrefs / Semrush / Moz / Majestic | **Unavailable** |
| GSC “Links” / top linking sites | **Not in the repo** |
| `lib/content-engine/backlinks.json` | Empty `{ "rows": [] }` |
| `reports/gsc-db-opportunities.md` | Postgres unset |
| Public web search for `"toollabz.com"` excluding the site itself | **No third-party editorial, news, university, or government citations found** |
| Competitor brand / age / own calculators | **Publicly observable** |
| ToolLabz domain age | **Self-published:** founded April 2026 (`/about`) |

Empty backlink JSON is **not** proof of zero links. It is proof the gap is **unmeasured**.

What *is* measured:

- GSC (user export): these URLs get impressions at average positions ~18–36, **0 clicks**.
- Public SERP-like results for the target queries are dominated by **aged specialist or brand sites**, not ToolLabz.
- A published “7 essential UK yield tools” roundup ([Neon Properties London](https://www.neonpropertieslondon.co.uk/rental-yield-calculator-uk/)) lists RentalYieldCalculator.co.uk, John Charcol, PropertyData, Zoopla, Lendlord — **not ToolLabz**.

---

## 1. Realistic competitors by query

These are **publicly visible competitors** for the stated queries (web search, 2026-09-06). This is **not** a claimed official Google top-10 for a specific location or personalised SERP.

### yield calculator / rental yield calculator / rental yield calculator uk

| Competitor | Example URL | Why they win attention | Brand / age evidence | ToolLabz comparison |
|---|---|---|---|---|
| Savills | [savills.co.uk rental yield calculator](https://www.savills.co.uk/resources-and-tools/rental-yield-calculator.aspx) | Estate-agency brand; gross + net; pairs with stamp duty / LBTT tools | National UK agency; research + tools hub | ToolLabz is unknown vs Savills brand |
| Landlord Studio | [landlordstudio.com free rental yield calculator](https://www.landlordstudio.com/calculators/free-rental-yield-calculator) | SaaS lead-magnet; cashflow + vacancy | Product used by landlords; calculator is marketing | Same math class; they have a product brand |
| Landlord Vision | [landlordvision.co.uk rental-yield-calculator](https://www.landlordvision.co.uk/rental-yield-calculator.html) | UK lettings-accounting software | Established landlord software | Same |
| RealYield | [realyield.co.uk](https://www.realyield.co.uk/) | Net yield + cashflow + 316-LA yield table citing official averages | Dedicated BTL brand | Deeper UK data product |
| LetCompliance | [letcompliance.com tools/rental-yield-calculator](https://letcompliance.com/tools/rental-yield-calculator) | Section 24 + cash-on-cash | Compliance / landlord ops | ToolLabz **does not** model Section 24 (honest limitation) |
| Cost-Saver | [cost-saver.co.uk landlord yield](https://www.cost-saver.co.uk/toolbox/landlord-rental-yield-calculator) | Postcode + ONS/Land Registry + Section 24 | Claims official datasets | Data moat ToolLabz does not have |
| CalcHub | [calchub.uk/calculators/rental-yield](https://calchub.uk/calculators/rental-yield/) | UK BTL calculator cluster | Specialist UK calc site | Similar thin-calc class, more UK tax adjacency |
| Omni Calculator | [omnicalculator.com/finance/rental-property](https://www.omnicalculator.com/finance/rental-property) | Global calc encyclopedia; cap rate / cash-on-cash | Large cited calculator publisher | Authority + topical graph |
| PropertyData | (listed in Neon roundup) | Paid comps / yield finder | Investor analytics brand | Different product; still occupies “yield” demand |
| Zoopla | Market yield **benchmarks** (not a listing calculator) | Portal dataset + press | Household UK brand | Brand gravity on “yield” even without a clone tool |

**Search-intent note:** “yield calculator” is ambiguous (property vs dividend vs bond). ToolLabz’s GSC URL is the **UK rental** tool. Savills / Landlord Studio / RealYield match that intent more tightly than a generic toolbox homepage.

### salary after tax calculator

| Competitor | Example URL | Why they win | Age / citation evidence | ToolLabz comparison |
|---|---|---|---|---|
| Listen To Taxman | [listentotaxman.com](https://listentotaxman.com/index.php) | Full UK PAYE bands, NI, student loan, historic years | WHOIS **created 8 April 2004** (public whois dump) | ~22 years vs ToolLabz **April 2026** |
| The Salary Calculator | [thesalarycalculator.co.uk/salary.php](https://www.thesalarycalculator.co.uk/salary.php) | Tax code, pension types, multi-year | About page copyright **2006–26**; has a “Link to The Salary Calculator” page | Forum-cited (e.g. Singletrack World thread quotes both LTTM and TSC) |
| GOV.UK / HMRC | [gov.uk/check-income-tax-current-year](https://www.gov.uk/check-income-tax-current-year), [gov.uk/income-tax-rates](https://www.gov.uk/income-tax-rates) | Official rates and personal tax account | Government | ToolLabz must **cite**, not compete as official |
| Newer UK PAYE clones | uksalarytakehome.co.uk, freetaxcalc.co.uk, mytakehome.co.uk, salarytax.uk | 2026/27 band tables, Scotland, student loan | Same intent as LTTM; still UK-engine pages | **ToolLabz generic page is flat-rate**, not PAYE. UK engine is a **different URL** (`/tools/salary-after-tax-calculator-uk`) |

**Critical:** pitching `/tools/salary-after-tax-calculator` as a UK take-home tool is false. Competitors above implement bands. ToolLabz’s GSC impressions on this URL are for a **weaker, generic** intent.

### profit margin calculator

| Competitor | Example URL | Why they win | Public evidence | ToolLabz comparison |
|---|---|---|---|---|
| Omni Calculator | [omnicalculator.com/finance/margin](https://www.omnicalculator.com/finance/margin) | Solves any two of cost/price/margin; long explainer | Large calculator network, widely cited | Formula parity; they have domain + topical cluster |
| Calculator.net | [calculator.net/margin-calculator.html](https://www.calculator.net/margin-calculator.html) | Cost/revenue/margin/markup in one widget | Long-running general calculator domain | Same |
| Corporate Finance Institute | [CFI profit margin](https://corporatefinanceinstitute.com/resources/accounting/profit-margin/), [markup calculator](https://corporatefinanceinstitute.com/resources/financial-modeling/markup-calculator-formula/) | Education + Excel | Training brand | More “course” than tool; still ranks for definitions |
| Investopedia | [margin vs markup](https://www.investopedia.com/ask/answers/102714/whats-difference-between-profit-margin-and-markup.asp) | Definitional SERP | Major finance publisher | Steals informational clicks |
| Sage Advice | [sage.com/en-gb/blog/margin-calculator](https://www.sage.com/en-gb/blog/margin-calculator/) | Accounting-software brand explainer | Sage | Unlikely to link out to a rival calc |

---

## 2. Authority evidence (what can be said without fabricating metrics)

### ToolLabz

| Signal | Evidence | Strength |
|---|---|---|
| Domain / brand age | About page: founded **April 2026** | Weak |
| Third-party mentions | Web search for `toollabz.com` returned **own pages** and **name-collisions** (toollab.cc, freetoolabz.com, tooltoollab.com, piclabz.com/toollabz). No news, .gov, .ac.uk, or independent blog citation found | Weak |
| Roundup inclusion | Neon “7 essential tools” does **not** include ToolLabz | Weak |
| GSC | Impressions, mid-SERP positions, 0 clicks | Eligible, not preferred |
| On-site trust | Methodology, editorial policy, team, sources on tools | Present, first-party only |
| Referring domains / URL-level backlinks | **Unknown** | — |

### Competitors (qualitative only)

| Signal | Evidence |
|---|---|
| Age | Listen To Taxman domain **2004**; The Salary Calculator public copyright from **2006**; Savills / Sage / Investopedia / Omni are multi-year brands |
| Editorial mentions | Salary calculators are **named in forums** as the default check. Yield tools are **named in agent/investor roundups**. ToolLabz is not |
| Government / university | GOV.UK is the citation target for tax. Oxford jobs “useful links” point at HMRC/DWP, not independent calcs. Warwick student funding links **Money Saving Expert** and SFE — not ToolLabz |
| Data citations | Cost-Saver / RealYield claim Land Registry, ONS, HMRC. ToolLabz documents a **formula**, not a dataset |
| Own-tool gravity | Almost every strong competitor **hosts the calculator they want to rank** |

**Link gap (realistic, non-numeric):**  
ToolLabz is a **2026 unknown toolbox**. Competitors are either **15–20 year calculator brands**, **national agencies**, **landlord SaaS**, or **encyclopedia calc networks**. Even if ToolLabz content is now honest and formula-first, those domains can outrank a new site at positions 1–15 without ToolLabz being “wrong.”

That is an **inferred** authority disadvantage. It is **not** a measured “they have 2,400 RDs and we have 12.”

---

## 3. Side-by-side (priority pages)

| Dimension | ToolLabz | Typical competitor | Who is ahead |
|---|---|---|---|
| Domain age / brand | ~5 months (founded Apr 2026) | Years to decades | Competitor |
| Referring domains | Unmeasured; no public citations found | Unmeasured; public *mentions* exist | Competitor (inferred) |
| Links to exact URL | Unmeasured | Unmeasured | Unknown |
| Links to domain | Unmeasured | Unmeasured | Unknown |
| Topical relevance | Yield UK page is on-intent; generic salary is **off** UK PAYE intent | Competitors match query engine | Yield: even. Salary generic: behind |
| Content depth | Formula + example + limitations (after recent edits, not all live) | Often Section 24, tax codes, datasets, or markup solvers | Competitor on UK yield/tax depth |
| Internal linking | Hubs + popular row + a few blogs (code, pending deploy) | Whole-site topical graphs | Competitor, until deploy + more cluster links |
| Brand trust | Methodology/editorial exist; no press | Household or niche-household names | Competitor |
| Citations / sources | GOV.UK renting, methodology | HMRC bands, ONS, Land Registry, NYU Stern (Omni net margin) | Competitor on data |
| Intent match | Yield: good. Salary generic: must stay flat-rate. Margin: formula match | Strong | Yield/margin close; salary generic weaker than PAYE SERP |

---

## 4. Does ToolLabz need A, B, or both?

**C. Both — but not equally.**

| Need | Why |
|---|---|
| **B. Links to specific tool pages** | Google is already showing `/tools/rental-yield-calculator-uk` and `/tools/salary-after-tax-calculator`. Those URLs need **relevant** citations (landlord education → yield tool; pricing education → margin tool). Homepage PageRank alone rarely moves a deep tool from pos 35 to pos 8. |
| **A. Homepage / domain links** | Brand is 2026 and unnamed in the open web. A few contextual homepage or hub links (About, `/uk-finance-tax`, `/real-estate-tools`) help the domain look like an entity, not a doorway. |

Do **not** buy homepage PBN blasts. Prefer **one relevant paragraph + one tool URL**.

---

## 5. Linkable assets (existing)

Most linkable **today** (already on the site):

1. **`/blog/rental-yield-vs-monthly-cash-flow-investment-property` + `/tools/rental-yield-calculator-uk`**  
   Citeable distinction: yield % ≠ monthly cash. Roundups and landlord blogs already write this; ToolLabz can be the free checker they point at.

2. **`/blog/markup-vs-margin-formulas-pricing-mistakes` + `/tools/profit-margin-calculator`**  
   Same $40→$100 / 60% vs 150% story every Sage/CFI/Investopedia article uses. Pitch as a **no-signup** widget, not as a better encyclopedia.

3. **`/blog/how-much-can-i-rent-my-house-for-uk` + UK yield tool**  
   Rent-setting + yield screening. Matches “fair rent” adjacent GSC query **without** retargeting the yield URL.

Honorable: `/blog/how-to-estimate-take-home-pay-from-gross-salary` (flat-rate honesty) and `/uk-finance-tax` (hub). Do **not** lead with the generic salary tool as “UK PAYE.”

### Are new linkable assets needed?

**Not first.** Existing articles are unused as outreach bait (no public citations found).

**Later, if outreach stalls**, one **unique** asset beats another calculator clone:

- A **sourced** UK gross-yield-by-region table (ONS / Land Registry / named portal, dated, methodology). RealYield already does a version of this — only worth it if ToolLabz adds a clearer, citable method.
- A **one-page “gross vs net vs cash-on-cash vs Section 24”** explainer that **links out** to HMRC and then to the simple ToolLabz screener (honest: we do not compute Section 24).

Do not manufacture 50 “best calculator” posts.

---

## 6. Outreach rules

- No paid links, PBNs, or private blog networks.  
- No mass directory submission (v7, allfree, “top 500 tools”).  
- No automated blast.  
- One personalised note: quote **their** paragraph, offer **one** complementary URL.  
- Cap: a few domains per week.  
- Skip anyone who already sells the same calculator as their product (Savills, Landlord Studio) unless they run a **third-party tools** list.

---

## 7. Ten strongest angles

1. **Yield ≠ cash flow** — “Your article already says high yield can still be cash-negative; this free UK page shows gross and net from monthly rent.”  
2. **Gross vs net definition** — “You explain the two formulas; readers still mix weekly and monthly rent — the UK tool labels monthly GBP.”  
3. **Roundup gap** — Neon-style lists omit a no-login gross/net screener; ask for a factual addition, not a #1 rank.  
4. **NRLA / bookkeeping** — Spreadsheet records costs; ToolLabz is the 30-second screen *before* the spreadsheet.  
5. **Markup vs margin Slack mistake** — Sage/CFI story + live widget, no email wall.  
6. **University offer math** — Careers pages that only link MSE/HMRC: add a **planning** flat-rate tool *and* say it is not PAYE.  
7. **Student / first job** — “Gross vs take-home” guide, not a tax-code engine.  
8. **Landlord newsletter** — One worked £1,450 / £320k example they can reuse with attribution.  
9. **Accounting tutor / AAT-adjacent blogs** — Homework-friendly margin/markup pair.  
10. **Developer/finance newsletter** — Only if they already list Omni/Calculator.net; ToolLabz as a lighter alternative with visible assumptions.

---

## 8. Outreach prospects

Likelihood is **editorial fit**, not a predicted reply rate.  
**Verified** = URL fetched or clearly listed in search results this session.  
**Inferred** = well-known resource site in the niche; confirm a live “resources / useful links / tools” URL before emailing.

### Yield / landlord / property (pitch `/tools/rental-yield-calculator-uk` + yield-vs-cash-flow or UK rent guide)

| # | Domain | Page / type | Why relevant | Pitch URL | Angle | Likelihood |
|---|---|---|---|---|---|---|
| 1 | neonpropertieslondon.co.uk | [7 tools roundup](https://www.neonpropertieslondon.co.uk/rental-yield-calculator-uk/) | Already lists calculators | UK yield tool | Ask to add a no-login gross/net option | **High** |
| 2 | nrla.org.uk | [Investors hub](https://www.nrla.org.uk/investors-hub) | Official landlord org; lists partner calcs | UK yield + yield-vs-cash blog | Complementary free screen, not a SaaS rival | Medium |
| 3 | nrla.org.uk | [Property accounts spreadsheet](https://www.nrla.org.uk/resources/tax/property-accounts-spreadsheet) | ROI / records education | UK yield tool | “Screen then record” | Medium |
| 4 | landlordzone.co.uk | News / advice | Independent landlord publisher | UK yield | Definition + worked example | Medium |
| 5 | property118.com | Landlord forum / articles | High landlord traffic | Yield-vs-cash blog | Discussion cite, not spam | Medium |
| 6 | thisismoney.co.uk | Property explainers | Consumer finance | UK rent guide | Rare; only if they lack a simple widget | Low |
| 7 | ftadviser.com | Adviser news | Professional | Yield-vs-cash | Data/definition cite | Low |
| 8 | moneyweek.com | Personal finance | Consumer | UK rent / yield | Same | Low |
| 9 | home.co.uk | Rent / yield stats | Market data | UK yield | “Try the ratio on a listing” | Low |
| 10 | openrent.co.uk | Landlord guides | Letting marketplace | UK yield | Pre-list yield check | Medium |
| 11 | spareroom.co.uk | Landlord advice | Rooms / HMO adjacent | UK yield | Only if they have a tools page | Low |
| 12 | unihomes.co.uk | Student landlords | Yield on student stock | UK yield + rent guide | Regional example | Medium |
| 13 | propertyinvestmentproject.co.uk | BTL education | Deal analysis content | Yield-vs-cash | Complementary calculator | Medium |
| 14 | buyassociation.co.uk | Investor media | Deal/yield stories | UK yield | Journalist source | Medium |
| 15 | simplelandlordinsurance.com | Insurer blog | Cost lines in net yield | UK yield | “Put insurance in annual costs” | Medium |
| 16 | justlandlords.co.uk | Insurer / advice | Same | UK yield | Same | Medium |
| 17 | goodlord.co | Tenant referencing / landlord content | Ops blogs | UK yield | Low conflict | Medium |
| 18 | howsy.com | Landlord product blog | Education | UK yield | Medium |
| 19 | thelandlordnews.co.uk | Trade news | News + resources | UK yield | Medium |
| 20 | hamptons.co.uk | Research | They may have own tools | Yield-vs-cash | Research citation only | Low |
| 21 | knightfrank.com | Research | Same | Yield-vs-cash | Low |
| 22 | savills.co.uk | [Own calculator](https://www.savills.co.uk/resources-and-tools/rental-yield-calculator.aspx) | Competitor tool | — | **Skip outbound ask** | Low |
| 23 | landlordstudio.com | [Own calculator](https://www.landlordstudio.com/calculators/free-rental-yield-calculator) | Competitor | — | Skip unless they list “other free tools” | Low |
| 24 | landlordvision.co.uk | Own calculator | Competitor | — | Skip | Low |
| 25 | propertydata.co.uk | Paid analytics | Competitor-ish | — | Skip sales; maybe blog cite | Low |
| 26 | calchub.uk | Own UK calcs | Peer | Yield-vs-cash | Reciprocal education, not link scheme | Low |
| 27 | realyield.co.uk | Own suite | Peer | — | Skip | Low |
| 28 | letcompliance.com | Own calc | Peer | — | Skip | Low |
| 29 | rentalyieldcalculator.co.uk | Listed in Neon | Direct competitor | — | Skip | Low |
| 30 | shelter.org.uk | Housing advice | Public-interest | UK rent guide | Unlikely; only if educational | Low |

### Salary / careers (pitch **guides** first; generic tool only as flat-rate)

| # | Domain | Page / type | Why relevant | Pitch URL | Angle | Likelihood |
|---|---|---|---|---|---|---|
| 31 | prospects.ac.uk | Careers / pay | Students compare offers | Take-home **guide** + generic tool (labelled flat-rate) | Not a PAYE replacement | Medium |
| 32 | targetjobs.co.uk | Graduate pay | Same | Same | Medium |
| 33 | savethestudent.org | Student money | Warwick already cites them | Take-home guide | They have their own tools — low | Low |
| 34 | jobs.ox.ac.uk | [Tax and NI](https://www.jobs.ox.ac.uk/tax-and-national-insurance) | Useful-links pattern | GOV.UK first; ToolLabz only as planning | Low |
| 35 | reed.co.uk | Career advice | Offer negotiation | Take-home guide | Medium |
| 36 | totaljobs.com | Career advice | Same | Take-home guide | Medium |
| 37 | cipd.co.uk | HR knowledge | Reward / pay | Take-home guide | Low |
| 38 | listentotaxman.com | Incumbent | Competitor | — | Skip | Low |
| 39 | thesalarycalculator.co.uk | Incumbent; they ask *others* to link **in** | Competitor | — | Skip | Low |
| 40 | moneysavingexpert.com | Incumbent + brand | Competitor | — | Skip | Low |

### Margin / small business (pitch `/tools/profit-margin-calculator` + markup article)

| # | Domain | Page / type | Why relevant | Pitch URL | Angle | Likelihood |
|---|---|---|---|---|---|---|
| 41 | smallbusiness.co.uk | SME explainers | Markup vs margin is evergreen | Margin tool + markup blog | Medium |
| 42 | startup.co.uk | Founder education | Same | Same | Medium |
| 43 | aat.org.uk | Bookkeeping students | Homework calculators | Margin tool | Medium |
| 44 | sage.com | [Own margin article](https://www.sage.com/en-gb/blog/margin-calculator/) | They already teach the formula | — | Skip unless “further reading” | Low |
| 45 | freshbooks.com | SMB blog | Pricing posts | Markup blog | Medium |
| 46 | shopify.com | Commerce blog | Product margin | Margin tool | Low |
| 47 | icaew.com | Profession | Unlikely outbound | Markup blog | Low |
| 48 | calculator.net | Own widget | Competitor | — | Skip | Low |
| 49 | omnicalculator.com | Own widget | Competitor | — | Skip | Low |
| 50 | corporatefinanceinstitute.com | Education | Own Excel | — | Skip | Low |
| 51 | investopedia.com | Encyclopedia | Rarely adds indie tools | — | Skip | Low |
| 52 | xero.com | Advice | Own ecosystem | Markup blog | Low |
| 53 | quickbooks.intuit.com | Advice | Same | Markup blog | Low |
| 54 | fsbrands / local chambers | Resource lists | Inferred; verify each | Margin tool | Medium |
| 55 | indie accounting tutors / Substack finance | Newsletters | High if they already link Omni | Margin + markup | **High** |

Rows 1–55 are a **working list of ~40 contactable + ~15 skip/competitor**. Evidence does **not** support 50 *high-probability* independent resource pages. Padding to 50 with random directories would violate the quality rule.

**First 10 to actually email (if a human reads their latest article first):**  
Neon Properties roundup; one landlord news site (Landlord News / Property118 editor); OpenRent or UniHomes education editor; BuyAssociation journalist; NRLA *only* via a member/resource suggestion, not cold spam; Prospects or TargetJobs careers editor; Reed/Totaljobs advice author; Smallbusiness.co.uk; an AAT/tutor blog; one independent finance newsletter that already lists Omni.

---

## 9. What not to do

- Do not submit ToolLabz to low-quality “free online tools” directories.  
- Do not buy homepage links.  
- Do not ask Savills, Omni, LTTM, or Sage to replace their calculator.  
- Do not pitch the generic salary URL as a UK 2026/27 PAYE engine.

---

## 10. Final verdict

**Authority is not numerically proven. It is the #1 remaining limiter for page-one rankings on these queries, and #2 overall after content/intent.**

| Rank | Blocker | Proof level |
|---|---|---|
| 1 (page-one) | **Authority / brand / citations** | **Inferred:** 2026 domain, no public third-party mentions, incumbents from 2004–2006 and national brands, ToolLabz absent from a live yield-tools roundup, GSC stuck ~pos 20–36 |
| 2 (overall, still real) | **Content / intent** | **Direct:** generic salary is not PAYE; UK yield competitors model Section 24 / official data; some live copy still lagged until deploy |
| 3 | Programmatic / dilution | Separate; not the reason Savills beats ToolLabz on “rental yield calculator uk” |
| — | Technical SEO | Not the limiter |

**Ahrefs-style “we are 1,800 referring domains behind Omni” cannot be stated.** Import a GSC Links export or one paid crawl before treating authority as a scored KPI.

Until then: earn **a handful of relevant, human citations** to the three tool URLs (and the two existing blogs), not a directory campaign.
