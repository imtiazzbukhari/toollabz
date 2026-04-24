import type { PrioritizedOpportunity } from "../types";
import type { GscPageMetric, PerformanceAggregates } from "../performance/types";
import { computeCpcProxyScore, computeMonetizationPotential } from "./cpc-scoring";
import { lowValueKeywordPenalty } from "./low-value";

function slugFromBlogPath(path: string): string | null {
  const m = path.replace(/\/+$/, "").match(/\/blog\/([^/?#]+)$/i);
  return m?.[1]?.toLowerCase() ?? null;
}

function slugFromToolPath(path: string): string | null {
  const m = path.replace(/\/+$/, "").match(/\/tools\/([^/?#]+)$/i);
  return m?.[1]?.toLowerCase() ?? null;
}

function tokenizeForOverlap(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const t of b) if (a.has(t)) n += 1;
  return n;
}

function ctr(p: GscPageMetric): number {
  if (p.impressions <= 0) return 0;
  return p.clicks / p.impressions;
}

/**
 * Boost opportunities when GSC shows strong tool URLs matching `linkToolSlugs`.
 */
function applyHighTrafficToolBoost(rows: PrioritizedOpportunity[], pages: readonly GscPageMetric[]): PrioritizedOpportunity[] {
  const toolHits = new Map<string, { clicks: number; impressions: number }>();
  for (const p of pages) {
    const slug = slugFromToolPath(p.path);
    if (!slug) continue;
    if (p.clicks < 15 && p.impressions < 800) continue;
    const prev = toolHits.get(slug) ?? { clicks: 0, impressions: 0 };
    toolHits.set(slug, { clicks: prev.clicks + p.clicks, impressions: prev.impressions + p.impressions });
  }
  if (toolHits.size === 0) return [...rows];

  return rows.map((row) => {
    let boost = 0;
    for (const slug of row.linkToolSlugs) {
      const hit = toolHits.get(slug.toLowerCase());
      if (!hit) continue;
      boost += Math.min(14, 4 + Math.floor(hit.clicks / 40));
    }
    if (boost === 0) return row;
    return {
      ...row,
      priority: Math.min(100, row.priority + boost),
      performanceBoost: (row.performanceBoost ?? 0) + boost,
    };
  });
}

/**
 * Slight boost when pages show healthy CTR (engagement proxy).
 */
function applyEngagementCtrBoost(rows: PrioritizedOpportunity[], pages: readonly GscPageMetric[]): PrioritizedOpportunity[] {
  const strongCtr = pages.filter((p) => p.impressions >= 250 && ctr(p) >= 0.035);
  if (strongCtr.length === 0) return rows;

  const tokenBags = strongCtr.map((p) => tokenizeForOverlap(p.path.replace(/^\//, "").replace(/\//g, " ")));

  return rows.map((row) => {
    const kw = tokenizeForOverlap(row.keyword);
    let add = 0;
    for (const bag of tokenBags) {
      const o = overlapScore(kw, bag);
      if (o > 0) add += Math.min(8, o * 3);
    }
    if (add === 0) return row;
    return {
      ...row,
      priority: Math.min(100, row.priority + add),
      engagementBoost: (row.engagementBoost ?? 0) + add,
    };
  });
}

/**
 * Down-rank topics aligned with high-impression, very low CTR paths (weak engagement proxy).
 */
function applyLowCtrImpressionPenalty(rows: PrioritizedOpportunity[], pages: readonly GscPageMetric[]): PrioritizedOpportunity[] {
  const fatigued = pages.filter((p) => p.impressions >= 2500 && ctr(p) < 0.012);
  if (fatigued.length === 0) return rows;

  const tokenBags = fatigued.map((p) => {
    const slug = slugFromBlogPath(p.path);
    return tokenizeForOverlap((slug ?? p.path).replace(/-/g, " "));
  });

  return rows.map((row) => {
    const kw = tokenizeForOverlap(row.keyword);
    let pen = 0;
    for (const bag of tokenBags) {
      const o = overlapScore(kw, bag);
      if (o > 0) pen += Math.min(10, o * 3);
    }
    if (pen === 0) return row;
    return {
      ...row,
      priority: Math.max(5, row.priority - pen),
      revenuePenalty: (row.revenuePenalty ?? 0) + pen,
    };
  });
}

function applyLowValueOnly(rows: PrioritizedOpportunity[]): PrioritizedOpportunity[] {
  return rows.map((row) => {
    const sources = row.opportunitySources?.join(" ") ?? "";
    const pen = lowValueKeywordPenalty(row.keyword, sources);
    if (pen === 0) return row;
    return {
      ...row,
      priority: Math.max(5, row.priority - pen),
      revenuePenalty: (row.revenuePenalty ?? 0) + pen,
    };
  });
}

function applyRevenuePriorityFilter(
  rows: PrioritizedOpportunity[],
  aggregates: PerformanceAggregates | null,
): PrioritizedOpportunity[] {
  if (!aggregates?.pages?.length) return rows;
  const revByPath = new Map((aggregates.pageRevenue ?? []).map((r) => [r.path, r]));
  return rows.map((row) => {
    const keyword = row.keyword.toLowerCase();
    let boost = 0;
    let penalty = 0;
    for (const page of aggregates.pages) {
      const pathTokens = tokenizeForOverlap(page.path);
      const kwTokens = tokenizeForOverlap(keyword);
      const overlap = overlapScore(kwTokens, pathTokens);
      if (!overlap) continue;
      const rpm = revByPath.get(page.path)?.rpm ?? 0;
      const conversionProxy = page.impressions > 0 ? page.clicks / page.impressions : 0;
      if (rpm >= 10 && conversionProxy >= 0.02) boost += Math.min(14, overlap * 4);
      if (rpm < 3 && page.impressions >= 1800 && row.intent === "informational") penalty += Math.min(12, overlap * 3);
    }
    if (!boost && !penalty) return row;
    return {
      ...row,
      priority: Math.max(5, Math.min(100, row.priority + boost - penalty)),
      performanceBoost: (row.performanceBoost ?? 0) + boost,
      revenuePenalty: (row.revenuePenalty ?? 0) + penalty,
    };
  });
}

/**
 * Revenue + engagement layer on top of GSC keyword overlap (see gsc-merge).
 */
export function applyRevenueEngagementLayer(
  rows: readonly PrioritizedOpportunity[],
  aggregates: PerformanceAggregates | null,
): PrioritizedOpportunity[] {
  let out = [...rows] as PrioritizedOpportunity[];
  if (aggregates?.pages?.length) {
    out = applyHighTrafficToolBoost(out, aggregates.pages);
    out = applyEngagementCtrBoost(out, aggregates.pages);
    out = applyLowCtrImpressionPenalty(out, aggregates.pages);
    out = applyRevenuePriorityFilter(out, aggregates);
  }
  out = applyLowValueOnly(out);
  out.sort((a, b) => b.priority - a.priority || a.keyword.localeCompare(b.keyword));
  return out;
}

/** CPC + monetization tags for API / PR context. */
export function attachMonetizationTags(rows: readonly PrioritizedOpportunity[]): PrioritizedOpportunity[] {
  return rows.map((row) => ({
    ...row,
    cpcScore: computeCpcProxyScore(row.keyword),
    monetizationPotential: computeMonetizationPotential(row.keyword, row.linkToolSlugs),
  }));
}
