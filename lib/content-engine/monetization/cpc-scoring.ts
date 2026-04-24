/**
 * Heuristic CPC proxy (0–100) for prioritization — not real auction CPC.
 * Biases toward finance, credit, housing, insurance, business, and SaaS metrics.
 */

const TIER_ULTRA =
  /\b(mortgage|refinance|refinancing|home equity|heloc|life insurance|disability insurance|commercial loan|business loan|sba loan|investment property|cap rate|cash flow property|tax attorney|estate planning|annuity)\b/i;

const TIER_HIGH =
  /\b(insurance|premium|deductible|underwriting|loan|lender|apr|interest rate|credit score|credit report|debt consolidation|bankruptcy|foreclosure|short sale|payroll|invoice|accounts receivable|working capital|line of credit|personal loan|auto loan|student loan|forgiveness)\b/i;

const TIER_FINANCE =
  /\b(finance|financial|money|salary|paycheck|take home|gross|net pay|withholding|401k|ira|roth|dividend|portfolio|bond|equity|valuation|revenue|profit|margin|ebitda|cash flow)\b/i;

const TIER_BUSINESS_SAAS =
  /\b(business|startup|saas|subscription|recurring revenue|mrr|arr|churn|retention|cac|ltv|unit economics|conversion rate|funnel|roas|cpa marketing|lead cost|pipeline|quota|commission)\b/i;

const TIER_REAL_ESTATE = /\b(real estate|rental|landlord|tenant|lease|cap rate|noi|reit|property tax|escrow|title insurance|hoa)\b/i;

/**
 * 0–100 CPC proxy for a keyword or phrase.
 */
export function computeCpcProxyScore(text: string): number {
  const t = text.toLowerCase();
  let score = 22;
  if (TIER_ULTRA.test(t)) score += 48;
  else if (TIER_HIGH.test(t)) score += 36;
  if (TIER_FINANCE.test(t)) score += 18;
  if (TIER_BUSINESS_SAAS.test(t)) score += 16;
  if (TIER_REAL_ESTATE.test(t)) score += 14;
  return Math.min(100, Math.round(score));
}

/**
 * Blended monetization potential 0–100 for UI / API (keyword + optional tool slugs).
 */
export function computeMonetizationPotential(keyword: string, toolSlugs: readonly string[] = []): number {
  const kw = computeCpcProxyScore(keyword);
  if (toolSlugs.length === 0) return kw;
  const slugScores = toolSlugs.map((s) => computeCpcProxyScore(s.replace(/-/g, " ")));
  const maxSlug = Math.max(...slugScores, 0);
  return Math.min(100, Math.round(kw * 0.62 + maxSlug * 0.38));
}
