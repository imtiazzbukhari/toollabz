/**
 * Curated “Popular tools” for homepage and /tools directory.
 * High-intent finance + business + AI + PDF; max 16 cards (homepage CTR + internal linking).
 */
export const POPULAR_TOOL_SLUGS = [
  "salary-after-tax-calculator",
  "loan-calculator",
  "vat-calculator",
  "paycheck-calculator-usa",
  "net-worth-calculator",
  "retirement-age-calculator",
  "roi-calculator",
  "break-even-calculator",
  "profit-margin-calculator",
  "saas-valuation-calculator",
  "pdf-merge",
  "pdf-compress",
  "ai-content-humanizer",
  "ai-resume-summary-generator",
  "ai-linkedin-post-generator",
  "ai-prompt-optimizer",
] as const satisfies readonly string[];

/** Extra high-authority slugs for homepage internal linking (deduped with popular). */
const HOMEPAGE_AUTHORITY_EXTRA = [
  "emi-calculator",
  "mortgage-affordability-calculator",
  "compound-interest-calculator",
  "currency-converter",
  "json-validator",
  "markup-calculator",
  "tip-calculator-split-bill",
  "credit-card-payoff-calculator",
  "budget-planner-monthly-usa",
  "invoice-generator",
] as const satisfies readonly string[];

export const HOMEPAGE_AUTHORITY_SLUGS: readonly string[] = [
  ...new Set<string>([...POPULAR_TOOL_SLUGS, ...HOMEPAGE_AUTHORITY_EXTRA]),
];
