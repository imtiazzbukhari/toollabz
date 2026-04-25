export type DecisionInputRow = {
  slug: string;
  position: number;
  trend: "up" | "down" | "stagnant";
  impressions?: number;
  clicks?: number;
  revenue?: number;
  roiScore?: number;
  niche?: string;
};

export type DecisionRisk = {
  type: "over_optimization" | "activity_spike" | "declining_performance";
  severity: "low" | "medium" | "high";
  message: string;
};

export type DecisionInsight = {
  focusReason: string;
  focusedSlugs: string[];
  ignoredSlugs: string[];
  riskWarnings: DecisionRisk[];
  nicheValidation: {
    niche: string;
    growthValid: boolean;
    revenueValid: boolean;
    competitionValid: boolean;
    summary: string;
  };
  strategyOverride?: {
    nicheFocus?: string;
    roiWeightMultiplier?: number;
    modeOverride?: "conservative" | "balanced" | "aggressive";
    reason: string;
  };
};

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function analyzeDecisionIntelligence(input: {
  rows: DecisionInputRow[];
  currentNiche: string;
  currentMode: "conservative" | "balanced" | "aggressive";
  recentOptimizations: number;
  recentPosts: number;
  recentOutreach: number;
}): DecisionInsight {
  const stableRows = input.rows.filter((r) => (r.impressions ?? 0) >= 25 && Math.abs((r.clicks ?? 0)) >= 2);
  const ignoredSlugs = input.rows.filter((r) => !stableRows.includes(r) || (r.roiScore ?? 0) < 5).map((r) => r.slug);
  const focused = stableRows
    .filter((r) => (r.roiScore ?? 0) >= 12 || (r.revenue ?? 0) >= 8 || r.trend === "up")
    .sort((a, b) => (b.roiScore ?? 0) - (a.roiScore ?? 0))
    .slice(0, 10);
  const focusedSlugs = focused.map((r) => r.slug);

  const byNiche = new Map<string, DecisionInputRow[]>();
  for (const row of stableRows) {
    const niche = row.niche || row.slug.split("-")[0] || "general";
    byNiche.set(niche, [...(byNiche.get(niche) ?? []), row]);
  }
  let bestNiche = input.currentNiche || "general";
  let bestScore = -1;
  for (const [niche, rows] of byNiche.entries()) {
    const growth = avg(rows.map((r) => (r.trend === "up" ? 1 : r.trend === "down" ? -1 : 0)));
    const revenue = avg(rows.map((r) => r.revenue ?? 0));
    const competition = avg(rows.map((r) => r.position));
    const score = growth * 20 + revenue * 2 + (100 - competition);
    if (score > bestScore) {
      bestScore = score;
      bestNiche = niche;
    }
  }

  const nicheRows = byNiche.get(bestNiche) ?? [];
  const growthValid = avg(nicheRows.map((r) => (r.trend === "up" ? 1 : r.trend === "down" ? -1 : 0))) >= 0;
  const revenueValid = avg(nicheRows.map((r) => r.revenue ?? 0)) >= 6;
  const competitionValid = avg(nicheRows.map((r) => r.position)) <= 35;

  const riskWarnings: DecisionRisk[] = [];
  if (input.recentOptimizations >= 3) {
    riskWarnings.push({ type: "over_optimization", severity: "medium", message: "High optimization volume may reduce content naturalness." });
  }
  if (input.recentPosts >= 2 || input.recentOutreach >= 2) {
    riskWarnings.push({ type: "activity_spike", severity: "medium", message: "External activity near cap; keep cadence stable." });
  }
  const declineRatio =
    stableRows.length > 0 ? stableRows.filter((r) => r.trend === "down").length / stableRows.length : 0;
  if (declineRatio > 0.45) {
    riskWarnings.push({ type: "declining_performance", severity: "high", message: "Large share of stable pages are declining." });
  }

  let strategyOverride: DecisionInsight["strategyOverride"] | undefined;
  if ((!growthValid || !revenueValid) && input.currentMode === "aggressive") {
    strategyOverride = {
      modeOverride: "balanced",
      nicheFocus: bestNiche,
      roiWeightMultiplier: 1.05,
      reason: "Aggressive mode reduced due to weak validated niche signal.",
    };
  } else if (growthValid && revenueValid && competitionValid && input.currentMode !== "aggressive") {
    strategyOverride = {
      modeOverride: "aggressive",
      nicheFocus: bestNiche,
      roiWeightMultiplier: 1.2,
      reason: "Validated niche has healthy growth/revenue/competition profile.",
    };
  }

  return {
    focusReason: focused.length ? "Consistent high-ROI performers prioritized." : "Insufficient stable signals; hold broad focus.",
    focusedSlugs,
    ignoredSlugs: [...new Set(ignoredSlugs)].slice(0, 40),
    riskWarnings,
    nicheValidation: {
      niche: bestNiche,
      growthValid,
      revenueValid,
      competitionValid,
      summary: `growth=${growthValid} revenue=${revenueValid} competition=${competitionValid}`,
    },
    strategyOverride,
  };
}

