import type { KeywordOpportunity } from "./types";
import { computeCpcProxyScore, computeMonetizationPotential } from "./monetization/cpc-scoring";

function toolSlugsFromSources(sources: readonly string[]): string[] {
  return sources.filter((s) => s.startsWith("tool:")).map((s) => s.slice(5));
}

function normalizeKeyword(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .slice(0, 120);
}

/** Topic bucket from first 1–2 tokens (lightweight clustering). */
export function topicBucket(keyword: string): string {
  const parts = normalizeKeyword(keyword).split(" ").filter(Boolean);
  return parts.slice(0, 2).join(" ") || "misc";
}

export function dedupeOpportunities(rows: KeywordOpportunity[]): KeywordOpportunity[] {
  const map = new Map<string, KeywordOpportunity>();
  for (const row of rows) {
    const k = normalizeKeyword(row.keyword);
    if (!k) continue;
    const prev = map.get(k);
    if (!prev) {
      map.set(k, { ...row, keyword: k });
      continue;
    }
    map.set(k, {
      keyword: k,
      intent: prev.intent === row.intent ? prev.intent : "mixed",
      monetizationScore: Math.max(prev.monetizationScore, row.monetizationScore),
      competitionScore: Math.max(prev.competitionScore, row.competitionScore),
      sources: [...new Set([...prev.sources, ...row.sources])],
      cpcProxy: (() => {
        const m = Math.max(prev.cpcProxy ?? 0, row.cpcProxy ?? 0);
        return m > 0 ? m : undefined;
      })(),
      monetizationPotential: (() => {
        const m = Math.max(prev.monetizationPotential ?? 0, row.monetizationPotential ?? 0);
        return m > 0 ? m : undefined;
      })(),
    });
  }
  return [...map.values()];
}

export type ProcessingQueueItem = {
  keyword: string;
  bucket: string;
  priority: number;
  sources?: string[];
};

export function buildProcessingQueue(opportunities: KeywordOpportunity[], limit = 50): ProcessingQueueItem[] {
  const deduped = dedupeOpportunities(opportunities);
  const scored = deduped.map((o) => {
    const cpc = o.cpcProxy ?? computeCpcProxyScore(o.keyword);
    const slugList = toolSlugsFromSources(o.sources);
    const pot = o.monetizationPotential ?? computeMonetizationPotential(o.keyword, slugList);
    const cpcN = cpc / 100;
    const potN = pot / 100;
    const priority = potN * 0.5 + o.competitionScore * 0.32 + cpcN * 0.18;
    return {
      keyword: o.keyword,
      bucket: topicBucket(o.keyword),
      priority,
      sources: [...o.sources],
    };
  });
  scored.sort((a, b) => b.priority - a.priority || a.keyword.localeCompare(b.keyword));
  return scored.slice(0, limit);
}
