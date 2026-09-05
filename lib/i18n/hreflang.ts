import { DEFAULT_LOCALE, LOCALE_META, type Locale } from "./locales";
import { localesForEnglishPath, localizedUrlPath } from "./catalog";
import { normalizePath } from "./paths";

/** hreflang code → site-relative path (or `/`). */
export type HreflangPathMap = Record<string, string>;

/**
 * Reciprocal hreflang path map. Values are pathname-only.
 * Callers must absolutize with the same origin used for canonicals.
 * Non-catalog pages return self (English path) + x-default.
 */
export function buildHreflangPaths(englishPath: string): HreflangPathMap {
  const path = normalizePath(englishPath);
  const locales = localesForEnglishPath(path);
  const languages: HreflangPathMap = {};
  for (const locale of locales) {
    const locPath = localizedUrlPath(path, locale);
    if (!locPath) continue;
    languages[locale] = locPath;
  }
  const defaultPath = localizedUrlPath(path, DEFAULT_LOCALE) ?? path;
  languages["x-default"] = defaultPath;
  return languages;
}

export function hreflangPathPairs(englishPath: string): Array<{ hreflang: string; href: string }> {
  return Object.entries(buildHreflangPaths(englishPath)).map(([hreflang, href]) => ({ hreflang, href }));
}

export function isHreflangReciprocal(englishPath: string): boolean {
  const expected = buildHreflangPaths(englishPath);
  const locales = localesForEnglishPath(englishPath);
  for (const locale of locales) {
    const again = buildHreflangPaths(englishPath);
    if (Object.keys(expected).length !== Object.keys(again).length) return false;
    for (const key of Object.keys(expected)) {
      if (expected[key] !== again[key]) return false;
    }
    void locale;
  }
  return Object.keys(expected).includes("x-default");
}

export function ogLocaleFor(locale: Locale): string {
  return LOCALE_META[locale].ogLocale;
}

export function htmlLangFor(locale: Locale): string {
  return LOCALE_META[locale].htmlLang;
}
