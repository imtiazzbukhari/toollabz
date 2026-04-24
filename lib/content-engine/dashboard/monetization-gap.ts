import type { BehaviorAggregates } from "../growth/behavior-types";
import type { PerformanceAggregates } from "../performance/types";
import { buildPageTypeClassification } from "./page-type-classifier";

export type MonetizationGapRow = {
  path: string;
  traffic: number;
  rpm: number;
  pageType: "informational" | "comparison" | "decision" | "calculator";
  gapScore: number;
  suggestions: string[];
};

export function buildMonetizationGapEngine(
  performance: PerformanceAggregates | null,
  behavior: BehaviorAggregates | null,
  max = 20,
): MonetizationGapRow[] {
  const revByPath = new Map((performance?.pageRevenue ?? []).map((r) => [r.path, r]));
  const types = new Map(buildPageTypeClassification((performance?.pages ?? []).map((p) => p.path), 400).map((r) => [r.path, r.type]));
  const out: MonetizationGapRow[] = [];
  for (const p of performance?.pages ?? []) {
    const traffic = p.impressions;
    if (traffic < 1500) continue;
    const rpm = revByPath.get(p.path)?.rpm ?? 0;
    if (rpm >= 10) continue;
    const type = (types.get(p.path) ?? "informational") as MonetizationGapRow["pageType"];
    const b = behavior?.byPath[p.path];
    const gapScore = Math.min(100, Math.round(traffic / 80 + Math.max(0, 12 - rpm) * 4 + (b && b.avgMaxScroll < 0.4 ? 10 : 0)));
    const suggestions = [
      "Add one clear CTA block after intro and one before final section.",
      "Improve content structure with section-level outcomes and worked example.",
      "Link at least two relevant calculators with intent-matching anchors.",
    ];
    out.push({ path: p.path, traffic, rpm, pageType: type, gapScore, suggestions });
  }
  out.sort((a, b) => b.gapScore - a.gapScore || a.path.localeCompare(b.path));
  return out.slice(0, max);
}

