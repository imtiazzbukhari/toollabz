/**
 * Permanent redirect table consumed by next.config.ts (and unit-tested without booting Next).
 * Deliberately has no `@/` alias imports so the Next config loader can import it.
 *
 * Every rule points straight at the final destination (no redirect chains).
 */
import {
  BLOG_REDIRECTS,
  CATEGORY_TO_HUB,
  CM_TO_FEET_INDEXABLE_VALUES,
  CONSOLIDATED_TOOLS,
  LOAN_AMOUNT_INDEXABLE_VALUES,
  PROGRAMMATIC_REDIRECTS,
  STATIC_REDIRECTS,
} from "./indexing-policy";

export type RedirectRule = { source: string; destination: string; permanent: true };

/** Locales that keep translated copy in the repo but are not served (see lib/i18n/locales.ts). */
const RETIRED_LOCALE_CODES = ["da", "sv", "fi", "cs", "ro", "hu", "el", "uk", "bg", "sk", "hr", "lt", "lv", "et", "sl"];
const ACTIVE_LOCALE_CODES = ["fr", "es", "pt"];

/** English paths whose locale variants were thin stubs and now 301 to the English page. */
const RETIRED_LOCALIZED_PAGES = [
  "blog",
  "about",
  "contact",
  "methodology",
  "editorial-policy",
  "privacy",
  "terms",
  "disclaimer",
  "glossary",
  "research",
  "finance-tools",
  "business-tools",
  "developer-tools",
  "pdf-tools",
  "utility-tools",
  "real-estate-tools",
  "marketing-tools",
  "ai-tools",
];

/** Translated tools that are only served in English. */
const ENGLISH_ONLY_TRANSLATED_TOOLS = ["vat-calculator", "salary-after-tax-calculator"];

function alternation(values: ReadonlyArray<string | number>): string {
  return values.join("|");
}

export function buildRedirectRules(): RedirectRule[] {
  const rules: RedirectRule[] = [];
  const add = (source: string, destination: string) => rules.push({ source, destination, permanent: true });

  // --- Locale consolidation (audit C-02) ------------------------------------------------------
  add(`/:locale(${alternation(RETIRED_LOCALE_CODES)})/:path*`, "/:path*");
  add(`/:locale(${alternation(ACTIVE_LOCALE_CODES)})/:page(${alternation(RETIRED_LOCALIZED_PAGES)})`, "/:page");
  for (const slug of ENGLISH_ONLY_TRANSLATED_TOOLS) {
    add(`/:locale(${alternation(ACTIVE_LOCALE_CODES)})/tools/${slug}`, `/tools/${slug}`);
  }

  // --- /category/* duplicates of the /*-tools hubs (audit H-01) --------------------------------
  for (const [category, hub] of Object.entries(CATEGORY_TO_HUB)) {
    add(`/category/${category}`, hub);
  }
  add("/category/:other", "/tools");

  // --- Duplicate tool intents (audit H-02) ---------------------------------------------------
  for (const [from, to] of Object.entries(CONSOLIDATED_TOOLS)) {
    add(`/tools/${from}`, `/tools/${to}`);
  }

  // --- Programmatic URLs (audit H-06, H-07) ---------------------------------------------------
  const keepCm = alternation(CM_TO_FEET_INDEXABLE_VALUES.map((n) => `${n}-cm-to-feet`));
  add(`/cm-to-feet/:slug((?!(?:${keepCm})$)[0-9]+-cm-to-feet)`, PROGRAMMATIC_REDIRECTS.cmToFeet);

  const keepLoan = alternation(LOAN_AMOUNT_INDEXABLE_VALUES);
  add(`/loan-calculator-:amount(${keepLoan})`, "/loan-calculator/p/:amount");
  add("/loan-calculator-:amount([0-9]+)", PROGRAMMATIC_REDIRECTS.loanAmount);
  add(`/loan-calculator/p/:amount((?!(?:${keepLoan})$)[0-9]+)`, PROGRAMMATIC_REDIRECTS.loanAmount);
  add("/salary-after-tax-:amount([0-9]+)", PROGRAMMATIC_REDIRECTS.salaryAmount);
  add("/salary-after-tax/p/:amount([0-9]+)", PROGRAMMATIC_REDIRECTS.salaryAmount);

  // Thin country stubs / country x amount mirrors of regional tools.
  add("/loan-calculator/:country((?!p$)[a-z-]+)", "/tools/loan-calculator");
  add("/salary-tax-calculator/:country", "/tools/salary-after-tax-calculator");
  add("/salary-after-tax-calculator/uk/:amount", "/tools/salary-after-tax-calculator-uk");
  add("/salary-after-tax-calculator/california/:amount", "/tools/paycheck-calculator-california");
  add("/salary-after-tax-calculator/texas/:amount", "/tools/paycheck-calculator-texas");
  add("/salary-after-tax-calculator/new-york/:amount", "/tools/salary-after-tax-calculator-new-york");
  add("/salary-after-tax-calculator/florida/:amount", "/tools/salary-after-tax-calculator-florida");
  add("/salary-after-tax-calculator/:country/:amount", "/tools/salary-after-tax-calculator");

  // --- Pages removed or merged ----------------------------------------------------------------
  for (const r of STATIC_REDIRECTS) add(r.source, r.destination);
  for (const [slug, destination] of Object.entries(BLOG_REDIRECTS)) add(`/blog/${slug}`, destination);

  return rules;
}
