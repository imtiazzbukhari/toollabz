import type { BehaviorAggregates } from "../growth/behavior-types";
import type { PerformanceAggregates } from "../performance/types";

export type PruningAction = "update" | "merge" | "de-prioritize" | "noindex";
export type PruningCandidate = {
  path: string;
  action: PruningAction;
  reasons: string[];
  priority: number;
};

function behaviorForPath(behavior: BehaviorAggregates | null, path: string) {
  return behavior?.byPath[path];
}

export function buildContentPruningQueue(
  performance: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
  max = 20,
): PruningCandidate[] {
  const revenueByPath = new Map((performance?.pageRevenue ?? []).map((r) => [r.path, r]));
  const out: PruningCandidate[] = [];

  for (const p of performance?.pages ?? []) {
    if (!p.path.startsWith("/blog/") && !p.path.startsWith("/tools/")) continue;
    const rev = revenueByPath.get(p.path);
    const b = behaviorForPath(behavior, p.path);
    const reasons: string[] = [];

    if (p.impressions >= 900 && p.clicks <= 6) reasons.push("Low clicks despite meaningful impression exposure.");
    if (p.impressions >= 1800) {
      const ctr = p.clicks / Math.max(1, p.impressions);
      if (ctr < 0.012) reasons.push(`High impressions with low CTR (${(ctr * 100).toFixed(2)}%).`);
    }
    if (rev && rev.rpm < 6) reasons.push(`Low RPM (${rev.rpm.toFixed(2)}).`);
    if (b && b.sampleCount >= 8) {
      if (b.avgMaxScroll < 0.32) reasons.push("Low scroll depth.");
      const exits = Object.values(b.exitBySection).reduce((n, v) => n + v, 0);
      if (exits >= Math.max(3, b.sampleCount * 0.25)) reasons.push("High exit concentration.");
    }
    if (reasons.length === 0) continue;

    let action: PruningAction = "update";
    if (reasons.length >= 3 && p.clicks <= 3) action = "de-prioritize";
    if (reasons.some((r) => r.includes("low CTR")) && p.path.startsWith("/blog/")) action = "merge";
    if (reasons.length >= 4 && (rev?.rpm ?? 0) < 4 && p.clicks <= 2) action = "noindex";

    const priority = Math.min(100, reasons.length * 18 + Math.min(28, p.impressions / 140));
    out.push({ path: p.path, action, reasons, priority });
  }

  out.sort((a, b) => b.priority - a.priority || a.path.localeCompare(b.path));
  return out.slice(0, max);
}

