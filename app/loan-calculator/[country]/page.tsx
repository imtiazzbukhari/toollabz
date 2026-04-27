import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PremiumPageShell from "@/components/PremiumPageShell";
import { toolGlassPanel } from "@/lib/tool-ui";
import { capStaticParams } from "@/lib/build/static-generation";
import { breadcrumbJsonLd, siteUrl, webPageSchema } from "@/lib/seo";
import PageLastUpdated from "@/components/PageLastUpdated";
import PopularCalculationsBlock from "@/components/PopularCalculationsBlock";

const rates: Record<string, number> = {
  usa: 7.2,
  uk: 6.1,
  canada: 5.7,
  india: 9.5,
  pakistan: 18,
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return capStaticParams(Object.keys(rates).sort().map((country) => ({ country })));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  if (!rates[country]) return {};

  const label = country.toUpperCase();
  return {
    title: `Loan Calculator ${label} - Monthly Payment Estimates Instantly (Free)`,
    description: `Estimate monthly loan payments and repayment costs for ${label} with localized benchmark rates.`,
    alternates: {
      canonical: `/loan-calculator/${country}`,
    },
    openGraph: {
      title: `Loan Calculator ${label} - Monthly Payment Estimates Instantly (Free)`,
      description: `Estimate monthly loan payments and repayment costs for ${label}.`,
      url: `${siteUrl}/loan-calculator/${country}`,
      type: "article",
    },
  };
}

export default async function LoanCountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const rate = rates[country];
  if (!rate) notFound();

  const path = `/loan-calculator/${country}`;
  const pageTitle = `Loan calculator - ${country.toUpperCase()}`;
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All tools", path: "/tools" },
    { name: "Finance tools", path: "/finance-tools" },
    { name: `Loan ${country.toUpperCase()}`, path },
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
          <span className="font-medium text-slate-700">Loan - {country.toUpperCase()}</span>
        </nav>
        <PageLastUpdated className="mb-4" />

        <article className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Finance</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Loan calculator - {country.toUpperCase()}
          </h1>
          <p className="mt-4 text-slate-600">
            Reference interest rate: <strong className="text-slate-900">{rate}%</strong>
          </p>
          <p className="mt-6">
            <Link
              href="/tools/loan-calculator"
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
            >
              Open full loan calculator
            </Link>
          </p>
          <div className="mt-8">
            <PopularCalculationsBlock variant="loan" compact />
          </div>
        </article>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema({
              name: pageTitle,
              description: `Reference interest rate ${rate}% for ${country.toUpperCase()} loan calculator context.`,
              path,
            }),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </PremiumPageShell>
  );
}
