import { TRAFFIC_PHASE_BLOG_IDEAS } from "@/lib/blog/traffic-phase-blog-ideas";
import { categories, tools } from "@/lib/tools/data";
import type { KeywordOpportunity, PrioritizedOpportunity, SearchIntent } from "./types";
import { buildProcessingQueue, dedupeOpportunities, topicBucket } from "./keyword-intelligence";
import { loadPerformanceAggregates } from "./performance/load-aggregates";
import { enrichPrioritizedWithPerformanceAndClusters } from "./performance/enrich-priorities";
import { loadBehaviorAggregates } from "./growth/load-behavior-aggregates";
import { computeCpcProxyScore, computeMonetizationPotential } from "./monetization/cpc-scoring";

const TRANSACTIONAL_HINTS = /\b(calculator|tool|convert|converter|estimate|planner|checker|generator)\b/i;

function inferIntent(keyword: string): SearchIntent {
  if (TRANSACTIONAL_HINTS.test(keyword)) return "transactional";
  if (/\b(how|what|why|guide|explained|meaning)\b/i.test(keyword)) return "informational";
  return "mixed";
}

function monetizationHeuristic(keyword: string): number {
  let s = 0.35;
  if (TRANSACTIONAL_HINTS.test(keyword)) s += 0.35;
  if (/\b(insurance|mortgage|loan|tax|salary|paycheck|refinance|credit|investment|business)\b/i.test(keyword))
    s += 0.2;
  return Math.min(1, s);
}

/** Inverse proxy for KD: long-tail + question forms score higher (prefer easier angles). */
function competitionHeuristic(keyword: string): number {
  const words = keyword.split(/\s+/).length;
  let s = 0.4;
  if (words >= 4) s += 0.25;
  if (/\b(how to|best|vs|without|for beginners)\b/i.test(keyword)) s += 0.2;
  if (keyword.length > 28) s += 0.1;
  return Math.min(1, s);
}

function longTailVariations(base: string): string[] {
  const b = base.trim();
  if (!b) return [];
  return [
    `${b} explained`,
    `${b} step by step`,
    `how to use ${b}`,
    `${b} examples`,
    `${b} common mistakes`,
  ].map((s) => s.replace(/\s+/g, " ").toLowerCase());
}

/**
 * Harvest keyword opportunities from tools, categories, editorial backlog, and simple long-tail variants.
 */
export function discoverKeywordOpportunities(): KeywordOpportunity[] {
  const out: KeywordOpportunity[] = [];

  for (const t of tools) {
    for (const kw of t.keywords) {
      out.push({
        keyword: kw,
        intent: inferIntent(kw),
        monetizationScore: monetizationHeuristic(kw),
        competitionScore: competitionHeuristic(kw),
        sources: [`tool:${t.slug}`],
      });
    }
    out.push({
      keyword: `${t.name} online`.toLowerCase(),
      intent: "transactional",
      monetizationScore: monetizationHeuristic(t.name),
      competitionScore: competitionHeuristic(t.slug.replace(/-/g, " ")),
      sources: [`tool-name:${t.slug}`],
    });
  }

  for (const c of categories) {
    const label = c.name.toLowerCase();
    const catKw = `${label} tools`;
    out.push({
      keyword: catKw,
      intent: "mixed",
      monetizationScore: 0.55,
      competitionScore: 0.45,
      sources: [`category:${c.slug}`],
      cpcProxy: computeCpcProxyScore(catKw),
      monetizationPotential: computeMonetizationPotential(catKw, []),
    });
  }

  for (const idea of TRAFFIC_PHASE_BLOG_IDEAS) {
    const tk = idea.targetKeyword;
    const linkSlugs = [...(idea.linkTools ?? [])];
    out.push({
      keyword: tk,
      intent: inferIntent(tk),
      monetizationScore: monetizationHeuristic(tk),
      competitionScore: competitionHeuristic(tk),
      sources: [`editorial:${idea.slugSuggestion}`],
      cpcProxy: computeCpcProxyScore(tk),
      monetizationPotential: computeMonetizationPotential(tk, linkSlugs),
    });
    for (const v of longTailVariations(idea.targetKeyword)) {
      out.push({
        keyword: v,
        intent: "informational",
        monetizationScore: monetizationHeuristic(v) * 0.9,
        competitionScore: competitionHeuristic(v),
        sources: [`longtail:${idea.slugSuggestion}`],
        cpcProxy: computeCpcProxyScore(v),
        monetizationPotential: computeMonetizationPotential(v, linkSlugs),
      });
    }
  }

  return dedupeOpportunities(out);
}

export function prioritizeOpportunities(limit = 24): PrioritizedOpportunity[] {
  const queue = buildProcessingQueue(discoverKeywordOpportunities(), 200);
  const ideasByKeyword = new Map(TRAFFIC_PHASE_BLOG_IDEAS.map((i) => [i.targetKeyword.toLowerCase(), i]));

  return queue.slice(0, limit).map((q) => {
    const idea = ideasByKeyword.get(q.keyword);
    const priority = Math.round(q.priority * 100);
    return {
      keyword: q.keyword,
      intent: inferIntent(q.keyword),
      priority,
      suggestedBlogTitle: idea?.title,
      suggestedToolAngle: idea?.angle,
      linkToolSlugs: idea?.linkTools?.length ? [...idea.linkTools] : [],
      opportunitySources: q.sources?.length ? [...q.sources] : undefined,
    };
  });
}

/**
 * Performance + cluster-aware ranking for pipelines (GSC snapshot optional, topic clusters always).
 */
export function prioritizeForPipeline(limit = 24): PrioritizedOpportunity[] {
  const pool = prioritizeOpportunities(Math.min(80, limit * 4));
  const aggregates = loadPerformanceAggregates();
  const behavior = loadBehaviorAggregates();
  return enrichPrioritizedWithPerformanceAndClusters(pool, aggregates, behavior, limit);
}

export function exportOpportunityBuckets(): Record<string, string[]> {
  const map = new Map<string, string[]>();
  for (const o of discoverKeywordOpportunities()) {
    const b = topicBucket(o.keyword);
    const arr = map.get(b) ?? [];
    arr.push(o.keyword);
    map.set(b, arr);
  }
  return Object.fromEntries([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}
