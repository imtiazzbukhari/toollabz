import Link from "next/link";
import { TOP_LOAN_PRINCIPAL_LINKS, loanPrincipalPublicPath } from "@/lib/programmatic-seo/popular-numeric";
import { toolGlassCard } from "@/lib/tool-ui";

const SALARY_COUNTRY_TOOLS = [
  { href: "/tools/salary-after-tax-calculator-uk", label: "UK (PAYE, National Insurance)" },
  { href: "/tools/paycheck-calculator-usa", label: "USA (federal + FICA)" },
  { href: "/tools/paycheck-calculator-california", label: "California" },
  { href: "/tools/paycheck-calculator-texas", label: "Texas" },
  { href: "/tools/salary-after-tax-calculator-new-york", label: "New York" },
  { href: "/tools/salary-after-tax-calculator-florida", label: "Florida" },
] as const;

type Variant = "loan" | "salary" | "both";

export default function PopularCalculationsBlock({
  variant,
  compact,
}: {
  variant: Variant;
  /** When true, drop top margin so the block nests cleanly under category spotlights. */
  compact?: boolean;
}) {
  const showLoan = variant === "loan" || variant === "both";
  const showSalary = variant === "salary" || variant === "both";

  return (
    <section
      className={`space-y-4 ${compact ? "mt-0" : "mt-12"}`}
      aria-labelledby="popular-calculations-heading"
    >
      <h2 id="popular-calculations-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
        Popular calculations
      </h2>
      <div className={`p-6 sm:p-8 ${toolGlassCard}`}>
        <p className="text-sm leading-relaxed text-slate-600">
          Jump straight to the calculator that matches your situation.
        </p>
        {showLoan ? (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-900">Loan principal benchmarks</h3>
            <ul className="mt-2 flex flex-wrap gap-2 text-sm">
              {TOP_LOAN_PRINCIPAL_LINKS.map((n) => (
                <li key={n}>
                  <Link
                    href={loanPrincipalPublicPath(n)}
                    className="rounded-lg border border-violet-200/70 bg-white/80 px-3 py-1.5 font-medium text-violet-800 transition hover:border-violet-300 hover:bg-violet-50"
                  >
                    ${n.toLocaleString("en-US")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {showSalary ? (
          <div className={showLoan ? "mt-5" : "mt-0"}>
            <h3 className="text-sm font-semibold text-slate-900">Take-home pay by country or state</h3>
            <ul className="mt-2 flex flex-wrap gap-2 text-sm">
              {SALARY_COUNTRY_TOOLS.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="rounded-lg border border-violet-200/70 bg-white/80 px-3 py-1.5 font-medium text-violet-800 transition hover:border-violet-300 hover:bg-violet-50"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
