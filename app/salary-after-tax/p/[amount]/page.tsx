import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import PremiumPageShell from "@/components/PremiumPageShell";
import { toolGlassPanel } from "@/lib/tool-ui";
import { PROGRAMMATIC_SALARY_GROSS, isValidSalaryGross } from "@/lib/programmatic-seo/amount-routes";
import { capStaticParams } from "@/lib/build/static-generation";
import {
  salaryGrossCanonicalPath,
  salaryGrossFaqs,
  salaryGrossKeyTakeaways,
  salaryGrossMetadata,
  salaryGrossParagraphs,
  salaryGrossScenarios,
} from "@/lib/programmatic-seo/salary-gross-landing";
import { breadcrumbJsonLd, faqPageSchemaFromPairs, webPageSchema } from "@/lib/seo";
import PageLastUpdated from "@/components/PageLastUpdated";
import PopularCalculationsBlock from "@/components/PopularCalculationsBlock";
import { salaryGrossValueTier, shouldIndexProgrammatic } from "@/lib/programmatic-seo/value-tier";

export const dynamicParams = true;

export async function generateStaticParams() {
  return capStaticParams(PROGRAMMATIC_SALARY_GROSS.map((amount) => ({ amount: String(amount) })));
}

export async function generateMetadata({ params }: { params: Promise<{ amount: string }> }) {
  const { amount } = await params;
  const n = Number(amount);
  if (!Number.isFinite(n) || !isValidSalaryGross(n)) return {};
  // High + medium amounts have unique scenario tables → index. Sitemap lists high tier only.
  const indexable = shouldIndexProgrammatic(salaryGrossValueTier(n));
  const meta = salaryGrossMetadata(n);
  return {
    ...meta,
    robots: { index: indexable, follow: true },
    alternates: {
      ...(meta.alternates ?? {}),
      canonical: indexable ? salaryGrossCanonicalPath(n) : "/tools/salary-after-tax-calculator",
    },
  };
}

export default async function SalaryGrossProgrammaticPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = await params;
  const n = Number(amount);
  if (!Number.isFinite(n) || !isValidSalaryGross(n)) notFound();

  const path = salaryGrossCanonicalPath(n);
  const paras = salaryGrossParagraphs(n);
  const faqs = salaryGrossFaqs(n);
  const takeaways = salaryGrossKeyTakeaways(n);
  const scenarios = salaryGrossScenarios(n);
  const title = `Salary after tax - $${n.toLocaleString("en-US")} gross`;
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All tools", path: "/tools" },
    { name: "Finance tools", path: "/finance-tools" },
    { name: `Salary $${n.toLocaleString("en-US")}`, path },
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
          <span className="font-medium text-slate-700">Salary ${n.toLocaleString("en-US")}</span>
        </nav>
        <PageLastUpdated className="mb-4" />

        <article className={`space-y-6 p-6 sm:p-8 ${toolGlassPanel}`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Salary planning guide</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
            <p className="mt-4 text-lg font-medium text-slate-800">
              Quick answer: at an illustrative 28% effective rate, ${n.toLocaleString("en-US")} gross is about $
              {Math.round(scenarios[1]!.annualNet).toLocaleString("en-US")}/year net (~$
              {Math.round(scenarios[1]!.monthlyNet).toLocaleString("en-US")}/month).
            </p>
            <p className="mt-3 text-slate-600">
              Open the{" "}
              <Link
                href="/tools/salary-after-tax-calculator"
                className="font-medium text-violet-700 underline-offset-2 hover:underline"
              >
                salary after tax calculator
              </Link>
              , try a{" "}
              <Link
                href="/tools/salary-after-tax-calculator-uk"
                className="font-medium text-violet-700 underline-offset-2 hover:underline"
              >
                UK variant
              </Link>
              , or compare{" "}
              <Link href="/tools/paycheck-calculator-usa" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                US paycheck
              </Link>{" "}
              flows. Glossary:{" "}
              <Link href="/glossary/take-home-pay" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                take-home pay
              </Link>
              .
            </p>
          </div>

          <section aria-labelledby="salary-scenarios-heading">
            <h2 id="salary-scenarios-heading" className="text-xl font-bold text-slate-900">
              Illustrative take-home scenarios for ${n.toLocaleString("en-US")}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Not jurisdiction-specific tax law—use regional calculators for bands and NI/FICA.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2 pr-4 font-semibold">Scenario</th>
                    <th className="py-2 pr-4 font-semibold">Effective rate</th>
                    <th className="py-2 pr-4 font-semibold">Annual net</th>
                    <th className="py-2 pr-4 font-semibold">Monthly net</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((row) => (
                    <tr key={row.label} className="border-b border-slate-100">
                      <td className="py-2.5 pr-4">{row.label}</td>
                      <td className="py-2.5 pr-4">{row.effectiveRatePct}%</td>
                      <td className="py-2.5 pr-4 font-medium text-slate-900">
                        ${Math.round(row.annualNet).toLocaleString("en-US")}
                      </td>
                      <td className="py-2.5 pr-4">${Math.round(row.monthlyNet).toLocaleString("en-US")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="salary-takeaways-heading">
            <h2 id="salary-takeaways-heading" className="text-xl font-bold text-slate-900">
              Key takeaways
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-base">
              {takeaways.map((t) => (
                <li key={t.slice(0, 40)}>{t}</li>
              ))}
            </ul>
          </section>

          <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            {paras.map((p, i) => (
              <p key={`sg-${n}-${i}`}>{p}</p>
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
              href="/tools/salary-after-tax-calculator"
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
            >
              Open salary after tax calculator
            </Link>
          </p>
          <PopularCalculationsBlock variant="salary" compact />
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
