/** Hard-coded quality gates - single source of truth for backlink outreach. */

export const PROHIBITED_TLDS = [
  ".shop",
  ".xyz",
  ".top",
  ".icu",
  ".online",
  ".site",
  ".click",
  ".store",
  ".link",
] as const;

export const PROHIBITED_KEYWORDS = [
  "buy backlinks",
  "link building service",
  "da increase",
  "dr increase",
  "pbn links",
  "sponsored post price",
  "guest post price",
  "paid backlinks",
  "fiverr seo",
] as const;

export const QUALITY_GATES = {
  minDrAllowed: 30,
  maxLinksPerMonth: 8,
  maxLinksPerDomain: 2,
  minRelevanceScore: 7,
  minContentWords: 1000,
  minProspectScoreToShow: 6,
  prohibitedAnchors: [
    "best free online tools",
    "free calculators online",
    "online tools website",
  ],
} as const;

export function domainHasProhibitedTld(host: string): boolean {
  const h = host.toLowerCase();
  return PROHIBITED_TLDS.some((t) => h.endsWith(t));
}

export function textHasProhibitedKeywords(text: string): boolean {
  const t = text.toLowerCase();
  return PROHIBITED_KEYWORDS.some((k) => t.includes(k));
}

export function anchorLooksKeywordStuffed(anchor: string): boolean {
  const a = anchor.toLowerCase().trim();
  if (QUALITY_GATES.prohibitedAnchors.some((p) => a.includes(p))) return true;
  if (a.split(/\s+/).length > 6 && /free|online|tool|calculator|best/i.test(a)) return true;
  return false;
}

export function estimateDrFromHost(host: string, inSeedList: boolean): number {
  const h = host.toLowerCase();
  if (inSeedList) return 75;
  if (h.endsWith(".edu") || h.endsWith(".gov")) return 85;
  if (h.endsWith(".gov.uk")) return 82;
  return 40;
}

export type PageType = "write_for_us" | "resource_page" | "tool_directory";

export function scoreProspect(opts: {
  domain: string;
  inSeedList: boolean;
  hasWriteForUs: boolean;
  hasResourcesPage: boolean;
  contactEmail: string | null;
  pageHtmlSample?: string;
}): { score: number; rejectionReason: string | null } {
  const host = opts.domain.replace(/^www\./i, "").split("/")[0] ?? opts.domain;
  let score = 5;
  if (opts.inSeedList) score += 3;
  if (opts.hasWriteForUs) score += 2;
  if (opts.hasResourcesPage) score += 2;
  if (opts.contactEmail) score += 2;
  if (host.endsWith(".edu") || host.endsWith(".gov")) score += 1;
  if (domainHasProhibitedTld(host)) score -= 3;
  const sample = (opts.pageHtmlSample ?? "").toLowerCase();
  if (textHasProhibitedKeywords(sample)) score -= 5;

  const dr = estimateDrFromHost(host, opts.inSeedList);
  if (dr < QUALITY_GATES.minDrAllowed) {
    return { score: Math.min(score, 3), rejectionReason: `Estimated DR below ${QUALITY_GATES.minDrAllowed}` };
  }
  if (score < QUALITY_GATES.minProspectScoreToShow) {
    return { score, rejectionReason: `Quality score ${score} below minimum ${QUALITY_GATES.minProspectScoreToShow}` };
  }
  return { score, rejectionReason: null };
}
