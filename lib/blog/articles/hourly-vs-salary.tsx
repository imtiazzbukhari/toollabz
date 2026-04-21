import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        2,080 hours - 52 weeks times 40 - is the industry shortcut. Nobody I know works exactly that shape. PTO exists. Crunch exists.
        “Optional” Friday meetings exist. I still use 2,080 as a first pass because it’s the common language on both sides of the
        offer conversation; just remember it’s a convention, not a confession of how you’ll actually spend the year.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Salary → implied hourly</h2>
      <p className="mt-3 leading-7 text-slate-700">
        <strong className="font-semibold text-slate-800">$91,520</strong> ÷ 2,080 ≈ <strong className="font-semibold text-slate-800">$44/hr</strong>. If
        you’re routinely doing <strong className="font-semibold text-slate-800">47.5</strong> billable-ish hours, the same salary is
        spread over <strong className="font-semibold text-slate-800">2,470</strong> hours a year and the implied rate drops to about{" "}
        <strong className="font-semibold text-slate-800">$37.05</strong>. Same paycheck, worse story - burnout has a mathy side.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Hourly → fake salary (useful anyway)</h2>
      <p className="mt-3 leading-7 text-slate-700">
        <strong className="font-semibold text-slate-800">$52/hr</strong> × 2,080 = <strong className="font-semibold text-slate-800">$108,160</strong>{" "}
        “equivalent.” Add five hours of time-and-a-half every week: <strong className="font-semibold text-slate-800">5 × $52 × 1.5 = $390/week</strong> in
        OT pay → <strong className="font-semibold text-slate-800">$390 × 52 ≈ $20,280/year</strong> on top of the straight-time stack, before taxes.
        Overtime rules aren’t universal - know if you’re even eligible.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Let the site do the boring division</h2>
      <p className="mt-3 leading-7 text-slate-700">
        The{" "}
        <Link href="/tools/salary-to-hourly-converter-usa" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          salary to hourly converter (USA)
        </Link>{" "}
        and{" "}
        <Link href="/tools/hourly-to-salary-converter-usa" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          hourly to salary converter (USA)
        </Link>{" "}
        exist because nobody should do 2,080 math at 11 p.m. while negotiating.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        For take-home on the W-2 path, stack the{" "}
        <Link href="/tools/paycheck-calculator-usa" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          paycheck calculator (USA)
        </Link>{" "}
        after you’ve picked a gross story. 1099 is a different animal - quarterlies, insurance, equipment - and deserves its own
        notebook, not a paragraph wedged in here.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Opinions I’ll own</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Higher hourly with zero benefits and infinite admin isn’t automatically winning. Salaried with PTO and sane boundaries
        can be cheaper per real hour of life even when the headline rate looks lower.
      </p>
      <p className="mt-3 leading-7 text-slate-700">
        State lines matter - CA and TX are not the same tax universe. We’ve got state-flavored paycheck tools in the directory if
        you need something closer to home.
      </p>
    </>
  );
}

export const hourlyVsSalaryPost: BlogPostDefinition = {
  slug: "hourly-vs-salary-comparison",
  seoTitle: "Hourly vs Salary: How to Compare Offers Without Math Regret",
  description:
    "Beyond 2,080: $91.5k as $44/hr, overtime stacking $52/hr, converters + paycheck calculator links, and why headline rates lie.",
  title: "Hourly vs salary: a comparison that uses real hours",
  excerpt:
    "Same salary, different hours - implied rate moves $7/hr without your employer ‘giving’ a raise. Plus OT back-of-envelope math.",
  publishedAt: "2026-04-15",
  relatedToolSlugs: ["hourly-to-salary-converter-usa", "salary-to-hourly-converter-usa", "paycheck-calculator-usa"],
  Article,
};
