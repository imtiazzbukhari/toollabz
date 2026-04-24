import type { PerformanceAggregates } from "../performance/types";

export type PerformanceTrigger = {
  id: string;
  path: string;
  rule: "high_impr_low_ctr" | "high_traffic_low_rpm";
  message: string;
  suggestion: string;
  priority: number;
};

function ctr(clicks: number, impressions: number): number {
  return impressions > 0 ? clicks / impressions : 0;
}

/**
 * Rule-based triggers from GSC + optional RPM join (performance-driven, no auto-apply).
 */
export function buildPerformanceTriggers(performance: PerformanceAggregates | null, max = 16): PerformanceTrigger[] {
  const pages = performance?.pages ?? [];
  const rev = new Map((performance?.pageRevenue ?? []).map((r) => [r.path, r]));
  const out: PerformanceTrigger[] = [];

  for (const p of pages) {
    const c = ctr(p.clicks, p.impressions);
    if (p.impressions >= 1200 && c < 0.018) {
      out.push({
        id: `tr-ctr-${p.path}`,
        path: p.path,
        rule: "high_impr_low_ctr",
        message: `High impressions (${p.impressions}) with low CTR (${(c * 100).toFixed(2)}%).`,
        suggestion: "Rewrite title + meta for clearer intent match; validate SERP snippet in GSC.",
        priority: Math.min(100, Math.round(p.impressions / 80 + (0.02 - c) * 4000)),
      });
    }
    const rpm = rev.get(p.path)?.rpm ?? 0;
    if (p.clicks >= 40 && rpm > 0 && rpm < 5 && p.impressions >= 800) {
      out.push({
        id: `tr-rpm-${p.path}`,
        path: p.path,
        rule: "high_traffic_low_rpm",
        message: `Solid traffic (${p.clicks} clicks) but RPM is weak ($${rpm.toFixed(2)}).`,
        suggestion: "Add monetization-safe CTA blocks and link to high-intent calculators in-cluster.",
        priority: Math.min(100, Math.round(p.clicks * 1.2 + (6 - rpm) * 8)),
      });
    }
  }

  return out.sort((a, b) => b.priority - a.priority).slice(0, max);
}
