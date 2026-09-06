import type { ToolDefinition } from "./types";

export type ToolBenchmark = {
  /** Short answer-first fact with a cited official source when possible. */
  fact: string;
  sourceLabel: string;
  sourceHref: string;
  limitation: string;
};

/**
 * Original comparison / benchmark callouts for high-intent tools.
 * Only verified public figures or clearly labeled illustrative ranges — never invented stats.
 */
const BENCHMARKS: Record<string, ToolBenchmark> = {
  "vat-calculator": {
    fact: "The UK standard VAT rate is 20%, with reduced (5%) and zero-rated categories for specific goods and services.",
    sourceLabel: "GOV.UK — VAT rates",
    sourceHref: "https://www.gov.uk/vat-rates",
    limitation: "Always confirm the rate that applies to your supply; this calculator does not classify goods for you.",
  },
  "salary-after-tax-calculator": {
    fact: "This page estimates net pay as gross × (1 − a single tax rate). Progressive systems (UK bands + NI, US federal + FICA + state) need the dedicated country tools.",
    sourceLabel: "Toollabz methodology",
    sourceHref: "/methodology",
    limitation: "A flat rate is a planning shortcut. Pensions, student loans, and benefits are not modeled here.",
  },
  "rental-yield-calculator-uk": {
    fact: "Gross rental yield annualises rent and divides by purchase price. Net yield subtracts recurring property costs before the same division. The two percentages are not interchangeable.",
    sourceLabel: "Toollabz methodology",
    sourceHref: "/methodology",
    limitation: "This page does not apply UK income tax, Section 24 finance-cost restriction, or mortgage interest.",
  },
  "loan-calculator": {
    fact: "Amortizing installment loans use a fixed payment formula based on principal, periodic rate, and number of periods.",
    sourceLabel: "CFPB — Understanding loan costs",
    sourceHref: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-fixed-rate-and-adjustable-rate-loan-en-103/",
    limitation: "APR quotes may include fees; compare APR and total cost, not only the monthly payment.",
  },
  "bmi-calculator": {
    fact: "Adult BMI is weight(kg) ÷ height(m)²; NHS and CDC publish adult category bands for screening, not diagnosis.",
    sourceLabel: "NHS — BMI calculator",
    sourceHref: "https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/",
    limitation: "BMI does not measure body fat or muscle; children need age/sex percentiles.",
  },
  "compound-interest-calculator": {
    fact: "Compound interest grows a balance as A = P(1 + r/n)^(nt); more frequent compounding increases the terminal value for the same nominal rate.",
    sourceLabel: "Federal Reserve education (compound interest concept)",
    sourceHref: "https://www.federalreserve.gov/faqs/economy_14400.htm",
    limitation: "Projections ignore fees, taxes, and rate changes unless you model them.",
  },
  "profit-margin-calculator": {
    fact: "Gross margin = (revenue − COGS) ÷ revenue; markup = (revenue − COGS) ÷ COGS — the same profit dollars produce different percentages.",
    sourceLabel: "SBA — Pricing & financials guidance",
    sourceHref: "https://www.sba.gov/business-guide/manage-your-business/manage-your-finances",
    limitation: "Exclude VAT inconsistently and margin comparisons become meaningless.",
  },
  "roi-calculator": {
    fact: "ROI = (net gain ÷ cost) × 100. Marketing ROAS uses revenue ÷ ad spend and answers a different question.",
    sourceLabel: "Investopedia — ROI overview (educational)",
    sourceHref: "https://www.investopedia.com/terms/r/returnoninvestment.asp",
    limitation: "Agree on cost and gain definitions before comparing projects.",
  },
  "paycheck-calculator-usa": {
    fact: "US employee paychecks typically withhold federal income tax, Social Security (6.2% employee), and Medicare (1.45%), plus any state/local tax.",
    sourceLabel: "IRS — Tax withholding",
    sourceHref: "https://www.irs.gov/individuals/employees/tax-withholding",
    limitation: "State rules and pre-tax benefits change taxable wages; confirm with payroll.",
  },
  "currency-converter": {
    fact: "Mid-market FX rates differ from bank/card rates because providers add spreads and sometimes fixed fees.",
    sourceLabel: "Bank of England — Exchange rates",
    sourceHref: "https://www.bankofengland.co.uk/statistics/exchange-rates",
    limitation: "Always check the rate your payment provider will actually charge.",
  },
  "tip-calculator": {
    fact: "UK tipping customs differ from the US: many UK restaurants include or suggest discretionary service; US full-service restaurants often expect ~15–20%+ when service is not included.",
    sourceLabel: "VisitBritain / traveler tipping guidance (contextual)",
    sourceHref: "https://www.visitbritain.com/en/plan-your-trip/money/tipping-uk",
    limitation: "Always read the bill for service charge before adding more.",
  },
};

export function getToolBenchmark(tool: ToolDefinition): ToolBenchmark | null {
  return BENCHMARKS[tool.slug] ?? null;
}
