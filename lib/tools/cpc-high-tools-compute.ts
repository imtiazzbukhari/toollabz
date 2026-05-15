import {
  ACA_SILVER_BENCHMARK_MONTHLY,
  AUTO_INSURANCE_STATE_BASE_MONTHLY,
  DUI_STATE_COST_MIDPOINT,
  FPL_2025_ANNUAL,
  VA_COMPENSATION_2025_MONTHLY,
  WORKERS_COMP_TTD_WEEKLY_CAP,
} from "./cpc-high-tools-data";

type CpcToolResult = {
  title: string;
  value: string;
  extra?: string[];
  error?: boolean;
};

const n = (value: string | undefined, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const requiredNumber = (value: string | undefined, label: string) => {
  if (value === undefined || value.trim() === "") return `${label} is required.`;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return `${label} must be a valid number.`;
  return null;
};

const invalid = (message: string): CpcToolResult => ({
  title: "Invalid Input",
  value: message,
  error: true,
});

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const moneyCents = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

/** Exact amortizing monthly P&I (principal > 0, years > 0). */
export function monthlyPI(principal: number, annualRatePct: number, years: number): number {
  const num = years * 12;
  if (principal <= 0 || num <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / num;
  return (principal * (r * Math.pow(1 + r, num))) / (Math.pow(1 + r, num) - 1);
}

function totalInterestPaidPI(monthlyPayment: number, numPayments: number, principal: number): number {
  return Math.max(0, monthlyPayment * numPayments - principal);
}

function vaCombineSequential(ratings: number[]): number {
  const sorted = ratings.filter((r) => r > 0 && r <= 100).sort((a, b) => b - a);
  if (sorted.length === 0) return 0;
  let c = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    c = Math.round(c + (sorted[i] * (100 - c)) / 100);
  }
  const rounded = Math.round(c / 10) * 10;
  return Math.min(100, Math.max(0, rounded));
}

function vaPayForCombined(combined: number): number {
  const keys = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  for (const k of keys) {
    if (combined >= k) return VA_COMPENSATION_2025_MONTHLY[k] ?? 0;
  }
  return 0;
}

function acaContributionFractionOfIncome(fplRatio: number): number | null {
  if (fplRatio < 100) return null;
  if (fplRatio > 400) return 1;
  if (fplRatio <= 150) return 0;
  if (fplRatio <= 200) return 0.02;
  if (fplRatio <= 250) return 0.04;
  if (fplRatio <= 300) return 0.06;
  return 0.085;
}

function simulateCreditCards(
  cards: { bal: number; apr: number; min: number }[],
  monthlyBudget: number,
  strategy: string,
): { months: number; interest: number; error?: string } {
  const active = cards.map((c) => ({
    bal: Math.max(0, c.bal),
    apr: Math.max(0, c.apr),
    min: Math.max(0, c.min),
  }));
  if (!active.some((c) => c.bal > 0)) return { months: 0, interest: 0 };
  const monthlyRates = active.map((c) => c.apr / 1200);
  let bals = active.map((c) => c.bal);
  let totalInterest = 0;
  let months = 0;
  const minPay = [...active.map((c) => c.min)];

  while (months < 600 && bals.some((b) => b > 0.005)) {
    months++;
    const interestAcc = bals.map((b, i) => b * monthlyRates[i]);
    totalInterest += interestAcc.reduce((s, x) => s + x, 0);
    bals = bals.map((b, i) => b + interestAcc[i]);

    let cash = monthlyBudget;
    for (let i = 0; i < bals.length; i++) {
      if (bals[i] <= 0) continue;
      const pay = Math.min(minPay[i], bals[i], cash);
      bals[i] -= pay;
      cash -= pay;
    }
    if (cash < -0.01) return { months: 0, interest: 0, error: "Monthly payment is less than combined minimums." };

    if (strategy === "minimum_only") {
      continue;
    }

    while (cash > 0.005) {
      const idxs = bals.map((b, i) => ({ b, i })).filter((x) => x.b > 0.005);
      if (idxs.length === 0) break;
      let target = idxs[0].i;
      if (strategy === "snowball") {
        target = idxs.reduce((a, b) => (b.b < a.b ? b : a)).i;
      } else {
        target = idxs.reduce((a, b) => (active[b.i].apr > active[a.i].apr ? b : a)).i;
      }
      const pay = Math.min(cash, bals[target]);
      bals[target] -= pay;
      cash -= pay;
    }
  }

  if (months >= 600) return { months: 600, interest: totalInterest, error: "Not paid off within 600 months at this payment." };
  return { months, interest: totalInterest };
}

const CPC_SLUGS = new Set([
  "mortgage-payment-calculator",
  "auto-insurance-quote-estimator",
  "life-insurance-coverage-calculator",
  "personal-injury-settlement-calculator",
  "health-insurance-cost-estimator",
  "refinance-break-even-calculator",
  "workers-compensation-calculator",
  "credit-card-payoff-calculator",
  "dui-cost-calculator",
  "medical-malpractice-settlement-estimator",
  "business-loan-eligibility-calculator",
  "disability-insurance-calculator",
  "home-equity-loan-calculator",
  "w4-tax-withholding-calculator",
  "slip-and-fall-settlement-calculator",
  "truck-accident-settlement-calculator",
  "mesothelioma-compensation-estimator",
  "divorce-settlement-calculator",
  "va-disability-rating-calculator",
  "student-loan-forgiveness-calculator",
]);

export function computeCpcHighTools(slug: string, form: Record<string, string>): CpcToolResult | null {
  if (!CPC_SLUGS.has(slug)) return null;

  switch (slug) {
    case "mortgage-payment-calculator": {
      const errs = [
        requiredNumber(form.homePrice, "Home price"),
        requiredNumber(form.downPaymentPercent, "Down payment (%)"),
        requiredNumber(form.annualInterestRate, "Annual interest rate (%)"),
        requiredNumber(form.propertyTaxRateAnnual, "Property tax rate (% / year of value)"),
        requiredNumber(form.homeownersInsuranceAnnual, "Homeowner's insurance ($/year)"),
        requiredNumber(form.pmiAnnualRatePercent, "PMI rate (%/year on loan)"),
        requiredNumber(form.hoaMonthly, "HOA ($/month)"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const home = n(form.homePrice);
      const dpPct = n(form.downPaymentPercent);
      const years = Math.round(n(form.loanTermYears, 30));
      const rate = n(form.annualInterestRate);
      const taxPct = n(form.propertyTaxRateAnnual);
      const insY = n(form.homeownersInsuranceAnnual);
      const pmiPct = n(form.pmiAnnualRatePercent);
      const hoa = n(form.hoaMonthly);
      if (home <= 0 || dpPct < 0 || dpPct >= 100 || years < 1 || years > 40 || rate < 0 || taxPct < 0 || insY < 0 || pmiPct < 0 || hoa < 0) {
        return invalid("Check home price, down payment percent (0–100), term, and non-negative rates and fees.");
      }
      const principal = home * (1 - dpPct / 100);
      if (principal <= 0) return invalid("Loan amount must be positive.");
      const pi = monthlyPI(principal, rate, years);
      const nPay = years * 12;
      const monthlyTax = (home * (taxPct / 100)) / 12;
      const monthlyIns = insY / 12;
      const monthlyPmi = dpPct < 20 ? (principal * (pmiPct / 100)) / 12 : 0;
      const totalMo = pi + monthlyTax + monthlyIns + monthlyPmi + hoa;
      const intPaid = totalInterestPaidPI(pi, nPay, principal);
      const totalPaid = totalMo * nPay;
      return {
        title: "Estimated total monthly payment (PITI+)",
        value: moneyCents(totalMo),
        extra: [
          `Principal & interest: ${moneyCents(pi)}`,
          `Property tax: ${moneyCents(monthlyTax)}; Insurance: ${moneyCents(monthlyIns)}; PMI: ${moneyCents(monthlyPmi)}; HOA: ${moneyCents(hoa)}`,
          `Total interest on P&I (standard amortization): ${money(intPaid)}`,
          `Sum of all monthly payments × ${nPay} mo (incl. escrow): ${money(totalPaid)}`,
          "PMI applies when modeled down payment is under 20%. Escrow and PMI rules vary by loan.",
        ],
      };
    }

    case "auto-insurance-quote-estimator": {
      const st = (form.usState || "").trim().toUpperCase();
      const base = AUTO_INSURANCE_STATE_BASE_MONTHLY[st];
      if (!base) return invalid("Select a valid US state.");
      const age = n(form.driverAge);
      if (age < 16 || age > 90) return invalid("Enter driver age between 16 and 90.");
      const ageMult = age < 25 ? 1.8 : age > 65 ? 1.3 : 1.0;
      const rec = form.drivingRecord || "clean";
      const recMult: Record<string, number> = {
        clean: 1,
        minor: 1.25,
        multiple: 1.55,
        accident: 1.65,
        dui: 2.1,
      };
      const credit = form.creditTier || "good";
      const credMult: Record<string, number> = { excellent: 0.85, good: 1, fair: 1.25, poor: 1.45 };
      const vType = form.vehicleType || "sedan";
      const vMult: Record<string, number> = {
        sedan: 1,
        suv: 1.1,
        truck: 1.08,
        sports: 1.4,
        luxury: 1.35,
        minivan: 1.05,
        electric: 0.95,
      };
      const cov = form.coverageLevel || "standard";
      const covMult: Record<string, number> = { liability: 0.5, standard: 1, full: 1.4 };
      const mult = ageMult * (recMult[rec] ?? 1) * (credMult[credit] ?? 1) * (vMult[vType] ?? 1) * (covMult[cov] ?? 1);
      const monthly = base * mult * (form.currentInsurance === "yes" ? 0.92 : 1);
      const nationalAvg = 167;
      return {
        title: "Estimated monthly premium",
        value: moneyCents(monthly),
        extra: [
          `Annual estimate: ${money(monthly * 12)}`,
          `State baseline used: ${money(base)}/mo before risk multipliers`,
          `Illustrative national average reference: ~${money(nationalAvg)}/mo`,
          "Not a quote. Carriers use proprietary underwriting; this is a planning band only.",
        ],
      };
    }

    case "life-insurance-coverage-calculator": {
      const errs = [
        requiredNumber(form.annualIncome, "Annual income"),
        requiredNumber(form.yearsIncomeReplacement, "Years of income replacement"),
        requiredNumber(form.mortgageBalance, "Mortgage balance"),
        requiredNumber(form.otherDebts, "Other debts"),
        requiredNumber(form.finalExpenses, "Final expenses"),
        requiredNumber(form.educationPerChild, "Education fund per child"),
        requiredNumber(form.numChildren, "Number of children"),
        requiredNumber(form.existingSavings, "Existing savings/investments"),
        requiredNumber(form.existingLifeInsurance, "Existing life insurance"),
        requiredNumber(form.spouseIncomeAnnual, "Spouse annual income (0 if none)"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const income = n(form.annualIncome);
      const yrs = n(form.yearsIncomeReplacement);
      const mort = n(form.mortgageBalance);
      const debts = n(form.otherDebts);
      const finalE = n(form.finalExpenses);
      const eduEach = n(form.educationPerChild);
      const kids = Math.max(0, Math.round(n(form.numChildren)));
      const save = n(form.existingSavings);
      const existing = n(form.existingLifeInsurance);
      const spouse = n(form.spouseIncomeAnnual);
      if (income < 0 || yrs < 0 || mort < 0 || debts < 0 || finalE < 0 || eduEach < 0 || save < 0 || existing < 0 || spouse < 0) {
        return invalid("Use non-negative amounts where applicable.");
      }
      const debtNeeds = mort + debts + finalE;
      const incomeNeeds = income * yrs * 0.7;
      const eduNeeds = eduEach * kids;
      const gross = debtNeeds + incomeNeeds + eduNeeds;
      const offset = save + existing + spouse * yrs * 0.5;
      const net = Math.max(0, gross - offset);
      const age = Math.round(n(form.insuredAge, 35));
      const ageBracket = age < 30 ? 25 : age < 35 ? 30 : age < 40 ? 35 : age < 45 ? 40 : age < 50 ? 45 : age < 55 ? 50 : 55;
      const term500: Record<number, number> = { 25: 22, 30: 28, 35: 38, 40: 58, 45: 98, 50: 165, 55: 285 };
      const prem500 = term500[ageBracket] ?? 200;
      const estMo = (net / 500000) * prem500;
      return {
        title: "Suggested coverage (needs analysis sketch)",
        value: money(net),
        extra: [
          `Rough monthly term premium scale: ${moneyCents(estMo)}–${moneyCents(estMo * 1.4)} (varies widely by health and carrier)`,
          `Components: debts+final ${money(debtNeeds)}; income replacement ${money(incomeNeeds)}; education ${money(eduNeeds)}; offsets ${money(offset)}`,
          "Not insurance advice. Underwriting, riders, and estate planning need a licensed professional.",
        ],
      };
    }

    case "personal-injury-settlement-calculator": {
      const errs = [
        requiredNumber(form.medicalBills, "Medical bills"),
        requiredNumber(form.futureMedical, "Future medical estimate"),
        requiredNumber(form.lostWages, "Lost wages"),
        requiredNumber(form.futureLostEarnings, "Future lost earning capacity"),
        requiredNumber(form.atFaultOtherPercent, "Other party fault (%)"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const med = n(form.medicalBills);
      const futM = n(form.futureMedical);
      const lost = n(form.lostWages);
      const futE = n(form.futureLostEarnings);
      const fault = n(form.atFaultOtherPercent);
      if (fault < 0 || fault > 100) return invalid("Other party fault must be between 0 and 100%.");
      const sev = form.injurySeverity || "moderate";
      const sevM: Record<string, number> = { minor: 1.5, moderate: 3, severe: 5, catastrophic: 7 };
      const economic = med + futM + lost + futE;
      const pain = economic * (sevM[sev] ?? 3) * (form.permanentDisability === "yes" ? 1.5 : 1);
      const gross = economic + pain;
      const net = gross * (fault / 100);
      const low = net * 0.6;
      const high = net * 1.8;
      const afterAtty = net * 0.67;
      return {
        title: "Illustrative net range (after fault)",
        value: `${money(Math.round(low))} - ${money(Math.round(high))}`,
        extra: [
          `Midpoint estimate: ${money(Math.round(net))}; after ~33% fee line: ${money(Math.round(afterAtty))}`,
          `Economic damages subtotal: ${money(Math.round(economic))}`,
          "Not legal advice. Jurisdiction, caps, insurance limits, and facts change outcomes.",
        ],
      };
    }

    case "health-insurance-cost-estimator": {
      const st = (form.usState || "").trim().toUpperCase();
      const bench0 = ACA_SILVER_BENCHMARK_MONTHLY[st];
      if (!bench0) return invalid("Select a valid US state.");
      const age = n(form.personAge);
      const hh = Math.min(8, Math.max(1, Math.round(n(form.householdSize))));
      const inc = n(form.annualHouseholdIncome);
      if (age < 18 || age > 64 || inc < 0) return invalid("Age 18–64 and non-negative income required for this model.");
      const fpl = FPL_2025_ANNUAL[hh] ?? FPL_2025_ANNUAL[8];
      const fplRatio = (inc / fpl) * 100;
      const contribFrac = acaContributionFractionOfIncome(fplRatio);
      if (contribFrac === null) {
        return {
          title: "Subsidy band",
          value: "Medicaid expansion may apply",
          extra: [
            `Income is below ~100% FPL for a household of ${hh} in this simplified check.`,
            "Enrollment, immigration status, and state expansion rules matter-verify with a marketplace assister.",
          ],
        };
      }
      const ageFactor = 1 + Math.max(0, age - 40) * 0.012;
      const benchmark = bench0 * ageFactor * (form.tobacco === "yes" ? 1.15 : 1);
      const tier = form.coverageTier || "silver";
      const tierM: Record<string, number> = { bronze: 0.75, silver: 1, gold: 1.25, platinum: 1.45 };
      const grossPrem = benchmark * (tierM[tier] ?? 1);
      const expectedAnnual = inc * contribFrac;
      const subsidyMo = Math.max(0, benchmark - expectedAnnual / 12);
      const netMo = Math.max(0, grossPrem - subsidyMo);
      return {
        title: "Estimated net monthly premium",
        value: moneyCents(netMo),
        extra: [
          `Gross plan tier premium (modeled): ${moneyCents(grossPrem)}; modeled subsidy on benchmark: ${moneyCents(subsidyMo)}`,
          `Household at ~${fplRatio.toFixed(0)}% of ${new Date().getFullYear()} FPL (simplified).`,
          "ACA rules, CSR, family glitch, and exact SLCSP differ-use Healthcare.gov or state exchange for binding numbers.",
        ],
      };
    }

    case "refinance-break-even-calculator": {
      const errs = [
        requiredNumber(form.currentLoanBalance, "Current loan balance"),
        requiredNumber(form.currentAnnualRate, "Current annual rate (%)"),
        requiredNumber(form.remainingYears, "Remaining years"),
        requiredNumber(form.newAnnualRate, "New annual rate (%)"),
        requiredNumber(form.newLoanTermYears, "New loan term (years)"),
        requiredNumber(form.closingCosts, "Closing costs"),
        requiredNumber(form.cashOut, "Cash-out amount"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const bal = n(form.currentLoanBalance);
      const curR = n(form.currentAnnualRate);
      const remY = n(form.remainingYears);
      const newR = n(form.newAnnualRate);
      const newY = n(form.newLoanTermYears);
      const close = n(form.closingCosts);
      const cash = n(form.cashOut);
      if (bal <= 0 || remY <= 0 || newY <= 0 || close < 0 || cash < 0) return invalid("Balance and terms must be positive; costs non-negative.");
      const curPay = monthlyPI(bal, curR, remY);
      const newBal = bal + cash;
      const newPay = monthlyPI(newBal, newR, newY);
      const save = curPay - newPay;
      if (save <= 0) return invalid("New payment is not lower than current payment in this scenario.");
      const be = close / save;
      return {
        title: "Break-even (months)",
        value: `${be.toLocaleString("en-US", { maximumFractionDigits: 1 })} months`,
        extra: [
          `Monthly payment change: ${moneyCents(curPay)} → ${moneyCents(newPay)} (save ${moneyCents(save)}/mo)`,
          `Closing costs ${money(close)} recovered after ~${be.toFixed(1)} months of savings`,
          "Interest paid over full new term may exceed current loan if you reset amortization-compare total interest separately.",
        ],
      };
    }

    case "workers-compensation-calculator": {
      const st = (form.usState || "").trim().toUpperCase();
      const cap = WORKERS_COMP_TTD_WEEKLY_CAP[st];
      if (!cap) return invalid("Select a valid US state.");
      const errs = [requiredNumber(form.weeklyWage, "Weekly wage"), requiredNumber(form.weeksDisabled, "Weeks disabled")].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const wage = n(form.weeklyWage);
      const wks = n(form.weeksDisabled);
      const med = n(form.medicalBills);
      const disPct = n(form.disabilityRatingPercent);
      if (wage < 0 || wks < 0 || med < 0 || disPct < 0 || disPct > 100) return invalid("Invalid wage, weeks, medical, or disability percent.");
      const ttdWeekly = Math.min(wage * (2 / 3), cap);
      const ttd = ttdWeekly * wks;
      const ppdWeeks = (disPct / 100) * 200;
      const ppd = ttdWeekly * ppdWeeks;
      const low = ttd + ppd * 0.7 + med;
      const high = ttd + ppd * 1.3 + med + wage * 26 * 0.1;
      return {
        title: "Illustrative total benefit band",
        value: `${money(Math.round(low))} - ${money(Math.round(high))}`,
        extra: [
          `Modeled TTD (${wks} wks): ${money(Math.round(ttd))}; modeled PPD component: ${money(Math.round(ppd))}; medical entered: ${money(Math.round(med))}`,
          "Every state uses different schedules, IME rules, and MSA requirements-not legal advice.",
        ],
      };
    }

    case "credit-card-payoff-calculator": {
      const errs = [
        requiredNumber(form.balance1, "Card 1 balance"),
        requiredNumber(form.apr1, "Card 1 APR (%)"),
        requiredNumber(form.minPayment1, "Card 1 minimum ($/mo)"),
        requiredNumber(form.monthlyPaymentTotal, "Total monthly payment"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const c1 = { bal: n(form.balance1), apr: n(form.apr1), min: n(form.minPayment1) };
      const c2 = { bal: n(form.balance2, 0), apr: n(form.apr2, 0), min: n(form.minPayment2, 0) };
      const c3 = { bal: n(form.balance3, 0), apr: n(form.apr3, 0), min: n(form.minPayment3, 0) };
      const pay = n(form.monthlyPaymentTotal);
      const strategy = form.payoffStrategy || "avalanche";
      if (pay <= 0) return invalid("Enter a positive total monthly payment.");
      const cards = [c1, c2, c3].filter((c) => c.bal > 0);
      if (cards.length === 0) return invalid("Enter at least one card with a positive balance.");
      const sim = simulateCreditCards(cards, pay, strategy);
      if (sim.error) return invalid(sim.error);
      return {
        title: "Debt-free timeline",
        value: `${sim.months} months`,
        extra: [
          `Total interest paid (modeled): ${money(Math.round(sim.interest))}`,
          `Strategy: ${strategy.replace(/_/g, " ")} across up to three balances`,
          "Assumes fixed payment, no new charges, and minimums as entered.",
        ],
      };
    }

    case "dui-cost-calculator": {
      const st = (form.usState || "").trim().toUpperCase();
      const mid = DUI_STATE_COST_MIDPOINT[st];
      if (!mid) return invalid("Select a valid US state.");
      const priors = Math.min(5, Math.max(0, Math.round(n(form.priorDuiCount))));
      const mult = 1 + priors * 0.35;
      const susp = n(form.licenseSuspensionWeeks);
      const weekly = n(form.weeklySalary);
      const lost = susp > 0 && weekly > 0 ? susp * weekly : 0;
      const impound = form.vehicleImpounded === "yes" ? 450 + n(form.impoundDays) * 50 : 0;
      const total = mid * mult + lost + impound;
      return {
        title: "Illustrative total cost band",
        value: `${money(Math.round(total * 0.85))} - ${money(Math.round(total * 1.25))}`,
        extra: [
          `State midpoint before lost wages/impound: ${money(Math.round(mid * mult))}`,
          "Criminal defense, SR-22, and multi-year insurance changes are highly variable-not legal advice.",
        ],
      };
    }

    case "medical-malpractice-settlement-estimator": {
      const errs = [requiredNumber(form.medicalCosts, "Medical costs"), requiredNumber(form.lostWagesMalp, "Lost wages")].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const med = n(form.medicalCosts);
      const lost = n(form.lostWagesMalp);
      const sev = form.malpSeverity || "moderate";
      const m: Record<string, number> = { minor: 2, moderate: 4, severe: 6, catastrophic: 9 };
      const econ = med + lost;
      const non = econ * (m[sev] ?? 4) * (form.malpPermanentDisability === "yes" ? 1.4 : 1);
      const cap = form.stateDamageCap === "yes" ? 0.75 : 1;
      const net = (econ + non) * cap;
      return {
        title: "Modeled malpractice range",
        value: `${money(Math.round(net * 0.55))} - ${money(Math.round(net * 1.65))}`,
        extra: [
          `Economic subtotal: ${money(Math.round(econ))}; non-economic modeled: ${money(Math.round(non))}`,
          "Caps, MICRA, affidavits of merit, and carrier limits are not modeled in detail.",
        ],
      };
    }

    case "business-loan-eligibility-calculator": {
      const rev = n(form.annualRevenue);
      const yrs = n(form.yearsInBusiness);
      const score = n(form.creditScore);
      const amt = n(form.loanAmountRequested);
      const exp = n(form.monthlyExpenses);
      const errs = [
        requiredNumber(form.annualRevenue, "Annual revenue"),
        requiredNumber(form.yearsInBusiness, "Years in business"),
        requiredNumber(form.creditScore, "Credit score"),
        requiredNumber(form.loanAmountRequested, "Loan amount requested"),
        requiredNumber(form.monthlyExpenses, "Monthly expenses"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      if (rev < 0 || yrs < 0 || amt < 0 || exp < 0) return invalid("Use non-negative inputs.");
      const dscr = exp > 0 ? (rev / 12 - exp) / (monthlyPI(amt, 9, 5) || 1) : 10;
      const ok = yrs >= 2 && score >= 620 && rev >= amt * 0.5 && dscr >= 1.15;
      const estRate = score >= 720 ? 8.5 : score >= 660 ? 11.5 : 15.5;
      const pmt = monthlyPI(amt, estRate, 5);
      return {
        title: "Eligibility sketch",
        value: ok ? "Likely bankable (illustrative)" : "May be challenging (illustrative)",
        extra: [
          `Rough DSCR-style cushion vs modeled 5-yr term payment at ${estRate}%: ${dscr.toFixed(2)}`,
          `Illustrative 5-year term payment: ${moneyCents(pmt)}/mo`,
          "Lenders use tax returns, industry risk, and collateral-not this screen.",
        ],
      };
    }

    case "disability-insurance-calculator": {
      const errs = [requiredNumber(form.annualIncome, "Annual income"), requiredNumber(form.replacePercent, "Income replacement (%)")].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const inc = n(form.annualIncome);
      const pct = n(form.replacePercent);
      if (inc < 0 || pct <= 0 || pct > 100) return invalid("Income and replacement percent must be valid.");
      const monthlyBen = (inc * (pct / 100)) / 12;
      const prem = monthlyBen * 0.025;
      return {
        title: "Target monthly benefit",
        value: moneyCents(monthlyBen),
        extra: [
          `Crude premium order-of-magnitude: ${moneyCents(prem)}–${moneyCents(prem * 2)}/mo (varies by occupation & definition of disability)`,
          "Own-occupation vs any-occupation and elimination periods change quotes materially.",
        ],
      };
    }

    case "home-equity-loan-calculator": {
      const errs = [
        requiredNumber(form.homeValue, "Home value"),
        requiredNumber(form.mortgageBalance, "Mortgage balance"),
        requiredNumber(form.desiredLoanAmount, "Desired loan amount"),
        requiredNumber(form.helocAnnualRate, "Annual interest rate (%)"),
        requiredNumber(form.helocTermYears, "Term (years)"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const hv = n(form.homeValue);
      const mb = n(form.mortgageBalance);
      const want = n(form.desiredLoanAmount);
      const rate = n(form.helocAnnualRate);
      const term = n(form.helocTermYears);
      if (hv <= 0 || mb < 0 || want < 0 || term < 1) return invalid("Check home value, balance, and term.");
      const maxBorrow = Math.max(0, hv * 0.85 - mb);
      const approved = Math.min(want, maxBorrow);
      const pmt = monthlyPI(approved, rate, term);
      return {
        title: "Max modeled borrow vs request",
        value: `${money(Math.round(approved))} approved of ${money(Math.round(want))} requested`,
        extra: [
          `At ${rate}% over ${term} years, P&I ≈ ${moneyCents(pmt)}/mo`,
          "Combined LTV limits, second-lien pricing, and HELOC draws differ by lender.",
        ],
      };
    }

    case "w4-tax-withholding-calculator": {
      const errs = [requiredNumber(form.annualSalary, "Annual salary"), requiredNumber(form.dependentsCount, "Dependents (W-4 step 3)")].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const sal = n(form.annualSalary);
      const dep = Math.max(0, Math.round(n(form.dependentsCount)));
      const other = n(form.otherAnnualIncome);
      const status = form.filingStatus || "single";
      if (sal < 0 || other < 0) return invalid("Salary and other income must be non-negative.");
      const taxableEst = Math.max(0, sal + other - dep * 2000 - (status === "married" ? 29200 : 14600));
      const fed = taxableEst <= 0 ? 0 : taxableEst * (taxableEst > 200000 ? 0.32 : taxableEst > 100000 ? 0.24 : 0.22);
      const perPay = fed / (n(form.paychecksPerYear, 26) || 26);
      return {
        title: "Rough federal withholding / paycheck",
        value: moneyCents(perPay),
        extra: [
          `Modeled annual federal liability (very rough): ${money(Math.round(fed))}`,
          "Use IRS Tax Withholding Estimator and Form W-4; this is not tax advice.",
        ],
      };
    }

    case "slip-and-fall-settlement-calculator": {
      const errs = [requiredNumber(form.slipMedical, "Medical bills"), requiredNumber(form.slipLostWages, "Lost wages")].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const med = n(form.slipMedical);
      const lost = n(form.slipLostWages);
      const sev = form.slipSeverity || "moderate";
      const m: Record<string, number> = { minor: 1.2, moderate: 2.2, severe: 3.5, catastrophic: 5 };
      const econ = med + lost;
      const non = econ * (m[sev] ?? 2.2);
      const net = econ + non;
      return {
        title: "Premises liability sketch",
        value: `${money(Math.round(net * 0.5))} - ${money(Math.round(net * 1.5))}`,
        extra: [
          `Economic: ${money(Math.round(econ))}; modeled non-economic: ${money(Math.round(non))}`,
          "Notice, open-and-obvious defenses, and comparative fault are case-specific.",
        ],
      };
    }

    case "truck-accident-settlement-calculator": {
      const errs = [requiredNumber(form.truckEconomicDamages, "Economic damages")].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const econ = n(form.truckEconomicDamages);
      const mult = form.commercialPolicy === "yes" ? 3.5 : 2.2;
      const net = econ * mult;
      return {
        title: "Commercial truck case band",
        value: `${money(Math.round(net * 0.65))} - ${money(Math.round(net * 1.5))}`,
        extra: [
          `Economic baseline: ${money(Math.round(econ))}; carrier limit and FMCSA issues not priced here.`,
          "Not legal advice.",
        ],
      };
    }

    case "mesothelioma-compensation-estimator": {
      const errs = [requiredNumber(form.mesoMedicalCosts, "Medical costs (annual)")].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const med = n(form.mesoMedicalCosts);
      const yrs = n(form.exposureYears);
      const trust = 150000 + med * 3 + yrs * 8000;
      const suit = trust * 1.8;
      return {
        title: "Illustrative total compensation band",
        value: `${money(Math.round(trust))} - ${money(Math.round(suit))}`,
        extra: [
          `Trust fund sketch: ${money(Math.round(trust))}; lawsuit upper sketch: ${money(Math.round(suit))}`,
          ...(form.mesoVeteran === "yes"
            ? ["VA survivors or dependency benefits may add separate monthly awards-verify with a VSO."]
            : []),
          "Statutes of limitation and specialized asbestos counsel are critical-not legal advice.",
        ],
      };
    }

    case "divorce-settlement-calculator": {
      const errs = [
        requiredNumber(form.homeEquity, "Home net equity"),
        requiredNumber(form.retirementTotal, "Retirement balances"),
        requiredNumber(form.otherMaritalAssets, "Other marital assets"),
        requiredNumber(form.maritalDebts, "Marital debts"),
        requiredNumber(form.incomeSpouseA, "Annual income spouse A"),
        requiredNumber(form.incomeSpouseB, "Annual income spouse B"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const pool = n(form.homeEquity) + n(form.retirementTotal) + n(form.otherMaritalAssets) - n(form.maritalDebts);
      const share = pool / 2;
      const alim = Math.max(0, (n(form.incomeSpouseA) - n(form.incomeSpouseB)) * 0.15);
      return {
        title: "Equal-split marital pool (per side)",
        value: money(Math.round(share)),
        extra: [
          `Net marital pool modeled: ${money(Math.round(pool))}; rough annual alimony sketch (15% gap): ${money(Math.round(alim))}`,
          "Community property vs equitable distribution, separate property tracing, and child support are not modeled.",
        ],
      };
    }

    case "va-disability-rating-calculator": {
      const rs = [n(form.rating1), n(form.rating2), n(form.rating3), n(form.rating4), n(form.rating5)].filter((r) => r > 0);
      if (rs.length === 0) return invalid("Enter at least one disability rating greater than zero.");
      if (rs.some((r) => r > 100 || r < 0)) return invalid("Each rating must be between 0 and 100.");
      const combined = vaCombineSequential(rs);
      const pay = vaPayForCombined(combined);
      return {
        title: "Combined VA rating (sequential whole-person estimate)",
        value: `${combined}%`,
        extra: [
          `2025 monthly compensation (veteran alone, rounded bracket): ${moneyCents(pay)}/mo`,
          "Bilateral factors, SMC, dependents, and IU require VA math tables and official tools.",
        ],
      };
    }

    case "student-loan-forgiveness-calculator": {
      const errs = [
        requiredNumber(form.studentLoanBalance, "Loan balance"),
        requiredNumber(form.yearsQualifyingPayments, "Years of qualifying payments"),
      ].filter(Boolean);
      if (errs.length) return invalid(errs[0] as string);
      const bal = n(form.studentLoanBalance);
      const emp = form.employerType || "private";
      const yrs = n(form.yearsQualifyingPayments);
      const pslfOk = (emp === "government" || emp === "nonprofit") && yrs >= 10;
      const idrY = bal > 40000 ? 240 : 300;
      return {
        title: "Program sketch",
        value: pslfOk ? "PSLF may be in range (illustrative)" : "Consider IDR forgiveness timeline",
        extra: [
          `PSLF needs 120 qualifying payments in eligible employment-entered ~${yrs} years.`,
          `Illustrative IDR forgiveness horizon: ~${idrY} months of payments in many plans (varies).`,
          "Loan type, consolidation, and waiver rules matter-verify with StudentAid.gov.",
        ],
      };
    }

    default:
      return null;
  }
}
