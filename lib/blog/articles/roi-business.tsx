import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        “What was the ROI on Q2?” is a fair question. “We did <strong className="font-semibold text-slate-800">$19k</strong> in
        revenue so ROI is infinite” is not an answer - it’s a vibe. Business ROI gets messy because attribution is political and
        margin is someone else’s spreadsheet tab. I still run the simple version first; if the simple version is embarrassing,
        the fancy dashboard won’t save the story.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Fence the cost to the experiment</h2>
      <p className="mt-3 leading-7 text-slate-700">
        For one campaign, cost should be the cash that wouldn’t have been spent if the campaign didn’t exist - ads, creative,
        that landing-page experiment, the contractor who set up tracking. Not your entire office lease. I once saw a deck allocate{" "}
        <strong className="font-semibold text-slate-800">12%</strong> of “brand team salary” to every initiative; maybe that’s
        your accounting policy, but then apply it consistently or you’re comparing apples to tax forms.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Suppose paid search + creative for a month was <strong className="font-semibold text-slate-800">$6,500</strong>. That’s
        your denominator candidate unless you have a cleaner definition you can defend out loud.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Revenue is bragging; margin is closer to truth</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Say you attribute <strong className="font-semibold text-slate-800">$19,000</strong> in revenue to that spend. Cool slide.
        If variable costs eat <strong className="font-semibold text-slate-800">60%</strong>, gross profit attributable is about{" "}
        <strong className="font-semibold text-slate-800">$7,600</strong>. Subtract the{" "}
        <strong className="font-semibold text-slate-800">$6,500</strong> spend and you’re left with roughly{" "}
        <strong className="font-semibold text-slate-800">$1,100</strong> - still positive, far less cinematic. ROI on the{" "}
        <strong className="font-semibold text-slate-800">$6,500</strong> is about <strong className="font-semibold text-slate-800">17%</strong>, not
        whatever story you’d tell if you divided revenue by spend.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Change margin to <strong className="font-semibold text-slate-800">35%</strong> and the same revenue barely clears cost.
        That sensitivity is why I roll my eyes when people treat top-line attribution as profit.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Where the calculators live</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Know gain and cost already? The{" "}
        <Link href="/tools/roi-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          ROI calculator
        </Link>{" "}
        is enough. Living in marketing-English? The{" "}
        <Link href="/tools/roi-calculator-marketing" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          marketing ROI calculator
        </Link>{" "}
        matches how media teams talk about campaign gain vs spend.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        If ROI looks fine but cash feels awful, pair with{" "}
        <Link href="/tools/profit-margin-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          profit margin
        </Link>{" "}
        work - timing and COGS hide in there.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Stuff I won’t pretend to solve in 800 words</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Brand campaigns with fuzzy lift: track what you can, label the rest as strategic, stop forcing a fake single ROI number
        you’ll regret defending in January.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        Founder time has a cost; if you’re arguing with investors, either estimate loaded hours or exclude it - but don’t mix
        methods across two slides.
      </p>
      <p className="mt-3 text-sm text-slate-500">
        Still not GAAP advice. Your finance partner owns the final word.
      </p>
    </>
  );
}

export const roiBusinessPost: BlogPostDefinition = {
  slug: "how-to-calculate-roi-business",
  seoTitle: "How to Calculate ROI for Your Business (Without Lying With Revenue)",
  description:
    "Campaign ROI with receipts: $6.5k spend, $19k attributed revenue, margin-sensitive profit, ~17% ROI when margin is 40% - plus marketing and margin tools.",
  title: "How to calculate ROI for your business",
  excerpt:
    "Top-line attribution is a party trick. Here’s a margin-first way to sanity-check whether a campaign actually cleared the bar.",
  publishedAt: "2026-04-14",
  relatedToolSlugs: ["roi-calculator-marketing", "profit-margin-calculator-business", "cac-calculator-saas"],
  Article,
};
