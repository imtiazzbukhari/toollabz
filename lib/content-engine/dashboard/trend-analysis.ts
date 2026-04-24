import type { RevenueMemoryRecord } from "./revenue-memory";

type TrendDirection = "improving" | "declining" | "stable";

export type TrendSeriesRow = {
  key: string;
  values: number[];
  direction: TrendDirection;
  changePct: number;
  sparkline: string;
};

export type TrendAlert = {
  level: "info" | "warning";
  message: string;
};

export type TrendSnapshot = {
  windowWeeks: string[];
  revenueByCluster: TrendSeriesRow[];
  roiByFixType: TrendSeriesRow[];
  performanceByPageType: TrendSeriesRow[];
  summary: string[];
  alerts: TrendAlert[];
};

function weekBucket(dateIso: string): string {
  const d = new Date(dateIso);
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

function lastWeeks(max = 4): string[] {
  const out: string[] = [];
  const now = new Date();
  const day = (now.getUTCDay() + 6) % 7;
  now.setUTCDate(now.getUTCDate() - day);
  for (let i = max - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(now.getUTCDate() - i * 7);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function sparkline(values: readonly number[]): string {
  const bars = "▁▂▃▄▅▆▇█";
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) return "▁▁▁▁";
  return values
    .map((v) => {
      const idx = Math.max(0, Math.min(7, Math.round(((v - min) / (max - min)) * 7)));
      return bars[idx] ?? "▁";
    })
    .join("");
}

function trendDirection(values: readonly number[]): { direction: TrendDirection; changePct: number } {
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? 0;
  const pct = first > 0 ? ((last - first) / first) * 100 : last > 0 ? 100 : 0;
  const direction: TrendDirection = pct >= 12 ? "improving" : pct <= -12 ? "declining" : "stable";
  return { direction, changePct: Number(pct.toFixed(1)) };
}

function buildSeries(
  rows: readonly RevenueMemoryRecord[],
  weeks: readonly string[],
  keyFn: (r: RevenueMemoryRecord) => string,
  metricFn: (r: RevenueMemoryRecord) => number,
): TrendSeriesRow[] {
  const byKey = new Map<string, number[]>();
  for (const r of rows) {
    const wk = weekBucket(r.completedAt);
    const idx = weeks.indexOf(wk);
    if (idx < 0) continue;
    const key = keyFn(r);
    const arr = byKey.get(key) ?? new Array(weeks.length).fill(0);
    arr[idx] += metricFn(r);
    byKey.set(key, arr);
  }
  return [...byKey.entries()]
    .map(([key, values]) => {
      const { direction, changePct } = trendDirection(values);
      return { key, values: values.map((v) => Number(v.toFixed(2))), direction, changePct, sparkline: sparkline(values) };
    })
    .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct) || a.key.localeCompare(b.key));
}

export function buildTrendSnapshot(memory: readonly RevenueMemoryRecord[], maxRows = 8): TrendSnapshot {
  const weeks = lastWeeks(4);
  const revenueByCluster = buildSeries(memory, weeks, (r) => r.clusterId ?? "unclustered", (r) => r.actualRevenueImpactUsd).slice(0, maxRows);
  const roiByFixType = buildSeries(memory, weeks, (r) => r.fixType, (r) => r.roiRatio).slice(0, maxRows);
  const performanceByPageType = buildSeries(memory, weeks, (r) => r.pageType, (r) => r.actualRevenueImpactUsd).slice(0, maxRows);

  const alerts: TrendAlert[] = [];
  for (const r of revenueByCluster.filter((x) => x.direction === "improving").slice(0, 2)) {
    alerts.push({ level: "info", message: `${r.key} cluster rising (${r.changePct.toFixed(1)}%).` });
  }
  for (const r of roiByFixType.filter((x) => x.direction === "declining").slice(0, 2)) {
    alerts.push({ level: "warning", message: `${r.key.toUpperCase()} fixes declining (${r.changePct.toFixed(1)}%).` });
  }

  const summary = [
    `Tracking ${weeks.length} weeks of memory trends.`,
    `Clusters improving: ${revenueByCluster.filter((r) => r.direction === "improving").length}.`,
    `Fix types declining: ${roiByFixType.filter((r) => r.direction === "declining").length}.`,
  ];
  return {
    windowWeeks: weeks,
    revenueByCluster,
    roiByFixType,
    performanceByPageType,
    summary,
    alerts,
  };
}

