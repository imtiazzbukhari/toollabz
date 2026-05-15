import Link from "next/link";
import type { BlogPostDefinition } from "../types";
import BlogToolCallout from "@/components/BlogToolCallout";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        ROI (return on investment) is a ratio of gain to cost, usually expressed as a percent. It is beloved because it is simple
        and hated because two teams can compute “cost” differently and argue for hours.
      </p>

      <h2 id="formula" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        ROI formula everyone agrees on (until they don’t)
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Classic form: <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm">ROI = (Gain − Cost) / Cost</code>. Multiply
        by 100 for percent. Example: spend <strong>$4,000</strong> on a campaign that produces <strong>$6,500</strong> incremental
        margin → gain <strong>$2,500</strong> → ROI = <strong>62.5%</strong>. If someone reports 162%, they may be using gain over
        cost instead of (gain−cost)/cost - define terms in the slide footer.
      </p>

      <h2 id="time" className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">
        Time ignored vs annualized ROI
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Raw ROI says nothing about duration. A 60% ROI in one month beats 60% over five years. When comparing investments, pair
        ROI with a payback period or IRR-style thinking for capital projects. Marketing teams often add{" "}
        <Link href="/marketing-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          marketing calculators
        </Link>{" "}
        for ROAS/CAC context alongside ROI headlines.
      </p>

      <BlogToolCallout
        href="/tools/roi-calculator"
        title="ROI calculator"
        description="Enter gain and cost to reproduce the percentage math instantly for decks and postmortems."
      />
    </>
  );
}

const faqSchema = [
  {
    question: "What counts as cost in ROI?",
    answer:
      "Fully-loaded spend: media, creative production, agency fees, incremental tooling, and human time if you capitalize labor. Exclude sunk costs unrelated to the initiative or you bias ROI downward.",
  },
  {
    question: "Should ROI include opportunity cost?",
    answer:
      "Classic ROI often ignores opportunity cost unless you explicitly model it as an alternative investment return. For strategic finance, scenario tables beat a single ratio.",
  },
  {
    question: "How is ROI different from ROAS?",
    answer:
      "ROAS is revenue divided by ad spend for media efficiency. ROI should subtract cost of goods and variable fulfillment to reflect margin, not top-line revenue.",
  },
  {
    question: "Can ROI be negative?",
    answer:
      "Yes, when gain is less than cost. Report negative ROI clearly rather than clamping to zero - otherwise you hide losing experiments.",
  },
  {
    question: "How do I handle multi-touch attribution?",
    answer:
      "ROI per channel gets fuzzy when journeys are blended. Use incrementality tests or holdouts when budget allows; otherwise label ROI as 'model-dependent' in footnotes.",
  },
  {
    question: "Is Toollabz ROI output audited?",
    answer:
      "It performs the arithmetic you supply. It does not fetch your analytics APIs or verify finance system numbers.",
  },
] as const;

export const roiCalculatorMeasureReturnOnInvestmentPost: BlogPostDefinition = {
  slug: "roi-calculator-measure-return-on-investment",
  seoTitle: "ROI Calculator: Measure Return on Investment | Toollabz",
  description:
    "ROI formula with a worked example, time-horizon caveats, marketing cross-links, and a free ROI calculator for quick ratios.",
  title: "ROI Calculator: How to Measure Return on Investment",
  excerpt: "Define gain and cost consistently, watch time horizon, and use Toollabz for fast ratio checks.",
  publishedAt: "2026-04-26",
  category: "Marketing",
  tags: ["ROI", "finance", "marketing"],
  readingTimeMinutes: 12,
  tableOfContents: [
    { id: "formula", label: "ROI formula" },
    { id: "time", label: "Time horizon" },
  ],
  relatedToolSlugs: ["roi-calculator", "roi-calculator-marketing", "profit-margin-calculator"],
  faqSchema: [...faqSchema],
  Article,
};
