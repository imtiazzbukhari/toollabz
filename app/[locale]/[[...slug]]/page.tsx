import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LocalizedStaticView from "@/components/i18n/LocalizedStaticView";
import LocalizedToolView from "@/components/i18n/LocalizedToolView";
import { isNonDefaultLocale, NON_DEFAULT_LOCALES, type Locale } from "@/lib/i18n/locales";
import { isLocalizedEnglishPath, isLocalizedToolSlug } from "@/lib/i18n/catalog";
import { localizedMetadata } from "@/lib/i18n/metadata";
import { getPageCopy, pathToPageKey } from "@/lib/i18n/page-messages";
import { getToolCopy } from "@/lib/i18n/tool-messages";

export const dynamicParams = true;
export const revalidate = 86400;

function englishPathFromSlug(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) return "/";
  return `/${slug.join("/")}`;
}

/** Pre-render locale homes plus a few hubs; remaining catalog URLs SSR on demand. */
export function generateStaticParams() {
  const out: Array<{ locale: string; slug: string[] }> = [];
  for (const locale of NON_DEFAULT_LOCALES) {
    out.push({ locale, slug: [] });
    out.push({ locale, slug: ["tools"] });
    out.push({ locale, slug: ["about"] });
    out.push({ locale, slug: ["tools", "loan-calculator"] });
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isNonDefaultLocale(raw)) return {};
  const locale = raw as Locale;
  const englishPath = englishPathFromSlug(slug);
  if (!isLocalizedEnglishPath(englishPath)) return {};

  const toolMatch = englishPath.match(/^\/tools\/([^/]+)$/);
  if (toolMatch?.[1] && isLocalizedToolSlug(toolMatch[1])) {
    const copy = getToolCopy(locale, toolMatch[1]);
    return localizedMetadata({
      locale,
      englishPath,
      title: copy.title,
      description: copy.description,
    });
  }

  const key = pathToPageKey(englishPath);
  const copy = getPageCopy(locale, key ?? "home");
  return localizedMetadata({
    locale,
    englishPath,
    title: copy.title,
    description: copy.description,
  });
}

export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isNonDefaultLocale(raw)) notFound();
  const locale = raw as Locale;
  const englishPath = englishPathFromSlug(slug);
  if (!isLocalizedEnglishPath(englishPath)) notFound();

  const toolMatch = englishPath.match(/^\/tools\/([^/]+)$/);
  if (toolMatch?.[1] && isLocalizedToolSlug(toolMatch[1])) {
    return <LocalizedToolView locale={locale} slug={toolMatch[1]} />;
  }

  return <LocalizedStaticView locale={locale} englishPath={englishPath} />;
}
