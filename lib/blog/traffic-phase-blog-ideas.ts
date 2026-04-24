/**
 * Editorial backlog: high-intent posts for organic + topical authority (not auto-published).
 */
export type TrafficBlogIdea = {
  slugSuggestion: string;
  title: string;
  targetKeyword: string;
  linkTools: readonly string[];
  angle: string;
};

export const TRAFFIC_PHASE_BLOG_IDEAS: readonly TrafficBlogIdea[] = [
  {
    slugSuggestion: "how-to-read-a-loan-amortization-schedule",
    title: "How to read a loan amortization schedule (without drowning in rows)",
    targetKeyword: "loan amortization schedule explained",
    linkTools: ["loan-calculator", "early-loan-payoff-calculator"],
    angle: "how to",
  },
  {
    slugSuggestion: "best-tools-for-paycheck-planning-usa",
    title: "Best free tools for paycheck planning in the USA (and what each one is for)",
    targetKeyword: "best tools for paycheck planning",
    linkTools: ["paycheck-calculator-usa", "budget-planner-monthly-usa"],
    angle: "best tools for",
  },
  {
    slugSuggestion: "emi-calculator-explained-for-first-time-borrowers",
    title: "EMI calculator explained for first-time borrowers",
    targetKeyword: "EMI calculator explained",
    linkTools: ["emi-calculator", "loan-calculator"],
    angle: "calculator explained",
  },
  {
    slugSuggestion: "how-to-estimate-take-home-pay-from-gross-salary",
    title: "How to estimate take-home pay from gross salary (fast sanity check)",
    targetKeyword: "how to estimate take home pay from gross",
    linkTools: ["salary-after-tax-calculator", "paycheck-calculator-usa"],
    angle: "how to",
  },
  {
    slugSuggestion: "compound-interest-calculator-explained-monthly-vs-annual",
    title: "Compound interest calculator explained: monthly vs annual compounding",
    targetKeyword: "compound interest calculator explained",
    linkTools: ["compound-interest-calculator", "savings-interest-calculator-usa"],
    angle: "calculator explained",
  },
  {
    slugSuggestion: "how-to-calculate-mortgage-payment-with-taxes-and-insurance",
    title: "How to calculate mortgage payment with taxes and insurance (PITI mindset)",
    targetKeyword: "how to calculate mortgage payment with taxes and insurance",
    linkTools: ["mortgage-payment-calculator", "mortgage-affordability-calculator-usa"],
    angle: "how to",
  },
  {
    slugSuggestion: "refinance-break-even-calculator-explained",
    title: "Refinance break-even calculator explained: when the math actually matters",
    targetKeyword: "refinance break even calculator explained",
    linkTools: ["refinance-break-even-calculator", "mortgage-payment-calculator"],
    angle: "calculator explained",
  },
  {
    slugSuggestion: "best-tools-for-credit-card-debt-planning",
    title: "Best tools for credit card debt planning (avalanche, snowball, reality checks)",
    targetKeyword: "best tools for credit card debt",
    linkTools: ["credit-card-payoff-calculator", "credit-card-interest-calculator"],
    angle: "best tools for",
  },
  {
    slugSuggestion: "how-to-compare-rent-vs-buy-without-hype",
    title: "How to compare rent vs buy without hype (cash flow first)",
    targetKeyword: "how to compare rent vs buy",
    linkTools: ["rent-vs-buy-calculator-usa", "mortgage-affordability-calculator-usa"],
    angle: "how to",
  },
  {
    slugSuggestion: "roi-calculator-explained-for-marketing-campaigns",
    title: "ROI calculator explained for marketing campaigns (net vs gross)",
    targetKeyword: "ROI calculator explained marketing",
    linkTools: ["roi-calculator-marketing", "roi-calculator"],
    angle: "calculator explained",
  },
  {
    slugSuggestion: "how-to-build-a-one-page-personal-finance-checklist",
    title: "How to build a one-page personal finance checklist you will actually use",
    targetKeyword: "personal finance checklist",
    linkTools: ["net-worth-calculator", "emergency-fund-calculator"],
    angle: "how to",
  },
  {
    slugSuggestion: "best-tools-for-freelancer-tax-planning",
    title: "Best tools for freelancer tax planning (estimates, not fear)",
    targetKeyword: "best tools for freelancer taxes",
    linkTools: ["freelance-rate-calculator", "budget-planner-monthly-usa"],
    angle: "best tools for",
  },
  {
    slugSuggestion: "salary-negotiation-calculator-explained",
    title: "Salary negotiation calculator mindset: gross vs net and pay frequency",
    targetKeyword: "salary negotiation calculator explained",
    linkTools: ["salary-after-tax-calculator", "hourly-to-salary-converter-usa"],
    angle: "calculator explained",
  },
  {
    slugSuggestion: "how-to-use-debt-payoff-calculators-without-shame-spirals",
    title: "How to use debt payoff calculators without shame spirals",
    targetKeyword: "how to use debt payoff calculator",
    linkTools: ["debt-payoff-calculator-avalanche", "credit-card-payoff-calculator"],
    angle: "how to",
  },
  {
    slugSuggestion: "best-tools-for-small-business-pricing-decisions",
    title: "Best tools for small business pricing decisions (margin, break-even, ROI)",
    targetKeyword: "best tools for small business pricing",
    linkTools: ["profit-margin-calculator-business", "break-even-calculator-business", "roi-calculator"],
    angle: "best tools for",
  },
];
