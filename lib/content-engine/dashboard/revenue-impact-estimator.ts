export type RevenueImpactEstimate = {
  expectedRevenueIncreaseUsd: number;
  confidence: "high" | "medium" | "low";
};

export function estimateRevenueImpact(input: {
  baselineRevenue: number;
  liftPct: number;
  confidenceHint?: number;
}): RevenueImpactEstimate {
  const expectedRevenueIncreaseUsd = Math.max(0, (input.baselineRevenue * Math.max(0, input.liftPct)) / 100);
  const h = input.confidenceHint ?? input.liftPct;
  const confidence: RevenueImpactEstimate["confidence"] = h >= 18 ? "high" : h >= 10 ? "medium" : "low";
  return {
    expectedRevenueIncreaseUsd: Number(expectedRevenueIncreaseUsd.toFixed(2)),
    confidence,
  };
}

