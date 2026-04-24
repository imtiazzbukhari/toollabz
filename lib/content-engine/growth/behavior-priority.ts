import type { PrioritizedOpportunity } from "../types";
import type { BehaviorAggregates } from "./behavior-types";

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

/**
 * Nudge priorities using first-party behavior: reward topics aligned with strong pages,
 * lightly penalize overlap with very shallow-engagement URLs.
 */
export function applyBehaviorSignalsToPrioritized(
  rows: readonly PrioritizedOpportunity[],
  behavior: BehaviorAggregates | null,
): PrioritizedOpportunity[] {
  if (!behavior?.byPath || Object.keys(behavior.byPath).length === 0) return [...rows];

  const strong: Set<string>[] = [];
  const weak: Set<string>[] = [];

  for (const r of Object.values(behavior.byPath)) {
    if (r.sampleCount < 12) continue;
    const slug = r.path.replace(/^\//, "").replace(/\//g, " ");
    const tokens = tokenizeForOverlap(slug);
    if (r.avgMaxScroll >= 0.55 && r.avgActiveMs >= 25_000) strong.push(tokens);
    if (r.avgMaxScroll < 0.22) weak.push(tokens);
  }

  if (strong.length === 0 && weak.length === 0) return [...rows];

  return rows.map((row) => {
    const kw = tokenizeForOverlap(row.keyword);
    let add = 0;
    let sub = 0;
    for (const bag of strong) {
      const o = overlapScore(kw, bag);
      if (o > 0) add += Math.min(8, o * 2);
    }
    for (const bag of weak) {
      const o = overlapScore(kw, bag);
      if (o > 0) sub += Math.min(5, o * 2);
    }
    if (add === 0 && sub === 0) return row;
    return {
      ...row,
      priority: Math.min(100, Math.max(5, row.priority + add - sub)),
      engagementBoost: add > 0 ? (row.engagementBoost ?? 0) + add : row.engagementBoost,
    };
  });
}
