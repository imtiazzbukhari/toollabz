import type { ToolPageInsight } from "../tool-insights-types";

/** Programmatic SEO / insight blocks for Toollabz batch (legal through inflation). */
export const TOOL_INSIGHTS_F: Record<string, ToolPageInsight> = {
  "child-support-calculator": {
    quickAnswer: "Income-shares style estimate from both parents’ incomes, children count, and custody % - not a court order.",
    explain:
      "The engine blends combined obligation ideas with who pays based on income share and overnight-time style sliders. Real guidelines differ by state, worksheet line items, and deviations.",
    example:
      "Two kids, $6k vs $4k monthly incomes, 70% time with lower earner → you see who likely pays and a rounded monthly band before local rules adjust it.",
    insights: [
      "Always verify the official state worksheet PDF your judge expects.",
      "Add healthcare, childcare, and tax quirks - the simplified model skips many add-ons.",
      "Print results with inputs if you brief an attorney; never rely on this in filings alone.",
    ],
  },
  "alimony-estimator": {
    quickAnswer: "Rough maintenance from marriage length, income gap %, and a duration multiplier - educational only.",
    explain:
      "Alimony statutes vary wildly; this applies a gap percentage band and scales months-of-duration off marriage years so you can sanity-check negotiations.",
    example:
      "10-year marriage, $8k vs $3k monthly → duration might span years while amount tracks a slice of the $5k gap depending on sliders.",
    insights: [
      "Tax treatment (pre- vs post-TCJA agreements) changes net cash - ask a CPA.",
      "Courts weigh need, ability, age, health, and custody - not captured here.",
      "Document imputed income debates separately; this assumes reported W-2 style numbers.",
    ],
  },
  "small-claims-court-calculator": {
    quickAnswer: "Compare claim amount to a static 50-state cap table plus a rough filing-fee hint for go/no-go planning.",
    explain:
      "Limits and fees change by county; the table is representative so you know whether to start in small claims or expect transfer.",
    example:
      "$4,200 dispute in a $5,000-cap state qualifies; a $12k claim in a $6k-cap state needs regular civil division.",
    insights: [
      "Confirm e-filing surcharges and service costs on the clerk’s site.",
      "Corporate plaintiffs sometimes face different caps - read local rules.",
      "Bring organized exhibits even in informal courts; judges still want proof.",
    ],
  },
  "notice-period-calculator": {
    quickAnswer: "Statutory-style minimum weeks from tenure bands by country plus optional last day if you enter a resignation date.",
    explain:
      "UK/AU/CA/IE style minimums are approximated from common statutory ladders; probation, contracts, or awards can override.",
    example:
      "UK employee over two years might see two weeks minimum notice while a short-tenure AU worker might see one.",
    insights: [
      "Contractual notice can be longer than statute - read your offer letter.",
      "Payment in lieu of notice has tax and timing nuances HR should document.",
      "Use the output to schedule handovers, not as legal advice.",
    ],
  },
  "severance-pay-calculator": {
    quickAnswer: "Weeks-of-pay style estimate from service years, weekly wage, and country heuristics for US/UK/CA/AU.",
    explain:
      "Redundancy formulas (especially UK age bands) are simplified into multipliers you can compare against policy manuals or union grids.",
    example:
      "8 years UK service might land near one week per year before age uplifts, while a US package might be a flat months multiplier.",
    insights: [
      "Check ERISA or collective agreements for defined formulas.",
      "COBRA, PTO payout, and equity acceleration are separate line items.",
      "Have counsel review releases before signing for any lump sum.",
    ],
  },
  "recipe-scaling-calculator": {
    quickAnswer: "Multiply every ingredient by desired÷original servings while keeping units consistent per row.",
    explain:
      "Each numeric amount scales linearly; names are echoed so you can paste shopping lists after rounding sensibly for eggs or spices.",
    example:
      "4-serving stew scaled to 10 → 2 cups onion becomes 5 cups unless you round to practical measures.",
    insights: [
      "Baking chemistry may fail on huge scaling - adjust leavening cautiously.",
      "Weigh in grams for precision; volume cups vary by packing.",
      "Salt, yeast, and spice often need less than linear scaling in practice.",
    ],
  },
  "baking-ingredient-substitution-calculator": {
    quickAnswer: "Converts your amount toward grams/ml then suggests 2–3 common swaps with ratio notes per ingredient family.",
    explain:
      "Substitutions are approximate; moisture, acidity, and gluten development change outcomes, so the copy warns per swap.",
    example:
      "1 cup butter → oil weight ~75% of butter mass plus guidance on crumb texture trade-offs.",
    insights: [
      "Vegan swaps often need more browning control - watch oven color.",
      "Acid-base balance matters when replacing buttermilk or baking powder.",
      "Test a half batch when trying new swaps for events.",
    ],
  },
  "cooking-time-temperature-calculator": {
    quickAnswer: "Roast-style minutes from meat, weight, doneness, with °F/°C oven targets and internal temp goals.",
    explain:
      "Coefficients approximate professional charts; always verify with a probe thermometer because oven variance dominates.",
    example:
      "3 kg turkey toward well-done might stretch hours at a moderate oven with repeated temp checks.",
    insights: [
      "Rest meat before carving - carryover heat continues cooking.",
      "Convection lowers time slightly; the model is baseline conventional.",
      "Spatchcocking or butterflying reduces time versus whole-bird geometry.",
    ],
  },
  "calorie-burn-by-food-calculator": {
    quickAnswer: "Food kcal divided by exercise MET-style minutes plus a walking-distance sanity comparison.",
    explain:
      "Burn rates are population averages; your heart rate and body mass change the real minutes needed.",
    example:
      "A 300 kcal burger might read as ~45–60 minutes of moderate walking depending on the exercise pick.",
    insights: [
      "HIIT spikes EPOC but steady-state math is simpler - this tool uses steady assumptions.",
      "Don’t use output to justify disordered eating patterns.",
      "Pair with a registered dietitian for medical nutrition targets.",
    ],
  },
  "alcohol-unit-calculator": {
    quickAnswer: "UK units from volume × ABV, NHS 14-unit weekly benchmark, rough sober-time and kcal from ethanol.",
    explain:
      "Pure alcohol ml drives units; metabolism hours are illustrative because liver health and food intake shift clearance.",
    example:
      "Two pints at 5% might exceed several units each - stacked across a week vs the 14-unit guidance line.",
    insights: [
      "Standard drinks differ in the US - don’t mix jurisdiction advice.",
      "Driving limits are legal, not metabolic; use taxis after drinking.",
      "Seek help if cutting down feels impossible - clinical support works.",
    ],
  },
  "anxiety-level-self-assessment": {
    quickAnswer: "GAD-7-like sum buckets into minimal/mild/moderate/severe with self-care prompts - not diagnosis.",
    explain:
      "Seven frequency items (0–3) aggregate; higher totals suggest professional screening especially with functional impairment.",
    example:
      "A score of 12 might land in moderate with advice to book primary care or therapy intake.",
    insights: [
      "Sudden panic with chest pain deserves urgent medical evaluation.",
      "CBT skills and sleep hygiene often move scores within weeks.",
      "Medication decisions belong to licensed prescribers only.",
    ],
  },
  "burnout-score-calculator": {
    quickAnswer: "Four burnout dimensions averaged from Likert items to label risk and suggest recovery levers per axis.",
    explain:
      "Exhaustion, cynicism, inefficacy, and overload are tracked separately so you know whether to fix workload, meaning, or skills.",
    example:
      "High cynicism + overload might steer toward boundary setting while inefficacy steers toward mentoring or training.",
    insights: [
      "Chronic fatigue can mimic thyroid or anemia - rule out medical causes.",
      "Micro-breaks help cynicism less than systemic role redesign.",
      "Document workload evidence before escalation conversations.",
    ],
  },
  "sleep-quality-score-calculator": {
    quickAnswer: "Efficiency-ish math from bed window minus latency/wakes plus habit penalties for caffeine/screens.",
    explain:
      "Sleep debt here is a heuristic week projection, not polysomnography; use it to spot trends.",
    example:
      "7h in bed, 30m to sleep, two wakes → lower efficiency than an uninterrupted 7h night.",
    insights: [
      "OSA snoring with daytime sleepiness needs a sleep clinic, not an app score.",
      "Consistent wake time beats chaotic bedtimes for circadian stability.",
      "Limit alcohol - it fragments REM even if you “pass out.”",
    ],
  },
  "stress-score-quiz": {
    quickAnswer: "PSS-10 style scoring with reversed items handled so totals map to stress band copy and coping tips.",
    explain:
      "Perceived Stress Scale literature informs interpretation; percentile language is illustrative, not normed live data.",
    example:
      "A score in the high twenties might pair with prioritization and boundary scripts in the results panel.",
    insights: [
      "Acute stress after trauma differs from chronic workplace pressure - context matters.",
      "Breathwork helps short term; systemic change helps long term.",
      "Therapists can teach ACT/DBT skills when scores stay elevated months.",
    ],
  },
  "screen-time-health-calculator": {
    quickAnswer: "Rolls phone + desktop hours into weekly/yearly totals with heuristic sleep, productivity, and eye-strain scores.",
    explain:
      "Risk labels are educational; age group and primary use nudge penalties to spark reduction ideas, not medical diagnosis.",
    example:
      "Teen + 6h social might show high yearly hour totals with tips on night modes and offline blocks.",
    insights: [
      "20-20-20 rule helps eyestrain but not sleep - blue light is only part of the story.",
      "Replace doomscroll with scheduled catch-up windows.",
      "Employers should measure deep work blocks, not just raw hours online.",
    ],
  },
  "carbon-footprint-calculator": {
    quickAnswer: "Tonnes CO₂e-ish from home energy, miles, flights, diet band, and shopping cadence vs national anchors.",
    explain:
      "Factors are static multipliers; electrification, grid intensity, and exact flight classes change materially.",
    example:
      "High meat + frequent short flights might double a vegetarian remote worker’s footprint in the same form.",
    insights: [
      "Offsets should be additionality-vetted; prefer reduction first.",
      "Home insulation beats guilt - kWh saved matters most.",
      "Compare year over year using the same inputs for honest trends.",
    ],
  },
  "solar-panel-savings-calculator": {
    quickAnswer: "Bill-derived kWh, assumed yield per kW, savings = generation × tariff with rough payback years.",
    explain:
      "Sun hours and pricing are stylized; installers should model shade, inverter losses, and net metering rules.",
    example:
      "$150 bill at 16¢/kWh suggests annual kWh you multiply by an effective $/W production guess.",
    insights: [
      "Battery economics differ from solar-only ROI - model separately.",
      "Check local incentives and feed-in tariffs before signing leases.",
      "Panel degradation (~0.5%/yr) matters on 25-year charts.",
    ],
  },
  "ev-vs-petrol-cost-calculator": {
    quickAnswer: "Annual energy cost from MPG or kWh/100km vs electricity rate, then multi-year totals with purchase premium.",
    explain:
      "Maintenance and depreciation are excluded unless you interpret extras manually; CO₂ uses static grid or fuel factors.",
    example:
      "12k miles, 28 MPG vs 3 mi/kWh at home rates might show EV fuel savings overtaking premium by year X.",
    insights: [
      "Public DC fast charging can erase savings vs home overnight rates.",
      "Cold weather cuts EV range; long trips need planning.",
      "Tax credits change TCO - refresh policy yearly.",
    ],
  },
  "water-footprint-calculator": {
    quickAnswer: "Litres/day from fixtures plus diet virtual-water bands benchmarked against rough country averages.",
    explain:
      "Indirect agricultural water dominates meat-heavy diets; taps and laundry are direct uses you can shrink quickly.",
    example:
      "Daily 15-minute showers plus meat-heavy diet might exceed a vegan low-flow household several times over.",
    insights: [
      "Fix leaks first - silent toilet leaks waste thousands of litres monthly.",
      "Full dishwasher loads beat handwashing with running tap.",
      "Greywater rules vary; check municipal codes before rerouting.",
    ],
  },
  "food-waste-cost-calculator": {
    quickAnswer: "Grocery spend × waste % flows to monthly/annual cash loss plus rough kg and CO₂e from spoilage factors.",
    explain:
      "Landfill tipping fees by country stub adjusts social cost; household composition scales portions implicitly via spend.",
    example:
      "$800/mo groceries at 20% waste ≈ $160/mo thrown cash before compounding five-year totals.",
    insights: [
      "FIFO fridge shelves cut waste faster than couponing.",
      "Freeze bread and herbs the week you buy them.",
      "Meal-plan around the most perishable vegetables first.",
    ],
  },
  "paint-calculator": {
    quickAnswer: "Wall area minus doors/windows, times coats, divided by coverage to litres and tin counts.",
    explain:
      "Coverage per litre varies by paint type; user-supplied price extends to a budget line.",
    example:
      "4×5m room, 2.7m height, two doors, one window → fewer litres than naive perimeter×height suggests.",
    insights: [
      "Primer may need different spread rates - calculate separately.",
      "Textured walls consume more paint than smooth drywall.",
      "Buy all paint one batch to avoid dye-lot mismatch.",
    ],
  },
  "flooring-cost-calculator": {
    quickAnswer: "Area from rectangles (L-shape optional) times material tier $/m² plus underlay and install toggles.",
    explain:
      "Waste % and quality tier swing totals; output shows component breakdown for quotes comparison.",
    example:
      "35 m² mid laminate + underlay + fitter day rates might land mid-four-figures depending on locale sliders.",
    insights: [
      "Order 8–12% extra for diagonal cuts and breakage.",
      "Soundproof underlay matters in flats - check lease rules.",
      "Stairs are priced per step, not only m² - add manually if needed.",
    ],
  },
  "fence-cost-calculator": {
    quickAnswer: "Length × per-foot material bands by type/height + gate allowances and optional tear-out adders.",
    explain:
      "Labour multipliers approximate regional variance; rocky post holes blow budgets in real life.",
    example:
      "120 ft vinyl 6 ft with two gates might split clearly between materials and labour in the extra lines.",
    insights: [
      "Check HOA height/color rules before purchasing panels.",
      "Property surveys prevent neighbor disputes - worth the fee.",
      "Cedar needs stain cadence; vinyl needs power-wash discipline.",
    ],
  },
  "roof-replacement-cost-estimator": {
    quickAnswer: "Area × material $/m² with country and storey multipliers plus optional tear-off layer.",
    explain:
      "Asphalt/metal/tile/slate baselines include rough complexity; steep pitches add cost in reality.",
    example:
      "180 m² asphalt mid-quote might widen ±20% once walkable pitch and access are known.",
    insights: [
      "Get ice-and-water shield in cold climates regardless of estimate.",
      "Compare architectural shingles vs 3-tab longevity, not just price.",
      "Solar readiness may mean new decking inspection - budget it.",
    ],
  },
  "deck-building-cost-calculator": {
    quickAnswer: "Square feet × material PSF + labour scaled by state band with railing/stair toggles and maintenance %.",
    explain:
      "Elevated decks trigger guardrail codes; composite lowers staining cost but raises upfront material.",
    example:
      "16×20 pressure-treated low deck vs same in composite shifts both material and 10-year maintenance guess.",
    insights: [
      "Call 811 before posts - utilities are expensive to hit.",
      "Ledger flashing details prevent home rot - don’t skip.",
      "Permit drawings may require engineer stamps on tall rails.",
    ],
  },
  "habit-cost-calculator": {
    quickAnswer: "Per-use price × daily/weekly/monthly frequency to yearly and multi-year run-rates with fun equivalences.",
    explain:
      "Compounding investing is not applied - this is pure spend forensics to motivate behavior change.",
    example:
      "$6 weekday coffee → thousands per year versus subscription-style comparisons in the copy.",
    insights: [
      "Automate savings the day you cut a habit so cash doesn’t drift.",
      "Track after-tax numbers for honesty.",
      "Celebrate partial reductions - not binary perfection.",
    ],
  },
  "pomodoro-focus-planner": {
    quickAnswer: "Plans focus blocks from your minutes budget using 25/5/15 style cadence - planner, not a live countdown.",
    explain:
      "Counts cycles and long breaks after every fourth focus block unless inputs change the pattern.",
    example:
      "A 3-hour study window might return ~5 deep blocks with scheduled breathers.",
    insights: [
      "Use a real timer app for audio cues; this page just structures intent.",
      "Protect blocks with DND + closed tabs.",
      "Review outcomes after four pomodoros to adjust task sizing.",
    ],
  },
  "hourly-rate-to-annual-salary-calculator": {
    quickAnswer: "Converts hourly/daily/weekly/monthly/annual figures using hours/week and paid holiday weeks removed.",
    explain:
      "Illustrative tax rates by country are flat effective stubs - not payroll engine accuracy.",
    example:
      "$45/hr, 40 hrs, 48 effective weeks → annual gross then derived hourly check matches backward.",
    insights: [
      "Bonuses, RSUs, and 1099 expenses aren’t modeled.",
      "OT and double-time rules change public-sector totals.",
      "Use official withholding calculators before negotiating offers.",
    ],
  },
  "meeting-cost-calculator": {
    quickAnswer: "Loaded salary ÷ annual hours × attendees yields burn rate per minute and run/recurring annualized waste.",
    explain:
      "Live ticker mode extrapolates elapsed minutes; recurring cadence multiplies pain for leadership storytelling.",
    example:
      "Six people at $120k equivalent might show hundreds of dollars per 30-minute status readout.",
    insights: [
      "Default shorter meetings - 15 minutes forces prioritization.",
      "Async docs replace most updates; reserve live time for decisions.",
      "Finance may use different fully-loaded cost - align assumptions.",
    ],
  },
  "life-expectancy-calculator": {
    quickAnswer: "Country/sex baseline LE adjusted by smoking, exercise, diet, BMI, and alcohol heuristic deltas.",
    explain:
      "Outputs are statistical fictions for education; individual genetics and accidents dominate variance.",
    example:
      "Quitting smoking might add multiple expected years in the model versus continuing smoker path.",
    insights: [
      "Screenings (colon, BP, lipids) change real outcomes more than guessing.",
      "Mental health and loneliness also affect mortality - holistic care matters.",
      "Discuss numbers with clinicians, especially after diagnoses.",
    ],
  },
  "car-depreciation-calculator": {
    quickAnswer: "Segment curve × age/mileage penalties to residual value, annual % loss, and sell-timing color.",
    explain:
      "Market comps trump formulas; EV and luxury segments move with incentive and battery news.",
    example:
      "$35k SUV, 4 years, 55k miles might show steep early-year depreciation then flatter tail.",
    insights: [
      "Maintain service records - buyers pay for documentation.",
      "Mileage brackets hit hardest at lease turn thresholds.",
      "Compare private party vs trade-in before accepting dealer offers.",
    ],
  },
  "car-running-cost-calculator": {
    quickAnswer: "Fuel or kWh path from economy inputs plus insurance, service, and road tax for annual $/mile.",
    explain:
      "Unit toggles keep MPG, L/100km, and kWh/100km coherent with price per gallon, litre, or kWh.",
    example:
      "12k miles, 32 MPG, $3.50/gal + fixed costs → monthly ownership beyond payment.",
    insights: [
      "Tyres and brakes belong in maintenance buckets - add if yours are thin.",
      "EV home charging vs public pricing swings this result wildly.",
      "Shop insurance yearly; loyalty rarely pays.",
    ],
  },
  "mpg-l100km-converter": {
    quickAnswer: "Simultaneous UK MPG, US MPG, L/100km, km/L plus tank range and cost per 100 miles/km.",
    explain:
      "Imperial vs US gallon difference is explicit so imports/exports don’t confuse buyers.",
    example:
      "8 L/100km ≈ mid-thirties US MPG - useful when reviewing European reviews.",
    insights: [
      "EPA vs WLTP labels differ; real-world fuelly data beats brochures.",
      "Elevation and headwinds dominate long trips more than converter precision.",
      "Hybrid MPG on short trips may beat highway - contextualize.",
    ],
  },
  "uk-road-tax-calculator": {
    quickAnswer: "Simplified DVLA-style year-one and standard rates from fuel, CO₂ band, or legacy engine cc rules.",
    explain:
      "Post-2017 CO₂ tables are approximated; luxury supplement years and exact g/km breakpoints need gov.uk confirmation.",
    example:
      "Petrol 2019 car at 130 g/km might sit in a mid band with six-month option math shown.",
    insights: [
      "EVs still have annual VED after year one in many cases - check current law.",
      "Classic/historic vehicle rules differ - this tool targets mass-market cars.",
      "SORN saves tax but not insurance obligations.",
    ],
  },
  "tyre-size-calculator": {
    quickAnswer: "Overall diameter from width, aspect, rim; speedometer error % vs new tyre rolling circumference.",
    explain:
      "Clearance fit is a rough ±mm note - always test mount and turn lock-to-lock.",
    example:
      "205/55R16 vs 215/45R17 might show a few percent speedo delta worth recalibrating if legal.",
    insights: [
      "TPMS must be reprogrammed on many cars after swaps.",
      "Mixing diameters on AWD risks driveline stress - follow maker tolerances.",
      "Winter tyres narrow on steel rims - verify load index.",
    ],
  },
  "vo2-max-calculator": {
    quickAnswer: "Cooper run, 1.5-mile time, or HR-ratio method to ml/kg/min with zone heart rates.",
    explain:
      "Field tests introduce pacing skill error; lab gas exchange remains gold standard.",
    example:
      "A 12-minute Cooper distance might map to a mid-40s VO₂ for a trained adult before age correction tables.",
    insights: [
      "Heat and caffeine skew day-to-day HR methods.",
      "Retest monthly with identical protocol to track trends.",
      "Combine with lactate or FTP tests for cycling specificity.",
    ],
  },
  "one-rep-max-calculator": {
    quickAnswer: "Epley, Brzycki, and Lombardi 1RM estimates averaged with %1RM working-weight table.",
    explain:
      "Submax sets (1–10 reps) feed formulas; true max attempts need safety and spotters.",
    example:
      "225 lb × 5 reps might land near a mid-250s averaged 1RM before individual variation.",
    insights: [
      "Peaking cycles and technique changes invalidate old rep-max data.",
      "Use safeties or power racks - don’t zero-out pins on max singles.",
      "Women’s neuromuscular efficiency differs - coaches adjust spread.",
    ],
  },
  "race-pace-calculator": {
    quickAnswer: "Pace↔time conversions for preset or custom km distances with optional split table every 5 km.",
    explain:
      "Negative vs even split commentary is qualitative; hills and aid stations change execution.",
    example:
      "5:00/km for a half marathon predicts finish just over 1:45 before fade modeling.",
    insights: [
      "Practice fueling at race pace, not just easy runs.",
      "Heat plans deserve slower early kilometers despite ego.",
      "Use course elevation files for precise predictions elsewhere.",
    ],
  },
  "swimming-pace-calculator": {
    quickAnswer: "Race time = pace/100m × distance with per-length seconds for 25/50 pools and stroke-rate hint.",
    explain:
      "Turn technique and underwater dolphin kick change real splits more than straight math.",
    example:
      "1:40/100m pace extrapolated to 400m freestyle before accounting for push-off glide.",
    insights: [
      "Long-course meters vs short-course yards need conversion discipline.",
      "Video analysis beats guessing stroke count targets.",
      "Open water adds sighting cost - add seconds per 100 mentally.",
    ],
  },
  "cycling-power-to-weight-calculator": {
    quickAnswer: "FTP ÷ kg → W/kg category bands, ~20-min power estimate, and Coggan-style seven zones.",
    explain:
      "Indoor trainer FTP may differ from outdoor aero losses - note environment when comparing.",
    example:
      "3.8 W/kg might label “good” amateur before age/gender context from external tables.",
    insights: [
      "Test FTP fresh - not after a heavy squat day.",
      "CdA matters on flats; W/kg matters on climbs.",
      "Double-check scale weight morning-of for honest ratio.",
    ],
  },
  "baby-sleep-schedule-calculator": {
    quickAnswer: "Age-weeks bands suggest total sleep, nap count, wake windows, and a sample clock schedule.",
    explain:
      "Based on common pediatric sleep guidance; every infant varies - watch sleepy cues over clocks.",
    example:
      "A 6-month-old might show two-nap rhythm with ~2.5h wake gaps in the sample timeline.",
    insights: [
      "Safe sleep means alone, flat, crib - ignore unsafe stacking hacks online.",
      "Regression weeks happen; consistency beats constant retooling.",
      "Pediatricians rule out reflux or allergy when sleep is impossible.",
    ],
  },
  "child-height-predictor": {
    quickAnswer: "Mid-parental height method with sex offset plus optional percentile if current height/age entered.",
    explain:
      "Genetics explain much but nutrition and hormones matter; charts are WHO/CDC style approximations.",
    example:
      "5'10\" dad + 5'4\" mom might center son prediction near parental average + son constant.",
    insights: [
      "Early puberty shifts growth curves - clinicians use bone age.",
      "Measure height same time of day barefoot.",
      "Consult endocrinology if crossing percentiles sharply.",
    ],
  },
  "school-year-age-calculator": {
    quickAnswer: "DOB vs country cut-off maps to current academic year/grade and oldest/youngest framing.",
    explain:
      "Private schools and gifted skips differ; September 1-ish rules dominate public systems in sample logic.",
    example:
      "Late summer birthday in USA might mean youngest in kindergarten cohort for that state rule set.",
    insights: [
      "Redshirting decisions are social and developmental - not just age math.",
      "International moves may need transcript mapping beyond this tool.",
      "Verify district PDF each spring; cutoffs can shift.",
    ],
  },
  "childcare-cost-calculator": {
    quickAnswer: "Hours × regional rate tables by care type with illustrative subsidy/tax-free childcare offsets.",
    explain:
      "Markets swing block by block; output is budgeting-grade, not an invoice from a provider.",
    example:
      "Full-time nursery in a high-cost metro might dwarf part-time au pair stipend expectations.",
    insights: [
      "Dependent care FSA vs credit depends on income - model taxes properly.",
      "Waitlists mean start searching pre-birth in cities.",
      "Nanny shares split cost but add coordination overhead.",
    ],
  },
  "family-budget-calculator": {
    quickAnswer: "Sums multi-earner take-home vs category spend to surplus, savings rate, and 50/30/20 gap commentary.",
    explain:
      "Needs/wants split is heuristic; your bank tags may classify differently.",
    example:
      "Two incomes, high housing, low savings might show a large 50/30/20 shortfall toward the 20% savings pillar.",
    insights: [
      "Emergency fund fills before aggressive investing - sequence matters.",
      "Zero-based budgets help irregular earners more than static percentages.",
      "Revisit quarterly; kids ages change costs fast.",
    ],
  },
  "crypto-capital-gains-tax-calculator": {
    quickAnswer: "Gain × chosen effective rate for short/long holding toggle with break-even sell price after tax.",
    explain:
      "Wash sales, NFT quirks, staking, and airdrops are ignored - jurisdictions differ wildly.",
    example:
      "Buy 1 BTC at $40k, sell $48k, US-style % → tax owed subtracted from net gain display.",
    insights: [
      "Use exchange CSVs plus your own wallet transfers to reconcile basis.",
      "Stablecoin trades are still disposal events in many countries.",
      "Hire a crypto-savvy CPA before large years.",
    ],
  },
  "dividend-reinvestment-calculator": {
    quickAnswer: "Year-forward model comparing DRIP compounding vs cash dividends idle at 0% with same price growth.",
    explain:
      "Assumes flat yield on reinvested path; real companies cut or grow dividends unpredictably.",
    example:
      "$10k, 3% yield, 7% growth, 20 years → DRIP line beats cash-under-mattress dividends materially.",
    insights: [
      "Tax drag on dividends in taxable accounts changes net DRIP benefit.",
      "Dividend ≠ bond-like safety - verify payout ratios.",
      "Use official transfer agent settings to enable true DRIP discounts if offered.",
    ],
  },
  "options-profit-calculator": {
    quickAnswer: "Expiry intrinsic minus premium per share, scaled by contracts × 100, with breakeven callout.",
    explain:
      "Ignores time value before expiry, assignment, and multi-leg strategies - education only.",
    example:
      "Long call ITM at expiry pays intrinsic minus debit paid times multiplier.",
    insights: [
      "Short options carry margin and tail risk this sheet doesn’t stress-test.",
      "Early exercise rarely optimal except dividends on deep ITM calls.",
      "Broker fees and SEC ticks erode small trades.",
    ],
  },
  "inflation-impact-calculator": {
    quickAnswer: "Compound inflation to future nominal dollars and show purchasing power loss vs today’s bundle.",
    explain:
      "Manual CPI override beats default country stub when you know the CPI reading you trust.",
    example:
      "$10,000 at 3% for 15 years might exceed $15k nominal while “real” value shrinks vs goods basket.",
    insights: [
      "Healthcare and tuition inflate faster than headline CPI - segment your plan.",
      "TIPS and I-bonds hedge differently than nominal bonds.",
      "Wage growth may offset inflation partially - model income too.",
    ],
  },
};
