import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        <strong className="font-semibold text-slate-800">Gross profit</strong> is revenue minus the direct costs of delivering what
        you sold - COGS for products, hosting and support slices for SaaS, job materials for trades.{" "}
        <strong className="font-semibold text-slate-800">Net profit</strong> is what remains after you also pay operating
        expenses, interest, and taxes. Confusing the two is how teams celebrate “profitable revenue” while the bank account still
        drains.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="income-statement">
        A miniature income statement
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Imagine a month with <strong className="font-semibold text-slate-800">$500,000</strong> revenue. Direct costs (materials,
        merchant fees allocated to COGS, fulfillment labor coded as variable) total{" "}
        <strong className="font-semibold text-slate-800">$310,000</strong>. Gross profit ={" "}
        <strong className="font-semibold text-slate-800">$190,000</strong> (38% gross margin if you express it against revenue).
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Operating expenses - salaries not in COGS, rent, software, marketing brand spend not allocated to units - might be{" "}
        <strong className="font-semibold text-slate-800">$150,000</strong>. Operating income ={" "}
        <strong className="font-semibold text-slate-800">$40,000</strong>. After <strong className="font-semibold text-slate-800">$5,000</strong> interest and{" "}
        <strong className="font-semibold text-slate-800">$9,000</strong> tax provision, net profit ≈{" "}
        <strong className="font-semibold text-slate-800">$26,000</strong>. Gross profit told you production efficiency; net profit
        told you whether the whole company model worked that month.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="why-both">
        Why operators need both lenses
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Gross profit helps pricing, sourcing, and discounting decisions - you see whether the unit economics of the thing you sell
        can ever carry overhead. Net profit answers survival and distribution questions: can you service debt, pay taxes, and
        still reinvest?
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        When you change price, start with{" "}
        <Link href="/blog/markup-vs-margin-formulas-pricing-mistakes" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          markup vs margin
        </Link>{" "}
        math, then stress-test whether new volume still clears fixed costs using{" "}
        <Link href="/tools/break-even-calculator-business" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          break-even tooling
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="comparison">
        Gross vs net: quick comparison
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Line</th>
              <th className="px-4 py-3">What it captures</th>
              <th className="px-4 py-3">Typical decisions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium">Gross profit</td>
              <td className="px-4 py-3">Revenue minus direct costs</td>
              <td className="px-4 py-3">Supplier terms, BOM changes, promotional discounts</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Net profit</td>
              <td className="px-4 py-3">All-in after OpEx, interest, tax</td>
              <td className="px-4 py-3">Dividends, hiring, debt paydown, rainy-day reserves</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="cash">
        Cash vs accrual reminder
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Net profit on an accrual basis can diverge from cash when customers pay late, inventory builds, or CapEx is capitalized.
        For founder peace of mind, pair profit lines with{" "}
        <Link href="/blog/net-worth-calculator-five-minute-guide" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          balance-sheet awareness
        </Link>{" "}
        and short-term liquidity tools on the{" "}
        <Link href="/finance-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          finance hub
        </Link>
        .
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="salary-bridge">
        Bridge to payroll: salary after tax
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        People costs sit below gross profit. If you are modeling take-home for hiring plans, read{" "}
        <Link href="/blog/salary-after-tax-explained-withholdings-deductions-net-pay" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          salary after tax explained
        </Link>{" "}
        and cross-check with{" "}
        <Link href="/blog/how-to-calculate-salary-after-tax-usa" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          the USA salary-after-tax walkthrough
        </Link>{" "}
        when brackets and pre-tax deductions matter.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="tools">
        Tools on Toollabz
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/profit-margin-calculator-business" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          profit margin calculator
        </Link>{" "}
        echoes gross-margin thinking when you have revenue and COGS estimates. For portfolio-level gains, the{" "}
        <Link href="/tools/roi-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          ROI calculator
        </Link>{" "}
        helps compare projects with different capital outlays.
      </p>
    </>
  );
}

export const grossVsNetProfitPost: BlogPostDefinition = {
  slug: "gross-profit-vs-net-profit-explained-for-operators",
  title: "Gross profit vs net profit: what operators should track",
  description:
    "Walk a miniature P&L from revenue to gross profit to net profit, see which decisions each line informs, and link out to margin, break-even, and salary-after-tax guides on Toollabz.",
  excerpt:
    "Gross profit tests whether units can carry the business; net profit tests whether the business carried itself after rent, interest, and tax.",
  publishedAt: "2026-05-10",
  dateModified: "2026-05-14T12:00:00.000Z",
  category: "Finance",
  tags: ["P&L", "gross margin", "net income", "unit economics"],
  readingTimeMinutes: 15,
  relatedToolSlugs: ["profit-margin-calculator-business", "break-even-calculator-business", "roi-calculator", "salary-after-tax-calculator"],
  relatedPostsSlugs: [
    "markup-vs-margin-formulas-pricing-mistakes",
    "break-even-analysis-formula-examples-calculator",
    "salary-after-tax-explained-withholdings-deductions-net-pay",
    "net-worth-calculator-five-minute-guide",
  ],
  tableOfContents: [
    { id: "income-statement", label: "Mini income statement" },
    { id: "why-both", label: "Why both matter" },
    { id: "comparison", label: "Comparison table" },
    { id: "cash", label: "Cash vs accrual" },
    { id: "salary-bridge", label: "Payroll bridge" },
    { id: "tools", label: "Toollabz calculators" },
  ],
  keyTakeaways: [
    "Gross profit isolates direct costs; net profit folds in operating spend, financing, and tax.",
    "Strong gross profit with weak net profit usually signals overhead, growth spend, or leverage - not necessarily a bad SKU.",
    "Cash timing can diverge from either profit line - watch working capital, not only percentages.",
  ],
  editorialNote: [
    "We simplify GAAP presentation for clarity; your accountant maps freight capitalization, stock comp, and tax timing to your jurisdiction.",
  ],
  whenToUseTools: [
    "Use profit margin calculators when testing price or COGS shocks on a single product line.",
    "Use ROI when comparing two initiatives with different upfront cash needs.",
  ],
  commonMistakes: [
    {
      title: "Calling contribution margin “net”",
      body: "Contribution margin still ignores many fixed operating costs. Reserve the word net for after operating expenses unless everyone agrees otherwise.",
    },
    {
      title: "Ignoring channel fees inside COGS",
      body: "If a marketplace fee scales with units sold, excluding it from gross profit inflates perceived pricing power.",
    },
  ],
  sources: [{ label: "FASB conceptual framework (high-level accounting context)", href: "https://www.fasb.org/" }],
  faqSchema: [
    {
      question: "Can gross profit be positive while net profit is negative?",
      answer:
        "Yes. Fixed costs, interest, one-time impairments, or aggressive R&amp;D can consume gross profit and produce a net loss while unit economics remain positive.",
    },
    {
      question: "Is EBITDA the same as gross profit?",
      answer:
        "No. EBITDA starts from operating earnings and adds back depreciation and amortization; it still sits below gross profit on a typical income statement.",
    },
    {
      question: "Which metric should investors ask for first?",
      answer:
        "Context-dependent: gross margin quality for product businesses, net margin or free cash flow for mature capital-intensive firms.",
    },
    {
      question: "How does Toollabz help?",
      answer:
        "Use margin and break-even calculators for quick scenarios, then escalate complex tax questions to a licensed professional.",
    },
  ],
  Article,
};
