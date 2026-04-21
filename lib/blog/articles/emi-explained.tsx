import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="text-lg italic leading-relaxed text-slate-600">
        Month 1: “Why did almost nothing go to principal?”  - everyone, eventually.
      </p>
      <p className="mt-5 leading-7 text-slate-700">
        EMI (equated monthly installment) is the payment that wipes the balance at month <em>n</em> if the rate stays fixed and
        you pay on time. The emotional twist is amortization: early months are interest-heavy because interest accrues on the
        whole balance. That isn’t a secret fee; it’s how the algebra works. I wish someone had said that plainly before I stared
        at my first car statement.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">If you want the shape of the formula</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Monthly rate <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm text-slate-800">r = (APR/12)/100</code>. Count
        of payments <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm text-slate-800">n</code>. Principal{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm text-slate-800">P</code>. Payment scales like{" "}
        <code className="rounded bg-violet-100/80 px-1.5 py-0.5 text-sm text-slate-800">P·r·(1+r)^n / ((1+r)^n − 1)</code>. You
        will never need to hand-derive this unless you’re studying for an exam; phones exist.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">$12,000 · 9% · 36 months</h2>
      <p className="mt-3 leading-7 text-slate-700">
        Small enough to hold in your head. The{" "}
        <Link href="/tools/emi-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          EMI calculator
        </Link>{" "}
        should put the payment near <strong className="font-semibold text-slate-800">$381</strong>, total interest somewhere
        around <strong className="font-semibold text-slate-800">$1,720</strong> over the life of the loan (a buck or two either
        way is normal). Try bumping to <strong className="font-semibold text-slate-800">11%</strong> on the same principal and
        watch payment jump about <strong className="font-semibold text-slate-800">$35</strong> - rates aren’t linear in the way our
        brains want them to be.
      </p>

      <p className="mt-6 leading-7 text-slate-700">
        Prefer years in the UI?{" "}
        <Link href="/tools/loan-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Loan calculator
        </Link>
        . Same engine, different labels.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Three things people still argue about</h2>
      <p className="mt-4 border-l-2 border-violet-300/80 pl-4 leading-7 text-slate-700">
        <span className="font-semibold text-slate-900">Fixed vs floating.</span> Classic EMI assumes fixed rate until payoff.
        ARMs reset - different product, different stress.
      </p>
      <p className="mt-4 border-l-2 border-violet-300/80 pl-4 leading-7 text-slate-700">
        <span className="font-semibold text-slate-900">“Interest first.”</span> True early on; shifts toward principal later. Your
        amortization schedule is the receipt.
      </p>
      <p className="mt-4 border-l-2 border-violet-300/80 pl-4 leading-7 text-slate-700">
        <span className="font-semibold text-slate-900">Balloon at the end?</span> That’s not standard EMI. If the contract mentions
        a big final lump, read slowly.
      </p>
    </>
  );
}

export const emiExplainedPost: BlogPostDefinition = {
  slug: "emi-calculation-explained",
  seoTitle: "EMI Calculation Explained (Without the Spreadsheet Trauma)",
  description:
    "Why early payments feel like interest, the EMI formula in plain terms, a $12k/9%/36mo check you can run, and links to calculators.",
  title: "EMI calculation explained",
  excerpt:
    "Amortization isn’t a scam - it’s the math. Plus a small loan you can type in yourself to see the curve.",
  publishedAt: "2026-04-11",
  relatedToolSlugs: ["emi-calculator", "loan-calculator", "compound-interest-calculator"],
  Article,
};
