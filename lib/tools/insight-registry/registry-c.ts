import type { ToolPageInsight } from "../tool-insights-types";

export const TOOL_INSIGHTS_C: Record<string, ToolPageInsight> = {
  "mortgage-affordability-calculator": {
    quickAnswer: "Back-of-envelope max loan from income, debts, down payment, rate, and typical lender ratios.",
    explain:
      "Lenders cap housing payment (PITI) around 28–36% of gross depending on program - this mirrors that sniff test before you fall in love with a listing.",
    example:
      "$7,200/mo gross, $620 other minimums, 20% down, 6.25% on 30yr → might land near a $410k loan ballpark before taxes/HOA specifics bite.",
    insights: [
      "HOA and PMI aren’t optional extras in real affordability - bake them in.",
      "Self-employed income needs averaging; side gigs may not count full freight.",
      "Rate locks expire; re-run if quotes drift a quarter point.",
    ],
  },
  "mortgage-affordability-calculator-usa": {
    quickAnswer: "USA-flavored affordability: gross income, debts, down payment, and a conventional-style DTI picture.",
    explain:
      "Conforming loans care about front-end and back-end ratios; FHA and VA bend the rules differently. Use this to bracket shopping, not to replace a Loan Estimate.",
    example:
      "$9,400/mo household gross, $1,100 car/student mins, $95k down, 6.1% APR → rough buying power might cluster around $520k–$560k depending on taxes.",
    insights: [
      "Property tax swings Texas vs New Jersey harder than the rate itself.",
      "Gift funds need paper trails - don’t spend the gift before underwriting clears it.",
      "Second homes face higher down and reserve rules - don’t use primary math.",
    ],
  },
  "moving-cost-calculator-usa": {
    quickAnswer: "Miles × mover rate logic + boxes/truck/fees → a plausible relocation budget.",
    explain:
      "Long-haul moves price on weight or volume and season; summer is brutal. Local moves often hourly. Pad 10% for stairs, long carries, and “that didn’t fit.”",
    example:
      "1,040 miles, 2-bedroom weight band, $0.58/lb-ish ballpark + $1,400 packing → think mid four figures before first-night takeout.",
    insights: [
      "Binding vs non-binding estimates - read which one you signed.",
      "Valuation coverage isn’t homeowners insurance; know the payout caps.",
      "Sell furniture before paying to ship it - depreciation is real.",
    ],
  },
  "net-worth-calculator": {
    quickAnswer: "Assets minus liabilities - your financial snapshot on a single date.",
    explain:
      "Liquidity matters as much as the headline: $900k net worth mostly in a house and $80k cash feels different from the reverse. Update quarterly, not hourly.",
    example:
      "$42k cash, $118k 401k, $22k car equity, $410k home equity − $12k cards − $215k mortgage → ~$365k net worth.",
    insights: [
      "Use realistic private-sale values, not Zillow zeal.",
      "Student loans and tax debts count even if you’re “ignoring” them.",
      "Trend beats point-in-time - track the delta year over year.",
    ],
  },
  "overtime-pay-calculator-usa": {
    quickAnswer: "Straight time plus 1.5× overtime for hours past 40 in a workweek (FLSA baseline).",
    explain:
      "States and unions can raise the floor; some roles are exempt. This is the classic hourly + OT stack, not salary comp time unless your policy says otherwise.",
    example:
      "$26/hr, 44 hours → 40×26 + 4×39 = $1,040 + $156 = $1,196 gross that week.",
    insights: [
      "Bonuses and commissions can change regular rate for OT - look up FLSA calculations.",
      "California has daily OT rules - this tool may not capture them.",
      "Track actual clock times, not scheduled hours, if there’s a dispute.",
    ],
  },
  "password-generator": {
    quickAnswer: "Random characters (length + charset) that humans won’t guess and scripts won’t brute cheaply.",
    explain:
      "Entropy scales with length faster than swapping `!` for `i`. Pair generated passwords with a manager - typing 24 random chars is a hobby nobody needs.",
    example:
      "16 chars from upper/lower/digits/symbols might look like `K9#mQx2$vLpR4nZ!` - roughly 95^16 possibilities before discounting patterns.",
    insights: [
      "Websites that cap at 12 characters are stuck in 2009 - avoid reusing there.",
      "Passphrases beat short gibberish for memorability if you must hand-type.",
      "Rotate after breaches, not on a calendar - unless policy forces it.",
    ],
  },
  "paycheck-calculator-california": {
    quickAnswer: "California take-home after federal, CA state, SDI-ish stubs, and your pre-tax elections - approximate.",
    explain:
      "CA has progressive brackets plus wage-based SDI; VDI and local taxes may apply. Allowances and 2024+ W-4 style entries shift withholding - treat as directional.",
    example:
      "$6,800 semi-monthly gross, single, standard deduction vibe → might land ~$4.7k net after fed+state+FICA-ish (illustrative; your HR system wins).",
    insights: [
      "Bonus checks often withhold flat 22% federal - true tax may differ.",
      "RSUs vesting can spike one paycheck’s bracket hard.",
      "Under-withholding penalties are a CA sport - true up quarterly.",
    ],
  },
  "paycheck-calculator-texas": {
    quickAnswer: "No state income tax slice - mostly federal, FICA, Medicare, and your 401k/HSA choices.",
    explain:
      "Texas saves the state line item but property and sales taxes still fund the world. Federal withholding on a big OT week can still sting.",
    example:
      "$5,400 biweekly, married filing jointly-ish settings → federal + FICA might take ~$1,150–$1,300 ballpark before benefits (example only).",
    insights: [
      "Exempt status on W-4 isn’t a life hack - IRS notices arrive eventually.",
      "Two earners need coordinated W-4s or spring surprises.",
      "Per diem and stipends may be partially taxable - read the box.",
    ],
  },
  "paycheck-calculator-usa": {
    quickAnswer: "Generic USA net pay from gross, filing status, allowances, and pre-tax deductions.",
    explain:
      "Withholding tables move with IRS bulletins; medicare additional tax kicks in over thresholds. Use this to compare job offers, not to file quarterly estimates blindly.",
    example:
      "$72,500/year paid biweekly → ~$2,788 gross per check; fed+FICA might land ~$620–$720 before 401k (varies wildly by W-4).",
    insights: [
      "Pre-tax 401k lowers taxable income but not FICA for traditional.",
      "Catch-up contributions after 50 change both savings and net.",
      "Multistate workers: residency rules may override a simple calculator.",
    ],
  },
  "pdf-compress": {
    quickAnswer: "Shrink PDF file size for email or upload limits - quality trades off against bytes.",
    explain:
      "Scanned pages compress differently than born-digital text. Huge photos inside slides punish you; flattening transparency sometimes helps more than aggressive JPEG.",
    example:
      "12 MB board deck with 6 full-bleed photos → aggressive mode might land ~2.1 MB with visible banding on gradients - choose “light” if it’s client-facing.",
    insights: [
      "Password-protected PDFs may need unlocking before compression.",
      "Print shops want 300 dpi photos; 72 dpi looks fine on screen only.",
      "Keep an archival copy before lossy squashing.",
    ],
  },
  "pdf-merge": {
    quickAnswer: "Concatenate multiple PDFs in the order you pick - one outbound packet.",
    explain:
      "Great for loan packets, visa filings, or merging signed scans. Page order is the product - triple-check exhibits before you submit to a court or portal.",
    example:
      "Cover letter (3p) + W-2s (8p) + appraisal (22p) → single 33-page upload under the portal’s 35-page cap.",
    insights: [
      "Bookmarks usually flatten - rename files before merge if order is fragile.",
      "Mixed page sizes (A4 + Letter) can look odd when printed.",
      "OCR after merge if searchability matters.",
    ],
  },
  "pdf-split": {
    quickAnswer: "Pull out page ranges into separate files - useful for emailing one chapter only.",
    explain:
      "Splitting before redaction reduces leak risk: share the invoice pages, not the whole contract. Some tools split on bookmarks; this is range-based.",
    example:
      "80-page lease, pages 12–19 are the rent schedule → split saves a 8-page excerpt instead of zipping secrets.",
    insights: [
      "Metadata can survive splits - scrub author fields if sensitive.",
      "Court e-filing often wants exhibits under X MB each - split strategically.",
      "Version filenames with dates - \"final_v2_really.pdf\" is a genre.",
    ],
  },
  "pdf-to-word": {
    quickAnswer: "Convert PDF text (and layout) into an editable Word doc - accuracy varies with source.",
    explain:
      "Born-digital PDFs convert cleanly; scans need OCR first and will invent line breaks. Legal docs with columns and footnotes need human proofreading.",
    example:
      "A 6-page SaaS contract PDF → DOCX might nail headings but mangle tab stops in the pricing table - plan 20 minutes of cleanup.",
    insights: [
      "Compare hash or checksum if integrity matters - conversion changes bytes.",
      "Redlines: Word comments beat re-PDF-ing without track changes.",
      "Embedded fonts can substitute ugly replacements - check typography.",
    ],
  },
  "word-to-pdf": {
    quickAnswer: "Freeze a Word layout into a portable PDF - fonts embed (or substitute) for sharing.",
    explain:
      "Print-to-PDF vs export can differ on links and bookmarks. For resumes and RFPs, PDF stops the recruiter’s Word version from reflowing your bullets.",
    example:
      "4-page proposal with embedded charts → PDF holds line breaks; 2.3 MB vs 900 KB if you compress images first in Word.",
    insights: [
      "Accessibility: run an accessibility check before locking to PDF.",
      "Hyperlinks sometimes die - test before sending to investors.",
      "CMYK vs RGB - print shops may still ask for native files.",
    ],
  },
  "profit-margin-calculator": {
    quickAnswer: "Margin % = (price − cost) ÷ price - how much of each dollar you keep before overhead.",
    explain:
      "Don’t confuse with markup (÷ cost). Margin speaks to investors; markup speaks to buyers comparing keystone retail rules.",
    example:
      "Sell at $84, make for $51 → margin = (84−51)/84 ≈ 39.3%; markup would be 33/51 ≈ 64.7%.",
    insights: [
      "Variable vs fully-loaded cost changes the story - be consistent.",
      "Discounts erode margin nonlinearly - 10% off needs more volume math.",
      "Compare SKU-level margins; blended averages hide dogs.",
    ],
  },
  "profit-margin-calculator-business": {
    quickAnswer: "Business view: revenue minus COGS for gross margin, optionally layer operating expenses.",
    explain:
      "SaaS might show 80% gross margin but 5% net after sales and R&D - both margins answer different questions in board decks.",
    example:
      "$1.8M ARR, $320k hosting+support COGS → ~82% gross; after $1.1M opex → ~22% operating margin if no weird one-offs.",
    insights: [
      "Capitalized software amortization lags cash - watch both.",
      "One-time legal fees belong below the line or called out.",
      "Unit economics decks should cite cohort gross margin, not company blended only.",
    ],
  },
  "property-roi-calculator": {
    quickAnswer: "Blend cash flow, appreciation assumption, and equity build into a total ROI story.",
    explain:
      "Real estate ROI fights between levered IRR and lazy cap rate comparisons. Be explicit which you mean or you’ll argue past each other at brunch.",
    example:
      "$62k invested on a $410k duplex, $5,400 annual cash after reserves, 3% appreciation → multi-year ROI might print pretty vs S&P - until a roof invoice lands.",
    insights: [
      "Vacancy and capex reserves separate pros from Zillow tourists.",
      "Refi cash-out isn’t income - it resets the basis story.",
      "1031 exchanges defer but don’t erase tax planning.",
    ],
  },
  "random-name-generator": {
    quickAnswer: "Produce plausible name strings for QA data, novels, or placeholder users - no PII of real people.",
    explain:
      "Random doesn’t mean globally diverse unless the generator encodes cultures. For databases, pair with unique emails to avoid collisions in tests.",
    example:
      "Seed 8841 → might emit “Priya Kulkarni” and “Leo Martens” back-to-back - great for populating 10k staging rows.",
    insights: [
      "Some locales sort by family name - don’t assume first-name-first everywhere.",
      "Avoid real celebrity combos in public screenshots - lawyers have hobbies.",
      "Regenerate if pronunciation matters for voice UI tests.",
    ],
  },
  "refinance-calculator-mortgage": {
    quickAnswer: "Compare monthly savings vs closing costs to see months-to-breakeven on a refi.",
    explain:
      "Lower rate isn’t free - points, origination, and third-party fees delay payoff. If you might move in 24 months, a 5-year breakeven is a bad trade.",
    example:
      "Save $210/mo, $5,800 closing → breakeven ~28 months; selling at month 20 loses money on fees.",
    insights: [
      "Resetting to 30 years lowers payment but can raise total interest - model term.",
      "Cash-out refi is a loan, not income - tax treatment differs.",
      "Appraisal shortfalls kill deals - have plan B rate locks.",
    ],
  },
  "regex-tester": {
    quickAnswer: "Live-match your pattern against sample text - see captures without shipping to prod.",
    explain:
      "Dialects differ: PCRE vs JavaScript vs POSIX. This tool mirrors your stack’s flavor or you’ll debug ghosts. Greedy vs lazy quantifiers still trip seniors.",
    example:
      "Pattern `^\\d{3}-\\d{4}$` on `555-0199` → match; on `(555) 0199` → fail - reveals you need normalization before validation.",
    insights: [
      "Never regex-parse email for production - use a library and allow IDN.",
      "Catastrophic backtracking is real - test with evil strings.",
      "Multiline mode changes ^ and $ behavior - toggle intentionally.",
    ],
  },
  "rent-vs-buy-calculator": {
    quickAnswer: "Weigh rent growth, home appreciation, maintenance, and opportunity cost of the down payment.",
    explain:
      "Buying wins when you stay long enough that transaction costs amortize. Renting wins when mobility or maintenance risk is high - this quantifies the fork.",
    example:
      "$2,400 rent rising 3%/yr vs $520k buy, 20% down, 6.2% mortgage, 1.1% maintenance → break-even horizon might be ~4–6 years (illustrative).",
    insights: [
      "Opportunity cost on down payment matters if you’d index invest instead.",
      "HOA special assessments aren’t theoretical - stress-test +$8k once.",
      "Tax benefits shrank for many post-SALT caps - update assumptions.",
    ],
  },
  "rent-vs-buy-calculator-usa": {
    quickAnswer: "USA assumptions: mortgage interest deduction caps, typical closing costs, and property tax as a first-class citizen.",
    explain:
      "Salt cap and standard deduction made itemizing rarer - don’t assume Uncle Sam subsidizes your mortgage unless you actually itemize.",
    example:
      "$3,100/mo rent vs $625k purchase, 15% down, $9k taxes, 0.8% insurance → monthly cash might look similar to rent for 3 years then diverge.",
    insights: [
      "PMI until 20% equity changes early-year math - model it monthly.",
      "Relocation every 3–5 years usually favors renting after fees.",
      "Repairs are lumpy - keep a separate reserve, not a smooth average only.",
    ],
  },
  "rental-yield-calculator": {
    quickAnswer: "Gross or net yield = annual rent ÷ property price (or cost) - investor shorthand for cash-on-paper.",
    explain:
      "Gross yield ignores vacancy and repairs; net yield drags in reality. Compare yields across neighborhoods using the same definition or you’re ranking apples vs wrenches.",
    example:
      "$2,150/mo rent × 11 months (vacancy) = $23,650 on a $410k purchase → ~5.8% gross yield before HOA/taxes/insurance.",
    insights: [
      "Short-term Airbnb gross isn’t comparable to long-term leases net.",
      "Leverage amplifies yield on equity but also risk - show both.",
      "Rent control jurisdictions cap upside - underwrite politically.",
    ],
  },
  "rental-yield-calculator-uk": {
    quickAnswer: "UK-style yield from weekly/monthly rent against purchase price or total money in.",
    explain:
      "Stamp duty, solicitor fees, and furniture packs change “money in.” London yields look skinny; northern cities often print higher gross but different void risk.",
    example:
      "£1,375 pcm on a £312k buy → ~5.3% gross before letting agent fees (say 10%+VAT) and gas safety certs.",
    insights: [
      "EPC bands gate rentals soon - budget upgrades, not just yield %.",
      "Interest-only BTL mortgages shift cash flow vs repayment builds equity.",
      "Section 24 tax rules mean gross yield ≠ landlord net - use post-tax models.",
    ],
  },
  "retirement-calculator": {
    quickAnswer: "Project nest egg at retirement from contributions, return, and years - and sometimes a spend-down sketch.",
    explain:
      "Sequence-of-returns risk near retirement can swamp average returns. Inflation turns a pretty number at 65 into canned beans at 85 - index expenses, not just balances.",
    example:
      "$650/mo from 35 to 65 at ~6.5% nominal → ~$720k ballpark; 4% rule suggests ~$29k/year before tax - sanity-check against your spend.",
    insights: [
      "Healthcare before Medicare is a common stealth cost - model COBRA or ACA.",
      "Catch-up contributions at 50+ are real money, not a brochure footnote.",
      "Social Security estimates belong in the sheet - download your statement.",
    ],
  },
  "roi-calculator": {
    quickAnswer: "Return on investment = (gain − cost) ÷ cost, expressed as percent for easy comparison.",
    explain:
      "Time horizon matters: 40% ROI in 3 months beats 40% over a decade. Annualize if you’re comparing strategies with different lengths.",
    example:
      "Spend $18k on equipment, net $26.5k benefit → gain $8.5k → ROI ≈ 47.2% on that cash.",
    insights: [
      "Sunk costs aren’t in forward ROI - decide on marginal dollars.",
      "Opportunity cost of capital should be your hurdle rate, not 0%.",
      "Taxes on gains belong in the numerator if comparing after-tax life.",
    ],
  },
  "roi-calculator-marketing": {
    quickAnswer: "Marketing ROI from spend vs attributed revenue (or margin) over a defined attribution window.",
    explain:
      "Last-click lies politely; blended models lie differently. Pick a window (7d, 28d, 90d) and stick to it so week-one ROI isn’t a religion that shifts daily.",
    example:
      "$42k spend → $186k attributed sales at 38% margin → $70.7k margin − $42k ≈ $28.7k net ≈ 68% ROI on spend.",
    insights: [
      "CAC payback months matter as much as ROAS for cash-strapped teams.",
      "Brand campaigns look terrible short-window - measure lift, not only clicks.",
      "Exclude coupons and returns from “revenue” if finance says so.",
    ],
  },
  "salary-after-tax-calculator": {
    quickAnswer: "Gross salary run through federal brackets, FICA, and typical assumptions to approximate net annually or monthly.",
    explain:
      "State-agnostic versions miss huge swings (NY vs FL). Use this as a baseline, then jump to a state-specific sibling tool before signing.",
    example:
      "$112k single, standard deduction vibe → effective federal income might land mid-teens % of gross, FICA ~7.65% on base - net often mid $70s–$80sK (rough).",
    insights: [
      "401k traditional vs Roth changes today’s net, not just retirement.",
      "HSA triple tax win still has payroll quirks - confirm deductions.",
      "RSUs vesting are supplemental wages - withholding may over- or under-shoot.",
    ],
  },
  "salary-after-tax-calculator-california": {
    quickAnswer: "CA state tax stack on top of federal - high earners hit mental bracket jumps fast.",
    explain:
      "Mental health isn’t taxed separately here - your wallet might disagree. SDI, possible VDI, and phased-out deductions make “exact” a payroll department job.",
    example:
      "$165k gross, single → federal + CA + FICA might leave ~$108k–$115k net band (illustrative; exemptions and pre-tax change it).",
    insights: [
      "ISO exercises can trigger AMT - this calculator won’t capture that saga.",
      "Bonus withholding ≠ true tax - square up in April or quarterly.",
      "Domestic partner benefits may be imputed income - read the pay stub lines.",
    ],
  },
  "salary-after-tax-calculator-florida": {
    quickAnswer: "No FL income tax slice - focus on federal, FICA, and your benefit elections.",
    explain:
      "Snowbirds still fight residency audits; earners working in other states may owe there. Florida humidity is tax-free; your AC bill is not.",
    example:
      "$88k salary, single, modest 401k → federal+FICA might take ~$22–$25k all-in, net in low $60sK (example range).",
    insights: [
      "Remote work for an NY employer can create NY withholding - verify.",
      "Homestead exemption helps property tax, not income tax - different pocket.",
      "Hurricane supplies tax holidays don’t fix withholding - still plan cash.",
    ],
  },
  "salary-after-tax-calculator-new-york": {
    quickAnswer: "NY state (and NYC/Yonkers if applicable) layered on federal - city locals bite hard.",
    explain:
      "Commuters living in NJ working in NY face credit puzzles. NYC resident tax is material; don’t use plain state tables if you actually live in the five boroughs.",
    example:
      "$135k, NYC resident → combined state+city+federal effective rate can land meaningfully above a Texas peer - net might be ~$90k-ish before 401k (rough).",
    insights: [
      "Metro transport benefits are pre-tax - take them if eligible.",
      "Year-end bonus timing across Dec/Jan can shift brackets.",
      "Municipal bond interest is triple-tax-free for NYC - planning nuance.",
    ],
  },
  "salary-after-tax-calculator-texas": {
    quickAnswer: "Texas take-home is federal + payroll taxes only - no state wage income tax.",
    explain:
      "Franchise tax hits businesses, not this paycheck. Property tax funding schools means your landlord or mortgage escrow still extracts plenty.",
    example:
      "$124k gross, married filing jointly, two kids on W-4 → net might land mid $90sK with typical pre-tax (illustrative).",
    insights: [
      "Oil royalty income isn’t “salary” - different rules, different pain.",
      "Military retirement has federal-only flavor but special offsets exist.",
      "Quarterly estimates if you have big side 1099 income - don’t get surprised.",
    ],
  },
  "salary-after-tax-calculator-uk": {
    quickAnswer: "UK income tax + National Insurance bands from gross salary - PAYE flavor.",
    explain:
      "Scottish rates differ; student loan Plan 1/2/4/postgrad adds another slice. Pension salary sacrifice lowers NI too - sweet if your scheme allows it.",
    example:
      "£58,000 salary outside Scotland → after tax+NI+no pension might be ~£43k net; 5% pension sacrifice nudges NI savings too.",
    insights: [
      "Personal allowance tapers above £100k - effective 60% band exists briefly.",
      "Benefits in kind hit P11D - your headline salary understates tax.",
      "Check your tax code on HMRC - wrong codes linger for months.",
    ],
  },
  "salary-to-hourly-converter-usa": {
    quickAnswer: "Annual ÷ 2,080 (40×52) is the classic “hourly equivalent” for salaried workers.",
    explain:
      "Unpaid lunch or 37.5h weeks breaks the 2,080 myth. Use actual billable hours if you’re comparing against consulting rates, not mythology.",
    example:
      "$94,500 salary → ~$45.43/hr at 2,080; if you really work 47 avg hours, effective is ~$38.60.",
    insights: [
      "Bonuses and equity aren’t in base - normalize total comp.",
      "OT-exempt roles don’t get 1.5× for hour 41 - know your classification.",
      "PTO is compensation - divide by working weeks if pedantic.",
    ],
  },
  "savings-interest-calculator-usa": {
    quickAnswer: "Compound growth on principal + monthly deposits at APY - high-yield savings vibes.",
    explain:
      "Banks quote APY assuming monthly compounding; CDs may differ. Inflation eats “growth” that looks green in nominal dollars.",
    example:
      "$14k lump + $350/mo at 4.3% APY for 6 years → roughly mid $40sK ballpark vs ~$39.2k contributed.",
    insights: [
      "FDIC limits per bank - split chunky cash if needed.",
      "Teaser rates expire - model the revert rate too.",
      "Tax on interest is ordinary income - after-tax yield is the truth metric.",
    ],
  },
  "settlement-calculator": {
    quickAnswer: "Structured-settlement or lump-sum trade: discount rate turns future payments into present value.",
    explain:
      "Factoring companies buy your stream at a discount. This shows the math behind “cash now” offers - lawyer review still mandatory before you sign rights away.",
    example:
      "$1,800/mo for 15 years discounted at 7.5% might PV around $180k - even if nominal sum is $324k.",
    insights: [
      "Tax treatment of settlements varies by damage type - don’t DIY that.",
      "Inflation eats fixed payments - index if negotiating, when possible.",
      "Compare three buyers; shark rates hide in “admin fees.”",
    ],
  },
  "startup-name-generator": {
    quickAnswer: "Short, brandable-ish names with domain-adjacent flavor - sanity-check trademarks yourself.",
    explain:
      "Generated ≠ available .com. Use this to break creative block, then run USPTO/TM search and Google exact matches before printing hoodies.",
    example:
      "Inputs “telemetry + friendly” might yield “OrbitKind” or “SignalNest” - one’s taken in Estonia; that’s your afternoon rabbit hole.",
    insights: [
      "Avoid homophones of giants - cease-and-desist is not a growth strategy.",
      "Say it on a noisy call; if you spell it three times, it’s wrong.",
      "Check App Store collisions even if .com is free.",
    ],
  },
  "stock-profit-calculator": {
    quickAnswer: "Long or short P/L from entry, exit, shares, and fees - capital gains timing is on you.",
    explain:
      "Wash sales and lot selection (FIFO vs specific ID) change taxes. This is economic profit first; Schedule D is a sequel.",
    example:
      "Buy 120 shares at $58.20, sell at $64.85, $6.95 fee each leg → per-share gain ~$6.53 → ~$783 before tax.",
    insights: [
      "Dividends along the way aren’t in this P/L unless you add them.",
      "Short losses can be ordinary if rules mark them - ask a pro if deep.",
      "Crypto bridges use different labels - don’t mix broker CSV habits.",
    ],
  },
  "tiktok-earnings-calculator": {
    quickAnswer: "Rough creator fund or CPM-style earnings from views and RPM assumptions.",
    explain:
      "TikTok monetization swings by region, niche, and whether you’re on Creator Rewards vs brand deals. Treat as sensitivity analysis, not an invoice.",
    example:
      "2.4M qualified views/month at $0.035 RPM-like → ~$84 creator-fund-ish before platform quirks and tax.",
    insights: [
      "Brand deals dwarf CPM for many niches - model both columns.",
      "Music clearance and duet chains affect monetization flags.",
      "Quarterly estimated taxes for 1099 income - set aside 25–35% until your CPA says otherwise.",
    ],
  },
  "time-zone-converter": {
    quickAnswer: "Shift a clock time from one offset or zone context to another - DST still ruins Wednesdays.",
    explain:
      "Static offsets lie during daylight saving flips. For real deploys, use IANA zones in code; this tool is for quick human scheduling.",
    example:
      "4:00 PM in India (UTC+5:30) → 6:30 AM Eastern same calendar day in standard time - summer EDT moves it again.",
    insights: [
      "“Tomorrow” crosses the date line - confirm the calendar date on both ends.",
      "Flight itineraries use local airport time - don’t mix with UTC mentally.",
      "Send calendar invites with zone, not just “my time.”",
    ],
  },
  "unit-price-calculator": {
    quickAnswer: "Price per ounce, liter, or each item so two package sizes stop lying.",
    explain:
      "Grocery shrinkflation plays with counts. Per-unit shelf tags help, but this catches bundles and coupons your phone calculator dreads.",
    example:
      "24-pack soda at $10.99 vs 12-pack at $5.49 → both ~$0.458/can - bulk isn’t cheaper; walk away smug.",
    insights: [
      "Include tax if your jurisdiction taxes groceries - rare but real.",
      "Frozen fruit bags hide ice weight - compare drained servings jokingly seriously.",
      "Subscription autoship “savings” sometimes loses to warehouse clubs.",
    ],
  },
  "url-encoder-decoder": {
    quickAnswer: "Percent-encode reserved characters for query strings, or decode garbled URLs back to readable text.",
    explain:
      "Spaces become %20 or + depending on context - forms vs paths. Double-encoding breaks OAuth redirects in maddening ways.",
    example:
      "City `San José` → `San%20Jos%C3%A9` UTF-8 encoded - copy/paste that into a tracker URL without mangling the accents.",
    insights: [
      "Encode query values, not the whole ? and & separators.",
      "Base64 is not URL encoding - different tool, different party.",
      "JWTs use base64url - don’t swap helpers blindly.",
    ],
  },
  "username-generator": {
    quickAnswer: "Handle ideas with charset rules (alnum, length) so you pass signup validators on the first try.",
    explain:
      "Twitch vs bank vs GitHub allow different punctuation. Generate a batch, then check availability manually - no API promises here.",
    example:
      "Constraints: 8–20 chars, must start letter → `velvetQuasar82` passes; `82nope` fails the letter rule.",
    insights: [
      "Avoid current employer + birthyear - OSINT is boring easy.",
      "Unicode usernames break on old mainframes - know your audience.",
      "Reserve the same handle across platforms if brand consistency matters.",
    ],
  },
  "word-counter": {
    quickAnswer: "Count words, characters, lines - writers and SEOs sanity-check length against briefs.",
    explain:
      "Hyphenated words and em dashes split differently by tool. For essays, paste final text; for CMS, remember HTML tags aren’t words.",
    example:
      "1,480 words at 240 wpm → ~6.2 minutes read time - handy if an editor caps you at 1,500.",
    insights: [
      "SEO “thin content” is qualitative - word count alone won’t save you.",
      "Code blocks in markdown inflate counts if included - strip fences first.",
      "Academic counts often exclude abstracts - confirm the rubric.",
    ],
  },
  "youtube-earnings-calculator": {
    quickAnswer: "AdSense-ish revenue from views, RPM band, and monetized percentage assumptions.",
    explain:
      "Kids content, copyright claims, and shorts funds all distort RPM. Brand integrations aren’t here - this is the boring ads slice.",
    example:
      "380k monetized views at $6.20 RPM → ~$2,356 gross before YouTube’s 45% platform cut (policy-dependent).",
    insights: [
      "RPM spikes in finance, tanks in fluff - niche is half the story.",
      "January CPMs often crater - cashflow plan for seasonality.",
      "Off-YouTube sponsorship contracts belong in a spreadsheet, not RPM math.",
    ],
  },
  "ai-content-humanizer": {
    quickAnswer: "Rewrite stiff AI copy into 4 natural-sounding alternatives without changing the core point.",
    explain:
      "Think of this like tone correction, not fact correction. You still own truth and claims; this just removes obvious “LLM voice” patterns.",
    example:
      "Input: “Our platform optimizes workflows with unparalleled efficiency.” → output variant: “Our tool helps teams finish routine work faster with less back-and-forth.”",
    insights: [
      "Keep nouns specific; vague nouns are what make text sound synthetic.",
      "Shorter sentence rhythm usually reads more human on mobile.",
      "Run compliance checks if you’re rewriting regulated claims.",
    ],
  },
  "privacy-policy-generator": {
    quickAnswer: "Generate a sectioned privacy policy draft with placeholders you can edit before publishing.",
    explain:
      "This saves blank-page time, but legal obligations vary by country and industry. Use the draft as a framework, then align it with your actual data flow.",
    example:
      "If you collect email + analytics cookies, the draft can include collection, use, cookies, rights, and contact sections in one pass.",
    insights: [
      "Match policy language to what your app really stores in logs.",
      "Update policy date whenever your data stack changes.",
      "Link the policy in footer and sign-up flows, not only one page.",
    ],
  },
  "terms-and-conditions-generator": {
    quickAnswer: "Create a practical terms-of-use skeleton covering access, liability, and governing law.",
    explain:
      "Useful for getting structure fast, especially for SaaS landing pages. It won’t replace jurisdiction-specific legal review, but it prevents missing the basics.",
    example:
      "For a subscription app, you can draft acceptance, permitted use, account rules, limitations, and dispute sections in minutes.",
    insights: [
      "If you bill customers, add refund and cancellation clauses explicitly.",
      "Align terms links with checkout pages and onboarding emails.",
      "Version your terms so support can reference exact revisions.",
    ],
  },
  "disclaimer-generator": {
    quickAnswer: "Build a focused disclaimer block (general, affiliate, financial, or health) with clean legal wording.",
    explain:
      "Disclaimers reduce ambiguity; they don’t excuse misleading content. Pick the type that matches your actual content risk and disclosures.",
    example:
      "Affiliate blog? Generate language that states commission relationships and non-endorsement in one concise section.",
    insights: [
      "Place disclaimers near sensitive content, not only in footer.",
      "Financial/health niches should avoid vague “for info only” shortcuts.",
      "Keep contact channels visible for clarification requests.",
    ],
  },
  "freelance-rate-calculator": {
    quickAnswer: "Back into a sustainable hourly rate from income goal, taxes, costs, and billable hours.",
    explain:
      "Freelancers usually underprice by using total hours instead of billable hours. This tool forces realistic utilization math before quoting clients.",
    example:
      "$120k goal + $18k costs at 25% tax and 1,200 billable hours suggests roughly a low-$150/hour baseline.",
    insights: [
      "Discovery, admin, and revision time are real overhead.",
      "Quote projects from hourly baseline, then add risk buffer.",
      "Raise rates when utilization stays above ~75% for months.",
    ],
  },
  "adsense-revenue-calculator": {
    quickAnswer: "Estimate AdSense revenue using monthly pageviews, monetized share, and RPM assumptions.",
    explain:
      "This is RPM-first modeling, which is often more practical than raw CPC guessing. It’s still directional because seasonality and geography swing hard.",
    example:
      "500k pageviews, 62% monetized, $7.10 RPM → about $2,201 monthly projection before platform policy volatility.",
    insights: [
      "Model low/mid/high RPM scenarios, not one number.",
      "Traffic spikes without ad eligibility won’t monetize equally.",
      "Niche + country mix often matters more than total views.",
    ],
  },
  "tiktok-script-generator": {
    quickAnswer: "Generate 4 short TikTok script angles with hook, beats, and a goal-aligned CTA.",
    explain:
      "Best for breaking creative blocks quickly. Treat outputs as starter frameworks, then adapt wording to your speaking style and pacing.",
    example:
      "Topic: cold outreach, audience: founders, goal: leads → script can open with a hook, one tactical step, and a DM CTA.",
    insights: [
      "Hooks should signal payoff in under 2 seconds.",
      "One concrete action beats generic motivational lines.",
      "Caption + script alignment improves retention consistency.",
    ],
  },
  "youtube-metadata-generator": {
    quickAnswer: "Produce title/description/tag/chapter packs so you can publish faster with SEO-ready drafts.",
    explain:
      "Metadata doesn’t save weak videos, but strong packaging improves discoverability and click intent alignment when content quality is solid.",
    example:
      "Keyword: “seo audit checklist” → generate title variants, a structured description, relevant tags, and chapter timestamps.",
    insights: [
      "Front-load exact keyword naturally in title and first lines.",
      "Chapters improve watch navigation and user satisfaction.",
      "Test variants across uploads and track CTR deltas.",
    ],
  },
  "ai-prompt-optimizer": {
    quickAnswer: "Turn vague prompts into structured variants with role, task, constraints, and output format.",
    explain:
      "Prompt quality is mostly specification quality. This tool adds missing context so models stop guessing and start producing usable output.",
    example:
      "“Write onboarding email” can become “You are a lifecycle marketer… produce 3 variants under 120 words with CTA options.”",
    insights: [
      "Explicit constraints reduce rambling responses.",
      "Output format instructions improve copy-paste readiness.",
      "Prompt libraries save huge time on recurring workflows.",
    ],
  },
  "saas-valuation-calculator": {
    quickAnswer: "Get a fast valuation range from ARR and low/high multiple assumptions.",
    explain:
      "Valuation is narrative plus numbers; this handles the numbers part so you can compare conservative vs aggressive market assumptions quickly.",
    example:
      "$2.4M ARR at 4.5x to 7x implies roughly $10.8M to $16.8M range before deal-specific adjustments.",
    insights: [
      "Growth quality and retention usually justify higher multiples.",
      "Single-point valuations hide uncertainty - use ranges.",
      "Market cycle can compress multiples even with good metrics.",
    ],
  },
  "crypto-tax-calculator-basic": {
    quickAnswer: "Estimate tax due from realized gain and effective tax rate in one line.",
    explain:
      "This is intentionally basic for quick planning. It doesn’t model lot selection, fees, staking rewards, or jurisdiction-specific edge cases.",
    example:
      "$14,000 realized gain at 24% effective rate suggests around $3,360 tax reserve.",
    insights: [
      "Reserve cash early so tax season doesn’t force liquidation.",
      "Track cost basis per transaction, not per exchange only.",
      "Use full tax software for final filings, not this quick check.",
    ],
  },
  "schema-markup-generator": {
    quickAnswer: "Generate valid JSON-LD templates for WebPage, Organization, Article, or FAQPage.",
    explain:
      "Schema helps search engines interpret pages faster, but only when fields match visible on-page content and canonical URLs.",
    example:
      "Choose FAQPage, add two question-answer pairs, and copy the JSON-LD into your page head or script block.",
    insights: [
      "Don’t mark hidden or irrelevant content as FAQ schema.",
      "Keep schema URLs absolute and canonical-consistent.",
      "Validate in Rich Results Test before deployment.",
    ],
  },
  "json-to-php-array-converter": {
    quickAnswer: "Convert JSON payloads into PHP array syntax (`[]` or `array()`) for backend use.",
    explain:
      "Great for moving API examples into Laravel/PHP configs without hand-editing nested keys and quote escaping.",
    example:
      "{\"plan\":\"pro\",\"limits\":{\"users\":5}} becomes ['plan' => 'pro', 'limits' => ['users' => 5]].",
    insights: [
      "Validate JSON first to avoid silent conversion mistakes.",
      "Prefer short array syntax for modern PHP codebases.",
      "Check numeric strings if strict typing matters downstream.",
    ],
  },
  "htaccess-redirect-generator": {
    quickAnswer: "Create Apache 301/302 redirect rules from old path to new URL with optional regex mode.",
    explain:
      "Helpful during migrations when you need clean redirect snippets quickly without syntax slips in production `.htaccess` files.",
    example:
      "From `/old-guide` to `https://site.com/new-guide` with 301 outputs a permanent redirect rule ready to paste.",
    insights: [
      "Use 301 for permanent moves to preserve SEO signals.",
      "Test in staging to avoid redirect loops.",
      "Keep rule order intentional - Apache evaluates top-down.",
    ],
  },
  "core-web-vitals-suggestion-tool": {
    quickAnswer: "Classify LCP/CLS/INP and return prioritized fixes based on your measured scores.",
    explain:
      "Instead of raw metrics only, this maps each weak vitals area to concrete implementation actions so teams can ship targeted improvements.",
    example:
      "LCP 3.4s, CLS 0.05, INP 280ms → focus image/script loading first, then interaction task splitting.",
    insights: [
      "Fix worst metric first for fastest perceived gains.",
      "Field data beats lab snapshots for real prioritization.",
      "Re-test after each release to catch regressions early.",
    ],
  },
};
