/**
 * Single source of truth for which URL families are indexable, consolidated or excluded.
 *
 * Everything here is data-only (no imports from lib/tools/data) so it can be consumed by
 * next.config.ts, middleware, sitemaps, page metadata and tests without circular imports.
 * Every decision is reversible: delete a slug from the list and the URL returns to the index.
 *
 * Sources: Toollabz forensic SEO audit findings C-02, C-03, H-01, H-02, H-06, H-07, H-10.
 */

/* -------------------------------------------------------------------------- */
/* Tool consolidation (H-02): 301 the weaker duplicate to the stronger keeper  */
/* -------------------------------------------------------------------------- */

/**
 * Only pairs where the keeper offers the same inputs (or a superset) are consolidated, so no
 * calculation capability is lost. Pairs that differ in inputs/intent are intentionally kept
 * separate (see PR description) until Search Console data can arbitrate.
 */
export const CONSOLIDATED_TOOLS: Readonly<Record<string, string>> = {
  "profit-margin-calculator-business": "profit-margin-calculator",
  "break-even-calculator-business": "break-even-calculator",
  "cac-calculator": "cac-calculator-saas",
  "ltv-calculator": "ltv-calculator-saas",
  "refinance-calculator-mortgage": "mortgage-refinance-calculator",
  "roi-calculator-marketing": "roi-calculator",
  "crypto-tax-calculator": "crypto-capital-gains-tax-calculator",
  "crypto-tax-calculator-basic": "crypto-capital-gains-tax-calculator",
  "tip-calculator-split-bill": "tip-calculator",
  "api-response-formatter": "json-formatter",
  "rental-yield-calculator": "rental-yield-calculator-uk",
  "salary-after-tax-calculator-california": "paycheck-calculator-california",
  "salary-after-tax-calculator-texas": "paycheck-calculator-texas",
};

export function consolidatedToolTarget(slug: string): string | null {
  return CONSOLIDATED_TOOLS[slug] ?? null;
}

/* -------------------------------------------------------------------------- */
/* High-risk YMYL estimators (C-03): reachable, noindex,follow, unlisted      */
/* -------------------------------------------------------------------------- */

/**
 * Legal-outcome, insurance, benefits and medical/mental-health estimators. The site cannot
 * demonstrate the expertise or sourced rate tables Google expects for these topics, so the
 * pages stay available to people who have a link but are removed from the index, sitemaps,
 * hubs, related-tool blocks and directory listings.
 *
 * Deliberately NOT included: deterministic finance maths (mortgage payment, credit card payoff,
 * refinance break-even, W-4 withholding, home-equity loan, business-loan eligibility, notice
 * period, severance) and legal document generators.
 */
export const YMYL_NOINDEX_TOOLS: ReadonlySet<string> = new Set([
  // Legal outcomes / compensation
  "accident-compensation-calculator",
  "settlement-calculator",
  "legal-fee-estimator",
  "personal-injury-settlement-calculator",
  "workers-compensation-calculator",
  "dui-cost-calculator",
  "medical-malpractice-settlement-estimator",
  "slip-and-fall-settlement-calculator",
  "truck-accident-settlement-calculator",
  "mesothelioma-compensation-estimator",
  "divorce-settlement-calculator",
  "child-support-calculator",
  "alimony-estimator",
  "small-claims-court-calculator",
  // Insurance
  "auto-insurance-quote-estimator",
  "life-insurance-coverage-calculator",
  "health-insurance-cost-estimator",
  "disability-insurance-calculator",
  "business-insurance-calculator",
  // Benefits
  "va-disability-rating-calculator",
  "student-loan-forgiveness-calculator",
  // Medical / mental-health screening
  "medication-dosage-calculator",
  "anxiety-level-self-assessment",
  "burnout-score-calculator",
  "stress-score-quiz",
  "sleep-quality-score-calculator",
  "due-date-calculator",
]);

export function isYmylNoindexTool(slug: string): boolean {
  return YMYL_NOINDEX_TOOLS.has(slug);
}

/** True when a tool URL should be indexed, listed in hubs/sitemaps and linked as "related". */
export function isToolIndexable(slug: string): boolean {
  return !YMYL_NOINDEX_TOOLS.has(slug) && !(slug in CONSOLIDATED_TOOLS);
}

/* -------------------------------------------------------------------------- */
/* Hub consolidation (H-01): /category/* duplicated the /*-tools hubs         */
/* -------------------------------------------------------------------------- */

/** `/category/{slug}` -> canonical hub. Every category now 301s; the hub is the only index page. */
export const CATEGORY_TO_HUB: Readonly<Record<string, string>> = {
  finance: "/finance-tools",
  "real-estate": "/real-estate-tools",
  business: "/business-tools",
  marketing: "/marketing-tools",
  creator: "/marketing-tools",
  developer: "/developer-tools",
  pdf: "/pdf-tools",
  generators: "/ai-tools",
  utility: "/utility-tools",
  converters: "/utility-tools",
  calculators: "/utility-tools",
  legal: "/utility-tools",
  image: "/tools",
};

export function hubPathForCategory(category: string): string {
  return CATEGORY_TO_HUB[category] ?? "/tools";
}

/* -------------------------------------------------------------------------- */
/* Programmatic URLs (H-06, H-07)                                              */
/* -------------------------------------------------------------------------- */

/**
 * /cm-to-feet/{n}-cm-to-feet — only human-height / round values with clear conversion intent
 * stay indexable (26). The other 974 values 301 to /tools/cm-to-feet (a calculator answers
 * every value) instead of being 200 + noindex + cross-canonical.
 */
export const CM_TO_FEET_INDEXABLE_VALUES: readonly number[] = [
  50, 100, 120, 140, 145, 150, 152, 155, 157, 160, 163, 165, 168, 170, 173, 175, 178, 180, 183, 185,
  188, 190, 193, 195, 198, 200,
];

/**
 * /loan-calculator/p/{amount} — personal-loan sized principals with a realistic term/APR story.
 * Larger principals were illustrative 5-year/7.49% scenarios that are not realistic for
 * mortgages, so they 301 to /tools/loan-calculator.
 */
export const LOAN_AMOUNT_INDEXABLE_VALUES: readonly number[] = [
  5_000, 10_000, 15_000, 20_000, 25_000, 30_000, 40_000, 50_000,
];

/**
 * /salary-after-tax/p/{amount} — flat 28% "illustrative" US-dollar pages with no jurisdiction.
 * Misleading as a take-home answer, so none are indexable; all 301 to the flat-rate tool.
 */
export const SALARY_AMOUNT_INDEXABLE_VALUES: readonly number[] = [];

export const PROGRAMMATIC_REDIRECTS = {
  cmToFeet: "/tools/cm-to-feet",
  loanAmount: "/tools/loan-calculator",
  salaryAmount: "/tools/salary-after-tax-calculator",
} as const;

/* -------------------------------------------------------------------------- */
/* Other consolidated pages                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Static redirects (source -> destination), applied in next.config.ts.
 * /team/editorial described a non-existent editorial team (H-08).
 * /pricing was a 32-word placeholder (M-08).
 */
export const STATIC_REDIRECTS: ReadonlyArray<{ source: string; destination: string }> = [
  { source: "/team/editorial", destination: "/editorial-policy" },
  { source: "/pricing", destination: "/about" },
];

/** Paths that must never be listed in any sitemap even if a route exists. */
export const SITEMAP_EXCLUDED_PATHS: ReadonlySet<string> = new Set([
  "/login",
  "/signup",
  "/pricing",
  "/team/editorial",
]);

/**
 * Tools that had a templated "<tool>-guide" blog post (lib/blog/articles/tool-seo-expansion.tsx).
 * Those posts share one template and add no search intent the tool page does not already serve,
 * so they are removed from the blog registry and 301 to the tool (audit H-03).
 */
const TEMPLATED_GUIDE_TOOLS: readonly string[] = [
  "vat-calculator",
  "net-worth-calculator",
  "retirement-age-calculator",
  "savings-interest-calculator",
  "emergency-fund-calculator",
  "paycheck-calculator-usa",
  "saas-mrr-arr-calculator",
  "break-even-calculator",
  "profit-margin-calculator",
  "roi-calculator-marketing",
  "cac-calculator",
  "ltv-calculator",
  "ai-content-humanizer",
  "ai-resume-generator",
  "ai-linkedin-post-generator",
  "ai-product-description-generator",
  "ai-prompt-optimizer",
  "json-formatter",
  "regex-tester",
  "base64-encoder-decoder",
  "api-response-formatter",
  "word-counter",
  "case-converter",
  "unit-price-calculator",
  "time-zone-converter",
  "age-calculator",
  "pdf-merge",
  "pdf-compress",
  "pdf-to-word",
  "word-to-pdf",
  "rental-yield-calculator",
  "property-roi-calculator",
  "mortgage-affordability-calculator",
  "loan-calculator",
  "roi-calculator",
  "compound-interest-calculator",
];

/** Guide seeds whose tool slug never existed as a live tool: point at the closest real tool. */
const TEMPLATED_GUIDE_TARGET_OVERRIDES: Readonly<Record<string, string>> = {
  "savings-interest-calculator": "savings-interest-calculator-usa",
  "ai-resume-generator": "ai-resume-summary-generator",
  "saas-mrr-arr-calculator": "saas-valuation-calculator",
};

/**
 * Blog posts that duplicate another post's intent. One pillar per intent keeps the topical
 * signal in one URL (audit H-03 / cannibalisation).
 */
const BLOG_DUPLICATE_INTENT: Readonly<Record<string, string>> = {
  "how-to-calculate-roi": "roi-calculator-measure-return-on-investment",
  "how-to-calculate-roi-business": "roi-calculator-measure-return-on-investment",
  "roi-calculator-explained-for-marketing-campaigns": "roi-calculator-measure-return-on-investment",
  "emi-calculation-explained": "how-to-calculate-emi-formula-examples-free-calculator",
  "how-to-calculate-emi-for-a-loan": "how-to-calculate-emi-formula-examples-free-calculator",
  "loan-calculator-how-banks-calculate-your-emi": "how-to-calculate-emi-formula-examples-free-calculator",
  "how-to-merge-pdf-files-for-free": "merge-pdf-files-free-five-methods-compared",
  "vat-calculator-guide-small-businesses": "vat-calculator-uk-eu-uae-add-remove-guide",
  "how-to-compare-rent-vs-buy-without-hype": "rent-vs-buy-usa-guide",
  "how-to-calculate-mortgage-payment-with-taxes-and-insurance": "mortgage-payment-usa-piti-escrow-guide",
  "best-tools-for-paycheck-planning-usa": "how-to-calculate-salary-after-tax-usa",
  "salary-after-tax-take-home-country-comparison-guide": "salary-after-tax-explained-withholdings-deductions-net-pay",
  "how-to-calculate-take-home-salary-country-guide": "salary-after-tax-explained-withholdings-deductions-net-pay",
  "how-to-estimate-take-home-pay-from-gross-salary": "salary-after-tax-explained-withholdings-deductions-net-pay",
  "ai-text-humanization-editorial-workflow-beyond-spinning": "ai-content-humanizer-natural-text-guide",
};

function buildBlogRedirects(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const tool of TEMPLATED_GUIDE_TOOLS) {
    const target = TEMPLATED_GUIDE_TARGET_OVERRIDES[tool] ?? CONSOLIDATED_TOOLS[tool] ?? tool;
    out[`${tool}-guide`] = `/tools/${target}`;
  }
  for (const [from, to] of Object.entries(BLOG_DUPLICATE_INTENT)) out[from] = `/blog/${to}`;
  return out;
}

/** blog slug -> destination path. Posts listed here are excluded from the registry and sitemap. */
export const BLOG_REDIRECTS: Readonly<Record<string, string>> = buildBlogRedirects();
