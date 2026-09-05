import { describe, expect, it } from "vitest";
import { LOCALES, NON_DEFAULT_LOCALES } from "../lib/i18n/locales";
import { localizePath, parseLocalizedPathname, stripEnglishPrefix } from "../lib/i18n/paths";
import { isLocalizedEnglishPath, localesForEnglishPath } from "../lib/i18n/catalog";
import { buildHreflangPaths, isHreflangReciprocal } from "../lib/i18n/hreflang";
import { getPageCopy } from "../lib/i18n/page-messages";
import { getToolCopy } from "../lib/i18n/tool-messages";
import { validateHreflang } from "../scripts/validate-hreflang";
import { validateMultilingualSitemaps } from "../scripts/validate-multilingual-sitemaps";
import { validateCanonicalIntegrity } from "../scripts/validate-canonical-integrity";
import { classifyUrl } from "../lib/seo/url-classification";

describe("i18n paths and hreflang", () => {
  it("keeps English unprefixed and prefixes every other locale", () => {
    expect(localizePath("/tools/loan-calculator", "en")).toBe("/tools/loan-calculator");
    expect(localizePath("/tools/loan-calculator", "fr")).toBe("/fr/tools/loan-calculator");
    expect(localizePath("/", "es")).toBe("/es");
    expect(parseLocalizedPathname("/pt/about")).toEqual({ locale: "pt", englishPath: "/about" });
    expect(stripEnglishPrefix("/en/tools/loan-calculator")).toBe("/tools/loan-calculator");
  });

  it("only catalogs pages that have translations", () => {
    expect(isLocalizedEnglishPath("/tools/loan-calculator")).toBe(true);
    expect(isLocalizedEnglishPath("/tools/paycheck-calculator-usa")).toBe(false);
    expect(localesForEnglishPath("/tools/paycheck-calculator-usa")).toEqual(["en"]);
    expect(localesForEnglishPath("/")).toEqual([...LOCALES]);
  });

  it("emits reciprocal hreflang including x-default on catalog pages", () => {
    const map = buildHreflangPaths("/tools/loan-calculator");
    expect(map.en).toBe("/tools/loan-calculator");
    expect(map.fr).toBe("/fr/tools/loan-calculator");
    expect(map["x-default"]).toBe("/tools/loan-calculator");
    expect(isHreflangReciprocal("/tools/loan-calculator")).toBe(true);
    expect(Object.keys(map).filter((k) => k !== "x-default").sort()).toEqual([...LOCALES].sort());
  });

  it("does not invent hreflang for untranslated blog posts", () => {
    const map = buildHreflangPaths("/blog/vat-calculator-guide-small-businesses");
    expect(map).toEqual({
      en: "/blog/vat-calculator-guide-small-businesses",
      "x-default": "/blog/vat-calculator-guide-small-businesses",
    });
  });

  it("has localized titles that are not identical to English for major locales", () => {
    expect(getPageCopy("fr", "home").h1).not.toBe(getPageCopy("en", "home").h1);
    expect(getToolCopy("es", "loan-calculator").name).not.toBe(getToolCopy("en", "loan-calculator").name);
    expect(getToolCopy("fr", "vat-calculator").h1.toLowerCase()).toContain("uk");
  });

  it("validator scripts pass", () => {
    for (const row of validateHreflang()) expect(row.pass, row.name).toBe(true);
    for (const row of validateMultilingualSitemaps()) expect(row.pass, row.name).toBe(true);
    for (const row of validateCanonicalIntegrity()) expect(row.pass, row.name).toBe(true);
  });

  it("classifies country stubs as redirects, not index targets", () => {
    expect(classifyUrl("/loan-calculator/usa").recommendedAction).toBe("redirect-to-parent");
    expect(classifyUrl("/login").indexability).toBe("noindex");
    expect(NON_DEFAULT_LOCALES).toHaveLength(18);
  });
});
