import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";
import { localizePath, normalizePath } from "./paths";

/**
 * Quality-gated localization catalog.
 * Only these English paths have real translated pages. Do not emit hreflang,
 * locale sitemap entries, or locale URLs for anything else.
 */

export const LOCALIZED_STATIC_PATHS = [
  "/",
  "/tools",
  "/blog",
  "/about",
  "/contact",
  "/methodology",
  "/editorial-policy",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/glossary",
  "/research",
  "/finance-tools",
  "/business-tools",
  "/developer-tools",
  "/pdf-tools",
  "/utility-tools",
  "/real-estate-tools",
  "/marketing-tools",
  "/ai-tools",
] as const;

export type LocalizedStaticPath = (typeof LOCALIZED_STATIC_PATHS)[number];

/**
 * Tools with curated translations (title, H1, intro, methodology, FAQs, fields).
 * Country-specific calculators (US paycheck, UK-only tax hubs) stay English-only
 * so we do not imply unsupported local tax law.
 */
export const LOCALIZED_TOOL_SLUGS = [
  "loan-calculator",
  "salary-after-tax-calculator",
  "vat-calculator",
  "compound-interest-calculator",
  "roi-calculator",
  "profit-margin-calculator",
  "percentage-calculator",
  "currency-converter",
  "bmi-calculator",
  "json-formatter",
  "password-generator",
  "pdf-merge",
] as const;

export type LocalizedToolSlug = (typeof LOCALIZED_TOOL_SLUGS)[number];

export const LOCALIZED_TOOL_SLUG_SET = new Set<string>(LOCALIZED_TOOL_SLUGS);

export const LOCALIZED_HUB_PATHS = [
  "/finance-tools",
  "/business-tools",
  "/developer-tools",
  "/pdf-tools",
  "/utility-tools",
  "/real-estate-tools",
  "/marketing-tools",
  "/ai-tools",
] as const;

export function isLocalizedStaticPath(path: string): path is LocalizedStaticPath {
  return (LOCALIZED_STATIC_PATHS as readonly string[]).includes(normalizePath(path));
}

export function isLocalizedToolSlug(slug: string): slug is LocalizedToolSlug {
  return LOCALIZED_TOOL_SLUG_SET.has(slug);
}

export function isLocalizedEnglishPath(englishPath: string): boolean {
  const path = normalizePath(englishPath);
  if (isLocalizedStaticPath(path)) return true;
  const toolMatch = path.match(/^\/tools\/([^/]+)$/);
  if (toolMatch?.[1] && isLocalizedToolSlug(toolMatch[1])) return true;
  return false;
}

export function localesForEnglishPath(englishPath: string): Locale[] {
  if (!isLocalizedEnglishPath(englishPath)) return [DEFAULT_LOCALE];
  return [...LOCALES];
}

export function localizedUrlPath(englishPath: string, locale: Locale): string | null {
  if (locale !== DEFAULT_LOCALE && !isLocalizedEnglishPath(englishPath)) return null;
  return localizePath(englishPath, locale);
}

export function allLocalizedSitemapPaths(): Array<{ englishPath: string; locale: Locale; path: string }> {
  const out: Array<{ englishPath: string; locale: Locale; path: string }> = [];
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    for (const englishPath of LOCALIZED_STATIC_PATHS) {
      out.push({ englishPath, locale, path: localizePath(englishPath, locale) });
    }
    for (const slug of LOCALIZED_TOOL_SLUGS) {
      const englishPath = `/tools/${slug}`;
      out.push({ englishPath, locale, path: localizePath(englishPath, locale) });
    }
  }
  return out;
}
