"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { Loader2, Sparkles, TrendingDown, TrendingUp, WandSparkles } from "lucide-react";
import { useClientReady } from "./use-client-ready";
import type { ConsoleChartsData } from "./ConsoleCharts";
import DataTable from "./controls/DataTable";
import StatusBadge from "./controls/StatusBadge";
import ControlToggle from "./controls/ControlToggle";

const ConsoleCharts = dynamic(() => import("./ConsoleCharts"), { ssr: false });
const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include", cache: "no-store" });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : `Failed: ${url}`);
  return data;
};

function num(v: unknown) {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function pathFromSmartTitle(title: string): string {
  const m = title.match(/\s+on\s+(\/[^\s]+)/);
  return m?.[1] ?? "";
}

export default function SeoGrowthConsoleDashboard() {
  const clientReady = useClientReady();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [execLoading, setExecLoading] = useState<string | null>(null);
  const [controlLoading, setControlLoading] = useState<string | null>(null);
  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(() => new Set());
  const [expansionPreview, setExpansionPreview] = useState<Record<string, unknown> | null>(null);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const { data: dataRes, error, isLoading, mutate } = useSWR(clientReady ? "/api/seo-console/data" : null, fetcher, {
    refreshInterval: 45000,
    revalidateOnFocus: true,
  });
  const { data: configRes, mutate: mutateConfig } = useSWR(clientReady ? "/api/seo-console/control" : null, fetcher, { refreshInterval: 60000 });
  const { mutate: refreshLogs } = useSWR(clientReady ? "/api/seo-console/logs" : null, fetcher, { refreshInterval: 30000 });
  const snapshot = useMemo(() => ((dataRes?.snapshot ?? {}) as Record<string, unknown>), [dataRes]);
  const config = useMemo(() => ((configRes?.config ?? {}) as Record<string, unknown>), [configRes]);
  const executionMode = config.dashboardMode === "execution";
  const revenueBoostOn = config.revenueBoostMode === true;

  const metrics = useMemo(() => {
    const revenueLeaderboard = Array.isArray(snapshot.revenueLeaderboard) ? (snapshot.revenueLeaderboard as Array<Record<string, unknown>>) : [];
    const funnel = (snapshot.revenueFunnel ?? {}) as Record<string, unknown>;
    const trafficSum = revenueLeaderboard.reduce((n, r) => n + num(r.impressions), 0);
    const revSum = revenueLeaderboard.reduce((n, r) => n + num(r.earnings), 0);
    const rpm = trafficSum > 0 ? (revSum / trafficSum) * 1000 : 0;
    const visits = num(funnel.visits);
    const conversions = num(funnel.conversions);
    const conversionRate = visits > 0 ? (conversions / visits) * 100 : 0;
    return [
      { label: "Total Traffic", value: trafficSum.toLocaleString(), delta: `${conversionRate.toFixed(1)}% CVR` },
      { label: "Revenue Estimate", value: `$${revSum.toFixed(0)}`, delta: `${num((snapshot.monetizationScorecard as Record<string, unknown>)?.totalOpportunityUsd).toFixed(0)} opp` },
      { label: "RPM", value: `$${rpm.toFixed(2)}`, delta: `${num((snapshot.lowRpmDetection as unknown[])?.length)} low-rpm pages` },
    ];
  }, [snapshot]);

  const chartsData = useMemo<ConsoleChartsData>(() => {
    const trend = Array.isArray(snapshot.trendAnalysis) ? (snapshot.trendAnalysis as Array<Record<string, unknown>>) : [];
    const revData = trend.slice(0, 8).reverse().map((t, i) => ({
      name: typeof t.period === "string" ? t.period.slice(-5) : `T${i + 1}`,
      revenue: num(t.revenueEstimateUsd),
      traffic: num(t.clicksEstimate) + num(t.impressionsEstimate) / 10,
    }));
    const cluster = Array.isArray(snapshot.clusterPerformance) ? (snapshot.clusterPerformance as Array<Record<string, unknown>>) : [];
    const funnel = (snapshot.revenueFunnel ?? {}) as Record<string, unknown>;
    return {
      revenueData: revData.length ? revData : [{ name: "Now", revenue: 0, traffic: 0 }],
      clusterPerformance: cluster.slice(0, 6).map((c) => ({
        name: String(c.clusterId ?? "cluster"),
        score: num(c.performanceScore ?? c.score),
        conversion: num(c.conversionRate ?? c.conversion),
      })),
      funnelData: [
        { name: "Impressions", value: num(funnel.impressions), fill: "#4f46e5" },
        { name: "Visits", value: num(funnel.visits), fill: "#6366f1" },
        { name: "Engaged", value: num(funnel.engagedUsers), fill: "#818cf8" },
        { name: "Converted", value: num(funnel.conversions), fill: "#a5b4fc" },
      ],
    };
  }, [snapshot]);

  const nextRevenueActions = useMemo(() => {
    const scorecard = (snapshot.monetizationScorecard ?? {}) as Record<string, unknown>;
    const cardActions = Array.isArray(scorecard.actions) ? (scorecard.actions as Array<Record<string, unknown>>) : [];
    return cardActions.slice(0, 3).map((a) => `Fix ${String(a.exactFix)} on ${String(a.targetPage)} (+$${num(a.expectedRevenueImpactUsd).toFixed(0)})`);
  }, [snapshot]);
  const nextAdsenseActions = useMemo(() => {
    const actions = Array.isArray(snapshot.adsenseActions) ? (snapshot.adsenseActions as Array<Record<string, unknown>>) : [];
    return actions.slice(0, 3).map((a) => String(a.fix));
  }, [snapshot]);
  const adsenseHistory = Array.isArray(snapshot.adsenseHistory) ? (snapshot.adsenseHistory as Array<Record<string, unknown>>) : [];
  const adsenseIssues = Array.isArray((snapshot.adsenseReadiness as Record<string, unknown>)?.issues)
    ? (((snapshot.adsenseReadiness as Record<string, unknown>).issues as Array<Record<string, unknown>>).slice(0, 4))
    : [];

  const pagePerformance = useMemo(
    () => (Array.isArray(snapshot.pagePerformance) ? (snapshot.pagePerformance as Array<Record<string, unknown>>) : []),
    [snapshot],
  );
  const gscSiteTrends = useMemo(() => (snapshot.gscSiteTrends as Record<string, unknown> | undefined) ?? {}, [snapshot]);
  const toolPerformance = useMemo(() => (snapshot.toolPerformance as Record<string, unknown> | undefined) ?? {}, [snapshot]);
  const revenueTracking = useMemo(() => (snapshot.revenueTracking as Record<string, unknown> | undefined) ?? {}, [snapshot]);
  const authorityTracking = useMemo(() => (snapshot.authorityTracking as Record<string, unknown> | undefined) ?? {}, [snapshot]);
  const smartDecisionActions = useMemo(
    () => (Array.isArray(snapshot.smartDecisionActions) ? (snapshot.smartDecisionActions as Array<Record<string, unknown>>) : []),
    [snapshot],
  );
  const trend7 = useMemo(
    () => (Array.isArray(gscSiteTrends.period7d) ? (gscSiteTrends.period7d as Array<Record<string, unknown>>) : []),
    [gscSiteTrends],
  );
  const dailyPriorityActions = useMemo(
    () => (Array.isArray(snapshot.dailyPriorityActions) ? (snapshot.dailyPriorityActions as Array<Record<string, unknown>>) : []),
    [snapshot],
  );
  const performanceTriggers = useMemo(
    () => (Array.isArray(snapshot.performanceTriggers) ? (snapshot.performanceTriggers as Array<Record<string, unknown>>) : []),
    [snapshot],
  );
  const executionHistory = useMemo(
    () => (Array.isArray(snapshot.executionHistory) ? (snapshot.executionHistory as Array<Record<string, unknown>>) : []),
    [snapshot],
  );
  const executionPerformance = useMemo(
    () => ((snapshot.executionPerformance ?? {}) as Record<string, unknown>) ?? {},
    [snapshot],
  );
  const toolImpactTracking = useMemo(
    () => (Array.isArray(snapshot.toolImpactTracking) ? (snapshot.toolImpactTracking as Array<Record<string, unknown>>) : []),
    [snapshot],
  );
  const executionLearningSummary = useMemo(
    () => ((snapshot.executionLearningSummary ?? {}) as Record<string, unknown>) ?? {},
    [snapshot],
  );
  const systemHealth = useMemo(
    () => ((snapshot.systemHealth ?? {}) as Record<string, unknown>) ?? {},
    [snapshot],
  );

  async function markImpactFromRow(executionId: string, refreshFromAggregates: boolean) {
    setExecLoading(`impact_${executionId}`);
    setFeedback(null);
    try {
      const res = await fetch("/api/seo-console/mark-impact", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ executionId, refreshFromAggregates }),
      });
      const json = (await res.json()) as Record<string, unknown>;
      if (!res.ok || json.ok === false) throw new Error(typeof json.error === "string" ? json.error : "mark-impact failed");
      setFeedback({ type: "ok", text: "Impact recorded; learning weights updated." });
      await Promise.all([mutate(), refreshLogs()]);
    } catch (e) {
      setFeedback({ type: "error", text: e instanceof Error ? e.message : "mark-impact failed" });
    } finally {
      setExecLoading(null);
    }
  }

  async function patchControl(label: string, patch: Record<string, unknown>) {
    setControlLoading(label);
    setFeedback(null);
    try {
      const res = await fetch("/api/seo-console/control", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = (await res.json()) as Record<string, unknown>;
      if (!res.ok || json.ok === false) throw new Error(typeof json.error === "string" ? json.error : "Control update failed");
      await mutateConfig();
      setFeedback({ type: "ok", text: "Settings updated." });
    } catch (e) {
      setFeedback({ type: "error", text: e instanceof Error ? e.message : "Control failed" });
    } finally {
      setControlLoading(null);
    }
  }

  async function runExecution(label: string, body: Record<string, unknown>) {
    setExecLoading(label);
    setFeedback(null);
    try {
      const res = await fetch("/api/seo-console/execution", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as Record<string, unknown>;
      if (!res.ok || json.ok === false) throw new Error(typeof json.error === "string" ? json.error : "Execution failed");
      setFeedback({ type: "ok", text: `${label} recorded.` });
      await Promise.all([mutate(), refreshLogs()]);
    } catch (e) {
      setFeedback({ type: "error", text: e instanceof Error ? e.message : "Execution failed" });
    } finally {
      setExecLoading(null);
    }
  }

  function toggleActionSelect(id: string) {
    setSelectedActionIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function runAction(name: string, payload: Record<string, unknown>) {
    setActionLoading(name);
    setFeedback(null);
    try {
      const res = await fetch("/api/seo-console/action", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as Record<string, unknown>;
      if (!res.ok || json.ok === false) throw new Error(typeof json.error === "string" ? json.error : "Action failed");
      setFeedback({ type: "ok", text: `${name} completed successfully.` });
      await Promise.all([mutate(), refreshLogs()]);
    } catch (e) {
      const text = e instanceof Error ? e.message : "Action failed";
      setFeedback({ type: "error", text });
      await fetch("/api/seo-console/logs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "task_failed", level: "error", message: text }),
      });
    } finally {
      setActionLoading(null);
    }
  }

  if (!clientReady || isLoading)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-medium text-slate-700 shadow-sm">Loading live dashboard data…</div>
    );
  if (error) {
    const msg = String(error.message);
    const isAuth = msg.includes("Unauthorized");
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-sm">
        <p className="font-semibold">Failed to load dashboard data</p>
        <p className="mt-1 text-sm text-rose-800">{msg}</p>
        {isAuth ? (
          <p className="mt-4 text-sm text-slate-800">
            <Link href="/seo-growth-console/login" className="font-medium text-violet-700 underline hover:text-violet-900">
              Sign in to the SEO console
            </Link>{" "}
            (session cookie required).
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <main className="space-y-4 text-slate-900">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-600">Overview</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Enterprise AI Execution Control Center</h1>
        <p className="mt-1 text-sm text-slate-600">Live snapshot generated: {String(snapshot.generatedAt ?? "-")}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-700">
              <TrendingUp className="h-3.5 w-3.5" />
              {metric.delta}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">System Health</h3>
        <DataTable
          columns={["Build", "Typecheck", "Safe mode", "Last error", "Failing modules", "Failing systems"]}
          rows={[[
            <StatusBadge key="sh-build" status={String(systemHealth.buildStatus ?? "failed")} />,
            <StatusBadge key="sh-tsc" status={String(systemHealth.typecheckStatus ?? "failed")} />,
            <StatusBadge key="sh-safe" status={systemHealth.safeModeEnabled === true ? "on" : "off"} />,
            String(systemHealth.lastError ?? "None").slice(0, 120),
            Array.isArray(systemHealth.failingModules) ? (systemHealth.failingModules as unknown[]).map((x) => String(x)).slice(0, 3).join(", ") || "None" : "None",
            Array.isArray(systemHealth.failingSystems) ? (systemHealth.failingSystems as unknown[]).map((x) => String(x)).join(", ") || "None" : "None",
          ]]}
          emptyMessage="System health unavailable."
        />
      </section>

      <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-700">Execution engine</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">Growth execution and daily priorities</h2>
        <p className="mt-1 text-xs text-slate-600">
          {executionMode
            ? "Execution mode: one-click actions, batch queue, and PR scripts are enabled below."
            : "Analysis mode: review signals here; switch to Execution mode to run Fix / PR / sprint queue safely."}
          {revenueBoostOn ? " Revenue boost is prioritizing calculators, transactional intent, and high-CPC clusters in opportunity ranking." : ""}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <ControlToggle
            label="Execution mode (vs analysis)"
            enabled={executionMode}
            disabled={controlLoading !== null}
            onToggle={(next) => void patchControl("dash_mode", { dashboardMode: next ? "execution" : "analysis" })}
          />
          <ControlToggle
            label="Revenue boost mode"
            enabled={revenueBoostOn}
            disabled={controlLoading !== null}
            onToggle={(next) => void patchControl("rev_boost", { revenueBoostMode: next })}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Top 5 actions today</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {dailyPriorityActions.length === 0 ? <li className="text-slate-500">No ranked actions yet.</li> : null}
              {dailyPriorityActions.map((d) => (
                <li key={String(d.id)}>
                  <span className="font-medium">{String(d.title).slice(0, 120)}</span>
                  <p className="text-xs text-slate-500">{String(d.rationale)}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Performance triggers</h3>
            <p className="mb-2 text-xs text-slate-500">Rules from GSC + RPM (suggestions only; nothing auto-publishes).</p>
            <ul className="max-h-56 space-y-2 overflow-y-auto text-sm">
              {performanceTriggers.slice(0, 8).map((t) => (
                <li key={String(t.id)} className="rounded-lg border border-slate-200/80 p-2 dark:border-slate-700">
                  <p className="font-mono text-xs text-violet-600 dark:text-violet-300">{String(t.path).slice(0, 56)}</p>
                  <p className="text-xs">{String(t.message)}</p>
                  <p className="mt-1 text-xs text-slate-500">{String(t.suggestion)}</p>
                  {executionMode ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={execLoading !== null}
                        onClick={() =>
                          void runExecution("queue_trigger", {
                            operation: "queue_sprint",
                            actionId: String(t.id),
                            title: `${String(t.rule)} ${String(t.path)}`,
                          })
                        }
                        className="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                      >
                        Queue for sprint
                      </button>
                      <button
                        type="button"
                        disabled={execLoading !== null}
                        onClick={async () => {
                          setExecLoading("content_improve");
                          setFeedback(null);
                          try {
                            const res = await fetch("/api/seo-console/execution", {
                              method: "POST",
                              credentials: "include",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                operation: "content_improve",
                                path: String(t.path),
                                titleHint: String(t.rule),
                              }),
                            });
                            const json = (await res.json()) as { ok?: boolean; error?: string; suggestions?: unknown };
                            if (!res.ok || json.ok === false) throw new Error(typeof json.error === "string" ? json.error : "Failed");
                            if (json.suggestions) setExpansionPreview({ path: String(t.path), suggestions: json.suggestions });
                            setFeedback({ type: "ok", text: "Improvement suggestions generated (preview only)." });
                            await Promise.all([mutate(), refreshLogs()]);
                          } catch (e) {
                            setFeedback({ type: "error", text: e instanceof Error ? e.message : "Failed" });
                          } finally {
                            setExecLoading(null);
                          }
                        }}
                        className="rounded-lg bg-slate-800 px-2 py-1 text-xs text-white dark:bg-slate-200 dark:text-slate-900"
                      >
                        Suggest improvements
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
            {performanceTriggers.length === 0 ? <p className="text-sm text-slate-500">No triggers yet.</p> : null}
          </div>
        </div>

        {expansionPreview && typeof expansionPreview.path === "string" ? (
          <div className="mt-4 rounded-xl border border-amber-200/60 bg-amber-50/50 p-3 text-xs dark:border-amber-900/40 dark:bg-amber-950/30">
            <p className="font-medium text-amber-900 dark:text-amber-200">
              {expansionPreview.pack != null ? "Tool expansion pack" : "Content suggestions"} for {expansionPreview.path} (preview only, not applied)
            </p>
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-[11px]">
              {JSON.stringify(expansionPreview.pack ?? expansionPreview.suggestions, null, 2)}
            </pre>
            <button type="button" className="mt-2 text-violet-600 underline" onClick={() => setExpansionPreview(null)}>
              Dismiss
            </button>
          </div>
        ) : null}

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Execution history</h3>
          <p className="mb-2 text-xs text-slate-500">
            Learning loop: use “Pull after metrics” to snapshot current GSC aggregates onto a row (needs path). Manual JSON: POST{" "}
            <span className="font-mono">/api/seo-console/mark-impact</span> with{" "}
            <span className="font-mono">executionId</span>, <span className="font-mono">afterMetrics</span>, optional{" "}
            <span className="font-mono">revenueImpactUsd</span>.
          </p>
          <DataTable
            columns={["When", "Kind", "Impact", "Score", "CTR Δ", "Action", "Pull"]}
            rows={executionHistory.slice(0, 12).map((h) => {
              const md = h.metricDeltas && typeof h.metricDeltas === "object" ? (h.metricDeltas as Record<string, unknown>) : null;
              const ctrDelta = md?.ctrChangePct != null ? `${num(md.ctrChangePct) > 0 ? "+" : ""}${num(md.ctrChangePct).toFixed(1)}%` : "—";
              const path = typeof h.path === "string" ? h.path : "";
              const canPull = path.startsWith("/") && (h.kind === "fix_now" || h.kind === "queue_sprint");
              return [
                String(h.executedAt).slice(0, 19),
                String(h.kind),
                <StatusBadge key={`${h.id}-imp`} status={String(h.impactClassification ?? "pending")} />,
                h.successScore != null ? String(num(h.successScore)) : "—",
                ctrDelta,
                String(h.actionId).slice(0, 24),
                canPull ? (
                  <button
                    key={`pull-${String(h.id)}`}
                    type="button"
                    disabled={execLoading !== null}
                    onClick={() => void markImpactFromRow(String(h.id), true)}
                    className="whitespace-nowrap rounded border border-violet-400 px-1.5 py-0.5 text-[10px] font-medium text-violet-800 dark:text-violet-200"
                  >
                    Pull after
                  </button>
                ) : (
                  <span key={`pull-${String(h.id)}`} className="text-xs text-slate-400">
                    —
                  </span>
                ),
              ];
            })}
            emptyMessage="No execution events yet."
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <article className="rounded-xl border border-slate-200/80 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Execution performance</h3>
            <p className="mt-2 text-xs text-slate-500">{String(executionPerformance.note ?? "")}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Classified</dt>
                <dd className="font-semibold">{num(executionPerformance.actionsWithImpact)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Success rate</dt>
                <dd className="font-semibold">{executionPerformance.successRate != null ? `${num(executionPerformance.successRate)}%` : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Avg success score</dt>
                <dd className="font-semibold">{executionPerformance.avgSuccessScore != null ? String(executionPerformance.avgSuccessScore) : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Avg CTR Δ (when measured)</dt>
                <dd className="font-semibold">
                  {executionPerformance.avgCtrChangeWhenMeasured != null
                    ? `${num(executionPerformance.avgCtrChangeWhenMeasured) > 0 ? "+" : ""}${num(executionPerformance.avgCtrChangeWhenMeasured).toFixed(1)}%`
                    : "—"}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-slate-500">
              Learning model: {num(executionLearningSummary.kindMultiplierCount)} kind multipliers ·{" "}
              {num(executionLearningSummary.pathMultiplierCount)} paths · updated {String(executionLearningSummary.updatedAt ?? "—").slice(0, 19)}
            </p>
            <h4 className="mt-4 text-xs font-semibold uppercase text-slate-500">Top performing fixes</h4>
            <ul className="mt-2 space-y-1 text-xs">
              {(Array.isArray(executionPerformance.topFixes) ? (executionPerformance.topFixes as Array<Record<string, unknown>>) : []).map((f) => (
                <li key={String(f.actionId)}>
                  <span className="font-mono text-violet-600 dark:text-violet-300">{String(f.kind)}</span> · {String(f.title).slice(0, 72)} · score{" "}
                  {num(f.successScore)} · <StatusBadge status={String(f.classification)} />
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border border-slate-200/80 bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tool impact (period delta)</h3>
            <p className="mt-2 text-xs text-slate-500">Requires pagesPrevious in performance aggregates for traffic deltas.</p>
            <DataTable
              columns={["Tool", "Traffic Δ %", "Clicks Δ %", "Revenue Δ", "Note"]}
              rows={toolImpactTracking.slice(0, 8).map((t) => [
                String(t.slug),
                t.trafficChangePct != null ? `${num(t.trafficChangePct) > 0 ? "+" : ""}${num(t.trafficChangePct).toFixed(1)}%` : "—",
                t.clicksChangePct != null ? `${num(t.clicksChangePct) > 0 ? "+" : ""}${num(t.clicksChangePct).toFixed(1)}%` : "—",
                t.revenueChangeUsd != null ? `$${num(t.revenueChangeUsd).toFixed(0)}` : "—",
                String(t.note).slice(0, 56),
              ])}
              emptyMessage="No tool impact rows."
            />
          </article>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Page performance (GSC)</h3>
          <p className="mb-3 text-xs text-slate-500">Impressions, clicks, CTR, average position, and period deltas when prior import exists.</p>
          <DataTable
            columns={["Path", "Impr.", "Clicks", "CTR %", "Pos.", "CTR Δ", "Rank"]}
            rows={pagePerformance.slice(0, 8).map((r) => [
              <span key={String(r.path)} className="font-mono text-xs">{String(r.path).slice(0, 42)}</span>,
              num(r.impressions).toLocaleString(),
              num(r.clicks).toLocaleString(),
              num(r.ctr).toFixed(2),
              r.averagePosition != null ? num(r.averagePosition).toFixed(1) : "—",
              r.ctrChangePct != null ? `${num(r.ctrChangePct) > 0 ? "+" : ""}${num(r.ctrChangePct).toFixed(1)}%` : "—",
              <span key={`${r.path}-mv`} className="flex items-center gap-1">
                {String(r.rankingMovement) === "up" ? <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> : null}
                {String(r.rankingMovement) === "down" ? <TrendingDown className="h-3.5 w-3.5 text-rose-500" /> : null}
                {String(r.rankingMovement) === "stable" ? <span className="text-slate-400">—</span> : null}
                {r.positionDelta != null ? <span className="text-xs text-slate-500">Δ{num(r.positionDelta).toFixed(1)}</span> : null}
              </span>,
            ])}
            emptyMessage="No GSC page data yet. Import Search Console export into performance aggregates."
          />
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Site trends (7d / 30d)</h3>
          <p className="mb-3 text-xs text-slate-500">{String(gscSiteTrends.note ?? "")}</p>
          {trend7.length ? (
            <div className="h-32">
              <svg viewBox="0 0 200 80" className="h-full w-full">
                <polyline
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  points={trend7.map((pt, i) => `${10 + i * 28},${70 - Math.min(60, num(pt.ctr) * 8)}`).join(" ")}
                />
              </svg>
              <p className="text-xs text-slate-500">CTR % (7-point window)</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No trend series yet.</p>
          )}
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Tool performance</h3>
          <DataTable
            columns={["Tool", "Sessions", "Tool→action %", "RPM", "Revenue"]}
            rows={(
              Array.isArray((toolPerformance as { topTools?: unknown }).topTools)
                ? ((toolPerformance as { topTools: Array<Record<string, unknown>> }).topTools)
                : []
            )
              .slice(0, 6)
              .map((t) => [
                String(t.slug),
                num(t.usageSessions).toLocaleString(),
                `${num(t.toolToActionRate)}%`,
                `$${num(t.rpm).toFixed(2)}`,
                `$${num(t.revenueContributionUsd).toFixed(0)}`,
              ])}
            emptyMessage="No tool URL metrics in GSC export yet."
          />
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Weak tools (improve)</h3>
          <DataTable
            columns={["Tool", "Weak score", "Suggestion"]}
            rows={(
              Array.isArray((toolPerformance as { weakTools?: unknown }).weakTools)
                ? ((toolPerformance as { weakTools: Array<Record<string, unknown>> }).weakTools)
                : []
            ).map((t) => [
              String(t.slug),
              String(num(t.weaknessScore)),
              String((t.suggestions as string[] | undefined)?.[0] ?? "Review performance hints."),
            ])}
            emptyMessage="No weak-tool signals yet."
          />
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Revenue tracking</h3>
          <p className="mb-2 text-xs text-slate-500">{String(revenueTracking.source ?? "")}</p>
          <DataTable
            columns={["Page / bucket", "Earnings", "RPM"]}
            rows={(Array.isArray(revenueTracking.graph) ? (revenueTracking.graph as Array<Record<string, unknown>>) : []).map((g) => [
              String(g.label),
              `$${num(g.earnings).toFixed(2)}`,
              `$${num(g.rpmAvg).toFixed(2)}`,
            ])}
            emptyMessage="No AdSense merge yet. Run adsense merge into aggregates for per-page RPM and earnings."
          />
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Revenue by cluster</h3>
          <DataTable
            columns={["Cluster", "Earnings", "Avg RPM", "Pages"]}
            rows={(Array.isArray(revenueTracking.byCluster) ? (revenueTracking.byCluster as Array<Record<string, unknown>>) : [])
              .slice(0, 8)
              .map((c) => [String(c.clusterId), `$${num(c.earningsUsd).toFixed(0)}`, `$${num(c.rpmWeighted).toFixed(2)}`, String(num(c.pageCount))])}
            emptyMessage="No cluster revenue until pageRevenue is populated."
          />
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Authority growth</h3>
          <p className="text-sm">Backlinks proxy: {num(authorityTracking.backlinksAcquiredProxy)} · DA proxy: {num(authorityTracking.domainAuthorityProxy)}</p>
          <p className="mt-1 text-xs text-slate-500">{String(authorityTracking.note ?? "")}</p>
          <p className="mt-2 text-xs">Traffic vs links: <StatusBadge status={String(authorityTracking.trafficGrowthVsLinks ?? "aligned")} /></p>
          <div className="mt-3 h-24">
            <svg viewBox="0 0 180 60" className="h-full w-full">
              {(Array.isArray(authorityTracking.series) ? (authorityTracking.series as Array<Record<string, unknown>>) : []).map((pt, i, arr) => {
                const x1 = 10 + i * 50;
                const x2 = 10 + (i + 1) * 50;
                const y1 = 50 - num(pt.authority) * 0.45;
                const y2 = i + 1 < arr.length ? 50 - num(arr[i + 1]?.authority) * 0.45 : y1;
                return i + 1 < arr.length ? (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee" strokeWidth="2" />
                ) : null;
              })}
            </svg>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Smart decisions (GSC + revenue + behavior)</h3>
          <p className="mb-3 text-xs text-slate-500">
            Each row has a stable ID for the execution queue. Use checkboxes for batch sprint queue or batch fix recording.
          </p>
          {executionMode && selectedActionIds.size > 0 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={execLoading !== null}
                onClick={() =>
                  void runExecution("bulk_sprint", {
                    operation: "bulk",
                    actionIds: [...selectedActionIds],
                  }).then(() => setSelectedActionIds(new Set()))
                }
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                Queue {selectedActionIds.size} for sprint
              </button>
              <button
                type="button"
                disabled={execLoading !== null}
                onClick={() =>
                  void runExecution("bulk_fix", {
                    operation: "bulk",
                    bulkKind: "fix_now",
                    actionIds: [...selectedActionIds],
                  }).then(() => setSelectedActionIds(new Set()))
                }
                className="rounded-lg border border-violet-400 px-3 py-1.5 text-xs font-semibold text-violet-800 dark:text-violet-200"
              >
                Record batch fix ({selectedActionIds.size})
              </button>
            </div>
          ) : null}
          <DataTable
            columns={["", "Action", "Status", "Traffic +%", "Revenue $", "Confidence", "Learn", "Controls"]}
            rows={smartDecisionActions.slice(0, 10).map((a) => {
              const id = String(a.id);
              const title = String(a.title);
              const path = pathFromSmartTitle(title);
              const st = String(a.executionStatus ?? "pending");
              return [
                executionMode ? (
                  <input
                    key={`cb-${id}`}
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedActionIds.has(id)}
                    onChange={() => toggleActionSelect(id)}
                    aria-label={`Select ${title}`}
                  />
                ) : (
                  <span key={`cb-${id}`} className="text-slate-400">
                    —
                  </span>
                ),
                title.slice(0, 56),
                <StatusBadge key={`${id}-st`} status={a.sprintQueued ? `${st} · sprint` : st} />,
                `+${num(a.expectedTrafficGainPct).toFixed(1)}%`,
                `$${num(a.expectedRevenueGainUsd).toFixed(0)}`,
                `${Math.round(num(a.confidence) * 100)}%`,
                a.learningMultiplier != null ? `×${num(a.learningMultiplier).toFixed(2)}` : "×1.00",
                executionMode ? (
                  <div key={`${id}-ctl`} className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      disabled={execLoading !== null}
                      onClick={() =>
                        void runExecution(`fix_${id}`, {
                          operation: "fix_now",
                          actionId: id,
                          title,
                          path: path || undefined,
                        })
                      }
                      className="rounded border px-1.5 py-0.5 text-[10px] font-medium"
                    >
                      Fix now
                    </button>
                    <button
                      type="button"
                      disabled={execLoading !== null}
                      onClick={() =>
                        void runExecution(`pr_${id}`, {
                          operation: "generate_pr",
                          actionId: id,
                          title,
                          script: "growth",
                        })
                      }
                      className="rounded border px-1.5 py-0.5 text-[10px] font-medium"
                    >
                      Generate PR
                    </button>
                    <button
                      type="button"
                      disabled={execLoading !== null}
                      onClick={() =>
                        void runExecution(`qs_${id}`, {
                          operation: "queue_sprint",
                          actionId: id,
                          title,
                        })
                      }
                      className="rounded border px-1.5 py-0.5 text-[10px] font-medium"
                    >
                      Queue sprint
                    </button>
                  </div>
                ) : (
                  <span key={`${id}-ro`} className="text-xs text-slate-400">
                    Enable execution mode
                  </span>
                ),
              ];
            })}
            emptyMessage="No decision actions yet. Populate aggregates and behavior rollups."
          />
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Tool ROI</h3>
        <p className="mb-3 text-xs text-slate-500">High-ROI tools can generate an expansion pack (slug variants + blog angles). Nothing is published automatically.</p>
        <DataTable
          columns={["Tool", "ROI score", "Revenue", "Scaling", "Expansion"]}
          rows={(Array.isArray(snapshot.toolRoi) ? (snapshot.toolRoi as Array<Record<string, unknown>>) : []).slice(0, 8).map((r) => {
            const slug = String(r.slug);
            const highRoi = num(r.roiScore) >= 38;
            return [
              slug,
              String(num(r.roiScore)),
              `$${num(r.revenueUsd).toFixed(0)}`,
              String(r.scalingSuggestion).slice(0, 64),
              executionMode && highRoi ? (
                <button
                  key={`exp-${slug}`}
                  type="button"
                  disabled={execLoading !== null}
                  onClick={async () => {
                    setExecLoading(`pack_${slug}`);
                    setFeedback(null);
                    try {
                      const res = await fetch("/api/seo-console/execution", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ operation: "expansion_pack", slug }),
                      });
                      const json = (await res.json()) as { ok?: boolean; error?: string; pack?: unknown };
                      if (!res.ok || json.ok === false) throw new Error(typeof json.error === "string" ? json.error : "Failed");
                      if (json.pack) setExpansionPreview({ path: `/tools/${slug}`, pack: json.pack });
                      setFeedback({ type: "ok", text: `Expansion pack for ${slug} ready (preview).` });
                      await Promise.all([mutate(), refreshLogs()]);
                    } catch (e) {
                      setFeedback({ type: "error", text: e instanceof Error ? e.message : "Failed" });
                    } finally {
                      setExecLoading(null);
                    }
                  }}
                  className="rounded-lg bg-violet-600 px-2 py-1 text-[10px] font-semibold text-white"
                >
                  Generate pack
                </button>
              ) : (
                <span key={`exp-${slug}`} className="text-xs text-slate-400">{executionMode ? "Below ROI threshold" : "Execution mode"}</span>
              ),
            ];
          })}
          emptyMessage="No tool ROI until GSC + revenue data covers /tools/* paths."
        />
      </section>

      <ConsoleCharts data={chartsData} />

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Next Best Revenue Actions</h3>
          {nextRevenueActions.map((a) => <p key={a} className="mt-2 text-sm">{a}</p>)}
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Top AdSense Fixes</h3>
          {nextAdsenseActions.map((a) => <p key={a} className="mt-2 text-sm">{a}</p>)}
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">AdSense Readiness Control</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-slate-100/80 p-3 text-sm dark:bg-slate-800/70">
            <p>Score: {num((snapshot.adsenseReadiness as Record<string, unknown>)?.score)} / 100</p>
            <p className="mt-1">Approval probability: {num((snapshot.adsenseReadiness as Record<string, unknown>)?.approvalProbability)}%</p>
            <p className="mt-1">Weekly improvement: {num((snapshot.adsenseProgress as Record<string, unknown>)?.weeklyImprovementPct)}%</p>
          </div>
          <div className="rounded-xl bg-slate-100/80 p-3 text-sm dark:bg-slate-800/70">
            <p className="mb-2 font-medium">Trend (last {adsenseHistory.length} snapshots)</p>
            <div className="h-20">
              <svg viewBox="0 0 240 64" className="h-full w-full">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-violet-500"
                  points={adsenseHistory
                    .slice(0, 20)
                    .reverse()
                    .map((h, i) => `${i * 12},${60 - Math.min(60, num(h.score) * 0.6)}`)
                    .join(" ")}
                />
              </svg>
            </div>
          </div>
          <div className="rounded-xl bg-slate-100/80 p-3 text-sm dark:bg-slate-800/70">
            <p className="mb-2 font-medium">Top blockers</p>
            {adsenseIssues.map((issue) => (
              <p key={String(issue.key)} className="mb-1 text-amber-700 dark:text-amber-400">
                {String(issue.message)}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ActionCard
          title="Generate blog draft"
          loading={actionLoading === "generate_blog"}
          onApprove={() => void runAction("generate_blog", { action: "generate_blog" })}
        />
        <ActionCard
          title="Run automation bundle"
          loading={actionLoading === "automation_bundle"}
          onApprove={() => void runAction("automation_bundle", { action: "automation_bundle" })}
        />
        <ActionCard
          title="Run sprint execution"
          loading={actionLoading === "sprint_execution"}
          onApprove={() => {
            const row = Array.isArray(snapshot.sprintExecutionLog) ? (snapshot.sprintExecutionLog as Array<Record<string, unknown>>).find((r) => r.status === "pending") : null;
            if (row?.id) void runAction("sprint_execution", { action: "sprint_execution", id: row.id, status: "done" });
          }}
        />
      </section>

      {feedback ? (
        <p className={feedback.type === "ok" ? "text-xs text-emerald-500" : "text-xs text-rose-500"}>
          {feedback.type === "ok" ? <Sparkles className="mr-1 inline h-3 w-3" /> : <WandSparkles className="mr-1 inline h-3 w-3" />}
          {feedback.text}
        </p>
      ) : null}
    </main>
  );
}

function ActionCard({ title, loading, onApprove }: { title: string; loading: boolean; onApprove: () => void }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="font-medium">{title}</h4>
      <button
        type="button"
        disabled={loading}
        onClick={onApprove}
        className="mt-4 rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <><Loader2 className="mr-1 inline h-3 w-3 animate-spin" />Running...</> : "Run action"}
      </button>
    </article>
  );
}
