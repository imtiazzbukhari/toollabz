/**
 * URL classification for GSC coverage investigation.
 * A GSC status is not automatically a bug — this maps URL families to intended actions.
 */

export type Indexability = "index" | "noindex" | "blocked" | "redirect" | "not_found";

export type ClassificationAction =
  | "keep-index"
  | "keep-noindex"
  | "keep-redirect"
  | "keep-blocked"
  | "keep-404"
  | "canonical-to-parent"
  | "redirect-to-parent"
  | "remove-from-sitemap"
  | "investigate";

export type UrlClassification = {
  pattern: string;
  status: 200 | 301 | 302 | 404 | 410 | 403;
  canonical: "self" | "parent-tool" | "none" | "n/a";
  robotsMeta: "index,follow" | "noindex,follow" | "noindex,nofollow" | "n/a";
  xRobotsTag: "none-by-default";
  sitemap: boolean;
  indexability: Indexability;
  redirectTarget?: string;
  reason: string;
  recommendedAction: ClassificationAction;
  gscBucket:
    | "indexed-or-intended"
    | "excluded-by-noindex"
    | "page-with-redirect"
    | "alternative-canonical"
    | "not-found"
    | "soft-404"
    | "blocked-by-robots"
    | "duplicate-no-canonical"
    | "crawled-not-indexed"
    | "discovered-not-indexed";
};

function pathOf(url: string): string {
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return new URL(url).pathname.replace(/\/+$/, "") || "/";
    }
  } catch {
    /* fall through */
  }
  const p = url.split("?")[0]?.split("#")[0] ?? url;
  const trimmed = p.replace(/\/+$/, "");
  return trimmed.startsWith("/") ? trimmed || "/" : `/${trimmed}`;
}

export function classifyUrl(url: string): UrlClassification {
  const path = pathOf(url);

  if (path === "/robots.txt" || path === "/sitemap.xml" || path === "/ads.txt" || path === "/llms.txt") {
    return {
      pattern: "discovery-file",
      status: 200,
      canonical: "none",
      robotsMeta: "n/a",
      xRobotsTag: "none-by-default",
      sitemap: false,
      indexability: "index",
      reason: "Discovery file; not a content page.",
      recommendedAction: "keep-index",
      gscBucket: "indexed-or-intended",
    };
  }

  if (
    path.startsWith("/api/") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/seo-growth-console") ||
    path.startsWith("/embed/") ||
    path === "/login" ||
    path === "/signup"
  ) {
    const blocked = path.startsWith("/api/") || path.startsWith("/dashboard") || path.startsWith("/seo-growth-console") || path.startsWith("/embed/");
    return {
      pattern: "private-or-utility",
      status: 200,
      canonical: path === "/login" || path === "/signup" ? "self" : "none",
      robotsMeta: "noindex,nofollow",
      xRobotsTag: "none-by-default",
      sitemap: false,
      indexability: blocked ? "blocked" : "noindex",
      reason: "Private, auth, API, or embed surface. Intentionally excluded.",
      recommendedAction: blocked ? "keep-blocked" : "keep-noindex",
      gscBucket: blocked ? "blocked-by-robots" : "excluded-by-noindex",
    };
  }

  if (/^\/loan-calculator-\d+$/.test(path) || /^\/salary-after-tax-\d+$/.test(path)) {
    const amount = path.match(/\d+/)?.[0] ?? "";
    const target = path.startsWith("/loan") ? `/loan-calculator/p/${amount}` : `/salary-after-tax/p/${amount}`;
    return {
      pattern: "legacy-amount-hyphen",
      status: 301,
      canonical: "n/a",
      robotsMeta: "n/a",
      xRobotsTag: "none-by-default",
      sitemap: false,
      indexability: "redirect",
      redirectTarget: target,
      reason: "Legacy hyphenated amount URL permanently redirected to /p/{amount}.",
      recommendedAction: "keep-redirect",
      gscBucket: "page-with-redirect",
    };
  }

  if (/^\/loan-calculator\/(?!p\/)[a-z-]+$/.test(path)) {
    return {
      pattern: "loan-country-stub",
      status: 301,
      canonical: "n/a",
      robotsMeta: "n/a",
      xRobotsTag: "none-by-default",
      sitemap: false,
      indexability: "redirect",
      redirectTarget: "/tools/loan-calculator",
      reason: "Thin country stub (rate label only). Consolidated to the real calculator.",
      recommendedAction: "redirect-to-parent",
      gscBucket: "page-with-redirect",
    };
  }

  if (/^\/salary-tax-calculator\/[a-z-]+$/.test(path)) {
    return {
      pattern: "salary-tax-country-stub",
      status: 301,
      canonical: "n/a",
      robotsMeta: "n/a",
      xRobotsTag: "none-by-default",
      sitemap: false,
      indexability: "redirect",
      redirectTarget: "/tools/salary-after-tax-calculator",
      reason: "Thin country tax stub. Consolidated to the real calculator.",
      recommendedAction: "redirect-to-parent",
      gscBucket: "page-with-redirect",
    };
  }

  if (/^\/salary-after-tax-calculator\/[^/]+\/[^/]+$/.test(path)) {
    return {
      pattern: "salary-country-amount-mirror",
      status: 301,
      canonical: "n/a",
      robotsMeta: "n/a",
      xRobotsTag: "none-by-default",
      sitemap: false,
      indexability: "redirect",
      redirectTarget: "/tools/salary-after-tax-calculator",
      reason: "Country×amount mirror of an existing regional tool. Consolidated.",
      recommendedAction: "redirect-to-parent",
      gscBucket: "page-with-redirect",
    };
  }

  if (/^\/loan-calculator\/p\/\d+$/.test(path)) {
    return {
      pattern: "loan-principal-landing",
      status: 200,
      canonical: "self",
      robotsMeta: "index,follow",
      xRobotsTag: "none-by-default",
      sitemap: true,
      indexability: "index",
      reason: "Amount landing with unique payment scenarios. High-tier in sitemap; medium indexable via links.",
      recommendedAction: "keep-index",
      gscBucket: "crawled-not-indexed",
    };
  }

  if (/^\/salary-after-tax\/p\/\d+$/.test(path)) {
    return {
      pattern: "salary-gross-landing",
      status: 200,
      canonical: "self",
      robotsMeta: "index,follow",
      xRobotsTag: "none-by-default",
      sitemap: true,
      indexability: "index",
      reason: "Gross-pay landing with unique take-home scenarios. High-tier in sitemap.",
      recommendedAction: "keep-index",
      gscBucket: "crawled-not-indexed",
    };
  }

  if (/^\/cm-to-feet\/\d+-cm-to-feet$/.test(path)) {
    return {
      pattern: "cm-to-feet-conversion",
      status: 200,
      canonical: "self",
      robotsMeta: "index,follow",
      xRobotsTag: "none-by-default",
      sitemap: true,
      indexability: "index",
      reason: "High-tier height conversions are unique math answers; uncommon values are noindex in the page itself.",
      recommendedAction: "keep-index",
      gscBucket: "crawled-not-indexed",
    };
  }

  if (/^\/tools\/[^/]+$/.test(path)) {
    return {
      pattern: "tool-page",
      status: 200,
      canonical: "self",
      robotsMeta: "index,follow",
      xRobotsTag: "none-by-default",
      sitemap: true,
      indexability: "index",
      reason: "Primary tool URL. Intended for Google Search.",
      recommendedAction: "keep-index",
      gscBucket: "indexed-or-intended",
    };
  }

  if (/^\/blog\/[^/]+$/.test(path)) {
    return {
      pattern: "blog-article",
      status: 200,
      canonical: "self",
      robotsMeta: "index,follow",
      xRobotsTag: "none-by-default",
      sitemap: true,
      indexability: "index",
      reason: "Editorial article. Intended for indexing.",
      recommendedAction: "keep-index",
      gscBucket: "indexed-or-intended",
    };
  }

  if (
    /^\/(fr|pt|es|da|sv|fi|cs|ro|hu|el|uk|bg|sk|hr|lt|lv|et|sl)(\/|$)/.test(path)
  ) {
    return {
      pattern: "localized-page",
      status: 200,
      canonical: "self",
      robotsMeta: "index,follow",
      xRobotsTag: "none-by-default",
      sitemap: true,
      indexability: "index",
      reason: "Quality-gated translated page with self-canonical and reciprocal hreflang.",
      recommendedAction: "keep-index",
      gscBucket: "indexed-or-intended",
    };
  }

  if (path.startsWith("/_next/") || path.includes(":3000")) {
    return {
      pattern: "asset-or-port-leak",
      status: path.includes(":3000") ? 301 : 200,
      canonical: "n/a",
      robotsMeta: "n/a",
      xRobotsTag: "none-by-default",
      sitemap: false,
      indexability: path.includes(":3000") ? "redirect" : "blocked",
      reason: path.includes(":3000")
        ? "Public :3000 URLs must never be emitted."
        : "Next.js assets; not sitemap content.",
      recommendedAction: path.includes(":3000") ? "keep-redirect" : "keep-blocked",
      gscBucket: "indexed-or-intended",
    };
  }

  return {
    pattern: "other-public",
    status: 200,
    canonical: "self",
    robotsMeta: "index,follow",
    xRobotsTag: "none-by-default",
    sitemap: true,
    indexability: "index",
    reason: "Public marketing, hub, legal, or EEAT URL. Confirm it has a self-canonical.",
    recommendedAction: "keep-index",
    gscBucket: "indexed-or-intended",
  };
}
