import type { ToolDefinition } from "@/lib/tools/types";
import { freshnessRankForSlug } from "@/lib/site-freshness";
import { HOMEPAGE_MAJOR_SHOWCASE_SLUGS, POPULAR_TOOL_SLUGS } from "@/lib/tools/popular-tools";

/** Avoid repeating tools already shown in Popular or Major showcase on the same page. */
const HOMEPAGE_RECENT_EXCLUDED = new Set<string>([...POPULAR_TOOL_SLUGS, ...HOMEPAGE_MAJOR_SHOWCASE_SLUGS]);

/**
 * Curated priority order: UK finance, AU GST-adjacent, developer utilities, SaaS/business metrics,
 * then high-intent finance. First matching slug wins; remainder filled by scored backfill (deterministic).
 */
const RECENT_STRATEGIC_SLUG_ORDER: readonly string[] = [
  "dividend-tax-calculator-uk",
  "rental-yield-calculator-uk",
  "uk-road-tax-calculator",
  "zakat-calculator",
  "freelance-day-rate-calculator",
  "invoice-late-fee-calculator",
  "notice-period-calculator",
  "employee-cost-calculator",
  "cron-expression-generator",
  "markdown-to-html-converter",
  "uuid-generator",
  "regex-tester",
  "unix-timestamp-converter",
  "csv-to-json-converter",
  "xml-formatter",
  "yaml-validator",
  "base64-encoder-decoder",
  "url-encoder-decoder",
  "cac-calculator",
  "ltv-calculator",
  "churn-calculator",
  "burn-rate-runway-calculator",
  "profit-margin-calculator-business",
  "roi-calculator-marketing",
  "conversion-rate-calculator",
  "cpc-calculator",
  "early-loan-payoff-calculator",
  "mortgage-refinance-calculator",
  "mortgage-affordability-calculator-usa",
  "crypto-tax-calculator",
  "investment-portfolio-calculator",
  "inflation-calculator",
  "time-zone-converter",
  "date-difference-calculator",
];

function categoryStrategicScore(tool: ToolDefinition): number {
  const { slug, category } = tool;
  if (/-uk$/.test(slug) || slug.includes("uk-road") || slug.includes("zakat")) return 90;
  if (slug.includes("gst-australia") || slug.includes("invoice") || slug.includes("freelance-day")) return 75;
  if (category === "developer") return 70;
  if (category === "business") return 60;
  if (category === "finance") return 50;
  if (category === "marketing") return 45;
  if (category === "pdf") return 40;
  if (category === "real-estate") return 35;
  return 15;
}

/**
 * Homepage "recently updated" strip: strategic order first, then deterministic SEO-weighted backfill.
 * Ordering shifts when `SITE_LAST_UPDATED_ISO` changes (via `freshnessRankForSlug`), not random per request.
 */
export function getHomepageRecentlyUpdatedTools(allTools: ToolDefinition[], limit = 12): ToolDefinition[] {
  const bySlug = new Map(allTools.map((t) => [t.slug, t]));
  const out: ToolDefinition[] = [];
  const used = new Set<string>();

  const take = (slug: string) => {
    if (out.length >= limit) return;
    if (used.has(slug) || HOMEPAGE_RECENT_EXCLUDED.has(slug)) return;
    const t = bySlug.get(slug);
    if (!t) return;
    out.push(t);
    used.add(slug);
  };

  for (const slug of RECENT_STRATEGIC_SLUG_ORDER) take(slug);

  if (out.length < limit) {
    const rest = allTools
      .filter((t) => !used.has(t.slug) && !HOMEPAGE_RECENT_EXCLUDED.has(t.slug))
      .map((t) => ({
        t,
        score: categoryStrategicScore(t) * 1_000_000 - (freshnessRankForSlug(t.slug) >>> 0),
      }))
      .sort((a, b) => b.score - a.score);

    for (const { t } of rest) {
      take(t.slug);
      if (out.length >= limit) break;
    }
  }

  return out;
}

export type HomeFeaturedGuidePin = { href: string; label: string };

/**
 * Pool of high-intent / hub-aligned articles. Homepage shows a deterministic subset (see `getHomepageFeaturedGuidePins`).
 */
export const HOMEPAGE_FEATURED_GUIDE_PIN_POOL: readonly HomeFeaturedGuidePin[] = [
  { href: "/blog/gst-vs-vat-uk-au-cross-border-pricing-toollabz", label: "GST vs VAT (AU vs UK)" },
  { href: "/blog/uk-self-employed-dividend-salary-effective-percent-toollabz", label: "UK pay: salary vs dividend" },
  { href: "/blog/json-formatting-and-validation-explained-developer", label: "JSON validation (developer)" },
  { href: "/blog/jwt-expiry-api-healthchecks-curl-playbook-toollabz", label: "JWT checks & curl playbook" },
  { href: "/blog/jwt-token-decode-vs-verify-security-guide-toollabz", label: "JWT decode vs verify" },
  { href: "/blog/saas-roas-churn-retention-metrics-primer-toollabz", label: "ROAS, churn, retention" },
  { href: "/blog/working-days-uk-timezones-business-slas-toollabz", label: "UK working days & SLAs" },
  { href: "/blog/gst-australia-inclusive-exclusive-10-percent-small-business", label: "GST Australia (10%)" },
  { href: "/blog/vat-calculator-uk-eu-uae-add-remove-guide", label: "VAT add/remove (UK & EU)" },
  { href: "/blog/marketplace-seller-fees-stripe-paypal-etsy-ebay-toollabz", label: "Stripe & marketplace fees" },
  { href: "/blog/break-even-analysis-formula-examples-calculator", label: "Break-even: formula & examples" },
  { href: "/blog/beyond-break-even-contribution-margin-profit-path", label: "Beyond break-even: margin path" },
  { href: "/blog/sql-cron-readability-schedulers-developer-guide-toollabz", label: "SQL & cron readability" },
  { href: "/blog/developer-text-json-yaml-html-csv-pipeline-toollabz", label: "Text pipeline: JSON & CSV" },
  { href: "/blog/roi-vs-roas-when-to-trust-each-metric", label: "ROI vs ROAS" },
  { href: "/blog/employee-loaded-cost-pricing-seat-economics-toollabz", label: "Loaded cost & seat economics" },
];

/** Deterministic rotation: which pins surface changes when `SITE_LAST_UPDATED_ISO` changes (same mechanism as tool shuffle). */
export function getHomepageFeaturedGuidePins(max = 6): HomeFeaturedGuidePin[] {
  const ranked = [...HOMEPAGE_FEATURED_GUIDE_PIN_POOL].sort(
    (a, b) => freshnessRankForSlug(`blogpin:${a.href}`) - freshnessRankForSlug(`blogpin:${b.href}`),
  );
  return ranked.slice(0, max);
}
