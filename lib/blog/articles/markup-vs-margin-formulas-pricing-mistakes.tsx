import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        <strong className="font-semibold text-slate-800">Margin</strong> asks what portion of a selling price you keep after
        direct costs. <strong className="font-semibold text-slate-800">Markup</strong> asks how much you inflate cost to reach
        price. They are two cameras pointed at the same shelf - swap formulas mid-pricing and you will silently discount yourself.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="formulas">
        The two formulas (and a numeric tie)
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Assume a SKU costs <strong className="font-semibold text-slate-800">$40</strong> landed (COGS + inbound freight you
        allocate to the unit). You sell it for <strong className="font-semibold text-slate-800">$100</strong>. Gross profit =
        <strong className="font-semibold text-slate-800"> $60</strong>.
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
        <li>
          <strong>Gross margin %</strong> = gross profit / price = 60 / 100 ={" "}
          <strong className="font-semibold text-slate-800">60%</strong>.
        </li>
        <li>
          <strong>Markup % on cost</strong> = gross profit / cost = 60 / 40 ={" "}
          <strong className="font-semibold text-slate-800">150%</strong>.
        </li>
      </ul>
      <p className="mt-3 leading-7 text-slate-700">
        Same economics, different percentages. In a rushed Slack message, “we need 40” is meaningless unless everyone agrees
        whether that forty lives on top of cost or inside revenue.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="table">
        Margin vs markup comparison
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Margin answers</th>
              <th className="px-4 py-3">Markup answers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3">Denominator</td>
              <td className="px-4 py-3">Selling price (top line of the unit)</td>
              <td className="px-4 py-3">Cost (what you paid to create/obtain)</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Typical audience</td>
              <td className="px-4 py-3">Finance, retail planners, SaaS CFOs</td>
              <td className="px-4 py-3">Merchants, contractors quoting jobs</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Failure mode</td>
              <td className="px-4 py-3">Sounds “low” vs markup; people chase higher % without checking dollars</td>
              <td className="px-4 py-3">Sounds “high”; easy to overestimate protection if you forget OpEx</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="reverse">
        Reverse-engineer price from a target margin
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        If you want a <strong className="font-semibold text-slate-800">55%</strong> gross margin and your unit cost is{" "}
        <strong className="font-semibold text-slate-800">$28</strong>, price ≈ cost / (1 − margin) = 28 / 0.45 ≈{" "}
        <strong className="font-semibold text-slate-800">$62.22</strong>. Round with strategy in mind - psychological endings,
        channel fees, and returns buffers belong in the next layer, not in the naive formula.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Sanity-check the result with the{" "}
        <Link href="/tools/profit-margin-calculator-business" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          profit margin calculator
        </Link>{" "}
        and, when you are deciding whether a SKU deserves shelf space,{" "}
        <Link href="/tools/break-even-calculator-business" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          break-even units
        </Link>{" "}
        after you fold in fixed costs.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="finance-cluster">
        Finance cluster siblings
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Margin is the bridge between top-line revenue stories and bottom-line reality - pair this guide with{" "}
        <Link href="/blog/gross-profit-vs-net-profit-explained-for-operators" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          gross profit vs net profit
        </Link>{" "}
        so nobody confuses contribution with what is left after rent and payroll. If ads are part of acquisition cost, read{" "}
        <Link href="/blog/roi-vs-roas-when-to-trust-each-metric" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          ROI vs ROAS
        </Link>{" "}
        before you “fix” pricing to chase platform metrics.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        For tax-inclusive markets, VAT sits between list price and what you remit - start at the{" "}
        <Link href="/blog/vat-calculator-guide-small-businesses" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          VAT guide for small businesses
        </Link>{" "}
        when your shelf label includes tax consumers pay but not tax you keep.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="break-even">
        Tie-in: contribution and break-even
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Break-even thinking wants contribution margin per unit (price minus variable cost). Once you have that dollar slice, fixed
        costs become a countable hill - our{" "}
        <Link href="/blog/break-even-analysis-formula-examples-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          break-even analysis walkthrough
        </Link>{" "}
        shows the algebra with examples you can paste into a spreadsheet.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="hub">
        Hubs
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Browse calculators on the{" "}
        <Link href="/business-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          business tools hub
        </Link>{" "}
        and deeper finance utilities on the{" "}
        <Link href="/finance-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          finance tools hub
        </Link>
        .
      </p>
    </>
  );
}

export const markupVsMarginPost: BlogPostDefinition = {
  slug: "markup-vs-margin-formulas-pricing-mistakes",
  title: "Markup vs margin: formulas, reverse pricing, and common mistakes",
  description:
    "Margin divides by price; markup divides by cost. See a $40 → $100 SKU, reverse-engineer price from a target margin, and link margin thinking to break-even and VAT workflows on Toollabz.",
  excerpt:
    "Same shelf, two percentages. Learn the formulas, reverse pricing from a target margin, and avoid the Slack ambiguity that quietly erodes price.",
  publishedAt: "2026-05-10",
  dateModified: "2026-05-14T12:00:00.000Z",
  category: "Finance",
  tags: ["pricing", "margin", "markup", "COGS"],
  readingTimeMinutes: 16,
  relatedToolSlugs: ["profit-margin-calculator-business", "break-even-calculator-business", "roi-calculator", "vat-calculator"],
  relatedPostsSlugs: [
    "gross-profit-vs-net-profit-explained-for-operators",
    "roi-vs-roas-when-to-trust-each-metric",
    "break-even-analysis-formula-examples-calculator",
    "vat-calculator-guide-small-businesses",
  ],
  tableOfContents: [
    { id: "formulas", label: "Formulas" },
    { id: "table", label: "Comparison table" },
    { id: "reverse", label: "Reverse pricing" },
    { id: "finance-cluster", label: "Finance cluster" },
    { id: "break-even", label: "Break-even tie-in" },
    { id: "hub", label: "Hubs" },
  ],
  keyTakeaways: [
    "Gross margin % uses price in the denominator; markup % on cost uses cost - never interpolate between them without converting.",
    "Target margin pricing uses price = cost / (1 − margin); round strategically after the math, not before.",
    "Pair SKU-level margin with break-even and fixed-cost coverage before scaling promotions.",
  ],
  editorialNote: [
    "Examples use illustrative COGS. Inventory timing, shrink, and channel fees change real margins - treat numbers as templates.",
  ],
  whenToUseTools: [
    "Use the profit margin calculator when you have revenue and cost lines and need a quick gross % check.",
    "Use break-even calculators when fixed costs dominate (rent, salaried launch team, annual software).",
  ],
  commonMistakes: [
    {
      title: "Quoting “40%” without naming margin vs markup",
      body: "A 40% gross margin is not a 40% markup. Clarify vocabulary before approvals; mislabeled percentages lose more money than weak haggling.",
    },
    {
      title: "Using list price while forgetting net-of-discount revenue",
      body: "Margins should be stress-tested on expected realized price after coupons, bundles, and payment fees - not MSRP fiction.",
    },
  ],
  sources: [
    { label: "CFI gross margin overview (educational reference)", href: "https://corporatefinanceinstitute.com/resources/accounting/gross-margin-ratio/" },
  ],
  faqSchema: [
    {
      question: "Is markup always higher than margin percentage?",
      answer:
        "For positive-cost products, markup percentage numerically exceeds margin percentage when both are expressed as percents of their respective denominators.",
    },
    {
      question: "How do I convert margin to markup?",
      answer:
        "Markup on cost = margin / (1 − margin). Example: 40% margin → 0.4 / 0.6 ≈ 66.7% markup on cost.",
    },
    {
      question: "Does net margin use the same formula as gross margin?",
      answer:
        "Net margin divides net profit by revenue. Gross margin uses only direct costs; net margin includes operating expenses, interest, and tax - see the gross vs net profit companion article.",
    },
    {
      question: "Where can I practice quickly?",
      answer:
        "Use Toollabz profit margin and break-even calculators to echo spreadsheet results without leaving the browser.",
    },
  ],
  Article,
};
