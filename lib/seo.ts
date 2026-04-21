import { ToolDefinition } from "./tools/types";
import { getToolFaqs } from "./tools/content";
import { TOOL_SEO_OVERRIDES } from "./tools/tool-seo-overrides";
import { SITE_LAST_UPDATED_DATE_TIME } from "./site-freshness";
import { CTR_TOOL_TITLES } from "./tools/tool-ctr-titles";

function normalizeOrigin(raw: string | undefined): string | undefined {
  const s = raw?.trim().replace(/\/$/, "");
  return s || undefined;
}

/** Canonical origin for absolute URLs (metadata, JSON-LD). */
function resolveSiteUrl(): string | undefined {
  const explicit = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit;

  const siteUrlEnv = normalizeOrigin(process.env.SITE_URL ?? process.env.URL);
  if (siteUrlEnv && /^https?:\/\//i.test(siteUrlEnv)) return siteUrlEnv;

  const render = normalizeOrigin(process.env.RENDER_EXTERNAL_URL);
  if (render && /^https?:\/\//i.test(render)) return render;

  const vercelHost = normalizeOrigin(process.env.VERCEL_URL?.replace(/^https?:\/\//i, ""));
  if (vercelHost) return `https://${vercelHost}`;

  const cfPages = normalizeOrigin(process.env.CF_PAGES_URL?.replace(/^https?:\/\//i, ""));
  if (cfPages) return `https://${cfPages}`;

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  return undefined;
}

/** Used when origin is missing or unusable in production (avoids SSR 500). */
const PRODUCTION_SITE_FALLBACK = "https://toollabz.com";

function isLocalLike(url: string) {
  const lower = url.toLowerCase();
  return (
    lower.includes("localhost") ||
    lower.includes("127.0.0.1") ||
    lower.startsWith("http://0.0.0.0")
  );
}

let siteUrlResolved = resolveSiteUrl();

if (!siteUrlResolved) {
  if (typeof console !== "undefined" && console.warn) {
    console.warn(
      `[lib/seo] NEXT_PUBLIC_SITE_URL is not set; using ${PRODUCTION_SITE_FALLBACK}. Set NEXT_PUBLIC_SITE_URL to your real domain.`,
    );
  }
  siteUrlResolved = PRODUCTION_SITE_FALLBACK;
} else if (process.env.NODE_ENV === "production" && isLocalLike(siteUrlResolved)) {
  if (typeof console !== "undefined" && console.warn) {
    console.warn(
      `[lib/seo] NEXT_PUBLIC_SITE_URL is local (${siteUrlResolved}); using ${PRODUCTION_SITE_FALLBACK} for metadata. Use a public URL in real production.`,
    );
  }
  siteUrlResolved = PRODUCTION_SITE_FALLBACK;
}

/** Public site origin: HTTPS only (non-local), no trailing slash, no www prefix. */
function normalizePublicSiteUrl(url: string): string {
  if (isLocalLike(url)) return url.replace(/\/$/, "");
  const trimmed = url.trim().replace(/\/$/, "");
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withProto);
    u.protocol = "https:";
    if (u.hostname.startsWith("www.")) u.hostname = u.hostname.slice(4);
    return u.origin;
  } catch {
    return PRODUCTION_SITE_FALLBACK;
  }
}

export const siteUrl = normalizePublicSiteUrl(siteUrlResolved);

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

const categoryMap: Record<string, string> = {
  converters: "UtilitiesApplication",
  calculators: "UtilitiesApplication",
  finance: "FinanceApplication",
  business: "BusinessApplication",
  "real-estate": "FinanceApplication",
  marketing: "BusinessApplication",
  generators: "UtilitiesApplication",
  utility: "UtilitiesApplication",
  legal: "BusinessApplication",
  creator: "UtilitiesApplication",
  image: "UtilitiesApplication",
  ai: "UtilitiesApplication",
  developer: "DeveloperApplication",
  pdf: "BusinessApplication",
};

/** SERP-friendly meta description: unique per tool, capped ~155 chars. */
export function buildToolMetaDescription(tool: ToolDefinition): string {
  const maxLen = 155;
  const base = tool.description.trim() || `${tool.name}: free online tool on Toollabz`;
  const suffix = "FAQs and related tools on Toollabz.";
  const punctuation = /[.!?]$/.test(base) ? "" : ".";
  const body = `${base}${punctuation}`;
  const out = `${body} ${suffix}`;
  if (out.length <= maxLen) return out;
  const room = maxLen - suffix.length - 4;
  const clip = base.slice(0, Math.max(32, room)).trim();
  return `${clip}... ${suffix}`.slice(0, maxLen);
}

const SERP_TITLE_MAX = 60;
const TITLE_SUFFIX = " | Toollabz";

function clampSerpTitle(s: string, max = SERP_TITLE_MAX): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(1, max - 1)).trim()}…`;
}

const CTR_TITLE_MAX = 72;

/**
 * SERP titles: CTR templates when present; else "{name} - Free Online Tool | Toollabz".
 * CTR strings always include `tool.name` as substring for integrity tests.
 */
export function buildSerpToolTitle(tool: ToolDefinition): string {
  const ctr = CTR_TOOL_TITLES[tool.slug];
  if (ctr) {
    const full = `${ctr} | Toollabz`;
    if (full.length <= CTR_TITLE_MAX) return full;
    return clampSerpTitle(full, CTR_TITLE_MAX);
  }
  const suffix = TITLE_SUFFIX;
  const candidates = [
    `${tool.name} - Free Online Tool${suffix}`,
    `${tool.name} - Free Tool${suffix}`,
    `${tool.name} - Online Tool${suffix}`,
    `${tool.name}${suffix}`,
  ];
  for (const c of candidates) {
    if (c.length <= SERP_TITLE_MAX) return c;
  }
  return candidates[candidates.length - 1]!;
}

export function toolMetadata(tool: ToolDefinition) {
  const path = `/tools/${tool.slug}`;
  const override = TOOL_SEO_OVERRIDES[tool.slug];
  const title = override?.title ? clampSerpTitle(override.title, 68) : buildSerpToolTitle(tool);
  const description = override?.description ?? buildToolMetaDescription(tool);
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl("/logo-toollabz.webp");
  return {
    title,
    description,
    keywords: [
      ...tool.keywords,
      `${tool.name.toLowerCase()} online`,
      `${tool.name.toLowerCase()} free`,
      `toollabz ${tool.name.toLowerCase()}`,
    ],
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Toollabz",
      images: [{ url: ogImage, width: 512, height: 512, alt: "Toollabz" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function toolSchema(tool: ToolDefinition, pagePath?: string) {
  const path = pagePath ?? `/tools/${tool.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: categoryMap[tool.category] ?? "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Modern desktop or mobile web browser with JavaScript enabled for the interactive tool UI.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: tool.description,
    url: absoluteUrl(path),
    dateModified: SITE_LAST_UPDATED_DATE_TIME,
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: "Toollabz",
      url: siteUrl,
    },
  };
}

export function faqPageSchemaFromPairs(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function faqSchema(tool: ToolDefinition) {
  return faqPageSchemaFromPairs(getToolFaqs(tool));
}

export function breadcrumbSchema(tool: ToolDefinition, pagePath?: string) {
  const path = pagePath ?? `/tools/${tool.slug}`;
  const categoryPath = `/category/${tool.category}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.category
          .split("-")
          .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
          .join(" "),
        item: absoluteUrl(categoryPath),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: absoluteUrl(path),
      },
    ],
  };
}

export function webPageSchema({
  name,
  description,
  path,
  dateModified,
}: {
  name: string;
  description: string;
  path: string;
  /** ISO-8601; defaults to site-wide refresh stamp. */
  dateModified?: string;
}) {
  const dm = dateModified ?? SITE_LAST_UPDATED_DATE_TIME;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: absoluteUrl(path),
    dateModified: dm,
    datePublished: dm,
    isPartOf: {
      "@type": "WebSite",
      name: "Toollabz",
      url: siteUrl,
    },
  };
}

/** BreadcrumbList JSON-LD for arbitrary trails (paths must start with `/` or be absolute). */
export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.path.startsWith("http") ? it.path : absoluteUrl(it.path),
    })),
  };
}

/** Sitelinks search box: matches `/tools?q=` in ToolsDirectoryClient. */
export function websiteSearchActionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Toollabz",
    url: siteUrl,
    dateModified: SITE_LAST_UPDATED_DATE_TIME,
    publisher: {
      "@type": "Organization",
      name: "Toollabz",
      url: siteUrl,
      logo: absoluteUrl("/logo-toollabz.webp"),
      dateModified: SITE_LAST_UPDATED_DATE_TIME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Site-wide Organization JSON-LD (Search / knowledge panel support). */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Toollabz",
    url: siteUrl,
    logo: absoluteUrl("/logo-toollabz.webp"),
    dateModified: SITE_LAST_UPDATED_DATE_TIME,
  };
}

export function relatedToolsItemListSchema(tool: ToolDefinition, related: readonly ToolDefinition[]) {
  if (related.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Tools related to ${tool.name}`,
    description: `More free tools that pair well with ${tool.name}.`,
    numberOfItems: related.length,
    itemListElement: related.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: absoluteUrl(`/tools/${t.slug}`),
    })),
  };
}
