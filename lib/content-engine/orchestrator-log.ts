import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const logsPath = path.join(root, "lib", "content-engine", "orchestrator-logs.json");
const statePath = path.join(root, "lib", "content-engine", "orchestrator-state.json");

export type OrchestratorLogEntry = {
  ts: string;
  step: "scan" | "classify" | "fix" | "skip" | "alert" | "analyze" | "optimize" | "monetize";
  system?: "orchestrator" | "seo-engine" | "monetization-engine" | "traffic-engine" | "backlink-engine" | "distribution-engine" | "behavior-engine";
  status?: "ok" | "skipped" | "failed";
  slug?: string;
  reason?: string;
  issueId?: string;
  category?: string;
  message: string;
  outcome?: "applied" | "skipped" | "failed";
  detail?: string;
};

export type OrchestratorIssue = {
  id: string;
  source: "runner_log" | "system_status" | "processed_tool";
  subsystem: string;
  message: string;
  category: string;
  toolSlug?: string;
  severity: "low" | "medium" | "high";
};

export type OrchestratorState = {
  updatedAt: string;
  healthScore: number;
  detectedIssues: OrchestratorIssue[];
  autoFixed: string[];
  unresolved: string[];
  lastScanSummary?: string;
  /** issueId or slug → last auto-fix attempt ISO time (cooldown) */
  retryCooldown?: Record<string, string>;
  /** slug -> last seo optimization attempt time */
  seoOptimizationCooldown?: Record<string, string>;
  /** slug -> last monetization attempt time */
  monetizationCooldown?: Record<string, string>;
  seoRanking?: Array<{ keyword: string; slug: string; trend: "up" | "down" | "stagnant"; lastChecked: string }>;
  optimizationActions?: Array<{ action: string; slug: string; time: string; status: "ok" | "skipped" | "failed"; reason?: string }>;
  monetization?: Array<{ slug: string; type: string; optimizationApplied: boolean; ts: string }>;
  optimizationImpact?: Array<{ slug: string; beforePosition: number; afterPosition: number; delta: number; status: "improved" | "flat" | "dropped" }>;
  seoFeedbackBaseline?: Record<string, { position: number; ts: string; cycles: number; strategy: string }>;
  revenueMetrics?: {
    pageViews: number;
    ctaClicks: number;
    conversions: number;
    conversionRate: number;
    topPages: Array<{ slug: string; views: number; ctaClicks: number; conversions: number }>;
  };
  trafficInsights?: Array<{ keyword: string; score: number; reason: string; suggestedSlug: string; type: string }>;
  backlinks?: Array<{ slug: string; targetDomain: string; status: string; ts: string }>;
  distribution?: Array<{ slug: string; platform: string; status: string; strategy: string; ts: string }>;
  behaviorMetrics?: {
    avgScrollDepth: number;
    avgTimeOnPage: number;
    totalPageViews: number;
    totalClicks: number;
  };
  ctaPerformance?: Array<{ slug: string; variantId: string; conversionRate: number; ctr: number; ts: string }>;
  revenueLive?: {
    totalRevenue: number;
    totalAffiliateClicks: number;
    totalConversions: number;
    topEarningPages: Array<{ slug: string; revenue: number; affiliateClicks: number; conversions: number }>;
  };
  outreachStatus?: { sent: number; replied: number; acquired: number };
  winnerPages?: Array<{ slug: string; score: number; reason: string }>;
  qualityScores?: Array<{ slug: string; overall: number; contentQuality: number; seoStrength: number; conversionPotential: number; lowQuality: boolean }>;
  nicheFocus?: { niche: string; confidence: number; effortShare: number };
  roiInsights?: Array<{ slug: string; roiScore: number; action: "boost" | "maintain" | "reduce" }>;
  strategy?: {
    mode: string;
    maxPostsPerDay: number;
    maxOutreachPerCycle: number;
    seoOptimizationLimit: number;
    monetizationLimit: number;
    qualityThreshold: number;
    randomnessFactor: number;
    skipProbability: number;
    behaviorSummary: string;
  };
  decisionInsights?: {
    focusReason: string;
    focusedSlugs: string[];
    ignoredSlugs: string[];
    riskWarnings: Array<{ type: string; severity: string; message: string }>;
    nicheValidation: {
      niche: string;
      growthValid: boolean;
      revenueValid: boolean;
      competitionValid: boolean;
      summary: string;
    };
    strategyOverride?: {
      nicheFocus?: string;
      roiWeightMultiplier?: number;
      modeOverride?: string;
      reason: string;
    };
  };
};

function safeReadJson<T>(file: string, fallback: T): T {
  try {
    if (!existsSync(file)) return fallback;
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export function readOrchestratorLogs(limit = 200): OrchestratorLogEntry[] {
  const rows = safeReadJson<OrchestratorLogEntry[]>(logsPath, []);
  return Array.isArray(rows) ? rows.slice(0, limit) : [];
}

export function appendOrchestratorLog(entry: Omit<OrchestratorLogEntry, "ts"> & { ts?: string }): void {
  const row: OrchestratorLogEntry = {
    ts: entry.ts ?? new Date().toISOString(),
    step: entry.step,
    system: entry.system,
    status: entry.status,
    slug: entry.slug,
    reason: entry.reason,
    issueId: entry.issueId,
    category: entry.category,
    message: entry.message,
    outcome: entry.outcome,
    detail: entry.detail,
  };
  const next = [row, ...readOrchestratorLogs(5000)].slice(0, 500);
  mkdirSync(path.dirname(logsPath), { recursive: true });
  writeFileSync(logsPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
}

export function readOrchestratorState(): OrchestratorState {
  return safeReadJson<OrchestratorState>(statePath, {
    updatedAt: "",
    healthScore: 100,
    detectedIssues: [],
    autoFixed: [],
    unresolved: [],
    retryCooldown: {},
    seoOptimizationCooldown: {},
    monetizationCooldown: {},
    seoRanking: [],
    optimizationActions: [],
    monetization: [],
    optimizationImpact: [],
    seoFeedbackBaseline: {},
    revenueMetrics: {
      pageViews: 0,
      ctaClicks: 0,
      conversions: 0,
      conversionRate: 0,
      topPages: [],
    },
    trafficInsights: [],
    backlinks: [],
    distribution: [],
    behaviorMetrics: {
      avgScrollDepth: 0,
      avgTimeOnPage: 0,
      totalPageViews: 0,
      totalClicks: 0,
    },
    ctaPerformance: [],
    revenueLive: {
      totalRevenue: 0,
      totalAffiliateClicks: 0,
      totalConversions: 0,
      topEarningPages: [],
    },
    outreachStatus: { sent: 0, replied: 0, acquired: 0 },
    winnerPages: [],
    qualityScores: [],
    nicheFocus: { niche: "general", confidence: 0, effortShare: 0.7 },
    roiInsights: [],
    strategy: {
      mode: "balanced",
      maxPostsPerDay: 2,
      maxOutreachPerCycle: 1,
      seoOptimizationLimit: 2,
      monetizationLimit: 2,
      qualityThreshold: 62,
      randomnessFactor: 1,
      skipProbability: 0.12,
      behaviorSummary: "medium activity with balanced quality and ROI",
    },
    decisionInsights: {
      focusReason: "",
      focusedSlugs: [],
      ignoredSlugs: [],
      riskWarnings: [],
      nicheValidation: {
        niche: "general",
        growthValid: false,
        revenueValid: false,
        competitionValid: false,
        summary: "",
      },
    },
  });
}

export function writeOrchestratorState(state: OrchestratorState): void {
  mkdirSync(path.dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}
