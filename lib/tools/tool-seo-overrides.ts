/**
 * Per-tool SERP overrides (title + meta description). Keeps data.ts stable while tuning CTR and intent.
 * Descriptions target ≤155 chars where possible for snippets.
 */
export const TOOL_SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  "mortgage-payment-calculator": {
    title: "Mortgage Payment Calculator (USA) — PITI, PMI & HOA | Toollabz",
    description:
      "Free US mortgage payment calculator: P&I, property tax, insurance, PMI when down <20%, HOA. Model real monthly cash before you rate-shop.",
  },
  "refinance-break-even-calculator": {
    title: "Refinance Break-Even Calculator (USA) | Toollabz",
    description:
      "See if refinancing pays off: monthly P&I savings vs closing costs, optional cash-out, new term. USA-focused break-even months, free.",
  },
  "credit-card-payoff-calculator": {
    title: "Credit Card Payoff Calculator (USA) | Toollabz",
    description:
      "Pay down up to 3 cards: avalanche, snowball, or minimums. Month-by-month interest and months-to-debt-free—free, no signup.",
  },
  "personal-injury-settlement-calculator": {
    title: "Personal Injury Settlement Estimator (USA) | Toollabz",
    description:
      "Rough band from medical bills, lost wages, severity, and fault %. Not legal advice—planning math only. Free Toollabz estimator.",
  },
  "medical-malpractice-settlement-estimator": {
    title: "Medical Malpractice Settlement Estimator (USA) | Toollabz",
    description:
      "Illustrative economic + non-economic band from costs, wages, severity. Caps simplified. Not legal advice—free calculator.",
  },
  "business-loan-eligibility-calculator": {
    title: "Business Loan Eligibility Calculator (USA) | Toollabz",
    description:
      "Quick read on tenure, credit, revenue vs ask, rough DSCR vs a 5-yr payment. Not a lender decision—free planning tool.",
  },
  "home-equity-loan-calculator": {
    title: "Home Equity Loan Calculator (USA) | Toollabz",
    description:
      "How much you might borrow at 85% combined LTV minus your mortgage, plus amortized payment. Free second-lien math sketch.",
  },
  "student-loan-forgiveness-calculator": {
    title: "Student Loan Forgiveness Calculator (USA) | Toollabz",
    description:
      "PSLF-style check vs long IDR horizon from employer type and payment years. Not Federal Student Aid—free orientation tool.",
  },
  "loan-calculator": {
    title: "Loan Calculator — Monthly Payment & Total Interest (Free) | Toollabz",
    description:
      "Model principal, APR, and term in one place. See monthly payment and total interest before you sign—free, HTTPS, no account.",
  },
  "salary-after-tax-calculator": {
    title: "Salary After Tax Calculator — Net Pay From Gross (Free) | Toollabz",
    description:
      "Turn gross salary into estimated take-home using your own effective rate. Great for offer comparisons—free, private, fast.",
  },
  "emi-calculator": {
    title: "EMI Calculator — Home, Auto & Personal Loan EMI (Free) | Toollabz",
    description:
      "Same EMI math lenders quote: principal, rate, tenure → installment + total outflow. Compare tenures without spreadsheet fatigue.",
  },
  "compound-interest-calculator": {
    title: "Compound Interest Calculator — Future Value, Your Rules (Free) | Toollabz",
    description:
      "See how compounding frequency changes outcomes. Plug principal, rate, years—ideal for savings and “what if I wait?” scenarios.",
  },
  "paycheck-calculator-usa": {
    title: "Paycheck Calculator USA — Biweekly & Weekly Net Pay (Free) | Toollabz",
    description:
      "Calculate gross-to-net paycheck estimate using annual salary, pay frequency, and tax assumptions. Per-paycheck net—free, HTTPS, no signup.",
  },
  "rent-vs-buy-calculator-usa": {
    title: "Rent vs Buy Calculator USA — 7-Year Cash-Outflow View (Free) | Toollabz",
    description:
      "Estimate long-term housing cost difference between renting and buying for USA scenarios. Model rent growth vs buy cash—free, no signup.",
  },
  "roi-calculator": {
    title: "ROI Calculator — Gain, Cost & True Return % (Free) | Toollabz",
    description:
      "Simple ROI for campaigns, gear, or side projects: net gain ÷ cost, in plain English. Pair with margin tools for fuller picture.",
  },
};
