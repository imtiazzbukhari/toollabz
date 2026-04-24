import { describe, expect, it } from "vitest";
import { mergeBehaviorBeacons } from "../lib/content-engine/growth/merge-behavior-rollups";
import { suggestSerpVariantsForPage, buildCtrOptimizationQueue } from "../lib/content-engine/growth/ctr-suggestions";
import {
  expandProgrammaticQueriesForPath,
  buildProgrammaticExpansionQueue,
} from "../lib/content-engine/growth/programmatic-expand";
import { behaviorRollupToEngagementHints } from "../lib/content-engine/growth/engagement-feedback";
import { buildContentPerformanceLoopSnapshot } from "../lib/content-engine/growth/performance-content-loop";
import { applyPageRpmSignals, topPageRevenuePaths } from "../lib/content-engine/growth/revenue-priority";
import { pickHighConfidenceProgrammaticPicks } from "../lib/content-engine/growth/programmatic-confidence";
import { pickScalingBlogCandidate } from "../lib/content-engine/growth/expansion-scaling-pick";
import type { PrioritizedOpportunity } from "../lib/content-engine/types";

describe("growth-engine / behavior rollups", () => {
  it("mergeBehaviorBeacons averages scroll and time", () => {
    const d = "2026-04-24";
    const a = mergeBehaviorBeacons(
      null,
      [
        { path: "/tools/x", maxScroll: 0.5, activeMs: 10_000 },
        { path: "/tools/x", maxScroll: 1, activeMs: 20_000 },
      ],
      d,
    );
    const r = a.byPath["/tools/x"]!;
    expect(r.sampleCount).toBe(2);
    expect(r.avgMaxScroll).toBeCloseTo(0.75, 5);
    expect(r.avgActiveMs).toBe(15_000);
    expect(r.scrollHistogram.q50_75).toBeGreaterThanOrEqual(1);
  });
});

describe("growth-engine / CTR suggestions", () => {
  it("returns variants only for high-impression low-CTR pages", () => {
    expect(suggestSerpVariantsForPage({ path: "/blog/a", clicks: 1, impressions: 100, position: 10 })).toBeNull();
    const v = suggestSerpVariantsForPage({ path: "/blog/low-ctr-slug", clicks: 5, impressions: 2000, position: 8 });
    expect(v).not.toBeNull();
    expect(v!.length).toBe(3);
    const q = buildCtrOptimizationQueue(
      [
        { path: "/blog/x", clicks: 4, impressions: 2000, position: 9 },
        { path: "/other", clicks: 0, impressions: 5000, position: 5 },
      ],
      5,
    );
    expect(q.some((x) => x.path === "/blog/x")).toBe(true);
    expect(q.some((x) => x.path === "/other")).toBe(false);
  });
});

describe("growth-engine / programmatic expansion", () => {
  it("emits numeric and location ideas for strong loan pages", () => {
    const ideas = expandProgrammaticQueriesForPath({
      path: "/tools/loan-calculator",
      clicks: 30,
      impressions: 4000,
      position: 5,
    });
    expect(ideas.some((i) => i.kind === "numeric_principal")).toBe(true);
    expect(ideas.some((i) => i.kind === "location")).toBe(true);
  });

  it("buildProgrammaticExpansionQueue respects ordering", () => {
    const q = buildProgrammaticExpansionQueue(
      [
        { path: "/tools/weak", clicks: 1, impressions: 50, position: 20 },
        { path: "/tools/loan-calculator", clicks: 40, impressions: 5000, position: 4 },
      ],
      3,
    );
    expect(q.length).toBeGreaterThanOrEqual(1);
    expect(q[0]!.path).toContain("loan");
  });
});

describe("growth-engine / engagement feedback", () => {
  it("flags low scroll depth", () => {
    const hints = behaviorRollupToEngagementHints({
      path: "/tools/x",
      sampleCount: 20,
      avgMaxScroll: 0.2,
      avgActiveMs: 20_000,
      scrollHistogram: { q0_25: 15, q25_50: 3, q50_75: 1, q75_1: 1 },
      exitBySection: { hero: 12 },
      updatedAt: "2026-04-24",
    });
    expect(hints.some((h) => h.category === "intro")).toBe(true);
  });
});

describe("growth-engine / revenue priority", () => {
  it("applyPageRpmSignals boosts overlapping high-RPM paths", () => {
    const rows: PrioritizedOpportunity[] = [
      { keyword: "loan calculator payment schedule", intent: "transactional", priority: 50, linkToolSlugs: ["loan-calculator"] },
    ];
    const out = applyPageRpmSignals(rows, {
      updatedAt: "2026-01-01",
      pages: [{ path: "/tools/loan-calculator", clicks: 30, impressions: 5000, position: 5 }],
      pageRevenue: [{ path: "/tools/loan-calculator", rpm: 20 }],
    });
    expect(out[0]!.priority).toBeGreaterThan(50);
    expect(out[0]!.rpmBoost).toBeDefined();
  });

  it("topPageRevenuePaths sorts by rpm", () => {
    const top = topPageRevenuePaths(
      {
        updatedAt: "2026-01-01",
        pages: [],
        pageRevenue: [
          { path: "/a", rpm: 5 },
          { path: "/b", rpm: 22 },
        ],
      },
      5,
    );
    expect(top[0]!.path).toBe("/b");
  });
});

describe("growth-engine / programmatic confidence", () => {
  it("pickHighConfidenceProgrammaticPicks dedupes clusters", () => {
    const queue = [
      {
        path: "/tools/loan-calculator",
        metric: { path: "/tools/loan-calculator", clicks: 50, impressions: 8000, position: 4 },
        ideas: [
          {
            primaryKeyword: "loan calculator 10k example",
            kind: "numeric_principal" as const,
            suggestedSlugHint: "loan-calculator-10k-example",
            rationale: "test",
          },
        ],
      },
    ];
    const picks = pickHighConfidenceProgrammaticPicks(queue, new Set(), new Set(["missing-slug"]), 3);
    expect(picks.length).toBe(1);
  });
});

describe("growth-engine / scaling pick", () => {
  it("pickScalingBlogCandidate skips existing slugs", () => {
    const cand = pickScalingBlogCandidate(
      [
        {
          path: "/tools/x",
          ideas: [
            {
              kind: "deep_guide" as const,
              titleHint: "Deeper",
              primaryKeywordHint: "existing-slug-here",
              rationale: "r",
            },
          ],
        },
      ],
      new Set(["existing-slug-here"]),
    );
    expect(cand).toBeNull();
  });
});

describe("growth-engine / performance content loop", () => {
  it("returns null without GSC pages", () => {
    expect(buildContentPerformanceLoopSnapshot(null, null)).toBeNull();
  });

  it("returns queues when pages exist", () => {
    const snap = buildContentPerformanceLoopSnapshot(
      {
        updatedAt: "2026-04-24",
        pages: [{ path: "/tools/loan-calculator", clicks: 50, impressions: 8000, position: 4 }],
      },
      null,
    );
    expect(snap).not.toBeNull();
    expect(snap!.ctrQueue.length).toBeGreaterThanOrEqual(0);
    expect(snap!.programmaticQueue.length).toBeGreaterThanOrEqual(1);
  });
});
