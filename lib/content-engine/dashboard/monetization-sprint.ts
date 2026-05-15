import type { MonetizationScorecard, MonetizationScorecardAction } from "./monetization-scorecard";

export type SprintAction = MonetizationScorecardAction & {
  order: number;
  estimatedHours: number;
  prChecklist: {
    contentChanges: string[];
    linkingUpdates: string[];
    ctaUpdates: string[];
    adPlacement: string[];
  };
};

export type MonetizationSprintPlan = {
  weekOf: string;
  topActions: SprintAction[];
  orderedSteps: string[];
  weeklyExecutionSummary: {
    estimatedHours: number;
    expectedRevenueGainUsd: number;
  };
};

function estimateHours(action: MonetizationScorecardAction): number {
  const easeBase = action.ease === "easy" ? 1.5 : action.ease === "medium" ? 3 : 5;
  const fixWeight = action.exactFix === "rewrite" ? 2 : action.exactFix === "ad_placement" ? 1.4 : 1;
  return Number((easeBase * fixWeight).toFixed(1));
}

function checklistFor(action: MonetizationScorecardAction): SprintAction["prChecklist"] {
  const common = {
    contentChanges: ["Update opening section to reinforce monetized user intent."],
    linkingUpdates: ["Add/validate at least 2 internal links to relevant high-value tools."],
    ctaUpdates: ["Add one primary CTA near intro and one near decision section."],
    adPlacement: ["Validate policy-safe ad spacing and no accidental-click layout."],
  };
  if (action.exactFix === "rewrite") {
    common.contentChanges.push("Rewrite one weak section with concrete example and outcome.");
  } else if (action.exactFix === "link") {
    common.linkingUpdates.push("Improve anchor relevance and contextual placement.");
  } else if (action.exactFix === "cta") {
    common.ctaUpdates.push("A/B test CTA copy and placement in first screen and before FAQ.");
  } else if (action.exactFix === "ad_placement") {
    common.adPlacement.push("Apply placements: after intro, mid-content, before CTA/FAQ boundary.");
  }
  return common;
}

export function buildMonetizationSprintPlan(scorecard: MonetizationScorecard): MonetizationSprintPlan {
  const top = [...scorecard.actions]
    .sort((a, b) => {
      const conf = { high: 3, medium: 2, low: 1 } as const;
      const ease = { easy: 3, medium: 2, hard: 1 } as const;
      const aRank = a.expectedRevenueImpactUsd * 100 + conf[a.confidence] * 8 + ease[a.ease] * 4;
      const bRank = b.expectedRevenueImpactUsd * 100 + conf[b.confidence] * 8 + ease[b.ease] * 4;
      return bRank - aRank;
    })
    .slice(0, 3)
    .map((a, i) => ({
      ...a,
      order: i + 1,
      estimatedHours: estimateHours(a),
      prChecklist: checklistFor(a),
    }));

  const orderedSteps = top.map(
    (a) => `#${a.order}: ${a.targetPage}: ${a.exactFix} (${a.estimatedHours}h, +$${a.expectedRevenueImpactUsd.toFixed(2)}).`,
  );
  const estimatedHours = Number(top.reduce((n, a) => n + a.estimatedHours, 0).toFixed(1));
  const expectedRevenueGainUsd = Number(top.reduce((n, a) => n + a.expectedRevenueImpactUsd, 0).toFixed(2));

  return {
    weekOf: new Date().toISOString().slice(0, 10),
    topActions: top,
    orderedSteps,
    weeklyExecutionSummary: { estimatedHours, expectedRevenueGainUsd },
  };
}

