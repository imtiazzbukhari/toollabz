import type { BehaviorAggregates } from "../growth/behavior-types";
import type { PerformanceAggregates } from "../performance/types";

export type RevenueFunnelStage = {
  stage: "visits" | "tool_usage" | "conversion_events" | "revenue_pages";
  volume: number;
  conversionFromPrevious: number | null;
};

export type RevenueFunnelSnapshot = {
  stages: RevenueFunnelStage[];
  dropOffPoints: Array<{ from: string; to: string; dropPct: number; note: string }>;
};

export function buildRevenueFunnelSnapshot(
  performance: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
): RevenueFunnelSnapshot {
  const visits = (performance?.pages ?? []).reduce((n, p) => n + p.impressions, 0);
  const toolUsage = Object.values(behavior?.byPath ?? {}).reduce((n, r) => n + r.toolClickCount, 0);
  const conversionEvents = Object.values(behavior?.byPath ?? {}).reduce((n, r) => n + r.conversionEventCount, 0);
  const revenuePages = (performance?.pageRevenue ?? []).filter((r) => (r.earnings ?? 0) > 0 || r.rpm > 0).length;

  const vals = [visits, toolUsage, conversionEvents, revenuePages];
  const names: RevenueFunnelStage["stage"][] = ["visits", "tool_usage", "conversion_events", "revenue_pages"];
  const stages: RevenueFunnelStage[] = vals.map((v, i) => ({
    stage: names[i]!,
    volume: v,
    conversionFromPrevious: i === 0 ? null : (vals[i - 1]! > 0 ? v / vals[i - 1]! : null),
  }));

  const dropOffPoints: RevenueFunnelSnapshot["dropOffPoints"] = [];
  for (let i = 1; i < stages.length; i++) {
    const prev = stages[i - 1]!;
    const cur = stages[i]!;
    if (prev.volume <= 0) continue;
    const dropPct = Math.max(0, (1 - cur.volume / prev.volume) * 100);
    if (dropPct >= 25) {
      dropOffPoints.push({
        from: prev.stage,
        to: cur.stage,
        dropPct: Number(dropPct.toFixed(2)),
        note:
          cur.stage === "tool_usage"
            ? "Low tool uptake: strengthen above-the-fold tool CTA and intent match."
            : cur.stage === "conversion_events"
              ? "Low conversion events after tool usage: improve interaction flow and friction points."
              : "Revenue not realized: improve monetization placement and high-intent pathing.",
      });
    }
  }

  return { stages, dropOffPoints };
}

