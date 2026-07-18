export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  relatedTools: string[];
  relatedGuides?: string[];
};

/** Core finance / utility entities for topical clusters + AI definitions. */
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "apr",
    term: "APR (Annual Percentage Rate)",
    definition:
      "The yearly cost of borrowing expressed as a percentage, including interest and certain fees depending on jurisdiction. Loan calculators usually take APR as an annual rate and convert it to a monthly rate internally.",
    relatedTools: ["loan-calculator", "mortgage-payment-calculator", "emi-calculator"],
    relatedGuides: ["loan-calculator-how-banks-calculate-your-emi"],
  },
  {
    slug: "amortization",
    term: "Amortization",
    definition:
      "The process of paying off a loan with level payments that cover interest first and gradually reduce principal. Early payments are interest-heavy; later payments are principal-heavy.",
    relatedTools: ["loan-calculator", "mortgage-payment-calculator"],
  },
  {
    slug: "vat",
    term: "VAT (Value Added Tax)",
    definition:
      "A consumption tax charged on most goods and services in the UK and many other countries. Standard UK VAT is commonly 20%; reverse VAT divides a gross price by 1.20 to find net.",
    relatedTools: ["vat-calculator"],
    relatedGuides: ["vat-calculator-guide-small-businesses"],
  },
  {
    slug: "profit-margin",
    term: "Profit margin",
    definition:
      "Profit divided by revenue (selling price), expressed as a percentage. Distinct from markup, which divides profit by cost.",
    relatedTools: ["profit-margin-calculator", "break-even-calculator"],
    relatedGuides: ["margin-vs-percentage-difference"],
  },
  {
    slug: "roi",
    term: "ROI (Return on Investment)",
    definition:
      "Net gain divided by cost, usually × 100 for a percentage. Marketing teams sometimes confuse ROI with ROAS (revenue ÷ ad spend).",
    relatedTools: ["roi-calculator", "break-even-calculator"],
  },
  {
    slug: "bmi",
    term: "BMI (Body Mass Index)",
    definition:
      "Weight in kilograms divided by height in metres squared. Used as an adult screening measure; not a complete health assessment and not appropriate alone for children.",
    relatedTools: ["bmi-calculator", "bmi-for-children-calculator"],
  },
  {
    slug: "compound-interest",
    term: "Compound interest",
    definition:
      "Interest calculated on principal plus previously credited interest. Frequency (daily, monthly, annual) changes the final balance for the same nominal rate.",
    relatedTools: ["compound-interest-calculator"],
  },
  {
    slug: "take-home-pay",
    term: "Take-home pay",
    definition:
      "Gross salary minus income tax, National Insurance (or Social Security/Medicare), pensions, student loans, and other deductions. Progressive tax bands mean a single flat rate is often wrong.",
    relatedTools: ["salary-after-tax-calculator", "paycheck-calculator-usa"],
    relatedGuides: ["salary-after-tax-explained-withholdings-deductions-net-pay"],
  },
  {
    slug: "net-worth",
    term: "Net worth",
    definition: "Total assets minus total liabilities at a point in time. Include property, investments, cash, and all debts for a complete snapshot.",
    relatedTools: ["net-worth-calculator"],
  },
  {
    slug: "break-even",
    term: "Break-even point",
    definition:
      "The sales volume where contribution margin covers fixed costs: units = fixed costs ÷ (price − variable cost per unit).",
    relatedTools: ["break-even-calculator", "profit-margin-calculator"],
  },
  {
    slug: "markup",
    term: "Markup",
    definition:
      "Profit divided by cost (not revenue). A 50% markup on a £10 cost is a £15 selling price; that is a 33.3% profit margin.",
    relatedTools: ["profit-margin-calculator", "markup-calculator"],
    relatedGuides: ["margin-vs-percentage-difference"],
  },
  {
    slug: "emi",
    term: "EMI (Equated Monthly Installment)",
    definition:
      "A fixed monthly loan payment covering interest and principal, usually computed from the standard amortization formula used by banks for personal and home loans.",
    relatedTools: ["emi-calculator", "loan-calculator", "mortgage-payment-calculator"],
    relatedGuides: ["loan-calculator-how-banks-calculate-your-emi"],
  },
  {
    slug: "personal-allowance",
    term: "Personal Allowance (UK)",
    definition:
      "The amount of income you can earn each tax year before paying Income Tax in the UK. Above a high-income threshold the allowance is tapered. Always confirm the current year figure on GOV.UK.",
    relatedTools: ["salary-after-tax-calculator", "salary-after-tax-calculator-uk"],
    relatedGuides: ["salary-after-tax-explained-withholdings-deductions-net-pay"],
  },
  {
    slug: "national-insurance",
    term: "National Insurance (UK)",
    definition:
      "UK contributions on earnings that fund state benefits. Employee and employer rates and thresholds differ from Income Tax bands, so take-home calculators must model NI separately.",
    relatedTools: ["salary-after-tax-calculator", "salary-after-tax-calculator-uk"],
  },
  {
    slug: "simple-interest",
    term: "Simple interest",
    definition:
      "Interest calculated only on the original principal: I = P × r × t. Unlike compound interest, prior interest is not added to the base.",
    relatedTools: ["compound-interest-calculator", "loan-calculator"],
  },
  {
    slug: "cagr",
    term: "CAGR (Compound Annual Growth Rate)",
    definition:
      "The constant annual rate that takes a starting value to an ending value over n years: (end/start)^(1/n) − 1. Useful for comparing investments with different paths.",
    relatedTools: ["compound-interest-calculator", "retirement-calculator"],
  },
  {
    slug: "tipping",
    term: "Tipping / gratuity",
    definition:
      "A discretionary amount added for service. Customs vary by country; some bills already include a service charge. Always check the receipt before adding more.",
    relatedTools: ["tip-calculator", "percentage-calculator"],
  },
  {
    slug: "percentage-change",
    term: "Percentage change",
    definition:
      "How much a value moved relative to a baseline: ((new − old) ÷ old) × 100. Distinct from percentage points, which measure absolute differences between percentages.",
    relatedTools: ["percentage-calculator", "discount-calculator"],
  },
  {
    slug: "mortgage-ltv",
    term: "Loan-to-value (LTV)",
    definition:
      "Loan amount divided by property value. Higher LTV usually means tighter underwriting and sometimes higher rates or fees.",
    relatedTools: ["mortgage-payment-calculator", "loan-calculator", "mortgage-affordability-calculator"],
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}

/** Glossary terms that list this tool slug in relatedTools (for topical clusters). */
export function getGlossaryTermsForTool(toolSlug: string): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter((t) => t.relatedTools.includes(toolSlug)).slice(0, 4);
}
