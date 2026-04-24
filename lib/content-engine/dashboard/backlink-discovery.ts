import type { PrioritizedOpportunity } from "../types";

export type BacklinkProspect = {
  domain: string;
  query: string;
  relevanceScore: number;
  authorityScore: number;
  spamRisk: "low" | "medium" | "high";
  contactHint: string;
  notes: string[];
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Prospect discovery templates (no live scraping). Domains are illustrative seeds derived from keyword hash.
 * Human review required before outreach.
 */
export function buildBacklinkProspects(opportunities: readonly PrioritizedOpportunity[], max = 12): BacklinkProspect[] {
  const templates = [
    (kw: string) => `"write for us" ${kw}`,
    (kw: string) => `"guest post" ${kw}`,
    (kw: string) => `"become a contributor" ${kw}`,
  ];

  const out: BacklinkProspect[] = [];
  const seen = new Set<string>();

  for (const row of opportunities.slice(0, 20)) {
    const kw = row.keyword.slice(0, 48);
    for (const tpl of templates) {
      const query = tpl(kw);
      const key = query.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const h = hashString(query);
      const pseudoTld = ["insights", "journal", "hub", "guide"][h % 4]!;
      const domain = `${["editors", "publish", "writers", "community"][h % 4]!}.${pseudoTld}.example`;
      const relevanceScore = Math.min(100, 55 + (row.monetizationPotential ?? 30) / 2 + (row.cpcScore ?? 20) / 3);
      const authorityScore = Math.min(100, 35 + (h % 40));
      const spamRisk: BacklinkProspect["spamRisk"] = relevanceScore < 62 ? "medium" : "low";
      if (kw.length < 6 || /free|generator|converter only/i.test(kw)) {
        out.push({
          domain,
          query,
          relevanceScore: Math.max(20, relevanceScore - 25),
          authorityScore: Math.max(10, authorityScore - 20),
          spamRisk: "high",
          contactHint: "Verify site manually; skip obvious PBNs and scraped lists.",
          notes: ["Low commercial intent keyword — deprioritize unless topical fit is strong."],
        });
      } else {
        out.push({
          domain,
          query,
          relevanceScore: Math.round(relevanceScore),
          authorityScore: Math.round(authorityScore),
          spamRisk,
          contactHint: "Find verified contact on /contact or LinkedIn; never bulk-merge.",
          notes: ["Use approved outreach templates; cap sends per policy."],
        });
      }
      if (out.length >= max) return out;
    }
  }
  return out;
}
