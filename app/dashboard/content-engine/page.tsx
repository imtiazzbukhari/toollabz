"use client";

import { useEffect, useState } from "react";

type ProcessedTool = {
  slug: string;
  hash: string;
  status: "success" | "failed";
  retryCount: number;
  lastAttempt: string;
  processedAt: string;
};

type PrStatus = {
  slug: string;
  status: "open" | "merged" | "closed" | "failed";
  createdAt: string;
  url?: string;
};

type RunnerLog = {
  ts: string;
  system: string;
  step: "scan" | "skip" | "create";
  toolSlug: string;
  status: "ok" | "failed";
  reason?: string;
};

type AiSystem = {
  name: string;
  status: "running" | "failed" | "idle";
  lastRun: string;
  errors: string[];
};

type OrchestratorIssueRow = {
  id: string;
  source: string;
  subsystem: string;
  message: string;
  category: string;
  toolSlug?: string;
  severity: string;
};

type OrchestratorPayload = {
  healthScore?: number;
  detectedIssues?: OrchestratorIssueRow[];
  autoFixed?: string[];
  unresolved?: string[];
  lastScanSummary?: string;
  updatedAt?: string;
  seoRanking?: Array<{ keyword: string; slug: string; trend: "up" | "down" | "stagnant"; lastChecked: string }>;
  optimizationActions?: Array<{ action: string; slug: string; time: string; status: "ok" | "skipped" | "failed"; reason?: string }>;
  monetization?: Array<{ slug: string; type: string; optimizationApplied: boolean; ts: string }>;
  optimizationImpact?: Array<{ slug: string; beforePosition: number; afterPosition: number; delta: number; status: "improved" | "flat" | "dropped" }>;
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

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  const json = (await res.json()) as T;
  return json;
}

export default function ContentEngineDashboardPage() {
  const [processed, setProcessed] = useState<ProcessedTool[]>([]);
  const [prRows, setPrRows] = useState<PrStatus[]>([]);
  const [logs, setLogs] = useState<RunnerLog[]>([]);
  const [systems, setSystems] = useState<AiSystem[]>([]);
  const [orchestrator, setOrchestrator] = useState<OrchestratorPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [p, s, l, h, o] = await Promise.all([
          fetchJson<{ processed?: ProcessedTool[] }>("/api/content-engine/processed-tools"),
          fetchJson<{ rows?: PrStatus[] }>("/api/content-engine/pr-status"),
          fetchJson<{ logs?: RunnerLog[] }>("/api/content-engine/runner-logs"),
          fetchJson<{ systems?: AiSystem[] }>("/api/content-engine/health"),
          fetchJson<OrchestratorPayload>("/api/content-engine/orchestrator"),
        ]);
        if (!active) return;
        setProcessed(Array.isArray(p.processed) ? p.processed : []);
        setPrRows(Array.isArray(s.rows) ? s.rows : []);
        setLogs(Array.isArray(l.logs) ? l.logs : []);
        setSystems(Array.isArray(h.systems) ? h.systems : []);
        setOrchestrator(o);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
      }
    }
    void load();
    const timer = setInterval(() => {
      void load();
    }, 10000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Content Engine Dashboard</h1>
      {error ? <p className="rounded border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <section>
        <h2 className="mb-2 text-lg font-medium">AI Master Control</h2>
        <p className="mb-3 text-sm text-slate-600">
          Orchestrator snapshot from <code className="rounded bg-slate-100 px-1">npm run content-engine:orchestrator</code> (updates{" "}
          <code className="rounded bg-slate-100 px-1">orchestrator-state.json</code>).
        </p>
        {orchestrator ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border border-slate-200 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Health score</p>
              <p
                className={`mt-1 text-3xl font-semibold ${
                  (orchestrator.healthScore ?? 0) >= 80
                    ? "text-emerald-700"
                    : (orchestrator.healthScore ?? 0) >= 50
                      ? "text-amber-700"
                      : "text-rose-700"
                }`}
              >
                {orchestrator.healthScore ?? "—"}
              </p>
              <p className="mt-1 text-xs text-slate-500">{orchestrator.lastScanSummary || orchestrator.updatedAt || "No scan yet"}</p>
            </div>
            <div className="rounded border border-slate-200 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Detected (last tick)</p>
              <p className="mt-1 text-3xl font-semibold text-slate-800">{orchestrator.detectedIssues?.length ?? 0}</p>
            </div>
            <div className="rounded border border-slate-200 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Auto-fixed</p>
              <p className="mt-1 text-3xl font-semibold text-emerald-700">{orchestrator.autoFixed?.length ?? 0}</p>
            </div>
            <div className="rounded border border-slate-200 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Unresolved</p>
              <p className="mt-1 text-3xl font-semibold text-rose-700">{orchestrator.unresolved?.length ?? 0}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Loading orchestrator state…</p>
        )}
        {orchestrator?.detectedIssues?.length ? (
          <div className="mt-4 overflow-x-auto rounded border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-2 text-left">category</th>
                  <th className="px-3 py-2 text-left">subsystem</th>
                  <th className="px-3 py-2 text-left">toolSlug</th>
                  <th className="px-3 py-2 text-left">message</th>
                </tr>
              </thead>
              <tbody>
                {orchestrator.detectedIssues.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200">
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2">{row.subsystem}</td>
                    <td className="px-3 py-2">{row.toolSlug ?? "-"}</td>
                    <td className="max-w-md truncate px-3 py-2" title={row.message}>
                      {row.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : orchestrator?.updatedAt ? (
          <p className="mt-3 text-sm text-slate-500">No issues in the last orchestrator scan.</p>
        ) : null}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Strategy Mode Indicator</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Current Mode</p>
            <p className="mt-1 text-2xl font-semibold capitalize">{orchestrator?.strategy?.mode ?? "balanced"}</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Posting / Outreach</p>
            <p className="mt-1 text-xl font-semibold">
              {orchestrator?.strategy?.maxPostsPerDay ?? 0} / {orchestrator?.strategy?.maxOutreachPerCycle ?? 0}
            </p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">SEO / Monetization Limits</p>
            <p className="mt-1 text-xl font-semibold">
              {orchestrator?.strategy?.seoOptimizationLimit ?? 0} / {orchestrator?.strategy?.monetizationLimit ?? 0}
            </p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Quality Threshold</p>
            <p className="mt-1 text-xl font-semibold">{orchestrator?.strategy?.qualityThreshold ?? 0}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          {orchestrator?.strategy?.behaviorSummary ?? "medium activity with balanced quality and ROI"} (randomness{" "}
          {orchestrator?.strategy?.randomnessFactor ?? 1}, skip probability {orchestrator?.strategy?.skipProbability ?? 0})
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Decision Insights</h2>
        <div className="rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Focus reason:</span> {orchestrator?.decisionInsights?.focusReason || "No decision context yet."}
          </p>
          <p className="mt-2 text-xs text-slate-600">
            Niche validation: {orchestrator?.decisionInsights?.nicheValidation?.summary ?? "-"}
          </p>
          {orchestrator?.decisionInsights?.strategyOverride ? (
            <p className="mt-2 text-xs text-violet-700">
              Override: {orchestrator.decisionInsights.strategyOverride.modeOverride ?? "none"}{" "}
              ({orchestrator.decisionInsights.strategyOverride.reason})
            </p>
          ) : null}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded border border-slate-200 p-4">
            <h3 className="mb-2 text-sm font-medium">Focused Opportunities</h3>
            <div className="flex flex-wrap gap-2">
              {(orchestrator?.decisionInsights?.focusedSlugs ?? []).slice(0, 20).map((slug) => (
                <span key={slug} className="rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                  {slug}
                </span>
              ))}
              {!orchestrator?.decisionInsights?.focusedSlugs?.length ? <span className="text-xs text-slate-500">No focused slugs yet.</span> : null}
            </div>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <h3 className="mb-2 text-sm font-medium">Ignored Signals</h3>
            <div className="flex flex-wrap gap-2">
              {(orchestrator?.decisionInsights?.ignoredSlugs ?? []).slice(0, 20).map((slug) => (
                <span key={slug} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {slug}
                </span>
              ))}
              {!orchestrator?.decisionInsights?.ignoredSlugs?.length ? <span className="text-xs text-slate-500">No ignored slugs.</span> : null}
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">risk</th>
                <th className="px-3 py-2 text-left">severity</th>
                <th className="px-3 py-2 text-left">warning</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.decisionInsights?.riskWarnings ?? []).map((row, idx) => (
                <tr key={`${row.type}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.type}</td>
                  <td className={`px-3 py-2 ${row.severity === "high" ? "text-rose-700" : row.severity === "medium" ? "text-amber-700" : "text-slate-700"}`}>
                    {row.severity}
                  </td>
                  <td className="px-3 py-2">{row.message}</td>
                </tr>
              ))}
              {!orchestrator?.decisionInsights?.riskWarnings?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={3}>
                    No risk warnings.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">SEO Ranking</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">keyword</th>
                <th className="px-3 py-2 text-left">slug</th>
                <th className="px-3 py-2 text-left">trend</th>
                <th className="px-3 py-2 text-left">last checked</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.seoRanking ?? []).slice(0, 20).map((row) => (
                <tr key={`${row.slug}:${row.keyword}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.keyword}</td>
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className={`px-3 py-2 ${row.trend === "down" ? "text-rose-700" : row.trend === "up" ? "text-emerald-700" : "text-amber-700"}`}>
                    {row.trend}
                  </td>
                  <td className="px-3 py-2">{row.lastChecked}</td>
                </tr>
              ))}
              {!orchestrator?.seoRanking?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    No SEO ranking rows yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Quality Scores</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">slug</th>
                <th className="px-3 py-2 text-left">overall</th>
                <th className="px-3 py-2 text-left">content</th>
                <th className="px-3 py-2 text-left">seo</th>
                <th className="px-3 py-2 text-left">conversion</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.qualityScores ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.slug}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className={`px-3 py-2 ${row.lowQuality ? "text-rose-700" : "text-emerald-700"}`}>{row.overall}</td>
                  <td className="px-3 py-2">{row.contentQuality}</td>
                  <td className="px-3 py-2">{row.seoStrength}</td>
                  <td className="px-3 py-2">{row.conversionPotential}</td>
                </tr>
              ))}
              {!orchestrator?.qualityScores?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={5}>
                    No quality scores yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Niche Focus</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Top Niche</p>
            <p className="mt-1 text-2xl font-semibold">{orchestrator?.nicheFocus?.niche ?? "general"}</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Confidence</p>
            <p className="mt-1 text-2xl font-semibold">{orchestrator?.nicheFocus?.confidence ?? 0}%</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Effort Share</p>
            <p className="mt-1 text-2xl font-semibold">{Math.round((orchestrator?.nicheFocus?.effortShare ?? 0.7) * 100)}%</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">ROI Insights</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">slug</th>
                <th className="px-3 py-2 text-left">roi score</th>
                <th className="px-3 py-2 text-left">action</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.roiInsights ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.slug}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2">{row.roiScore}</td>
                  <td className={`px-3 py-2 ${row.action === "boost" ? "text-emerald-700" : row.action === "reduce" ? "text-amber-700" : "text-slate-700"}`}>
                    {row.action}
                  </td>
                </tr>
              ))}
              {!orchestrator?.roiInsights?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={3}>
                    No ROI insights yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Traffic Insights</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">keyword opportunity</th>
                <th className="px-3 py-2 text-left">type</th>
                <th className="px-3 py-2 text-left">score</th>
                <th className="px-3 py-2 text-left">suggested slug</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.trafficInsights ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.suggestedSlug}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.keyword}</td>
                  <td className="px-3 py-2">{row.type}</td>
                  <td className="px-3 py-2">{row.score}</td>
                  <td className="px-3 py-2">{row.suggestedSlug}</td>
                </tr>
              ))}
              {!orchestrator?.trafficInsights?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    No traffic opportunities yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Optimization Actions</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">action taken</th>
                <th className="px-3 py-2 text-left">slug</th>
                <th className="px-3 py-2 text-left">status</th>
                <th className="px-3 py-2 text-left">time</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.optimizationActions ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.slug}:${row.time}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.action}</td>
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className={`px-3 py-2 ${row.status === "failed" ? "text-rose-700" : row.status === "ok" ? "text-emerald-700" : "text-amber-700"}`}>
                    {row.status}
                  </td>
                  <td className="px-3 py-2">{row.time}</td>
                </tr>
              ))}
              {!orchestrator?.optimizationActions?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    No optimization actions yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Monetization</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">slug</th>
                <th className="px-3 py-2 text-left">page type</th>
                <th className="px-3 py-2 text-left">optimization applied</th>
                <th className="px-3 py-2 text-left">time</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.monetization ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.slug}:${row.ts}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2">{row.type}</td>
                  <td className="px-3 py-2">{row.optimizationApplied ? "yes" : "no"}</td>
                  <td className="px-3 py-2">{row.ts}</td>
                </tr>
              ))}
              {!orchestrator?.monetization?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    No monetization rows yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Backlinks</h2>
        <p className="mb-2 text-sm text-slate-600">
          Outreach status: sent <span className="font-medium">{orchestrator?.outreachStatus?.sent ?? 0}</span>, replied{" "}
          <span className="font-medium">{orchestrator?.outreachStatus?.replied ?? 0}</span>, acquired{" "}
          <span className="font-medium">{orchestrator?.outreachStatus?.acquired ?? 0}</span>
        </p>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">slug</th>
                <th className="px-3 py-2 text-left">domain</th>
                <th className="px-3 py-2 text-left">status</th>
                <th className="px-3 py-2 text-left">timestamp</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.backlinks ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.slug}:${row.targetDomain}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2">{row.targetDomain}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="px-3 py-2">{row.ts}</td>
                </tr>
              ))}
              {!orchestrator?.backlinks?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    No backlink outreach rows yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Revenue Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Page Views</p>
            <p className="mt-1 text-3xl font-semibold text-slate-800">{orchestrator?.revenueMetrics?.pageViews ?? 0}</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">CTA Clicks</p>
            <p className="mt-1 text-3xl font-semibold text-violet-700">{orchestrator?.revenueMetrics?.ctaClicks ?? 0}</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Conversions</p>
            <p className="mt-1 text-3xl font-semibold text-emerald-700">{orchestrator?.revenueMetrics?.conversions ?? 0}</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Conversion Rate</p>
            <p className="mt-1 text-3xl font-semibold text-amber-700">{orchestrator?.revenueMetrics?.conversionRate ?? 0}%</p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">top page</th>
                <th className="px-3 py-2 text-left">views</th>
                <th className="px-3 py-2 text-left">cta clicks</th>
                <th className="px-3 py-2 text-left">conversions</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.revenueMetrics?.topPages ?? []).map((row, idx) => (
                <tr key={`${row.slug}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2">{row.views}</td>
                  <td className="px-3 py-2">{row.ctaClicks}</td>
                  <td className="px-3 py-2">{row.conversions}</td>
                </tr>
              ))}
              {!orchestrator?.revenueMetrics?.topPages?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    No revenue page metrics yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Revenue Dashboard</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Estimated Revenue</p>
            <p className="mt-1 text-3xl font-semibold text-emerald-700">${orchestrator?.revenueLive?.totalRevenue ?? 0}</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Affiliate Clicks</p>
            <p className="mt-1 text-3xl font-semibold text-violet-700">{orchestrator?.revenueLive?.totalAffiliateClicks ?? 0}</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Live Conversions</p>
            <p className="mt-1 text-3xl font-semibold text-amber-700">{orchestrator?.revenueLive?.totalConversions ?? 0}</p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">page</th>
                <th className="px-3 py-2 text-left">revenue</th>
                <th className="px-3 py-2 text-left">affiliate clicks</th>
                <th className="px-3 py-2 text-left">conversions</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.revenueLive?.topEarningPages ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.slug}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2">${row.revenue}</td>
                  <td className="px-3 py-2">{row.affiliateClicks}</td>
                  <td className="px-3 py-2">{row.conversions}</td>
                </tr>
              ))}
              {!orchestrator?.revenueLive?.topEarningPages?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    No live revenue rows yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">User Behavior</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Avg Scroll Depth</p>
            <p className="mt-1 text-3xl font-semibold text-slate-800">{orchestrator?.behaviorMetrics?.avgScrollDepth ?? 0}%</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Avg Time On Page</p>
            <p className="mt-1 text-3xl font-semibold text-violet-700">{orchestrator?.behaviorMetrics?.avgTimeOnPage ?? 0}s</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Views</p>
            <p className="mt-1 text-3xl font-semibold text-emerald-700">{orchestrator?.behaviorMetrics?.totalPageViews ?? 0}</p>
          </div>
          <div className="rounded border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Clicks</p>
            <p className="mt-1 text-3xl font-semibold text-amber-700">{orchestrator?.behaviorMetrics?.totalClicks ?? 0}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Conversion (Best CTAs)</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">slug</th>
                <th className="px-3 py-2 text-left">variant</th>
                <th className="px-3 py-2 text-left">CTR</th>
                <th className="px-3 py-2 text-left">conversion rate</th>
                <th className="px-3 py-2 text-left">timestamp</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.ctaPerformance ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.slug}:${row.variantId}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2">{row.variantId}</td>
                  <td className="px-3 py-2">{row.ctr}%</td>
                  <td className="px-3 py-2">{row.conversionRate}%</td>
                  <td className="px-3 py-2">{row.ts}</td>
                </tr>
              ))}
              {!orchestrator?.ctaPerformance?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={5}>
                    No CTA performance rows yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Distribution Drafts</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">slug</th>
                <th className="px-3 py-2 text-left">platform</th>
                <th className="px-3 py-2 text-left">status</th>
                <th className="px-3 py-2 text-left">strategy</th>
                <th className="px-3 py-2 text-left">timestamp</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.distribution ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.slug}:${row.platform}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2">{row.platform}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="px-3 py-2">{row.strategy}</td>
                  <td className="px-3 py-2">{row.ts}</td>
                </tr>
              ))}
              {!orchestrator?.distribution?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={5}>
                    No distribution drafts yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Winner Pages</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">slug</th>
                <th className="px-3 py-2 text-left">score</th>
                <th className="px-3 py-2 text-left">reason</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.winnerPages ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.slug}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2">{row.score}</td>
                  <td className="px-3 py-2">{row.reason}</td>
                </tr>
              ))}
              {!orchestrator?.winnerPages?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={3}>
                    No winner pages yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Optimization Impact</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">slug</th>
                <th className="px-3 py-2 text-left">before</th>
                <th className="px-3 py-2 text-left">after</th>
                <th className="px-3 py-2 text-left">delta</th>
                <th className="px-3 py-2 text-left">status</th>
              </tr>
            </thead>
            <tbody>
              {(orchestrator?.optimizationImpact ?? []).slice(0, 20).map((row, idx) => (
                <tr key={`${row.slug}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2">{row.beforePosition}</td>
                  <td className="px-3 py-2">{row.afterPosition}</td>
                  <td className={`px-3 py-2 ${row.delta > 0 ? "text-emerald-700" : row.delta < 0 ? "text-rose-700" : "text-slate-600"}`}>{row.delta}</td>
                  <td className="px-3 py-2">{row.status}</td>
                </tr>
              ))}
              {!orchestrator?.optimizationImpact?.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={5}>
                    No optimization impact rows yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">AI Systems Status</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">system</th>
                <th className="px-3 py-2 text-left">status</th>
                <th className="px-3 py-2 text-left">last run</th>
                <th className="px-3 py-2 text-left">error</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((row) => (
                <tr key={row.name} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.name}</td>
                  <td className={`px-3 py-2 ${row.status === "failed" ? "text-rose-700" : row.status === "running" ? "text-amber-700" : "text-emerald-700"}`}>
                    {row.status}
                  </td>
                  <td className="px-3 py-2">{row.lastRun || "-"}</td>
                  <td className="px-3 py-2">{row.errors?.[0] ?? "-"}</td>
                </tr>
              ))}
              {!systems.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    No system status rows yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Processed Tools</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">toolSlug</th>
                <th className="px-3 py-2 text-left">hash</th>
                <th className="px-3 py-2 text-left">status</th>
                <th className="px-3 py-2 text-left">retryCount</th>
                <th className="px-3 py-2 text-left">processedAt</th>
              </tr>
            </thead>
            <tbody>
              {processed.map((row) => (
                <tr key={`${row.slug}:${row.hash}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2 font-mono">{row.hash}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="px-3 py-2">{row.retryCount}</td>
                  <td className="px-3 py-2">{row.processedAt}</td>
                </tr>
              ))}
              {!processed.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={5}>
                    No processed tools yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">PR Status</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">toolSlug</th>
                <th className="px-3 py-2 text-left">PR status</th>
                <th className="px-3 py-2 text-left">createdAt</th>
                <th className="px-3 py-2 text-left">link</th>
              </tr>
            </thead>
            <tbody>
              {prRows.map((row) => (
                <tr key={`${row.slug}:${row.createdAt}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.slug}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="px-3 py-2">{row.createdAt}</td>
                  <td className="px-3 py-2">
                    {row.url ? (
                      <a className="text-violet-600 underline" href={row.url} target="_blank" rel="noreferrer">
                        Open PR
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
              {!prRows.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={4}>
                    No PR rows yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-medium">Runner Logs</h2>
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">timestamp</th>
                <th className="px-3 py-2 text-left">system</th>
                <th className="px-3 py-2 text-left">step</th>
                <th className="px-3 py-2 text-left">toolSlug</th>
                <th className="px-3 py-2 text-left">status</th>
                <th className="px-3 py-2 text-left">reason</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((row, idx) => (
                <tr key={`${row.ts}:${row.toolSlug}:${idx}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">{row.ts}</td>
                  <td className="px-3 py-2">{row.system}</td>
                  <td className="px-3 py-2">{row.step}</td>
                  <td className="px-3 py-2">{row.toolSlug || "-"}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="px-3 py-2">{row.reason ?? "-"}</td>
                </tr>
              ))}
              {!logs.length ? (
                <tr>
                  <td className="px-3 py-3 text-slate-500" colSpan={6}>
                    No runner logs yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
