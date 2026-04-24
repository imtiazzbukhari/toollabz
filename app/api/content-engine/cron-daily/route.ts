import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { isCronEnabled } from "@/lib/content-engine/config";
import { prioritizeForPipeline, discoverKeywordOpportunities } from "@/lib/content-engine/opportunity-engine";
import { loadPerformanceAggregates } from "@/lib/content-engine/performance/load-aggregates";
import { clusterSummariesForApi } from "@/lib/content-engine/topic-clusters";
import { adsensePlacementMarkdownGuide, highRpmZoneHints } from "@/lib/content-engine/monetization/adsense-strategy";
import { findRefreshCandidates } from "@/lib/content-engine/funnel/content-refresh";
import { buildExpansionQueueFromAggregates } from "@/lib/content-engine/funnel/smart-expansion";
import { buildProcessingQueue } from "@/lib/content-engine/keyword-intelligence";
import { contentEngineLog } from "@/lib/content-engine/logging";
import { loadBehaviorAggregates } from "@/lib/content-engine/growth/load-behavior-aggregates";
import { buildContentPerformanceLoopSnapshot } from "@/lib/content-engine/growth/performance-content-loop";
import { buildProgrammaticExpansionQueue } from "@/lib/content-engine/growth/programmatic-expand";
import { buildBehaviorPrActionQueue } from "@/lib/content-engine/growth/behavior-actions";
import { buildGrowthActionQueueDocument } from "@/lib/content-engine/growth/markdown-action-queue";
import { topPageRevenuePaths } from "@/lib/content-engine/growth/revenue-priority";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily hook: planning + observability by default (no paid LLM calls unless explicitly enabled).
 * Wire your scheduler (Vercel Cron, GitHub Actions, etc.) with `CONTENT_ENGINE_CRON_ENABLED=1`.
 */
export async function GET(req: NextRequest) {
  const denied = assertContentEngineAuthorized(req);
  if (denied) return denied;

  const cronAck = isCronEnabled();
  if (!cronAck) {
    contentEngineLog({ type: "cron_daily", skipped: true, reason: "CONTENT_ENGINE_CRON_ENABLED not set" });
  } else {
    contentEngineLog({ type: "cron_daily", skipped: false });
  }

  /** Always return discovery data for authenticated callers (CI can build PRs without enabling server cron). */
  const opportunities = discoverKeywordOpportunities();
  const queue = buildProcessingQueue(opportunities, 40);
  const prioritized = prioritizeForPipeline(12);
  const performance = loadPerformanceAggregates();
  const behavior = loadBehaviorAggregates();
  const growthLoop = buildContentPerformanceLoopSnapshot(performance, behavior);
  const topicClusters = clusterSummariesForApi();
  const generate = process.env.CONTENT_ENGINE_CRON_GENERATE === "1";

  const refreshCandidates = findRefreshCandidates(performance, 12);
  const expansionQueue = performance?.pages?.length
    ? buildExpansionQueueFromAggregates(performance.pages, 8)
    : [];

  const monetizationLeaders = prioritized.slice(0, 8).map((p) => ({
    keyword: p.keyword,
    priority: p.priority,
    cpcScore: p.cpcScore ?? null,
    monetizationPotential: p.monetizationPotential ?? null,
    clusterId: p.clusterId ?? null,
    rpmBoost: p.rpmBoost ?? null,
  }));

  const behaviorPrActions = behavior ? buildBehaviorPrActionQueue(behavior.byPath, 14) : [];
  const ctrBlocks = growthLoop?.ctrQueue.slice(0, 12) ?? [];
  const programmaticPreview = performance?.pages?.length
    ? buildProgrammaticExpansionQueue(performance.pages, 4).map((p) => p.path)
    : [];
  const growthActionQueueMarkdown = buildGrowthActionQueueDocument({
    generatedAt: new Date().toISOString(),
    behaviorActions: behaviorPrActions,
    ctrBlocks,
    programmaticHeadline:
      programmaticPreview.length > 0
        ? `High-traffic parents for programmatic expansion (sample): ${programmaticPreview.join(", ")}`
        : "No programmatic queue yet (import GSC + grow clicks/impressions).",
  });

  return Response.json({
    ok: true,
    skipped: !cronAck,
    cronAcknowledged: cronAck,
    generate,
    stats: {
      opportunityCount: opportunities.length,
      queueHead: queue.slice(0, 10),
      prioritized,
      performanceSnapshotLoaded: Boolean(performance?.pages?.length),
      performanceUpdatedAt: performance?.updatedAt ?? null,
      topicClusters,
      monetizationLeaders,
      refreshCandidates,
      expansionQueue,
      growthLoop,
      behaviorPathsLoaded: behavior ? Object.keys(behavior.byPath).length : 0,
      behaviorPrActions,
      revenueLeaderboard: topPageRevenuePaths(performance, 12),
      growthActionQueueMarkdown,
    },
    hints: {
      blog: "POST /api/generate-blog with x-toollabz-secret after picking a topic from prioritized[]. Optional: intentStage (auto|awareness|comparison|decision), behaviorPath (/blog/slug or /tools/slug) to fold first-party engagement hints into the prompt.",
      sitemap: "Sitemap is registry-driven at /sitemap.xml; ping via POST /api/content-engine/ping-sitemap after deploy.",
      rollback: "Revert the git commit that added the article + run npm run blog:manifest.",
      adsensePlacement: adsensePlacementMarkdownGuide(),
      highRpmZones: highRpmZoneHints(),
      performanceJson:
        "Optional pagesPrevious in aggregates JSON: same shape as pages, prior period clicks — enables declining_clicks in refreshCandidates.",
      behaviorCollect:
        "POST /api/behavior/collect with JSON { ingestKey, events: [{ path, maxScroll, activeMs, lastSection? }] }. Set TOOLLABZ_BEHAVIOR_INGEST_KEY and NEXT_PUBLIC_TOOLLABZ_BEHAVIOR_INGEST_KEY to the same value. Optional CONTENT_ENGINE_BEHAVIOR_PERSIST=1 writes CONTENT_ENGINE_BEHAVIOR_JSON (or lib/content-engine/growth/behavior-aggregates.json).",
      growthLoop:
        "stats.growthLoop joins GSC queues: ctrQueue (SERP A/B ideas), programmaticQueue (numeric/geo/variations), expansionQueue (guides/FAQs/comparisons), engagementHints (from behavior rollups).",
      growthPr:
        "npm run content-engine:growth-pr — opens PR with lib/content-engine/action-queue/latest.md (CTR + behavior checklists, never auto-applied).",
      programmaticPr: "npm run content-engine:programmatic-pr — high-confidence programmatic blog via GET /api/content-engine/automation-bundle + generate-blog + PR.",
      scalingPr: "npm run content-engine:scaling-pr — expansion/scaling blog candidate from automation-bundle.",
      automationBundle: "GET /api/content-engine/automation-bundle (auth) returns programmaticPick + scalingBlog for CI.",
      pageRevenue:
        "Optional aggregates.pageRevenue[]: { path, rpm, earnings?, monetizedImpressions? } — feeds revenueLeaderboard + priority RPM boost. Populate from AdSense page export via npm run adsense:merge-csv -- export.csv.",
      autoFixPr:
        "npm run content-engine:autofix-pr — PR with lib/content-engine/auto-fix-queue/*.md from GET /api/content-engine/auto-fix-preview (CTR + behavior).",
      competitorAnalyze:
        "POST /api/content-engine/competitor-analyze — { ourPath, competitorUrls[] } returns heading gaps vs fetched competitors.",
      outreach:
        "POST /api/outreach/draft → approve → send (OUTREACH_DRY_RUN=0 + SMTP env). POST /api/outreach/replied when a thread responds.",
      activeClusters:
        "Set CONTENT_ENGINE_ACTIVE_CLUSTERS=cluster-a,cluster-b to temporarily focus prioritization on 1–2 clusters and ignore others.",
      highIntentMode:
        "Set CONTENT_ENGINE_HIGH_INTENT_MODE=1 to force action-driven decision content structure in blog generation.",
      fastApproval:
        "Set CONTENT_ENGINE_FAST_APPROVAL=1 to expose fast-approval eligible PR candidates in dashboard executionLayer.",
    },
  });
}
