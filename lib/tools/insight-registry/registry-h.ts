import type { ToolPageInsight } from "../tool-insights-types";

/** High-CPC finance, insurance, and legal estimator tools - outputs are planning bands, not professional advice. */
export const TOOL_INSIGHTS_H: Record<string, ToolPageInsight> = {
  "mortgage-payment-calculator": {
    quickAnswer: "Standard amortizing P&I plus monthly tax, insurance, modeled PMI under twenty percent down, and HOA sums to the headline cash requirement.",
    explain:
      "Escrow trues-ups, MI cancellation dates, and tax reassessments move the real check; this page keeps the math literal so you can stress-test rate and down payment quickly.",
    example: "$350k home, twenty percent down, six point five percent, thirty years → roughly mid‑two‑thousands P&I before tax and insurance lines you add.",
    insights: [
      "ARMs, buydowns, and IO periods need another worksheet entirely.",
      "Closing disclosures itemize prepaids separately from recurring escrow.",
      "Extra principal payments shrink interest but do not automatically lower escrow components.",
    ],
  },
  "auto-insurance-quote-estimator": {
    quickAnswer: "Start from a state baseline premium, stack age and record multipliers, then haircut slightly if you already carry continuous coverage in the model.",
    explain:
      "Carriers price territory down to ZIP, vehicle VIN symbols, and credit where allowed-this stays at state plus a handful of knobs so you get magnitude not a bindable quote.",
    example: "Clean forty‑year‑old in a mid‑priced state on standard coverage often lands a few hundred a month when youthful operator surcharges are gone.",
    insights: [
      "Bundling home and auto can beat the small continuous-coverage discount assumed here.",
      "Usage-based programs can undercut static mileage assumptions.",
      "EV repair severity is shifting some carrier filings even where the model discounts electric slightly.",
    ],
  },
  "life-insurance-coverage-calculator": {
    quickAnswer: "Add debts, income replacement, and education buckets, then subtract savings, in-force coverage, and a spouse-income offset to reach a net face amount.",
    explain:
      "The crude term premium line scales a twenty‑year five‑hundred‑thousand benchmark by your net need-it is not a carrier illustration.",
    example: "Two kids, big mortgage, modest savings → net need often lands north of seven figures even when group term already exists.",
    insights: [
      "Permanent insurance has cash-value mechanics this page ignores entirely.",
      "Stay-at-home parents need imputed income for childcare and logistics.",
      "Laddering term lengths can match mortgage amortization more cheaply than one giant policy.",
    ],
  },
  "personal-injury-settlement-calculator": {
    quickAnswer: "Economic specials plus a severity multiplier for pain and suffering, scaled by the other party’s fault share, yields the headline band before attorney-fee illustrations.",
    explain:
      "Caps, insurance limits, bad-faith leverage, and venue politics routinely dominate real outcomes-this is arithmetic on your typed specials only.",
    example: "Fifty thousand specials, moderate multiplier, eighty percent fault on defendant → mid‑six‑figure gross before comparative reductions on plaintiff fault.",
    insights: [
      "Medicare and ERISA liens eat net dollars even when gross looks attractive.",
      "Uninsured motorist stacks change auto cases overnight.",
      "Structured settlements spread tax and cash-flow differently than lump sums.",
    ],
  },
  "health-insurance-cost-estimator": {
    quickAnswer: "Household FPL ratio picks a simplified income share, subtracted from a state Silver benchmark with age and tobacco load, then metal tier scales gross premium.",
    explain:
      "Real subsidies use the second-lowest Silver plan in your rating area-here a single state anchor stands in so rural vs urban variance is missing.",
    example: "Two‑forty percent FPL family on Silver often sees large gross premiums partially offset by the modeled credit line.",
    insights: [
      "CSR silver variants are not distinguished from vanilla Silver here.",
      "Medicaid expansion and immigration status gates are out of scope.",
      "Family glitch scenarios can erase subsidies even when this model shows help.",
    ],
  },
  "refinance-break-even-calculator": {
    quickAnswer: "Closing costs divided by monthly P&I savings gives months to recover hard dollars if the new amortization actually lowers the nut.",
    explain:
      "Cash-out increases principal; stretching term can lower the payment while raising lifetime interest-this answers the narrow break-even on payment delta only.",
    example: "Four thousand dollars closing, one hundred twenty monthly savings → a little over thirty months to neutral before opportunity cost debates.",
    insights: [
      "APR comparisons capture lender fees better than rate alone.",
      "Recoup rules and investor overlays can block the deal math likes.",
      "Break-even ignores PMI drops or tax deduction changes that also move cash flow.",
    ],
  },
  "workers-compensation-calculator": {
    quickAnswer: "Two-thirds wage replacement capped by an illustrative weekly max times disability weeks plus a scheduled-style PPD chunk and entered medical sums form the band.",
    explain:
      "States publish unique schedules, rating doctors, and vocational caps-this is a cartoon for orientation before you talk to counsel or the adjuster.",
    example: "Middle wage earner, twelve weeks TTD, ten percent rating → five figures low, six figures high depending on how PPD weeks map in your venue.",
    insights: [
      "Medicare set-asides appear in many settlements even though this page ignores CMS.",
      "Third-party liability can run parallel to comp exclusivity rules.",
      "Independent contractor misclassification fights precede any math.",
    ],
  },
  "credit-card-payoff-calculator": {
    quickAnswer: "Accrue interest each month, satisfy minimums, then steer the remaining dollars to the highest APR card or the smallest balance depending on strategy until zero.",
    explain:
      "Avalanche minimizes interest; snowball maximizes motivation-minimum-only shows how long trapped payments linger if you never add extra.",
    example: "Three cards, fifteen hundred total budget, realistic APRs → avalanche often trims months and hundreds in interest versus snowball on the same cash.",
    insights: [
      "Promotional rates and retroactive interest cliffs need spreadsheet detail.",
      "Biweekly paychecks do not change the math if the monthly sum is identical.",
      "Balance transfer fees belong in the opening balance if you want fidelity.",
    ],
  },
  "dui-cost-calculator": {
    quickAnswer: "Scale a state midpoint total by prior offense count, add suspension weeks times pay, then stack impound daily fees when you flag impound.",
    explain:
      "Insurance surcharges and career consequences dwarf fines in many files-this band is financial line items only, not opportunity cost.",
    example: "First offense mid-cost state without long suspension still lands five figures once education, IID, and counsel retainers appear in real life.",
    insights: [
      "SR-22 or FR-44 filing rules vary; some states mandate years of proof.",
      "Professional licenses and security clearances add non-dollar penalties.",
      "Repeat offenses cross into felony economics fast.",
    ],
  },
  "medical-malpractice-settlement-estimator": {
    quickAnswer: "Economic damages times a severity scalar and optional disability bump, optionally haircut for a cap toggle, produces a wide non-economic-inclusive band.",
    explain:
      "Affidavit-of-merit statutes, expert costs, and carrier consent provisions shrink real nets even when gross multiples look large.",
    example: "High six-figure specials with catastrophic multiplier can model into seven figures gross before caps and fees.",
    insights: [
      "MICRA-style reforms move the goalposts every legislative session.",
      "Hospital vs physician indemnity splits affect who pays what.",
      "Structured payouts interact with Medicaid eligibility planning.",
    ],
  },
  "business-loan-eligibility-calculator": {
    quickAnswer: "Time in business, FICO, revenue versus requested principal, and a crude DSCR-style cushion against a modeled five-year payment drive the pass-fail heuristic.",
    explain:
      "Underwriters weight cash-flow quality, collateral, and industry NAICS risk-this is a triage flag before you gather statements.",
    example: "Stable six-figure revenue, seven-twenty score, modest ask → likely passes the toy gate; thin margin with giant ask → flagged challenging.",
    insights: [
      "SBA guaranty percentages change effective risk appetite by program.",
      "Merchant cash advances use factor rates, not APR, entirely outside this sheet.",
      "Covenants and blanket liens matter as much as rate.",
    ],
  },
  "disability-insurance-calculator": {
    quickAnswer: "Annual income times replacement percent divided by twelve yields the monthly benefit target; premium band is a tiny fraction of that benefit for planning only.",
    explain:
      "Occupation class, elimination period, benefit period, and COLA riders swing price an order of magnitude beyond this stub.",
    example: "Six-figure earner wanting sixty percent replacement → about five grand a month target benefit before taxes and offsets.",
    insights: [
      "Group LTD offsets often include SSDI awards automatically.",
      "Pure own-occupation specialty policies price like luxury goods for surgeons.",
      "Mental-health limitation riders are contract fine print worth reading.",
    ],
  },
  "home-equity-loan-calculator": {
    quickAnswer: "Eighty-five percent of appraised value minus mortgage balance caps borrowing; we amortize the lesser of that cap and your request at the rate you type.",
    explain:
      "HELOC draw periods, IO windows, and risk-based pricing spreads are not modeled-this is closed-end second-lien style math.",
    example: "Four hundred thousand value, two hundred forty mortgage → about one hundred max new lien at the eighty-five percent combined rule of thumb.",
    insights: [
      "Texas homestead rules famously differ; local counsel matters.",
      "Appraisal gaps kill deals even when Zillow looks friendly.",
      "Interest tracing rules affect whether deductibility even matters to you.",
    ],
  },
  "w4-tax-withholding-calculator": {
    quickAnswer: "Subtract a placeholder standard deduction and flat child credits from wages plus other income, apply a coarse marginal-style rate, and spread annually over paycheck count.",
    explain:
      "The IRS estimator handles multiple jobs, credits, and phaseouts-this is intentionally primitive to show how sensitive withholding is to assumptions.",
    example: "Single filer, moderate salary, two kids in Step three → per-paycheck withholding drops materially versus ignoring credits.",
    insights: [
      "Bonus withholding defaults to twenty-two percent federal often.",
      "State withholding is a parallel worksheet.",
      "Safe harbor rules decide underpayment penalties, not this toy.",
    ],
  },
  "slip-and-fall-settlement-calculator": {
    quickAnswer: "Medical plus wages times a premises-appropriate multiplier usually below auto PI multiples yields the slip-and-fall band shown.",
    explain:
      "Open-and-obvious defenses, snow-and-ice statutes, and notice rules swing outcomes more than multiplier trivia.",
    example: "Ten thousand specials, moderate sprain pattern → mid-five figures modeled before insurer hostility discounts.",
    insights: [
      "Commercial general liability deductibles affect negotiation leverage.",
      "Governmental notice windows are brutally short.",
      "Video retention policies destroy cases when spoliation letters lag.",
    ],
  },
  "truck-accident-settlement-calculator": {
    quickAnswer: "Economic specials times a higher commercial multiplier than passenger auto reflects excess coverage depth and regulatory subtext in many files.",
    explain:
      "Revised carrier filings, MCS-90 angles, and broker liability are fact-specific-this is a sensitivity dial on your entered specials only.",
    example: "Two hundred thousand economic stack with commercial flag → modeled seven-hundred-thousand midpoint before real limits bite.",
    insights: [
      "Black box and ELD data win trials when preserved.",
      "Dram shop or loading-dock negligence may add defendants.",
      "Umbrella towers can still cap below catastrophic care costs.",
    ],
  },
  "mesothelioma-compensation-estimator": {
    quickAnswer: "Medical spend and exposure years lift a trust-style floor and a higher litigation ceiling; veteran flag only adds narrative reminders, not dollar precision.",
    explain:
      "Trust payment percentages, QSFs, and bankruptcy estimation letters change net recoveries constantly-call counsel before relying on numbers.",
    example: "Heavy exposure, six-figure annual care → modeled combined band often lands in mid six to low seven figures before liens.",
    insights: [
      "Statutes of limitation are non-negotiable; forum shopping is real.",
      "VA benefits run parallel but interact with offsets sometimes.",
      "Secondary exposure household claims exist but prove harder.",
    ],
  },
  "divorce-settlement-calculator": {
    quickAnswer: "Net marital assets divided equally in this illustration, plus a crude fifteen percent of the income gap as alimony color, ignores custody support entirely.",
    explain:
      "Equitable distribution states rarely land on fifty-fifty for every line; business valuations and RSU schedules explode simple forms.",
    example: "Half-million net pool → two hundred fifty per side before separate property arguments.",
    insights: [
      "QDRO drafting fees belong in the hidden cost pile.",
      "Maintenance durational caps vary wildly by statute.",
      "Hidden debt discovery shifts pools after this snapshot.",
    ],
  },
  "va-disability-rating-calculator": {
    quickAnswer: "Sort ratings high-to-low, combine sequentially with whole-person remainders, round to the nearest ten, then read 2025 monthly pay for a veteran alone.",
    explain:
      "Bilateral pairs, pyramiding rules, and SMC codes are why VA.gov tables still win-this matches common estimator math, not the full manual.",
    example: "Sixty plus thirty does not equal ninety; sequential math lands in the sixties before rounding conventions.",
    insights: [
      "TDIU pays at one-hundred rates without scheduler one-hundred.",
      "Dependent add-ons are material monthly dollars left out here.",
      "Appeals modernization changes timelines, not the combine formula.",
    ],
  },
  "student-loan-forgiveness-calculator": {
    quickAnswer: "Public service ten-year track with enough years flagged as PSLF-ish; otherwise a long IDR horizon placeholder warns patience and tax uncertainty.",
    explain:
      "Loan type, consolidation poison pills, and waiver windows dominate eligibility-this cannot read your NSLDS file.",
    example: "Government worker at eight years → close to PSLF runway; private sector → multi-decade IDR messaging.",
    insights: [
      "Teacher Loan Forgiveness can stack awkwardly with PSLF if sequenced wrong.",
      "IDR forgiveness taxation depends on congressional action year to year.",
      "Employer certification forms should be filed annually, not guessed here.",
    ],
  },
};
