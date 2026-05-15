import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools/data";
import { categoryLandingMetadata } from "@/lib/seo/category-landing-meta";
import PageLastUpdated from "@/components/PageLastUpdated";
import { breadcrumbJsonLd } from "@/lib/seo";
import { toolGlassPanel } from "@/lib/tool-ui";
import HubFeaturedGuides from "@/components/HubFeaturedGuides";
import { blogPostBySlug, type BlogPostResolved } from "@/lib/blog/registry";

export const revalidate = 3600;

const UK_FINANCE_TOOL_SLUGS = [
  "salary-after-tax-calculator-uk",
  "self-employed-tax-calculator-uk",
  "dividend-tax-calculator-uk",
  "freelance-day-rate-calculator",
  "invoice-late-fee-calculator",
  "gst-calculator-australia",
  "zakat-calculator",
] as const;

const UK_FINANCE_BLOG_SLUGS = [
  "uk-self-employed-dividend-salary-effective-percent-toollabz",
  "gst-vs-vat-uk-au-cross-border-pricing-toollabz",
  "gst-australia-inclusive-exclusive-10-percent-small-business",
  "zakat-calculation-nisab-practical-guide-respectful",
  "working-days-uk-timezones-business-slas-toollabz",
] as const;

export const metadata: Metadata = categoryLandingMetadata({
  path: "/uk-finance-tax",
  title: "UK Finance and Tax Hub: Salary, Dividends, Self-Employed, and Planning Tools",
  description:
    "Curated UK pay and tax planning calculators plus Australia GST and respectful Zakat helpers. Educational sketches only, not tax or religious advice. Links to deep guides on Toollabz.",
});

export default function UkFinanceTaxHubPage() {
  const toolList = UK_FINANCE_TOOL_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter(Boolean) as typeof tools;
  const posts = UK_FINANCE_BLOG_SLUGS.map((slug) => blogPostBySlug(slug)).filter((p): p is BlogPostResolved => Boolean(p));

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All tools", path: "/tools" },
    { name: "Finance tools", path: "/finance-tools" },
    { name: "UK finance and tax hub", path: "/uk-finance-tax" },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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
        <span className="font-medium text-slate-700">UK finance and tax hub</span>
      </nav>
      <PageLastUpdated className="mb-4" />

      <header className={`mb-10 p-6 sm:p-8 ${toolGlassPanel}`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Hub</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">UK finance and tax planning</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          This hub collects take-home pay sketches, sole trader and dividend models, and adjacent invoice helpers alongside respectful Zakat arithmetic and
          Australian GST splits. Every page states limits up front: bands, allowances, and filing rules change, so treat outputs as conversation starters with a
          qualified accountant or advisor, not filings.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-slate-500">
          Pair calculators with the guides below for worked examples, comparison tables, and long-tail FAQs. For broader US-focused calculators, use the{" "}
          <Link href="/finance-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            main finance directory
          </Link>
          .
        </p>
      </header>

      <section className={`mb-10 space-y-4 p-6 sm:p-8 ${toolGlassPanel}`} aria-labelledby="uk-compare">
        <h2 id="uk-compare" className="text-xl font-bold text-slate-900 sm:text-2xl">
          When to use which UK sketch
        </h2>
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
          Mixed earners often need three different lenses in one afternoon: PAYE-style take-home, sole trader profit after blended tax and NI percentages, and
          distribution planning after an effective dividend rate. The table maps typical questions to a starting tool; always align inputs with your latest
          HMRC or payroll pack.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white/80">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Start here</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3">Employee or contractor with PAYE-style deductions</td>
                <td className="px-4 py-3">
                  <Link href="/tools/salary-after-tax-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                    Salary after tax (UK)
                  </Link>
                </td>
                <td className="px-4 py-3">You supply combined income tax, NI, and pension percentages to approximate net pay.</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Sole trader profit after blended rates</td>
                <td className="px-4 py-3">
                  <Link href="/tools/self-employed-tax-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                    Self-employed tax (UK)
                  </Link>
                </td>
                <td className="px-4 py-3">Uses a single effective tax plus NI percentage you pull from forecasts or your accountant.</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Director distributions after an effective dividend rate</td>
                <td className="px-4 py-3">
                  <Link href="/tools/dividend-tax-calculator-uk" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                    Dividend tax (UK)
                  </Link>
                </td>
                <td className="px-4 py-3">Stacks allowances into the percentage you enter; pair with salary tool when mixing income types.</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Pricing retained days from an annual after-tax goal</td>
                <td className="px-4 py-3">
                  <Link href="/tools/freelance-day-rate-calculator" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                    Freelance day rate
                  </Link>
                </td>
                <td className="px-4 py-3">Turns target net income and billable days into a floor day rate before discounts.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <HubFeaturedGuides posts={posts} title="Guides with worked examples" />

      <section className="mt-12" aria-labelledby="uk-tools">
        <h2 id="uk-tools" className="text-xl font-bold text-slate-900 sm:text-2xl">
          Tools in this cluster
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolList.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassPanel}`} aria-labelledby="uk-faq">
        <h2 id="uk-faq" className="text-xl font-bold text-slate-900 sm:text-2xl">
          Hub FAQs
        </h2>
        <dl className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          <div>
            <dt className="font-semibold text-slate-900">Are these HMRC-certified calculators?</dt>
            <dd className="mt-1">
              No. They apply the percentages and amounts you type. Use official HMRC guidance, payroll software, or a tax agent for filings and edge cases such
              as Scottish bands, high income child benefit charge, or payments on account.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Why list Australia GST and Zakat on a UK hub?</dt>
            <dd className="mt-1">
              Teams and households often span geographies. Keeping respectful Zakat arithmetic and Australian GST splits nearby reduces fragmented searches while
              each tool page still carries its own disclaimers and intent.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Where should I go for business metrics outside tax?</dt>
            <dd className="mt-1">
              Use the{" "}
              <Link href="/business-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                business growth directory
              </Link>{" "}
              for ROAS, churn, CAC, and break-even calculators that complement finance planning decks.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10 text-sm text-slate-500">
        <p>
          Developer utilities live in the{" "}
          <Link href="/developer-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            developer tools hub
          </Link>
          . Converters and SLAs live under{" "}
          <Link href="/utility-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            utilities and converters
          </Link>
          .
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </div>
  );
}
