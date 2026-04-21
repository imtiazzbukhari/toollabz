import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import ToolWorkspaceShell from "@/components/ToolWorkspaceShell";
import { toolMap } from "@/lib/tools/data";
import { breadcrumbSchema, faqSchema, siteUrl, toolMetadata, toolSchema, webPageSchema } from "@/lib/seo";
import { getToolInsight } from "@/lib/tools/tool-insights";

const countryToolMap: Record<string, string> = {
  usa: "salary-after-tax-calculator",
  uk: "salary-after-tax-calculator-uk",
  california: "salary-after-tax-calculator-california",
  texas: "salary-after-tax-calculator-texas",
  "new-york": "salary-after-tax-calculator-new-york",
  florida: "salary-after-tax-calculator-florida",
};

const salaryBuckets = [30000, 50000, 70000, 85000, 100000, 120000, 150000, 200000];

const parseSalaryAmount = (amount: string) => {
  const match = amount.match(/\d+/);
  if (!match) return null;
  const value = Number(match[0]);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
};

export async function generateStaticParams() {
  return Object.keys(countryToolMap).flatMap((country) =>
    salaryBuckets.map((amount) => ({
      country,
      amount: `${amount}-salary-after-tax-${country}`,
    }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; amount: string }> }) {
  const { country, amount } = await params;
  const toolSlug = countryToolMap[country];
  if (!toolSlug) return {};
  const tool = toolMap.get(toolSlug);
  const salary = parseSalaryAmount(amount);
  if (!tool || !salary) return {};
  const base = toolMetadata(tool);
  const countryLabel = country.replace(/-/g, " ").toUpperCase();
  const title = `${salary} Salary After Tax Calculator ${countryLabel}`;
  const description = `Estimate take-home pay for salary ${salary} in ${countryLabel} with fast after-tax planning output and related salary tools.`;
  return {
    ...base,
    title,
    description,
    alternates: {
      canonical: `/salary-after-tax-calculator/${country}/${amount}`,
    },
    openGraph: {
      ...base.openGraph,
      title,
      description,
      url: `${siteUrl}/salary-after-tax-calculator/${country}/${amount}`,
    },
    twitter: {
      ...base.twitter,
      title,
      description,
    },
  };
}

export default async function SalaryAfterTaxProgrammaticPage({
  params,
}: {
  params: Promise<{ country: string; amount: string }>;
}) {
  const { country, amount } = await params;
  const toolSlug = countryToolMap[country];
  const tool = toolSlug ? toolMap.get(toolSlug) : null;
  const salary = parseSalaryAmount(amount);
  if (!tool || !salary) notFound();
  const path = `/salary-after-tax-calculator/${country}/${amount}`;
  const insight = getToolInsight(tool.slug);

  return (
    <>
      <ToolLayout tool={tool}>
        <div className="space-y-4">
          <div className="rounded-2xl border border-violet-200/55 bg-white/70 p-5 text-sm leading-6 text-slate-700 shadow-[0_6px_20px_rgba(99,102,241,0.07)]">
            This page is optimized for salary query variation <strong>{salary}</strong> in{" "}
            <strong>{country.replace(/-/g, " ").toUpperCase()}</strong>. Use the calculator below
            with your exact tax assumptions for a personalized take-home estimate.
          </div>
          <ToolWorkspaceShell tool={tool} insight={insight} />
        </div>
      </ToolLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ name: `${tool.name} for ${salary}`, description: tool.description, path })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema(tool, path)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(tool)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(tool, path)) }} />
    </>
  );
}
