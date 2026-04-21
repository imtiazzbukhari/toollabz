import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        “Forgiveness” is not one button on a government website. PSLF is a decade-long human resources story with loan-type footnotes. Income-driven repayment forgiveness is a different calendar with different political risk. Mixing them up is how people wake up surprised in year seven.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">PSLF in one breath—then the footnotes</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Roughly: qualifying employment, qualifying loans, qualifying payments, 120 of them, paperwork that proves it. Private loans need not apply. Consolidation can fix—or poison—eligibility depending on what you consolidated and when. If that sentence stressed you out, good; details matter more than memes.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">IDR forgiveness is patience as a strategy</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Long-run forgiveness under income-driven plans trades smaller payments now for a multi-decade horizon—and tax treatment has bounced with Congress. It’s a cash-flow decision with tail risk, not a morality play.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Map your employer type and how many years you’ve already paid in the{" "}
        <Link href="/tools/student-loan-forgiveness-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          student loan forgiveness calculator
        </Link>
        . Then verify everything boring at StudentAid.gov.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">FAQ</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Does this certify PSLF?</h3>
      <p className="mt-2 leading-7 text-slate-700">No. Only FedLoan / MOHELA style servicing history and employer certification do that.</p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Should I consolidate?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Sometimes yes for PSLF alignment, sometimes catastrophic for interest capitalization. Do not click buttons off a blog—call your servicer with notes.
      </p>
    </>
  );
}

export const studentLoanForgivenessRoadmapPost: BlogPostDefinition = {
  slug: "student-loan-forgiveness-pslf-vs-idr-usa",
  seoTitle: "Student Loan Forgiveness (USA): PSLF vs Long IDR—Different Clocks",
  description:
    "Why PSLF and income-driven forgiveness are not the same path, what actually has to line up for PSLF, and how to pair reading with Toollabz’s student loan forgiveness calculator.",
  title: "Student loan forgiveness: two programs, two timelines, zero patience",
  excerpt:
    "PSLF is a 10-year employment and payment story; IDR forgiveness is a longer game with different risks—here’s how to stop confusing them.",
  publishedAt: "2026-04-11",
  relatedToolSlugs: ["student-loan-forgiveness-calculator", "loan-calculator", "early-loan-payoff-calculator", "budget-planner-monthly-usa"],
  Article,
};
