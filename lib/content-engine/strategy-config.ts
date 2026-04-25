export type GrowthStrategyMode = "conservative" | "balanced" | "aggressive";

export type GrowthStrategyConfig = {
  mode: GrowthStrategyMode;
  maxPostsPerDay: number;
  maxOutreachPerCycle: number;
  seoOptimizationLimit: number;
  monetizationLimit: number;
  qualityThreshold: number;
  randomnessFactor: number;
  skipProbability: number;
  roiBoostMultiplier: number;
  winnerBoostIntensity: number;
  behaviorSummary: string;
};

const HARD_CAPS = {
  maxPostsPerDay: 2,
  maxOutreachPerCycle: 2,
  seoOptimizationLimit: 3,
  monetizationLimit: 2,
} as const;

function asMode(input: string | undefined): GrowthStrategyMode {
  const value = (input ?? "").trim().toLowerCase();
  if (value === "conservative" || value === "balanced" || value === "aggressive") return value;
  return "balanced";
}

export function getGrowthStrategyConfig(): GrowthStrategyConfig {
  const mode = asMode(process.env.GROWTH_STRATEGY_MODE);

  if (mode === "conservative") {
    return {
      mode,
      maxPostsPerDay: 1,
      maxOutreachPerCycle: 1,
      seoOptimizationLimit: 1,
      monetizationLimit: 1,
      qualityThreshold: 72,
      randomnessFactor: 0.7,
      skipProbability: 0.2,
      roiBoostMultiplier: 0.9,
      winnerBoostIntensity: 1,
      behaviorSummary: "low activity, quality-first, minimal automation",
    };
  }

  if (mode === "aggressive") {
    return {
      mode,
      maxPostsPerDay: HARD_CAPS.maxPostsPerDay,
      maxOutreachPerCycle: HARD_CAPS.maxOutreachPerCycle,
      seoOptimizationLimit: HARD_CAPS.seoOptimizationLimit,
      monetizationLimit: HARD_CAPS.monetizationLimit,
      qualityThreshold: 56,
      randomnessFactor: 1.25,
      skipProbability: 0.06,
      roiBoostMultiplier: 1.35,
      winnerBoostIntensity: 3,
      behaviorSummary: "high activity, winner-focused, controlled automation",
    };
  }

  return {
    mode: "balanced",
    maxPostsPerDay: 2,
    maxOutreachPerCycle: 1,
    seoOptimizationLimit: 2,
    monetizationLimit: 2,
    qualityThreshold: 62,
    randomnessFactor: 1,
    skipProbability: 0.12,
    roiBoostMultiplier: 1,
    winnerBoostIntensity: 2,
    behaviorSummary: "medium activity with balanced quality and ROI",
  };
}

export function enforceHardCaps(config: GrowthStrategyConfig): GrowthStrategyConfig {
  return {
    ...config,
    maxPostsPerDay: Math.min(config.maxPostsPerDay, HARD_CAPS.maxPostsPerDay),
    maxOutreachPerCycle: Math.min(config.maxOutreachPerCycle, HARD_CAPS.maxOutreachPerCycle),
    seoOptimizationLimit: Math.min(config.seoOptimizationLimit, HARD_CAPS.seoOptimizationLimit),
    monetizationLimit: Math.min(config.monetizationLimit, HARD_CAPS.monetizationLimit),
  };
}

