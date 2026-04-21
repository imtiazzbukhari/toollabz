import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        The finance office at a dealership once showed me a “monthly” that was <em>lower</em> than my spreadsheet because they’d
        quietly switched the term to 72 months and rounded the rate display. EMI math itself isn’t evil; fuzzy inputs are. If
        you know principal, APR, and length, you can usually reconstruct what they’re doing before you sign.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Principal isn’t “sticker minus down” if fees rolled in</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Sticker <strong className="font-semibold text-slate-800">$33,400</strong>, you put <strong className="font-semibold text-slate-800">$5,000</strong> down,
        naive math says <strong className="font-semibold text-slate-800">$28,400</strong> financed. If doc fees and extras got folded
        into the note, principal might actually be <strong className="font-semibold text-slate-800">$29,650</strong>. That extra{" "}
        <strong className="font-semibold text-slate-800">$1,250</strong> isn’t abstract - it’s dollars you’ll pay interest on every
        month. Read the truth-in-lending box, not the salesperson’s napkin.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">APR vs “monthly rate” (the classic mix-up)</h2>
      <p className="mt-3 leading-7 text-slate-700">
        The bank says <strong className="font-semibold text-slate-800">7.2% APR</strong>. You do <strong className="font-semibold text-slate-800">7.2 ÷ 12 = 0.6%</strong> per
        month in your head - fine for intuition, but calculators want the annual figure in the rate field, or the monthly rate
        derived correctly, not “0.6 typed as 0.6% annual” by accident. Wrong layer here is how people get payments off by{" "}
        <strong className="font-semibold text-slate-800">$80–$120</strong> and assume the lender is scamming them.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Concrete run: $28k, 7.2%, five years</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Plug <strong className="font-semibold text-slate-800">$28,000</strong>, <strong className="font-semibold text-slate-800">7.2%</strong>,{" "}
        <strong className="font-semibold text-slate-800">60 months</strong> into the{" "}
        <Link href="/tools/emi-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          EMI calculator
        </Link>{" "}
        or the{" "}
        <Link href="/tools/loan-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          loan calculator
        </Link>{" "}
        (years instead of months - same math, different shape). Payment lands right around{" "}
        <strong className="font-semibold text-slate-800">$557</strong>. Sixty of those is about{" "}
        <strong className="font-semibold text-slate-800">$33,420</strong> out the door, so interest in the ballpark of{" "}
        <strong className="font-semibold text-slate-800">$5,420</strong>. Seeing that total makes the “only $18 more a month” pitch
        feel less magical.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Insurance isn’t in that payment</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Car note calculators isolate the loan. Renters insurance, car insurance, annual registration - different envelopes.
        Mortgages bundle more, which is why house shopping has a whole other spreadsheet culture.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Loose ends</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700">
        <li>
          <strong className="text-slate-800">Penny off?</strong> Day-count conventions and rounding. If you’re within a few
          dollars, you’ve won.
        </li>
        <li>
          <strong className="text-slate-800">Pay ahead?</strong> Depends on the note. We have an early payoff calculator if you’re
          modeling extra principal.
        </li>
        <li>
          <strong className="text-slate-800">Two calculators on this site?</strong> Habit. I think in months for cars, years for
          houses - pick the UI that matches your paperwork.
        </li>
      </ul>
    </>
  );
}

export const emiLoanPost: BlogPostDefinition = {
  slug: "how-to-calculate-emi-for-a-loan",
  seoTitle: "How to Calculate EMI for a Loan (Car, Personal, or Whatever the Bank Calls It)",
  description:
    "EMI without the dealer fog: principal with rolled-in fees, APR vs monthly confusion, and a worked $28k / 7.2% / 60-month example with loan and EMI calculators.",
  title: "How to calculate EMI for a loan",
  excerpt:
    "Same math lenders use, fewer fuzzy inputs - plus a $28,000 example so you can sanity-check a payment before you sign.",
  publishedAt: "2026-04-10",
  relatedToolSlugs: ["emi-calculator", "loan-calculator", "early-loan-payoff-calculator"],
  Article,
};
