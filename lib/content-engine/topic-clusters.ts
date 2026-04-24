import { blogPostSlugs } from "@/lib/blog/registry";

export type TopicCluster = {
  id: string;
  /** Primary calculator to anchor internal links. */
  pillarToolSlug: string;
  /** Hub phrases for matching opportunities to this cluster. */
  hubKeywords: readonly string[];
  /** Supporting angles for topical authority (RPM + rankings). */
  supporting: readonly { title: string; primaryKeyword: string }[];
};

/**
 * High-value clusters: loans, salary/paycheck, take-home tax view, real estate, ROI, debt.
 * Order matters for `findClusterForKeyword` (first hub match wins).
 */
export const TOPIC_CLUSTERS: readonly TopicCluster[] = [
  {
    id: "loan-core",
    pillarToolSlug: "loan-calculator",
    hubKeywords: [
      "loan amortization",
      "loan payment",
      "emi",
      "principal and interest",
      "early payoff",
      "extra payment",
      "interest rate",
      "apr loan",
      "debt schedule",
    ],
    supporting: [
      { title: "Loan amortization explained without drowning in rows", primaryKeyword: "loan amortization explained simply" },
      { title: "When paying extra on a loan beats investing (rough sanity check)", primaryKeyword: "extra loan payment vs investing" },
      { title: "Fixed vs variable: what changes your payment first", primaryKeyword: "fixed vs variable loan payment" },
      { title: "How lenders quote APR vs what you feel monthly", primaryKeyword: "apr vs monthly loan payment" },
      { title: "Refi math in 10 minutes: what to ignore on marketing pages", primaryKeyword: "refinance loan math basics" },
      { title: "Student loan forgiveness timelines: plan for paperwork, not headlines", primaryKeyword: "student loan forgiveness planning" },
    ],
  },
  {
    id: "real-estate-home",
    pillarToolSlug: "mortgage-payment-calculator",
    hubKeywords: [
      "mortgage",
      "piti",
      "pit",
      "escrow",
      "property tax insurance",
      "rental yield",
      "cap rate",
      "landlord",
      "hoa",
      "closing costs",
    ],
    supporting: [
      { title: "Mortgage PITI in one page: what each letter costs monthly", primaryKeyword: "mortgage piti monthly breakdown" },
      { title: "Rental yield vs cash flow: do not confuse paper yield with spendable cash", primaryKeyword: "rental yield vs cash flow" },
      { title: "HOA + insurance jumps: how to read a payment shock that is not rate-driven", primaryKeyword: "mortgage payment increase hoa insurance" },
      { title: "Rent vs buy when you might move in 24 months", primaryKeyword: "rent vs buy short horizon" },
      { title: "Cap rate quick check: when it helps and when it lies", primaryKeyword: "cap rate quick check rental" },
      { title: "Refinance break-even without sales math theater", primaryKeyword: "refinance break even simple" },
    ],
  },
  {
    id: "salary-paycheck",
    pillarToolSlug: "paycheck-calculator-usa",
    hubKeywords: [
      "paycheck",
      "paystub",
      "withholding",
      "biweekly",
      "semimonthly",
      "pre tax",
      "deductions",
      "fica",
      "w4",
      "w-4",
    ],
    supporting: [
      { title: "Paycheck planning after a raise: what actually moves first", primaryKeyword: "paycheck planning after raise" },
      { title: "Biweekly vs semimonthly pay: why your monthly cash feels wrong", primaryKeyword: "biweekly vs semimonthly pay" },
      { title: "Overtime and bonuses: how to budget without double-counting", primaryKeyword: "overtime bonus budgeting paycheck" },
      { title: "Pre-tax vs post-tax deductions on a paystub (fast scan)", primaryKeyword: "pre tax vs post tax deductions paystub" },
      { title: "Two jobs, one month: avoiding a surprise tax bill", primaryKeyword: "two jobs tax withholding planning" },
    ],
  },
  {
    id: "take-home-pay",
    pillarToolSlug: "salary-after-tax-calculator",
    hubKeywords: ["take home", "take-home", "net pay", "salary after tax", "gross salary", "effective tax rate estimate"],
    supporting: [
      { title: "Estimating withholding without a paystub (sanity check only)", primaryKeyword: "estimate withholding without paystub" },
      { title: "Side income and W-2 jobs: how to think about extra tax", primaryKeyword: "side income tax w2" },
      { title: "State moves: why gross comparisons lie for take-home", primaryKeyword: "state tax move take home pay" },
      { title: "Contract vs W-2: normalize before you compare net", primaryKeyword: "contract vs w2 take home comparison" },
    ],
  },
  {
    id: "business-roi",
    pillarToolSlug: "roi-calculator",
    hubKeywords: [
      "roi",
      "return on investment",
      "marketing roi",
      "campaign roi",
      "cac",
      "ltv",
      "churn",
      "mrr",
      "arr",
      "unit economics",
      "funnel conversion",
    ],
    supporting: [
      { title: "ROI for small campaigns: keep the denominator honest", primaryKeyword: "small campaign roi denominator" },
      { title: "Attribution vs ROI: when marketers talk past finance", primaryKeyword: "attribution vs roi marketing" },
      { title: "Simple payback period vs ROI (and when each misleads)", primaryKeyword: "payback period vs roi" },
      { title: "CAC sanity check when channels blend organic and paid", primaryKeyword: "cac calculation blended channels" },
      { title: "Churn and LTV: the one-page relationship investors expect", primaryKeyword: "churn ltv relationship explained" },
      { title: "MRR vs booked revenue: why SaaS dashboards disagree", primaryKeyword: "mrr vs booked revenue saas" },
    ],
  },
  {
    id: "debt-payoff",
    pillarToolSlug: "credit-card-payoff-calculator",
    hubKeywords: ["credit card", "payoff", "debt snowball", "apr", "minimum payment", "balance transfer", "utilization"],
    supporting: [
      { title: "APR vs daily periodic rate: what your statement is really saying", primaryKeyword: "apr vs daily periodic rate" },
      { title: "Paying extra on cards: where the math surprises people", primaryKeyword: "extra credit card payment math" },
      { title: "Balance transfer offers: the fine print checklist", primaryKeyword: "balance transfer fine print" },
      { title: "Utilization vs payment timing: two different score levers", primaryKeyword: "credit utilization vs payment timing" },
      { title: "Snowball vs avalanche: pick the one you will actually follow", primaryKeyword: "debt snowball vs avalanche practical" },
    ],
  },
];

export function findClusterForKeyword(keyword: string): TopicCluster | undefined {
  const k = keyword.toLowerCase();
  for (const c of TOPIC_CLUSTERS) {
    for (const h of c.hubKeywords) {
      if (k.includes(h) || (h.length >= 6 && h.includes(k))) return c;
    }
  }
  return undefined;
}

export function findClusterForToolSlugs(slugs: readonly string[]): TopicCluster | undefined {
  for (const c of TOPIC_CLUSTERS) {
    if (slugs.includes(c.pillarToolSlug)) return c;
  }
  return undefined;
}

/**
 * Returns supporting blog ideas not already published (slug heuristic).
 */
export function planClusterSupportingContent(clusterId: string, limit = 5): { title: string; primaryKeyword: string }[] {
  const cluster = TOPIC_CLUSTERS.find((c) => c.id === clusterId);
  if (!cluster) return [];
  const existing = new Set(blogPostSlugs.map((s) => s.toLowerCase()));
  const out: { title: string; primaryKeyword: string }[] = [];
  for (const row of cluster.supporting) {
    if (out.length >= limit) break;
    const slugGuess = row.primaryKeyword
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (slugGuess.length > 4 && existing.has(slugGuess)) continue;
    out.push({ title: row.title, primaryKeyword: row.primaryKeyword });
  }
  return out;
}

export function clusterSummariesForApi(): Array<{
  id: string;
  pillarToolSlug: string;
  plannedSupporting: number;
  samples: { title: string; primaryKeyword: string }[];
}> {
  return TOPIC_CLUSTERS.map((c) => ({
    id: c.id,
    pillarToolSlug: c.pillarToolSlug,
    plannedSupporting: planClusterSupportingContent(c.id, 8).length,
    samples: planClusterSupportingContent(c.id, 3),
  }));
}
