import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { loadPerformanceAggregates } from "@/lib/content-engine/performance/load-aggregates";
import { buildProgrammaticExpansionQueue } from "@/lib/content-engine/growth/programmatic-expand";
import { pickHighConfidenceProgrammaticPicks } from "@/lib/content-engine/growth/programmatic-confidence";
import { buildExpansionQueueFromAggregates } from "@/lib/content-engine/funnel/smart-expansion";
import { pickScalingBlogCandidate } from "@/lib/content-engine/growth/expansion-scaling-pick";
import { blogPostSlugs } from "@/lib/blog/registry";
import { toolMap } from "@/lib/tools/data";
import { buildDashboardSnapshot } from "@/lib/content-engine/dashboard/build-dashboard-snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Machine-readable bundle for CI scripts (programmatic PR, scaling PR). Authenticated.
 */
export async function GET(req: NextRequest) {
  const denied = assertContentEngineAuthorized(req);
  if (denied) return denied;

  const performance = loadPerformanceAggregates();
  const pages = performance?.pages ?? [];
  const existingBlog = new Set(blogPostSlugs.map((s) => s.toLowerCase()));
  const existingTool = new Set([...toolMap.keys()].map((s) => s.toLowerCase()));

  const programmaticQueue = buildProgrammaticExpansionQueue(pages, 12);
  const programmaticPicks = pickHighConfidenceProgrammaticPicks(programmaticQueue, existingBlog, existingTool, 5);

  const expansionQueue = buildExpansionQueueFromAggregates(pages, 10);
  const scalingBlog = pickScalingBlogCandidate(expansionQueue, existingBlog);

  const dash = buildDashboardSnapshot();

  return Response.json({
    ok: true,
    programmaticPicks,
    programmaticPick: programmaticPicks[0] ?? null,
    scalingBlog,
    expansionQueueHead: expansionQueue.slice(0, 4),
    opportunities: dash.opportunityEngine.prioritized.slice(0, 16),
    toolIdeas: dash.opportunityEngine.toolIdeas,
    blogIdeas: dash.opportunityEngine.blogIdeas,
    keywordIntel: dash.opportunityEngine.keywordIntel,
    siteHealth: dash.siteHealth.slice(0, 16),
    cannibalization: dash.cannibalization,
    serpGaps: dash.serpGaps,
    refreshCandidates: dash.refreshCandidates,
    revenueLeaderboard: dash.revenueLeaderboard,
    backlink: dash.backlink,
    clusterDomination: dash.clusterDomination,
    outreachExecution: dash.outreachExecution,
    competitorIntelligence: dash.competitorIntelligence,
    executionLayer: dash.executionLayer,
    activeClusterMode: dash.activeClusterMode,
    conversionOptimization: dash.conversionOptimization,
    highIntentMode: dash.highIntentMode,
    clusterPerformance: dash.clusterPerformance,
    contentPruning: dash.contentPruning,
    internalLinkBoost: dash.internalLinkBoost,
    topicDominationScores: dash.topicDominationScores,
    winnerAmplification: dash.winnerAmplification,
    lossPrevention: dash.lossPrevention,
    executionPriority: dash.executionPriority,
    intentMatching: dash.intentMatching,
    conversionTracking: dash.conversionTracking,
    authorityImpact: dash.authorityImpact,
    personalization: dash.personalization,
    advancedRevenueOptimization: dash.advancedRevenueOptimization,
    smartScaling: dash.smartScaling,
    revenueFunnel: dash.revenueFunnel,
    moneyPages: dash.moneyPages,
    businessMode: dash.businessMode,
    clusterMoneyScores: dash.clusterMoneyScores,
    weeklyDecisionActions: dash.weeklyDecisionActions,
    priorityExecutionPlan: dash.priorityExecutionPlan,
    businessCommandCenter: dash.businessCommandCenter,
    lowRpmDetection: dash.lowRpmDetection,
    pageTypeClassifier: dash.pageTypeClassifier,
    monetizationGaps: dash.monetizationGaps,
    adPlacementPlans: dash.adPlacementPlans,
    monetizationScorecard: dash.monetizationScorecard,
    monetizationSprint: dash.monetizationSprint,
    sprintExecutionLog: dash.sprintExecutionLog,
    impactComparison: dash.impactComparison,
    learningInsights: dash.learningInsights,
    sprintMarkdown: dash.sprintMarkdown,
    revenueMemory: dash.revenueMemory,
    learnedPatterns: dash.learnedPatterns,
    autoScalingOpportunities: dash.autoScalingOpportunities,
    trendAnalysis: dash.trendAnalysis,
    dashboardGeneratedAt: dash.generatedAt,
  });
}
