import type { ToolPageInsight } from "../tool-insights-types";

/** Finance batch: VAT, tips, net worth projection, retirement age, manual FX. */
export const TOOL_INSIGHTS_G: Record<string, ToolPageInsight> = {
  "vat-calculator": {
    quickAnswer: "VAT dollars = net price × (rate ÷ 100); gross is net plus that VAT line.",
    explain:
      "Retail stacks vary: some quotes are VAT-inclusive already. This tool assumes you start net-exclusive and add VAT for a clean subtotal/tax/total trio.",
    example: "£100 net at 20% → £20 VAT → £120 gross you might show on a quote.",
    insights: [
      "Rounding rules (per line vs invoice total) can change pennies - follow your auditor.",
      "B2B reverse-charge regimes are not modeled - this is straight percentage math.",
      "Zero-rated and exempt supplies need human judgment, not a single rate field.",
    ],
  },
  "tip-calculator-split-bill": {
    quickAnswer: "Tip pool = check × tip%; each pays (check + pool) ÷ heads for an even split.",
    explain:
      "It ignores itemized fairness and auto-gratuities. Good for quick restaurant math when everyone agrees on one percentage on the full ticket.",
    example: "$180 bill, 18% tip, 6 people → $32.40 tip, $212.40 ÷ 6 ≈ $35.40 per seat.",
    insights: [
      "Tip on pre-tax subtotal vs post-tax total is a policy choice - enter the base you prefer.",
      "Large parties sometimes have mandatory service charges - subtract those before adding voluntary tip.",
      "International tipping norms differ wildly; the math is the same, the percentage is cultural.",
    ],
  },
  "net-worth-tracker": {
    quickAnswer: "Future NW ≈ today’s NW + (average monthly delta × months) without market noise modeling.",
    explain:
      "Unlike the detailed net worth snapshot tool, this answers “if my trajectory stays roughly this slope, where do I land?” Use conservative monthly deltas.",
    example: "$250k NW, +$2k/mo average, 24 months → about $298k before volatility.",
    insights: [
      "Equity markets make the real path jagged - smooth deltas are a planning fiction.",
      "One-time events (bonus, house sale) belong as adjusted months, not permanent slopes.",
      "Pair with the compound retirement tools when growth should dominate the story.",
    ],
  },
  "retirement-age-calculator": {
    quickAnswer: "Month-loop with monthly compounding + fixed contribution until balance crosses your target, then age = start + months/12.",
    explain:
      "It is not Monte Carlo, tax-aware, or withdrawal-safe. It answers how old you might be when a nominal balance hits a nominal goal under steady assumptions.",
    example: "Age 38, $120k, $1.5k/mo, 7% nominal, $1.5M target → roughly mid-60s if the return holds.",
    insights: [
      "Sequence-of-returns risk near the goal can dwarf average return - stress-test bad early years.",
      "401k match layers are not separated - fold employer match into contribution if you like.",
      "Healthcare and housing spend dominate real retirement dates more than portfolio math.",
    ],
  },
  "currency-converter": {
    quickAnswer: "Converted = amount × (units of B per 1 unit of A) using a rate you paste from your bank or data vendor.",
    explain:
      "No live feed avoids stale lawsuits: you own the quote timestamp and spread. Mid-market vs tourist desk rates diverge materially.",
    example: "1,000 USD × 0.91 EUR/USD → 910 EUR before wires, cards, or crypto network fees.",
    insights: [
      "Triangulate through USD if your pair isn’t quoted directly: A→USD then USD→B.",
      "Weekend crypto spreads can gap - the multiplication is still right, the quote may not be.",
      "For accounting, use the rate on the transaction date your policy specifies.",
    ],
  },
  "lease-vs-buy-car-calculator": {
    quickAnswer: "Side-by-side net cash: lease signing+payments vs down+amortized payments−resale over identical months.",
    explain:
      "Mileage overages, disposition, gap insurance, and business tax treatment are omitted so consumers get a blunt cash story before dealer options packages.",
    example: "$3k due at signing + $420×36 lease vs $35k car, $5k down, 7% APR, $18k resale → buy net often wins if resale holds.",
    insights: [
      "Leases hide profit in money factor and cap cost - normalize to APR equivalents offline.",
      "High depreciation cars tilt buy models if resale is pessimistic.",
      "Match horizon to when you would actually turn the car in or sell.",
    ],
  },
  "fuel-efficiency-calculator": {
    quickAnswer: "Divide distance by fuel in consistent units, then mirror L/100 km and US MPG with the standard gallon conversion.",
    explain:
      "Trip odometer plus pump litres or gallons beats dashboard averages when the ECU lies at short trips.",
    example: "320 miles on 9.2 gal → ~34.8 MPG → ~6.8 L/100 km headline equivalents.",
    insights: [
      "UK imperial gallons need the dedicated MPG converter - don’t mix with US mode here.",
      "Short winter warmups tank efficiency; log summer and winter separately.",
      "EV kWh/100 km belongs in running-cost or EV tools, not this fuel volume path.",
    ],
  },
  "parking-cost-calculator": {
    quickAnswer: "Monthly = daily ticket × paid days; multiply by months for a contract or annual commuter budget.",
    explain:
      "It ignores employer subsidies, pre-tax transit+parking programs, and street-meter variance - enter an average day rate you actually pay.",
    example: "$28/day × 20 days × 12 months → $6,720 annual commuter parking before any pass discount.",
    insights: [
      "Garage early-bird specials break the “daily rate” fiction - average them into one number.",
      "Airport long-term should use a different scenario than downtown office parking.",
      "Pair with gas or transit tools to compare full commute cash burn.",
    ],
  },
  "dog-breed-life-expectancy": {
    quickAnswer: "Static breed tables show typical lifespan bands; optional age adds a rough illustrative remainder, not a vet forecast.",
    explain:
      "Breeder lines, obesity, dental disease, and cancer risk blow up individual variance - the table is a starting point for expectations, not a guarantee.",
    example: "Beagle row might read 12–15y; at age 8 you might see a wide remaining-years band with heavy disclaimers.",
    insights: [
      "Body condition score matters more than breed label for longevity.",
      "Insurance and savings plans should assume outliers, not the midpoint.",
      "Senior labs need joint and cardiac screens - ranges cannot encode that.",
    ],
  },
  "pet-food-cost-calculator": {
    quickAnswer: "Household monthly ≈ pet count × your average daily food dollars × ~30.44-day months, then scale by months.",
    explain:
      "You merge kibble, wet, toppers, and chews into one daily guess so multi-pet homes can sanity-check recurring spend before autoship changes.",
    example: "Two dogs at ~$3.50/day each × 12 months → thousands annually once the average month multiplier stacks.",
    insights: [
      "Rotate proteins slowly; bulk buying only saves money if storage stays pest-free.",
      "Prescription renal or GI diets belong in the daily number, not ignored.",
      "Puppy growth vs senior portions means revisit the daily estimate quarterly.",
    ],
  },
  "nursing-shift-pay-calculator": {
    quickAnswer: "Per-shift gross = straight hours × base + OT hours × base × multiplier, then multiply by counted shifts in the pay window.",
    explain:
      "It ignores charting-time debates, missed breaks, and union meal penalties - you supply the hour buckets your timecard already uses.",
    example: "$42/h, 8 straight + 4 at 1.5×, 6 shifts → each shift $672 before differentials, $4,032 in the block.",
    insights: [
      "California daily OT vs federal weekly OT can diverge - this sheet is agnostic.",
      "PRN vs salaried exempt roles should not use this path blindly.",
      "Compare to paystub YTD gross when disputing a short check.",
    ],
  },
  "bmi-for-children-calculator": {
    quickAnswer: "Same kg/m² formula as adults, but meaning lives on CDC/WHO percentile curves your pediatrician prints - not here.",
    explain:
      "Tall-for-age kids and muscular teens skew BMI without being unhealthy; the number is a screening flag, not a verdict.",
    example: "A 10-year-old at 19 kg/m² might sit mid-chart or high depending on sex and puberty timing - only the plotted dot matters.",
    insights: [
      "Under-2: prefer length-weight velocity tables instead of BMI-only chats.",
      "Ask for growth velocity (crossing percentiles) not a single visit snapshot.",
      "Sports med clinics track lean mass separately for adolescent athletes.",
    ],
  },
  "medication-dosage-calculator": {
    quickAnswer: "Multiply written mg/kg by weight, then divide by mg/mL if you are sanity-checking a liquid syringe pull.",
    explain:
      "Renal adjustment, max daily caps, rounding to measurable volumes, and twin-pack concentrations are all out of scope - pharmacist wins every dispute.",
    example: "0.15 mg/kg × 22 kg = 3.3 mg total; 120 mg/5 mL implies ~0.1375 mL - often rounded per protocol, not by this raw line.",
    insights: [
      "Never titrate from a blog - only from a labeled order or MAR.",
      "Suspensions settle - shake per label before drawing.",
      "Double-check mg vs mcg before touching insulin or digoxin-class narrow drugs.",
    ],
  },
  "due-date-calculator": {
    quickAnswer: "Classic LMP + 280 calendar days while reminding everyone ultrasound dating moves the official sticker.",
    explain:
      "Irregular ovulation, hormonal contraception gaps, and IVF transfer dates all break naive LMP math - the tool is a first phone-call estimate.",
    example: "Jan 10 LMP → mid-October EDD on the napkin calendar before the 8-week scan adjusts it.",
    insights: [
      "Naegele’s rule ignores cycle length - add/subtract if you track ovulation.",
      "Postpartum contraception counseling still needs gestational age from charts, not this page.",
      "Travel insurance and workplace leave paperwork want the clinic letterhead date.",
    ],
  },
  "blood-type-compatibility": {
    quickAnswer: "ABO plus Rh gatekeeping for red cells only - O neg still goes through the blood bank, not your living room.",
    explain:
      "Kell, Kidd, Duffy, and warm autoantibodies make textbook grids laughable; compatibility is an immunohematology lab outcome.",
    example: "O+ donor to AB+ recipient passes the toy model; real life still needs type-screen and crossmatch.",
    insights: [
      "Plasma compatibility runs opposite - never use this for FFP decisions.",
      "Massive transfusion protocols may switch group-specific products under physician orders.",
      "Neonatal exchange transfusion uses specialized O Rh-negative units with extra testing.",
    ],
  },
  "markup-calculator": {
    quickAnswer: "Multiply unit cost by one plus markup-on-cost percent, then read implied gross margin as profit divided by that selling price.",
    explain:
      "Retail teams argue in markup while finance reports margin; this bridges both without touching VAT, payment fees, or channel-specific discounts.",
    example: "$40 cost, 75% markup → $70 shelf price → about 42.9% gross margin on the ticket.",
    insights: [
      "Landed cost should include freight-in if that is how you buy inventory.",
      "Markdown cadence lives in the discount tools, not in static markup sheets.",
      "Enterprise quotes often need approval bands on margin, not on markup vocabulary.",
    ],
  },
  "sales-commission-calculator": {
    quickAnswer: "Commission dollars equal gross sales times the rate field divided by one hundred before clawbacks or manager splits.",
    explain:
      "Comp plans hide complexity in net revenue definitions, accelerators, and minimum thresholds - this is the vanilla percentage slice only.",
    example: "$48k booked revenue at 6.5% → $3,120 before tax withholding and draw reconciliation.",
    insights: [
      "Returns in the following quarter can turn a paid commission into a painful true-up.",
      "Multi-currency deals need FX policy baked into the sales base you type.",
      "Pair with invoice timing when your plan pays on collection, not booking.",
    ],
  },
  "burn-rate-runway-calculator": {
    quickAnswer: "Divide cash on hand by average monthly net burn unless burn is zero, in which case runway is not a finite clock in this toy model.",
    explain:
      "Board decks still love the months-to-zero chart even though real plans layer revenue ramps, fundraise windows, and lumpy payroll taxes.",
    example: "$900k cash, $180k average net burn → about five months if absolutely nothing changes.",
    insights: [
      "Treat undrawn revolvers as policy-dependent, not automatic runway extensions.",
      "Non-cash expenses belong only if your cash forecast already stripped them.",
      "Hiring plans belong inside the burn numerator, not as a surprise afterward.",
    ],
  },
  "stacked-discount-calculator": {
    quickAnswer: "Apply the first percent off list, then the second percent off that reduced subtotal - never add the percents mentally.",
    explain:
      "Merchants love stacked promos because shoppers underestimate compounding; finance teams care about the effective single discount equivalent.",
    example: "$200 list, 25% then 10% → $135 final, not the $130 naive 35-off-list fantasy.",
    insights: [
      "POS order matters if policy applies employee discount before loyalty - mirror reality.",
      "Compare against the single discount-calculator when tax applies to the post-discount base.",
      "Three-plus stacks belong in a spreadsheet row you can audit later.",
    ],
  },
  "revenue-per-employee-calculator": {
    quickAnswer: "Split annual revenue by FTE-equivalent headcount for a blunt productivity ratio investors still glance at in pitch decks.",
    explain:
      "Consultancies, marketplaces, and chip vendors all publish wildly different RPE; definition alignment beats decimal precision.",
    example: "$18M ARR with 42 FTEs → about $429k revenue per employee before quality-of-revenue debates.",
    insights: [
      "Offshore contractors distort comps if you exclude them but peers include them.",
      "Seasonal retail should use average FTE, not December peak bodies.",
      "Pair with CAC and margin tools; RPE alone rewards unhealthy top-line vanity.",
    ],
  },
  "mulch-volume-calculator": {
    quickAnswer: "Multiply bed square feet by depth in inches divided by twelve for cubic feet, then divide by twenty-seven for supplier yardage talk.",
    explain:
      "Nurseries sell bulk by the loose cubic yard while bags quote oddball coverage; this stays in honest geometry before you argue delivery minimums.",
    example: "400 sq ft at 3 in deep → 100 cu ft → about 3.7 cu yd before rounding up to whole truck increments.",
    insights: [
      "Weed fabric and edging steal a little area-measure after hardscape is set.",
      "Fresh arborist chips settle; depth looks thinner after the first rain.",
      "Dyed mulch moisture changes weight, not the yardage you computed here.",
    ],
  },
  "concrete-slab-volume-calculator": {
    quickAnswer: "Treat the slab as a flat box in feet with thickness in inches over twelve, convert to cubic feet, then divide by twenty-seven for ready-mix yards.",
    explain:
      "Flatwork quotes start from geometry; vibrators, slump, and forms decide finish quality, not the first napkin multiple.",
    example: "12 ft × 16 ft × 4 in → 64 cu ft → about 2.37 cu yd before the crew’s customary over-order buffer.",
    insights: [
      "Fiber, mesh, and rebar schedules live outside this volume line item.",
      "Cold joints and control cuts are layout decisions, not cubic-yard math.",
      "Bagged post-mix shoppers should divide yardage by per-bag yield from the SKU chart.",
    ],
  },
  "floor-tile-quantity-calculator": {
    quickAnswer: "Floor square feet times one plus waste, divided by the square of tile side in feet, then ceiling upward for whole pieces.",
    explain:
      "It assumes a square grid; herringbone, hex, and skinny planks need a fatter waste knob than the default gut feel.",
    example: "10×12 room, 12 in tiles, 10% waste → 120 ft² × 1.1 ÷ 1 ft² → 132 pieces before box rounding.",
    insights: [
      "Subtract vanities and islands only if you already took them out of the floor area you typed.",
      "Large-format tiles crack the plan if subfloor flatness fails-labor, not count, blows budgets.",
      "Keep one attic box of the same dye lot for future chip repairs.",
    ],
  },
  "lawn-fertilizer-bags-calculator": {
    quickAnswer: "Ceiling-divide total turf square footage by the bag’s labeled coverage at the rate you intend to spread.",
    explain:
      "Label coverage already bakes in manufacturer assumptions; your spreader overlap is the human error term.",
    example: "8,000 sq ft lawn, bag covers 5,000 sq ft → two bags minimum even if the math says 1.6.",
    insights: [
      "Split apps in shoulder seasons beat one heroic dump that washes out.",
      "Buffer strips near water deserve zero product-this tool cannot see your easements.",
      "Soil tests beat guessing NPK ratios from aisle marketing copy.",
    ],
  },
  "wallpaper-roll-calculator": {
    quickAnswer: "Ceiling-divide net wall square feet by the roll’s usable coverage from the spec sheet, then buy sympathy rolls for repeat waste.",
    explain:
      "Pattern repeat eats vertical length; this flat ratio is the baseline before the installer’s multiplier chart.",
    example: "180 sq ft of pasted wall, 56 usable sq ft per roll → four rolls mathematically, five psychologically for dye lot safety.",
    insights: [
      "Stair kite walls and bulkheads need manual area adds this form does not sketch.",
      "Peel-and-stick tolerances differ from traditional clay-coated papers-trust that SKU only.",
      "Batch numbers matter more than saving eight dollars on a fifth roll mid-job.",
    ],
  },
};
