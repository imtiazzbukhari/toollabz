import { LOCALIZED_STATIC_PATHS, LOCALIZED_TOOL_SLUGS, localesForEnglishPath } from "../lib/i18n/catalog";
import { buildHreflangPaths, isHreflangReciprocal } from "../lib/i18n/hreflang";
import { DEFAULT_LOCALE } from "../lib/i18n/locales";

export type CheckResult = { name: string; pass: boolean; detail: string };

export function validateHreflang(): CheckResult[] {
  const results: CheckResult[] = [];
  const paths = [...LOCALIZED_STATIC_PATHS, ...LOCALIZED_TOOL_SLUGS.map((s) => `/tools/${s}`)];

  for (const path of paths) {
    const map = buildHreflangPaths(path);
    const locales = localesForEnglishPath(path);
    const missingSelf = locales.filter((l) => !map[l]);
    results.push({
      name: `hreflang-self-${path}`,
      pass: missingSelf.length === 0,
      detail: missingSelf.length ? `missing: ${missingSelf.join(",")}` : `${locales.length} locales + x-default`,
    });
    results.push({
      name: `hreflang-x-default-${path}`,
      pass: map["x-default"] === path || map["x-default"] === "/",
      detail: `x-default=${map["x-default"]}`,
    });
    results.push({
      name: `hreflang-reciprocal-${path}`,
      pass: isHreflangReciprocal(path),
      detail: "reciprocal map",
    });
    results.push({
      name: `hreflang-en-unprefixed-${path}`,
      pass: map[DEFAULT_LOCALE] === path,
      detail: `en=${map[DEFAULT_LOCALE]}`,
    });
  }

  const englishOnly = buildHreflangPaths("/blog/some-untranslated-article");
  results.push({
    name: "hreflang-no-fake-for-missing-pages",
    pass: Object.keys(englishOnly).length === 2 && englishOnly.en === "/blog/some-untranslated-article" && englishOnly["x-default"] === "/blog/some-untranslated-article",
    detail: JSON.stringify(englishOnly),
  });

  return results;
}

if (process.argv[1]?.includes("validate-hreflang")) {
  const rows = validateHreflang();
  const failed = rows.filter((r) => !r.pass);
  for (const r of rows) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}  ${r.detail}`);
  }
  if (failed.length) process.exitCode = 1;
}
