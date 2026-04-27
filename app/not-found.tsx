import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Home, Sparkles, Wrench } from "lucide-react";
import HomeSearchForm from "@/components/HomeSearchForm";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/tools/data";
import type { ToolDefinition } from "@/lib/tools/types";
import { POPULAR_TOOL_SLUGS } from "@/lib/tools/popular-tools";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Toollabz - Free Online Tools" },
  description:
    "404 on Toollabz: search free calculators, converters, PDF tools, and AI helpers, or jump to popular picks — HTTPS hub, no signup.",
  robots: { index: false, follow: true },
};

function hashSlug(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

/** Stable order for SSR/CSR parity (avoids Date.now-based hydration mismatch). */
function pickDiscoveryTools(all: ToolDefinition[], count: number): ToolDefinition[] {
  if (all.length <= count) return [...all];
  return [...all]
    .map((t) => ({ t, h: hashSlug(t.slug) }))
    .sort((a, b) => a.h - b.h || a.t.slug.localeCompare(b.t.slug))
    .slice(0, count)
    .map((x) => x.t);
}

const categoryShortcuts = [
  { label: "Finance", href: "/finance-tools" },
  { label: "Business", href: "/business-tools" },
  { label: "Real estate", href: "/real-estate-tools" },
  { label: "AI tools", href: "/ai-tools" },
  { label: "Utilities", href: "/utility-tools" },
  { label: "Developer", href: "/developer-tools" },
  { label: "PDF", href: "/pdf-tools" },
  { label: "Marketing", href: "/marketing-tools" },
] as const;

export default function NotFound() {
  const popular = POPULAR_TOOL_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter(
    Boolean,
  ) as ToolDefinition[];

  const popularSlugs = new Set<string>([...POPULAR_TOOL_SLUGS]);
  const discoveryPool = tools.filter((t) => !popularSlugs.has(t.slug));
  const discoveryFinal = pickDiscoveryTools(discoveryPool.length >= 6 ? discoveryPool : tools, 6);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-[#f3f4ff] via-[#eef2ff] to-[#e0e7ff] pb-16 pt-10 sm:pb-20 sm:pt-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-violet-200/50 bg-white/60 p-8 shadow-[0_20px_60px_rgba(99,102,241,0.12)] backdrop-blur-md sm:p-10 md:p-12">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-violet-400/25 to-blue-400/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-gradient-to-tr from-fuchsia-400/20 to-violet-400/15 blur-3xl"
            aria-hidden
          />

          <p className="inline-flex items-center gap-2 rounded-full bg-violet-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-800">
            <Compass className="h-3.5 w-3.5" aria-hidden />
            Error 404
          </p>

          <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-[2.65rem] md:leading-tight">
            You&apos;ve orbited off the map{" "}
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
               -  let&apos;s find a better tool.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            That page doesn&apos;t exist (or moved). No stress - search below or grab a hand-picked tool.
            Every link here is free, fast, and ready to use.
          </p>

          <div className="mt-8 max-w-xl">
            <p className="mb-2 text-sm font-medium text-slate-700">
              <Sparkles className="mr-1.5 inline h-4 w-4 text-violet-500" aria-hidden />
              What were you looking for?
            </p>
            <HomeSearchForm variant="hero-premium" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-violet-300 hover:bg-white hover:text-violet-700"
            >
              <Home className="h-4 w-4 text-violet-600" aria-hidden />
              Home
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
            >
              <Wrench className="h-4 w-4" aria-hidden />
              Browse all tools
              <ArrowRight className="h-3.5 w-3.5 opacity-90" aria-hidden />
            </Link>
          </div>

          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700/90">
              Explore by category
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categoryShortcuts.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-white hover:text-violet-700"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-12" aria-labelledby="discovery-heading">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="discovery-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
                Discovery picks
              </h2>
              <p className="mt-1 text-sm text-slate-600">A stable set of tools you may not have opened yet - same friendly cards as everywhere else on Toollabz.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {discoveryFinal.map((tool) => (
              <ToolCard key={`d-${tool.slug}`} tool={tool} />
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="popular-404-heading">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="popular-404-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
                Crowd favourites
              </h2>
              <p className="mt-1 text-sm text-slate-600">The tools people open again and again - good company while you&apos;re here.</p>
            </div>
            <Link
              href="/tools"
              className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              Full directory
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popular.slice(0, 8).map((tool) => (
              <ToolCard key={`p-${tool.slug}`} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
