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
  path: "/pdf-tools",
  title: "Free PDF Merge, Split & Compress Tools Online",
  description:
    "Free PDF utilities to merge, split, compress, and convert documents in your browser. Understand scope in FAQs, follow HTTPS canonical URLs, and jump to related Toollabz calculators.",
});

export default function PdfToolsPage() {
  const filtered = toolsInDirectoryGroup(tools, "pdf");
  const featuredPosts = hubFeaturedPostsForGroup("pdf");
  const popularTools = hubPopularToolsForGroup("pdf");
  const collectionLd = hubCollectionLdForGroup("pdf", {
    name: "PDF tools",
    description: "Merge, split, compress, and convert PDFs in your browser on Toollabz.",
    path: "/pdf-tools",
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All tools", path: "/tools" },
    { name: "PDF tools", path: "/pdf-tools" },
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
        <span className="font-medium text-slate-700">PDF Tools</span>
      </nav>
      <PageLastUpdated className="mb-4" />
      <header className={`mb-10 p-6 sm:p-8 ${toolGlassPanel}`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Category</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">PDF tools</h1>
        <p className="mt-3 text-slate-600">
          Merge, split, compress, and convert PDFs - handy when you need a clean file without another subscription.
        </p>
      </header>
      <CategoryHubLongform group="pdf" />
      <HubFeaturedGuides posts={featuredPosts} title="Featured PDF guides" />
      <section className="mt-12" aria-labelledby="pdf-popular">
        <h2 id="pdf-popular" className="text-xl font-bold text-slate-900 sm:text-2xl">
          Popular PDF tools
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularTools.map((tool) => (
            <ToolCard key={`pop-${tool.slug}`} tool={tool} />
          ))}
        </div>
      </section>
      <CategoryToolSpotlights tools={filtered} currentGroup="pdf" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
    </div>
  );
}
