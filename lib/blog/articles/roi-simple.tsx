import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        <strong className="font-semibold text-slate-800">31.25%</strong> ROI sounds like a hedge fund flex until you realize it
        came from flipping a $2,400 project into a $750 profit. Percentages lie upward when the denominator is small. I still love
        ROI for quick comparisons - I just don’t let a big % seduce me without looking at dollars risked and dollars back.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">The version that fits on a sticky note</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Cost = cash you put in for this specific bet. Gain = what you walk away with minus that cost (after fees if you’re being
        decent). ROI% ≈ <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm text-slate-800">(gain / cost) × 100</code>.
        Time can be layered on later; don’t let perfect be the enemy of a useful snapshot.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Work the numbers once, slowly</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Parts and labor ran <strong className="font-semibold text-slate-800">$2,400</strong>. You sold for{" "}
        <strong className="font-semibold text-slate-800">$3,150</strong> net after marketplace fees. Gain ={" "}
        <strong className="font-semibold text-slate-800">$750</strong>. Divide by <strong className="font-semibold text-slate-800">$2,400</strong> →{" "}
        <strong className="font-semibold text-slate-800">31.25%</strong>. Punch it into the{" "}
        <Link href="/tools/roi-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          ROI calculator
        </Link>{" "}
        if you want the machine to agree with you.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">The mistake I still see in Slack threads</h2>
      <p className="mt-3 leading-7 text-slate-700">
        People type revenue as if it were gain. Revenue is the top line; gain is what’s left after the{" "}
        <strong className="font-semibold text-slate-800">$2,400</strong> (or whatever you spent). Confuse those and you’ll walk
        into a meeting defending a number that dissolves the second someone asks for a P&amp;L line.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Afterthoughts</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Negative ROI isn’t shameful - it’s information. If you annualize, say so; a 40% return in 9 days is not the same species as
        40% over four years.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        For funnel-shaped spend, the{" "}
        <Link href="/tools/roi-calculator-marketing" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          marketing ROI calculator
        </Link>{" "}
        and the business ROI write-up on this blog use vocabulary closer to ad dashboards - same muscle, different costume.
      </p>
    </>
  );
}

export const roiSimplePost: BlogPostDefinition = {
  slug: "how-to-calculate-roi",
  seoTitle: "How to Calculate ROI (Simple, With a Real Dollar Example)",
  description:
    "ROI without the hype: $2,400 in, $3,150 out, $750 gain, 31.25% - plus the revenue-vs-gain mistake and Toollabz’s ROI calculator.",
  title: "How to calculate ROI",
  excerpt:
    "Big percentages on small stakes are real but easy to misread. Here’s the sticky-note formula and a concrete flip example.",
  publishedAt: "2026-04-13",
  relatedToolSlugs: ["roi-calculator", "roi-calculator-marketing", "profit-margin-calculator-business"],
  Article,
};
