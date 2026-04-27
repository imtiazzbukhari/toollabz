import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import CategoryHubLongform from "@/components/CategoryHubLongform";
import CategoryToolSpotlights from "@/components/CategoryToolSpotlights";
import { capStaticParams } from "@/lib/build/static-generation";
import { categories, tools } from "@/lib/tools/data";
import { toolGlassPanel } from "@/lib/tool-ui";
import { categoryLandingMetadata } from "@/lib/seo/category-landing-meta";
import { resolveDirectoryGroupForCategoryPage } from "@/lib/seo/category-hub-routing";
import PageLastUpdated from "@/components/PageLastUpdated";
import PopularCalculationsBlock from "@/components/PopularCalculationsBlock";
import { breadcrumbJsonLd } from "@/lib/seo";

function humanizeCategory(slug: string) {
  return slug.split("-").map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join(" ");
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const sorted = [...categories].sort((a, b) => a.slug.localeCompare(b.slug));
  return capStaticParams(sorted.map((c) => ({ category: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const t = humanizeCategory(category);
  const metaTitle = `${t} Tools - Free Online Toollabz Hub`.slice(0, 60);
  return categoryLandingMetadata({
    path: `/category/${category}`,
    title: metaTitle,
    description: `Free online ${t} tools on Toollabz: calculators, generators, and utilities with HTTPS pages, structured guides, FAQs, and related internal links between tools.`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const filtered = tools.filter((tool) => tool.category === category);
  if (!filtered.length) notFound();
  const heading = humanizeCategory(category);
  const hub = resolveDirectoryGroupForCategoryPage(category, filtered);
  const path = `/category/${category}`;
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All tools", path: "/tools" },
    { name: heading, path },
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
        <span className="font-medium text-slate-700">{heading}</span>
      </nav>
      <PageLastUpdated className="mb-4" />

      <header className={`mb-10 p-6 sm:p-8 ${toolGlassPanel}`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Category</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {heading} tools
        </h1>
        <p className="mt-3 text-slate-600">{filtered.length} tools in this category.</p>
      </header>

      {category === "finance" ? (
        <div className="mb-10">
          <PopularCalculationsBlock variant="both" compact />
        </div>
      ) : null}

      <CategoryHubLongform group={hub} />
      <CategoryToolSpotlights tools={filtered} currentGroup={hub} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </div>
  );
}
