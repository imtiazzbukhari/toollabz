import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import PremiumPageShell from "@/components/PremiumPageShell";
import { toolGlassPanel } from "@/lib/tool-ui";
import { PROGRAMMATIC_LOAN_PRINCIPALS, isValidLoanPrincipal } from "@/lib/programmatic-seo/amount-routes";
import { capStaticParams } from "@/lib/build/static-generation";
import {
  loanPrincipalCanonicalPath,
  loanPrincipalFaqs,
  loanPrincipalKeyTakeaways,
  loanPrincipalMetadata,
  loanPrincipalParagraphs,
  loanPrincipalScenarios,
} from "@/lib/programmatic-seo/loan-principal-landing";
import { breadcrumbJsonLd, faqPageSchemaFromPairs, webPageSchema } from "@/lib/seo";
import PageLastUpdated from "@/components/PageLastUpdated";
import PopularCalculationsBlock from "@/components/PopularCalculationsBlock";
import { loanPrincipalValueTier, shouldIndexProgrammatic } from "@/lib/programmatic-seo/value-tier";

export const dynamicParams = true;

export async function generateStaticParams() {
  return capStaticParams(PROGRAMMATIC_LOAN_PRINCIPALS.map((amount) => ({ amount: String(amount) })));
}

export async function generateMetadata({ params }: { params: Promise<{ amount: string }> }) {
  const { amount } = await params;
  const n = Number(amount);
  if (!Number.isFinite(n) || !isValidLoanPrincipal(n)) return {};
  // High + medium: unique principal scenarios → index (self-canonical). Low only would consolidate.
  const indexable = shouldIndexProgrammatic(loanPrincipalValueTier(n));
  const meta = loanPrincipalMetadata(n);
  return {
    ...meta,
    robots: { index: indexable, follow: true },
    alternates: {
      ...(meta.alternates ?? {}),
      canonical: indexable ? loanPrincipalCanonicalPath(n) : "/tools/loan-calculator",
    },
  };
}

export default async function LoanPrincipalProgrammaticPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = await params;
  const n = Number(amount);
  if (!Number.isFinite(n) || !isValidLoanPrincipal(n)) notFound();

  const path = loanPrincipalCanonicalPath(n);
  const paras = loanPrincipalParagraphs(n);
  const faqs = loanPrincipalFaqs(n);
  const takeaways = loanPrincipalKeyTakeaways(n);
  const scenarios = loanPrincipalScenarios(n);
  const title = `Loan calculator - $${n.toLocaleString("en-US")} principal`;
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All tools", path: "/tools" },
    { name: "Finance tools", path: "/finance-tools" },
    { name: `Loan $${n.toLocaleString("en-US")}`, path },
  ]);

  return (
    <PremiumPageShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-violet-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <Link href="/tools" className="transition hover:text-violet-600">
            Tools
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <Link href="/finance-tools" className="transition hover:text-violet-600">
            Finance tools
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <span className="font-medium text-slate-700">Loan ${n.toLocaleString("en-US")}</span>
        </nav>
        <PageLastUpdated className="mb-4" />

        <article className={`space-y-6 p-6 sm:p-8 ${toolGlassPanel}`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Loan principal guide</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
            <p className="mt-4 text-lg font-medium text-slate-800">
              Quick answer: at 7.49% APR over 5 years, ${n.toLocaleString("en-US")} is about $
              {Math.round(scenarios[1]!.monthly).toLocaleString("en-US")}/month (principal and interest only).
            </p>
            <p className="mt-3 text-slate-600">
              Open the{" "}
              <Link href="/tools/loan-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                full loan calculator
              </Link>{" "}
              with your quote APR, or compare{" "}
              <Link
                href="/tools/credit-card-payoff-calculator"
                className="font-medium text-violet-700 underline-offset-2 hover:underline"
              >
                credit card payoff
              </Link>{" "}
              if you are consolidating revolving debt.
            </p>
          </div>

          <section aria-labelledby="loan-scenarios-heading">
            <h2 id="loan-scenarios-heading" className="text-xl font-bold text-slate-900">
              Payment scenarios for ${n.toLocaleString("en-US")}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Illustrative amortization only — fees, insurance, and taxes are excluded.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2 pr-4 font-semibold">APR</th>
                    <th className="py-2 pr-4 font-semibold">Term</th>
                    <th className="py-2 pr-4 font-semibold">Monthly</th>
                    <th className="py-2 pr-4 font-semibold">Total interest</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((row) => (
                    <tr key={`${row.apr}-${row.termYears}`} className="border-b border-slate-100">
                      <td className="py-2.5 pr-4">{row.apr.toFixed(2)}%</td>
                      <td className="py-2.5 pr-4">{row.termYears} years</td>
                      <td className="py-2.5 pr-4 font-medium text-slate-900">
                        ${Math.round(row.monthly).toLocaleString("en-US")}
                      </td>
                      <td className="py-2.5 pr-4">${Math.round(row.totalInterest).toLocaleString("en-US")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="loan-takeaways-heading">
            <h2 id="loan-takeaways-heading" className="text-xl font-bold text-slate-900">
              Key takeaways
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base">
              {takeaways.map((t) => (
                <li key={t.slice(0, 48)}>{t}</li>
              ))}
            </ul>
          </section>

          <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            {paras.map((p, i) => (
              <p key={`lp-${n}-${i}`}>{p}</p>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">FAQs</h2>
            <dl className="mt-4 space-y-4 text-sm text-slate-600">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-slate-900">{faq.question}</dt>
                  <dd className="mt-1">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p>
            <Link
              href="/tools/loan-calculator"
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
            >
              Open loan calculator
            </Link>
          </p>
          <PopularCalculationsBlock variant="loan" compact />
        </article>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema({ name: title, description: paras[0] ?? title, path })),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchemaFromPairs(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </PremiumPageShell>
  );
}
