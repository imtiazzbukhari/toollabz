import type { PerformanceAggregates } from "../performance/types";

export type LossPreventionRow = {
  path: string;
  clickDeltaPct: number;
  actions: string[];
};

export function buildLossPreventionQueue(performance: PerformanceAggregates | null, max = 12): LossPreventionRow[] {
  const prevByPath = new Map((performance?.pagesPrevious ?? []).map((p) => [p.path, p]));
  const out: LossPreventionRow[] = [];
  for (const p of performance?.pages ?? []) {
    const prev = prevByPath.get(p.path);
    if (!prev || prev.clicks < 8) continue;
    const delta = ((p.clicks - prev.clicks) / Math.max(1, prev.clicks)) * 100;
    if (delta > -12) continue;
    const ctr = p.clicks / Math.max(1, p.impressions);
    const actions = [
      "Refresh intro + tighten H1/H2 promise to match query intent.",
      "Test new title/meta via CTR queue before body rewrite.",
      "Rebuild internal links from authority pages in same cluster.",
    ];
    if (ctr < 0.018) actions.unshift("Prioritize SERP snippet rewrite first (CTR deficit).");
    out.push({ path: p.path, clickDeltaPct: delta, actions });
  }
  out.sort((a, b) => a.clickDeltaPct - b.clickDeltaPct || a.path.localeCompare(b.path));
  return out.slice(0, max);
}

