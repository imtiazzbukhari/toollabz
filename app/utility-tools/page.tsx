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
import HubFeaturedGuides from "@/components/HubFeaturedGuides";
import { hubCollectionLdForGroup, hubFeaturedPostsForGroup, hubPopularToolsForGroup } from "@/lib/hub-pages/hub-server-utils";

export const revalidate = 3600;

export const metadata: Metadata = categoryLandingMetadata({
  path: "/utility-tools",
  title: "Free Unit Converters & Everyday Online Utility Tools",
  description:
    "Free utility tools for unit conversion, dates and time zones, text helpers, and everyday productivity. Fast HTTPS pages with internal links to related calculators on Toollabz.",
});

export default function UtilityToolsPage() {
  const filtered = toolsInDirectoryGroup(tools, "utility");
  const featuredPosts = hubFeaturedPostsForGroup("utility");
  const popularTools = hubPopularToolsForGroup("utility");
  const collectionLd = hubCollectionLdForGroup("utility", {
    name: "Utility & everyday tools",
    description: "Converters, text helpers, dates, and productivity utilities on Toollabz.",
    path: "/utility-tools",
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All tools", path: "/tools" },
    { name: "Utility tools", path: "/utility-tools" },
  ]);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <Link href="/tools" className="transition hover:text-violet-600">Tools</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">Utility Tools</span>
      </nav>
      <PageLastUpdated className="mb-4" />
      <header className={`mb-10 p-6 sm:p-8 ${toolGlassPanel}`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Category</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Utility tools</h1>
        <p className="mt-3 text-slate-600">Everyday utility tools for writing, planning, conversions, and daily productivity tasks.</p>
      </header>
      <CategoryHubLongform group="utility" />
      <HubFeaturedGuides posts={featuredPosts} title="Featured utility guides" />
      <section className="mt-12" aria-labelledby="util-popular">
        <h2 id="util-popular" className="text-xl font-bold text-slate-900 sm:text-2xl">
          Popular utility tools
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularTools.map((tool) => (
            <ToolCard key={`pop-${tool.slug}`} tool={tool} />
          ))}
        </div>
      </section>
      <CategoryToolSpotlights tools={filtered} currentGroup="utility" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <article
            key={tool.slug}
            className="flex h-full min-h-[11rem] flex-col rounded-2xl border border-white/50 bg-white/75 p-5 shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
          >
            <h2 className="text-base font-semibold leading-snug text-slate-900">{tool.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{tool.shortDescription}</p>
            <div className="mt-4">
              <Link
                href={`/tools/${tool.slug}`}
                className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
              >
                Open Tool
              </Link>
            </div>
          </article>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
    </div>
  );
}
