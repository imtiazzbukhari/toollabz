import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Lenders do not mythically “feel” your hustle. They pattern-match: time in business, personal credit behavior, cash flow versus the payment you want, industry risk, collateral, and the quality of your statements. If you’re asking for $400k on $180k revenue with two months of runway, the spreadsheet dies before the relationship coffee happens.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">A quick sanity filter before you waste October</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Rough DSCR-style thinking: after normal operating expenses, is there room for the proposed debt service? If every extra dollar is already spoken for, underwriting will notice. Credit score gates are real—sub-620 territory is not where bank pricing lives.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Example: $1.1M revenue, $42k/mo expenses, $250k ask</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Monthly revenue ≈ <strong className="font-semibold text-slate-800">$91.7k</strong>, expenses{" "}
        <strong className="font-semibold text-slate-800">$42k</strong> → about{" "}
        <strong className="font-semibold text-slate-800">$49.7k</strong> before debt. A five-year term payment on $250k might land near{" "}
        <strong className="font-semibold text-slate-800">$5.2k/mo</strong> at a double-digit rate—tight but not absurd if the rest of the P&amp;L is clean and documented. Change the ask to $750k and the same cash flow story collapses.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Run your numbers through the{" "}
        <Link href="/tools/business-loan-eligibility-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          business loan eligibility calculator
        </Link>{" "}
        for a blunt pre-read, then take real statements to an accountant or banker.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">FAQ</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Is this an approval?</h3>
      <p className="mt-2 leading-7 text-slate-700">No. It’s a heuristic toy. Underwriters add nuance you cannot paste into a form.</p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">What about SBA?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Guaranty programs shift risk, not physics—you still need sustainable cash flow and acceptable credit.
      </p>
    </>
  );
}

export const businessLoanLenderScanPost: BlogPostDefinition = {
  slug: "business-loan-what-lenders-scan-first",
  seoTitle: "Business Loans (USA): What Lenders Actually Scan Before They Say Yes",
  description:
    "Time in business, credit, cash flow vs payment—plain-English filters with a worked revenue example, plus Toollabz’s business loan eligibility calculator for a quick pre-read.",
  title: "Business loans: the quiet checklist behind the friendly call",
  excerpt:
    "Revenue sounds big until expenses and debt service eat it. Here’s a blunt pattern-match frame before you chase paperwork.",
  publishedAt: "2026-04-11",
  relatedToolSlugs: ["business-loan-eligibility-calculator", "profit-margin-calculator-business", "break-even-calculator-business", "loan-calculator"],
  Article,
};
