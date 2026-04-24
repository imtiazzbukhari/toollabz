import type { GscPageMetric } from "../performance/types";

export type ProgrammaticQueryIdea = {
  primaryKeyword: string;
  kind: "numeric_principal" | "numeric_term" | "location" | "intent_variation";
  /** For humans / backlog — not a live URL. */
  suggestedSlugHint: string;
  rationale: string;
};

const DEFAULT_PRINCIPAL_TIERS = [5_000, 10_000, 25_000, 50_000, 100_000] as const;
const DEFAULT_LOC_SUFFIXES = ["usa", "uk", "california", "texas", "florida"] as const;

function ctr(m: GscPageMetric): number {
  return m.impressions > 0 ? m.clicks / m.impressions : 0;
}

function pathBaseKeyword(path: string): string | null {
  const m = path.replace(/\/+$/, "").match(/\/(?:blog|tools)\/([^/?#]+)$/i);
  if (!m?.[1]) return null;
  return m[1].replace(/-/g, " ");
}

/**
 * Derive programmatic SEO keyword ideas from a high-performing tool/blog path.
 * Intended for backlog / LLM seeding — does not create routes.
 */
export function expandProgrammaticQueriesForPath(
  metric: GscPageMetric,
  opts?: { principalTiers?: readonly number[]; locations?: readonly string[] },
): ProgrammaticQueryIdea[] {
  const strong = metric.clicks >= 15 || (metric.impressions >= 1500 && ctr(metric) >= 0.025);
  if (!strong) return [];

  const base = pathBaseKeyword(metric.path);
  if (!base) return [];

  const principals = opts?.principalTiers?.length ? opts.principalTiers : [...DEFAULT_PRINCIPAL_TIERS];
  const locs = opts?.locations?.length ? opts.locations : [...DEFAULT_LOC_SUFFIXES];

  const ideas: ProgrammaticQueryIdea[] = [];

  if (/\bloan|mortgage|emi|payment|debt|refinance\b/i.test(base)) {
    for (const amt of principals) {
      const formatted = amt >= 1000 ? `${amt / 1000}k` : String(amt);
      ideas.push({
        primaryKeyword: `${base} ${amt} example`,
        kind: "numeric_principal",
        suggestedSlugHint: `${metric.path.split("/").pop()}-${formatted}-example`,
        rationale: "Numeric modifiers capture long-tail calculator intent.",
      });
    }
  }

  if (/\b(salary|paycheck|tax|take home|hourly|mortgage|loan|rent|buy)\b/i.test(base)) {
    for (const loc of locs) {
      ideas.push({
        primaryKeyword: `${base} ${loc}`,
        kind: "location",
        suggestedSlugHint: `${metric.path.split("/").pop()}-${loc}`,
        rationale: "Geo-qualified queries often have clearer intent and less aggregate competition.",
      });
    }
  }

  ideas.push(
    {
      primaryKeyword: `${base} step by step`,
      kind: "intent_variation",
      suggestedSlugHint: `${metric.path.split("/").pop()}-step-by-step`,
      rationale: "How-to phrasing pairs with awareness-stage guides.",
    },
    {
      primaryKeyword: `${base} vs alternatives`,
      kind: "intent_variation",
      suggestedSlugHint: `${metric.path.split("/").pop()}-vs-alternatives`,
      rationale: "Comparison clusters improve topical authority and internal linking depth.",
    },
    {
      primaryKeyword: `${base} common mistakes`,
      kind: "intent_variation",
      suggestedSlugHint: `${metric.path.split("/").pop()}-mistakes`,
      rationale: "Objection/mistake pages improve engagement and FAQ expansion.",
    },
  );

  if (/\b(year|month|term|schedule|amortization)\b/i.test(base)) {
    for (const years of [5, 10, 15, 30] as const) {
      ideas.push({
        primaryKeyword: `${base} ${years} year`,
        kind: "numeric_term",
        suggestedSlugHint: `${metric.path.split("/").pop()}-${years}yr`,
        rationale: "Term-length modifiers map to real user comparisons.",
      });
    }
  }

  return ideas.slice(0, 24);
}

export function buildProgrammaticExpansionQueue(
  pages: readonly GscPageMetric[],
  maxPages = 6,
): Array<{ path: string; metric: GscPageMetric; ideas: ProgrammaticQueryIdea[] }> {
  const sorted = [...pages].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);
  const out: Array<{ path: string; metric: GscPageMetric; ideas: ProgrammaticQueryIdea[] }> = [];
  for (const p of sorted) {
    if (out.length >= maxPages) break;
    const ideas = expandProgrammaticQueriesForPath(p);
    if (ideas.length === 0) continue;
    out.push({ path: p.path, metric: p, ideas });
  }
  return out;
}
