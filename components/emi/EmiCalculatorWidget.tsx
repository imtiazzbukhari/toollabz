"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Clock3, ShieldCheck, Sparkles, Zap } from "lucide-react";

type HistoryItem = {
  id: string;
  emi: number;
  principal: number;
  interestRate: number;
  months: number;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const faqItems = [
  {
    q: "Is the EMI Calculator free to use?",
    a: "Yes. It is free with no sign-up required.",
  },
  {
    q: "Can I use it on mobile?",
    a: "Yes, the calculator and result cards are fully responsive.",
  },
  {
    q: "How accurate is this calculator?",
    a: "It uses the standard amortized EMI formula. Final lender numbers may differ slightly due to fees and policy.",
  },
  {
    q: "What input format should I use?",
    a: "Use plain numeric values for principal, annual interest rate, and tenure in months or years.",
  },
  {
    q: "Can I share or download the result?",
    a: "You can copy values manually now. Export/share options can be added in the next update.",
  },
];

const featureBadges = [
  { label: "100% Free", Icon: Zap },
  { label: "No Sign Up", Icon: ShieldCheck },
  { label: "Accurate Results", Icon: Sparkles },
  { label: "Mobile Friendly", Icon: Clock3 },
] as const;

export default function EmiCalculatorWidget() {
  const [principal, setPrincipal] = useState("12500");
  const [rate, setRate] = useState("4");
  const [tenure, setTenure] = useState("15");
  const [unit, setUnit] = useState<"months" | "years">("months");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openFaq, setOpenFaq] = useState<number>(0);

  const derived = useMemo(() => {
    const p = Number(principal) || 0;
    const annual = Number(rate) || 0;
    const rawTenure = Number(tenure) || 0;
    const months = unit === "years" ? rawTenure * 12 : rawTenure;

    if (p <= 0 || months <= 0) {
      return {
        emi: 0,
        totalAmount: 0,
        totalInterest: 0,
        monthlyRate: annual / 12 / 100,
        months,
      };
    }

    const monthlyRate = annual / 12 / 100;
    const emi =
      monthlyRate === 0
        ? p / months
        : (p * monthlyRate * (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - p;

    return { emi, totalAmount, totalInterest, monthlyRate, months };
  }, [principal, rate, tenure, unit]);

  const onCalculate = () => {
    if (!derived.emi) return;
    setHistory((prev) =>
      [
        {
          id: `${Date.now()}`,
          emi: derived.emi,
          principal: Number(principal) || 0,
          interestRate: Number(rate) || 0,
          months: derived.months,
        },
        ...prev,
      ].slice(0, 6),
    );
  };

  const badgeClass =
    "inline-flex items-center gap-1.5 rounded-full border border-violet-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700";
  const cardClass =
    "rounded-2xl border border-violet-200/50 bg-white/70 shadow-[0_8px_24px_rgba(76,29,149,0.08)] backdrop-blur-sm";

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        <div className={cardClass}>
          <div className="border-b border-violet-200/50 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900">Calculate your EMI</h2>
            <p className="mt-1 text-xs text-slate-500">Enter the details below to see your monthly installment.</p>
          </div>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Principal Amount</span>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full rounded-xl border border-violet-200/70 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Interest Rate (%)</span>
              <input
                type="number"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full rounded-xl border border-violet-200/70 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
              />
            </label>

            <div className="grid grid-cols-[1fr_120px] gap-3">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Loan Tenure</span>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full rounded-xl border border-violet-200/70 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700">Unit</span>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "months" | "years")}
                  className="w-full rounded-xl border border-violet-200/70 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                >
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={onCalculate}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.35)] transition hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Calculate EMI
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between border-b border-violet-200/50 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Results</h2>
              <p className="mt-1 text-xs text-slate-500">Breakdown of your EMI</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock3 className="h-3.5 w-3.5" aria-hidden />
              History
            </span>
          </div>

          <div className="space-y-4 px-5 py-5 sm:px-6">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-violet-600">Monthly EMI</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900">
                {money(derived.emi || 0)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-violet-200/60 bg-white/80 p-3 text-center">
                <p className="text-[11px] text-slate-500">Principal</p>
                <p className="mt-1 text-sm font-bold text-violet-700">{money(Number(principal) || 0)}</p>
              </div>
              <div className="rounded-xl border border-violet-200/60 bg-white/80 p-3 text-center">
                <p className="text-[11px] text-slate-500">Total Interest</p>
                <p className="mt-1 text-sm font-bold text-emerald-700">{money(derived.totalInterest || 0)}</p>
              </div>
              <div className="rounded-xl border border-violet-200/60 bg-white/80 p-3 text-center">
                <p className="text-[11px] text-slate-500">Total Amount</p>
                <p className="mt-1 text-sm font-bold text-blue-700">{money(derived.totalAmount || 0)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-violet-200/60 pt-3 text-sm">
              <p className="text-slate-600">
                Interest Rate
                <span className="block font-semibold text-slate-900">{Number(rate) || 0}% p.a.</span>
              </p>
              <p className="text-slate-600">
                Tenure
                <span className="block font-semibold text-slate-900">{derived.months} Months</span>
              </p>
            </div>

            {!!history.length && (
              <div className="rounded-xl border border-violet-200/60 bg-white/80 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-600">Recent</p>
                <ul className="space-y-1.5">
                  {history.map((item) => (
                    <li key={item.id} className="text-xs text-slate-600">
                      EMI {money(item.emi)} • {item.interestRate}% • {item.months}m
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <p className="mt-4 text-center text-xs text-slate-500">
        * This is an estimate. Actual amounts may vary slightly based on lender policy.
      </p>

      <section className={`${cardClass} mt-8 p-6 sm:p-8`}>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">About EMI Calculator</h2>
            <p className="mt-3 leading-7 text-slate-600">
              This EMI Calculator helps you estimate monthly loan installments in seconds, so you can plan repayments
              before committing to a loan. Instead of manually checking formulas in spreadsheets, you enter principal,
              annual interest rate, and tenure, then instantly get monthly EMI, total interest, and total payable
              amount. It is especially useful when comparing two lenders or testing different tenure options to see how
              overall borrowing cost changes over time. For practical decision-making, the key is not just lowest EMI,
              but the balance between monthly affordability and long-term interest burden.
            </p>
            <p className="mt-3 leading-7 text-slate-600">
              The calculator uses a standard amortization approach commonly used in personal, auto, and home loans.
              You can run multiple scenarios quickly: increase down payment, reduce loan term, or test a smaller rate
              change to evaluate impact. This is helpful for salaried borrowers, freelancers, and finance teams who
              need fast what-if simulations. The interface is mobile-friendly, lightweight, and privacy-conscious, so
              you can check results anytime without account friction. Use the output as a planning benchmark, and
              confirm final figures with your lender, especially where fees, insurance, or taxes apply.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-xl border border-violet-200/60 bg-white/80 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Zap className="h-4 w-4 text-violet-600" aria-hidden />
                Instant calculation
              </p>
              <p className="mt-1 text-xs text-slate-600">Get results in real time.</p>
            </div>
            <div className="rounded-xl border border-violet-200/60 bg-white/80 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Calculator className="h-4 w-4 text-violet-600" aria-hidden />
                Accurate formulas
              </p>
              <p className="mt-1 text-xs text-slate-600">Uses standard amortized EMI logic.</p>
            </div>
            <div className="rounded-xl border border-violet-200/60 bg-white/80 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-violet-600" aria-hidden />
                Privacy friendly
              </p>
              <p className="mt-1 text-xs text-slate-600">No sign-up, no personal profile needed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className={cardClass}>
          <div className="border-b border-violet-200/50 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900">How to use</h2>
          </div>
          <ol className="space-y-3 px-5 py-5 sm:px-6">
            {[
              "Enter the loan amount you want to borrow.",
              "Add the annual interest rate offered by your lender.",
              "Choose your loan tenure in months or years.",
              "Click Calculate EMI to view monthly installment instantly.",
            ].map((step, idx) => (
              <li key={step} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between border-b border-violet-200/50 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-slate-900">FAQs</h2>
            <span className="text-xs text-slate-500">View all</span>
          </div>
          <div className="px-5 py-4 sm:px-6">
            {faqItems.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <div key={item.q} className="border-b border-violet-100 py-2 last:border-none">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 py-1 text-left text-sm font-medium text-slate-800"
                    onClick={() => setOpenFaq(open ? -1 : idx)}
                  >
                    <span>{item.q}</span>
                    <span className="text-violet-500">{open ? "−" : "+"}</span>
                  </button>
                  {open && <p className="pt-1 pb-2 text-sm text-slate-600">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-center text-xl font-bold text-slate-900">Related tools</h2>
        <p className="mt-1 text-center text-sm text-slate-600">Try these popular tools that might help you.</p>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["loan-calculator", "Loan Calculator", "Calculate monthly loan payment"],
          ["compound-interest-calculator", "Compound Interest", "Calculate growth over time"],
          ["salary-after-tax-calculator", "Salary After Tax", "See your estimated take-home"],
          ["mortgage-affordability-calculator", "Mortgage Calculator", "Plan your home loan"],
          ["stock-profit-calculator", "Interest Calculator", "Simple investment estimate"],
        ].map(([slug, title, desc]) => (
          <Link
            key={slug}
            href={`/tools/${slug}`}
            className={`${cardClass} group block p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(76,29,149,0.12)]`}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Calculator className="h-4 w-4" aria-hidden />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-1 text-xs text-slate-600">{desc}</p>
            <span className="mt-3 inline-flex text-xs font-semibold text-violet-600 transition group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {featureBadges.map(({ label, Icon }) => (
          <span key={label} className={badgeClass}>
            <Icon className="h-3.5 w-3.5 text-violet-600" aria-hidden />
            {label}
          </span>
        ))}
      </div>
    </>
  );
}
