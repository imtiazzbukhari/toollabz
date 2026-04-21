import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        Television loves a giant number on the screen. Real files start with boring PDFs: emergency bills, ortho follow-ups, missed shifts, a W-2 trail. Adjusters live in that world first. “Pain and suffering” enters later—and it fights with policy limits, fault splits, and how credible the specials look on paper.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Economic damages are the floor people actually argue</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Think documented medical, reasonable future care estimates, lost wages, projected earning hit if you can support it. That stack is your hard spine. Non-economic multipliers sit on top in negotiation stories, but a $25k UM policy does not pay $400k because a blog said so.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Sketch: $18.5k specials, moderate injury, 80% other-side fault</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Suppose specials land around <strong className="font-semibold text-slate-800">$18,500</strong> and you model moderate severity for discussion purposes. A rough band might land in the mid five figures before fees—then fault shaves your side. Change the fault percentage and watch the band move. That sensitivity is the point.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/personal-injury-settlement-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          personal injury settlement calculator
        </Link>{" "}
        is arithmetic on your inputs, not a case evaluation. Talk to a licensed attorney before you sign anything.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">FAQ</h2>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Is this legal advice?</h3>
      <p className="mt-2 leading-7 text-slate-700">No. It’s a calculator. Your state’s rules, discovery, and insurer strategy matter more than any web form.</p>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">Why do settlements cluster?</h3>
      <p className="mt-2 leading-7 text-slate-700">
        Policy caps, liens, and willingness to file suit create ceilings and floors. Two similar injuries can end wildly different because of coverage, not because math changed.
      </p>
    </>
  );
}

export const personalInjurySettlementRealityPost: BlogPostDefinition = {
  slug: "personal-injury-settlement-specials-and-limits",
  seoTitle: "Personal Injury Settlements: Why Specials Matter More Than a Multiplier",
  description:
    "How medical bills and lost wages anchor US injury talks, why policy limits matter, and how to use Toollabz’s personal injury settlement calculator as math only—not legal advice.",
  title: "Personal injury settlements: the boring paperwork that drives the number",
  excerpt:
    "Before pain-and-suffering multipliers, there are bills, wages, and fault. Here’s how to think in ranges without confusing a calculator for counsel.",
  publishedAt: "2026-04-11",
  relatedToolSlugs: ["personal-injury-settlement-calculator", "slip-and-fall-settlement-calculator", "truck-accident-settlement-calculator", "settlement-calculator"],
  Article,
};
