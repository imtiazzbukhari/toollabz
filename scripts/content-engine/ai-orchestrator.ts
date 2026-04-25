#!/usr/bin/env npx tsx
/**
 * AI Orchestrator: scans runner logs, system status, and processed tools every 60s,
 * classifies failures, applies allow-listed auto-fixes, and writes orchestrator-state + logs.
 */
import { createHash } from "node:crypto";
import { broadcastAlert } from "../../lib/content-engine/alerts";
import { applyAutoFix, applySitemapSubsystemFix } from "../../lib/content-engine/auto-fix";
import { classifyError, type ErrorCategory } from "../../lib/content-engine/error-classifier";
import {
  buildMonetizationActions,
  buildRevenueSummary,
  chooseCtaVariantForSlug,
  detectIntent,
  getBestCtaVariant,
  readCtaPerformance,
  recordRevenueSignal,
  recordCtaPerformance,
  readMonetizationSignals,
  recordMonetizationSignal,
} from "../../lib/content-engine/monetization-engine";
import { executeBacklinkOutreach, findBacklinkOpportunities, readBacklinks, summarizeOutreach, trackBacklinks } from "../../lib/content-engine/backlink-engine";
import { readBehavior, summarizeBehavior, trackBehavior } from "../../lib/content-engine/behavior-engine";
import {
  appendOrchestratorLog,
  readOrchestratorState,
  writeOrchestratorState,
  type OrchestratorIssue,
} from "../../lib/content-engine/orchestrator-log";
import { executeDistributionPosts, generateDistributionDrafts, readDistributionDrafts, recordDistributionDrafts } from "../../lib/content-engine/distribution-engine";
import {
  appendSeoOptimizationAction,
  buildOptimizationSuggestions,
  buildSeoRankings,
  detectRankingTrends,
  fetchCompetitorSnapshot,
  persistSeoRankings,
  refreshGscDataForSlugs,
} from "../../lib/content-engine/seo-ranking-engine";
import { detectTrafficOpportunities, persistTrafficOpportunities } from "../../lib/content-engine/traffic-engine";
import { detectWinnerPages, readRevenueLive, recordRevenueLive, summarizeRevenueLive } from "../../lib/content-engine/revenue-tracker";
import { computeQualityScores, detectTopNiche } from "../../lib/content-engine/quality-engine";
import { analyzeDecisionIntelligence } from "../../lib/content-engine/decision-engine";
import { enforceHardCaps, getGrowthStrategyConfig } from "../../lib/content-engine/strategy-config";
import { applyContentPatch } from "../../lib/content-engine/content-patcher";
import { buildInternalLinkPatchMarkdown, suggestInternalLinks } from "../../lib/content-engine/internal-linking-engine";
import { getSystemStatuses } from "../../lib/content-engine/system-status";
import {
  getPrStatusRows,
  getToolQueueData,
  readProcessedTools,
  readRunnerLogs,
} from "./lib/auto-runner-utils";

const LOOP_MS = 60_000;
const PR_RETRY_COOLDOWN_MS = 10 * 60 * 1000;
const SITEMAP_FIX_COOLDOWN_MS = 5 * 60 * 1000;
const SEO_OPT_COOLDOWN_MS = 6 * 60 * 60 * 1000;
const MONETIZATION_COOLDOWN_MS = 12 * 60 * 60 * 1000;
const MAX_SEO_OPTIMIZATIONS_PER_CYCLE = 3;
const MAX_MONETIZATION_UPDATES_PER_CYCLE = 2;
const FEEDBACK_CHECK_CYCLES = 3;
const MAX_DISTRIBUTION_DRAFTS_PER_CYCLE = 3;
const MAX_DISTRIBUTION_POSTS_PER_CYCLE = 2;
const MAX_OUTREACH_EMAILS_PER_CYCLE = 2;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const ms = randomInt(minMs, maxMs);
  await new Promise((r) => setTimeout(r, ms));
}

function issueId(parts: { source: string; subsystem: string; toolSlug?: string; message: string }): string {
  const raw = `${parts.source}|${parts.subsystem}|${parts.toolSlug ?? ""}|${parts.message}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 20);
}

function severityFor(category: ErrorCategory, source: string): "low" | "medium" | "high" {
  if (category === "missing_env") return "high";
  if (category === "github" || category === "rate_limit") return "medium";
  if (source === "system_status" && category !== "unknown") return "medium";
  return "low";
}

function resolveToolName(slug: string): string {
  const row = getToolQueueData().find((t) => t.toolSlug === slug);
  return row?.toolName?.trim() || slug;
}

function isCooldownReady(map: Record<string, string>, key: string, windowMs: number): boolean {
  const last = map[key];
  if (!last) return true;
  return Date.now() - Date.parse(last) >= windowMs;
}

function touchCooldown(map: Record<string, string>, key: string): Record<string, string> {
  return { ...map, [key]: new Date().toISOString() };
}

async function scanOnce(): Promise<void> {
  const strategy = enforceHardCaps(getGrowthStrategyConfig());
  let effectiveSeoOptimizationLimit = Math.min(strategy.seoOptimizationLimit, MAX_SEO_OPTIMIZATIONS_PER_CYCLE);
  let effectiveMonetizationLimit = Math.min(strategy.monetizationLimit, MAX_MONETIZATION_UPDATES_PER_CYCLE);
  let effectivePostLimit = Math.min(strategy.maxPostsPerDay, MAX_DISTRIBUTION_POSTS_PER_CYCLE);
  let effectiveOutreachLimit = Math.min(strategy.maxOutreachPerCycle, MAX_OUTREACH_EMAILS_PER_CYCLE);
  let effectiveRoiMultiplier = strategy.roiBoostMultiplier;
  let effectiveMode = strategy.mode;

  const prev = readOrchestratorState();
  const detected: OrchestratorIssue[] = [];
  const seen = new Set<string>();

  const pushIssue = (partial: Omit<OrchestratorIssue, "id" | "category" | "severity"> & { category?: ErrorCategory }) => {
    const classified = partial.category ?? classifyError(partial.message).category;
    const id = issueId({
      source: partial.source,
      subsystem: partial.subsystem,
      toolSlug: partial.toolSlug,
      message: partial.message,
    });
    if (seen.has(id)) return;
    seen.add(id);
    detected.push({
      id,
      source: partial.source,
      subsystem: partial.subsystem,
      message: partial.message,
      category: classified,
      toolSlug: partial.toolSlug,
      severity: severityFor(classified, partial.source),
    });
  };

  for (const log of readRunnerLogs().slice(0, 120)) {
    if (log.status !== "failed") continue;
    const msg = log.reason?.trim() || "runner_step_failed";
    const cat = classifyError(msg).category;
    pushIssue({
      source: "runner_log",
      subsystem: log.system,
      message: msg,
      toolSlug: log.toolSlug || undefined,
      category: cat,
    });
  }

  for (const sys of getSystemStatuses()) {
    if (sys.status !== "failed") continue;
    const primary = sys.errors?.[0]?.trim() || `${sys.name}_failed`;
    const cat = classifyError(primary).category;
    pushIssue({
      source: "system_status",
      subsystem: sys.name,
      message: primary,
      category: cat,
    });
  }

  for (const row of readProcessedTools().processed) {
    if (row.status !== "failed") continue;
    pushIssue({
      source: "processed_tool",
      subsystem: "auto-runner",
      message: `processed_tool_failed slug=${row.slug}`,
      toolSlug: row.slug,
      category: "unknown",
    });
  }

  const toolQueue = getToolQueueData();
  await refreshGscDataForSlugs(toolQueue.map((x) => x.toolSlug));
  const processedMap = new Map(readProcessedTools().processed.map((p) => [p.slug, p]));
  let openPrSet = new Set<string>();
  try {
    const prRows = await getPrStatusRows();
    openPrSet = new Set(prRows.filter((x) => x.status === "open").map((x) => x.slug));
  } catch {
    openPrSet = new Set<string>();
  }

  const seoRows = buildSeoRankings(
    toolQueue.map((tool) => {
      const proc = processedMap.get(tool.toolSlug);
      return {
        keyword: tool.toolName,
        slug: tool.toolSlug,
        processedStatus: proc?.status ?? "none",
        retryCount: proc?.retryCount ?? 0,
        hasOpenPr: openPrSet.has(tool.toolSlug),
      };
    }),
  );
  persistSeoRankings(seoRows);
  const rankingTrends = detectRankingTrends(seoRows);

  const autoFixed: string[] = [];
  const unresolved: string[] = [];
  let retryCooldown: Record<string, string> = { ...(prev.retryCooldown ?? {}) };
  let seoOptimizationCooldown: Record<string, string> = { ...(prev.seoOptimizationCooldown ?? {}) };
  let monetizationCooldown: Record<string, string> = { ...(prev.monetizationCooldown ?? {}) };
  const seoFeedbackBaseline: Record<string, { position: number; ts: string; cycles: number; strategy: string }> = {
    ...(prev.seoFeedbackBaseline ?? {}),
  };
  const prTouchedThisScan = new Set<string>();
  const optimizationActions: Array<{ action: string; slug: string; time: string; status: "ok" | "skipped" | "failed"; reason?: string }> = [];
  const optimizationImpact: Array<{ slug: string; beforePosition: number; afterPosition: number; delta: number; status: "improved" | "flat" | "dropped" }> = [];

  appendOrchestratorLog({
    step: "scan",
    message: `scan_complete issues=${detected.length}`,
  });

  const skipNonCriticalCycle = Math.random() < strategy.skipProbability && detected.length === 0;
  if (skipNonCriticalCycle) {
    appendOrchestratorLog({
      system: "orchestrator",
      step: "skip",
      status: "skipped",
      message: "humanized_cycle_skip_non_critical",
    });
  }

  for (const issue of detected) {
    appendOrchestratorLog({
      step: "classify",
      issueId: issue.id,
      category: issue.category,
      message: issue.message,
    });

    const toolName = issue.toolSlug ? resolveToolName(issue.toolSlug) : undefined;
    const ctx = {
      toolSlug: issue.toolSlug,
      toolName,
      rawMessage: issue.message,
    };

    if (issue.category === "missing_env") {
      unresolved.push(`${issue.id}: ${issue.message}`);
      broadcastAlert({
        level: "critical",
        source: "orchestrator",
        title: "Missing environment",
        message: issue.message,
        meta: { issueId: issue.id, subsystem: issue.subsystem },
      });
      appendOrchestratorLog({
        step: "skip",
        issueId: issue.id,
        category: issue.category,
        message: "missing_env_no_auto_fix",
        outcome: "skipped",
      });
      continue;
    }

    const isSitemapSubsystem =
      issue.subsystem === "sitemap-generator" ||
      /sitemap|ping/i.test(issue.message) ||
      (issue.source === "system_status" && issue.subsystem === "sitemap-generator");

    if (isSitemapSubsystem) {
      const key = "fix:sitemap";
      if (!isCooldownReady(retryCooldown, key, SITEMAP_FIX_COOLDOWN_MS)) {
        unresolved.push(`${issue.id}: sitemap_fix_cooldown`);
        continue;
      }
      const r = await applySitemapSubsystemFix();
      retryCooldown = touchCooldown(retryCooldown, key);
      if (r.applied) {
        autoFixed.push(`${issue.id}: ${r.action}`);
        appendOrchestratorLog({
          step: "fix",
          issueId: issue.id,
          category: issue.category,
          message: r.action,
          outcome: "applied",
          detail: r.detail,
        });
      } else {
        unresolved.push(`${issue.id}: ${r.reason}`);
        appendOrchestratorLog({
          step: "fix",
          issueId: issue.id,
          category: issue.category,
          message: r.reason,
          outcome: "failed",
        });
      }
      continue;
    }

    const needsPrStyleFix =
      issue.category === "github" ||
      issue.category === "rate_limit" ||
      issue.category === "network" ||
      issue.category === "invalid_data" ||
      issue.source === "processed_tool";

    if (needsPrStyleFix && issue.toolSlug) {
      if (prTouchedThisScan.has(issue.toolSlug)) {
        appendOrchestratorLog({
          step: "skip",
          issueId: issue.id,
          message: "pr_retry_same_scan_dedupe",
          outcome: "skipped",
        });
        continue;
      }
      const key = `pr:${issue.toolSlug}`;
      if (!isCooldownReady(retryCooldown, key, PR_RETRY_COOLDOWN_MS)) {
        appendOrchestratorLog({
          step: "skip",
          issueId: issue.id,
          message: "pr_retry_cooldown",
          outcome: "skipped",
        });
        continue;
      }
    }

    const fixCategory: ErrorCategory =
      issue.source === "processed_tool" && issue.category === "unknown" ? "github" : issue.category;

    if (fixCategory === "unknown" && !issue.toolSlug) {
      unresolved.push(`${issue.id}: unknown_no_context`);
      appendOrchestratorLog({
        step: "skip",
        issueId: issue.id,
        category: fixCategory,
        message: "no_auto_fix",
        outcome: "skipped",
      });
      continue;
    }

    if (needsPrStyleFix && issue.toolSlug) {
      retryCooldown = touchCooldown(retryCooldown, `pr:${issue.toolSlug}`);
      prTouchedThisScan.add(issue.toolSlug);
    }

    const result = await applyAutoFix(fixCategory, ctx);
    if (result.applied) {
      autoFixed.push(`${issue.id}: ${result.action}`);
      appendOrchestratorLog({
        step: "fix",
        issueId: issue.id,
        category: issue.category,
        message: result.action,
        outcome: "applied",
        detail: result.detail,
      });
      broadcastAlert({
        level: "info",
        source: "orchestrator",
        title: "Auto-fix applied",
        message: `${result.action} ${result.detail ?? ""}`.trim(),
        meta: { issueId: issue.id },
      });
    } else {
      if (result.critical) {
        broadcastAlert({
          level: "critical",
          source: "orchestrator",
          title: "Auto-fix blocked",
          message: result.reason,
          meta: { issueId: issue.id },
        });
      }
      unresolved.push(`${issue.id}: ${result.reason}`);
      appendOrchestratorLog({
        step: "fix",
        issueId: issue.id,
        category: issue.category,
        message: result.reason,
        outcome: "failed",
      });
    }
  }

  appendOrchestratorLog({
    system: "seo-engine",
    step: "analyze",
    status: "ok",
    message: `seo_scan rows=${seoRows.length}`,
  });

  let seoOptimizations = 0;
  let monetizationUpdates = 0;
  let competitorFetches = 0;
  const baseCandidateRows = [...seoRows].sort((a, b) => b.position - a.position);
  const preWinners = detectWinnerPages({
    rankingRows: baseCandidateRows.map((x) => ({ slug: x.slug, position: x.position, clicks: x.clicks, impressions: x.impressions })),
    ctaPerformance: readCtaPerformance(200).map((x) => ({ slug: x.slug, ctr: x.ctr, conversionRate: x.conversionRate })),
    revenueRows: readRevenueLive(300).map((x) => ({ slug: x.slug, estimatedRevenue: x.estimatedRevenue })),
  });
  const nicheFocus = detectTopNiche({
    winners: preWinners.map((x) => ({ slug: x.slug, score: x.score })),
    revenueRows: readRevenueLive(300).map((x) => ({ slug: x.slug, estimatedRevenue: x.estimatedRevenue })),
  });
  const nicheSlugSet = new Set(
    baseCandidateRows.filter((row) => row.slug.startsWith(`${nicheFocus.niche}-`)).map((row) => row.slug),
  );
  const prioritizedRows = [
    ...baseCandidateRows.filter((x) => nicheSlugSet.has(x.slug)),
    ...baseCandidateRows.filter((x) => !nicheSlugSet.has(x.slug)),
  ];
  const candidateRows = prioritizedRows;
  const trafficInsights = detectTrafficOpportunities(
    candidateRows.map((row) => ({
      slug: row.slug,
      keyword: row.keyword,
      impressions: row.impressions,
      clicks: row.clicks,
      position: row.position,
    })),
  );
  persistTrafficOpportunities(trafficInsights);
  appendOrchestratorLog({
    system: "traffic-engine",
    step: "analyze",
    status: "ok",
    message: `traffic_opportunities=${trafficInsights.length}`,
  });

  const backlinkCandidates = findBacklinkOpportunities(
    candidateRows.slice(0, 8).map((row) => ({ slug: row.slug, keyword: row.keyword, position: row.position })),
  );
  trackBacklinks(backlinkCandidates);
  appendOrchestratorLog({
    system: "backlink-engine",
    step: "analyze",
    status: "ok",
    message: `backlink_opportunities=${backlinkCandidates.length}`,
  });

  const distributionCandidates = trafficInsights.slice(0, MAX_DISTRIBUTION_DRAFTS_PER_CYCLE);
  const distributionDrafts = distributionCandidates.flatMap((item) => generateDistributionDrafts({ slug: item.suggestedSlug, keyword: item.keyword }));
  recordDistributionDrafts(distributionDrafts);
  let postedRows: Array<{ slug: string; platform: string; status: "posted" | "skipped"; reason?: string }> = [];
  let outreachExec: Array<{ slug: string; targetDomain: string; status: "sent" | "skipped"; reason?: string }> = [];
  if (!skipNonCriticalCycle) {
    await randomDelay(Math.round(500 * strategy.randomnessFactor), Math.round(1900 * strategy.randomnessFactor));
    postedRows = executeDistributionPosts(randomInt(1, Math.max(1, effectivePostLimit)));
    await randomDelay(Math.round(450 * strategy.randomnessFactor), Math.round(1600 * strategy.randomnessFactor));
    outreachExec = await executeBacklinkOutreach(randomInt(1, Math.max(1, effectiveOutreachLimit)));
  }
  appendOrchestratorLog({
    system: "distribution-engine",
    step: "optimize",
    status: "ok",
    message: `distribution_drafts=${distributionDrafts.length} posted=${postedRows.length} safe_mode=true`,
  });
  appendOrchestratorLog({
    system: "backlink-engine",
    step: "optimize",
    status: "ok",
    message: `outreach_sent=${outreachExec.filter((x) => x.status === "sent").length}`,
  });
  const liveRevenueRows = readRevenueLive(500);
  const liveRevenueMap = new Map<string, number>();
  for (const r of liveRevenueRows) liveRevenueMap.set(r.slug, (liveRevenueMap.get(r.slug) ?? 0) + r.estimatedRevenue);
  let decisionInsights = analyzeDecisionIntelligence({
    rows: candidateRows.map((row) => ({
      slug: row.slug,
      position: row.position,
      trend: row.trend,
      impressions: row.impressions,
      clicks: row.clicks,
      revenue: liveRevenueMap.get(row.slug) ?? 0,
      roiScore: (liveRevenueMap.get(row.slug) ?? 0) * 1.5 + (row.clicks ?? 0) * 0.25,
      niche: row.slug.split("-")[0] || "general",
    })),
    currentNiche: nicheFocus.niche,
    currentMode: strategy.mode,
    recentOptimizations: (prev.optimizationActions ?? []).slice(0, 5).length,
    recentPosts: postedRows.length,
    recentOutreach: outreachExec.filter((x) => x.status === "sent").length,
  });
  if (decisionInsights.strategyOverride?.modeOverride) {
    effectiveMode = decisionInsights.strategyOverride.modeOverride;
    if (effectiveMode === "conservative") {
      effectiveSeoOptimizationLimit = 1;
      effectiveMonetizationLimit = 1;
      effectivePostLimit = Math.min(1, effectivePostLimit);
      effectiveOutreachLimit = Math.min(1, effectiveOutreachLimit);
      effectiveRoiMultiplier = Math.min(effectiveRoiMultiplier, 1);
    }
    if (effectiveMode === "aggressive") {
      effectiveSeoOptimizationLimit = MAX_SEO_OPTIMIZATIONS_PER_CYCLE;
      effectiveMonetizationLimit = MAX_MONETIZATION_UPDATES_PER_CYCLE;
      effectivePostLimit = MAX_DISTRIBUTION_POSTS_PER_CYCLE;
      effectiveOutreachLimit = MAX_OUTREACH_EMAILS_PER_CYCLE;
      effectiveRoiMultiplier = Math.max(effectiveRoiMultiplier, 1.2);
    }
  }
  const focusedSet = new Set(decisionInsights.focusedSlugs);
  const ignoredSet = new Set(decisionInsights.ignoredSlugs);
  for (const row of candidateRows) {
    if (skipNonCriticalCycle) break;
    if (seoOptimizations >= effectiveSeoOptimizationLimit) break;
    if (ignoredSet.has(row.slug) && !focusedSet.has(row.slug)) {
      appendOrchestratorLog({
        system: "seo-engine",
        step: "skip",
        status: "skipped",
        slug: row.slug,
        message: "decision_engine_ignored_low_impact_or_unstable",
      });
      continue;
    }
    const highValuePage = (row.impressions ?? 0) >= 150 || detectIntent(row.keyword, row.slug) === "commercial";
    if (row.trend !== "down" && !highValuePage) continue;
    const key = `seo:${row.slug}`;
    if (!isCooldownReady(seoOptimizationCooldown, key, SEO_OPT_COOLDOWN_MS)) {
      appendOrchestratorLog({
        system: "seo-engine",
        step: "optimize",
        status: "skipped",
        slug: row.slug,
        reason: "seo_optimization_cooldown",
        message: `skip optimize ${row.slug}`,
      });
      continue;
    }
    const competitor = competitorFetches < 1 ? await fetchCompetitorSnapshot(row.keyword) : null;
    if (competitor) competitorFetches += 1;
    const suggestions = buildOptimizationSuggestions(row, competitor);
    const linkSuggestions = suggestInternalLinks(
      { slug: row.slug, keyword: row.keyword },
      candidateRows.map((x) => ({ slug: x.slug, keyword: x.keyword })),
      3,
    );
    const internalLinkPatch = buildInternalLinkPatchMarkdown(linkSuggestions);

    const beforePosition = row.position;
    const seoPatch = applyContentPatch(row.slug, {
      title: "SEO Optimization Update",
      markdown: suggestions.map((s) => `- ${s}`).join("\n"),
      source: "seo",
    });
    const linkPatch = internalLinkPatch
      ? applyContentPatch(row.slug, {
          title: "Internal Linking Suggestions",
          markdown: internalLinkPatch,
          source: "internal-linking",
        })
      : { ok: true, reason: "no_internal_links", beforeSize: 0, afterSize: 0, filePath: "", slug: row.slug };

    const patchStatus = seoPatch.ok && linkPatch.ok ? "ok" : "failed";
    appendSeoOptimizationAction({
      action: row.indexed ? "optimize_headings" : "indexing_recovery",
      slug: row.slug,
      keyword: row.keyword,
      suggestions,
      ts: new Date().toISOString(),
      status: patchStatus,
      reason: !row.indexed ? "not_indexed" : seoPatch.reason ?? linkPatch.reason,
    });
    optimizationActions.push({
      action: row.indexed ? "optimize_headings" : "indexing_recovery",
      slug: row.slug,
      time: new Date().toISOString(),
      status: patchStatus,
      reason: !row.indexed ? "not_indexed" : seoPatch.reason ?? linkPatch.reason,
    });
    seoFeedbackBaseline[row.slug] = {
      position: beforePosition,
      ts: new Date().toISOString(),
      cycles: 0,
      strategy: row.indexed ? "content_patch" : "indexing_recovery",
    };
    seoOptimizationCooldown = touchCooldown(seoOptimizationCooldown, key);
    seoOptimizations += 1;

    appendOrchestratorLog({
      system: "seo-engine",
      step: "optimize",
      status: patchStatus,
      slug: row.slug,
      message: `optimization_applied trend=${row.trend} source=${row.source}`,
      reason: seoPatch.reason ?? linkPatch.reason,
      detail: `before_position=${beforePosition} patch_sizes=${seoPatch.beforeSize}->${seoPatch.afterSize}`,
    });

    if (!row.indexed) {
      const sitemapKey = "fix:sitemap";
      if (isCooldownReady(retryCooldown, sitemapKey, SITEMAP_FIX_COOLDOWN_MS)) {
        const sr = await applySitemapSubsystemFix();
        retryCooldown = touchCooldown(retryCooldown, sitemapKey);
        appendOrchestratorLog({
          system: "seo-engine",
          step: "optimize",
          status: sr.applied ? "ok" : "failed",
          slug: row.slug,
          reason: sr.applied ? undefined : sr.reason,
          message: sr.applied ? "sitemap_recovery_applied" : "sitemap_recovery_failed",
        });
      }
    }
  }

  for (const [slug, baseline] of Object.entries(seoFeedbackBaseline)) {
    const nowRow = seoRows.find((r) => r.slug === slug);
    if (!nowRow) continue;
    const cycles = baseline.cycles + 1;
    seoFeedbackBaseline[slug] = { ...baseline, cycles };
    if (cycles < FEEDBACK_CHECK_CYCLES) continue;
    const afterPosition = nowRow.position;
    const delta = baseline.position - afterPosition;
    const status = delta > 0 ? "improved" : delta < 0 ? "dropped" : "flat";
    optimizationImpact.unshift({
      slug,
      beforePosition: baseline.position,
      afterPosition,
      delta,
      status,
    });
    appendOrchestratorLog({
      system: "seo-engine",
      step: "analyze",
      status: status === "improved" ? "ok" : "skipped",
      slug,
      message: `feedback_${status}`,
      reason: `delta=${delta}`,
    });
    if (status !== "improved") {
      // allow another strategy pass sooner by resetting cooldown.
      seoOptimizationCooldown[(`seo:${slug}`)] = new Date(Date.now() - SEO_OPT_COOLDOWN_MS).toISOString();
    }
    delete seoFeedbackBaseline[slug];
  }

  const monetizationRows = [];
  for (const row of candidateRows) {
    if (skipNonCriticalCycle) break;
    if (monetizationUpdates >= effectiveMonetizationLimit) break;
    if (ignoredSet.has(row.slug) && !focusedSet.has(row.slug)) continue;
    const intent = detectIntent(row.keyword, row.slug);
    const key = `mon:${row.slug}`;
    if (!isCooldownReady(monetizationCooldown, key, MONETIZATION_COOLDOWN_MS)) {
      appendOrchestratorLog({
        system: "monetization-engine",
        step: "monetize",
        status: "skipped",
        slug: row.slug,
        reason: "monetization_cooldown",
        message: "skip monetization",
      });
      continue;
    }
    const actions = buildMonetizationActions(intent);
    const applicable = intent === "commercial" && actions.length > 0;
    const ctaVariant = chooseCtaVariantForSlug(row.slug);
    const signal = {
      slug: row.slug,
      keyword: row.keyword,
      type: intent,
      optimizationApplied: applicable,
      ts: new Date().toISOString(),
      actions,
      reason: applicable ? undefined : "intent_not_commercial",
    } as const;
    recordMonetizationSignal(signal);
    if (applicable) {
      applyContentPatch(row.slug, {
        title: "Monetization Blocks",
        markdown: [...actions.map((x) => `- ${x}`), `- Active CTA Variant (${ctaVariant.id}): ${ctaVariant.text}`].join("\n"),
        source: "monetization",
      });
    }
    const syntheticViews = Math.max(10, Math.round((row.impressions ?? 0) * 0.6) || 25);
    const syntheticClicks = Math.max(0, Math.round((row.clicks ?? 0) * 0.8) || (applicable ? 2 : 0));
    const syntheticConversions = applicable ? Math.max(0, Math.round(syntheticClicks * 0.12)) : 0;
    recordRevenueSignal({
      slug: row.slug,
      pageViews: syntheticViews,
      ctaClicks: syntheticClicks,
      conversions: syntheticConversions,
    });
    recordRevenueLive({
      slug: row.slug,
      affiliateClicks: Math.max(0, Math.round(syntheticClicks * 0.5)),
      conversions: syntheticConversions,
      estimatedRevenue: syntheticConversions * 2.8,
    });
    recordCtaPerformance({
      slug: row.slug,
      variantId: ctaVariant.id,
      label: ctaVariant.label,
      impressions: syntheticViews,
      clicks: syntheticClicks,
      conversions: syntheticConversions,
    });
    trackBehavior({
      slug: row.slug,
      pageViews: syntheticViews,
      scrollDepth: Math.max(35, Math.min(95, Math.round(45 + syntheticClicks * 2))),
      clicks: syntheticClicks,
      timeOnPage: Math.max(20, Math.round(40 + syntheticViews * 0.8)),
    });
    monetizationRows.push({
      slug: signal.slug,
      type: signal.type,
      optimizationApplied: signal.optimizationApplied,
      ts: signal.ts,
    });
    if (applicable) {
      monetizationCooldown = touchCooldown(monetizationCooldown, key);
      monetizationUpdates += 1;
      appendOrchestratorLog({
        system: "monetization-engine",
        step: "monetize",
        status: "ok",
        slug: row.slug,
        message: "monetization_actions_generated",
      });
    } else {
      appendOrchestratorLog({
        system: "monetization-engine",
        step: "monetize",
        status: "skipped",
        slug: row.slug,
        reason: "non_commercial_or_no_actions",
        message: "monetization_skipped",
      });
    }
  }

  const failedSystems = getSystemStatuses().filter((s) => s.status === "failed").length;
  const revenueMetrics = buildRevenueSummary(10);
  const revenueLive = summarizeRevenueLive(600);
  const behaviorMetrics = summarizeBehavior(400);
  const ctaPerformance = readCtaPerformance(500)
    .slice(0, 120)
    .filter((row, idx, arr) => idx === arr.findIndex((x) => x.slug === row.slug && x.variantId === row.variantId))
    .slice(0, 40)
    .map((x) => ({
      slug: x.slug,
      variantId: x.variantId,
      conversionRate: x.conversionRate,
      ctr: x.ctr,
      ts: x.ts,
    }));

  const quality = computeQualityScores({
    rankingRows: candidateRows.map((x) => ({ slug: x.slug, position: x.position, trend: x.trend, impressions: x.impressions, clicks: x.clicks })),
    ctaRows: ctaPerformance.map((x) => ({ slug: x.slug, ctr: x.ctr, conversionRate: x.conversionRate })),
    revenueRows: readRevenueLive(500).map((x) => ({ slug: x.slug, estimatedRevenue: x.estimatedRevenue })),
    behaviorRows: readBehavior(500).map((x) => ({
      slug: x.slug,
      scrollDepth: x.scrollDepth,
      timeOnPage: x.timeOnPage,
      pageViews: x.pageViews,
    })),
    threshold: strategy.qualityThreshold,
  });

  for (const row of candidateRows.slice(0, 5)) {
    const best = getBestCtaVariant(row.slug);
    if (!best) continue;
    appendOrchestratorLog({
      system: "monetization-engine",
      step: "optimize",
      status: "ok",
      slug: row.slug,
      message: `cta_best_variant=${best.variantId}`,
      reason: `conv_rate=${best.conversionRate}`,
    });
  }
  const winnerPages = detectWinnerPages({
    rankingRows: candidateRows.map((x) => ({ slug: x.slug, position: x.position, clicks: x.clicks, impressions: x.impressions })),
    ctaPerformance: ctaPerformance.map((x) => ({ slug: x.slug, ctr: x.ctr, conversionRate: x.conversionRate })),
    revenueRows: readRevenueLive(500).map((x) => ({ slug: x.slug, estimatedRevenue: x.estimatedRevenue })),
  });
  const roiInsights = candidateRows.slice(0, 40).map((row) => {
    const rev = revenueLive.topEarningPages.find((x) => x.slug === row.slug)?.revenue ?? 0;
    const clicks = row.clicks ?? 0;
    const effortPenalty = quality.lowQualitySlugs.includes(row.slug) ? 18 : 8;
    const roiScore = Number((rev * 2 * effectiveRoiMultiplier + clicks * 0.3 - effortPenalty).toFixed(2));
    return {
      slug: row.slug,
      roiScore,
      action: roiScore > 25 ? ("boost" as const) : roiScore < 5 ? ("reduce" as const) : ("maintain" as const),
    };
  });
  for (const lowSlug of quality.lowQualitySlugs.slice(0, strategy.mode === "conservative" ? 1 : 2)) {
    if (skipNonCriticalCycle) break;
    applyContentPatch(lowSlug, {
      title: "Quality Re-Optimization",
      markdown:
        "- Improve clarity in intro and examples.\n- Add one SEO-focused section and one conversion-focused section.\n- Strengthen CTA context with user intent wording.",
      source: "seo",
    });
    appendOrchestratorLog({
      system: "seo-engine",
      step: "optimize",
      status: "ok",
      slug: lowSlug,
      message: "quality_threshold_reoptimization_applied",
    });
  }
  const winnerNiche = decisionInsights.strategyOverride?.nicheFocus || nicheFocus.niche;
  const winnerCandidates = winnerPages.filter((w) => w.slug.startsWith(`${winnerNiche}-`) || focusedSet.has(w.slug));
  for (const winner of (winnerCandidates.length ? winnerCandidates : winnerPages).slice(0, Math.max(1, strategy.winnerBoostIntensity))) {
    applyContentPatch(winner.slug, {
      title: "Winner Page Expansion",
      markdown:
        "- Add 2-3 contextual internal links near the first CTA.\n- Move the highest-performing CTA block above the fold.\n- Expand actionable examples section by 150+ words.",
      source: "seo",
    });
    appendOrchestratorLog({
      system: "seo-engine",
      step: "optimize",
      status: "ok",
      slug: winner.slug,
      message: "winner_page_aggressive_safe_optimization",
      reason: winner.reason,
    });
  }
  decisionInsights = {
    ...decisionInsights,
    focusedSlugs: roiInsights.filter((x) => x.action === "boost").map((x) => x.slug).slice(0, 12),
  };
  const outreachStatus = summarizeOutreach(readBacklinks(500));
  appendOrchestratorLog({
    system: "behavior-engine",
    step: "analyze",
    status: "ok",
    message: `behavior_views=${behaviorMetrics.totalPageViews} clicks=${behaviorMetrics.totalClicks}`,
  });
  for (const risk of decisionInsights.riskWarnings) {
    appendOrchestratorLog({
      system: "orchestrator",
      step: "alert",
      status: risk.severity === "high" ? "failed" : "skipped",
      message: `decision_risk_${risk.type}`,
      reason: risk.message,
    });
  }

  let health = 100;
  health -= failedSystems * 15;
  health -= Math.min(50, unresolved.length * 10);
  const stillOpenSignals = Math.max(0, detected.length - autoFixed.length);
  health -= Math.min(20, rankingTrends.filter((x) => x.trend === "down").length * 2);
  health -= Math.min(15, stillOpenSignals * 2);
  health -= Math.min(12, decisionInsights.riskWarnings.length * 3);
  health = Math.max(0, Math.min(100, Math.round(health)));

  writeOrchestratorState({
    updatedAt: new Date().toISOString(),
    healthScore: health,
    detectedIssues: detected,
    autoFixed,
    unresolved,
    lastScanSummary: `detected=${detected.length} fixed=${autoFixed.length} open=${unresolved.length}`,
    retryCooldown,
    seoOptimizationCooldown,
    monetizationCooldown,
    seoFeedbackBaseline,
    seoRanking: rankingTrends.slice(0, 80),
    optimizationActions: optimizationActions.slice(0, 80),
    optimizationImpact: [...optimizationImpact, ...(prev.optimizationImpact ?? [])].slice(0, 80),
    monetization: monetizationRows.length ? monetizationRows : readMonetizationSignals(80).map((x) => ({
      slug: x.slug,
      type: x.type,
      optimizationApplied: x.optimizationApplied,
      ts: x.ts,
    })),
    revenueMetrics,
    trafficInsights: trafficInsights.slice(0, 30).map((x) => ({
      keyword: x.keyword,
      score: x.score,
      reason: x.reason,
      suggestedSlug: x.suggestedSlug,
      type: x.type,
    })),
    backlinks: readBacklinks(80).map((x) => ({
      slug: x.slug,
      targetDomain: x.targetDomain,
      status: x.status,
      ts: x.ts,
    })),
    distribution: readDistributionDrafts(80).map((x) => ({
      slug: x.slug,
      platform: x.platform,
      status: x.status,
      strategy: x.strategy,
      ts: x.ts,
    })),
    behaviorMetrics,
    ctaPerformance,
    revenueLive,
    outreachStatus,
    winnerPages,
    qualityScores: quality.rows.slice(0, 60).map((x) => ({
      slug: x.slug,
      overall: x.overall,
      contentQuality: x.contentQuality,
      seoStrength: x.seoStrength,
      conversionPotential: x.conversionPotential,
      lowQuality: x.lowQuality,
    })),
    nicheFocus: { niche: nicheFocus.niche, confidence: nicheFocus.confidence, effortShare: 0.7 },
    roiInsights: roiInsights.slice(0, 60),
    strategy: {
      mode: effectiveMode,
      maxPostsPerDay: effectivePostLimit,
      maxOutreachPerCycle: effectiveOutreachLimit,
      seoOptimizationLimit: effectiveSeoOptimizationLimit,
      monetizationLimit: effectiveMonetizationLimit,
      qualityThreshold: strategy.qualityThreshold,
      randomnessFactor: strategy.randomnessFactor,
      skipProbability: strategy.skipProbability,
      behaviorSummary: strategy.behaviorSummary,
    },
    decisionInsights,
  });
}

async function main(): Promise<void> {
  console.info("[ai-orchestrator] starting loop interval_ms=", LOOP_MS);
  broadcastAlert({
    level: "info",
    source: "orchestrator",
    title: "Orchestrator started",
    message: `pid=${process.pid}`,
  });
  for (;;) {
    try {
      await scanOnce();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      appendOrchestratorLog({ step: "alert", message: `scan_error ${msg}`, outcome: "failed" });
      broadcastAlert({
        level: "warn",
        source: "orchestrator",
        title: "Scan error",
        message: msg,
      });
    }
    await new Promise((r) => setTimeout(r, LOOP_MS));
  }
}

void main();
