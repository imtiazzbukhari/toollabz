import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
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
import { HOMEPAGE_AUTHORITY_SLUGS, POPULAR_TOOL_SLUGS } from "@/lib/tools/popular-tools";
import { TOOLLABZ_HERO_IMAGE } from "@/lib/tools/tool-illustration";
import { absoluteUrl, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { freshnessRankForSlug } from "@/lib/site-freshness";
import HomeSeoDeepSection from "@/components/HomeSeoDeepSection";
import PageLastUpdated from "@/components/PageLastUpdated";
import PopularCalculationsBlock from "@/components/PopularCalculationsBlock";

export const metadata: Metadata = {
  title: {
    absolute: "Toollabz - Free Online Tools: Calculators, Converters & PDF Hub",
  },
  description:
    `Browse ${tools.length}+ free calculators, converters & PDF tools on Toollabz — fast, HTTPS, with FAQs and hubs. No signup; canonical pages for every utility.`,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Toollabz - Free Online Tools: Calculators, Converters & PDF Hub",
    description:
      `Search ${tools.length}+ free calculators, converters, PDF utilities, and AI helpers on Toollabz — structured data, hubs, and internal links.`,
    url: siteUrl,
    type: "website",
    siteName: "Toollabz",
    images: [{ url: absoluteUrl("/logo-toollabz.webp"), width: 469, height: 469, alt: "Toollabz logo — free online tools hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toollabz - Free Online Tools: Calculators, Converters & PDF Hub",
    description:
      `Free calculators, converters & PDF hub: ${tools.length}+ tools on Toollabz with guides, FAQs, and category hubs.`,
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
  const recentlyUpdatedTools = [...tools]
    .sort((a, b) => freshnessRankForSlug(a.slug) - freshnessRankForSlug(b.slug))
    .slice(0, 12);
  const authorityTools = HOMEPAGE_AUTHORITY_SLUGS.map((slug) => tools.find((t) => t.slug === slug)).filter(
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
  const homepageCategories = [
    { label: "Finance", href: "/finance-tools", slug: "finance" },
    { label: "Business", href: "/business-tools", slug: "business" },
    { label: "Real Estate", href: "/real-estate-tools", slug: "real-estate" },
    { label: "AI Tools", href: "/ai-tools", slug: "generators" },
    { label: "Utilities", href: "/utility-tools", slug: "utility" },
  ] as const;

  const howItWorks = [
    { title: "Search", text: "Find the exact tool in seconds with smart search.", icon: Search },
    { title: "Use", text: "Fill in your values with a simple and guided flow.", icon: Wrench },
    { title: "Get Results", text: "Instantly get accurate output and copy with confidence.", icon: CheckCircle2 },
  ];

  const stats = [
    { value: `${tools.length}+`, label: "Free tools", icon: Sparkles },
    { value: "100%", label: "Free, no signup", icon: Users },
    { value: "No storage", label: "We do not keep your inputs", icon: ShieldCheck },
    { value: "Apr 2026", label: "Directory updated", icon: Zap },
  ];
  const trustItems = [
    { title: "Always Free", text: "All tools are 100% free to use. No hidden costs.", icon: Sparkles },
    { title: "Fast & Reliable", text: "Lightning-fast processing with accurate results.", icon: Zap },
    { title: "Privacy First", text: "Your data is secure and never stored on our servers.", icon: ShieldCheck },
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
                100% Free • No Limits
              </span>
              <h1 className="mt-5 text-[2.25rem] font-extrabold leading-[1.08] text-slate-900 text-balance sm:text-5xl md:mt-6 md:text-6xl">
                Free online tools, calculators
                <br />
                converters & PDF - <span className="text-gradient">smart hub</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:mt-5 md:mx-0">
                Fast, reliable, and beautifully crafted tools to solve your everyday workflows.
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
        </nav>
        <PageLastUpdated className="mt-1" />
      </div>
      <section id="categories" className="section-fade mt-6 bg-transparent md:mt-8">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-6 lg:py-7">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold sm:text-2xl">Browse by Category</h2>
          <Link href="/tools" className="inline-flex w-fit items-center gap-1 text-sm text-violet-600 transition duration-300 hover:text-violet-700">
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {homepageCategories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            const gradient = categoryGradients[category.slug] ?? "from-violet-500 to-blue-500";
            const count =
              category.slug === "generators"
                ? toolsInDirectoryGroup(tools, "ai").length
                : category.slug === "utility"
                  ? toolsInDirectoryGroup(tools, "utility").length
                  : tools.filter((t) => t.category === category.slug).length;
            return (
              <Link
                key={category.label}
                href={category.href}
                className="group rounded-2xl border border-white/50 bg-white/75 p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(76,29,149,0.12)]"
              >
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md transition duration-300 group-hover:shadow-[0_0_28px_rgba(99,102,241,0.45)]`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mt-4 text-base font-semibold text-slate-900">{category.label}</p>
                <p className="mt-1 text-sm text-slate-500">{count}+ tools</p>
              </Link>
            );
          })}
        </div>
        </div>
      </section>

      <section id="popular-tools" className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-6 lg:py-7">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold sm:text-2xl">Popular Tools</h2>
          <Link href="/tools" className="inline-flex w-fit items-center gap-1 text-sm text-violet-600 transition duration-300 hover:text-violet-700">
            <span>View all tools</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popular.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} showThumbnail={false} />
          ))}
        </div>
        </div>
      </section>

      <section className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold sm:text-2xl">Recently updated tools</h2>
            <Link href="/tools" className="inline-flex w-fit items-center gap-1 text-sm text-violet-600 transition duration-300 hover:text-violet-700">
              <span>Full directory</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <p className="mb-4 max-w-3xl text-sm text-slate-600">
            Ordering refreshes when the site content stamp changes - explore tools you might not see in the default
            popularity sort.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentlyUpdatedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} showThumbnail={false} />
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
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold sm:text-2xl">Major tools and hubs</h2>
            <Link href="/finance-tools" className="inline-flex w-fit items-center gap-1 text-sm text-violet-600 transition duration-300 hover:text-violet-700">
              <span>Finance hub</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <p className="mb-4 max-w-3xl text-sm text-slate-600">
            High-intent calculators, PDF utilities, and AI helpers - each page links onward to related tools and
            amount-specific benchmarks where they exist.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {authorityTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} showThumbnail={false} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-fade bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 md:py-4">
        <div className="mb-3 text-center md:text-left">
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Used by thousands</h2>
          <p className="mt-1 text-sm text-slate-600">
            {tools.length}+ free tools, reliable uptime, and a privacy-first experience on Toollabz.
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
          <p className="mt-1 text-sm text-slate-600">Search, run the tool, and copy results — illustrated with the same hub art you see on tool pages.</p>
        </div>
          <div className="mt-4 grid items-start gap-4 md:grid-cols-3">
            {howItWorks.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className={`relative overflow-hidden ${softSectionCardTight}`}>
                  <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl border border-violet-200/40 bg-gradient-to-br from-violet-50/90 to-blue-50/60">
                    <Image
                      src={TOOLLABZ_HERO_IMAGE}
                      alt={`Toollabz how it works — step ${idx + 1}: ${step.title}`}
                      width={480}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain object-center p-3 opacity-95"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
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
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Why Choose Toollabz</h2>
          <p className="mt-1 text-sm text-slate-600">Built for modern users who need fast, reliable, and private tools.</p>
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
              Get notified when we add new tools — no spam, unsubscribe anytime.
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
