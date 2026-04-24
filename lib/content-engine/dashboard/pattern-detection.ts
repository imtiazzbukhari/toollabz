import type { RevenueMemoryRecord } from "./revenue-memory";

export type PatternRow = {
  key: string;
  sampleSize: number;
  avgActualLiftUsd: number;
  avgRoiRatio: number;
  performanceLabel: "high_roi" | "neutral" | "underperforming";
};

export type PatternSnapshot = {
  highRoiActionTypes: PatternRow[];
  highRoiPageTypes: PatternRow[];
  highRoiClusters: PatternRow[];
};

function groupRows(rows: readonly RevenueMemoryRecord[], keyFn: (r: RevenueMemoryRecord) => string): PatternRow[] {
  const m = new Map<string, RevenueMemoryRecord[]>();
  for (const r of rows) {
    const k = keyFn(r);
    const arr = m.get(k) ?? [];
    arr.push(r);
    m.set(k, arr);
  }
  const out: PatternRow[] = [];
  for (const [k, arr] of m) {
    const avgLift = arr.reduce((n, r) => n + r.actualRevenueImpactUsd, 0) / arr.length;
    const avgRoi = arr.reduce((n, r) => n + r.roiRatio, 0) / arr.length;
    const performanceLabel = avgRoi >= 1.15 ? "high_roi" : avgRoi >= 0.85 ? "neutral" : "underperforming";
    out.push({
      key: k,
      sampleSize: arr.length,
      avgActualLiftUsd: Number(avgLift.toFixed(2)),
      avgRoiRatio: Number(avgRoi.toFixed(3)),
      performanceLabel,
    });
  }
  out.sort((a, b) => b.avgRoiRatio - a.avgRoiRatio || b.avgActualLiftUsd - a.avgActualLiftUsd || a.key.localeCompare(b.key));
  return out;
}

export function buildPatternSnapshot(memory: readonly RevenueMemoryRecord[]): PatternSnapshot {
  return {
    highRoiActionTypes: groupRows(memory, (r) => r.fixType),
    highRoiPageTypes: groupRows(memory, (r) => r.pageType),
    highRoiClusters: groupRows(memory, (r) => r.clusterId ?? "unclustered"),
  };
}

