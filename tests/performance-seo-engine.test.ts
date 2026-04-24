import { describe, expect, it } from "vitest";
import { prioritizeForPipeline } from "../lib/content-engine/opportunity-engine";
import { applyGscBoostToPrioritized } from "../lib/content-engine/performance/gsc-merge";
import { suggestDimensionWeightsFromOutcomes } from "../lib/content-engine/performance/suggest-weights";
import { loadQualityWeights, resetQualityWeightsCacheForTests } from "../lib/content-engine/performance/weights-loader";
import { pickVariationProfile, variationPromptFragment } from "../lib/content-engine/variation";
import { planClusterSupportingContent, TOPIC_CLUSTERS } from "../lib/content-engine/topic-clusters";

describe("performance SEO engine / GSC merge", () => {
  it("boosts keywords overlapping strong blog paths", () => {
    const rows = [
      {
        keyword: "estimate take home pay from gross",
        intent: "informational" as const,
        priority: 50,
        linkToolSlugs: [] as string[],
      },
    ];
    const out = applyGscBoostToPrioritized(rows, {
      updatedAt: "2026-01-01",
      pages: [{ path: "/blog/how-to-estimate-take-home-pay-from-gross-salary", clicks: 20, impressions: 2000 }],
    });
    expect(out[0]!.priority).toBeGreaterThanOrEqual(50);
    expect(out[0]!.performanceBoost).toBeDefined();
  });
});

describe("performance SEO engine / topic clusters", () => {
  it("defines clusters with pillar tools and supporting angles", () => {
    expect(TOPIC_CLUSTERS.length).toBeGreaterThanOrEqual(5);
    const planned = planClusterSupportingContent("take-home-pay", 5);
    expect(planned.length).toBeGreaterThanOrEqual(1);
  });
});

describe("performance SEO engine / variation", () => {
  it("is deterministic for the same seed", () => {
    expect(pickVariationProfile("seed-a")).toEqual(pickVariationProfile("seed-a"));
    expect(variationPromptFragment(pickVariationProfile("x"))).toContain("Tone:");
  });
});

describe("performance SEO engine / suggest weights", () => {
  it("returns normalized weights", () => {
    const { dimensions, rationale } = suggestDimensionWeightsFromOutcomes([
      { slug: "a", passedQuality: true, clicks: 1, impressions: 2000 },
      { slug: "b", passedQuality: false, clicks: 0, impressions: 100 },
    ]);
    const sum =
      dimensions.uniqueness +
      dimensions.readability +
      dimensions.depth +
      dimensions.seo +
      dimensions.usefulness +
      dimensions.humanization;
    expect(sum).toBeGreaterThan(0.99);
    expect(sum).toBeLessThanOrEqual(1.01);
    expect(rationale.length).toBeGreaterThan(0);
  });
});

describe("performance SEO engine / pipeline prioritize", () => {
  it("prioritizeForPipeline returns ranked rows", () => {
    const p = prioritizeForPipeline(8);
    expect(p.length).toBeGreaterThan(0);
    expect(p[0]!.keyword.length).toBeGreaterThan(1);
  });
});

describe("performance SEO engine / quality weights loader", () => {
  it("defaults when no weights file", () => {
    resetQualityWeightsCacheForTests();
    const w = loadQualityWeights();
    expect(w.depth).toBeGreaterThan(0);
  });
});
