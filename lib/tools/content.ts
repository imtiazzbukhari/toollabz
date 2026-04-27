import { ToolDefinition, ToolFAQ } from "./types";
import { phase1Profiles } from "./phase1-seo";
import { TOOL_SEO_CONTENT_LEAD } from "./tool-seo-content-lead";
import { pickBySlug, slugContentVariant } from "./content-variation";

/** Category-specific FAQs merged early so finance/PDF/AI pages hit common intent queries. */
function categoryTemplateFaqs(tool: ToolDefinition): ToolFAQ[] {
  const cat = tool.category;
  if (cat === "finance") {
    return [
      {
        question: "How accurate is this calculator?",
        answer:
          "Outputs follow the documented formula with deterministic rounding. Accuracy depends on the rates and assumptions you enter—always confirm tax, FX, and lending rules with a qualified professional for regulated decisions.",
      },
      {
        question: "Does this include tax?",
        answer:
          "Only when the fields explicitly model tax, withholding, or VAT. Otherwise amounts are neutral numerics—label currency and tax treatment yourself.",
      },
      {
        question: "What currency does this use?",
        answer:
          "Numbers are unitless unless the tool labels a currency. Keep one currency per run and convert externally when needed.",
      },
      {
        question: "Can I use this for business planning?",
        answer:
          "Yes for orientation and what-if sketches. For filings, audits, or investor materials, reconcile with source systems and licensed advisors.",
      },
      {
        question: "How often is the data updated?",
        answer:
          "Core formulas update when Toollabz ships a release; live FX (where offered) refreshes on a scheduled cadence noted near the control. Site-wide freshness is stamped on each page.",
      },
    ];
  }
  if (cat === "pdf") {
    return [
      {
        question: "Is my file secure when I upload it?",
        answer:
          "PDF utilities run client-side in your browser for merge/split/compress flows—files are not uploaded to Toollabz servers for those paths. Avoid sensitive documents on shared devices.",
      },
      {
        question: "What is the maximum file size?",
        answer:
          "Practical limits depend on your device RAM and browser. Very large PDFs may be slow; compress first when possible.",
      },
      {
        question: "Will merging reduce quality?",
        answer:
          "Merge copies pages as-is; it does not re-rasterize unless you run a separate compression step.",
      },
      {
        question: "Can I merge password-protected PDFs?",
        answer:
          "You generally need to unlock locally first—passworded inputs often fail in browser libraries until decrypted.",
      },
      {
        question: "Do you store my files after processing?",
        answer:
          "Client-side PDF flows do not persist your files on our servers. Clear downloads from your device when finished.",
      },
    ];
  }
  if (cat === "generators" || tool.slug.startsWith("ai-")) {
    return [
      {
        question: "Is the output copyright free?",
        answer:
          "You own how you use your inputs, but AI text can resemble public sources. Review, edit, and clear rights for commercial use as your counsel advises.",
      },
      {
        question: "How do I get better results?",
        answer:
          "Add constraints: audience, tone, length, format, and facts to include. Iterate with smaller prompts before asking for long drafts.",
      },
      {
        question: "Can I use this for commercial projects?",
        answer:
          "Toollabz does not provide legal clearance. Treat drafts as starting points and run compliance review before publishing or selling.",
      },
      {
        question: "What AI model powers this tool?",
        answer:
          "Generators use templated and heuristic transforms in-browser unless otherwise noted; they are not a live subscription to a third-party chat API unless explicitly stated on the tool.",
      },
      {
        question: "How many times can I use this for free?",
        answer:
          "There is no metered credit on Toollabz for these flows—stay reasonable so shared infrastructure stays fast for everyone.",
      },
    ];
  }
  return [];
}

function dedupeToolFaqs(items: ToolFAQ[]): ToolFAQ[] {
  const seen = new Set<string>();
  const out: ToolFAQ[] = [];
  for (const it of items) {
    const k = it.question.trim().toLowerCase().replace(/\s+/g, " ");
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(it);
  }
  return out;
}

function categoryLabelSeo(slug: string): string {
  return slug
    .split("-")
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join(" ");
}

function mergeSeoLead(tool: ToolDefinition, paragraphs: string[]): string[] {
  const lead = TOOL_SEO_CONTENT_LEAD[tool.slug];
  if (!lead || paragraphs.length === 0) return paragraphs;
  const next = [...paragraphs];
  next[0] = `${lead}\n\n${next[0]}`;
  return next;
}

const formulas: Record<string, string> = {
  "cm-to-feet": "feet = centimeters / 30.48",
  "kg-to-lbs": "pounds = kilograms × 2.20462",
  "km-to-miles": "miles = kilometers × 0.621371",
  "celsius-to-fahrenheit": "F = (C × 9/5) + 32",
  "mb-to-gb": "GB = MB / 1024",
  "loan-calculator": "EMI = P × r × (1+r)^n / ((1+r)^n - 1)",
  "emi-calculator": "EMI = P × r × (1+r)^n / ((1+r)^n - 1)",
  "compound-interest-calculator": "A = P × (1 + r/n)^(n×t)",
  "salary-after-tax-calculator": "Net Salary = Gross Salary × (1 - Tax Rate)",
  "stock-profit-calculator": "Profit = (Sell - Buy) × Quantity - Fees",
  "roi-calculator": "ROI% = (Gain / Cost) × 100",
  "profit-margin-calculator": "Margin% = ((Revenue - Cost) / Revenue) × 100",
  "cac-calculator": "CAC = Sales & Marketing Spend / New Customers",
  "ltv-calculator": "LTV = ARPU × Gross Margin / Churn",
  "conversion-rate-calculator": "Conversion% = (Conversions / Visitors) × 100",
  "cpc-calculator": "CPC = Spend / Clicks",
  "net-worth-calculator": "Net Worth = Total Assets - Total Liabilities",
  "debt-payoff-calculator-snowball": "Months ≈ -log(1 - (Debt × r / Payment)) / log(1 + r), where r = APR/12",
  "debt-payoff-calculator-avalanche": "Months ≈ -log(1 - (Debt × r / Payment)) / log(1 + r), prioritizing highest APR debt first",
  "credit-card-interest-calculator": "Monthly Interest = Balance × (APR / 12)",
  "credit-utilization-calculator": "Utilization% = (Balance / Credit Limit) × 100",
  "early-loan-payoff-calculator": "EMI = P × r × (1+r)^n / ((1+r)^n - 1), then recompute with extra payment",
  "refinance-calculator-mortgage": "Savings = Current Payment - New Payment; Break-even Months = Closing Costs / Monthly Savings",
  "emergency-fund-calculator": "Emergency Fund Target = Monthly Expenses × Coverage Months",
  "savings-interest-calculator-usa": "Future Value = P(1+r)^n + PMT × [((1+r)^n - 1) / r]",
  "paycheck-calculator-usa": "Net Pay = Gross Pay × (1 - Total Deduction Rate)",
  "hourly-to-salary-converter-usa": "Annual Salary = Hourly Rate × Hours/Week × Weeks/Year",
  "paycheck-calculator-california": "Net Pay = Gross Pay × (1 - (Federal + California + Deductions))",
  "paycheck-calculator-texas": "Net Pay = Gross Pay × (1 - (Federal + Deductions))",
  "salary-to-hourly-converter-usa": "Hourly Rate = Annual Salary / (Hours/Week × Weeks/Year)",
  "overtime-pay-calculator-usa": "Total Pay = (Regular Hours × Rate) + (Overtime Hours × Rate × Multiplier)",
  "car-loan-affordability-calculator": "Affordable Loan Principal derived from payment, APR, and term amortization",
  "mortgage-affordability-calculator-usa": "Affordable Payment = Income × DTI - Debt; Loan derived by amortization",
  "rent-vs-buy-calculator-usa": "Total Rent = sum of rent with annual increase; Total Buy = Monthly Buy Cost × Months",
  "property-roi-calculator": "ROI% = (Net Gain / Total Cost) × 100",
  "rental-yield-calculator-uk": "Gross Yield% = ((Monthly Rent × 12) / Property Price) × 100",
  "gas-cost-calculator-road-trip": "Fuel Cost = (Distance / MPG) × Fuel Price",
  "salary-after-tax-calculator-california": "Net Salary = Gross Salary × (1 - (Federal + California + Other Deductions))",
  "salary-after-tax-calculator-texas": "Net Salary = Gross Salary × (1 - (Federal + Other Deductions))",
  "salary-after-tax-calculator-new-york": "Net Salary = Gross Salary × (1 - (Federal + New York State + Local + Other Deductions))",
  "salary-after-tax-calculator-florida": "Net Salary = Gross Salary × (1 - (Federal + Other Deductions))",
  "salary-after-tax-calculator-uk": "Net Salary = Gross Salary × (1 - (Income Tax + NI + Pension))",
  "roi-calculator-marketing": "Marketing ROI% = (Net Gain / Campaign Cost) × 100",
  "cac-calculator-saas": "CAC = Sales & Marketing Spend / New Customers",
  "ltv-calculator-saas": "LTV = ARPU × Gross Margin / Churn",
  "break-even-calculator-business": "Break-even Units = Fixed Cost / (Price - Variable Cost)",
  "profit-margin-calculator-business": "Margin% = ((Revenue - Cost) / Revenue) × 100",
  "ai-email-subject-line-generator": "Template generation based on topic, audience, and tone context",
  "ai-cold-email-generator": "Contextual outreach draft generated from offer, audience, CTA, and tone",
  "ai-linkedin-post-generator": "Structured draft generation with hook, value, and CTA",
  "ai-resume-summary-generator": "Role-focused summary generated from experience, skills, and achievement",
  "ai-product-description-generator": "Benefit-led product copy generated from product details and tone",
  "json-validator": "Parse JSON input and return validity or parse error details",
  "base64-encoder-decoder": "Encode plain text to Base64 or decode Base64 to text",
  "url-encoder-decoder": "Encode/decode URL component strings safely",
  "regex-tester": "Run regex pattern with flags and return match results",
  "api-response-formatter": "Validate and pretty-print API JSON responses with top-level key summary",
  "moving-cost-calculator-usa": "Total Move Cost = Labor + Truck + Supplies + Distance loading factor",
  "electricity-cost-calculator-usa": "Monthly Cost = (Watts/1000 × Hours/Day × Days/Month) × Rate",
  "internet-speed-requirement-calculator": "Required Mbps estimated from concurrent activity demand + buffer",
  "budget-planner-monthly-usa": "Monthly Balance = Income - (Fixed + Variable + Debt + Savings Goal)",
  "daily-calorie-calculator": "TDEE estimated from BMR (Mifflin-St Jeor) × activity factor",
  "business-name-generator": "Generate 5-10 brandable business names from keyword patterns",
  "username-generator": "Generate 5-10 username combinations from seed text",
  "random-name-generator": "Generate 5-10 randomized name outputs",
  "startup-name-generator": "Generate 5-10 startup-style naming combinations",
  "brand-name-generator-ai": "Generate 5-10 style-aware brand name ideas from keyword and style",
  "time-zone-converter": "Converted Time = Input Time + (To UTC Offset - From UTC Offset)",
  "date-difference-calculator": "Difference based on absolute milliseconds between dates",
  "age-calculator": "Age calculated from birth date to as-of date in years/months/days",
  "unit-price-calculator": "Unit Price = Total Price / Quantity",
  "discount-calculator": "Final Price = Original × (1 - Discount%) then apply tax if provided",
  "ai-content-humanizer": "Generate multiple rewrites using tone and audience context while preserving core meaning",
  "privacy-policy-generator": "Structured legal draft assembled from company details, jurisdiction, and data categories",
  "terms-and-conditions-generator": "Structured terms draft generated from company identity, service type, and governing law",
  "disclaimer-generator": "Disclaimer clauses generated by disclaimer type and company details",
  "freelance-rate-calculator": "Hourly Rate = (Income Goal + Costs) / (1 - Tax Rate) / Billable Hours",
  "adsense-revenue-calculator": "Revenue = (Monthly Pageviews × Monetized%) / 1000 × RPM",
  "tiktok-script-generator": "Generate multi-angle short-form scripts with hook, body beats, and CTA",
  "youtube-metadata-generator": "Generate title, description, tags, and chapters from topic + keyword inputs",
  "ai-prompt-optimizer": "Rewrite weak prompts into structured prompt templates with constraints and output format",
  "saas-valuation-calculator": "Valuation Range = ARR × Low/High Revenue Multiple",
  "crypto-tax-calculator-basic": "Estimated Tax = Realized Gain × Tax Rate",
  "schema-markup-generator": "Generate JSON-LD object for selected schema type and required attributes",
  "json-to-php-array-converter": "Parse JSON then recursively convert to PHP array syntax",
  "htaccess-redirect-generator": "Create Apache redirect rule from source path, destination URL, and status code",
  "core-web-vitals-suggestion-tool": "Classify LCP/CLS/INP by thresholds and map to prioritized remediation actions",
  "domain-value-estimator": "Monthly Profit = (Pageviews/1000)×RPM − Operating Costs; Value Range = Monthly Profit × Multiple Low/High",
  "mortgage-refinance-calculator": "Amortized payment at old vs new rate; Break-even Months = Closing Costs / Monthly Savings",
  "business-insurance-calculator": "Premium ≈ Revenue×RiskRate + Employees×PerEmployeeLoad (planning band)",
  "google-ads-roi-calculator": "ROAS = Revenue / Spend; ROI% = ((Revenue − Spend) / Spend) × 100",
  "refund-policy-generator": "Assemble structured policy sections from brand, URL, support channel, and refund window",
  "freelance-contract-generator": "Template clauses for scope, compensation, payment, IP, confidentiality, termination, and governing law",
  "invoice-generator": "Line Total = qty × rate; Tax = Subtotal × Tax%; Total = Subtotal + Tax",
  "utm-link-builder": "URL API merges utm_source, utm_medium, utm_campaign, optional utm_content/utm_term into query string",
  "domain-age-checker": "Elapsed calendar difference from registration UTC midnight to now in years/months/days",
  "meta-tag-analyzer": "Regex extraction of title, meta description, Open Graph fields, and meta inventory from HTML source",
  "qr-code-generator-with-logo": "ECC-H QR image URL from encoded payload; logo overlay applied externally with contrast testing",
  "image-background-remover": "Checklist output for masking, spill control, and alpha export (no pixel processing)",
  "ai-social-bio-generator": "Multiple bio variants from platform, niche, and tone seeds (manual fact-check required)",
  "youtube-tag-extractor": "Union of hashtag matches and comma/newline chunks with deduplication and length filters",
  "password-generator-advanced": "Independent random picks from selected charset pools repeated for length × count",
  "robots-txt-generator": "Emit User-agent group, Allow/Disallow lines, optional Sitemap URL",
  "broken-link-checker": "Flag non-http(s)/mailto/tel/relative href patterns including javascript: pseudo-links",
  "html-to-json-converter": "JSON summary of title string and regex counts for headings, hrefs, and img tags",
  "json-to-html-converter": "Recursive render of JSON primitives, arrays, and objects into nested HTML lists with escaping",
  "ai-search-appearance-checker": "Multi-pack SEO/AI visibility prompts from brand, topics, and market context",
  "gas-fee-calculator-multichain": "Fee (native) = GasLimit × Gwei / 1e9; USD = Native × CoinPrice",
  "nft-royalty-calculator": "Royalty = Price × Royalty%; Marketplace Fee = Price × Fee%; Seller ≈ Price − Fee − Royalty",
  "ai-citation-checker": "Heuristic score from URLs, DOI-like tokens, years in parentheses, vague attribution phrases, and stat density vs links",
  "geo-score-calculator": "Weighted sum of six self-reported YES/NO GEO checklist items (capped at 100)",
  "reddit-keyword-opportunity-finder": "Structured post angles from theme, parsed seed keywords, and selected goal (no external Reddit fetch)",
  "x-viral-hook-generator": "Multiple templated hooks from topic, audience, format bias, and tone",
  "metadata-stripper-tool": "Line-wise removal when keys match privacy-sensitive EXIF/GPS/serial-style patterns",
  "tiktok-hook-analyzer": "First-line length, question/number/urgency heuristics plus word count vs advisory target length",
  "youtube-shorts-scene-planner": "Three-segment timeline from proportional splits of user-supplied total duration",
  "retention-hook-analyzer": "Opening snippet, keyword-based pattern-shift hints, and list-style beat detection on pasted script",
  "tiktok-trend-predictor": "Cadence-based guidance plus static observation and creative-matrix checklist (no live TikTok data)",
  "child-support-calculator": "Simplified income-shares obligation × payor income share × parenting-time adjustment",
  "alimony-estimator": "Monthly ≈ income gap × selected %; duration ≈ marriage years × 12 × multiplier",
  "small-claims-court-calculator": "Qualifies if claim ≤ state limit from static table; filing fee from same table",
  "notice-period-calculator": "Notice weeks from tenure bands by country; optional last day = resignation + calendar weeks",
  "severance-pay-calculator": "Weeks × weekly pay using country heuristics (US/UK/CA/AU)",
  "recipe-scaling-calculator": "Each ingredient amount × (desired servings / original servings)",
  "baking-ingredient-substitution-calculator": "Convert input to grams/ml then map to common swap ratios",
  "cooking-time-temperature-calculator": "Roast minutes from kg × meat coefficients; oven and internal temps by cut and doneness",
  "calorie-burn-by-food-calculator": "Food kcal ÷ exercise kcal per minute; walking distance from kcal ÷ ~100 kcal/mi",
  "alcohol-unit-calculator": "UK units = pure alcohol ml ÷ 10; kcal from ethanol mass × 7",
  "anxiety-level-self-assessment": "GAD-7–style sum of seven 0–3 items; severity bands from total score",
  "burnout-score-calculator": "Mean of 1–5 items per four dimensions; overall risk from grand mean",
  "sleep-quality-score-calculator": "Efficiency = estimated sleep ÷ time in bed; composite score with habit adjustments",
  "stress-score-quiz": "PSS-10–style sum with items 4,5,7,8 reverse-scored (4 − raw)",
  "screen-time-health-calculator": "Weekly/yearly hours from daily totals; heuristic scores for sleep, productivity, eyes",
  "carbon-footprint-calculator": "Sum of grid×kWh, gas therms, car×miles, flights, diet band, shopping factors → tonnes CO₂e",
  "solar-panel-savings-calculator": "kWh from bill÷rate; panel yield from W×sun hours×365×PR; savings = kWh×rate",
  "ev-vs-petrol-cost-calculator": "Petrol L from MPG/L100km; EV kWh from miles×kWh/100mi; compare annual cost + premium",
  "water-footprint-calculator": "Direct L from fixtures + rounded diet virtual-water band vs country benchmark",
  "food-waste-cost-calculator": "Spend × waste %; mass via $/kg stub; CO₂e via kg × emission factor per kg wasted food",
  "paint-calculator": "Wall area = perimeter×height − doors×2 m² − windows×1.5 m²; litres = area×coats ÷ coverage (m²/L)",
  "flooring-cost-calculator": "Area from rectangles; material = area×$/m² tier; optional underlay + fitting add-ons",
  "fence-cost-calculator": "Panels from length÷panel width; posts + gates; material and labour bands by type/height",
  "roof-replacement-cost-estimator": "Total = area × $/m² band by material × country × storey factor; optional tear-off add-on",
  "deck-building-cost-calculator": "Deck area × material $/ft²; labour multiplier by state; railing/stairs flat adds",
  "habit-cost-calculator": "Per-period cost × frequency scaled to weekly/monthly/yearly horizons",
  "pomodoro-focus-planner": "Block counts from available minutes ÷ (25+5) with long breaks after every 4 focus blocks",
  "hourly-rate-to-annual-salary-calculator": "Annual from rate type (hourly×hrs×weeks, daily×5×weeks, etc.); equivalents via division",
  "meeting-cost-calculator": "Loaded hourly rate from salary÷2080 × attendees; cost = rate × hours; recurring annualization",
  "life-expectancy-calculator": "Base LE by country/sex adjusted by smoking, activity, diet, BMI, alcohol heuristic deltas",
  "car-depreciation-calculator": "Residual curve by segment; mileage and age penalties; annual % from purchase to estimate value",
  "car-running-cost-calculator": "Fuel: MPG→gal/mi or L/100km→L/km or kWh/100km; energy cost + insurance + service + tax",
  "mpg-l100km-converter": "UK/US MPG, L/100km, km/L interconverted; tank range from volume × economy",
  "uk-road-tax-calculator": "Band lookup from registration era, fuel, CO₂ or engine cc per simplified DVLA-style tables",
  "tyre-size-calculator": "Overall diameter from width×aspect% and rim; speedo error vs rolling circumference change",
  "vo2-max-calculator": "Cooper/1.5-mile/HR regression estimates; zones from %HR reserve or %VO2max",
  "one-rep-max-calculator": "Epley, Brzycki, Lombardi 1RM estimates from submax set; training % table from chosen 1RM",
  "race-pace-calculator": "Pace = time/distance; splits at fixed intervals; mode switches pace↔time",
  "swimming-pace-calculator": "Race time = (pace/100m)×distance; per-length from pool length and stroke cadence hint",
  "cycling-power-to-weight-calculator": "W/kg = FTP÷mass; category bands; Coggan-style zone anchors from FTP",
  "baby-sleep-schedule-calculator": "Age-banded total sleep, nap count, wake windows; sample clock schedule from anchors",
  "child-height-predictor": "Mid-parental target ± residual range; optional Z-score from current height vs age",
  "school-year-age-calculator": "Grade/year from DOB cut-off rules per country; Sept 1 reference where applicable",
  "childcare-cost-calculator": "Hours × regional rate table by care type; illustrative subsidy/tax-free offsets",
  "family-budget-calculator": "Income vs needs/wants/savings; savings rate; 50/30/20 gap vs actual mix",
  "crypto-capital-gains-tax-calculator": "Gain = (sell−buy)×qty; tax = gain×rate; net = gain−tax; break-even sell from cost basis",
  "dividend-reinvestment-calculator": "Year loop: DRIP (v+d)×(1+g) vs no-DRIP v×(1+g) with cash += dividend",
  "options-profit-calculator": "Long/short call/put payoff at expiry: intrinsic×multiplier×contracts − net premium",
  "inflation-impact-calculator": "Future real equivalent = PV×(1+π)^n; purchasing power loss vs nominal hold",
  "vat-calculator": "VAT = Net × (Rate/100); Gross = Net + VAT",
  "tip-calculator-split-bill": "Tip = Bill × (Tip%/100); Per person = (Bill + Tip) ÷ Party size",
  "net-worth-tracker": "Projected NW = Current NW + (Monthly change × Months)",
  "retirement-age-calculator": "Monthly balance = Prior × (1 + annual/12) + contribution until target; age = start age + months/12",
  "currency-converter": "Converted = Amount × Exchange rate (target per 1 source)",
  "lease-vs-buy-car-calculator":
    "Lease total = upfront + lease×months; Buy net = down + loan payments − resale; loan payment via standard amortization",
  "fuel-efficiency-calculator": "US MPG = miles ÷ gallons; L/100 km = (litres ÷ km)×100; convert with 235.214583 factor for US MPG ↔ L/100 km",
  "parking-cost-calculator": "Total = daily rate × days per month × number of months",
  "dog-breed-life-expectancy": "Shows static typical year range per breed; optional remaining years are illustrative from range minus age",
  "pet-food-cost-calculator": "Monthly ≈ pets × daily cost × 30.437 days; total = monthly × months",
  "nursing-shift-pay-calculator": "Gross per shift = rate×regular hours + rate×OT multiplier×OT hours; period = per shift × shift count",
  "bmi-for-children-calculator": "BMI = weight_kg ÷ (height_m)²; pediatric percentiles require separate growth charts",
  "medication-dosage-calculator": "Total mg = (mg/kg) × weight_kg; optional mL = total mg ÷ (mg/mL)",
  "due-date-calculator": "EDD ≈ LMP + 280 days (calendar)",
  "blood-type-compatibility": "ABO: O→O only; A←A/O; B←B/O; AB←any; Rh− recipient accepts Rh− donor only (red cells, simplified)",
  "markup-calculator": "Selling price = Unit cost × (1 + Markup%); gross margin% on revenue = (Price − Cost) / Price × 100",
  "sales-commission-calculator": "Commission = Gross sales × (Commission rate ÷ 100)",
  "burn-rate-runway-calculator": "Runway (months) ≈ Cash on hand ÷ Average monthly net burn (undefined if burn is 0)",
  "stacked-discount-calculator": "After first = List × (1 − D1%); final = After first × (1 − D2%)",
  "revenue-per-employee-calculator": "RPE = Annual revenue ÷ Employee count (or FTEs)",
  "mulch-volume-calculator": "Cu yd = (Area_sqft × Depth_in / 12) ÷ 27",
  "concrete-slab-volume-calculator": "Cu yd = (Length_ft × Width_ft × Thickness_in / 12) ÷ 27",
  "floor-tile-quantity-calculator": "Tiles ≈ ceil((Room_sqft × (1 + Waste%)) ÷ (Tile_side_ft)²) with square tiles",
  "lawn-fertilizer-bags-calculator": "Bags = ceil(Lawn_sqft ÷ Coverage_per_bag_sqft)",
  "wallpaper-roll-calculator": "Rolls = ceil(Wall_sqft ÷ Usable_sqft_per_roll)",
  "mortgage-payment-calculator": "P&I = standard amortization on loan; + monthly tax, insurance, PMI if <20% down, HOA",
  "auto-insurance-quote-estimator": "Premium ≈ state baseline × age × record × credit × vehicle × coverage × loyalty factor",
  "life-insurance-coverage-calculator": "Net need = debts + 0.7×income×years + education − savings − existing coverage − 0.5×spouse×years",
  "personal-injury-settlement-calculator": "Net ≈ (economic + economic×severity×disability) × fault%; range ± band; after-fee line illustrative",
  "health-insurance-cost-estimator": "Net premium ≈ tier×benchmark − max(0, benchmark − income×FPL-based share/12) (simplified ACA)",
  "refinance-break-even-calculator": "Break-even months = closing costs ÷ (current P&I − new P&I)",
  "workers-compensation-calculator": "TTD ≈ min(⅔×wage, cap)×weeks; PPD illustrative; + medical",
  "credit-card-payoff-calculator": "Month-loop: interest, pay minimums, allocate surplus per avalanche/snowball/minimum",
  "dui-cost-calculator": "Cost band ≈ state midpoint × offense factor + lost wages + impound fees",
  "medical-malpractice-settlement-estimator": "Economic × severity × disability × optional cap haircut; wide settlement band",
  "business-loan-eligibility-calculator": "Heuristic pass on tenure, FICO, revenue vs loan, crude DSCR vs modeled payment",
  "disability-insurance-calculator": "Monthly benefit = annual income × replacement% ÷ 12",
  "home-equity-loan-calculator": "Max borrow = min(request, 0.85×home − mortgage); payment = amortize approved principal",
  "w4-tax-withholding-calculator": "Crude taxable income minus placeholder deductions; flat rate sketch ÷ paychecks",
  "slip-and-fall-settlement-calculator": "Economic damages × premises severity multiplier → settlement band",
  "truck-accident-settlement-calculator": "Economic × higher commercial multiplier → band",
  "mesothelioma-compensation-estimator": "Trust floor + litigation ceiling from medical and exposure (illustrative)",
  "divorce-settlement-calculator": "Net pool split 50/50 sketch; alimony = 15%×income gap (illustrative)",
  "va-disability-rating-calculator": "Sequential whole-person combine, round to 10%; map to 2025 monthly pay table",
  "student-loan-forgiveness-calculator": "PSLF flag if public employer and years ≥10; else long IDR horizon placeholder",
};

export function getToolFormula(slug: string) {
  return formulas[slug] ?? "The result is calculated using standard industry formulas and validated input ranges.";
}

export function getToolFaqs(tool: ToolDefinition): ToolFAQ[] {
  const base = [...tool.faqs];
  const keyword = tool.keywords[0] ?? tool.name.toLowerCase();
  const kw2 = tool.keywords[1] ?? tool.category;
  const formula = getToolFormula(tool.slug);
  const profileFaq = phase1Profiles[tool.slug]?.faq ?? [];
  const vi = slugContentVariant(tool.slug, 5);
  const fq = slugContentVariant(`${tool.slug}-faqtone`, 4);
  const lineage = [
    `Outputs should be stable for the same ${keyword} inputs unless Toollabz documents a formula change; bookmark the page to notice release notes in the site changelog when they exist.`,
    `If results look surprising, re-check units and percentage bases - many ${keyword} discrepancies come from basis mistakes rather than the calculator itself.`,
    `Copy results into your notes alongside the inputs you typed so teammates can reproduce the ${tool.name.toLowerCase()} trail during reviews.`,
    `Jurisdiction-specific tables are not silently guessed: enter the rates and rules you need for ${keyword} so the tool reflects what you intend to model.`,
    `In governed environments, treat this page as a planning scratchpad and move finalized figures into controlled systems after human review.`,
  ];

  const accuracyQuestions = [
    `How accurate is this ${tool.name.toLowerCase()}?`,
    `Should I trust ${tool.name} for a first-pass ${keyword} estimate?`,
    `How precise is ${tool.name} compared with a spreadsheet?`,
    `What does “accurate” mean for ${tool.name.toLowerCase()} here?`,
  ] as const;
  const formatQuestions = [
    `What input format should I use for ${keyword}?`,
    `How should I type ${keyword} values so ${tool.name} parses them correctly?`,
    `Which separators and units work for ${keyword} in this tool?`,
    `Do I need commas, symbols, or plain numbers for ${keyword}?`,
  ] as const;
  const mobileQuestions = [
    `Can I use this ${tool.name.toLowerCase()} on mobile devices?`,
    `Does ${tool.name} work on phones and tablets?`,
    `Is ${tool.name} usable on a small screen?`,
    `Will ${tool.name.toLowerCase()} behave the same on iOS and Android browsers?`,
  ] as const;

  const extra: ToolFAQ[] = [
    {
      question: accuracyQuestions[fq % accuracyQuestions.length]!,
      answer: `This ${tool.name.toLowerCase()} uses a deterministic formula (${formula}) and validates invalid or out-of-range input before calculation.`,
    },
    {
      question: formatQuestions[fq % formatQuestions.length]!,
      answer:
        "Enter plain numeric values without commas for amounts and percentages. Use decimal points where required for precise output.",
    },
    {
      question: mobileQuestions[fq % mobileQuestions.length]!,
      answer:
        "Yes. The calculator is responsive and optimized for mobile, tablet, and desktop with consistent output and UI behavior.",
    },
    {
      question: `Is ${tool.name} appropriate for regulated reporting about ${keyword}?`,
      answer: lineage[vi] ?? lineage[0]!,
    },
    {
      question: pickBySlug(`${tool.slug}-mismatch`, [
        `What if ${tool.name} disagrees with another app for ${keyword}?`,
        `Why might ${tool.name} show a different ${keyword} result than another calculator?`,
        `Another site gave a different ${keyword} number - what should I check here?`,
      ] as const),
      answer: `Compare rounding, compounding, date boundaries, and tax basis. Toollabz documents behavior relative to: ${formula}`,
    },
    {
      question: pickBySlug(`${tool.slug}-share`, [
        `How should I share ${tool.name} for a ${keyword} review?`,
        `What is the cleanest way to pass ${tool.name} results to a teammate?`,
        `Can I send ${tool.name.toLowerCase()} output without losing context?`,
      ] as const),
      answer:
        "Share the canonical HTTPS tool page link so reviewers inherit the same field labels and assumptions, not only a screenshot.",
    },
    {
      question: `Where does ${tool.name} fit with other ${categoryLabelSeo(tool.category)} tools?`,
      answer: `Use Related tools on this page - links are chosen for topical proximity to ${keyword}, ${kw2}, and common follow-on tasks in one session.`,
    },
    {
      question: `Does Toollabz log my ${keyword} inputs for ${tool.slug}?`,
      answer:
        "Toollabz designs these flows for client-side interaction without persisting your entries on our servers; still avoid highly sensitive secrets on shared devices.",
    },
  ];

  const merged = dedupeToolFaqs([...categoryTemplateFaqs(tool), ...base, ...profileFaq, ...extra]);
  const pad: ToolFAQ[] = [
    {
      question: `Can I cite ${tool.name} in documentation about ${keyword}?`,
      answer: `Cite it as a planning reference, not an authority: include the date, URL, and the inputs you used so readers can reproduce the ${tool.name.toLowerCase()} scenario.`,
    },
    {
      question: `What is the fastest way to learn ${tool.name} if ${keyword} is new to me?`,
      answer:
        "Read the How to use steps, run the example-style inputs suggested in the guide paragraphs, then open a related tool linked below to extend the workflow.",
    },
  ];

  const out = dedupeToolFaqs([...merged, ...pad]);
  return out.slice(0, 12);
}

export function getToolSeoContent(tool: ToolDefinition): string[] {
  const keyword = tool.keywords[0] ?? tool.name.toLowerCase();
  const formula = getToolFormula(tool.slug);
  const profile = phase1Profiles[tool.slug];

  if (profile) {
    return mergeSeoLead(tool, [
      `${tool.name} is designed for ${profile.audience} who need fast and dependable output without leaving the browser. It focuses on "${keyword}" in a practical way: ${profile.scenario}. A useful check is ${profile.exampleInput}, which typically returns ${profile.exampleOutput}. Try that first if you want to confirm the tool behaves the way you expect.`,
      `Under the hood, ${tool.name.toLowerCase()} uses a deterministic logic path based on ${formula}. Inputs are validated before processing so malformed or out-of-range entries do not produce misleading numbers. A common mistake is ${profile.pitfall}; this page reduces that risk with clear field structure and predictable output formatting.`,
      `Interpretation matters as much as raw calculation. For this tool, the best approach is to ${profile.interpretation}. This is useful when you are planning, reporting, publishing, or shipping code. If the job is broader, you can ${profile.relatedIntent}. Related tools on this page are picked to match that workflow.`,
      `Headings and FAQs are written to answer the questions people actually ask. Toollabz keeps this tool free, mobile-ready, and lightweight for repeat use. If ${keyword} is part of your routine, bookmark this page and pair it with related tools when you need the next step.`,
    ]);
  }

  const pack = slugContentVariant(`${tool.slug}-seopack`, 4);
  const introByPack = [
    `${tool.name} is built for people who want fast, reliable results without opening a spreadsheet or installing desktop software. The page centers on practical use around ${keyword}: personal planning, business analysis, development work, or everyday tasks. The flow is simple: enter values, run the tool, and read the output with enough context to act. Logic is deterministic and inputs are validated so you can trust a first-pass answer before you dig deeper.`,
    `If your search intent is ${keyword}, this page is meant to be a calm workspace: ${tool.name} focuses on the fields that matter, explains what each output means in plain language, and avoids burying the interactive area under marketing fluff. You still bring the real-world assumptions; the tool keeps the arithmetic and formatting consistent so you can iterate quickly.`,
    `${tool.name} exists so you can answer ${keyword} questions in one sitting - whether you are comparing two scenarios, validating a figure someone sent you, or teaching someone else the relationship between inputs and results. Everything runs in the browser with deterministic logic, so the same typed values yield the same outputs every time you return.`,
    `Toollabz frames ${tool.name} around ${keyword} because that is how people actually work: they need a credible baseline before they invest time in a heavier model. The intro you are reading is unique to this URL; scroll to the live tool, run a conservative case first, then widen the range once the outputs match your expectations.`,
  ];
  const logicByPack = [
    `The logic for ${tool.name.toLowerCase()} follows a clear formula: ${formula}. Inputs are validated before processing so empty, malformed, or out-of-range values do not turn into misleading numbers. That matters when you compare scenarios or share results with a team. Numeric tools keep units and percentages consistent; text and developer tools spell out parsing and formatting so errors are easy to spot and fix. Beginners get guardrails; experienced users get predictable behavior.`,
    `Under the hood, ${tool.name.toLowerCase()} maps your fields into ${formula}, then surfaces intermediate checks where helpful so you can see why a number moved. Validation is strict on obvious mistakes because silent failures are worse than a clear error message when you are working with ${keyword} under time pressure.`,
    `This implementation is intentionally boring in a good way: ${formula} is applied the same way on every run, with the same rounding rules documented implicitly through the output formatting. That consistency is what makes ${tool.name} useful when two people need to reconcile a ${keyword} disagreement without debating hidden spreadsheet macros.`,
    `Formula reference for reviewers: ${formula}. The UI is a thin layer on top of that relationship - it does not “guess” missing tax tables or jurisdiction rules; you supply the rates and boundaries you want modeled so the output reflects your intent rather than a hidden default.`,
  ];
  const navByPack = [
    `Most people looking for ${keyword} want speed, accuracy, and a straight explanation. The \"How to use\" section gives a quick path in; the FAQs cover edge cases and common misunderstandings. When one tool is not enough, related tools point to converters, calculators, or validators that often sit in the same workflow so you can finish the job without starting over elsewhere.`,
    `Navigation on this page is structured for scanning: jump links in the hero move you to explanations, examples, and FAQs without losing your place. Related tools are not random promos - they are clustered for ${keyword} follow-ups such as unit checks, tax sketches, or formatting helpers that frequently appear in the same session.`,
    `If you are new to ${keyword}, read the short sections first, then return to the calculator with one concrete scenario. If you are experienced, you can skip straight to inputs; the deep guide still documents edge cases that trip people up when they export numbers into slides or tickets.`,
    `Beyond ${tool.name.toLowerCase()}, Toollabz links outward to category hubs and blog guides so you can move from a single number to a narrative your stakeholders will accept. That internal linking also signals topical depth to search systems evaluating whether this URL is a thin utility page.`,
  ];
  const benchByPack = [
    `If you are benchmarking, run several inputs and compare outputs side by side. That helps with planning, estimation, and what-if checks. Always confirm assumptions (tax rate, interest, baselines, time horizon) against your country, employer, or business rules before you finalize a decision. This ${tool.name.toLowerCase()} stays free and responsive on desktop and mobile. Bookmark it if ${keyword} shows up often in your week, and use related tools when the next step is a different calculation or format.`,
    `When stakes are moderate, treat ${tool.name} as a triage step: capture min, mid, and max cases for ${keyword}, note the deltas, then escalate to licensed advice or audited systems if required. The page stays fast on mobile so you can rerun scenarios during a commute or between meetings without losing your train of thought.`,
    `For documentation habits, paste the canonical URL next to exported figures so future-you knows which version of ${tool.name.toLowerCase()} produced them. Pair that habit with the Guides section when you need prose context that a calculator field cannot carry alone.`,
    `Finally, remember that ${keyword} searches vary by region and product rules; this tool does not read your contracts or tax returns. Use it to structure thinking, then validate externally when regulations apply. The combination of clear formulas, FAQs, and related tools is what keeps the experience substantive rather than repetitive across Toollabz URLs.`,
  ];

  return mergeSeoLead(tool, [
    introByPack[pack] ?? introByPack[0]!,
    logicByPack[pack] ?? logicByPack[0]!,
    navByPack[pack] ?? navByPack[0]!,
    benchByPack[pack] ?? benchByPack[0]!,
  ]);
}
