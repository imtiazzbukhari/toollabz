import type { PrioritizedOpportunity } from "../types";
import { toolMap } from "@/lib/tools/data";

export type NextStepSuggestion = {
  keyword: string;
  stage: "awareness" | "comparison" | "decision";
  tryToolPath: string;
  comparePrompt: string;
  readPrompt: string;
};

function scoreToolMatch(keyword: string, tool: { slug: string; name: string; keywords: string[] }): number {
  const t = `${tool.name} ${tool.keywords.join(" ")}`.toLowerCase();
  const parts = keyword.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  let score = 0;
  for (const p of parts) {
    if (t.includes(p)) score += 1;
  }
  if (tool.slug.includes("calculator")) score += 0.3;
  return score;
}

function pickToolPath(keyword: string, fallbackSlugs: readonly string[]): string {
  const firstFallback = fallbackSlugs.find(Boolean);
  if (firstFallback) return `/tools/${firstFallback}`;
  let best: { slug: string; score: number } | null = null;
  for (const t of toolMap.values()) {
    const s = scoreToolMatch(keyword, t);
    if (!best || s > best.score) best = { slug: t.slug, score: s };
  }
  return best ? `/tools/${best.slug}` : "/tools";
}

export function buildConversionNextStepSuggestions(
  rows: readonly PrioritizedOpportunity[],
  max = 10,
): NextStepSuggestion[] {
  return rows.slice(0, max).map((r) => {
    const stage: NextStepSuggestion["stage"] =
      r.priority >= 78 || r.intent === "transactional" ? "decision" : r.intent === "mixed" ? "comparison" : "awareness";
    const tryToolPath = pickToolPath(r.keyword, r.linkToolSlugs);
    return {
      keyword: r.keyword,
      stage,
      tryToolPath,
      comparePrompt: `Compare two options for "${r.keyword}" using cost, risk, and time-to-result.`,
      readPrompt: `Read a deeper guide on "${r.keyword}" and list one action to take this week.`,
    };
  });
}
