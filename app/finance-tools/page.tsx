import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import CategoryHubLongform from "@/components/CategoryHubLongform";
import CategoryToolSpotlights from "@/components/CategoryToolSpotlights";
import PopularCalculationsBlock from "@/components/PopularCalculationsBlock";
import PageLastUpdated from "@/components/PageLastUpdated";
import { tools } from "@/lib/tools/data";
import { toolsInDirectoryGroup } from "@/lib/tools/directory-groups";
import { toolGlassPanel } from "@/lib/tool-ui";
import { categoryLandingMetadata } from "@/lib/seo/category-landing-meta";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = categoryLandingMetadata({
  path: "/finance-tools",
  title: "Free Finance Calculators, Loans & Paycheck Tools",
  description:
    "Free online finance calculators for loans, paychecks, taxes, savings, and debt payoff. Model what-if scenarios, compare related tools, and plan with HTTPS Toollabz pages - no signup required.",
});

export default function FinanceToolsPage() {
  const filtered = toolsInDirectoryGroup(tools, "finance");
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All tools", path: "/tools" },
    { name: "Finance tools", path: "/finance-tools" },
  ]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <Link href="/tools" className="transition hover:text-violet-600">Tools</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">Finance Tools</span>
      </nav>
      <PageLastUpdated className="mb-4" />
      <header className={`mb-10 p-6 sm:p-8 ${toolGlassPanel}`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Category</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Finance tools</h1>
        <p className="mt-3 text-slate-600">Loan, paycheck, tax, budget, and savings tools for planning and decision support.</p>
      </header>
      <CategoryHubLongform group="finance" />
      <CategoryToolSpotlights tools={filtered} currentGroup="finance" />
      <div className="mb-10">
        <PopularCalculationsBlock variant="both" compact />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </div>
  );
}
