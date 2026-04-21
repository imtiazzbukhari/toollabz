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
};
