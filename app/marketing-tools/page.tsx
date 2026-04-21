import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import CategoryHubLongform from "@/components/CategoryHubLongform";
import CategoryToolSpotlights from "@/components/CategoryToolSpotlights";
import { tools } from "@/lib/tools/data";
import { toolsInDirectoryGroup } from "@/lib/tools/directory-groups";
import { toolGlassPanel } from "@/lib/tool-ui";
import { categoryLandingMetadata } from "@/lib/seo/category-landing-meta";
import PageLastUpdated from "@/components/PageLastUpdated";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = categoryLandingMetadata({
  path: "/marketing-tools",
  title: "Free Marketing ROI, CPC & Conversion Calculators",
  description:
    "Free marketing calculators for ROI, ROAS, CPC, CPM, conversion rates, and creator metrics. Model experiments, compare channels, and discover related Toollabz utilities over HTTPS.",
});

export default function MarketingToolsPage() {
  const filtered = toolsInDirectoryGroup(tools, "marketing");
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All tools", path: "/tools" },
    { name: "Marketing tools", path: "/marketing-tools" },
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
        <span className="font-medium text-slate-700">Marketing Tools</span>
      </nav>
      <PageLastUpdated className="mb-4" />
      <header className={`mb-10 p-6 sm:p-8 ${toolGlassPanel}`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Category</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Marketing tools</h1>
        <p className="mt-3 text-slate-600">
          Campaign ROI, conversion math, email metrics, and creator stats when you’re proving what worked.
        </p>
      </header>
      <CategoryHubLongform group="marketing" />
      <CategoryToolSpotlights tools={filtered} currentGroup="marketing" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </div>
  );
}
