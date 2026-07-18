import Link from "next/link";
import { BadgeCheck, CheckCircle2, ChevronRight, HelpCircle, ShieldCheck, Smartphone, Sparkles, Zap } from "lucide-react";
import { ToolDefinition } from "@/lib/tools/types";
import { tools } from "@/lib/tools/data";
import { getRelatedToolsForLayout } from "@/lib/tools/related";
import { getMarketingHubForTool } from "@/lib/tools/directory-groups";
import { getToolFaqs, getToolFormula } from "@/lib/tools/content";
import { getCategoryIcon } from "@/utils/icons";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import ToolHeroVisual from "@/components/ToolHeroVisual";
import { getGuideLinksForTool } from "@/lib/blog/guides-for-tool";
import BookmarkToolButtonDeferred from "./BookmarkToolButtonDeferred";
import EmbedCalculatorButton from "./EmbedCalculatorButton";
import PageLastUpdated from "./PageLastUpdated";
import PopularCalculationsBlock from "./PopularCalculationsBlock";
import ExpertDisclaimer from "./ExpertDisclaimer";
import ToolPageTocStrip from "./ToolPageTocStrip";
import AuthorBadge from "./AuthorBadge";
import { toolIsFinanceCategory, toolNeedsEditorialReviewLine, toolNeedsExpertDisclaimer } from "@/lib/tools/ymyl";
import { getRelatedFormulasList } from "@/lib/tools/tool-longtail-blocks";
import { getRelatedArticlesForTool } from "@/lib/tools/priority-tool-content";
import { getToolEditorial } from "@/lib/tools/tool-editorial";
import FormulaFlowDiagram from "@/components/FormulaFlowDiagram";
import ToolSessionActions from "@/components/ToolSessionActions";
import RecentlyUsedTools from "@/components/RecentlyUsedTools";
import { getGlossaryTermsForTool } from "@/lib/glossary/terms";

function categoryLabel(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const heroBadges = [
  { label: "100% Free", Icon: Sparkles },
  { label: "No Sign Up", Icon: CheckCircle2 },
  { label: "Transparent formulas", Icon: BadgeCheck },
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
  const editorial = getToolEditorial(tool);
  const glossaryTerms = getGlossaryTermsForTool(tool.slug);
  const faqs = getToolFaqs(tool);
  const formulaTableRows = getRelatedFormulasList(tool);
  const formula = getToolFormula(tool.slug);
  const quickAnswer = editorial.quickAnswer;
  const relatedArticles = getRelatedArticlesForTool(tool);
  const guideLinks = getGuideLinksForTool(tool.slug, 4);
  const CategoryIcon = getCategoryIcon(tool.category);
  const featurePoints = [
    {
      title: "Instant response",
      description: `Run ${tool.name} in the browser and read the breakdown beside the form.`,
      icon: Zap,
    },
    {
      title: "Transparent formula",
      description: "The formula and worked example on this page match what the calculator uses.",
      icon: BadgeCheck,
    },
    {
      title: "Privacy friendly",
      description: "No account required; inputs stay in your session unless you choose to share them.",
      icon: ShieldCheck,
    },
    {
      title: "Cross-device ready",
      description: "Layout works on mobile, tablet, and desktop for the same field labels.",
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
        <div className="mt-2 flex flex-col items-center gap-6 sm:mt-0 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="min-w-0 w-full flex-1 text-center lg:max-w-none lg:text-left">
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
          </div>
          <ToolHeroVisual tool={tool} />
        </div>
        <details className="mt-3 sm:hidden">
          <summary className="cursor-pointer text-xs font-semibold text-violet-800">On this page (tap to expand)</summary>
          <div className="mt-2 flex flex-col gap-1.5 text-xs font-medium text-slate-600">
            <Link href="#what-this-tool-does" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              What is this tool
            </Link>
            <Link href="#tool-guides" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              Guides
            </Link>
            <Link href="#how-to-use" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              How to use it
            </Link>
            <Link href="#example-usage" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              Example calculation
            </Link>
            <Link href="#common-mistakes" className="rounded-lg border border-violet-200 bg-white/75 px-3 py-2 hover:text-violet-700">
              Common mistakes
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
            What is this tool
          </Link>
          <Link href="#tool-guides" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            Guides
          </Link>
          <Link href="#how-to-use" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            How to use it
          </Link>
          <Link href="#example-usage" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            Example calculation
          </Link>
          <Link href="#common-mistakes" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            Common mistakes
          </Link>
          <Link href="#tool-faqs" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            FAQs
          </Link>
          <Link href="#related-tools" className="rounded-full border border-violet-200 bg-white/75 px-3 py-1 hover:text-violet-700">
            Related tools
          </Link>
        </div>
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

      <section
        className="quick-answer-box mb-6 rounded-xl border border-sky-200 bg-sky-50 px-5 py-4 text-slate-800 shadow-sm"
        aria-label="Quick answer"
      >
        <p className="font-semibold text-slate-950">{quickAnswer.title}</p>
        <p className="mt-2 leading-7">{quickAnswer.answer}</p>
        <p className="mt-2 leading-7">
          <span className="font-semibold">Example:</span> {quickAnswer.example}
        </p>
      </section>

      <div className="min-w-0" data-content-section="calculator">
        {children}
      </div>

      <ToolPageTocStrip />

      <section
        id="what-this-tool-does"
        className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}
        data-content-section="explainer"
      >
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">What this calculator does</h2>
        <dl className="rounded-xl border border-violet-100 bg-white/85 px-4 py-3 text-sm leading-relaxed text-slate-700">
          <dt className="font-semibold text-slate-900">{tool.name}</dt>
          <dd className="mt-1">{tool.shortDescription}</dd>
        </dl>
        {editorial.definition.map((paragraph, idx) => (
          <p key={`def-${idx}`} className="leading-7 text-slate-700">
            {paragraph}
          </p>
        ))}
        <h3 className="text-lg font-semibold text-slate-800">When to use it</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          {editorial.whenToUse.map((line) => (
            <li key={line.slice(0, 40)}>{line}</li>
          ))}
        </ul>
        <h3 className="text-lg font-semibold text-slate-800">Key takeaways</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          {editorial.takeaways.map((line) => (
            <li key={line.slice(0, 40)}>{line}</li>
          ))}
        </ul>
      </section>

      <section id="how-to-use" className="mt-12 space-y-4" data-content-section="howto">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">How to use this tool</h2>
        <div className={`space-y-3 p-6 sm:space-y-4 sm:p-8 ${toolGlassCard}`}>
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
        {relatedArticles.length > 0 ? (
          <div className="mt-5 rounded-xl border border-violet-100 bg-white/75 p-4">
            <h3 className="font-semibold text-slate-900">Related Guides</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {relatedArticles.map((article) => (
                <li key={article.url}>
                  <Link href={article.url} className="font-medium text-violet-800 underline-offset-2 hover:underline">
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section
        id="tool-detailed-guide"
        className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}
        data-content-section="deep_guide"
      >
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Practical scenarios</h2>
        <p className="leading-7 text-slate-700">{editorial.whoUses}</p>
        <p className="leading-7 text-slate-700">
          Continue in the{" "}
          <Link href={`/category/${tool.category}`} className="font-medium text-violet-800 underline-offset-2 hover:underline">
            {categoryLabel(tool.category)} category hub
          </Link>
          , the{" "}
          <Link href={hub.href} className="font-medium text-violet-800 underline-offset-2 hover:underline">
            {hub.title}
          </Link>{" "}
          collection, or the{" "}
          <Link href="/glossary" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            glossary
          </Link>
          . Related calculators in this session:{" "}
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
        {glossaryTerms.length > 0 ? (
          <div className="rounded-xl border border-violet-100 bg-white/75 p-4">
            <h3 className="font-semibold text-slate-900">Related definitions</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {glossaryTerms.map((term) => (
                <li key={term.slug}>
                  <Link
                    href={`/glossary/${term.slug}`}
                    className="font-medium text-violet-800 underline-offset-2 hover:underline"
                  >
                    {term.term}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section
        id="tool-formula"
        className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}
        data-content-section="logic"
      >
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Key formula explained</h2>
        <h3 className="text-lg font-semibold text-slate-800">How the calculation works</h3>
        <FormulaFlowDiagram
          toolName={tool.name}
          inputs={tool.fields.map((f) => f.label)}
          formula={formula}
        />
        <div className="rounded-xl border border-violet-100 bg-white/90 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-violet-700">The Formula</p>
          <code className="mt-2 block overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-950 px-3 py-2 text-sm text-white">
            {formula}
          </code>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700">
            {tool.fields.slice(0, 6).map((field) => (
              <li key={field.name}>
                <span className="font-medium text-slate-900">{field.label}</span>: the value you enter for{" "}
                {field.name.replace(/([A-Z])/g, " $1").toLowerCase()}.
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-x-auto rounded-lg border border-violet-100 bg-white/90">
          <table className="min-w-full text-left text-sm text-slate-700">
            <caption className="border-b border-violet-100 px-3 py-2 text-left text-xs font-semibold text-slate-600">
              Core relationships (snippet-friendly summary)
            </caption>
            <tbody>
              {formulaTableRows.map((row) => (
                <tr key={row.label} className="border-t border-violet-100">
                  <th scope="row" className="whitespace-nowrap px-3 py-2 font-medium text-slate-800">
                    {row.label}
                  </th>
                  <td className="px-3 py-2 font-mono text-xs text-slate-700 sm:text-sm">{row.expression}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editorial.formulaExplanation.map((paragraph, idx) => (
          <p key={`formula-x-${idx}`} className="leading-7 text-slate-700">
            {paragraph}
          </p>
        ))}
        {editorial.benchmark ? (
          <aside className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-slate-800">
            <p className="font-semibold text-slate-900">Useful fact (cited)</p>
            <p className="mt-2 leading-6">{editorial.benchmark.fact}</p>
            <p className="mt-2 text-xs text-slate-600">
              Source:{" "}
              <a
                href={editorial.benchmark.sourceHref}
                className="font-medium text-violet-800 underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {editorial.benchmark.sourceLabel}
              </a>
            </p>
            <p className="mt-2 text-xs text-slate-600">Limitation: {editorial.benchmark.limitation}</p>
          </aside>
        ) : null}
      </section>

      <section
        id="tool-comparison"
        className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}
        data-content-section="comparison_longtail"
      >
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Related calculations</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Keep the same assumptions and open a neighbor calculator when your question branches:{" "}
          {related.slice(0, 4).map((rt, i) => (
            <span key={rt.slug}>
              {i > 0 ? ", " : null}
              <Link href={`/tools/${rt.slug}`} className="font-medium text-violet-800 underline-offset-2 hover:underline">
                {rt.name}
              </Link>
            </span>
          ))}
          . Each page documents its own formula beside the fields.
        </p>
        <p className="text-sm text-slate-600">
          Learning links:{" "}
          <Link href="/methodology" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Methodology
          </Link>
          {" · "}
          <Link href="/editorial-policy" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Editorial policy
          </Link>
          {" · "}
          <Link href="/glossary" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            Glossary
          </Link>
        </p>
      </section>

      <section id="example-usage" className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`} data-content-section="examples">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Worked real-world example</h2>
        <p className="leading-7 text-slate-700">{editorial.workedExample}</p>
        <p className="text-sm text-slate-600">
          Re-enter the same numbers in the calculator above to confirm the page math matches the interactive result.
        </p>
      </section>

      <section
        id="tool-benefits"
        className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}
        data-content-section="use_cases"
      >
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Who uses this tool?</h2>
        <p className="leading-7 text-slate-700">{editorial.whoUses}</p>
      </section>

      <section id="tool-features" className="mt-12 space-y-4" data-content-section="features">
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

      {tool.slug === "loan-calculator" ? <PopularCalculationsBlock variant="loan" /> : null}
      {tool.slug === "salary-after-tax-calculator" ? <PopularCalculationsBlock variant="salary" /> : null}

      <section id="common-mistakes" className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`} data-content-section="mistakes">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Common mistakes</h2>
        <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
          {editorial.mistakes.map((paragraph, idx) => (
            <li key={`mist-${idx}`}>{paragraph}</li>
          ))}
        </ul>
      </section>

      <section id="tool-sources" className={`mt-12 space-y-4 p-6 sm:p-8 ${toolGlassCard}`} data-content-section="sources">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">References &amp; sources</h2>
        <p className="text-sm text-slate-600">
          Official references for context. Calculator outputs are planning estimates—confirm material decisions with the
          primary authority or a qualified professional. See our{" "}
          <Link href="/methodology" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            methodology
          </Link>{" "}
          and{" "}
          <Link href="/editorial-policy" className="font-medium text-violet-800 underline-offset-2 hover:underline">
            editorial policy
          </Link>
          .
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {editorial.sources.map((src) => (
            <li key={src.href}>
              <a
                href={src.href}
                className="font-medium text-violet-800 underline-offset-2 hover:underline"
                {...(src.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {src.label}
              </a>
              {src.note ? <span className="text-slate-500"> — {src.note}</span> : null}
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500">
          Reviewed {editorial.lastReviewedLabel} · Content stamp {editorial.lastUpdatedLabel}
        </p>
      </section>

      <section id="tool-faqs" className="mt-12 space-y-4" data-content-section="faq">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">FAQs</h2>
        <p className="text-sm text-slate-600">Click a question to expand the answer.</p>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className={`overflow-hidden [&[open]>summary_.faq-chevron]:rotate-90 ${toolGlassCard}`}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-5 sm:p-6 [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500">
                <span className="inline-flex min-w-0 flex-1 items-start gap-2 font-semibold text-slate-900">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700">
                    <HelpCircle className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="min-w-0">{faq.question}</span>
                </span>
                <ChevronRight
                  className="faq-chevron mt-1 h-4 w-4 shrink-0 text-violet-500 transition-transform duration-200"
                  aria-hidden
                />
              </summary>
              <div className="border-t border-violet-100/80 px-5 pb-5 sm:px-6 sm:pb-6">
                <p className="pt-3 text-sm leading-6 text-slate-600 sm:pt-4">{faq.answer}</p>
              </div>
            </details>
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
          Same-category picks first, then high-intent neighbors that often answer the next calculation question.
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
          <ToolSessionActions slug={tool.slug} name={tool.name} />
          <BookmarkToolButtonDeferred slug={tool.slug} />
          <EmbedCalculatorButton slug={tool.slug} name={tool.name} />
        </div>
        <RecentlyUsedTools currentSlug={tool.slug} />
      </section>

      <AuthorBadge
        name={editorial.reviewer.name}
        role={editorial.reviewer.role}
        lastReviewed={editorial.lastReviewedLabel}
        profileHref={editorial.reviewer.profileHref}
        className="mb-6"
      />
    </div>
  );
}
