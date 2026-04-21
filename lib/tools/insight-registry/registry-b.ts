import type { ToolPageInsight } from "../tool-insights-types";

export const TOOL_INSIGHTS_B: Record<string, ToolPageInsight> = {
  "discount-calculator": {
    quickAnswer: "Given original price and percent (or amount) off, show what you actually pay and how much you saved.",
    explain:
      "Retail math trips people on stacked discounts - 20% then 10% off isn’t 30%. This keeps one layer clear; for stacks, run sequentially.",
    example:
      "$129 jacket, 25% off → pay $96.75, save $32.25 - if tax is post-discount, that’s the fair basis in most US locales.",
    insights: [
      "Compare unit prices on “buy 2 get 1” deals - often worse than a straight percent.",
      "Mail-in rebates aren’t savings until the check clears.",
      "Free shipping thresholds can nudge you above the discount value.",
    ],
  },
  "early-loan-payoff-calculator": {
    quickAnswer: "See interest saved and new payoff date when you add extra principal each month.",
    explain:
      "Mortgages and car notes front-load interest. Even modest extra principal early in the amortization schedule lops off surprising total interest.",
    example:
      "$312k at 6.5% for 30 years → +$200/mo principal from month 1 might save ~$95k interest and cut ~6.5 years.",
    insights: [
      "Specify “apply to principal” on the payment slip - banks misapply otherwise.",
      "If APR is sub-4% and you lack emergency savings, rethink aggressive payoff.",
      "Refi breakeven matters; extra principal and refi interact.",
    ],
  },
  "electricity-cost-calculator-usa": {
    quickAnswer: "Multiply kilowatt-hours by your rate to estimate a bill segment or appliance cost.",
    explain:
      "Useful when a space heater runs 8 hours a day or you’re comparing EV charging at home vs public. Rates often tier or time-of-use - this is a flat approximation.",
    example:
      "1.4 kW heater × 6 hr/day × 30 days = 252 kWh × $0.14/kWh ≈ $35.28/month for that one device.",
    insights: [
      "Delivery charges and fixed fees aren’t in per-kWh math - read the EFL.",
      "Smart plugs can log real kWh if estimates feel off.",
      "Summer peaks may hit a higher tier - model worst month separately.",
    ],
  },
  "emergency-fund-calculator": {
    quickAnswer: "Target cash buffer from monthly essentials and how many months you want covered.",
    explain:
      "Emergency funds are insurance, not investments. Freelancers and single-income households often aim longer; dual stable jobs might go shorter if lines of credit exist.",
    example:
      "$4,800 monthly must-pay (rent, food, insurance, minimums) × 5 months → $24,000 high-yield savings, not meme stocks.",
    insights: [
      "Keep it boring and liquid - T-bills okay, rental properties not.",
      "Replenish after draws before investing extras.",
      "Separate true emergencies from “sale on skis.”",
    ],
  },
  "emi-calculator": {
    quickAnswer: "Equated monthly installment for principal, rate, and tenure - classic loan payment math.",
    explain:
      "EMI stays flat while interest portion shrinks over time. Compare total interest across tenures - longer EMI eases cash flow but buys the bank more interest.",
    example:
      "$28,000 car, 7.2% APR, 48 months → EMI ≈ $673; total interest ≈ $4,300 vs 60 months at ~$556 but ~$5,360 interest.",
    insights: [
      "Check prepayment penalties before assuming you’ll refi early.",
      "0% promos may hide fees in the principal - read disclosures.",
      "Biweekly half-payments create an extra yearly payment sneakily.",
    ],
  },
  "gas-cost-calculator-road-trip": {
    quickAnswer: "Trip miles ÷ MPG × price per gallon ≈ fuel spend before snacks and tolls.",
    explain:
      "Real MPG swings with AC, roof racks, and mountain grades. Use this for ballparking split costs between friends, not auditing taxes.",
    example:
      "820 miles, car averages 31 mpg, gas $3.45 → 820 ÷ 31 ≈ 26.45 gal × $3.45 ≈ $91.25 one way.",
    insights: [
      "City legs tank MPG - use separate segments if half is urban.",
      "Cash-back cards on gas stack with warehouse club pricing.",
      "EV trip? Swap MPG for kWh/100mi and $/kWh mentally.",
    ],
  },
  "hourly-to-salary-converter-usa": {
    quickAnswer: "Hourly rate × hours/week × weeks/year → rough annual gross before benefits nuance.",
    explain:
      "Assumes steady hours; overtime, PTO, and unpaid lunch breaks change the story. Compare to salaried offers by normalizing to effective hourly.",
    example:
      "$34/hr, 40 hrs, 50 work weeks → $68,000 gross; add 2 more paid weeks if employer gives 52 paid.",
    insights: [
      "Contract W-2 vs 1099: self-employment tax eats ~7.65% extra on 1099 math.",
      "Night differentials and on-call stipends belong in the numerator.",
      "Divide salary by realistic hours to spot “unpaid overtime” jobs.",
    ],
  },
  "inflation-calculator": {
    quickAnswer: "Translate past dollars to present (or vice versa) using a CPI-style growth rate you supply.",
    explain:
      "Inflation averages hide category spikes - rent and healthcare often outrun headline CPI. Still useful for “what did $50k in 2005 feel like today?”",
    example:
      "$50k in 2005 at ~3% average → ≈ $78.6k in 2025 purchasing power - why old salaries sound tiny now.",
    insights: [
      "Personal inflation ≠ CPI if you’re urban and renting.",
      "Investments should beat inflation after tax, not before.",
      "Long contracts need COLA clauses - don’t trust vibes.",
    ],
  },
  "instagram-engagement-calculator": {
    quickAnswer: "Engagement rate ≈ (likes + comments + saves) ÷ followers or reach, depending on inputs.",
    explain:
      "Brands benchmark creators with saves and shares, not vanity likes alone. Story engagement differs from feed - don’t mix formats in one average.",
    example:
      "12.4k followers, post gets 980 likes, 54 comments, 31 saves → interactions ÷ followers ≈ 8.6% - strong for mid-tier niches.",
    insights: [
      "Bots inflate followers and crater rate - audit audience quality.",
      "Carousel second-slide saves signal value; optimize for them.",
      "Posting time matters less than hook in first 2 seconds now.",
    ],
  },
  "internet-speed-requirement-calculator": {
    quickAnswer: "Add up Mbps needs for concurrent Zoom, 4K, gaming, and smart home chatter.",
    explain:
      "ISPs sell peak download; video calls care about upload. This helps you argue whether 300/30 beats gigabit symmetric for your actual household.",
    example:
      "2 Zoom HD (4 up each) + 4K stream (25 down) + buffer → ~33 down, ~10 up minimum; round up for Wi-Fi loss.",
    insights: [
      "Wi-Fi 6 doesn’t fix bad wiring inside walls - Ethernet still wins.",
      "Bufferbloat shows up in latency, not Mbps billboards.",
      "Roommates mean parallel peaks - don’t size for solo usage.",
    ],
  },
  "investment-portfolio-calculator": {
    quickAnswer: "Weight assets by value to see actual allocation vs your target pie chart.",
    explain:
      "Drift happens silently as winners outrun losers. Rebalancing rules (time- or threshold-based) keep risk aligned with sleep-at-night levels.",
    example:
      "Total $180k: $108k equities → 60%, $45k bonds → 25%, $27k cash → 15% - if target was 70/20/10, you’re equity-heavy.",
    insights: [
      "Taxable vs retirement buckets rebalance differently - mind capital gains.",
      "Include RSUs and ESPP as equity even if “not invested yet.”",
      "International home bias sneaks in via large-cap US giants.",
    ],
  },
  "json-formatter": {
    quickAnswer: "Beautify JSON with indentation for reading, diffs, and slack snippets.",
    explain:
      "Minified payloads are hostile to humans. Formatting is lossless for data - unlike summarizing - so it’s safe for debugging if content isn’t secret.",
    example:
      "Turn `{\"a\":1,\"b\":{\"c\":true}}` into a tree so you notice `c` is bool, not string - bug found faster.",
    insights: [
      "Sort keys option helps stable diffs in code review.",
      "Huge JSON can crash tabs - use CLI jq for multi-MB files.",
      "Never paste customer PII into untrusted formatters.",
    ],
  },
  "json-validator": {
    quickAnswer: "Check whether text is valid JSON and point to the first syntax hiccup.",
    explain:
      "Trailing commas and single quotes are classic culprits from hand-edited configs. Validate before you pipe into production deploy scripts.",
    example:
      "`{ \"ok\": true, }` fails - remove the trailing comma after true to satisfy strict JSON.",
    insights: [
      "JSON ≠ JavaScript - undefined and NaN aren’t valid.",
      "BOM characters from Windows editors break parsers silently.",
      "Schema validation is the next step after syntax passes.",
    ],
  },
  "kg-to-lbs": {
    quickAnswer: "Convert kilograms to pounds for gym plates, luggage scales, and medical charts.",
    explain:
      "2.20462 lb per kg. Airlines quote kg in much of the world while US bathroom scales show lb - this prevents panic at check-in.",
    example:
      "23 kg checked bag → ~50.7 lb - know your airline’s 50 vs 23 kg rules before rearranging socks at the counter.",
    insights: [
      "Dumbbells often round to 5 lb increments; precision is for logs.",
      "Pediatric dosing sometimes uses kg even in the US - double-check units.",
      "Write both on shipping labels for international carriers.",
    ],
  },
  "km-to-miles": {
    quickAnswer: "Convert kilometers to miles (and often back) for running splits and road signs abroad.",
    explain:
      "Useful when Strava shows km but your brain thinks miles, or when a rental car odometer doesn’t match map apps.",
    example:
      "10K race ≈ 6.2137 miles - why “sub-40 10k” sounds insane in American high-school track units.",
    insights: [
      "Speed limits: 100 km/h ≈ 62 mph - don’t wing it with mental math at night.",
      "Fuel economy flips: L/100km vs MPG needs care - don’t compare raw numbers.",
      "GPS may use nautical miles in aviation - different tool.",
    ],
  },
  "legal-fee-estimator": {
    quickAnswer: "Rough total from hourly rate, expected hours, and retainer or flat-fee add-ons.",
    explain:
      "Litigation surprises with filings and depositions. This is a conversation starter with counsel, not a binding quote - courts don’t refund optimism.",
    example:
      "$385/hr × 42 estimated hours + $4k filing bundle ≈ $20.2k before expenses like expert witnesses.",
    insights: [
      "Ask for phase-based budgets, not one giant black box.",
      "Contingency vs hourly shifts who bears risk - price reflects that.",
      "Expense pass-throughs (travel, copies) add quietly.",
    ],
  },
  "loan-calculator": {
    quickAnswer: "Monthly payment and total interest from amount, APR, and term - general purpose.",
    explain:
      "Amortization front-loads interest; early payments barely dent principal. Use extra-payment mode if the tool exposes it to see leverage of rounding up.",
    example:
      "$18,500 personal loan, 11.4% APR, 5 years → ~$407/mo, ~$5.9k total interest if no prepayments.",
    insights: [
      "Origination fees reduce net proceeds - APR captures some of that.",
      "Credit cards as “loans” without a plan blow this math up.",
      "Compare APR, not monthly payment alone, across lenders.",
    ],
  },
  "ltv-calculator": {
    quickAnswer: "Lifetime value = how much gross profit a customer delivers over their relationship.",
    explain:
      "Simple LTV uses ARPU × lifespan × margin. Reality needs churn curves and discounting - still, rough LTV vs CAC should exceed 3:1 in healthy models.",
    example:
      "$42/mo subscription, 24-month avg life, 68% gross margin → LTV ≈ $42 × 24 × 0.68 ≈ $686 before CAC payback discussion.",
    insights: [
      "Discount cash flows if payback stretches years - money today ≠ money later.",
      "Expansion revenue (upsell) belongs in LTV, not ignored.",
      "Cohort LTV beats company-wide averages for planning ads.",
    ],
  },
  "ltv-calculator-saas": {
    quickAnswer: "SaaS LTV leaning on ARPA, gross margin, and churn or net revenue retention.",
    explain:
      "Logo churn and seat expansion fight each other. NRR >100% means LTV grows even if some customers leave - model both, not just churn alone.",
    example:
      "$1.2k ARPA/month, 75% margin, 1.8% monthly churn → rough LTV ≈ (1200 × 0.75) / 0.018 ≈ $50k logo value (simplified).",
    insights: [
      "Annual contracts with churn at renewal differ from monthly smooth churn.",
      "Professional services margin is lower - segment LTV by segment.",
      "Don’t multiply LTV by vanity logo count; use paying customers.",
    ],
  },
  "mb-to-gb": {
    quickAnswer: "Convert megabytes to gigabytes (binary vs decimal aware if the tool specifies).",
    explain:
      "Storage marketing uses decimal GB (10^9), OS often shows binary GiB. Mislabeling causes “where did my 500 GB SSD go?” confusion - know which column you’re in.",
    example:
      "48,000 MB ÷ 1000 → 48 GB marketing; ÷1024 → ~46.9 GiB - explains the gap on your laptop disk view.",
    insights: [
      "Bandwidth bills often use decimal; RAM uses binary - same acronym, different honesty.",
      "Cloud egress fees care about bytes transferred, not file “size on disk.”",
      "Compress before converting mentally for archives - algorithms vary.",
    ],
  },
};
