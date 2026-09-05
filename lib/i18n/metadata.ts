import type { Metadata } from "next";
import { absoluteUrl, sanitizeMetaDescription } from "@/lib/seo";
import { DEFAULT_LOCALE, LOCALE_META, type Locale } from "./locales";
import { buildHreflangPaths } from "./hreflang";
import { localizePath } from "./paths";
import { isLocalizedEnglishPath } from "./catalog";

export function hreflangLanguages(englishPath: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(buildHreflangPaths(englishPath)).map(([code, path]) => [code, absoluteUrl(path)]),
  );
}

export function localizedMetadata(opts: {
  locale: Locale;
  englishPath: string;
  title: string;
  description: string;
  index?: boolean;
}): Metadata {
  const { locale, englishPath, title, description, index = true } = opts;
  const path = localizePath(englishPath, locale);
  const url = absoluteUrl(path);
  const desc = sanitizeMetaDescription(description, 155);
  const languages = isLocalizedEnglishPath(englishPath) ? hreflangLanguages(englishPath) : undefined;
  return {
    title: { absolute: `${title} | Toollabz` },
    description: desc,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    robots: { index, follow: true },
    openGraph: {
      title: `${title} | Toollabz`,
      description: desc,
      url,
      type: "website",
      siteName: "Toollabz",
      locale: LOCALE_META[locale].ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Toollabz`,
      description: desc,
    },
  };
}

export function withHreflang<T extends { alternates?: Metadata["alternates"] }>(
  meta: T,
  englishPath: string,
): T {
  if (!isLocalizedEnglishPath(englishPath) && englishPath !== "/") {
    // Still emit self + x-default for catalog misses (English-only pages).
  }
  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      languages: hreflangLanguages(englishPath),
    },
  };
}

export { DEFAULT_LOCALE };
