import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Break-even analysis answers how many units you must sell so contribution margin covers fixed costs. It is the first sanity
        check before you price a SKU, approve a hire, or extend a marketing experiment.
      </p>

      <h2 id="formula" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Core formula (single-product intuition)
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Let <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">F</code> be monthly fixed costs,{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">p</code> price per unit, and{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">v</code> variable cost per unit (fully loaded with
        packaging, payment fees, incremental support). Contribution per unit is{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">p − v</code>. Break-even units ≈{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">F / (p − v)</code> when the denominator is positive. If{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">p ≤ v</code>, you never break even on marginal math - fix
        pricing or cost structure first.
      </p>

      <h2 id="example" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Numeric toy scenario
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Suppose <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">F = $24,000</code> per month (rent, salaries not
        tied to units), <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">p = $80</code>, and{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">v = $35</code>. Contribution is{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">$45</code>, so break-even units ≈{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">24,000 / 45 ≈ 534</code> units/month. Anything beyond
        534 generates incremental profit before corporate allocations. Plug your own numbers into the calculator below and
        stress-test ±10% on price and variable cost - small swings move the threshold sharply when margins are thin.
      </p>

      <h2 id="limits" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Where textbook break-even lies
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Mixed product lines, step-fixed costs (another hire every N units), and nonlinear ad spend break the single-ratio story.
        Use break-even as a directional compass, then layer scenario tables. See{" "}
        <Link href="/business-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          business tools
        </Link>{" "}
        for ROI and margin neighbors.
      </p>

      <BlogToolCallout
        href="/tools/break-even-calculator"
        title="Break-even calculator"
        description="Enter fixed costs, price, and variable cost per unit to mirror the formula above."
      />
    </>
  );
}

const faqSchema = [
  {
    question: "Does break-even include marketing spend?",
    answer:
      "If marketing is truly variable with each marginal unit (pure performance spend), include it in variable cost. If it is a monthly retainer, treat it as fixed. Misclassification is the top reason break-even outputs disagree between teams.",
  },
  {
    question: "Should depreciation be in fixed costs?",
    answer:
      "For cash planning, some founders exclude non-cash depreciation; for accounting completeness, include it when matching GAAP views. Pick the definition that matches the decision you are making.",
  },
  {
    question: "How do discounts affect break-even?",
    answer:
      "Effective price drops, shrinking contribution. Model discounts explicitly rather than lowering price silently in the calculator - otherwise you cannot reconcile promotions.",
  },
  {
    question: "Can I use this for SaaS?",
    answer:
      "SaaS often blends CAC payback with contribution margin on seats. Simple unit break-even still helps sanity-check self-serve tiers before layering sales commissions.",
  },
  {
    question: "What if I sell bundles?",
    answer:
      "Allocate variable cost per bundle component or use weighted-average contribution. Otherwise the calculator overstates margin on loss-leader pieces.",
  },
  {
    question: "Is this financial advice?",
    answer:
      "No. It is educational arithmetic. Investment, tax, and contractual decisions need qualified advisers when material.",
  },
] as const;

export const breakEvenAnalysisFormulaExamplesCalculatorPost: BlogPostDefinition = {
  slug: "break-even-analysis-formula-examples-calculator",
  seoTitle: "Break-Even Analysis: Formula, Examples & Calculator | Toollabz",
  description:
    "Contribution margin break-even formula, a worked numeric example, limits for multi-product businesses, and a free break-even calculator.",
  title: "Break-Even Analysis: Formula, Examples & Free Calculator",
  excerpt: "Fixed vs variable framing, numeric walkthrough, and calculator CTA for operators.",
  publishedAt: "2026-04-26",
  category: "Business",
  tags: ["break even", "margin", "planning"],
  readingTimeMinutes: 14,
  tableOfContents: [
    { id: "formula", label: "Formula" },
    { id: "example", label: "Example" },
    { id: "limits", label: "Limits" },
  ],
  relatedToolSlugs: ["break-even-calculator", "roi-calculator", "profit-margin-calculator"],
  faqSchema: [...faqSchema],
  Article,
};
