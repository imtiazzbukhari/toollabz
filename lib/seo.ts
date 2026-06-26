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

export function sanitizeMetaDescription(raw: string, maxLen = 155): string {
  const normalized = raw.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLen) return normalized;
  const truncated = normalized.slice(0, maxLen);
  const lastPeriod = truncated.lastIndexOf(".");
  const lastSpace = truncated.lastIndexOf(" ");
  const cutAt = lastPeriod > 100 ? lastPeriod + 1 : lastSpace;
  return truncated.slice(0, cutAt > 0 ? cutAt : maxLen).trim();
}

/** SERP meta description: <=155 chars and ends cleanly. */
export function buildToolMetaDescription(tool: ToolDefinition): string {
  const keyword = tool.keywords[0] ?? tool.name.toLowerCase();
  const action = /calculator/i.test(tool.name) ? "Calculate" : /converter/i.test(tool.name) ? "Convert" : "Use";
  const benefit = (tool.shortDescription || tool.description || "Get a clear, instant result")
    .replace(/\bfree\b/gi, "")
    .trim()
    .replace(/\s+/g, " ");
  const raw = `${action} ${keyword} instantly. ${benefit}. Reviewed by Toollabz editors. Free, no account needed.`;
  return sanitizeMetaDescription(raw, 155);
}

const META_DESC_MAX = 155;

const TOOL_TITLE_OVERRIDES: Record<string, string> = {
  "vat-calculator": "VAT Calculator UK 2026 — Add or Remove VAT Instantly | Toollabz",
  "salary-after-tax-calculator": "Salary After Tax Calculator 2026/27 — UK Take-Home Pay | Toollabz",
  "profit-margin-calculator": "Profit Margin Calculator — Margin & Markup in Seconds | Toollabz",
  "loan-calculator": "Loan Calculator — Monthly Payments + Full Amortisation | Toollabz",
  "compound-interest-calculator": "Compound Interest Calculator — See How Money Grows | Toollabz",
  "roi-calculator": "ROI Calculator — Return on Investment Instantly | Toollabz",
  "break-even-calculator": "Break-Even Calculator — Units & Revenue to Break Even | Toollabz",
  "net-worth-calculator": "Net Worth Calculator — Assets Minus Liabilities | Toollabz",
  "percentage-calculator": "Percentage Calculator — 3 Calculation Modes, Instant | Toollabz",
  "currency-converter": "Currency Converter — Live Rates, 150+ Currencies | Toollabz",
  "youtube-earnings-calculator": "YouTube Earnings Calculator 2026 — Estimate Your Revenue | Toollabz",
  "paycheck-calculator-usa": "US Paycheck Calculator 2026 — Federal + State Take-Home | Toollabz",
  "tip-calculator": "Tip Calculator — Split Bills + Tip Per Person | Toollabz",
  "bmi-calculator": "BMI Calculator UK — Healthy Weight Range Instantly | Toollabz",
  "age-calculator": "Age Calculator — Exact Age in Years, Months & Days | Toollabz",
  "word-counter": "Word Counter — Words, Characters & Reading Time | Toollabz",
  "character-counter": "Character Counter — With & Without Spaces | Toollabz",
  "base64-encoder-decoder": "Base64 Encoder Decoder — Encode & Decode Instantly | Toollabz",
  "json-formatter": "JSON Formatter & Validator — Format + Fix Errors | Toollabz",
  "password-generator": "Password Generator — Secure & Random, 1 Click | Toollabz",
};

const TOOL_META_OVERRIDES: Record<string, string> = {
  "vat-calculator":
    "Add or remove UK VAT instantly — 20% standard, 5% reduced, or 0% zero rate. Includes reverse VAT and 2026/27 registration threshold guide. Free, no login required.",
  "salary-after-tax-calculator":
    "Calculate UK take-home pay for 2026/27 in seconds. Covers income tax, National Insurance, student loan (Plans 1/2/4/5/Postgrad), and pension auto-enrolment.",
  "profit-margin-calculator":
    "Calculate gross profit margin and markup % instantly. Includes margin vs markup comparison table and worked examples. A 40% margin = 66.7% markup. Free forever.",
  "loan-calculator":
    "Work out monthly repayments, total interest cost, and full amortisation schedule. Covers personal loans, car finance, and mortgages. No signup, instant results.",
  "compound-interest-calculator":
    "£10,000 at 5% for 20 years = £26,533. See how compound interest grows money over time. Choose daily, monthly, or annual compounding. Includes Rule of 72.",
  "roi-calculator":
    "Calculate ROI, annualised return, and payback period instantly. Includes worked examples for marketing spend, property, and investment portfolios. 100% free.",
  "break-even-calculator":
    "Find the exact units and revenue needed to break even. Enter fixed costs, variable costs, and selling price — get results in under 3 seconds. No account needed.",
  "net-worth-calculator":
    "Add your assets and liabilities to calculate your exact net worth. Separate breakdown by category (property, savings, debts, pensions). Free net worth tracker.",
  "percentage-calculator":
    "3 calculators in 1: find X% of Y, find what % X is of Y, or calculate % change. Instant results with worked examples. The fastest free percentage calculator.",
  "currency-converter":
    "Convert 150+ currencies using live mid-market exchange rates. Includes travel money tips — airport bureaux de change charge 8–12% more than mid-market rate.",
  "youtube-earnings-calculator":
    "Estimate YouTube ad revenue by monthly views, RPM, and content niche. UK creators average £0.80–£3.50 RPM in 2026. See monthly and annual income projection.",
  "paycheck-calculator-usa":
    "Calculate US take-home pay after federal income tax, Social Security (6.2%), Medicare (1.45%), and state tax. All 50 states supported. 2026 tax brackets included.",
  "tip-calculator":
    "Calculate tip amount and split the total per person. UK guide: 10–12.5%. US guide: 18–22%. Works for restaurants, taxis, hotels, and hairdressers. Instant.",
  "bmi-calculator":
    "Calculate BMI using NHS and WHO thresholds instantly. 175cm, 75kg = BMI 24.5 (healthy). Includes South Asian risk thresholds and children's BMI guidance.",
  "age-calculator":
    "Find your exact age in years, months, and days. Includes UK school year eligibility by birthday, NHS screening ages, and State Pension age 2026. Free.",
  "word-counter":
    "Count words, characters, sentences, paragraphs, and reading time instantly. Includes university word count rules and 2026 social media character limits guide.",
  "character-counter":
    "Count characters with and without spaces in real time. Includes character limits for Twitter/X (280), LinkedIn (3,000), Instagram (2,200), and all major platforms.",
  "base64-encoder-decoder":
    "Encode or decode Base64 and Base64URL strings instantly. Explains padding, standard vs URL-safe variants, JWT tokens, and common developer mistakes. Client-side only.",
  "json-formatter":
    "Format, validate, and minify JSON in one click. Pinpoints exact error line for invalid JSON — trailing commas, single quotes, missing brackets. No data uploaded.",
  "password-generator":
    "Generate cryptographically secure passwords using Web Crypto API. Set 8–64 char length, toggle uppercase/numbers/symbols. Passwords generated locally — never sent online.",
};

/** Pad or trim editorial / override copy into Google-friendly snippet length. */
export function normalizeToolMetaDescription(raw: string, tool: ToolDefinition): string {
  const cleaned = raw
    .replace(/\|\s*HTTPS,\s*in.*$/i, "")
    .replace(/\|\s*HTTPS.*$/i, "")
    .trim();
  const candidate = cleaned.length > 0 ? cleaned : buildToolMetaDescription(tool);
  return sanitizeMetaDescription(candidate, META_DESC_MAX);
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
  if (primary.length <= CTR_TITLE_MAX) return primary;
  const fallback = `${tool.name.trim()} - Free Online Tool`;
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

function toToolTitleBase(raw: string): string {
  const withoutBrand = raw.replace(/\s*\|\s*Toollabz(\s*-\s*Free Online Tools)?\s*$/i, "").trim();
  return withoutBrand.replace(/\s*\(Free\)\s*$/i, "").trim();
}

export function toolMetadata(tool: ToolDefinition) {
  const path = `/tools/${tool.slug}`;
  const absolutePath = absoluteUrl(path);
  const override = TOOL_SEO_OVERRIDES[tool.slug];
  let title: string;
  if (TOOL_TITLE_OVERRIDES[tool.slug]) {
    title = TOOL_TITLE_OVERRIDES[tool.slug]!;
  } else if (override?.title) {
    const formatted = ensureToolPageTitleFormat(override.title);
    const candidate = clampSerpTitle(formatted, 78);
    title = candidate.includes(tool.name) ? candidate : buildSerpToolTitle(tool);
  } else {
    title = buildSerpToolTitle(tool);
  }
  const titleBase = toToolTitleBase(title);
  const description = TOOL_META_OVERRIDES[tool.slug] ?? (override?.description
    ? normalizeToolMetaDescription(override.description, tool)
    : buildToolMetaDescription(tool));
  const ogImage = `${siteUrl}/api/og?title=${encodeURIComponent(tool.name)}&category=${encodeURIComponent(tool.category)}`;
  return {
    title: titleBase,
    description,
    keywords: [
      ...tool.keywords,
      `${tool.name.toLowerCase()} online`,
      `${tool.name.toLowerCase()} free`,
      `toollabz ${tool.name.toLowerCase()}`,
    ],
    alternates: {
      canonical: absolutePath,
      languages: {
        "en-GB": absolutePath,
        "en-US": absolutePath,
        "en-AU": absolutePath,
        "x-default": absolutePath,
      },
    },
    openGraph: {
      title: `${titleBase}${TOOL_PAGE_TITLE_SUFFIX}`,
      description,
      url: absolutePath,
      type: "website",
      siteName: "Toollabz",
      locale: "en_GB",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${tool.name} — Toollabz` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleBase}${TOOL_PAGE_TITLE_SUFFIX}`,
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
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: absoluteUrl(path),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: ["Free to use", "No account required", "Mobile responsive", "Instant results"],
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

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return faqPageSchemaFromPairs(faqs);
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

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(post: {
  title: string;
  description: string;
  url: string;
  publishedDate: string;
  modifiedDate: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: post.url,
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Toollabz",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-toollabz.webp"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.url,
    },
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
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@toollabz.com";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Toollabz",
    url: siteUrl,
    logo: absoluteUrl("/logo-toollabz.webp"),
    foundingDate: "2026-04",
    description:
      "Free online tools for finance, business, PDF, developer, and utility tasks. 238+ tools, no account required.",
    dateModified: SITE_LAST_UPDATED_DATE_TIME,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: contactEmail,
        url: absoluteUrl("/contact"),
      },
    ],
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
