import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { blogPosts, blogPostSlugs } from "@/lib/blog/registry";
import { tools } from "@/lib/tools/data";
import { loadPerformanceAggregates } from "../performance/load-aggregates";
import { loadPerformanceAggregatesMerged } from "../seo-metrics/merge-performance";
import { buildSeoDataPlaneSnapshot, type SeoDataPlaneSnapshot } from "../seo-metrics/build-seo-data-plane-snapshot";
import { buildOrphanToolLinkHints, type OrphanLinkHint } from "../internal-link-orphans";
import { loadBehaviorAggregates } from "../growth/load-behavior-aggregates";
import { buildContentPerformanceLoopSnapshot } from "../growth/performance-content-loop";
import { buildBehaviorPrActionQueue } from "../growth/behavior-actions";
import { topPageRevenuePaths } from "../growth/revenue-priority";
import { findRefreshCandidates } from "../funnel/content-refresh";
import { buildProgrammaticExpansionQueue } from "../growth/programmatic-expand";
import { pickHighConfidenceProgrammaticPicks } from "../growth/programmatic-confidence";
import { buildExpansionQueueFromAggregates } from "../funnel/smart-expansion";
import { pickScalingBlogCandidate } from "../growth/expansion-scaling-pick";
import { toolMap } from "@/lib/tools/data";
import { buildOpportunityEngineSnapshot } from "./opportunity-snapshot";
import { detectSiteHealthIssues } from "./site-health";
import { detectTitleCannibalization } from "./cannibalization";
import { buildPerformanceHintsForTopPages } from "./performance-hints";
import { buildSerpGapSuggestions } from "./serp-gap";
import { backlinkEngineSummary } from "./backlink-engine";
import { buildClusterDominationRoadmaps, summarizeClusterRoadmaps } from "./cluster-roadmap";
import { summarizeOutreachQueue } from "../outreach/queue-store";
import { buildPagePerformanceRows } from "./page-performance";
import { buildGscSiteTrends } from "./gsc-site-trends";
import { buildToolPerformanceEngine } from "./tool-performance-engine";
import { buildRevenueTrackingSnapshot } from "./revenue-tracking-snapshot";
import { buildBacklinkProspects } from "./backlink-discovery";
import { buildAuthorityTrackingSnapshot } from "./authority-tracking";
import { buildSmartDecisionActions } from "./smart-decision-actions";
import { buildToolRoiRows } from "./tool-roi";
import { buildPerformanceTriggers } from "./performance-triggers";
import { buildDailyPriorityActions } from "./daily-priority-actions";
import { loadSmartActionExecutions, loadExecutionHistory } from "../execution-store";
import { buildExecutionPerformanceSummary } from "../execution/impact-tracker";
import { applyExecutionLearningToSmartDecisions, loadExecutionLearningState } from "../execution/execution-learning";
import { buildToolImpactRows } from "./tool-impact-tracking";
import { activeClusterIds, businessModeEnabled, fastApprovalModeEnabled, highIntentContentModeEnabled } from "../config";
import { applyActiveClusterMode } from "../funnel/active-cluster-mode";
import { buildFastDeploymentSnapshot } from "../execution/fast-deployment";
import { buildConversionNextStepSuggestions } from "../funnel/conversion-optimization";
import { buildClusterPerformanceSnapshot } from "./cluster-performance";
import { buildContentPruningQueue } from "./content-pruning";
import { buildInternalLinkBoostSuggestions } from "./internal-link-boost";
import { buildTopicDominationScores } from "./topic-domination-score";
import { buildWinnerAmplificationIdeas } from "./winner-amplification";
import { buildLossPreventionQueue } from "./loss-prevention";
import { buildSmartExecutionPriority } from "./execution-priority";
import { buildIntentMatchingRecommendations } from "./intent-matching";
import { buildConversionTrackingSnapshot } from "./conversion-tracking";
import { buildAuthorityImpactSnapshot } from "./authority-impact";
import { buildContentPersonalizationHints } from "./content-personalization";
import { buildAdvancedRevenueOptimization } from "./revenue-optimization";
import { buildSmartScalingRecommendations } from "./smart-scaling";
import { buildRevenueFunnelSnapshot } from "./revenue-funnel";
import { buildMoneyPagesSnapshot } from "./money-pages";
import { buildClusterMoneyScores } from "./cluster-money-score";
import { buildWeeklyDecisionActions } from "./weekly-decision-engine";
import { buildPriorityExecutionPlan } from "./priority-execution-plan";
import { buildBusinessCommandCenter } from "./business-command-center";
import { buildLowRpmDetection } from "./low-rpm-detection";
import { buildPageTypeClassification } from "./page-type-classifier";
import { buildMonetizationGapEngine } from "./monetization-gap";
import { buildAdPlacementEngine } from "./ad-placement-engine";
import { buildMonetizationScorecard } from "./monetization-scorecard";
import { buildMonetizationSprintPlan } from "./monetization-sprint";
import { buildImpactComparisonSnapshot } from "./impact-comparison";
import { applyLearningToScorecard, buildLearningSnapshot } from "./learning-engine";
import { buildSprintMarkdown } from "./sprint-markdown";
import { syncSprintPlanActions, loadSprintExecutionLog } from "./sprint-execution-tracker";
import { syncRevenueMemoryFromExecution } from "./revenue-memory";
import { buildPatternSnapshot } from "./pattern-detection";
import { buildAutoScalingOpportunities } from "./auto-scaling-memory";
import { applyMemoryPriorityBoost } from "./priority-boost-memory";
import { buildTrendSnapshot } from "./trend-analysis";
import { buildAdsenseReadinessReport } from "../adsense/adsense-readiness";
import { enforceToolPageMonetization } from "../monetization/enforcement";
import { appendAdsenseHistory } from "../adsense/adsense-history";
import { buildAdsenseProgress } from "../adsense/adsense-progress";
import { buildAdsenseActions } from "../adsense/adsense-actions";
import { getSystemStatuses } from "../system-status";
import { readSafetyStatus } from "../safety-guardrails";
import { readAutomationErrorLogs } from "../error-log";

function toolProposalSlugs(root = process.cwd()): string[] {
  const dir = path.join(root, "lib", "content-engine", "tool-proposals");
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export type DashboardSnapshot = {
  generatedAt: string;
  priorityEngineOrder: string[];
  overview: {
    blogCount: number;
    toolCount: number;
    opportunityPoolSize: number;
    topCpcKeywords: Array<{ keyword: string; cpcScore: number }>;
  };
  opportunityEngine: ReturnType<typeof buildOpportunityEngineSnapshot>;
  growthLoop: NonNullable<ReturnType<typeof buildContentPerformanceLoopSnapshot>> | null;
  behaviorPrActions: ReturnType<typeof buildBehaviorPrActionQueue>;
  revenueLeaderboard: ReturnType<typeof topPageRevenuePaths>;
  refreshCandidates: ReturnType<typeof findRefreshCandidates>;
  programmaticQueue: ReturnType<typeof buildProgrammaticExpansionQueue>;
  programmaticPicks: ReturnType<typeof pickHighConfidenceProgrammaticPicks>;
  scalingBlog: ReturnType<typeof pickScalingBlogCandidate>;
  siteHealth: ReturnType<typeof detectSiteHealthIssues>;
  cannibalization: ReturnType<typeof detectTitleCannibalization>;
  performanceHints: ReturnType<typeof buildPerformanceHintsForTopPages>;
  serpGaps: ReturnType<typeof buildSerpGapSuggestions>;
  backlink: ReturnType<typeof backlinkEngineSummary>;
  toolProposals: { slugs: string[] };
  prCommands: string[];
  clusterDomination: {
    summaries: ReturnType<typeof summarizeClusterRoadmaps>;
    totalPlannedIdeas: number;
  };
  outreachExecution: {
    queueSummary: ReturnType<typeof summarizeOutreachQueue>;
    api: {
      queue: string;
      draft: string;
      approve: string;
      send: string;
      replied: string;
    };
  };
  competitorIntelligence: { method: string; path: string; bodyHint: string };
  executionLayer: ReturnType<typeof buildFastDeploymentSnapshot>;
  activeClusterMode: ReturnType<typeof applyActiveClusterMode>["summary"];
  conversionOptimization: {
    nextStepSuggestions: ReturnType<typeof buildConversionNextStepSuggestions>;
  };
  highIntentMode: { enabled: boolean; rule: string };
  clusterPerformance: ReturnType<typeof buildClusterPerformanceSnapshot>;
  contentPruning: ReturnType<typeof buildContentPruningQueue>;
  internalLinkBoost: ReturnType<typeof buildInternalLinkBoostSuggestions>;
  topicDominationScores: ReturnType<typeof buildTopicDominationScores>;
  winnerAmplification: ReturnType<typeof buildWinnerAmplificationIdeas>;
  lossPrevention: ReturnType<typeof buildLossPreventionQueue>;
  executionPriority: ReturnType<typeof buildSmartExecutionPriority>;
  intentMatching: ReturnType<typeof buildIntentMatchingRecommendations>;
  conversionTracking: ReturnType<typeof buildConversionTrackingSnapshot>;
  authorityImpact: ReturnType<typeof buildAuthorityImpactSnapshot>;
  personalization: ReturnType<typeof buildContentPersonalizationHints>;
  advancedRevenueOptimization: ReturnType<typeof buildAdvancedRevenueOptimization>;
  smartScaling: ReturnType<typeof buildSmartScalingRecommendations>;
  revenueFunnel: ReturnType<typeof buildRevenueFunnelSnapshot>;
  moneyPages: ReturnType<typeof buildMoneyPagesSnapshot>;
  businessMode: { enabled: boolean; policy: string };
  clusterMoneyScores: ReturnType<typeof buildClusterMoneyScores>;
  weeklyDecisionActions: ReturnType<typeof buildWeeklyDecisionActions>;
  priorityExecutionPlan: ReturnType<typeof buildPriorityExecutionPlan>;
  businessCommandCenter: ReturnType<typeof buildBusinessCommandCenter>;
  lowRpmDetection: ReturnType<typeof buildLowRpmDetection>;
  pageTypeClassifier: ReturnType<typeof buildPageTypeClassification>;
  monetizationGaps: ReturnType<typeof buildMonetizationGapEngine>;
  adPlacementPlans: ReturnType<typeof buildAdPlacementEngine>;
  monetizationScorecard: ReturnType<typeof buildMonetizationScorecard>;
  monetizationSprint: ReturnType<typeof buildMonetizationSprintPlan>;
  sprintExecutionLog: ReturnType<typeof loadSprintExecutionLog>;
  impactComparison: ReturnType<typeof buildImpactComparisonSnapshot>;
  learningInsights: ReturnType<typeof buildLearningSnapshot>;
  sprintMarkdown: string;
  revenueMemory: ReturnType<typeof syncRevenueMemoryFromExecution>;
  learnedPatterns: ReturnType<typeof buildPatternSnapshot>;
  autoScalingOpportunities: ReturnType<typeof buildAutoScalingOpportunities>;
  trendAnalysis: ReturnType<typeof buildTrendSnapshot>;
  adsenseReadiness: ReturnType<typeof buildAdsenseReadinessReport>;
  adsenseHistory: ReturnType<typeof appendAdsenseHistory>;
  adsenseProgress: ReturnType<typeof buildAdsenseProgress>;
  adsenseActions: ReturnType<typeof buildAdsenseActions>;
  revenueAlerts: Array<{ level: "high" | "medium"; type: string; message: string; path?: string }>;
  pagePerformance: ReturnType<typeof buildPagePerformanceRows>;
  gscSiteTrends: ReturnType<typeof buildGscSiteTrends>;
  toolPerformance: ReturnType<typeof buildToolPerformanceEngine>;
  revenueTracking: ReturnType<typeof buildRevenueTrackingSnapshot>;
  backlinkDiscovery: ReturnType<typeof buildBacklinkProspects>;
  authorityTracking: ReturnType<typeof buildAuthorityTrackingSnapshot>;
  smartDecisionActions: ReturnType<typeof buildSmartDecisionActions>;
  toolRoi: ReturnType<typeof buildToolRoiRows>;
  performanceTriggers: ReturnType<typeof buildPerformanceTriggers>;
  dailyPriorityActions: ReturnType<typeof buildDailyPriorityActions>;
  executionQueue: ReturnType<typeof loadSmartActionExecutions>;
  executionHistory: ReturnType<typeof loadExecutionHistory>;
  executionPerformance: ReturnType<typeof buildExecutionPerformanceSummary>;
  toolImpactTracking: ReturnType<typeof buildToolImpactRows>;
  executionLearningSummary: {
    updatedAt: string;
    kindMultiplierCount: number;
    pathMultiplierCount: number;
  };
  systemHealth: {
    buildStatus: "success" | "failed";
    typecheckStatus: "success" | "failed";
    safeModeEnabled: boolean;
    lastError: string | null;
    failingModules: string[];
    failingSystems: string[];
  };
  failSafe: { rules: string[] };
  logsNote: string;
  /** Provenance for `pagePerformance` rows (Postgres rollup vs JSON import). */
  pageMetricsProvenance: {
    sourceLabel: string | null;
    updatedAt: string | null;
    hasPreviousWindow: boolean;
  };
  /** Postgres-backed GSC/GA4 slice + SQL-derived opportunities (empty when DATABASE_URL unset). */
  seoDataPlane: SeoDataPlaneSnapshot;
  /** Heuristic orphan detection from GSC pages + internal graph proxies. */
  orphanLinkHints: OrphanLinkHint[];
};

export async function buildDashboardSnapshot(): Promise<DashboardSnapshot> {
  const performance = (await loadPerformanceAggregatesMerged()) ?? loadPerformanceAggregates();
  const [seoDataPlane, orphanLinkHints] = await Promise.all([
    buildSeoDataPlaneSnapshot(),
    Promise.resolve(buildOrphanToolLinkHints(performance?.pages ?? [])),
  ]);
  const behavior = loadBehaviorAggregates();
  const pages = performance?.pages ?? [];
  const growthLoop = buildContentPerformanceLoopSnapshot(performance, behavior);
  const opp = buildOpportunityEngineSnapshot();

  const existingBlog = new Set(blogPostSlugs.map((s) => s.toLowerCase()));
  const existingTool = new Set([...toolMap.keys()].map((s) => s.toLowerCase()));
  const programmaticQueue = buildProgrammaticExpansionQueue(pages, 12);
  const programmaticPicks = pickHighConfidenceProgrammaticPicks(programmaticQueue, existingBlog, existingTool, 6);
  const expansionQueue = buildExpansionQueueFromAggregates(pages, 10);
  const scalingBlog = pickScalingBlogCandidate(expansionQueue, existingBlog);

  const clusterRoadmaps = buildClusterDominationRoadmaps(180, 2000);
  const clusterSummaries = summarizeClusterRoadmaps(clusterRoadmaps, 8);
  const totalPlannedIdeas = clusterSummaries.reduce((n, c) => n + c.total, 0);

  const topCpc = [...opp.prioritized]
    .sort((a, b) => (b.cpcScore ?? 0) - (a.cpcScore ?? 0))
    .slice(0, 5)
    .map((r) => ({ keyword: r.keyword, cpcScore: r.cpcScore ?? 0 }));
  const activeClusters = activeClusterIds();
  const activeClusterSummary = applyActiveClusterMode(opp.prioritized, activeClusters).summary;
  const executionLayer = buildFastDeploymentSnapshot({
    fastApprovalMode: fastApprovalModeEnabled(),
    ctrQueue: growthLoop?.ctrQueue ?? [],
    behaviorActions: behavior ? buildBehaviorPrActionQueue(behavior.byPath, 14) : [],
    programmaticPick: programmaticPicks[0] ?? null,
    scalingBlog,
  });
  const conversionOptimization = {
    nextStepSuggestions: buildConversionNextStepSuggestions(opp.prioritized, 12),
  };
  const highIntentMode = {
    enabled: highIntentContentModeEnabled(),
    rule: "Decision intent receives action-driven structure and stronger CTA-to-tool alignment.",
  };
  const clusterPerformance = buildClusterPerformanceSnapshot(performance);
  const contentPruning = buildContentPruningQueue(performance, behavior, 18);
  const internalLinkBoost = buildInternalLinkBoostSuggestions(performance, 10);
  const topicDominationScores = buildTopicDominationScores(performance);
  const winnerAmplification = buildWinnerAmplificationIdeas(performance, 8);
  const lossPrevention = buildLossPreventionQueue(performance, 10);
  const executionPriority = buildSmartExecutionPriority({
    opportunities: opp.prioritized,
    performance,
    behavior,
    max: 16,
  });
  const adaptivePaths = [...new Set((growthLoop?.ctrQueue ?? []).map((c) => c.path))];
  const intentMatching = buildIntentMatchingRecommendations(adaptivePaths, behavior, 14);
  const conversionTracking = buildConversionTrackingSnapshot(behavior, 30);
  const authorityImpact = buildAuthorityImpactSnapshot(performance, 20);
  const personalization = buildContentPersonalizationHints(behavior, 16);
  const advancedRevenueOptimization = buildAdvancedRevenueOptimization(performance, behavior, 30);
  const smartScaling = buildSmartScalingRecommendations(performance, behavior);
  const revenueFunnel = buildRevenueFunnelSnapshot(performance, behavior);
  const moneyPages = buildMoneyPagesSnapshot(performance, behavior);
  const clusterMoneyScores = buildClusterMoneyScores(performance, behavior);
  const baselineRevenue = (performance?.pageRevenue ?? []).reduce((n, r) => n + (r.earnings ?? 0), 0);
  const weeklyDecisionActions = buildWeeklyDecisionActions({
    funnel: revenueFunnel,
    moneyPages,
    clusterScores: clusterMoneyScores,
    baselineRevenue,
  });
  const priorityExecutionPlan = buildPriorityExecutionPlan({
    funnel: revenueFunnel,
    moneyPages,
    clusterScores: clusterMoneyScores,
  });
  const businessCommandCenter = buildBusinessCommandCenter({
    weeklyActions: weeklyDecisionActions,
    clusterScores: clusterMoneyScores,
    executionPlan: priorityExecutionPlan,
  });
  const pageTypeClassifier = buildPageTypeClassification((performance?.pages ?? []).map((p) => p.path), 200);
  const lowRpmDetection = buildLowRpmDetection(performance, behavior, 18);
  const monetizationGaps = buildMonetizationGapEngine(performance, behavior, 18);
  const adPlacementPlans = buildAdPlacementEngine(
    pageTypeClassifier.filter((p) => p.type === "decision" || p.type === "calculator").slice(0, 20).map((p) => ({
      path: p.path,
      pageType: p.type,
    })),
    20,
  );
  const executionLog = loadSprintExecutionLog();
  const learningInsights = buildLearningSnapshot(executionLog);
  const rawScorecard = buildMonetizationScorecard(performance, behavior, 10);
  const learnedActions = applyLearningToScorecard(rawScorecard.actions, learningInsights);
  const revenueMemory = syncRevenueMemoryFromExecution(executionLog);
  const learnedPatterns = buildPatternSnapshot(revenueMemory);
  const memoryBoostedActions = applyMemoryPriorityBoost(learnedActions, learnedPatterns);
  const learnedSorted = [...memoryBoostedActions].sort((a, b) => b.score - a.score || b.expectedRevenueImpactUsd - a.expectedRevenueImpactUsd);
  const monetizationScorecard = {
    ...rawScorecard,
    actions: learnedSorted.slice(0, 10).map((a, i) => ({ ...a, rank: i + 1 })),
    totalOpportunityUsd: Number(learnedSorted.slice(0, 10).reduce((n, a) => n + a.expectedRevenueImpactUsd, 0).toFixed(2)),
  };
  const monetizationSprint = buildMonetizationSprintPlan(monetizationScorecard);
  const sprintExecutionLog = syncSprintPlanActions(monetizationSprint);
  const pagePerformance = buildPagePerformanceRows(performance, 40);
  const gscSiteTrends = buildGscSiteTrends(performance);
  const toolPerformance = buildToolPerformanceEngine(performance, behavior, 24);
  const revenueTracking = buildRevenueTrackingSnapshot(performance);
  const backlinkDiscovery = buildBacklinkProspects(opp.prioritized, 12);
  const authorityTracking = buildAuthorityTrackingSnapshot(performance, summarizeOutreachQueue());
  const executionLearningState = loadExecutionLearningState();
  const smartDecisionActionsBase = buildSmartDecisionActions({
    scorecard: monetizationScorecard,
    weekly: weeklyDecisionActions,
    performance,
    behavior,
    max: 20,
  });
  const smartDecisionActionsLearned = applyExecutionLearningToSmartDecisions(
    smartDecisionActionsBase,
    executionLearningState,
  ).sort(
    (a, b) =>
      b.expectedRevenueGainUsd - a.expectedRevenueGainUsd || b.confidence - a.confidence || b.expectedTrafficGainPct - a.expectedTrafficGainPct,
  );
  const smartDecisionActionsRaw = smartDecisionActionsLearned.slice(0, 14);
  const execRows = loadSmartActionExecutions();
  const execById = new Map(execRows.map((r) => [r.actionId, r]));
  const smartDecisionActions = smartDecisionActionsRaw.map((a) => {
    const row = execById.get(a.id);
    return {
      ...a,
      executionStatus: (row?.status ?? "pending") as "pending" | "approved" | "executed",
      sprintQueued: row?.sprintQueued === true,
    };
  });
  const toolRoi = buildToolRoiRows(toolPerformance.topTools, 16);
  const performanceTriggers = buildPerformanceTriggers(performance, 16);
  const dailyPriorityActions = buildDailyPriorityActions({
    smart: smartDecisionActions,
    triggers: performanceTriggers,
    toolRoi,
  });
  const executionQueue = execRows;
  const executionHistory = loadExecutionHistory();
  const executionPerformance = buildExecutionPerformanceSummary(executionHistory);
  const toolImpactTracking = buildToolImpactRows(toolPerformance.topTools, performance, 16);
  const executionLearningSummary = {
    updatedAt: executionLearningState.updatedAt,
    kindMultiplierCount: Object.keys(executionLearningState.kindMultipliers).length,
    pathMultiplierCount: Object.keys(executionLearningState.pathMultipliers).length,
  };
  const safetyStatus = readSafetyStatus();
  const failingSystems = getSystemStatuses()
    .filter((s) => s.status === "failed")
    .map((s) => s.name);
  const lastErrorRow = readAutomationErrorLogs(1)[0];
  const systemHealth = {
    buildStatus: safetyStatus.buildStatus,
    typecheckStatus: safetyStatus.typecheckStatus,
    safeModeEnabled: safetyStatus.safeModeEnabled,
    lastError: safetyStatus.lastError ?? lastErrorRow?.message ?? null,
    failingModules: safetyStatus.failingModules,
    failingSystems,
  };
  const impactComparison = buildImpactComparisonSnapshot(sprintExecutionLog);
  const sprintMarkdown = buildSprintMarkdown({
    sprint: monetizationSprint,
    impact: impactComparison,
    learning: learningInsights,
  });
  const autoScalingOpportunities = buildAutoScalingOpportunities(learnedPatterns, performance, 20);
  const trendAnalysis = buildTrendSnapshot(revenueMemory, 8);
  const adsenseReadiness = buildAdsenseReadinessReport(performance);
  const adsenseHistory = appendAdsenseHistory(adsenseReadiness);
  const adsenseProgress = buildAdsenseProgress(adsenseHistory, adsenseReadiness.issues);
  const adsenseActions = buildAdsenseActions(adsenseReadiness.issues);
  const toolPageEnforcement = tools.slice(0, 40).map((t) =>
    enforceToolPageMonetization({
      path: `/tools/${t.slug}`,
      contentMarkdown: [t.description, ...(t.keywords ?? [])].join(" "),
    }),
  );
  const revenueAlerts: Array<{ level: "high" | "medium"; type: string; message: string; path?: string }> = [];
  for (const gap of monetizationGaps.slice(0, 4)) {
    revenueAlerts.push({
      level: "high",
      type: "no_monetization",
      path: gap.path,
      message: `Page has traffic but low monetization signal (RPM ${gap.rpm.toFixed(2)}).`,
    });
  }
  for (const low of lowRpmDetection.slice(0, 3)) {
    revenueAlerts.push({
      level: "medium",
      type: "low_rpm",
      path: low.path,
      message: `Low RPM detected on ${low.path}.`,
    });
  }
  if (toolPageEnforcement.some((r) => r.issues.includes("missing_internal_links"))) {
    revenueAlerts.push({
      level: "medium",
      type: "weak_internal_linking",
      message: "Some tool pages have weak internal linking support content.",
    });
  }
  if (adsenseReadiness.issues.some((i) => i.key === "content_depth")) {
    revenueAlerts.push({
      level: "high",
      type: "missing_cta_or_depth",
      message: "AdSense readiness flagged thin content or weak monetization depth.",
    });
  }
  if (adsenseReadiness.score < 75) {
    revenueAlerts.push({
      level: "high",
      type: "adsense_readiness_low",
      message: `AdSense readiness below threshold (${adsenseReadiness.score}/100).`,
    });
  }
  if (adsenseReadiness.issues.some((i) => i.key === "policy_pages")) {
    revenueAlerts.push({
      level: "high",
      type: "missing_policy_pages",
      message: "Missing policy pages detected for AdSense approval.",
    });
  }
  const businessMode = {
    enabled: businessModeEnabled(),
    policy: "Revenue-first prioritization. Low-value informational traffic is deprioritized when enabled.",
  };

  return {
    generatedAt: new Date().toISOString(),
    priorityEngineOrder: [
      "1. GSC signals (clicks / impressions / CTR overlap)",
      "2. RPM / revenue (aggregates.pageRevenue: GSC pipeline + optional AdSense CSV merge)",
      "3. Behavior signals (first-party scroll / dwell rollups)",
      "4. Intent + topic clusters (hub + pillar alignment)",
      "5. Decision-intent boost",
      "6. Monetization score (CPC proxy + tags for display)",
    ],
    overview: {
      blogCount: blogPosts.length,
      toolCount: tools.length,
      opportunityPoolSize: opp.opportunityPoolSize,
      topCpcKeywords: topCpc,
    },
    opportunityEngine: opp,
    growthLoop,
    behaviorPrActions: behavior ? buildBehaviorPrActionQueue(behavior.byPath, 14) : [],
    revenueLeaderboard: topPageRevenuePaths(performance, 12),
    refreshCandidates: findRefreshCandidates(performance, 10),
    programmaticQueue,
    programmaticPicks,
    scalingBlog,
    siteHealth: detectSiteHealthIssues(pages),
    cannibalization: detectTitleCannibalization(10),
    performanceHints: buildPerformanceHintsForTopPages(pages),
    serpGaps: buildSerpGapSuggestions(pages),
    backlink: backlinkEngineSummary(),
    toolProposals: { slugs: toolProposalSlugs() },
    prCommands: [
      "npm run content-engine:blog-pr",
      "npm run content-engine:growth-pr",
      "npm run content-engine:programmatic-pr",
      "npm run content-engine:scaling-pr",
      "npm run content-engine:tool-proposal-pr",
      "npm run content-engine:autofix-pr",
      "npm run content-engine:monetization-sprint-md",
      "npm run adsense:merge-csv -- path/to/adsense-pages.csv",
    ],
    clusterDomination: {
      summaries: clusterSummaries,
      totalPlannedIdeas,
    },
    outreachExecution: {
      queueSummary: summarizeOutreachQueue(),
      api: {
        queue: "GET /api/outreach/queue",
        draft: "POST /api/outreach/draft",
        approve: "POST /api/outreach/approve",
        send: "POST /api/outreach/send (confirmApproved + OUTREACH_DRY_RUN=0)",
        replied: "POST /api/outreach/replied",
      },
    },
    competitorIntelligence: {
      method: "POST",
      path: "/api/content-engine/competitor-analyze",
      bodyHint: "{ ourPath: string, competitorUrls: string[] }",
    },
    executionLayer,
    activeClusterMode: activeClusterSummary,
    conversionOptimization,
    highIntentMode,
    clusterPerformance,
    contentPruning,
    internalLinkBoost,
    topicDominationScores,
    winnerAmplification,
    lossPrevention,
    executionPriority,
    intentMatching,
    conversionTracking,
    authorityImpact,
    personalization,
    advancedRevenueOptimization,
    smartScaling,
    revenueFunnel,
    moneyPages,
    businessMode,
    clusterMoneyScores,
    weeklyDecisionActions,
    priorityExecutionPlan,
    businessCommandCenter,
    lowRpmDetection,
    pageTypeClassifier,
    monetizationGaps,
    adPlacementPlans,
    monetizationScorecard,
    monetizationSprint,
    sprintExecutionLog,
    impactComparison,
    learningInsights,
    sprintMarkdown,
    revenueMemory,
    learnedPatterns,
    autoScalingOpportunities,
    trendAnalysis,
    adsenseReadiness,
    adsenseHistory,
    adsenseProgress,
    adsenseActions,
    revenueAlerts,
    pagePerformance,
    gscSiteTrends,
    toolPerformance,
    revenueTracking,
    backlinkDiscovery,
    authorityTracking,
    smartDecisionActions,
    toolRoi,
    performanceTriggers,
    dailyPriorityActions,
    executionQueue,
    executionHistory,
    executionPerformance,
    toolImpactTracking,
    executionLearningSummary,
    systemHealth,
    failSafe: {
      rules: [
        "No production writes from API routes; artifacts land on git branches only.",
        "Blog/tool pipelines require quality gate before PR (scripts exit 0 on skip).",
        "Outreach: draft → approve → send; SMTP only when OUTREACH_DRY_RUN=0; daily cap enforced.",
        "RPM and behavior signals adjust ranking heuristics only - not on-page HTML.",
      ],
    },
    logsNote:
      "Structured logs: CONTENT_ENGINE / pipeline JSON on stdout in CI. Ship to your log drain (Datadog, Axiom, etc.) from the runner.",
    pageMetricsProvenance: {
      sourceLabel: performance?.source ?? null,
      updatedAt: performance?.updatedAt ?? null,
      hasPreviousWindow: Boolean(performance?.pagesPrevious?.length),
    },
    seoDataPlane,
    orphanLinkHints,
  };
}
