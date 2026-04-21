import type { ToolPageInsight } from "../tool-insights-types";

export const TOOL_INSIGHTS_A: Record<string, ToolPageInsight> = {
  "accident-compensation-calculator": {
    quickAnswer:
      "Ballpark what a bodily-injury claim might settle for from medical bills, lost wages, and a pain multiplier - never a guarantee.",
    explain:
      "Insurers start with hard costs (ER, PT, missed shifts) then nudge up or down for severity and fault. This is a sanity check before you talk to a lawyer, not a verdict.",
    example:
      "$18,400 in bills + $6,200 lost pay × a 2.1 pain factor → roughly $51,660 on paper; real offers often land lower until negotiation.",
    insights: [
      "Document every visit and prescription - gaps in care get weaponized.",
      "If you were partly at fault, expect the number to shrink proportionally.",
      "A written demand with a spreadsheet beats a vague “I want six figures.”",
    ],
  },
  "adsense-earnings-calculator": {
    quickAnswer: "Turn pageviews, CTR, and CPC into expected daily or monthly AdSense cash.",
    explain:
      "Multiply impressions that actually see an ad by click rate, then by what each click pays on average. Seasonality and niche swing this hard; treat output as a band, not a paycheck.",
    example:
      "42,000 views/day, 1.8% CTR, $0.41 CPC → about 756 clicks × $0.41 ≈ $310/day before Google’s cut.",
    insights: [
      "RPM matters more than raw views if your audience is wealthy or commercial.",
      "Mobile often pays less per click but can win on volume.",
      "Policy strikes can zero revenue overnight - diversify traffic sources.",
    ],
  },
  "affiliate-earnings-calculator": {
    quickAnswer: "Estimate commissions from traffic, conversion rate, average order, and your cut.",
    explain:
      "Affiliate math is funnel math: only a slice of visitors click, fewer buy, and you keep a percent of that sale. Small tweaks to conversion beat chasing vanity traffic.",
    example:
      "11k monthly visitors → 3.2% to merchant, 6% purchase, $84 AOV, 5% commission → ~$14.8k sales × 5% ≈ $739/month.",
    insights: [
      "Cookie windows decide whether Tuesday’s click pays for Friday’s cart.",
      "Returns claw back commissions - model net, not gross.",
      "Stacking two programs on the same page can violate terms; read the fine print.",
    ],
  },
  "age-calculator": {
    quickAnswer: "Exact years, months, and days between a birth date and any “as of” date you pick.",
    explain:
      "Handy for eligibility cutoffs, school enrollment, or visa rules where “18 on arrival” isn’t fuzzy. Leap years and month lengths are handled for you - no mental calendar gymnastics.",
    example:
      "Born 2007-11-03, as of 2026-04-09 → 18 years, 5 months, 6 days - useful for driver’s-license or voting timelines.",
    insights: [
      "Some countries count lunar birthdays differently - always confirm local law.",
      "Insurance often uses nearest birthday; HR might use calendar age only.",
      "Save the “as of” date when you screenshot results for records.",
    ],
  },
  "ai-cold-email-generator": {
    quickAnswer: "Draft a short outbound email from your inputs - edit before you hit send.",
    explain:
      "The model stitches value prop, proof, and a single ask. It’s a first pass; deliverability and tone still need your judgment and compliance checks (CAN-SPAM, GDPR).",
    example:
      "Input: “SaaS for dental inventory, 14-day pilot, Dr. Patel referral” → output might open with inventory shrink stats and end with one 15-minute slot.",
    insights: [
      "Personalize the first line manually - spam filters love generic intros.",
      "One CTA beats three; confused readers bounce.",
      "A/B subject lines on 200 sends beats guessing on 20,000.",
    ],
  },
  "ai-email-subject-line-generator": {
    quickAnswer: "Spin several subject-line angles from a topic so you can pick what fits the inbox.",
    explain:
      "Good subjects trade curiosity for clarity depending on audience. Use these as seeds, then trim characters so mobile previews don’t clip your hook.",
    example:
      "Product: reusable water bottles → might suggest “Your bottle pays for itself in 11 refills” vs “Stop buying plastic this week” - same product, different vibe.",
    insights: [
      "Front-load the benefit; iOS shows ~35 characters cold.",
      "Avoid ALL CAPS and triple !!! - filters and humans agree they’re tired.",
      "Send-time matters as much as wording; Tuesday 10am isn’t universal.",
    ],
  },
  "ai-linkedin-post-generator": {
    quickAnswer: "Shape a LinkedIn post from bullets: hook, story, takeaway, optional CTA.",
    explain:
      "LinkedIn rewards specificity and line breaks, not essay walls. Treat generated text as scaffolding - swap in real metrics and names so it doesn’t read like a bot manifesto.",
    example:
      "Input: promoted PM, shipped billing revamp, -22% churn → draft might lead with the churn stat before the promotion humble-brag.",
    insights: [
      "First two lines are the preview - make them standalone.",
      "Tagging five people rarely helps; tagging one real collaborator does.",
      "Comments in the first hour beat lazy “great post” spam later.",
    ],
  },
  "ai-product-description-generator": {
    quickAnswer: "Turn specs and audience into storefront copy you can paste and tweak.",
    explain:
      "E-commerce copy has to answer “who’s it for?” fast. Generated blurbs are a starting point - swap in warranty, shipping, and compliance language your legal team actually allows.",
    example:
      "Noise-canceling earbuds, gym-goers, IPX4 → might emphasize sweat resistance and wing tips before battery hours.",
    insights: [
      "Lead with the outcome (“fewer dropped reps”) not the chipset model.",
      "Bullets scan; paragraphs sell the vibe - use both.",
      "Refresh copy when returns spike; words and reality drift apart.",
    ],
  },
  "ai-resume-summary-generator": {
    quickAnswer: "Condense role, wins, and skills into a tight professional summary block.",
    explain:
      "Recruiters skim summaries for scale and impact. Feed measurable wins - the tool can’t verify them, so keep everything truthful and ready to defend in an interview.",
    example:
      "Senior data engineer, 40% pipeline speedup, $6M cost avoided → summary might open with the dollar impact, not “hardworking team player.”",
    insights: [
      "Mirror keywords from the job description sparingly - stuffing reads fake.",
      "Quantify with ranges if exacts are NDA’d (“high single-digit millions”).",
      "Update quarterly; stale summaries undersell new work.",
    ],
  },
  "api-response-formatter": {
    quickAnswer: "Pretty-print JSON so nested errors and fields are readable in seconds.",
    explain:
      "Logs and curl dumps arrive minified. Formatting reveals structure - handy before you diff two payloads or paste into a ticket without blinding your teammates.",
    example:
      "A 1-line error becomes indented: `error.code`, `error.details[0].field` - you spot the bad phone format without squinting.",
    insights: [
      "Large payloads can freeze the browser - trim or paginate at the source.",
      "Validate after formatting; pretty text can still be invalid JSON.",
      "Redact tokens before sharing screenshots.",
    ],
  },
  "base64-encoder-decoder": {
    quickAnswer: "Convert text or small binary snippets to Base64 and back for debugging.",
    explain:
      "Base64 isn’t encryption - it’s transport-friendly encoding. Great for embedding tiny assets or inspecting what an API actually returned under the hood.",
    example:
      "Encoding `Hello!` → `SGVsbG8h` - useful when an auth header expects `Basic <base64(user:pass)>`.",
    insights: [
      "Size grows ~33%; don’t Base64 huge files in the browser.",
      "URL-safe variants swap `+/` for `-_` - mismatch breaks decoding.",
      "Never paste live production secrets into random web tools.",
    ],
  },
  "brand-name-generator-ai": {
    quickAnswer: "Brainstorm pronounceable, on-brief name ideas from a vibe and industry.",
    explain:
      "Names are availability problems, not creativity problems. Use output as sparks, then run trademark and domain searches before you print packaging.",
    example:
      "Prompt: sustainable pet food, playful, two syllables → might suggest “Pawloft”, “Kibble & Kin” - then you check .com and USPTO.",
    insights: [
      "Say each name aloud on a phone call - if you spell it twice, it’s weak.",
      "Avoid geography you might leave (Paris Bagel in Denver feels off).",
      "Social handles matter as much as domains now.",
    ],
  },
  "break-even-calculator": {
    quickAnswer: "Find how many units you must sell to cover fixed costs at a given margin per unit.",
    explain:
      "Break-even ignores timing of cash - rent is due monthly even if units sell unevenly. Still, it’s the fastest “is this priced sanely?” gut check for a new SKU.",
    example:
      "$9,600/month fixed costs, $38 contribution margin per mug → 9,600 ÷ 38 ≈ 253 mugs/month to stop losing money on operations.",
    insights: [
      "Variable costs often creep - re-run when suppliers raise prices.",
      "Discounts shrink margin and push break-even volume up fast.",
      "Pair with cash runway; breaking even on paper can still miss payroll.",
    ],
  },
  "break-even-calculator-business": {
    quickAnswer: "Same break-even math, framed for broader operating expenses and blended margins.",
    explain:
      "When you bundle SaaS seats, services, and hardware, use a weighted average margin. This version helps ops leaders argue whether a new hire or office pays for itself.",
    example:
      "Blended 42% margin on $220k/month fixed stack → break-even revenue ≈ 220k ÷ 0.42 ≈ $523.8k monthly top line.",
    insights: [
      "Separate one-off launches from recurring; mixing them blurs the target.",
      "If churn rises, effective fixed cost per retained customer jumps.",
      "Document assumptions - finance will ask which margin you used.",
    ],
  },
  "budget-planner-monthly-usa": {
    quickAnswer: "Split take-home pay into buckets: needs, wants, savings, debt - American-style defaults.",
    explain:
      "Percent rules (50/30/20 and cousins) are training wheels. Adjust for high rent cities, student loans, or dual-income households where “needs” swallow more than half.",
    example:
      "$5,200 take-home → 50% needs $2,600, 30% wants $1,560, 20% save/pay debt $1,040 - tweak if rent alone is $2,400.",
    insights: [
      "Track actuals for 90 days before you shame yourself on paper.",
      "Irregular income? Use a rolling 3-month average as the base.",
      "Emergency fund first, then avalanche high-APR cards.",
    ],
  },
  "business-name-generator": {
    quickAnswer: "Produce a batch of brandable names from keywords - still need legal clearance.",
    explain:
      "Generators explore morphemes and suffixes you wouldn’t type manually. Shortlist three, then verify secretary-of-state filings and domains before you fall in love.",
    example:
      "Keywords: craft, lighting, studio → “Lumen Foundry”, “Filament & Co.” - then check trademark class 11 for conflicts.",
    insights: [
      "Alliteration helps recall but can feel gimmicky in finance or law.",
      "Test Google results: unique spelling beats drowning in homonyms.",
      "Buy the typo domains if the brand is consumer-facing.",
    ],
  },
  "cac-calculator": {
    quickAnswer: "Divide acquisition spend by new customers to see what each customer cost to land.",
    explain:
      "CAC is blunt: it hides quality of customers and payback period. Pair it with margin or LTV so you don’t celebrate cheap leads that never monetize.",
    example:
      "$48,000 marketing + $12,000 sales tools in a month, 540 new paying users → CAC ≈ $111 per customer.",
    insights: [
      "Include fully loaded salaries if sales is human-heavy.",
      "Separate organic from paid; blended CAC lies politely.",
      "Cohort CAC by channel beats one giant monthly average.",
    ],
  },
  "cac-calculator-saas": {
    quickAnswer: "SaaS-flavored CAC: blends trial-to-paid ratios and recurring revenue context.",
    explain:
      "In SaaS, “customer” should mean paying logos, not every signup. Factor in sales cycles longer than a month by annualizing spend or aligning windows.",
    example:
      "$210k quarterly S&M spend ÷ 175 new ARR customers → ~$1,200 CAC - compare to ARPU × gross margin for payback sanity.",
    insights: [
      "Free tiers inflate signups; don’t divide spend by them.",
      "Watch CAC payback vs. churn - 12-month payback on 8-month retention hurts.",
      "Partner commissions belong in CAC, not COGS.",
    ],
  },
  "car-loan-affordability-calculator": {
    quickAnswer: "Back into a max car price from monthly budget, rate, and term - includes rough taxes/fees toggle if present.",
    explain:
      "Dealers talk payment; you should talk total cost. This flips the script so you know the ceiling before test drives turn emotional.",
    example:
      "$425/mo budget, 6.9% APR, 60 months → principal ≈ $21.8k - below that payment fits; above it, you’re stretching.",
    insights: [
      "Gap insurance and warranties aren’t in the note - budget separately.",
      "Shorter terms save interest even if payment stings.",
      "Used cars near 100k miles have surprise maintenance - pad cash.",
    ],
  },
  "case-converter": {
    quickAnswer: "Flip text between sentence, title, upper, lower, camel, snake, and friends in one shot.",
    explain:
      "Handy when APIs expect snake_case but your designer pasted Title Case. Batch transforms beat regex roulette when you’re cleaning CSV exports too.",
    example:
      "`userProfileImage` → `user_profile_image` for a Postgres column without hand-typing underscores.",
    insights: [
      "Acronyms like “API” get mangled in title case - spot-check output.",
      "Locale matters for Turkish I - test if you localize.",
      "Huge blobs can lag; chunk very large files.",
    ],
  },
  "celsius-to-fahrenheit": {
    quickAnswer: "Convert °C to °F for weather, ovens, or lab notes without mental 9/5 gymnastics.",
    explain:
      "Linear conversion with a +32 offset. Handy when a European recipe meets an American oven dial, or when news reports heat waves in unfamiliar units.",
    example:
      "38°C summer day → 100.4°F - crossing the triple-digit psychological barrier for many US readers.",
    insights: [
      "Oven temps: small rounding errors won’t ruin a cake - ingredient ratios matter more.",
      "Negative temps: -10°C is 14°F, not “twice as cold” as -5°C.",
      "Body temp 37°C = 98.6°F - useful for travel first-aid kits.",
    ],
  },
  "cm-to-feet": {
    quickAnswer: "Turn centimeters into feet and inches for human heights and rough imperial estimates.",
    explain:
      "Medical charts often use cm; door frames and basketball stats use feet. This avoids rounding 178 cm to “5’10” by guesswork.",
    example:
      "182 cm → about 5 feet 11.7 inches - why someone says “almost six foot” without lying.",
    insights: [
      "Construction still uses feet; body metrics often use cm - know your audience.",
      "Round to nearest half-inch for clothing size charts.",
      "Two measurements beat one for kids tracking growth spurts.",
    ],
  },
  "color-palette-generator": {
    quickAnswer: "Build harmonious palettes from a base hex - complementary, triadic, analogous vibes.",
    explain:
      "Color theory shortcuts save time before you drop hex codes into Tailwind or Figma. Accessibility checks still need contrast tools - pretty ≠ readable.",
    example:
      "Base #2563EB (blue) → triadic might add amber and rose accents for dashboard widgets without clashing.",
    insights: [
      "WCAG AA needs 4.5:1 for body text - test, don’t assume.",
      "Print shifts hues; preview on coated vs uncoated if packaging matters.",
      "Dark mode isn’t invert - re-tune saturation, not just luminance.",
    ],
  },
  "compound-interest-calculator": {
    quickAnswer: "Project balance over time with contributions, rate, and compounding frequency.",
    explain:
      "Compounding is just interest earning interest. Monthly contributions plus monthly compounding accelerates the curve - small rate changes matter decades out.",
    example:
      "$250/mo for 25 years at 7% annual compounded monthly → roughly $190k contributed becomes ~$202k growth - time did most of the work.",
    insights: [
      "Fees act like negative interest - 1% drag is brutal over 30 years.",
      "Tax-deferred vs taxable changes spendable returns, not the math here.",
      "Inflation eats purchasing power; compare real returns when planning.",
    ],
  },
  "conversion-rate-calculator": {
    quickAnswer: "Conversions ÷ sessions (or visitors) × 100 - classic funnel KPI.",
    explain:
      "Define “conversion” tightly: purchase, signup, lead form? Mixing definitions across teams makes dashboards agree while the business drifts.",
    example:
      "3,400 sessions, 142 purchases → 4.18% conversion - if mobile is 2.1% and desktop 6.8%, average hides the fix.",
    insights: [
      "Segment by traffic source; branded search converts hotter than cold display.",
      "Micro-conversions (add-to-cart) predict macro ones - watch both.",
      "Sample size: 40 conversions on 900 visits is noisy; use confidence intervals.",
    ],
  },
  "cpc-calculator": {
    quickAnswer: "Cost per click = ad spend ÷ clicks - simple, ruthless efficiency metric.",
    explain:
      "CPC alone doesn’t prove ROI; pair with conversion rate and order value. Still, rising CPC often signals auction heat or creative fatigue.",
    example:
      "$2,850 spend, 4,200 clicks → ~$0.68 CPC - if each click converts at 3.5% and AOV is $42, you can sanity-check margin.",
    insights: [
      "Brand campaigns should CPC lower than prospecting - split reports.",
      "Dayparting can halve CPC with the same creative.",
      "Quality score / relevance metrics indirectly tax bad landing pages.",
    ],
  },
  "credit-card-interest-calculator": {
    quickAnswer: "See how much interest accrues if you pay less than the full statement balance.",
    explain:
      "Cards usually average daily balance and compound daily. Paying minimums stretches principal for years - this shows the true sticker shock of “just this month.”",
    example:
      "$4,200 balance, 22.99% APR, $85 minimum → you might pay north of $8k total over ~9 years if you never increase payment.",
    insights: [
      "Grace periods vanish when you revolve even once - read the statement footnotes.",
      "Balance transfers save only if you kill the debt before promo ends.",
      "Paying twice monthly cuts average daily balance slightly.",
    ],
  },
  "credit-utilization-calculator": {
    quickAnswer: "Utilization = balance ÷ credit limit - big FICO lever month to month.",
    explain:
      "Scoring models care about statement balances even if you pay in full - timing payments before the statement closes can help without spending less.",
    example:
      "$1,100 balance on $6,000 limit → 18.3% utilization - under the common 30% rule-of-thumb, but per-card and aggregate both matter.",
    insights: [
      "CLI requests can help if spending is structural, not impulsive.",
      "Closed cards lower available credit and can spike utilization overnight.",
      "Business cards may not report utilization - don’t assume they help personal score.",
    ],
  },
  "crypto-tax-calculator": {
    quickAnswer: "Rough gain/loss from buy vs sell (or fiat proceeds) for back-of-napkin tax planning.",
    explain:
      "Real crypto taxes need lots, fees, staking, airdrops, and jurisdiction rules. Use this to flag magnitude before your accountant imports the CSV chaos.",
    example:
      "Bought 0.4 BTC at $41k, sold at $58.5k → ~$7k gain before fees - short- vs long-term rates depend on holding period.",
    insights: [
      "Wash-sale rules for stocks don’t universally apply to crypto in all countries - verify locally.",
      "Stablecoin swaps can still be taxable events.",
      "Track exchange fees; they adjust basis.",
    ],
  },
  "daily-calorie-calculator": {
    quickAnswer: "Estimate TDEE-style maintenance calories from age, sex, weight, height, activity.",
    explain:
      "Formulas like Mifflin-St Jeor are population averages - wearables and lab tests personalize better. Treat output as a starting line for two weeks of logging, not gospel.",
    example:
      "32F, 165 lb, 5’5”, moderate activity → might land near 2,050 kcal maintenance; cut 400/day for ~0.8 lb/week loss trend.",
    insights: [
      "Protein preserves muscle in a deficit - don’t cut it blindly.",
      "NEAT drops when you diet; expect plateaus and adjust.",
      "Medical conditions shift metabolism - consult pros if unsure.",
    ],
  },
  "date-difference-calculator": {
    quickAnswer: "Days, weeks, or inclusive counts between two calendar dates - timezone-neutral.",
    explain:
      "Project managers love this for SLAs and sprint boundaries. Legal contracts sometimes count inclusively; toggle if the tool offers it.",
    example:
      "Jan 10 to Mar 2 non-inclusive → 51 days - handy for 45-day return windows and interest accrual estimates.",
    insights: [
      "Business days need a separate tool that skips holidays.",
      "Leap years can surprise annual contracts - verify anniversary dates.",
      "UTC vs local matters near midnight for logs - be explicit.",
    ],
  },
  "debt-payoff-calculator-avalanche": {
    quickAnswer: "Pay minimums everywhere, throw extra cash at the highest APR debt first.",
    explain:
      "Avalanche minimizes interest paid versus snowball’s morale wins. If you need dopamine from closing small accounts, snowball still wins behaviorally - math isn’t everything.",
    example:
      "Cards at 24%, 19%, 11% with $400 snowball → avalanche attacks 24% first, saving maybe $1,100 vs random order over 18 months.",
    insights: [
      "Stop using the cards you’re attacking or the plan breaks.",
      "Windfalls go straight to principal - don’t dilute across five debts equally.",
      "Refi high APR to personal loan only if you won’t rack cards again.",
    ],
  },
  "debt-payoff-calculator-snowball": {
    quickAnswer: "Knock out the smallest balance first while paying minimums on the rest - psychology-first.",
    explain:
      "Snowball trades a bit of interest for visible wins. Great if missed payments were killing your score; less optimal if a huge APR card sits untouched too long.",
    example:
      "$900 medical bill, $3,200 card, $11k loan - snowball clears $900 in 2 months, freeing its payment to punch the card next.",
    insights: [
      "Celebrate milestones; habit change is the ROI here.",
      "Still avoid new debt - otherwise you’re treading water with trophies.",
      "Hybrid: snowball until highest APR exceeds X%, then switch.",
    ],
  },
};
