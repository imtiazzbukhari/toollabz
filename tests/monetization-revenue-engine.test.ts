import { describe, expect, it } from "vitest";
import { computeCpcProxyScore, computeMonetizationPotential } from "../lib/content-engine/monetization/cpc-scoring";
import { lowValueKeywordPenalty } from "../lib/content-engine/monetization/low-value";
import { applyRevenueEngagementLayer } from "../lib/content-engine/monetization/revenue-merge";
import type { PrioritizedOpportunity } from "../lib/content-engine/types";

describe("revenue engine / CPC proxy", () => {
  it("scores finance and loan intents higher than generic utilities", () => {
    const high = computeCpcProxyScore("mortgage refinance break even");
    const mid = computeCpcProxyScore("marketing roi and cac");
    const low = computeCpcProxyScore("cm to feet converter");
    expect(high).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(low);
  });

  it("blends tool slugs into monetization potential", () => {
    const mp = computeMonetizationPotential("loan payment monthly estimate", ["loan-calculator"]);
    expect(mp).toBeGreaterThanOrEqual(35);
  });
});

describe("revenue engine / low-value penalty", () => {
  it("penalizes obvious low-CPC utility patterns", () => {
    expect(lowValueKeywordPenalty("case converter online", "tool:case-converter")).toBeGreaterThan(0);
    expect(lowValueKeywordPenalty("mortgage payment with escrow and taxes", "")).toBe(0);
  });
});

describe("revenue engine / engagement layer", () => {
  it("applies low-value penalty without aggregates", () => {
    const rows: PrioritizedOpportunity[] = [
      {
        keyword: "word counter",
        intent: "transactional",
        priority: 70,
        linkToolSlugs: ["word-counter"],
        opportunitySources: ["tool:word-counter"],
      },
    ];
    const out = applyRevenueEngagementLayer(rows, null);
    expect(out[0]!.priority).toBeLessThan(70);
  });
});
