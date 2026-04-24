import type { BehaviorAggregates } from "../growth/behavior-types";
import type { PerformanceAggregates } from "../performance/types";
import type { PrioritizedOpportunity } from "../types";
import { clusterIdForPath } from "./cluster-utils";

export type ExecutionPriorityRow = {
  item: string;
  kind: "build_next" | "fix_next";
  clusterId?: string;
  score: number;
  rationale: string;
};

export function buildSmartExecutionPriority(input: {
  opportunities: readonly PrioritizedOpportunity[];
  performance: PerformanceAggregates | null;
  behavior: BehaviorAggregates | null;
  max?: number;
}): ExecutionPriorityRow[] {
  const revenueByPath = new Map((input.performance?.pageRevenue ?? []).map((r) => [r.path, r]));
  const rows: ExecutionPriorityRow[] = [];

  for (const o of input.opportunities.slice(0, 20)) {
    const score = Math.min(100, Math.round(o.priority + (o.rpmBoost ?? 0) + (o.monetizationPotential ?? 0) * 0.08));
    rows.push({
      item: o.keyword,
      kind: "build_next",
      clusterId: o.clusterId,
      score,
      rationale: `Opportunity priority ${o.priority} with monetization ${o.monetizationPotential ?? 0}.`,
    });
  }

  for (const p of input.performance?.pages ?? []) {
    const ctr = p.clicks / Math.max(1, p.impressions);
    if (p.impressions < 900 || ctr >= 0.018) continue;
    const b = input.behavior?.byPath[p.path];
    const rev = revenueByPath.get(p.path);
    const behaviorPenalty = b ? (b.avgMaxScroll < 0.35 ? 12 : 0) + (b.avgActiveMs < 10_000 ? 8 : 0) : 0;
    const revWeight = rev ? Math.min(24, rev.rpm * 1.2) : 0;
    const score = Math.min(100, Math.round((0.02 - ctr) * 1800 + p.impressions / 180 + behaviorPenalty + revWeight));
    rows.push({
      item: p.path,
      kind: "fix_next",
      clusterId: clusterIdForPath(p.path) ?? undefined,
      score,
      rationale: `CTR ${(ctr * 100).toFixed(2)}%, impressions ${p.impressions}, RPM ${rev?.rpm.toFixed(2) ?? "n/a"}.`,
    });
  }

  rows.sort((a, b) => b.score - a.score || a.item.localeCompare(b.item));
  return rows.slice(0, input.max ?? 20);
}

