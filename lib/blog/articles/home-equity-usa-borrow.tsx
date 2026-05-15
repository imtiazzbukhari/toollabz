import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Equity feels like money in the wall. Banks see combined loan-to-value math, credit, income, and whether you’re trying to turn your kitchen into a casino. The ceiling is often lower than Zillow courage suggests - especially once a second lien payment joins the first mortgage you already have.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">LTV in English</h2>
      <p className="mt-3 leading-7 text-slate-700">
        If your home is worth <strong className="font-semibold text-slate-800">$520,000</strong> and you owe{" "}
        <strong className="font-semibold text-slate-800">$310,000</strong>, your equity headline is{" "}
        <strong className="font-semibold text-slate-800">$210,000</strong>. Borrowing power is not that full amount - lenders cap combined debt against value. Toollabz models an{" "}
        <strong className="font-semibold text-slate-800">85%</strong> combined ceiling for a quick sketch:{" "}
        <strong className="font-semibold text-slate-800">0.85 × $520k − $310k ≈ $132k</strong> headroom before overlays tighten it.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Payment matters as much as approval</h2>
      <p className="mt-3 leading-7 text-slate-700">
        A fixed second amortizes like a car loan mentally - steady principal kill. HELOCs often start interest-only on draws, then surprise people later. Our calculator assumes a closed-end style payment so you see a conservative monthly if you fully amortize what you borrow.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Try your value, balance, desired amount, rate, and term in the{" "}
        <Link href="/tools/home-equity-loan-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          home equity loan calculator
        </Link>
        , then compare with refinance scenarios if rate improvement is the real goal.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">FAQ</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Is interest deductible?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Depends on use of funds and current law. Ask a tax pro - don’t bet a kitchen remodel on a blog footnote.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Why didn’t I get the full 85%?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Risk-based adjustments, second-lien investor caps, and appraisal reality all shrink the box.
      </p>
    </>
  );
}

export const homeEquityUsaBorrowPost: BlogPostDefinition = {
  slug: "home-equity-how-much-can-you-borrow-usa",
  seoTitle: "Home Equity (USA): How Much You Can Actually Borrow (LTV + Payment)",
  description:
    "Combined LTV caps explained with a $520k home example, payment intuition, and Toollabz’s free home equity loan calculator - not a lender offer.",
  title: "Home equity: the difference between Zillow courage and bank math",
  excerpt:
    "Equity on paper isn’t the same as approved borrowing power. Here’s an 85% combined LTV sketch plus a payment sanity check.",
  publishedAt: "2026-04-11",
  relatedToolSlugs: ["home-equity-loan-calculator", "mortgage-payment-calculator", "refinance-break-even-calculator", "loan-calculator"],
  Article,
};
