import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, CheckCircle2, ChevronRight, HelpCircle, ShieldCheck, Smartphone, Sparkles, Zap } from "lucide-react";
import { ToolDefinition } from "@/lib/tools/types";
import { tools } from "@/lib/tools/data";
import { getRelatedToolsForLayout } from "@/lib/tools/related";
import { getMarketingHubForTool } from "@/lib/tools/directory-groups";
import { getToolFaqs, getToolSeoContent } from "@/lib/tools/content";
import {
  getToolDeepGuideParagraphs,
  getToolLogicExplanationParagraph,
  getToolRealWorldExampleBullets,
} from "@/lib/tools/tool-deep-seo";
import { getCategoryIcon } from "@/utils/icons";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import { toolIllustrationSrc } from "@/lib/tools/tool-illustration";
import BookmarkToolButtonDeferred from "./BookmarkToolButtonDeferred";
import PageLastUpdated from "./PageLastUpdated";
import PopularCalculationsBlock from "./PopularCalculationsBlock";

function categoryLabel(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const heroBadges = [
  { label: "100% Free", Icon: Sparkles },
  { label: "No Sign Up", Icon: CheckCircle2 },
  { label: "Accurate Results", Icon: Sparkles },
  { label: "Mobile Friendly", Icon: Smartphone },
] as const;

export default function ToolLayout({ tool, children }: { tool: ToolDefinition; children: React.ReactNode }) {
  const related = getRelatedToolsForLayout(tool, tools);
  const hub = getMarketingHubForTool(tool);
  const seoParagraphs = getToolSeoContent(tool);
  const deepParagraphs = getToolDeepGuideParagraphs(tool);
  const exampleBullets = getToolRealWorldExampleBullets(tool);
  const logicParagraph = getToolLogicExplanationParagraph(tool);
  const faqs = getToolFaqs(tool);
  const CategoryIcon = getCategoryIcon(tool.category);
  const featurePoints = [
    {
      title: "Instant response",
      description: "Get output immediately with clean, readable breakdowns.",
      icon: Zap,
    },
    {
      title: "Accurate logic",
      description: "Validated inputs and deterministic formulas for consistency.",
      icon: BadgeCheck,
    },
    {
      title: "Privacy friendly",
      description: "Run calculations without sign-up or personal profile storage.",
      icon: ShieldCheck,
    },
    {
      title: "Cross-device ready",
      description: "Optimized layout for mobile, tablet, and desktop workflows.",
      icon: Smartphone,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-0 sm:px-6 sm:pt-10 sm:pb-1 lg:px-8">
      <header className={`mb-4 overflow-hidden p-6 sm:p-8 lg:mb-8 ${toolGlassPanel}`}>
        <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-violet-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <Link href={`/category/${tool.category}`} className="transition hover:text-violet-600">
            {categoryLabel(tool.category)}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <span className="font-medium text-slate-700">{tool.name}</span>
        </nav>
        <PageLastUpdated className="mb-4" />
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/50 bg-gradient-to-r from-violet-600/10 to-blue-500/10 px-3 py-1 text-xs font-semibold text-violet-800 backdrop-blur-sm">
            <CategoryIcon className="h-3.5 w-3.5" aria-hidden />
            {categoryLabel(tool.category)}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-5xl">
              {tool.name}
            </h1>
            <div className="hidden lg:block">
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {tool.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {heroBadges.map(({ label, Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/70 bg-white/75 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    <Icon className="h-3.5 w-3.5 text-violet-600" aria-hidden />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-lg lg:mx-0 lg:ml-auto lg:block lg:-mr-8 lg:pr-0">
            <Image
              src={toolIllustrationSrc()}
              alt={`${tool.name} - ${categoryLabel(tool.category)} free online tool illustration`}
              width={719}
              height={547}
              sizes="(max-width: 1024px) 100vw, 448px"
              className="h-auto w-full max-h-[min(22rem,52vh)] object-contain object-center drop-shadow-[0_12px_28px_rgba(76,29,149,0.12)] lg:object-right"
            />
          </div>
        </div>
      </header>

      <div>{children}</div>

      <div className="mt-6 space-y-4 lg:hidden">
        <div className="relative mx-auto max-w-lg">
          <Image
            src={toolIllustrationSrc()}
            alt={`${tool.name} - ${categoryLabel(tool.category)} free online tool illustration`}
            width={719}
            height={547}
            className="h-auto w-full max-h-[min(18rem,45vh)] object-contain object-center"
            sizes="(max-width: 1024px) 100vw, 448px"
          />
        </div>
        <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">{tool.description}</p>
        <div className="flex flex-wrap gap-2">
          {heroBadges.map(({ label, Icon }) => (
            <span
              key={`below-fold-${label}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/70 bg-white/75 px-3 py-1 text-xs font-medium text-slate-700"
            >
              <Icon className="h-3.5 w-3.5 text-violet-600" aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </div>

      <section className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">About {tool.name}</h2>
        {seoParagraphs.map((paragraph, idx) => (
          <p key={`seo-${idx}`} className="leading-7 text-slate-700">
            {paragraph}
          </p>
        ))}
      </section>

      <section className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Detailed guide</h2>
        {deepParagraphs.map((paragraph, idx) => (
          <p key={`deep-${idx}`} className="leading-7 text-slate-700">
            {paragraph}
          </p>
        ))}
        <p className="leading-7 text-slate-700">
          Continue in the{" "}
          <Link href={`/category/${tool.category}`} className="font-medium text-violet-800 underline-offset-2 hover:underline">
            {categoryLabel(tool.category)} category hub
          </Link>{" "}
          or open these related tools in the same session:{" "}
          {related.slice(0, 6).map((rt, i) => (
            <span key={rt.slug}>
              {i > 0 ? ", " : null}
              <Link href={`/tools/${rt.slug}`} className="font-medium text-violet-800 underline-offset-2 hover:underline">
                {rt.name}
              </Link>
            </span>
          ))}
          .
        </p>
      </section>

      <section className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">How the calculation works</h2>
        <p className="leading-7 text-slate-700">{logicParagraph}</p>
      </section>

      <section className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Real-world examples</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          {exampleBullets.map((line, idx) => (
            <li key={`ex-${tool.slug}-${idx}`}>{line}</li>
          ))}
        </ul>
      </section>

      <section className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Common use cases</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          <li>
            Run a quick {tool.name.toLowerCase()} check before you paste numbers into email, a deck, or a spreadsheet
            workflow.
          </li>
          <li>Compare two realistic inputs side by side when you are deciding between options, rates, or time horizons.</li>
          <li>Share the HTTPS Toollabz URL with collaborators so everyone reviews the same assumptions and outputs.</li>
          {tool.keywords.slice(0, 2).map((kw) => (
            <li key={kw}>
              Explore intent around &quot;{kw}&quot; using this page together with the related tools listed below.
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Features</h2>
        <div className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {featurePoints.map((point) => {
              const Icon = point.icon;
              return (
                <li key={point.title} className="rounded-xl border border-violet-200/55 bg-white/75 p-4 shadow-sm">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {point.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{point.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">How to use</h2>
        <div className={`p-6 sm:p-8 ${toolGlassCard}`}>
          <ol className="grid gap-3 sm:gap-4">
            {tool.howToUse.map((step, idx) => (
              <li key={step} className="flex items-start gap-3 rounded-xl border border-violet-200/55 bg-white/75 p-4">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-6 text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {tool.slug === "loan-calculator" ? <PopularCalculationsBlock variant="loan" /> : null}
      {tool.slug === "salary-after-tax-calculator" ? <PopularCalculationsBlock variant="salary" /> : null}

      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">FAQs</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.question} className={`p-5 sm:p-6 ${toolGlassCard}`}>
              <h3 className="inline-flex items-start gap-2 font-semibold text-slate-900">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700">
                  <HelpCircle className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span>{faq.question}</span>
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Related tools</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {related.map((item) => {
            const RelatedIcon = getCategoryIcon(item.category);
            return (
              <Link
                key={item.slug}
                href={`/tools/${item.slug}`}
                className={`group block p-5 transition duration-300 hover:-translate-y-0.5 ${toolGlassCard} hover:border-violet-300/60 hover:shadow-[0_12px_32px_rgba(99,102,241,0.12)]`}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <RelatedIcon className="h-4 w-4" aria-hidden />
                </span>
              <p className="font-semibold text-slate-900 group-hover:text-violet-800">{item.name}</p>
              <p className="mt-1 text-sm text-slate-600">{item.shortDescription}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={`mt-6 mb-3 p-6 sm:mb-4 sm:p-8 ${toolGlassPanel}`}>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Next step</h2>
        <p className="mt-2 text-slate-600">
          Open the full directory, browse your hub collection, or jump back to this category. Bookmark the page if you use it often.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/tools"
            className="inline-flex rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
          >
            All tools
          </Link>
          <Link
            href={hub.href}
            className="inline-flex rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
          >
            {hub.title}
          </Link>
          <Link
            href={`/category/${tool.category}`}
            className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
          >
            {categoryLabel(tool.category)} category
          </Link>
          <Link
            href="/blog"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Guides
          </Link>
          <BookmarkToolButtonDeferred slug={tool.slug} />
        </div>
      </section>
    </div>
  );
}
