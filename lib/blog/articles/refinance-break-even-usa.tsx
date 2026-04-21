import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        A refi email hit my inbox: “Save $210/month!” Buried twelve lines down: $6,400 in costs and a fresh 30-year tape measure. Saving monthly cash today can still mean paying more wood over the life of the loan. Break-even is the adult version of reading past the subject line.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">The only break-even that matters on closing day</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Take closing costs you truly won’t recover immediately (points, title, origination—whatever is real in your quote). Divide by the monthly payment drop on the part you care about—usually P&I if you are comparing apples to apples. That’s months to get your cash back.
        If you might sell before then, the refi math gets mushy fast.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Numbers: $6,200 costs, $185/mo P&I savings</h2>
      <p className="mt-3 leading-7 text-slate-700">
        <strong className="font-semibold text-slate-800">$6,200 ÷ $185 ≈ 33.5</strong> months to recover hard dollars. Under three years. Sounds fine—unless you’re listing in eighteen months because of a job change. Also check whether the “savings” assumed you rolled costs into the loan (you still borrowed them).
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Model your actual balance, remaining term, new rate, and costs in the{" "}
        <Link href="/tools/refinance-break-even-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          refinance break-even calculator
        </Link>
        . Pair it with the{" "}
        <Link href="/tools/mortgage-payment-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          mortgage payment calculator
        </Link>{" "}
        if you want the post-refi housing cash picture with escrow lines.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">FAQ</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Should I always choose the lowest rate?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        APR helps because it folds some lender fees into the story. Two rates with different costs aren’t comparable on the headline alone.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">What about cash-out?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        You’re borrowing more. Payment might still drop if the rate craters, but you’re not “saving” on the chunk you took out—you’re financing it.
      </p>
    </>
  );
}

export const refinanceBreakEvenUsaPost: BlogPostDefinition = {
  slug: "refinance-break-even-usa-when-it-pays",
  seoTitle: "Refinance Break-Even in the USA: Closing Costs vs Real Monthly Savings",
  description:
    "Learn the simple break-even months formula for US refinances, see a $6,200 / $185 example, and use Toollabz’s refinance break-even calculator with your loan details.",
  title: "Refinance break-even: when the closing costs actually pay back",
  excerpt:
    "That “save $210/mo” email might hide $6k in fees. Here’s the divide-by-savings math, with a concrete example and a calculator link.",
  publishedAt: "2026-04-11",
  relatedToolSlugs: ["refinance-break-even-calculator", "mortgage-payment-calculator", "refinance-calculator-mortgage", "home-equity-loan-calculator"],
  Article,
};
