import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import ToolsDirectoryClient from "@/components/ToolsDirectoryClient";
import { tools } from "@/lib/tools/data";
import { toToolListingPreview } from "@/lib/tools/tool-listing";
import { toolGlassPanel } from "@/lib/tool-ui";
import { absoluteUrl, breadcrumbJsonLd, webPageSchema } from "@/lib/seo";
import PageLastUpdated from "@/components/PageLastUpdated";
import { categoryLandingMetadata } from "@/lib/seo/category-landing-meta";

const toolsListingMetaBase = categoryLandingMetadata({
  path: "/tools",
  title: "Free Tools Directory - Calculators, PDF & Developer",
  description:
    "Browse free calculators, PDF utilities, AI generators, developer tools, and converters grouped by finance, real estate, business, marketing, and everyday use on HTTPS Toollabz.",
});

const toolsOgImage = absoluteUrl("/logo-toollabz.webp");

export const metadata: Metadata = {
  ...toolsListingMetaBase,
  openGraph: {
    ...toolsListingMetaBase.openGraph,
    title: "Free Tools Directory - Calculators, PDF & Developer",
    description:
      "Free online tools organized by category: finance, real estate, business, marketing, AI, developer, utility, and PDF - with canonical HTTPS URLs.",
    url: absoluteUrl("/tools"),
    type: "website",
    siteName: "Toollabz",
    images: [{ url: toolsOgImage, width: 512, height: 512, alt: "Toollabz" }],
  },
  twitter: {
    ...toolsListingMetaBase.twitter,
    images: [toolsOgImage],
  },
};

export default function ToolsPage() {
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "All tools", path: "/tools" },
  ]);
  const pageSchema = webPageSchema({
    name: "All Tools Directory",
    description: "Browse free calculators, PDF tools, AI generators, developer utilities, and more.",
    path: "/tools",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">Tools</span>
      </nav>
      <PageLastUpdated className="mb-4" />

      <header className={`mb-6 p-6 sm:p-8 ${toolGlassPanel}`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Directory</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">All tools</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
          Explore calculators, PDF utilities, AI generators, and dev helpers - grouped so you can jump in without hunting.
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Browse by category below, or open a full collection:{" "}
          <Link href="/finance-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            finance
          </Link>
          ,{" "}
          <Link href="/real-estate-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            real estate
          </Link>
          ,{" "}
          <Link href="/business-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            business
          </Link>
          ,{" "}
          <Link href="/marketing-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            marketing
          </Link>
          ,{" "}
          <Link href="/ai-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            AI
          </Link>
          ,{" "}
          <Link href="/developer-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            developer
          </Link>
          ,{" "}
          <Link href="/utility-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            utility
          </Link>
          ,{" "}
          <Link href="/pdf-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
            PDF
          </Link>
          .
        </p>
      </header>

      <Suspense
        fallback={
          <div className="mt-6 h-11 max-w-xl animate-pulse rounded-xl border border-violet-200/50 bg-white/50" aria-hidden />
        }
      >
        <ToolsDirectoryClient tools={tools.map(toToolListingPreview)} totalCount={tools.length} />
      </Suspense>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </div>
  );
}
