import type { BehaviorAggregates } from "../growth/behavior-types";
import type { PerformanceAggregates } from "../performance/types";
import { buildPageTypeClassification } from "./page-type-classifier";

export type LowRpmRow = {
  path: string;
  impressions: number;
  rpm: number;
  pageType: "informational" | "comparison" | "decision" | "calculator";
  suggestions: string[];
};

export function buildLowRpmDetection(
  performance: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
  max = 20,
): LowRpmRow[] {
  const revByPath = new Map((performance?.pageRevenue ?? []).map((r) => [r.path, r]));
  const pageTypes = new Map(buildPageTypeClassification((performance?.pages ?? []).map((p) => p.path), 400).map((r) => [r.path, r.type]));
  const out: LowRpmRow[] = [];
  for (const p of performance?.pages ?? []) {
    const rev = revByPath.get(p.path);
    const rpm = rev?.rpm ?? 0;
    if (p.impressions < 1200 || rpm >= 8) continue;
    const type = (pageTypes.get(p.path) ?? "informational") as LowRpmRow["pageType"];
    const b = behavior?.byPath[p.path];
    const suggestions = [
      "Improve first-screen value proof + one clear monetized next step.",
      type === "informational" ? "Shift intent toward decision by adding practical tool-led section." : "Strengthen decision CTA and scenario examples.",
      "Add contextual internal links to high-RPM calculators in same cluster.",
    ];
    if (b && b.avgMaxScroll < 0.35) suggestions.unshift("Tighten intro and add quick summary to improve depth before ad slots.");
    out.push({ path: p.path, impressions: p.impressions, rpm, pageType: type, suggestions });
  }
  out.sort((a, b) => b.impressions - a.impressions || a.rpm - b.rpm);
  return out.slice(0, max);
}

