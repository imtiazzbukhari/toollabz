import { describe, expect, it } from "vitest";
import { parseAdSensePageRevenueCsv } from "@/lib/content-engine/adsense/parse-export";
import { normalizeHeadingKey } from "@/lib/content-engine/competitor/extract-headings";
import { buildClusterDominationRoadmaps } from "@/lib/content-engine/dashboard/cluster-roadmap";
import { TOPIC_CLUSTERS } from "@/lib/content-engine/topic-clusters";
import { applyActiveClusterMode } from "@/lib/content-engine/funnel/active-cluster-mode";
import { buildFastDeploymentSnapshot } from "@/lib/content-engine/execution/fast-deployment";
import { buildClusterPerformanceSnapshot } from "@/lib/content-engine/dashboard/cluster-performance";
import { buildContentPruningQueue } from "@/lib/content-engine/dashboard/content-pruning";
import { buildConversionTrackingSnapshot } from "@/lib/content-engine/dashboard/conversion-tracking";
import { buildAdvancedRevenueOptimization } from "@/lib/content-engine/dashboard/revenue-optimization";
import { buildRevenueFunnelSnapshot } from "@/lib/content-engine/dashboard/revenue-funnel";
import { buildMoneyPagesSnapshot } from "@/lib/content-engine/dashboard/money-pages";
import { buildClusterMoneyScores } from "@/lib/content-engine/dashboard/cluster-money-score";
import { buildWeeklyDecisionActions } from "@/lib/content-engine/dashboard/weekly-decision-engine";
import { buildPriorityExecutionPlan } from "@/lib/content-engine/dashboard/priority-execution-plan";
import { buildBusinessCommandCenter } from "@/lib/content-engine/dashboard/business-command-center";
import { buildLowRpmDetection } from "@/lib/content-engine/dashboard/low-rpm-detection";
import { buildPageTypeClassification } from "@/lib/content-engine/dashboard/page-type-classifier";
import { buildMonetizationGapEngine } from "@/lib/content-engine/dashboard/monetization-gap";
import { buildAdPlacementEngine } from "@/lib/content-engine/dashboard/ad-placement-engine";
import { buildMonetizationScorecard } from "@/lib/content-engine/dashboard/monetization-scorecard";
import { buildMonetizationSprintPlan } from "@/lib/content-engine/dashboard/monetization-sprint";
import { buildImpactComparisonSnapshot } from "@/lib/content-engine/dashboard/impact-comparison";
import { buildLearningSnapshot, applyLearningToScorecard } from "@/lib/content-engine/dashboard/learning-engine";
import { buildSprintMarkdown } from "@/lib/content-engine/dashboard/sprint-markdown";
import { buildPatternSnapshot } from "@/lib/content-engine/dashboard/pattern-detection";
import { buildAutoScalingOpportunities } from "@/lib/content-engine/dashboard/auto-scaling-memory";
import { applyMemoryPriorityBoost } from "@/lib/content-engine/dashboard/priority-boost-memory";
import { buildTrendSnapshot } from "@/lib/content-engine/dashboard/trend-analysis";

describe("parseAdSensePageRevenueCsv", () => {
  it("parses flexible headers and normalizes paths", () => {
    const csv = [
      "Page URL,Page RPM,Estimated earnings,Monetized impressions",
      "https://example.com/tools/loan-calculator,12.50,3.20,400",
      "/blog/foo,8,,100",
    ].join("\n");
    const rows = parseAdSensePageRevenueCsv(csv);
    expect(rows.length).toBe(2);
    expect(rows[0]?.path).toBe("/tools/loan-calculator");
    expect(rows[0]?.rpm).toBe(12.5);
    expect(rows[0]?.earnings).toBe(3.2);
    expect(rows[0]?.monetizedImpressions).toBe(400);
    expect(rows[1]?.path).toBe("/blog/foo");
    expect(rows[1]?.rpm).toBe(8);
  });
});

describe("normalizeHeadingKey", () => {
  it("strips noise for comparison", () => {
    expect(normalizeHeadingKey("  Loan Calculator  ")).toBe("loan calculator");
  });
});

describe("buildClusterDominationRoadmaps", () => {
  it("returns substantial backlog per cluster when maxPerCluster is high", () => {
    const maps = buildClusterDominationRoadmaps(120, 2000);
    expect(Object.keys(maps).length).toBe(TOPIC_CLUSTERS.length);
    for (const c of TOPIC_CLUSTERS) {
      expect((maps[c.id]?.length ?? 0)).toBeGreaterThanOrEqual(50);
    }
  });
});

describe("applyActiveClusterMode", () => {
  it("filters to selected clusters", () => {
    const rows = [
      { keyword: "a", intent: "mixed", priority: 80, linkToolSlugs: [], clusterId: "loan-core" },
      { keyword: "b", intent: "mixed", priority: 78, linkToolSlugs: [], clusterId: "salary-paycheck" },
    ] as const;
    const out = applyActiveClusterMode(rows, ["loan-core"]);
    expect(out.summary.enabled).toBe(true);
    expect(out.rows.length).toBe(1);
    expect(out.rows[0]?.clusterId).toBe("loan-core");
  });
});

describe("buildFastDeploymentSnapshot", () => {
  it("detects high-confidence candidates and bulk lanes", () => {
    const s = buildFastDeploymentSnapshot({
      fastApprovalMode: true,
      ctrQueue: [{ path: "/blog/x", impressions: 9000, ctr: 0.01 }],
      behaviorActions: [{ path: "/blog/x", trigger: "high_exit_section", title: "Fix exits", checklist: [] }],
      programmaticPick: { path: "/blog/parent" },
      scalingBlog: { parentPath: "/blog/parent" },
    });
    expect(s.fastApprovalMode).toBe(true);
    expect(s.highConfidence.length).toBeGreaterThan(0);
    expect(s.bulkReviewBatches.length).toBe(4);
  });
});

describe("cluster performance + pruning", () => {
  it("builds cluster leaderboard and pruning actions", () => {
    const perf = {
      updatedAt: "2026-04-24",
      pages: [
        { path: "/tools/loan-calculator", clicks: 50, impressions: 2000, position: 5.2 },
        { path: "/blog/rent-vs-buy", clicks: 2, impressions: 1800, position: 16.1 },
      ],
      pagesPrevious: [
        { path: "/tools/loan-calculator", clicks: 40, impressions: 1800, position: 5.9 },
        { path: "/blog/rent-vs-buy", clicks: 8, impressions: 1700, position: 14.8 },
      ],
      pageRevenue: [
        { path: "/tools/loan-calculator", rpm: 18, earnings: 12 },
        { path: "/blog/rent-vs-buy", rpm: 3, earnings: 1 },
      ],
    } as const;
    const behavior = {
      updatedAt: "2026-04-24",
      byPath: {
        "/blog/rent-vs-buy": {
          path: "/blog/rent-vs-buy",
          sampleCount: 12,
          avgMaxScroll: 0.2,
          avgActiveMs: 7000,
          scrollHistogram: { q0_25: 8, q25_50: 2, q50_75: 1, q75_1: 1 },
          exitBySection: { intro: 5 },
          updatedAt: "2026-04-24",
        },
      },
    } as const;

    const clusters = buildClusterPerformanceSnapshot(perf);
    expect(clusters.leaderboard.length).toBeGreaterThan(0);

    const pruning = buildContentPruningQueue(perf, behavior, 10);
    expect(pruning.length).toBeGreaterThan(0);
    expect(pruning[0]?.path).toContain("/blog/rent-vs-buy");
  });
});

describe("adaptive conversion + revenue", () => {
  it("computes conversion rates and true revenue score", () => {
    const behavior = {
      updatedAt: "2026-04-24",
      byPath: {
        "/tools/loan-calculator": {
          path: "/tools/loan-calculator",
          sampleCount: 20,
          avgMaxScroll: 0.7,
          avgActiveMs: 52000,
          scrollHistogram: { q0_25: 2, q25_50: 4, q50_75: 6, q75_1: 8 },
          exitBySection: { intro: 3 },
          entryKeywords: { "loan payment calculator": 7 },
          toolClickCount: 9,
          conversionEventCount: 4,
          segmentCounts: { scanner: 3, researcher: 8, ready_to_act: 9 },
          updatedAt: "2026-04-24",
        },
      },
    } as const;
    const perf = {
      updatedAt: "2026-04-24",
      pages: [{ path: "/tools/loan-calculator", clicks: 40, impressions: 1200, position: 4.2 }],
      pageRevenue: [{ path: "/tools/loan-calculator", rpm: 16, earnings: 11 }],
    } as const;
    const conv = buildConversionTrackingSnapshot(behavior, 10);
    expect(conv.highConvertingPages.length).toBeGreaterThan(0);
    const rev = buildAdvancedRevenueOptimization(perf, behavior, 10);
    expect(rev.topRevenuePages[0]?.trueRevenueScore).toBeGreaterThan(40);
  });
});

describe("business funnel + money pages", () => {
  it("builds funnel stages and money page slices", () => {
    const behavior = {
      updatedAt: "2026-04-24",
      byPath: {
        "/tools/loan-calculator": {
          path: "/tools/loan-calculator",
          sampleCount: 20,
          avgMaxScroll: 0.7,
          avgActiveMs: 52000,
          scrollHistogram: { q0_25: 2, q25_50: 4, q50_75: 6, q75_1: 8 },
          exitBySection: { intro: 3 },
          entryKeywords: { "loan payment calculator": 7 },
          toolClickCount: 9,
          conversionEventCount: 4,
          segmentCounts: { scanner: 3, researcher: 8, ready_to_act: 9 },
          updatedAt: "2026-04-24",
        },
      },
    } as const;
    const perf = {
      updatedAt: "2026-04-24",
      pages: [{ path: "/tools/loan-calculator", clicks: 40, impressions: 1200, position: 4.2 }],
      pageRevenue: [{ path: "/tools/loan-calculator", rpm: 16, earnings: 11 }],
    } as const;
    const funnel = buildRevenueFunnelSnapshot(perf, behavior);
    expect(funnel.stages.length).toBe(4);
    const money = buildMoneyPagesSnapshot(perf, behavior);
    expect(money.topEarningPages.length).toBeGreaterThan(0);
  });
});

describe("decision-driven revenue engine", () => {
  it("builds weekly actions, cluster scores, and command center summary", () => {
    const behavior = {
      updatedAt: "2026-04-24",
      byPath: {
        "/tools/loan-calculator": {
          path: "/tools/loan-calculator",
          sampleCount: 20,
          avgMaxScroll: 0.7,
          avgActiveMs: 52000,
          scrollHistogram: { q0_25: 2, q25_50: 4, q50_75: 6, q75_1: 8 },
          exitBySection: { intro: 3 },
          entryKeywords: { "loan payment calculator": 7 },
          toolClickCount: 9,
          conversionEventCount: 4,
          segmentCounts: { scanner: 3, researcher: 8, ready_to_act: 9 },
          updatedAt: "2026-04-24",
        },
      },
    } as const;
    const perf = {
      updatedAt: "2026-04-24",
      pages: [{ path: "/tools/loan-calculator", clicks: 40, impressions: 1200, position: 4.2 }],
      pageRevenue: [{ path: "/tools/loan-calculator", rpm: 16, earnings: 11 }],
    } as const;
    const funnel = buildRevenueFunnelSnapshot(perf, behavior);
    const money = buildMoneyPagesSnapshot(perf, behavior);
    const clusters = buildClusterMoneyScores(perf, behavior);
    const weekly = buildWeeklyDecisionActions({
      funnel,
      moneyPages: money,
      clusterScores: clusters,
      baselineRevenue: 11,
    });
    const plan = buildPriorityExecutionPlan({ funnel, moneyPages: money, clusterScores: clusters });
    const center = buildBusinessCommandCenter({ weeklyActions: weekly, clusterScores: clusters, executionPlan: plan });
    expect(weekly.length).toBe(5);
    expect(clusters.length).toBeGreaterThan(0);
    expect(center.expectedRevenueImpactUsd).toBeGreaterThan(0);
  });
});

describe("monetization intelligence layer", () => {
  it("detects low rpm, classifies page types, finds gaps, and returns ad placements", () => {
    const behavior = {
      updatedAt: "2026-04-24",
      byPath: {
        "/blog/loan-basics": {
          path: "/blog/loan-basics",
          sampleCount: 15,
          avgMaxScroll: 0.28,
          avgActiveMs: 19000,
          scrollHistogram: { q0_25: 8, q25_50: 4, q50_75: 2, q75_1: 1 },
          exitBySection: { intro: 5 },
          entryKeywords: { "loan basics": 8 },
          toolClickCount: 1,
          conversionEventCount: 0,
          segmentCounts: { scanner: 9, researcher: 5, ready_to_act: 1 },
          updatedAt: "2026-04-24",
        },
      },
    } as const;
    const perf = {
      updatedAt: "2026-04-24",
      pages: [
        { path: "/blog/loan-basics", clicks: 20, impressions: 2400, position: 9.2 },
        { path: "/tools/loan-calculator", clicks: 80, impressions: 1800, position: 3.2 },
      ],
      pageRevenue: [
        { path: "/blog/loan-basics", rpm: 3, earnings: 1.2 },
        { path: "/tools/loan-calculator", rpm: 15, earnings: 8.5 },
      ],
    } as const;
    const low = buildLowRpmDetection(perf, behavior, 10);
    expect(low.length).toBeGreaterThan(0);
    const types = buildPageTypeClassification(perf.pages.map((p) => p.path));
    expect(types.find((t) => t.path === "/tools/loan-calculator")?.type).toBe("calculator");
    const gaps = buildMonetizationGapEngine(perf, behavior, 10);
    expect(gaps.length).toBeGreaterThan(0);
    const plans = buildAdPlacementEngine([{ path: "/tools/loan-calculator", pageType: "calculator" }], 10);
    expect(plans[0]?.placements.length).toBe(3);
  });
});

describe("monetization scorecard engine", () => {
  it("ranks top 10 actions with impact and execution guidance", () => {
    const behavior = {
      updatedAt: "2026-04-24",
      byPath: {
        "/blog/loan-basics": {
          path: "/blog/loan-basics",
          sampleCount: 15,
          avgMaxScroll: 0.28,
          avgActiveMs: 19000,
          scrollHistogram: { q0_25: 8, q25_50: 4, q50_75: 2, q75_1: 1 },
          exitBySection: { intro: 5 },
          entryKeywords: { "loan basics": 8 },
          toolClickCount: 1,
          conversionEventCount: 0,
          segmentCounts: { scanner: 9, researcher: 5, ready_to_act: 1 },
          updatedAt: "2026-04-24",
        },
      },
    } as const;
    const perf = {
      updatedAt: "2026-04-24",
      pages: [
        { path: "/blog/loan-basics", clicks: 20, impressions: 2400, position: 9.2 },
        { path: "/tools/loan-calculator", clicks: 80, impressions: 1800, position: 3.2 },
      ],
      pageRevenue: [
        { path: "/blog/loan-basics", rpm: 3, earnings: 1.2 },
        { path: "/tools/loan-calculator", rpm: 15, earnings: 8.5 },
      ],
    } as const;
    const card = buildMonetizationScorecard(perf, behavior, 10);
    expect(card.actions.length).toBeGreaterThan(0);
    expect(card.actions[0]?.rank).toBe(1);
    expect(card.actions[0]?.expectedRevenueImpactUsd).toBeGreaterThanOrEqual(0);
  });
});

describe("monetization sprint engine", () => {
  it("selects top 3 actions and builds PR-ready weekly sprint summary", () => {
    const scorecard = {
      actions: [
        {
          rank: 1,
          targetPage: "/tools/loan-calculator",
          exactFix: "cta",
          expectedRevenueImpactUsd: 12.5,
          confidence: "high",
          ease: "easy",
          expectedOutcome: "Higher tool clickthrough.",
          score: 92,
        },
        {
          rank: 2,
          targetPage: "/blog/loan-basics",
          exactFix: "rewrite",
          expectedRevenueImpactUsd: 10.2,
          confidence: "medium",
          ease: "hard",
          expectedOutcome: "Better monetized section performance.",
          score: 88,
        },
        {
          rank: 3,
          targetPage: "/blog/mortgage-vs-rent",
          exactFix: "ad_placement",
          expectedRevenueImpactUsd: 9.3,
          confidence: "high",
          ease: "medium",
          expectedOutcome: "RPM lift.",
          score: 86,
        },
        {
          rank: 4,
          targetPage: "/blog/paycheck-guide",
          exactFix: "link",
          expectedRevenueImpactUsd: 5.1,
          confidence: "low",
          ease: "easy",
          expectedOutcome: "More internal commercial flow.",
          score: 70,
        },
      ],
      totalOpportunityUsd: 37.1,
    } as const;
    const sprint = buildMonetizationSprintPlan(scorecard);
    expect(sprint.topActions.length).toBe(3);
    expect(sprint.orderedSteps.length).toBe(3);
    expect(sprint.weeklyExecutionSummary.expectedRevenueGainUsd).toBeGreaterThan(0);
  });
});

describe("execution learning loop", () => {
  it("compares expected vs actual and produces learning + markdown", () => {
    const log = [
      {
        id: "a",
        weekOf: "2026-04-24",
        targetPage: "/tools/loan-calculator",
        exactFix: "cta",
        status: "done",
        expectedRevenueImpactUsd: 10,
        confidence: "high",
        completionDate: "2026-04-24",
        actualRevenueImpactUsd: 12,
        updatedAt: "2026-04-24T10:00:00.000Z",
      },
      {
        id: "b",
        weekOf: "2026-04-24",
        targetPage: "/blog/loan-basics",
        exactFix: "rewrite",
        status: "done",
        expectedRevenueImpactUsd: 8,
        confidence: "medium",
        completionDate: "2026-04-24",
        actualRevenueImpactUsd: 4,
        updatedAt: "2026-04-24T10:00:00.000Z",
      },
    ] as const;
    const impact = buildImpactComparisonSnapshot(log);
    expect(impact.completed.length).toBe(2);
    const learning = buildLearningSnapshot(log);
    expect(learning.insights.length).toBe(4);
    const adjusted = applyLearningToScorecard(
      [
        {
          rank: 1,
          targetPage: "/tools/loan-calculator",
          exactFix: "cta",
          expectedRevenueImpactUsd: 10,
          confidence: "medium",
          ease: "easy",
          expectedOutcome: "x",
          score: 80,
        },
      ],
      learning,
    );
    expect(adjusted.length).toBe(1);
    const sprint = buildMonetizationSprintPlan({
      actions: adjusted,
      totalOpportunityUsd: 10,
    });
    const md = buildSprintMarkdown({ sprint, impact, learning });
    expect(md.includes("Monetization sprint plan")).toBe(true);
  });
});

describe("memory + auto-scaling system", () => {
  it("detects high ROI patterns, proposes scaling, and boosts winners", () => {
    const memory = [
      {
        actionId: "a1",
        weekOf: "2026-04-24",
        targetPage: "/tools/loan-calculator",
        fixType: "cta",
        pageType: "calculator",
        clusterId: "loan-core",
        expectedRevenueImpactUsd: 10,
        actualRevenueImpactUsd: 14,
        completedAt: "2026-04-24",
        roiRatio: 1.4,
        loggedAt: "2026-04-24T10:00:00.000Z",
      },
      {
        actionId: "a2",
        weekOf: "2026-04-25",
        targetPage: "/tools/mortgage-calculator",
        fixType: "cta",
        pageType: "calculator",
        clusterId: "mortgage",
        expectedRevenueImpactUsd: 8,
        actualRevenueImpactUsd: 10,
        completedAt: "2026-04-25",
        roiRatio: 1.25,
        loggedAt: "2026-04-25T10:00:00.000Z",
      },
    ] as const;
    const patterns = buildPatternSnapshot(memory);
    expect(patterns.highRoiActionTypes[0]?.key).toBe("cta");
    expect(patterns.highRoiActionTypes[0]?.performanceLabel).toBe("high_roi");

    const perf = {
      updatedAt: "2026-04-26",
      pages: [
        { path: "/tools/loan-calculator", clicks: 90, impressions: 5000, position: 3.2 },
        { path: "/tools/mortgage-calculator", clicks: 70, impressions: 4100, position: 4.5 },
        { path: "/blog/loan-tips", clicks: 12, impressions: 1400, position: 10.2 },
      ],
      pageRevenue: [],
    } as const;
    const opportunities = buildAutoScalingOpportunities(patterns, perf, 10);
    expect(opportunities.length).toBeGreaterThan(0);
    expect(opportunities[0]?.recommendedFixType).toBe("cta");

    const boosted = applyMemoryPriorityBoost(
      [
        {
          rank: 1,
          targetPage: "/tools/loan-calculator",
          exactFix: "cta",
          expectedRevenueImpactUsd: 11,
          confidence: "medium",
          ease: "easy",
          expectedOutcome: "x",
          score: 70,
        },
      ],
      patterns,
    );
    expect(boosted[0]?.score).toBeGreaterThan(70);
  });
});

describe("trend analysis engine", () => {
  it("tracks 4-week direction and creates alerts", () => {
    const memory = [
      {
        actionId: "t1",
        weekOf: "2026-04-01",
        targetPage: "/tools/loan-calculator",
        fixType: "cta",
        pageType: "calculator",
        clusterId: "loan-core",
        expectedRevenueImpactUsd: 10,
        actualRevenueImpactUsd: 6,
        completedAt: "2026-03-30",
        roiRatio: 0.6,
        loggedAt: "2026-03-30T09:00:00.000Z",
      },
      {
        actionId: "t2",
        weekOf: "2026-04-08",
        targetPage: "/tools/loan-calculator",
        fixType: "cta",
        pageType: "calculator",
        clusterId: "loan-core",
        expectedRevenueImpactUsd: 10,
        actualRevenueImpactUsd: 9,
        completedAt: "2026-04-06",
        roiRatio: 0.9,
        loggedAt: "2026-04-06T09:00:00.000Z",
      },
      {
        actionId: "t3",
        weekOf: "2026-04-15",
        targetPage: "/tools/loan-calculator",
        fixType: "cta",
        pageType: "calculator",
        clusterId: "loan-core",
        expectedRevenueImpactUsd: 10,
        actualRevenueImpactUsd: 12,
        completedAt: "2026-04-13",
        roiRatio: 1.2,
        loggedAt: "2026-04-13T09:00:00.000Z",
      },
      {
        actionId: "t4",
        weekOf: "2026-04-22",
        targetPage: "/blog/loan-basics",
        fixType: "cta",
        pageType: "informational",
        clusterId: "loan-core",
        expectedRevenueImpactUsd: 10,
        actualRevenueImpactUsd: 15,
        completedAt: "2026-04-20",
        roiRatio: 1.5,
        loggedAt: "2026-04-20T09:00:00.000Z",
      },
      {
        actionId: "t5",
        weekOf: "2026-04-22",
        targetPage: "/blog/mortgage-rates",
        fixType: "rewrite",
        pageType: "informational",
        clusterId: "mortgage",
        expectedRevenueImpactUsd: 12,
        actualRevenueImpactUsd: 6,
        completedAt: "2026-04-20",
        roiRatio: 0.5,
        loggedAt: "2026-04-20T09:00:00.000Z",
      },
    ] as const;
    const trend = buildTrendSnapshot(memory, 8);
    expect(trend.windowWeeks.length).toBe(4);
    expect(trend.revenueByCluster.length).toBeGreaterThan(0);
    expect(trend.roiByFixType.length).toBeGreaterThan(0);
    expect(trend.performanceByPageType.length).toBeGreaterThan(0);
    expect(trend.alerts.length).toBeGreaterThan(0);
  });
});
