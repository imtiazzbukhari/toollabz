import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { toolGlassPanel } from "@/lib/tool-ui";
import { LOCALIZED_HUB_PATHS, LOCALIZED_HUB_TOOLS, LOCALIZED_TOOL_SLUGS, isLocalizedToolSlug } from "@/lib/i18n/catalog";
import { getPageCopy, pathToPageKey, type StaticPageKey } from "@/lib/i18n/page-messages";
import { getToolCopy } from "@/lib/i18n/tool-messages";
import { getUiMessages } from "@/lib/i18n/ui-messages";
import { localizePath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/locales";
import { breadcrumbJsonLd, webPageSchema } from "@/lib/seo";
import { tools } from "@/lib/tools/data";

const HUB_KEYS: Record<(typeof LOCALIZED_HUB_PATHS)[number], StaticPageKey> = {
  "/finance-tools": "finance",
  "/business-tools": "business",
  "/developer-tools": "developer",
  "/pdf-tools": "pdf",
  "/utility-tools": "utility",
  "/real-estate-tools": "realEstate",
  "/marketing-tools": "marketing",
  "/ai-tools": "ai",
};

export default function LocalizedStaticView({
  locale,
  englishPath,
}: {
  locale: Locale;
  englishPath: string;
}) {
  const ui = getUiMessages(locale);
  const key = pathToPageKey(englishPath);
  const copy = key ? getPageCopy(locale, key) : getPageCopy(locale, "home");
  const path = localizePath(englishPath, locale);
  const breadcrumbLd = breadcrumbJsonLd([
    { name: ui.common.home, path: localizePath("/", locale) },
    ...(englishPath !== "/" ? [{ name: copy.h1, path }] : []),
  ]);
  const pageLd = webPageSchema({
    name: copy.h1,
    description: copy.description,
    path,
  });

  const toolCards = LOCALIZED_TOOL_SLUGS.map((slug) => {
    const base = tools.find((t) => t.slug === slug);
    const tcopy = getToolCopy(locale, slug);
    return {
      slug,
      name: tcopy.name,
      description: tcopy.intro,
      href: localizePath(`/tools/${slug}`, locale),
      category: base?.category ?? "finance",
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {englishPath !== "/" ? (
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label={ui.common.breadcrumb}>
          <Link href={localizePath("/", locale)} className="transition hover:text-violet-600">
            {ui.common.home}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
          <span className="font-medium text-slate-700">{copy.h1}</span>
        </nav>
      ) : null}

      <article className={`p-6 sm:p-8 ${toolGlassPanel}`}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{copy.h1}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-700">{copy.intro}</p>
        <p className="mt-3 text-sm text-slate-500">{ui.common.languageNote}</p>

        {englishPath === "/" || englishPath === "/tools" || englishPath in LOCALIZED_HUB_TOOLS ? (
          <section className="mt-8" aria-labelledby="loc-tools-heading">
            <h2 id="loc-tools-heading" className="text-xl font-bold text-slate-900">
              {ui.nav.tools}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {(englishPath === "/" || englishPath === "/tools"
                ? toolCards
                : (LOCALIZED_HUB_TOOLS[englishPath as (typeof LOCALIZED_HUB_PATHS)[number]] ?? []).map((slug) => {
                    const base = tools.find((t) => t.slug === slug);
                    const tcopy = getToolCopy(locale, slug);
                    return {
                      slug,
                      name: tcopy.name,
                      description: tcopy.intro,
                      href: localizePath(`/tools/${slug}`, locale),
                      category: base?.category ?? "finance",
                    };
                  })
              ).map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.href}
                    className="block rounded-xl border border-violet-200/60 bg-white/80 p-4 transition hover:border-violet-300"
                  >
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{t.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
            {englishPath === "/real-estate-tools" ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                <Link href="/tools/rental-yield-calculator-uk" className="font-medium text-violet-800 underline-offset-2 hover:underline">
                  {ui.tool.seeAlsoEnglish}
                </Link>
              </p>
            ) : null}
          </section>
        ) : null}

        {englishPath === "/" ? (
          <section className="mt-8" aria-labelledby="loc-hubs-heading">
            <h2 id="loc-hubs-heading" className="text-xl font-bold text-slate-900">
              {ui.nav.categories}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {LOCALIZED_HUB_PATHS.map((hub) => {
                const hubCopy = getPageCopy(locale, HUB_KEYS[hub]);
                return (
                  <li key={hub}>
                    <Link
                      href={localizePath(hub, locale)}
                      className="inline-flex rounded-full border border-violet-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-violet-300 hover:text-violet-700"
                    >
                      {hubCopy.h1}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {englishPath === "/blog" ? (
          <p className="mt-6 text-sm leading-relaxed text-slate-600">
            <Link href="/blog" className="font-medium text-violet-800 underline-offset-2 hover:underline">
              {ui.tool.seeAlsoEnglish}
            </Link>
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={localizePath("/tools", locale)}
            className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
          >
            {ui.footer.allTools}
          </Link>
          <Link
            href={localizePath("/methodology", locale)}
            className="inline-flex rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-800"
          >
            {ui.footer.methodology}
          </Link>
        </div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </div>
  );
}

export function isLocalizedToolPath(englishPath: string): boolean {
  const m = englishPath.match(/^\/tools\/([^/]+)$/);
  return Boolean(m?.[1] && isLocalizedToolSlug(m[1]));
}
