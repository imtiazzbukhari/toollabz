import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function QuickAnswerBox() {
  return (
    <div className="mb-8 rounded-xl border border-sky-200 bg-sky-50 px-5 py-4 text-slate-800">
      <p className="mb-2 font-semibold text-slate-950">Margin vs Percentage: What&apos;s the difference?</p>
      <p className="leading-7">
        Profit margin is a specific type of percentage: it measures profit as a percentage of <strong>revenue</strong>. General
        percentages can measure any ratio. Example: selling a GBP 100 item that cost GBP 60 gives a 40% profit margin (GBP 40
        / GBP 100). Markup percentage of the same item is 66.7% (GBP 40 / GBP 60). They use the same numbers but different
        denominators.
      </p>
    </div>
  );
}

function Article() {
  return (
    <div className="space-y-8 text-slate-700">
      <QuickAnswerBox />

      <section id="profit-margin">
        <h2 className="text-2xl font-bold text-slate-900">What Is Profit Margin?</h2>
        <p className="mt-3 leading-7">
          Profit margin measures profit as a percentage of revenue. It answers: after selling this product or service, what
          share of the sale price remains as profit before the costs you choose to exclude?
        </p>
        <p className="mt-3 rounded-lg bg-slate-950 px-4 py-3 font-mono text-sm text-white">
          (Revenue - Cost) / Revenue x 100
        </p>
        <p className="mt-3 leading-7">
          Example: revenue GBP 200 and cost GBP 120 produces GBP 80 profit. Margin = GBP 80 / GBP 200 x 100 = 40%.
        </p>
      </section>

      <section id="markup-percentage">
        <h2 className="text-2xl font-bold text-slate-900">What Is Markup Percentage?</h2>
        <p className="mt-3 leading-7">
          Markup measures profit as a percentage of cost. It answers a different question: how much did you add on top of the
          cost to set the selling price?
        </p>
        <p className="mt-3 rounded-lg bg-slate-950 px-4 py-3 font-mono text-sm text-white">
          (Revenue - Cost) / Cost x 100
        </p>
        <p className="mt-3 leading-7">
          Using the same GBP 200 revenue and GBP 120 cost, markup = GBP 80 / GBP 120 x 100 = 66.7%. Same profit, different
          denominator, different percentage.
        </p>
      </section>

      <section id="comparison-table">
        <h2 className="text-2xl font-bold text-slate-900">Margin vs Markup - Comparison Table</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th className="px-4 py-3">Profit</th>
                <th className="px-4 py-3">Margin %</th>
                <th className="px-4 py-3">Markup %</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["GBP 20 on GBP 100 sale (GBP 80 cost)", "20%", "25%"],
                ["GBP 40 on GBP 100 sale (GBP 60 cost)", "40%", "66.7%"],
                ["GBP 50 on GBP 100 sale (GBP 50 cost)", "50%", "100%"],
                ["GBP 75 on GBP 100 sale (GBP 25 cost)", "75%", "300%"],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-slate-200">
                  {row.map((cell) => (
                    <td key={cell} className="px-4 py-3">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="why-it-matters">
        <h2 className="text-2xl font-bold text-slate-900">Why Does the Difference Matter?</h2>
        <p className="mt-3 leading-7">
          Retail benchmarks usually talk about gross margin, not markup. If you want a 40% margin, marking cost up by 40% is
          not enough; you need about 66.7% markup. That common mistake can leave a business undercharging by roughly 26% versus
          the intended selling price.
        </p>
        <p className="mt-3 leading-7">
          Pricing teams often start with markup because cost is known first. Finance teams usually report margin because it
          compares profit with revenue. Good operators check both.
        </p>
      </section>

      <section id="other-percentages">
        <h2 className="text-2xl font-bold text-slate-900">Other Percentages Confused With Margin</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
          <li>Gross margin looks at revenue minus cost of goods sold.</li>
          <li>Net margin includes operating expenses, interest, tax, and other costs.</li>
          <li>Operating margin focuses on operating profit before financing and tax effects.</li>
          <li>EBITDA margin uses earnings before interest, tax, depreciation, and amortization.</li>
        </ul>
      </section>

      <section id="conversion">
        <h2 className="text-2xl font-bold text-slate-900">Quick Reference - Convert Between Margin and Markup</h2>
        <div className="mt-3 space-y-2 rounded-xl border border-violet-100 bg-violet-50/60 p-4 font-mono text-sm text-slate-900">
          <p>Markup to Margin: Margin = Markup / (1 + Markup)</p>
          <p>Margin to Markup: Markup = Margin / (1 - Margin)</p>
        </div>
      </section>

      <section id="calculator">
        <h2 className="text-2xl font-bold text-slate-900">Use Our Free Profit Margin Calculator</h2>
        <p className="mt-3 leading-7">
          To avoid denominator mistakes, run the numbers both ways.{" "}
          <Link href="/tools/profit-margin-calculator" className="font-semibold text-violet-800 underline-offset-2 hover:underline">
            Calculate margin and markup instantly
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

export const marginVsPercentagePost: BlogPostDefinition = {
  slug: "margin-vs-percentage-difference",
  title: "Margin vs Percentage: What's the Difference?",
  seoTitle: "Margin vs Percentage: Key Differences Explained (With Examples)",
  description:
    "Margin and percentage are often confused. Learn the exact difference with real examples, formulas, and when to use each. Free calculator included.",
  excerpt:
    "A plain-English guide to profit margin, markup percentage, denominators, conversion formulas, and pricing mistakes.",
  publishedAt: "2026-06-19",
  dateModified: "2026-06-19T00:00:00.000Z",
  category: "Finance",
  tags: ["profit margin", "markup", "pricing"],
  readingTimeMinutes: 7,
  relatedToolSlugs: ["profit-margin-calculator", "markup-calculator", "break-even-calculator"],
  tableOfContents: [
    { id: "profit-margin", label: "What is profit margin?" },
    { id: "markup-percentage", label: "What is markup percentage?" },
    { id: "comparison-table", label: "Comparison table" },
    { id: "why-it-matters", label: "Why it matters" },
    { id: "conversion", label: "Convert margin and markup" },
  ],
  keyTakeaways: [
    "Margin divides profit by revenue; markup divides profit by cost.",
    "A 40% margin is 66.7% markup, not 40% markup.",
    "Use margin for reporting and benchmarking; use markup when setting prices from cost.",
  ],
  commonMistakes: [
    {
      title: "Pricing for markup when you meant margin",
      body: "If you need 40% margin but only add 40% markup to cost, your selling price will be too low. The denominator changes the percentage.",
    },
  ],
  faqSchema: [
    {
      question: "Is margin the same as profit percentage?",
      answer:
        "Margin and profit percentage both express profit as a percentage, but profit percentage is ambiguous unless the denominator is stated. In most financial reporting, margin means profit divided by revenue, while markup means profit divided by cost.",
    },
    {
      question: "Which is better to use, margin or markup?",
      answer:
        "Margin is better for reporting and comparing with industry benchmarks because it uses revenue as the base. Markup is more practical for pricing because you usually know cost first and need to decide the selling price.",
    },
    {
      question: "What is a good profit margin for a small business?",
      answer:
        "A good margin depends heavily on industry and cost structure. Retail often targets 20-50% gross margin, software can be 60-80%, restaurants can have much lower net margins, and service businesses commonly vary by labor intensity.",
    },
  ],
  Article,
};
