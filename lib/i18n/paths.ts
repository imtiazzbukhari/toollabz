import { DEFAULT_LOCALE, isLocale, isNonDefaultLocale, type Locale } from "./locales";

/** Normalize a path to leading slash, no trailing slash (except homepage). */
export function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  const noQuery = withSlash.split("?")[0] ?? withSlash;
  const noHash = noQuery.split("#")[0] ?? noQuery;
  const trimmed = noHash.replace(/\/+$/, "");
  return trimmed || "/";
}

export function parseLocalizedPathname(pathname: string): { locale: Locale; englishPath: string } {
  const path = normalizePath(pathname);
  if (path === "/") return { locale: DEFAULT_LOCALE, englishPath: "/" };
  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isNonDefaultLocale(first)) {
    const rest = `/${segments.slice(1).join("/")}`;
    return { locale: first, englishPath: rest === "/" ? "/" : rest };
  }
  return { locale: DEFAULT_LOCALE, englishPath: path };
}

export function localizePath(englishPath: string, locale: Locale): string {
  const path = normalizePath(englishPath);
  if (locale === DEFAULT_LOCALE) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

export function isPrefixedEnglishPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  const first = path.split("/").filter(Boolean)[0];
  return first === "en";
}

export function stripEnglishPrefix(pathname: string): string {
  const path = normalizePath(pathname);
  if (!isPrefixedEnglishPath(path)) return path;
  const rest = path.replace(/^\/en(?=\/|$)/, "");
  return rest || "/";
}

export function localeFromSegment(segment: string | undefined): Locale | null {
  if (!segment) return null;
  return isLocale(segment) ? segment : null;
}
