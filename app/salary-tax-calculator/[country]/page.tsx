import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PremiumPageShell from "@/components/PremiumPageShell";
import { toolGlassPanel } from "@/lib/tool-ui";
import { siteUrl } from "@/lib/seo";

const taxRates: Record<string, number> = {
  pakistan: 12,
  usa: 22,
  uk: 20,
  uae: 0,
  india: 15,
};

export async function generateStaticParams() {
  return Object.keys(taxRates).map((country) => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (taxRates[country] === undefined) return {};

  const label = country.toUpperCase();
  return {
    title: `Salary Tax Calculator ${label}`,
    description: `Estimate net salary and tax deductions for ${label} using benchmark regional rates.`,
    alternates: {
      canonical: `/salary-tax-calculator/${country}`,
    },
    openGraph: {
      title: `Salary Tax Calculator ${label}`,
      description: `Estimate net salary and tax deductions for ${label}.`,
      url: `${siteUrl}/salary-tax-calculator/${country}`,
      type: "article",
    },
  };
}

export default async function SalaryCountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const taxRate = taxRates[country];
  if (taxRate === undefined) notFound();

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
          <span className="font-medium text-slate-700">Salary tax - {country.toUpperCase()}</span>
        </nav>

        <article className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Finance</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Salary tax calculator - {country.toUpperCase()}
          </h1>
          <p className="mt-4 text-slate-600">
            Default tax benchmark: <strong className="text-slate-900">{taxRate}%</strong>
          </p>
          <p className="mt-6">
            <Link
              href="/tools/salary-after-tax-calculator"
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
            >
              Open salary after tax calculator
            </Link>
          </p>
        </article>
      </div>
    </PremiumPageShell>
  );
}
