import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Marketing teams rarely lose because they cannot calculate a percentage. They lose because they disagree on what belongs in
        the numerator and denominator. One person uses revenue. Another uses gross profit. Someone else ignores agency cost. Suddenly
        everyone has “great ROI” and no one trusts the report.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">ROI vs ROAS: clear this up first</h2>
      <p className="mt-3 leading-7 text-slate-700">
        ROAS is typically revenue divided by ad spend. ROI is usually net gain divided by total cost. If you present ROAS as ROI, you
        may overstate performance by a lot. Keep definitions explicit in your dashboard and in stakeholder conversations.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Step-by-step: calculate campaign ROI that holds up in meetings</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">1) Define attributable gain</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Use a consistent attribution window and decide whether you report revenue or contribution margin.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">2) Build full campaign cost</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Include media spend, creative production, software, and agency/freelancer cost when relevant.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">3) Calculate ROI and compare across channels</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Use the{" "}
        <Link href="/tools/roi-calculator-marketing" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          ROI calculator marketing
        </Link>{" "}
        for campaign-level analysis, then cross-check broader investment decisions with the{" "}
        <Link href="/tools/roi-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          ROI calculator
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Real example: paid social campaign review</h2>
      <p className="mt-3 leading-7 text-slate-700">
        A campaign generated <strong className="font-semibold text-slate-800">$41,000</strong> in attributable revenue. Contribution
        margin is 52%, so attributable gain is about <strong className="font-semibold text-slate-800">$21,320</strong>. Full campaign
        cost is <strong className="font-semibold text-slate-800">$14,600</strong> (media + creative + tools). Net gain is{" "}
        <strong className="font-semibold text-slate-800">$6,720</strong>. ROI is about{" "}
        <strong className="font-semibold text-slate-800">46%</strong>.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        This is exactly why denominator discipline matters. If you had used only media spend, ROI would look much higher but less
        trustworthy.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Common mistakes that inflate ROI</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-700">
        <li>Using top-line revenue as gain without cost-of-goods or delivery cost context.</li>
        <li>Excluding creative and operational costs from campaign spend.</li>
        <li>Comparing channels with different attribution windows.</li>
        <li>Reporting one winning week as if it were stable annual performance.</li>
      </ul>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">A simple quality check before publishing numbers</h2>
      <p className="mt-3 leading-7 text-slate-700">
        If ROI looks excellent, also check margin durability with the{" "}
        <Link href="/tools/profit-margin-calculator-business" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          profit margin calculator business
        </Link>
        . High ROI on thin margins can still be fragile if costs move.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Conclusion</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Good marketing ROI reporting is less about clever math and more about consistent definitions. Align your gain and cost rules
        once, then reuse them every month. That is how dashboards become decision tools instead of decoration.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">FAQ</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Should I report ROI or ROAS to leadership?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Ideally both, clearly labeled. ROAS describes revenue efficiency; ROI shows net business impact after broader campaign costs.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">What attribution window should I use?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Use a window that matches your buying cycle and keep it consistent across channels so comparisons remain fair.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Can ROI be useful on small budgets?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Yes, but volatility is higher. Review trends across multiple cycles rather than judging from one short campaign.
      </p>
    </>
  );
}

export const roiCalculatorExplainedMarketingPost: BlogPostDefinition = {
  slug: "roi-calculator-explained-for-marketing-campaigns",
  seoTitle: "ROI Calculator Explained for Marketing Campaigns (ROI vs ROAS)",
  description:
    "A practical guide to marketing ROI: definitions, step-by-step calculation, real campaign example, common mistakes, and tool links.",
  title: "ROI calculator explained for marketing campaigns",
  excerpt:
    "Learn how to calculate trustworthy marketing ROI, avoid inflated reporting, and align campaign metrics that hold up in decision meetings.",
  publishedAt: "2026-04-23",
  relatedToolSlugs: ["roi-calculator-marketing", "roi-calculator", "profit-margin-calculator-business"],
  faqSchema: [
    {
      question: "What is the difference between ROI and ROAS in marketing?",
      answer:
        "ROAS typically measures revenue divided by ad spend, while ROI measures net gain divided by total campaign cost.",
    },
    {
      question: "How can attribution windows affect ROI analysis?",
      answer:
        "Different attribution windows can materially change reported gain, so consistent windows are required for fair channel comparison.",
    },
    {
      question: "Should non-media costs be included in campaign ROI?",
      answer:
        "Yes. Excluding creative, software, or execution costs can overstate performance and reduce decision quality.",
    },
  ],
  Article,
};
