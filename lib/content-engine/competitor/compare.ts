import { normalizeHeadingKey } from "./extract-headings";

export type CompetitorPageBrief = {
  url: string;
  headings: string[];
  headingCount: number;
  error?: string;
};

export type CompetitorGapResult = {
  ourPath: string;
  ourHeadings: string[];
  competitors: CompetitorPageBrief[];
  /** Competitor heading themes missing from our template proxy list. */
  missingSectionThemes: string[];
  notes: string[];
};

function headingSet(headings: readonly string[]): Set<string> {
  return new Set(headings.map((h) => normalizeHeadingKey(h)));
}

/**
 * Compare our structural headings vs competitor pages (heading list overlap).
 */
export function compareOurPageVsCompetitors(
  ourPath: string,
  ourHeadings: readonly string[],
  competitors: readonly CompetitorPageBrief[],
): CompetitorGapResult {
  const ours = headingSet(ourHeadings);
  const competitorThemes = new Map<string, number>();

  for (const c of competitors) {
    for (const h of c.headings) {
      const k = normalizeHeadingKey(h);
      if (!k) continue;
      competitorThemes.set(k, (competitorThemes.get(k) ?? 0) + 1);
    }
  }

  const missing: string[] = [];
  for (const [k, count] of competitorThemes) {
    if (ours.has(k)) continue;
    if (count >= 2) missing.push(k);
  }

  missing.sort((a, b) => (competitorThemes.get(b) ?? 0) - (competitorThemes.get(a) ?? 0));

  return {
    ourPath,
    ourHeadings: [...ourHeadings],
    competitors: [...competitors],
    missingSectionThemes: missing.slice(0, 24),
    notes: [
      "Themes appear in 2+ competitor pages but not in our template proxy list - editorial candidates for new H2s/sections.",
      "This is not legal advice to copy text; add original sections that satisfy the same intent.",
    ],
  };
}
