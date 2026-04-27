import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, CheckCircle2, ChevronRight, HelpCircle, ShieldCheck, Smartphone, Sparkles, Zap } from "lucide-react";
import { ToolDefinition } from "@/lib/tools/types";
import { tools } from "@/lib/tools/data";
import { getRelatedToolsForLayout } from "@/lib/tools/related";
import { getMarketingHubForTool } from "@/lib/tools/directory-groups";
import { getToolFaqs, getToolSeoContent } from "@/lib/tools/content";
import {
  countWords,
  getToolDepthFormulaSection,
  getToolDepthHowToNarrative,
  getToolDepthIntroParagraphs,
} from "@/lib/tools/tool-page-depth";
import {
  getToolDeepGuideParagraphs,
  getToolLogicExplanationParagraph,
  getToolRealWorldExampleBullets,
} from "@/lib/tools/tool-deep-seo";
import { getCategoryIcon } from "@/utils/icons";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import { toolIllustrationSrc } from "@/lib/tools/tool-illustration";
import { slugContentVariant } from "@/lib/tools/content-variation";
import { getGuideLinksForTool } from "@/lib/blog/guides-for-tool";
import BookmarkToolButtonDeferred from "./BookmarkToolButtonDeferred";
import PageLastUpdated from "./PageLastUpdated";
import PopularCalculationsBlock from "./PopularCalculationsBlock";
import ExpertDisclaimer from "./ExpertDisclaimer";
import { toolIsFinanceCategory, toolNeedsEditorialReviewLine, toolNeedsExpertDisclaimer } from "@/lib/tools/ymyl";

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
  const relatedWithFallback = (() => {
    const out = [...related];
    if (out.length >= 4) return out;
    const existing = new Set<string>([tool.slug, ...out.map((t) => t.slug)]);
    for (const t of tools) {
      if (existing.has(t.slug)) continue;
      out.push(t);
      existing.add(t.slug);
      if (out.length >= 6) break;
    }
    return out;
  })();
  const youMightAlsoLike = (() => {
    const sameCat = tools.filter((t) => t.slug !== tool.slug && t.category === tool.category);
    const out: ToolDefinition[] = [];
    const seen = new Set<string>([tool.slug]);
    for (const t of sameCat) {
      if (out.length >= 6) break;
      if (seen.has(t.slug)) continue;
      out.push(t);
      seen.add(t.slug);
    }
    for (const t of relatedWithFallback) {
      if (out.length >= 6) break;
      if (seen.has(t.slug)) continue;
      out.push(t);
      seen.add(t.slug);
    }
    return out;
  })();
  const primaryKeyword = tool.keywords[0] ?? "free online tool";
  const showFinanceDisclaimer = toolIsFinanceCategory(tool) || toolNeedsExpertDisclaimer(tool);
  const hub = getMarketingHubForTool(tool);
  const seoParagraphs = getToolSeoContent(tool);
  const deepParagraphs = getToolDeepGuideParagraphs(tool);
  const exampleBullets = getToolRealWorldExampleBullets(tool);
  const logicParagraph = getToolLogicExplanationParagraph(tool);
  const faqs = getToolFaqs(tool);
  const depthIntro = getToolDepthIntroParagraphs(tool);
  const depthHow = getToolDepthHowToNarrative(tool);
  const depthFormula = getToolDepthFormulaSection(tool);
  const editorialWordCount =
    countWords([...depthIntro, ...seoParagraphs, ...deepParagraphs, ...depthHow, ...depthFormula, logicParagraph].join(" ")) +
    countWords(exampleBullets.join(" ")) +
    countWords(faqs.map((x) => `${x.question} ${x.answer}`).join(" "));
  const guideLinks = getGuideLinksForTool(tool.slug, 4);
  const CategoryIcon = getCategoryIcon(tool.category);
  const useCaseVariant = slugContentVariant(`${tool.slug}-usecases`, 3);
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
      <header className={`mb-6 overflow-hidden p-6 sm:mb-8 sm:p-8 ${toolGlassPanel}`} data-content-section="hero">
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
        <PageLastUpdated className="mb-4" variant={toolNeedsEditorialReviewLine(tool) ? "editorial" : "content"} />
        {showFinanceDisclaimer ? <ExpertDisclaimer className="mb-4" /> : null}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/50 bg-gradient-to-r from-violet-600/10 to-blue-500/10 px-3 py-1 text-xs font-semibold text-violet-800 backdrop-blur-sm">
          <CategoryIcon className="h-3.5 w-3.5" aria-hidden />
          {categoryLabel(tool.category)}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-5xl">
          {tool.name}
          <span className="mt-2 block text-lg font-bold leading-snug text-violet-900/90 sm:text-2xl">
            {primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)}
          </span>
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">{tool.description}</p>
        <details className="mt-3 sm:hidden">
          <summary className="cursor-pointer text-xs font-semibold text-violet-800">On this page (tap to expand)</summary>
          <div className="mt-2 flex flex-col gap-1.5 text-xs font-medium text-slate-600">
            <Link href="#what-this-tool-does" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              What this tool does
            </Link>
            <Link href="#tool-guides" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              Guides
            </Link>
            <Link href="#how-to-use" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              How to use
            </Link>
            <Link href="#example-usage" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              Example usage
            </Link>
            <Link href="#tool-faqs" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              FAQs
            </Link>
            <Link href="#related-tools" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              Related tools
            </Link>
          </div>
        </details>
        <div className="mt-3 hidden flex-wrap items-center gap-2 text-xs font-medium text-slate-600 sm:flex">
          <Link
            href="#what-this-tool-does"
            className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700"
          >
            What this tool does
          </Link>
          <Link href="#tool-guides" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            Guides
          </Link>
          <Link href="#how-to-use" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            How to use
          </Link>
          <Link href="#example-usage" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            Example usage
          </Link>
          <Link href="#tool-faqs" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            FAQs
          </Link>
          <Link href="#related-tools" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            Related tools
          </Link>
        </div>
        <p className="mt-2 text-[11px] text-slate-500" aria-live="polite">
          Editorial depth (excl. nav/footer): ~{editorialWordCount} words of explainer + FAQs on this URL.
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
      </header>

      <div className="min-w-0" data-content-section="calculator">
        {children}
      </div>

      <section
        className="mt-10 border-t border-violet-200/40 pt-10"
        aria-label={`${tool.name} illustration`}
      >
        <div className="relative mx-auto max-w-md sm:max-w-lg">
          <Image
            src={toolIllustrationSrc()}
            alt={`Illustration for ${tool.name} — Toollabz free online tool`}
            width={719}
            height={547}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 100vw, 28rem"
            className="h-auto w-full max-h-[min(16rem,40vh)] object-contain object-center opacity-95 sm:max-h-[min(18rem,42vh)]"
          />
        </div>
      </section>

      <section
        id="what-this-tool-does"
        className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}
        data-content-section="explainer"
      >
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">What this tool does</h2>
        {depthIntro.map((paragraph, idx) => (
          <p key={`depth-intro-${idx}`} className="leading-7 text-slate-700">
            {paragraph}
          </p>
        ))}
        {seoParagraphs.map((paragraph, idx) => (
          <p key={`seo-${idx}`} className="leading-7 text-slate-700">
            {paragraph}
          </p>
        ))}
      </section>

      <section id="tool-guides" className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`} data-content-section="guides">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Guides and explainers</h2>
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
          Long-form walkthroughs that pair well with this calculator. When you need narrative context beyond the live fields,
          start here and return to the tool to plug in your own numbers.
        </p>
        {guideLinks.length > 0 ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {guideLinks.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/blog/${g.slug}`}
                  className={`block h-full rounded-xl border border-violet-200/55 bg-white/80 p-4 transition hover:border-violet-300/70 hover:shadow-sm`}
                >
                  <p className="font-semibold text-slate-900">{g.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{g.description}</p>
                  <span className="mt-2 inline-block text-xs font-medium text-violet-700">Read guide →</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Browse the{" "}
            <Link href="/blog" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              Toollabz blog
            </Link>{" "}
            for finance, business, and productivity guides. New articles are added regularly and often reference the same
            workflows as the tool directory.
          </p>
        )}
        <p className="text-sm text-slate-600">
          <Link href="/blog" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            View all posts
          </Link>
        </p>
      </section>

      <section className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`} data-content-section="deep_guide">
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

      <section className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`} data-content-section="logic">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">How the calculation works</h2>
        {depthFormula.map((paragraph, idx) => (
          <p key={`depth-formula-${idx}`} className="leading-7 text-slate-700">
            {paragraph}
          </p>
        ))}
        <p className="leading-7 text-slate-700">{logicParagraph}</p>
      </section>

      <section id="example-usage" className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`} data-content-section="examples">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Example usage</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          {exampleBullets.map((line, idx) => (
            <li key={`ex-${tool.slug}-${idx}`}>{line}</li>
          ))}
        </ul>
      </section>

      <section className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`} data-content-section="use_cases">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Common use cases</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          {useCaseVariant === 0 ? (
            <>
              <li>
                Run a quick {tool.name.toLowerCase()} pass before you paste figures into email, a slide deck, or a
                spreadsheet workflow.
              </li>
              <li>Line up two realistic inputs when you are weighing options, rates, or different time horizons.</li>
            </>
          ) : useCaseVariant === 1 ? (
            <>
              <li>
                Use {tool.name} as a checkpoint after someone sends you a screenshot so you can reproduce their math
                independently.
              </li>
              <li>Capture outputs during a live call so everyone agrees on the baseline before commitments move forward.</li>
            </>
          ) : (
            <>
              <li>
                Drop {tool.name.toLowerCase()} into a weekly review ritual when the same metric shows up across multiple
                documents.
              </li>
              <li>Pair this page with the related utilities below when one number is never the whole story.</li>
            </>
          )}
          <li>Share the canonical Toollabz HTTPS URL so collaborators inherit the same field labels and assumptions.</li>
          {tool.keywords.slice(0, 2).map((kw) => (
            <li key={kw}>
              Explore searches around &quot;{kw}&quot; using this page together with the related tools listed below.
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4" data-content-section="features">
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

      <section id="how-to-use" className="mt-12 space-y-4" data-content-section="howto">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">How to use</h2>
        <div className={`space-y-3 p-6 sm:space-y-4 sm:p-8 ${toolGlassCard}`}>
          {depthHow.map((paragraph, idx) => (
            <p key={`depth-how-${idx}`} className="text-sm leading-7 text-slate-700 sm:text-base">
              {paragraph}
            </p>
          ))}
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

      <section id="tool-faqs" className="mt-12 space-y-4" data-content-section="faq">
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

      <section id="related-tools" className="mt-12" data-content-section="related">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Related tools</h2>
        <p className="mt-1 text-sm text-slate-600">
          Same-session utilities we surface for {primaryKeyword}; open a few tabs and compare outputs before you commit to a
          number.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {relatedWithFallback.map((item) => {
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

      <section id="you-might-also-like" className="mt-12" data-content-section="suggested">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">You might also like</h2>
        <p className="mt-1 text-sm text-slate-600">
          Same-category picks first, then high-intent neighbors — lightweight internal linking for topic clusters on Toollabz.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {youMightAlsoLike.map((item) => {
            const RelatedIcon = getCategoryIcon(item.category);
            return (
              <Link
                key={`you-${item.slug}`}
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
