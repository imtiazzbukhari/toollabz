import type { ToolDefinition } from "./types";

export type SourceRef = { label: string; href: string; note?: string };

/** Claim-level citations for high-intent tools (preferred over category boilerplate). */
const TOOL_SOURCES: Record<string, SourceRef[]> = {
  "vat-calculator": [
    { label: "GOV.UK — VAT rates", href: "https://www.gov.uk/vat-rates" },
    { label: "HMRC — VAT", href: "https://www.gov.uk/topic/business-tax/vat" },
  ],
  "salary-after-tax-calculator": [
    { label: "GOV.UK — Income Tax rates", href: "https://www.gov.uk/income-tax-rates" },
    { label: "GOV.UK — National Insurance rates", href: "https://www.gov.uk/national-insurance-rates" },
  ],
  "salary-after-tax-calculator-uk": [
    { label: "GOV.UK — Income Tax rates", href: "https://www.gov.uk/income-tax-rates" },
    { label: "GOV.UK — National Insurance rates", href: "https://www.gov.uk/national-insurance-rates" },
  ],
  "loan-calculator": [
    {
      label: "CFPB — Understanding loan costs",
      href: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-fixed-rate-and-adjustable-rate-loan-en-103/",
    },
  ],
  "mortgage-payment-calculator": [
    { label: "CFPB — Owning a home", href: "https://www.consumerfinance.gov/owning-a-home/" },
  ],
  "bmi-calculator": [
    { label: "NHS — BMI calculator", href: "https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/" },
    { label: "CDC — About Adult BMI", href: "https://www.cdc.gov/bmi/about/index.html" },
  ],
  "paycheck-calculator-usa": [
    { label: "IRS — Tax withholding", href: "https://www.irs.gov/individuals/employees/tax-withholding" },
    { label: "SSA — Social Security contribution rates", href: "https://www.ssa.gov/oact/cola/cbb.html" },
  ],
  "compound-interest-calculator": [
    {
      label: "Federal Reserve — compound interest FAQ context",
      href: "https://www.federalreserve.gov/faqs/economy_14400.htm",
    },
  ],
  "currency-converter": [
    { label: "Bank of England — Exchange rates", href: "https://www.bankofengland.co.uk/statistics/exchange-rates" },
  ],
};

/** Official / primary references by category (cited on tool pages + methodology). */
export function getCategorySources(tool: ToolDefinition): SourceRef[] {
  const base: SourceRef[] = [
    {
      label: "Toollabz methodology",
      href: "/methodology",
      note: "How we document formulas and update pages",
    },
  ];

  const specific = TOOL_SOURCES[tool.slug];
  if (specific?.length) {
    return [...base, ...specific];
  }

  switch (tool.category) {
    case "finance":
      return [
        ...base,
        { label: "HMRC — Income Tax rates and Personal Allowances", href: "https://www.gov.uk/income-tax-rates" },
        { label: "HMRC — National Insurance", href: "https://www.gov.uk/national-insurance-rates" },
        { label: "IRS — Tax topics (US)", href: "https://www.irs.gov/taxtopics" },
        { label: "Consumer Financial Protection Bureau", href: "https://www.consumerfinance.gov/" },
        { label: "Bank of England — Bank Rate", href: "https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate" },
      ];
    case "real-estate":
      return [
        ...base,
        { label: "CFPB — Buying a house", href: "https://www.consumerfinance.gov/owning-a-home/" },
        { label: "UK Land Registry guidance", href: "https://www.gov.uk/government/organisations/land-registry" },
      ];
    case "business":
      return [
        ...base,
        { label: "Companies House (UK)", href: "https://www.gov.uk/government/organisations/companies-house" },
        { label: "SBA — Business guide (US)", href: "https://www.sba.gov/business-guide" },
      ];
    case "calculators":
    case "utility":
    case "converters":
      if (tool.slug.includes("bmi")) {
        return [
          ...base,
          { label: "NHS — BMI healthy weight calculator", href: "https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/" },
          { label: "CDC — About Adult BMI", href: "https://www.cdc.gov/bmi/about/index.html" },
        ];
      }
      return [
        ...base,
        { label: "NIST — SI units", href: "https://www.nist.gov/pml/owm/metric-si/si-units" },
      ];
    case "developer":
      return [
        ...base,
        { label: "MDN Web Docs", href: "https://developer.mozilla.org/" },
        { label: "IETF RFCs", href: "https://www.rfc-editor.org/" },
      ];
    case "pdf":
      return [
        ...base,
        { label: "ISO 32000 (PDF)", href: "https://www.iso.org/standard/75839.html" },
      ];
    default:
      return base;
  }
}

export function getReviewerForTool(tool: ToolDefinition): { name: string; role: string; profileHref: string } {
  if (tool.category === "finance" || tool.category === "real-estate") {
    return { name: "Toollabz Editorial", role: "Finance & tools editor", profileHref: "/team/editorial" };
  }
  if (tool.category === "developer" || tool.category === "pdf") {
    return { name: "Imtiaz Ahmad", role: "Founder & lead engineer", profileHref: "/team/imtiaz-ahmad" };
  }
  return { name: "Toollabz Editorial", role: "Product editor", profileHref: "/team/editorial" };
}
