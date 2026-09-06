import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ToolWorkspaceShell from "@/components/ToolWorkspaceShell";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import type { Locale } from "@/lib/i18n/locales";
import { getUiMessages } from "@/lib/i18n/ui-messages";
import { getToolCopy } from "@/lib/i18n/tool-messages";
import { localizePath } from "@/lib/i18n/paths";
import { isLocalizedToolSlug, localizedRelatedSlugs, type LocalizedToolSlug } from "@/lib/i18n/catalog";
import { localizeToolDefinition } from "@/lib/i18n/localize-tool";
import { toolMap } from "@/lib/tools/data";
import {
  breadcrumbJsonLd,
  faqPageSchemaFromPairs,
  howToSchema,
  toolSchema,
  webPageSchema,
} from "@/lib/seo";

export default function LocalizedToolView({ locale, slug }: { locale: Locale; slug: LocalizedToolSlug }) {
  const tool = toolMap.get(slug);
  if (!tool) return null;
  const copy = getToolCopy(locale, slug);
  const ui = getUiMessages(locale);
  const localized = localizeToolDefinition(tool, locale);
  const insight = null;
  const path = localizePath(`/tools/${slug}`, locale);
  const faqs = copy.faqs;

  const breadcrumbLd = breadcrumbJsonLd([
    { name: ui.common.home, path: localizePath("/", locale) },
    { name: ui.nav.tools, path: localizePath("/tools", locale) },
    { name: copy.name, path },
  ]);

  const related = localizedRelatedSlugs(slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label={ui.common.breadcrumb}>
        <Link href={localizePath("/", locale)} className="transition hover:text-violet-600">
          {ui.common.home}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <Link href={localizePath("/tools", locale)} className="transition hover:text-violet-600">
          {ui.nav.tools}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="font-medium text-slate-700">{copy.name}</span>
      </nav>

      <header className={`mb-6 p-6 sm:p-8 ${toolGlassPanel}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{copy.h1}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-700">{copy.intro}</p>
        <p className="mt-3 text-sm text-slate-500">{ui.common.languageNote}</p>
        <p className="mt-2 text-sm">
          <Link href={`/tools/${slug}`} className="font-medium text-violet-800 underline-offset-2 hover:underline">
            {ui.tool.seeAlsoEnglish}
          </Link>
        </p>
      </header>

      <section className="quick-answer-box mb-6 rounded-xl border border-sky-200 bg-sky-50 px-5 py-4 text-slate-800" aria-label={ui.tool.quickAnswer}>
        <p className="font-semibold">{ui.tool.quickAnswer}</p>
        <p className="mt-2 leading-7">{copy.whatItDoes}</p>
        <p className="mt-2 leading-7">
          <span className="font-semibold">{ui.tool.example}:</span> {copy.example}
        </p>
      </section>

      <div className="min-w-0">
        <ToolWorkspaceShell tool={localized} insight={insight} locale={locale} />
      </div>

      <section className={`mt-10 space-y-4 p-6 sm:p-8 ${toolGlassCard}`}>
        <h2 className="text-xl font-bold text-slate-900">{ui.tool.whatThisDoes}</h2>
        <p className="leading-7 text-slate-700">{copy.whatItDoes}</p>
        <h3 className="text-lg font-semibold text-slate-800">{ui.tool.whoItsFor}</h3>
        <p className="leading-7 text-slate-700">{copy.whoItsFor}</p>
        <h3 className="text-lg font-semibold text-slate-800">{ui.tool.howItWorks}</h3>
        <p className="leading-7 text-slate-700">{copy.howItWorks}</p>
        <h3 className="text-lg font-semibold text-slate-800">{ui.tool.formula}</h3>
        <p className="font-mono text-sm leading-7 text-slate-800">{copy.formula}</p>
        <h3 className="text-lg font-semibold text-slate-800">{ui.tool.assumptions}</h3>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          {copy.assumptions.map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ul>
        <h3 className="text-lg font-semibold text-slate-800">{ui.tool.limitations}</h3>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          {copy.limitations.map((item) => (
            <li key={item.slice(0, 48)}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">{ui.tool.howToUse}</h2>
        <ol className={`space-y-3 p-6 ${toolGlassCard}`}>
          {copy.howToUse.map((step, idx) => (
            <li key={step} className="flex gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                {idx + 1}
              </span>
              <span className="leading-6 text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={`mt-10 space-y-4 p-6 ${toolGlassCard}`}>
        <h2 className="text-xl font-bold text-slate-900">{ui.tool.faqs}</h2>
        <dl className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-semibold text-slate-900">{faq.question}</dt>
              <dd className="mt-1 text-slate-700">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`mt-10 space-y-4 p-6 ${toolGlassCard}`}>
        <h2 className="text-xl font-bold text-slate-900">{ui.tool.relatedTools}</h2>
        <ul className="flex flex-wrap gap-2">
          {related.map((rel) => {
            if (!isLocalizedToolSlug(rel)) return null;
            const relCopy = getToolCopy(locale, rel);
            return (
              <li key={rel}>
                <Link
                  href={localizePath(`/tools/${rel}`, locale)}
                  className="inline-flex rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:text-violet-700"
                >
                  {relCopy.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema(localized, path)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema(localized, path)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchemaFromPairs(faqs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema({ name: copy.h1, description: copy.description, path })),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </div>
  );
}
