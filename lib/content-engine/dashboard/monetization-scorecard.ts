import type { PerformanceAggregates } from "../performance/types";
import { estimateRevenueImpact } from "./revenue-impact-estimator";
import { buildLowRpmDetection } from "./low-rpm-detection";
import { buildMonetizationGapEngine } from "./monetization-gap";
import { buildPageTypeClassification } from "./page-type-classifier";
import { buildAdPlacementEngine } from "./ad-placement-engine";

export type MonetizationScorecardAction = {
  rank: number;
  targetPage: string;
  exactFix: "rewrite" | "link" | "cta" | "ad_placement";
  expectedRevenueImpactUsd: number;
  confidence: "high" | "medium" | "low";
  ease: "easy" | "medium" | "hard";
  expectedOutcome: string;
  score: number;
};

export type MonetizationScorecard = {
  actions: MonetizationScorecardAction[];
  totalOpportunityUsd: number;
};

function easeFromFix(fix: MonetizationScorecardAction["exactFix"]): MonetizationScorecardAction["ease"] {
  return fix === "cta" || fix === "link" ? "easy" : fix === "ad_placement" ? "medium" : "hard";
}

export function buildMonetizationScorecard(
  performance: PerformanceAggregates | null,
  behavior: import("../growth/behavior-types").BehaviorAggregates | null,
  max = 10,
): MonetizationScorecard {
  const lowRpm = buildLowRpmDetection(performance, behavior, 30);
  const gaps = buildMonetizationGapEngine(performance, behavior, 30);
  const pageTypes = new Map(buildPageTypeClassification((performance?.pages ?? []).map((p) => p.path), 400).map((r) => [r.path, r]));
  const adPlans = new Map(
    buildAdPlacementEngine(
      buildPageTypeClassification((performance?.pages ?? []).map((p) => p.path), 400)
        .filter((p) => p.type === "decision" || p.type === "calculator")
        .slice(0, 100)
        .map((p) => ({ path: p.path, pageType: p.type })),
      100,
    ).map((p) => [p.path, p]),
  );
  const baseRevenue = (performance?.pageRevenue ?? []).reduce((n, r) => n + (r.earnings ?? 0), 0);
  const candidates: MonetizationScorecardAction[] = [];
  const allPaths = [...new Set([...lowRpm.map((r) => r.path), ...gaps.map((g) => g.path)])];

  for (const path of allPaths) {
    const l = lowRpm.find((x) => x.path === path);
    const g = gaps.find((x) => x.path === path);
    const t = pageTypes.get(path);
    const typeBoost = t ? t.monetizationPriority / 100 : 0.5;
    const gap = g?.gapScore ?? 0;
    const rpmPenalty = l ? Math.max(0, 12 - l.rpm) : 0;
    const traffic = g?.traffic ?? l?.impressions ?? 0;
    const baseScore = Math.min(100, Math.round(gap * 0.45 + rpmPenalty * 2.3 + Math.min(40, traffic / 120) + typeBoost * 10));

    const fixes: MonetizationScorecardAction["exactFix"][] = ["cta", "link", "rewrite"];
    if (adPlans.has(path)) fixes.push("ad_placement");
    for (const fix of fixes) {
      const liftPct = fix === "cta" ? 6 : fix === "link" ? 5 : fix === "ad_placement" ? 7 : 8;
      const impact = estimateRevenueImpact({
        baselineRevenue: Math.max(5, baseRevenue * Math.min(1, traffic / Math.max(1, (performance?.pages ?? []).reduce((n, p) => n + p.impressions, 0)))),
        liftPct,
        confidenceHint: fix === "cta" || fix === "ad_placement" ? 12 : 9,
      });
      const ease = easeFromFix(fix);
      const easeScore = ease === "easy" ? 10 : ease === "medium" ? 6 : 2;
      const score = Math.min(100, baseScore + easeScore + (impact.confidence === "high" ? 6 : impact.confidence === "medium" ? 3 : 0));
      const expectedOutcome =
        fix === "cta"
          ? "Higher tool clickthrough and improved conversion depth."
          : fix === "link"
            ? "More internal commercial flow into calculators and money pages."
            : fix === "ad_placement"
              ? "RPM lift from policy-safe high-intent ad positioning."
              : "Stronger intent match and monetized section performance.";
      candidates.push({
        rank: 0,
        targetPage: path,
        exactFix: fix,
        expectedRevenueImpactUsd: impact.expectedRevenueIncreaseUsd,
        confidence: impact.confidence,
        ease,
        expectedOutcome,
        score,
      });
    }
  }

  candidates.sort(
    (a, b) =>
      b.score - a.score ||
      b.expectedRevenueImpactUsd - a.expectedRevenueImpactUsd ||
      a.targetPage.localeCompare(b.targetPage),
  );
  const top = candidates.slice(0, max).map((a, i) => ({ ...a, rank: i + 1 }));
  return {
    actions: top,
    totalOpportunityUsd: Number(top.reduce((n, a) => n + a.expectedRevenueImpactUsd, 0).toFixed(2)),
  };
}

