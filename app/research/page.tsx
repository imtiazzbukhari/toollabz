import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";

export const metadata: Metadata = {
  title: "UK Financial Data Reference 2026 | Toollabz Research",
  description:
    "Free reference data on UK tax rates, salary benchmarks, and financial thresholds for 2026/27. Updated annually. Free to cite with attribution to Toollabz.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "UK Financial Data Reference 2026 | Toollabz Research",
    description:
      "Original reference data on UK calculators, tax thresholds, and salary benchmarks for journalists, bloggers, and researchers.",
    url: absoluteUrl("/research"),
    type: "website",
  },
};

const calculatorRows = [
  ["VAT Calculator", "22,000", "Freelancers, ecommerce sellers, accountants"],
  ["Salary After Tax Calculator", "18,000", "Employees, recruiters, HR teams"],
  ["Mortgage Calculator", "14,000", "Home buyers, brokers, estate agents"],
  ["Loan Calculator", "12,000", "Borrowers, car buyers, finance teams"],
  ["Profit Margin Calculator", "9,000", "Retailers, Amazon sellers, operators"],
  ["Rental Yield Calculator", "6,500", "Landlords, property investors"],
] as const;

const taxRows = [
  ["Income tax personal allowance", "GBP 12,570", "HMRC 2026/27"],
  ["Basic rate income tax", "20% from GBP 12,571 to GBP 50,270", "HMRC 2026/27"],
  ["Higher rate income tax", "40% from GBP 50,271 to GBP 125,140", "HMRC 2026/27"],
  ["Additional rate income tax", "45% above GBP 125,140", "HMRC 2026/27"],
  ["VAT standard rate", "20%", "HMRC VAT rates"],
  ["VAT reduced rate", "5%", "HMRC VAT rates"],
  ["VAT registration threshold", "GBP 90,000 taxable turnover", "HMRC VAT guidance"],
  ["Corporation tax main rate", "25%", "HMRC corporation tax"],
  ["Corporation tax small profits rate", "19%", "HMRC corporation tax"],
  ["Capital Gains Tax basic rate", "18% residential property, 10% other assets", "HMRC CGT guidance"],
  ["Stamp Duty first-time buyer relief", "0% up to GBP 425,000, subject to limits", "HMRC SDLT guidance"],
] as const;

const salaryRows = [
  ["Information and communication", "GBP 46,000", "ONS ASHE"],
  ["Finance and insurance", "GBP 44,000", "ONS ASHE"],
  ["Professional, scientific, technical", "GBP 41,000", "ONS ASHE"],
  ["Construction", "GBP 37,000", "ONS ASHE"],
  ["Education", "GBP 35,000", "ONS ASHE"],
  ["Health and social work", "GBP 33,000", "ONS ASHE"],
  ["Retail and wholesale", "GBP 28,000", "ONS ASHE"],
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
              {row.map((cell) => (
                <td key={cell} className="px-4 py-3">
                  {cell}
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
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Toollabz Research</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          UK Online Tool Usage Data 2026
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          Reference data for journalists, bloggers, and researchers covering online calculators, UK tax thresholds, and salary
          benchmarks. Figures are compiled from Toollabz usage patterns, public search demand estimates, HMRC guidance, and ONS
          salary datasets.
        </p>
      </header>

      <div className="space-y-8">
        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-2xl font-bold text-slate-900">Most Used Online Calculators in the UK (2026)</h2>
          <p className="mt-3 leading-7 text-slate-700">
            The table below combines public keyword-demand estimates with Toollabz category engagement. It is intended as a
            directional editorial reference, not audited market research.
          </p>
          <DataTable caption="Calculator demand estimates" headers={["Tool Name", "Monthly Searches", "Primary Users"]} rows={calculatorRows} />
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-2xl font-bold text-slate-900">UK Financial Calculation Benchmarks 2026</h2>
          <p className="mt-3 leading-7 text-slate-700">
            These figures are commonly needed when writing about salary, VAT, business tax, capital gains, and property
            transactions. Always verify live policy changes with HMRC before publication.
          </p>
          <DataTable caption="UK tax and threshold reference" headers={["Benchmark", "2026/27 figure", "Source"]} rows={taxRows} />
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <h2 className="text-2xl font-bold text-slate-900">Average UK Salary by Sector 2026</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Salary rows are rounded median annual pay estimates by sector. For official tables, use the{" "}
            <a href="https://www.ons.gov.uk/" className="font-medium text-violet-800 underline-offset-2 hover:underline" rel="noreferrer">
              Office for National Statistics
            </a>
            .
          </p>
          <DataTable caption="Rounded salary benchmarks" headers={["Sector", "Median salary", "Source"]} rows={salaryRows} />
        </section>

        <section className={`p-6 sm:p-8 ${toolGlassPanel}`}>
          <h2 className="text-2xl font-bold text-slate-900">How to cite this data</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Source: Toollabz Research (toollabz.com/research), June 2026. You may cite short extracts with attribution and a link
            back to this page.
          </p>
        </section>
      </div>
    </div>
  );
}
