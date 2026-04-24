import type { SmartDecisionAction } from "./smart-decision-actions";
import type { PerformanceTrigger } from "./performance-triggers";
import type { ToolRoiRow } from "./tool-roi";

export type DailyPriorityAction = {
  rank: number;
  id: string;
  title: string;
  rationale: string;
  score: number;
};

/**
 * TOP 5 daily actions: merges smart decisions, performance triggers, and tool ROI signals.
 */
export function buildDailyPriorityActions(input: {
  smart: readonly SmartDecisionAction[];
  triggers: readonly PerformanceTrigger[];
  toolRoi: readonly ToolRoiRow[];
}): DailyPriorityAction[] {
  const pool: DailyPriorityAction[] = [];

  for (const s of input.smart.slice(0, 8)) {
    pool.push({
      rank: 0,
      id: s.id,
      title: s.title,
      rationale: `Revenue-weighted (${s.expectedRevenueGainUsd.toFixed(0)} USD est.) + confidence ${Math.round(s.confidence * 100)}%.`,
      score: s.expectedRevenueGainUsd * 0.45 + s.expectedTrafficGainPct * 8 + s.confidence * 40,
    });
  }

  for (const t of input.triggers.slice(0, 6)) {
    pool.push({
      rank: 0,
      id: t.id,
      title: `${t.rule}: ${t.path}`,
      rationale: t.message,
      score: t.priority + 12,
    });
  }

  for (const r of input.toolRoi.slice(0, 4)) {
    pool.push({
      rank: 0,
      id: `roi-${r.slug}`,
      title: `Scale high-ROI tool: ${r.slug}`,
      rationale: r.scalingSuggestion,
      score: r.roiScore * 1.1,
    });
  }

  const sorted = [...pool].sort((a, b) => b.score - a.score);
  return sorted.slice(0, 5).map((a, i) => ({ ...a, rank: i + 1 }));
}
