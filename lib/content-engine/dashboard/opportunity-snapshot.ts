import { discoverKeywordOpportunities, prioritizeForPipeline } from "../opportunity-engine";
import { detectIntentStage } from "../funnel/intent-stage";
import type { PrioritizedOpportunity } from "../types";

export type KeywordIntelRow = {
  keyword: string;
  funnelIntent: "awareness" | "comparison" | "decision";
  searchIntent: PrioritizedOpportunity["intent"];
  priority: number;
  cpcScore: number;
  monetizationPotential: number;
  clusterId?: string;
};

export type ToolIdeaRow = {
  title: string;
  slugHint: string;
  rationale: string;
  priority: number;
  linkedTools: string[];
};

export type BlogIdeaRow = {
  title: string;
  keyword: string;
  rationale: string;
};

export function buildKeywordIntel(rows: readonly PrioritizedOpportunity[], limit = 16): KeywordIntelRow[] {
  return rows.slice(0, limit).map((r) => ({
    keyword: r.keyword,
    funnelIntent: detectIntentStage(r.keyword, r.suggestedBlogTitle),
    searchIntent: r.intent,
    priority: r.priority,
    cpcScore: r.cpcScore ?? 0,
    monetizationPotential: r.monetizationPotential ?? 0,
    clusterId: r.clusterId,
  }));
}

export function buildToolIdeaRows(rows: readonly PrioritizedOpportunity[], limit = 10): ToolIdeaRow[] {
  const out: ToolIdeaRow[] = [];
  for (const r of rows) {
    if (out.length >= limit) break;
    if (!r.linkToolSlugs?.length && !r.suggestedToolAngle) continue;
    const slugHint = r.linkToolSlugs[0] ?? r.keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48);
    out.push({
      title: r.suggestedToolAngle ?? `Extend tooling for “${r.keyword}”`,
      slugHint,
      rationale: `High CPC proxy (${r.cpcScore ?? 0}) with cluster ${r.clusterId ?? "n/a"}; validate spec before implementation.`,
      priority: r.priority,
      linkedTools: [...(r.linkToolSlugs ?? [])],
    });
  }
  return out;
}

export function buildBlogIdeaRows(rows: readonly PrioritizedOpportunity[], limit = 12): BlogIdeaRow[] {
  return rows.slice(0, limit).map((r) => ({
    title: r.suggestedBlogTitle ?? `Guide: ${r.keyword}`,
    keyword: r.keyword,
    rationale: `Priority ${r.priority}; funnel ${detectIntentStage(r.keyword, r.suggestedBlogTitle)}; monetization ${r.monetizationPotential ?? 0}.`,
  }));
}

export function buildOpportunityEngineSnapshot() {
  const pool = discoverKeywordOpportunities();
  const prioritized = prioritizeForPipeline(24);
  return {
    opportunityPoolSize: pool.length,
    prioritized,
    keywordIntel: buildKeywordIntel(prioritized),
    toolIdeas: buildToolIdeaRows(prioritized),
    blogIdeas: buildBlogIdeaRows(prioritized),
  };
}
