import { allLocalizedSitemapPaths, LOCALIZED_STATIC_PATHS, LOCALIZED_TOOL_SLUGS } from "../lib/i18n/catalog";
import { NON_DEFAULT_LOCALES } from "../lib/i18n/locales";
import { localizePath } from "../lib/i18n/paths";
import { buildPageSitemapEntries, sitemapPublicOrigin } from "../lib/content-engine/sitemap-data";

export type CheckResult = { name: string; pass: boolean; detail: string };

export function validateMultilingualSitemaps(): CheckResult[] {
  const results: CheckResult[] = [];
  const origin = sitemapPublicOrigin();
  const pageLocs = new Set(buildPageSitemapEntries().map((e) => e.loc));

  results.push({
    name: "english-page-sitemap-has-no-locale-prefixes",
    pass: ![...pageLocs].some((u) => NON_DEFAULT_LOCALES.some((l) => u.includes(`/${l}/`) || u.endsWith(`/${l}`))),
    detail: `${pageLocs.size} English page sitemap URLs`,
  });

  const localized = allLocalizedSitemapPaths();
  const dupes = localized.map((r) => r.path).filter((p, i, a) => a.indexOf(p) !== i);
  results.push({
    name: "localized-paths-unique",
    pass: dupes.length === 0,
    detail: dupes.length ? dupes.slice(0, 5).join(",") : `${localized.length} unique locale paths`,
  });

  for (const locale of NON_DEFAULT_LOCALES) {
    const expected = LOCALIZED_STATIC_PATHS.length + LOCALIZED_TOOL_SLUGS.length;
    const got = localized.filter((r) => r.locale === locale).length;
    results.push({
      name: `locale-sitemap-count-${locale}`,
      pass: got === expected,
      detail: `${got}/${expected}`,
    });
    results.push({
      name: `locale-home-${locale}`,
      pass: localizePath("/", locale) === `/${locale}`,
      detail: localizePath("/", locale),
    });
  }

  results.push({
    name: "sitemap-origin-no-port-3000",
    pass: !origin.includes(":3000") && !origin.includes("localhost"),
    detail: origin,
  });

  return results;
}

if (process.argv[1]?.includes("validate-multilingual-sitemaps")) {
  const rows = validateMultilingualSitemaps();
  const failed = rows.filter((r) => !r.pass);
  for (const r of rows) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}  ${r.detail}`);
  if (failed.length) process.exitCode = 1;
}
