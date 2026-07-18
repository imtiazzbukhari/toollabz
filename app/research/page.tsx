import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import PageLastUpdated from "@/components/PageLastUpdated";

export const metadata: Metadata = {
  title: "UK Financial Data Reference 2026 | Toollabz Research",
  description:
    "Free reference tables for UK tax thresholds and sector salary context, plus links to Toollabz calculators. Cite with attribution. Verify live figures on GOV.UK and ONS.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "UK Financial Data Reference 2026 | Toollabz Research",
    description:
      "Original reference tables for UK tax thresholds and calculator workflows journalists and bloggers can cite with attribution.",
    url: absoluteUrl("/research"),
    type: "website",
  },
};

/** Workflow map only — no fabricated search volumes. */
const calculatorWorkflows = [
  ["VAT Calculator", "/tools/vat-calculator", "Net/gross VAT splits for freelancers and sellers"],
  ["Salary After Tax Calculator", "/tools/salary-after-tax-calculator", "Take-home planning before regional detail"],
  ["Loan Calculator", "/tools/loan-calculator", "Amortizing payment and interest scenarios"],
  ["Mortgage Affordability Calculator", "/tools/mortgage-affordability-calculator", "Income vs debt housing checks"],
  ["Profit Margin Calculator", "/tools/profit-margin-calculator", "Margin vs markup clarity for operators"],
  ["Compound Interest Calculator", "/tools/compound-interest-calculator", "Savings growth illustrations"],
] as const;

/**
 * Thresholds commonly cited for 2026/27 planning. Always re-check GOV.UK before publishing —
 * rates and bands can change mid-cycle.
 */
const taxRows = [
  ["Income tax personal allowance", "GBP 12,570", "https://www.gov.uk/income-tax-rates"],
  ["Basic rate income tax band (typical)", "20% up to higher-rate threshold", "https://www.gov.uk/income-tax-rates"],
  ["VAT standard rate", "20%", "https://www.gov.uk/vat-rates"],
  ["VAT reduced rate", "5%", "https://www.gov.uk/vat-rates"],
  ["VAT registration threshold", "Confirm live figure on GOV.UK", "https://www.gov.uk/vat-registration-thresholds"],
  ["Corporation tax main rate", "25% (confirm bands on GOV.UK)", "https://www.gov.uk/corporation-tax-rates"],
] as const;

const salaryRows = [
  ["Information and communication", "See latest ASHE table", "https://www.ons.gov.uk/"],
  ["Finance and insurance", "See latest ASHE table", "https://www.ons.gov.uk/"],
  ["Professional, scientific, technical", "See latest ASHE table", "https://www.ons.gov.uk/"],
  ["Construction", "See latest ASHE table", "https://www.ons.gov.uk/"],
  ["Education", "See latest ASHE table", "https://www.ons.gov.uk/"],
  ["Health and social work", "See latest ASHE table", "https://www.ons.gov.uk/"],
  ["Retail and wholesale", "See latest ASHE table", "https://www.ons.gov.uk/"],
] as const;

function DataTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-violet-100 bg-white/90">
      <table className="min-w-full text-left text-sm text-slate-700">
        <caption className="border-b border-violet-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-violet-700">
          {caption}
        </caption>
        <thead className="bg-slate-50 text-slate-900">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")} className="border-t border-violet-100">
              {row.map((cell, idx) => (
                <td key={`${row[0]}-${idx}`} className="px-4 py-3">
                  {cell.startsWith("http") ? (
                    <a
                      href={cell}
                      className="font-medium text-violet-800 underline-offset-2 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source
                    </a>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResearchPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Research", path: "/research" },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">Research</span>
      </nav>

      <header className={`mb-8 p-6 sm:p-8 ${toolGlassPanel}`}>
        <PageLastUpdated className="mb-3" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Toollabz Research</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          UK financial reference tables
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          Linkable reference for journalists, bloggers, and researchers: calculator workflows on Toollabz, plus tax
          thresholds with primary GOV.UK sources. We do not invent keyword volumes. Confirm every statutory figure on the
          linked authority page before you publish.
        </p>
      </header>

      <div className="space-y-8">
        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-2xl font-bold text-slate-900">High-intent calculator workflows</h2>
          <p className="mt-3 leading-7 text-slate-700">
            These are the calculators we maintain as topical hubs—not a claim about third-party search volume.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-violet-100 bg-white/90">
            <table className="min-w-full text-left text-sm text-slate-700">
              <caption className="border-b border-violet-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-violet-700">
                Calculator workflows
              </caption>
              <thead className="bg-slate-50 text-slate-900">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Tool
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Typical use
                  </th>
                </tr>
              </thead>
              <tbody>
                {calculatorWorkflows.map(([name, href, use]) => (
                  <tr key={href} className="border-t border-violet-100">
                    <td className="px-4 py-3">
                      <Link href={href} className="font-medium text-violet-800 underline-offset-2 hover:underline">
                        {name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-2xl font-bold text-slate-900">UK tax &amp; VAT checkpoints</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Planning checkpoints only. Band edges and thresholds change—use the Source links for the live HMRC/GOV.UK
            figure before citing in print.
          </p>
          <DataTable
            caption="UK tax and VAT reference (verify live)"
            headers={["Benchmark", "Planning note", "Source"]}
            rows={taxRows}
          />
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-2xl font-bold text-slate-900">UK salary by sector</h2>
          <p className="mt-3 leading-7 text-slate-700">
            We do not republish rounded medians that can go stale. Use the Office for National Statistics Annual Survey of
            Hours and Earnings (ASHE) tables for citable figures.
          </p>
          <DataTable
            caption="Where to find official sector pay"
            headers={["Sector", "Where to look", "Source"]}
            rows={salaryRows}
          />
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <h2 className="text-2xl font-bold text-slate-900">How to cite this page</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Source: Toollabz Research (
            <Link href="/research" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              toollabz.com/research
            </Link>
            ). You may cite short extracts with attribution and a link back. For tax numbers, cite GOV.UK/HMRC directly;
            for pay, cite ONS ASHE.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Related:{" "}
            <Link href="/methodology" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              Methodology
            </Link>
            {" · "}
            <Link href="/editorial-policy" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              Editorial policy
            </Link>
            {" · "}
            <Link href="/glossary" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              Glossary
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
