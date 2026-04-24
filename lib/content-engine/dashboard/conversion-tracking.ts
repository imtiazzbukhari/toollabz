import type { BehaviorAggregates } from "../growth/behavior-types";

export type ConversionPageRow = {
  path: string;
  samples: number;
  toolClickRate: number;
  conversionRate: number;
  interactionDepth: number;
  score: number;
};

export type ConversionTrackingSnapshot = {
  pages: ConversionPageRow[];
  highConvertingPages: ConversionPageRow[];
};

export function buildConversionTrackingSnapshot(behavior: BehaviorAggregates | null, max = 25): ConversionTrackingSnapshot {
  const pages: ConversionPageRow[] = [];
  for (const row of Object.values(behavior?.byPath ?? {})) {
    if (row.sampleCount < 5) continue;
    const toolClickRate = row.toolClickCount / row.sampleCount;
    const conversionRate = row.conversionEventCount / row.sampleCount;
    const interactionDepth = row.avgMaxScroll * 0.55 + Math.min(1, row.avgActiveMs / 90_000) * 0.45;
    const score = Math.min(100, Math.round(conversionRate * 65 + toolClickRate * 25 + interactionDepth * 20));
    pages.push({
      path: row.path,
      samples: row.sampleCount,
      toolClickRate,
      conversionRate,
      interactionDepth,
      score,
    });
  }
  pages.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
  return {
    pages: pages.slice(0, max),
    highConvertingPages: pages.filter((p) => p.conversionRate >= 0.08 || p.score >= 60).slice(0, 10),
  };
}

