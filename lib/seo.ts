import { ToolDefinition } from "./tools/types";
import { getToolFaqs } from "./tools/content";
import { TOOL_SEO_OVERRIDES } from "./tools/tool-seo-overrides";
import { SITE_LAST_UPDATED_DATE_TIME } from "./site-freshness";
import { getSerpPrimaryLine } from "./tools/tool-serp-primary-cache";

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

function hashSlug(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

/** SERP meta description: 140–160 chars, keyword + CTA, starts with description lead-in (SEO test compatibility). */
export function buildToolMetaDescription(tool: ToolDefinition): string {
  const minLen = 140;
  const maxLen = 160;
  const brand = "Toollabz";
  const desc = (tool.description.trim() || `${tool.name} | free online tool.`).replace(/\s+/g, " ");
  const kw = (tool.keywords[0] ?? tool.name).trim().replace(/\s+/g, " ");
  const variant = hashSlug(tool.slug) % 4;
  const closers = [
    ` Try it free on ${brand} | instant online ${kw}, no signup.`,
    ` Open it free on ${brand} for fast ${kw} results | HTTPS, no account.`,
    ` Use this free ${brand} tool online for instant ${kw} | no signup required.`,
    ` Run ${kw} free on ${brand} now | online, instant, no registration.`,
  ];
  const closer = closers[variant] ?? closers[0];
  const headBudget = Math.max(48, maxLen - closer.length - 2);
  const head = desc.slice(0, Math.min(headBudget, desc.length));
  const bridge = desc.length > head.length ? "…" : "";
  let body = `${head}${bridge}${closer}`.replace(/\s+/g, " ").trim();
  if (body.length > maxLen) {
    body = `${desc.slice(0, Math.max(48, maxLen - closer.length - 2)).trim()}…${closer}`.replace(/\s+/g, " ").trim();
  }
  if (body.length < minLen) {
    const pad = ` ${tool.shortDescription.trim()}`.replace(/\s+/g, " ");
    body = `${body}${pad}`.replace(/\s+/g, " ").trim().slice(0, maxLen);
  }
  if (body.length < minLen) {
    body = `${body} Browse related free tools on ${brand}.`.replace(/\s+/g, " ").trim().slice(0, maxLen);
  }
  if (body.length < minLen) {
    body = `${desc} ${tool.shortDescription} ${closer}`.replace(/\s+/g, " ").trim().slice(0, maxLen);
  }
  return body.slice(0, maxLen);
}

const META_DESC_MIN = 140;
const META_DESC_MAX = 160;

/** Pad or trim editorial / override copy into Google-friendly snippet length. */
export function normalizeToolMetaDescription(raw: string, tool: ToolDefinition): string {
  let d = raw.trim().replace(/\s+/g, " ");
  if (d.length > META_DESC_MAX) return d.slice(0, META_DESC_MAX);
  const fillers = [
    ` Try it free on Toollabz | HTTPS, instant ${(tool.keywords[0] ?? tool.name).trim()}, no signup.`,
    ` Open this online tool anytime for repeatable ${(tool.keywords[1] ?? tool.category).replace(/-/g, " ")} workflows.`,
    ` Compare scenarios, then explore related calculators from the same Toollabz directory.`,
  ];
  let i = 0;
  while (d.length < META_DESC_MIN && i < fillers.length) {
    d = `${d}${fillers[i]}`.replace(/\s+/g, " ").trim();
    i += 1;
  }
  if (d.length < META_DESC_MIN) {
    d = `${d} ${tool.shortDescription.trim()}`.replace(/\s+/g, " ").trim().slice(0, META_DESC_MAX);
  }
  if (d.length < META_DESC_MIN) {
    const tail = (tool.description.trim() || tool.name).replace(/\s+/g, " ");
    d = `${d} ${tail}`.replace(/\s+/g, " ").trim().slice(0, META_DESC_MAX);
  }
  return d.slice(0, META_DESC_MAX);
}

const SERP_TITLE_MAX = 60;
/** Short branded suffix keeps SERP titles within ~60 chars when possible. */
export const TOOL_PAGE_TITLE_SUFFIX = " | Toollabz";

const LEGACY_TOOL_TITLE_SUFFIX = " | Toollabz - Free Online Tools";

function clampSerpTitle(s: string, max = SERP_TITLE_MAX): string {
  const t = s.trim();
  if (t.length <= max) return t;
  const suffix = TOOL_PAGE_TITLE_SUFFIX;
  const idx = t.lastIndexOf(suffix);
  if (idx > 0) {
    const budget = max - suffix.length;
    if (budget > 8) {
      const primary = t.slice(0, idx).trim();
      const clipped = `${primary.slice(0, Math.max(1, budget - 1)).trim()}…${suffix}`;
      if (clipped.length <= max) return clipped;
    }
  }
  return `${t.slice(0, Math.max(1, max - 1)).trim()}…`;
}

const CTR_TITLE_MAX = 78;

/**
 * SERP titles: `[primary line] | Toollabz`.
 * Primary line always includes `tool.name` as substring (integrity tests + CTR cache).
 */
export function buildSerpToolTitle(tool: ToolDefinition): string {
  const primary = getSerpPrimaryLine(tool).trim();
  const suffix = TOOL_PAGE_TITLE_SUFFIX;
  const full = `${primary}${suffix}`;
  if (full.length <= CTR_TITLE_MAX) return full;
  const fallback = `${tool.name.trim()}${suffix}`;
  if (fallback.length <= CTR_TITLE_MAX) return fallback;
  return clampSerpTitle(fallback, CTR_TITLE_MAX);
}

function ensureToolPageTitleFormat(raw: string): string {
  let t = raw.trim();
  if (t.endsWith(TOOL_PAGE_TITLE_SUFFIX)) return t;
  if (t.endsWith(LEGACY_TOOL_TITLE_SUFFIX)) {
    t = t.slice(0, -LEGACY_TOOL_TITLE_SUFFIX.length).trim();
    return `${t}${TOOL_PAGE_TITLE_SUFFIX}`;
  }
  const base = t.replace(/\s*\|\s*Toollabz(\s*-\s*Free Online Tools)?\s*$/i, "").trim();
  return `${base}${TOOL_PAGE_TITLE_SUFFIX}`;
}

export function toolMetadata(tool: ToolDefinition) {
  const path = `/tools/${tool.slug}`;
  const override = TOOL_SEO_OVERRIDES[tool.slug];
  let title: string;
  if (override?.title) {
    const formatted = ensureToolPageTitleFormat(override.title);
    const candidate = clampSerpTitle(formatted, 78);
    title = candidate.includes(tool.name) ? candidate : buildSerpToolTitle(tool);
  } else {
    title = buildSerpToolTitle(tool);
  }
  const description = override?.description
    ? normalizeToolMetaDescription(override.description, tool)
    : buildToolMetaDescription(tool);
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

/** Minimal SoftwareApplication JSON-LD (stable fields for indexing). */
export function toolSchema(tool: ToolDefinition, pagePath?: string) {
  const path = pagePath ?? `/tools/${tool.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: absoluteUrl(path),
    applicationCategory: "UtilityApplication",
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

/** HowTo structured data built from on-page steps (extended for rich results). */
export function howToSchema(tool: ToolDefinition, pagePath?: string) {
  const path = pagePath ?? `/tools/${tool.slug}`;
  const tail = [
    "Run the primary action (Calculate, Convert, or Generate) after inputs validate.",
    "Read the headline result and any supporting breakdown lines.",
    "Copy or screenshot the output for your records; open a related tool from the page if the next step needs different math.",
  ];
  const steps = [...tool.howToUse, ...tail].slice(0, 10);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: tool.shortDescription || tool.description,
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Step ${i + 1}`,
      text,
    })),
    url: absoluteUrl(path),
  };
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
  const sameAs = (process.env.NEXT_PUBLIC_ORG_SAME_AS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Toollabz",
    url: siteUrl,
    logo: absoluteUrl("/logo-toollabz.webp"),
    dateModified: SITE_LAST_UPDATED_DATE_TIME,
    ...(contactEmail
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: contactEmail,
              url: absoluteUrl("/contact"),
            },
          ],
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** Category / hub landing: CollectionPage + ItemList of tools. */
export function hubCollectionPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  items: readonly { name: string; slug: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        url: absoluteUrl(`/tools/${t.slug}`),
        description: t.description,
      })),
    },
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
