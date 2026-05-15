import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  Search,
  Wrench,
  CheckCircle2,
  Mail,
} from "lucide-react";
import ToolCard from "@/components/ToolCard";
import { tools, trendingSlugs } from "@/lib/tools/data";
import { getCategoryIcon } from "@/utils/icons";
import HomeSearchForm from "@/components/HomeSearchForm";
import NewsletterFormDeferred from "@/components/NewsletterFormDeferred";
import { toolsInDirectoryGroup } from "@/lib/tools/directory-groups";
import { HOMEPAGE_MAJOR_SHOWCASE_SLUGS, POPULAR_TOOL_SLUGS } from "@/lib/tools/popular-tools";
import { blogPosts } from "@/lib/blog/registry";
import { TOOLLABZ_HERO_IMAGE } from "@/lib/tools/tool-illustration";
import { absoluteUrl, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { getHomepageFeaturedGuidePins, getHomepageRecentlyUpdatedTools } from "@/lib/homepage-content-surface";
import HomeSeoDeepSection from "@/components/HomeSeoDeepSection";
import PageLastUpdated from "@/components/PageLastUpdated";
import PopularCalculationsBlock from "@/components/PopularCalculationsBlock";

const guideCount = blogPosts.length;

export const metadata: Metadata = {
  title: {
    absolute: "Toollabz | Developer utilities, UK finance tools, calculators & guides",
  },
  description: `Practical online calculators, developer utilities (JSON, JWT, SQL), UK finance and tax hub, SaaS metrics, GST (Australia), converters, PDF tools, and ${guideCount}+ guides. HTTPS, FAQs, category hubs, no signup.`,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Toollabz | Developer utilities, UK finance tools, calculators & guides",
    description: `Calculators, developer utilities, UK finance hub, SaaS metrics, GST tools, PDF workflows, and ${guideCount}+ articles. Structured pages with internal links between related tools.`,
    url: siteUrl,
    type: "website",
    siteName: "Toollabz",
    images: [{ url: absoluteUrl("/logo-toollabz.webp"), width: 469, height: 469, alt: "Toollabz logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toollabz | Developer utilities, UK finance tools, calculators & guides",
    description: `Deterministic tools and long-form guides: ${tools.length}+ utilities, ${guideCount}+ articles, category hubs for crawl and discovery.`,
    images: [absoluteUrl("/logo-toollabz.webp")],
  },
};

const popular = POPULAR_TOOL_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter(
  Boolean,
) as typeof tools;
const trending = tools.filter((t) => trendingSlugs.includes(t.slug));

const homeBreadcrumbLd = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "All tools", path: "/tools" },
  { name: "Categories", path: "/#categories" },
]);

export default function Home() {
  const featuredGuidePins = getHomepageFeaturedGuidePins(6);
  const recentlyUpdatedTools = getHomepageRecentlyUpdatedTools(tools, 12);
  const majorShowcaseTools = HOMEPAGE_MAJOR_SHOWCASE_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter(
    Boolean,
  ) as typeof tools;
  const categoryGradients: Record<string, string> = {
    converters: "from-violet-500 to-fuchsia-500",
    finance: "from-emerald-500 to-green-500",
    pdf: "from-rose-500 to-red-500",
    generators: "from-blue-500 to-cyan-500",
    developer: "from-indigo-500 to-blue-600",
    business: "from-orange-500 to-amber-500",
    marketing: "from-pink-500 to-rose-500",
    utility: "from-cyan-500 to-blue-500",
    "real-estate": "from-teal-500 to-cyan-500",
    legal: "from-purple-500 to-violet-600",
    creator: "from-sky-500 to-indigo-500",
  };
  type HomeCluster = {
    label: string;
    href: string;
    iconSlug: string;
    blurb: string;
    count: number | string;
  };

  const homepageClusters: HomeCluster[] = [
    {
      label: "Developer tools",
      href: "/developer-tools",
      iconSlug: "developer",
      blurb: "JWT, JSON, SQL, regex, encoders",
      count: toolsInDirectoryGroup(tools, "developer").length,
    },
    {
      label: "UK finance & tax",
      href: "/uk-finance-tax",
      iconSlug: "finance",
      blurb: "Pay sketches, GST AU, Zakat, guides",
      count: "Hub",
    },
    {
      label: "GST (Australia)",
      href: "/tools/gst-calculator-australia",
      iconSlug: "finance",
      blurb: "Inclusive vs exclusive 10%",
      count: "Tool + guides",
    },
    {
      label: "Finance",
      href: "/finance-tools",
      iconSlug: "finance",
      blurb: "Loans, paychecks, savings",
      count: tools.filter((t) => t.category === "finance").length,
    },
    {
      label: "Business & SaaS",
      href: "/business-tools",
      iconSlug: "business",
      blurb: "ROAS, churn, CAC, margins",
      count: toolsInDirectoryGroup(tools, "business-saas").length,
    },
    {
      label: "Marketing",
      href: "/marketing-tools",
      iconSlug: "marketing",
      blurb: "ROI, CPC, campaign math",
      count: tools.filter((t) => t.category === "marketing").length,
    },
    {
      label: "Utilities",
      href: "/utility-tools",
      iconSlug: "utility",
      blurb: "Converters, dates, text",
      count: toolsInDirectoryGroup(tools, "utility").length,
    },
    {
      label: "PDF",
      href: "/pdf-tools",
      iconSlug: "pdf",
      blurb: "Merge, compress, split",
      count: tools.filter((t) => t.category === "pdf").length,
    },
  ];

  const howItWorks = [
    { title: "Search", text: "Jump to a tool, hub, or guide from the hero search or cluster cards.", icon: Search },
    { title: "Run", text: "Deterministic calculators and encoders with labeled fields and formula context.", icon: Wrench },
    { title: "Explore", text: "Follow related tools and articles to finish the workflow without tab roulette.", icon: CheckCircle2 },
  ];

  const stats = [
    { value: `${tools.length}+`, label: "Tools", icon: Sparkles },
    { value: `${guideCount}+`, label: "Guides & articles", icon: BookOpen },
    { value: "HTTPS", label: "Canonical pages", icon: ShieldCheck },
    { value: "No signup", label: "Privacy-first defaults", icon: Users },
  ];
  const trustItems = [
    { title: "Depth you can cite", text: "Long-form guides next to calculators: UK finance, GST, JWT pipelines, SaaS metrics.", icon: BookOpen },
    { title: "Deterministic utilities", text: "Developer and finance tools favor predictable math over black-box outputs.", icon: Zap },
    { title: "No account wall", text: "Run tools in the browser session; we do not warehouse your pasted payloads.", icon: ShieldCheck },
  ];

  const softSectionCardTight =
    "rounded-2xl border border-violet-200/45 bg-white/48 p-5 text-left shadow-[0_6px_28px_rgba(99,102,241,0.09)] backdrop-blur-lg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4ff] via-[#eef2ff] to-[#e0e7ff]">
      <section className="section-fade relative overflow-hidden bg-transparent">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(125deg,#f5f3ff_0%,#eef2ff_56%,#e0e7ff_100%)]" />
        <div className="pointer-events-none absolute right-6 top-1/2 -z-10 hidden h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#c4b5fd_0%,#93c5fd_48%,rgba(255,255,255,0)_78%)] opacity-90 blur-[70px] md:block" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 md:grid md:grid-cols-[1fr_1.25fr] md:items-center md:gap-10 md:px-6 md:pb-12 md:pt-12 lg:gap-14 lg:py-16">
          <div className="relative z-10 text-center md:text-left">
            <div className="rounded-2xl bg-[#eef2ff]/55 px-3 py-5 shadow-[0_12px_40px_rgba(99,102,241,0.06)] backdrop-blur-[10px] sm:px-4 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
              <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-[11px] font-medium text-violet-700">
                Calculators · Developer utilities · UK finance hub
              </span>
              <h1 className="mt-5 text-[2.25rem] font-extrabold leading-[1.08] text-slate-900 text-balance sm:text-5xl md:mt-6 md:text-6xl">
                Practical tools and guides
                <br />
                for <span className="text-gradient">finance, developers, and operators</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:mt-5 md:mx-0">
                {tools.length}+ utilities with FAQs and hubs, {guideCount}+ articles on GST, UK pay, JWT/JSON pipelines, SaaS
                metrics, and converters. Built for quick answers and deeper reading when you need it.
              </p>
              <div className="mx-auto mt-6 max-w-xl md:mx-0 md:mt-8">
                <HomeSearchForm variant="hero-premium" />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <span className="text-xs font-semibold text-slate-500">Trending</span>
                {trending.slice(0, 5).map((t) => (
                  <span
                    key={t.slug}
                    className="rounded-full border border-white/50 bg-white/75 px-2.5 py-1 text-[10px] text-slate-600 shadow-sm sm:px-3 sm:text-[11px]"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="float-soft relative z-10 mx-auto hidden w-full max-w-none overflow-visible md:block md:-mr-16 lg:-mr-24">
            <div className="absolute -inset-20 -z-10 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.36),rgba(59,130,246,0.22)_42%,rgba(255,255,255,0)_76%)] blur-[90px]" />
            <Image
              src={TOOLLABZ_HERO_IMAGE}
              alt="Toollabz - smart tools hub illustration"
              width={719}
              height={547}
              className="h-auto w-full scale-[1.08] drop-shadow-[0_28px_36px_rgba(76,29,149,0.28)] md:translate-x-6 lg:scale-[1.15] lg:translate-x-10"
              priority
              fetchPriority="high"
              sizes="(max-width: 1280px) 55vw, 720px"
            />
            <div className="mx-auto -mt-8 h-7 w-2/3 rounded-full bg-violet-900/25 blur-2xl" />
          </div>
        </div>
      </section>

      <HomeSeoDeepSection />

      <div className="space-y-4">
      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6">
        <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-violet-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <Link href="/tools" className="transition hover:text-violet-600">
            All tools
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <a href="#categories" className="font-medium text-slate-700 transition hover:text-violet-600">
            Categories
          </a>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <Link href="/blog" className="font-medium text-slate-700 transition hover:text-violet-600">
            Blog
          </Link>
        </nav>
        <PageLastUpdated className="mt-1" />
      </div>
      <section id="categories" className="section-fade mt-6 bg-transparent md:mt-8">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-6 lg:py-7">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">Browse by cluster</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Jump into a hub for UK tax, developer utilities, SaaS math, or PDF workflows. Each hub stitches tools to guides.
            </p>
          </div>
          <Link href="/tools" className="inline-flex w-fit items-center gap-1 text-sm text-violet-600 transition duration-300 hover:text-violet-700">
            <span>Full directory</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homepageClusters.map((cluster) => {
            const Icon = getCategoryIcon(cluster.iconSlug);
            const gradient = categoryGradients[cluster.iconSlug] ?? "from-violet-500 to-blue-500";
            const countLabel = typeof cluster.count === "number" ? `${cluster.count}+ tools` : cluster.count;
            return (
              <Link
                key={cluster.href}
                href={cluster.href}
                className="group rounded-2xl border border-white/50 bg-white/75 p-5 shadow-[0_8px_20px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(76,29,149,0.12)]"
              >
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md transition duration-300 group-hover:shadow-[0_0_24px_rgba(99,102,241,0.4)]`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mt-3 text-base font-semibold text-slate-900">{cluster.label}</p>
                <p className="mt-1 text-xs leading-snug text-slate-500">{cluster.blurb}</p>
                <p className="mt-2 text-xs font-medium text-violet-700">{countLabel}</p>
              </Link>
            );
          })}
        </div>
        </div>
      </section>

      <section id="featured-guides" className="section-fade bg-transparent" aria-labelledby="featured-guides-heading">
        <div className="mx-auto max-w-7xl px-4 pb-1 pt-0 sm:px-6 sm:pb-2">
            <h2 id="featured-guides-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Picked guides
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-slate-500">
            Six articles from a larger pin pool; which six you see updates when the site-wide refresh date changes.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featuredGuidePins.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="inline-flex items-center rounded-full border border-violet-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-violet-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50/90 sm:text-sm"
              >
                {g.label}
              </Link>
            ))}
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold text-violet-700 underline-offset-2 hover:underline sm:text-sm"
            >
              All articles
            </Link>
          </div>
        </div>
      </section>

      <section id="popular-tools" className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-6 lg:py-7">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold sm:text-2xl">Popular tools</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              High-intent calculators and PDF utilities people open often. Each page links to related tools and matching guides.
            </p>
          </div>
          <Link href="/tools" className="inline-flex w-fit shrink-0 items-center gap-1 text-sm text-violet-600 transition duration-300 hover:text-violet-700">
            <span>View all tools</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popular.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        </div>
      </section>

      <section className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold sm:text-2xl">Strategic picks (fresh rotation)</h2>
            <Link href="/tools" className="inline-flex w-fit items-center gap-1 text-sm text-violet-600 transition duration-300 hover:text-violet-700">
              <span>Full directory</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <p className="mb-4 max-w-3xl text-sm text-slate-600">
            UK finance, developer utilities, SaaS metrics, and high-intent calculators that are not duplicated from Popular or Featured
            clusters. Order refreshes when the site-wide stamp changes so new launches can surface naturally.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentlyUpdatedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-6 lg:px-8">
          <PopularCalculationsBlock variant="both" />
        </div>
      </section>

      <section className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">Featured across strongest clusters</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Twelve representative tools across UK pay, GST, JWT/JSON/SQL, fees, and core finance. Open any card for FAQs and
                related links.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link href="/developer-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                Developer hub
              </Link>
              <span className="text-slate-300" aria-hidden>
                |
              </span>
              <Link href="/uk-finance-tax" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                UK finance hub
              </Link>
              <span className="text-slate-300" aria-hidden>
                |
              </span>
              <Link href="/business-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
                Business hub
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {majorShowcaseTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-slate-600 lg:text-left">
            <Link href="/tools" className="font-semibold text-violet-700 underline-offset-2 hover:underline">
              Browse the full directory
            </Link>{" "}
            for every slug, including AI and real-estate clusters.
          </p>
        </div>
      </section>

      <section className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 md:py-4">
        <div className="mb-3 text-center md:text-left">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Built for repeat use</h2>
          <p className="mt-1 text-sm text-slate-600">
            {tools.length}+ tools and {guideCount}+ articles, HTTPS-only pages, and hubs that stitch workflows together.
          </p>
        </div>
        <div className="grid gap-3 rounded-2xl border border-white/50 bg-white/40 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)] backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 py-1">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-lg font-bold text-slate-900">{s.value}</p>
                  <p className="text-sm text-slate-600">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </section>

      <section className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 md:py-4">
        <div className="mb-3 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">How it works</h2>
          <p className="mt-1 text-sm text-slate-600">
            Search, run a tool, then follow curated related links into guides or sibling calculators. No signup.
          </p>
        </div>
          <div className="mt-4 grid items-start gap-4 md:grid-cols-3">
            {howItWorks.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className={`relative overflow-hidden ${softSectionCardTight}`}>
                  <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-snug text-slate-600">{step.text}</p>
                  {idx < howItWorks.length - 1 && (
                    <ArrowRight className="absolute -right-4 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-violet-300 md:block" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 md:py-4">
        <div className="mb-3 text-center md:text-left">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Why Toollabz</h2>
          <p className="mt-1 text-sm text-slate-600">Authority comes from depth: paired guides, FAQs, and cluster hubs next to the forms.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`flex h-full flex-col ${softSectionCardTight}`}>
                <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-snug text-slate-600">{item.text}</p>
              </div>
            );
          })}
        </div>
        </div>
      </section>

      <section className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 md:py-4">
        <div className="mb-3 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Community feedback</h2>
          <p className="mt-1 text-sm text-slate-600">
            Honest reviews help us prioritize fixes and new tools. We do not display fabricated testimonials.
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-1">
          <div className={`${softSectionCardTight} text-center md:text-left`}>
            <p className="text-sm leading-relaxed text-slate-700">
              We publish verifiable facts on this page (tool counts, update cadence) and do not fabricate review quotes. When
              Trustpilot is connected, a micro-review widget will appear here using your{" "}
              <code className="rounded bg-violet-100/80 px-1 text-xs">NEXT_PUBLIC_TRUSTPILOT_BUSINESS_ID</code> env.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href="https://www.producthunt.com/products/toollabz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 min-w-[44px] items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
              >
                View on Product Hunt
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
              >
                Share feedback
              </Link>
              <Link
                href="/tools"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
              >
                Explore tools
              </Link>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-6 lg:py-7">
        <div className="flex flex-col gap-8 rounded-2xl border border-violet-400/60 bg-gradient-to-r from-violet-700 via-violet-600 to-blue-600 px-5 py-10 text-white shadow-[0_20px_60px_rgba(76,29,149,0.3)] sm:px-8 sm:py-12 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-[0_0_28px_rgba(255,255,255,0.2)] backdrop-blur">
              <Mail className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
            <h3 className="text-xl font-semibold sm:text-2xl">Stay in the loop</h3>
            <p className="mt-1 text-sm text-violet-100">
              Get notified when we add new tools - no spam, unsubscribe anytime.
            </p>
            </div>
          </div>
          <div className="w-full min-w-0 md:max-w-md md:flex-shrink-0">
            <NewsletterFormDeferred />
          </div>
        </div>
        </div>
      </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumbLd) }} />
    </div>
  );
}
