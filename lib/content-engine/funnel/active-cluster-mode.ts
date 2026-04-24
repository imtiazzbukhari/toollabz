import type { PrioritizedOpportunity } from "../types";

export type ActiveClusterModeSummary = {
  enabled: boolean;
  selected: string[];
  beforeCount: number;
  afterCount: number;
};

/**
 * When active cluster mode is enabled, keep only rows mapped to selected clusters.
 * This is intentionally strict to force output concentration during domination sprints.
 */
export function applyActiveClusterMode(
  rows: readonly PrioritizedOpportunity[],
  selectedClusterIds: readonly string[],
): { rows: PrioritizedOpportunity[]; summary: ActiveClusterModeSummary } {
  const selected = [...new Set(selectedClusterIds.map((s) => s.trim()).filter(Boolean))];
  if (selected.length === 0) {
    return {
      rows: [...rows],
      summary: { enabled: false, selected: [], beforeCount: rows.length, afterCount: rows.length },
    };
  }
  const allow = new Set(selected);
  const filtered = rows.filter((r) => r.clusterId && allow.has(r.clusterId));
  return {
    rows: filtered,
    summary: {
      enabled: true,
      selected,
      beforeCount: rows.length,
      afterCount: filtered.length,
    },
  };
}
