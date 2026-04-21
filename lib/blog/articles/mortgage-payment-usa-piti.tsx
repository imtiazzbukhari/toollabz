import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        My cousin almost passed on a house because the listing payment on a flyer looked “impossible.” It was P&I only. Taxes in that county were brutal, HOA was $180, and they were putting 10% down so PMI was in play.
        Suddenly the number she needed for cash flow was $640 higher than the flyer. Nothing illegal—just a different layer of the stack.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">What actually hits your checking account</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Principal and interest are the part amortization tables love. Real life adds property tax (often as a monthly escrow slice), homeowner’s insurance, and sometimes PMI until you have enough equity. HOAs are separate envelopes but still real money.
        Underwriters care about the bundle; you should too before you fall in love with a rate quote.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Worked example: $412k buy, 10% down, 6.875%, 30y</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Round numbers: <strong className="font-semibold text-slate-800">$412,000</strong> price,{" "}
        <strong className="font-semibold text-slate-800">10%</strong> down → roughly{" "}
        <strong className="font-semibold text-slate-800">$370,800</strong> financed. At{" "}
        <strong className="font-semibold text-slate-800">6.875%</strong> over 30 years, P&I lands near{" "}
        <strong className="font-semibold text-slate-800">$2,440</strong> (lenders round differently, but you’re in that zip code). Now add{" "}
        <strong className="font-semibold text-slate-800">1.15%</strong> tax rate on value → ~$395/mo, insurance at{" "}
        <strong className="font-semibold text-slate-800">$1,450/yr</strong> → ~$121/mo, PMI sketch on the loan, plus HOA if any. That is the household truth test.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Plug your own tax rate and insurance into the{" "}
        <Link href="/tools/mortgage-payment-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          mortgage payment calculator
        </Link>{" "}
        — it keeps P&I exact on the loan amount while you sanity-check escrow assumptions.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">FAQ</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Does a lower rate always mean a cheaper house?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Not if you stretch price or reset the term. A longer amortization lowers the payment while sometimes increasing lifetime interest. Compare both payment and total interest before bragging at brunch.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">When does PMI go away?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Rules depend on loan program and paydown path. Some loans cancel near 78–80% LTV on the amortization schedule; others need appraisal or refinance. Your servicer letter matters more than blog prose.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Is this tax advice?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        No. Deductions and SALT caps change with law and your situation. We’re modeling cash flow, not filing a return.
      </p>
    </>
  );
}

export const mortgagePaymentUsaPitiPost: BlogPostDefinition = {
  slug: "mortgage-payment-usa-piti-escrow-guide",
  seoTitle: "Mortgage Payment in the USA: Why PITI Beats the Sticker Rate (Real Numbers)",
  description:
    "P&I is only part of your US mortgage payment. Taxes, insurance, PMI, and HOA change what you actually spend—worked example plus a link to Toollabz’s free mortgage payment calculator.",
  title: "Mortgage payment in the USA: what PITI actually means",
  excerpt:
    "A $412k example shows how taxes, insurance, and PMI stack on top of principal and interest—so you budget like a human, not a flyer.",
  publishedAt: "2026-04-11",
  relatedToolSlugs: ["mortgage-payment-calculator", "refinance-break-even-calculator", "loan-calculator", "home-equity-loan-calculator"],
  Article,
};
