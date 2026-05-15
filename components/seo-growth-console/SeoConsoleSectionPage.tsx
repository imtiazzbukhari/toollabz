"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import ActionCard from "./controls/ActionCard";
import ControlToggle from "./controls/ControlToggle";
import DataTable from "./controls/DataTable";
import ProgressBar from "./controls/ProgressBar";
import StatusBadge from "./controls/StatusBadge";
import { useClientReady } from "./use-client-ready";

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include", cache: "no-store" });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : `Failed: ${url}`);
  return data;
};

const sectionMap: Record<string, { title: string; description: string }> = {
  opportunities: { title: "Opportunities", description: "Prioritized keyword and opportunity actions." },
  "content-engine": { title: "Content Engine", description: "Generated blog lifecycle and controls." },
  "tool-engine": { title: "Tool Engine", description: "Tool proposal workflow and controls." },
  revenue: { title: "Revenue", description: "Top pages, RPM, and revenue estimate." },
  clusters: { title: "Clusters", description: "Cluster performance and expansion controls." },
  "seo-health": { title: "SEO Health", description: "Issue queues and remediation actions." },
  monetization: { title: "Monetization", description: "Scorecard and low-RPM optimization controls." },
  execution: { title: "Execution", description: "Sprint execution and impact tracking." },
  automation: { title: "Automation", description: "Job controls and automation states." },
  backlinks: { title: "Backlinks", description: "Outreach queue, templates, and limits." },
  settings: { title: "Settings", description: "Admin controls and system configuration." },
};

function num(v: unknown) {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

const actionBtnClass =
  "rounded-lg border border-violet-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow-sm transition-all duration-200 hover:border-violet-400 hover:bg-violet-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50";

function LoadingDot() {
  return <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />;
}

type KeywordDetailState = {
  keyword: string;
  blogResultText: string;
  toolSpecText: string;
};

export default function SeoConsoleSectionPage({ section }: { section: keyof typeof sectionMap }) {
  const clientReady = useClientReady();
  const info = sectionMap[section];
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordDetailState | null>(null);
  const [keywordModalLoading, setKeywordModalLoading] = useState(false);
  const { data, error, isLoading, mutate } = useSWR(clientReady ? "/api/seo-console/data" : null, fetcher, { refreshInterval: 45000 });
  const { data: configData, mutate: mutateConfig } = useSWR(clientReady ? "/api/seo-console/control" : null, fetcher, { refreshInterval: 30000 });
  const { data: outreachData, mutate: mutateOutreach } = useSWR(
    clientReady && section === "backlinks" ? "/api/seo-console/outreach" : null,
    fetcher,
    {
      refreshInterval: 30000,
    },
  );

  const snapshot = useMemo(() => ((data?.snapshot ?? {}) as Record<string, unknown>), [data]);
  const config = useMemo(() => ((configData?.config ?? {}) as Record<string, unknown>), [configData]);
  const outreachMessages = useMemo(
    () => (Array.isArray(outreachData?.messages) ? (outreachData.messages as Array<Record<string, unknown>>) : []),
    [outreachData],
  );

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 2600);
    return () => clearTimeout(t);
  }, [feedback]);

  async function openKeywordDetail(keyword: string) {
    setKeywordModalLoading(true);
    try {
      const res = await fetch(`/api/seo-console/keyword-detail?keyword=${encodeURIComponent(keyword)}`, {
        credentials: "include",
        cache: "no-store",
      });
      const json = (await res.json()) as Record<string, unknown>;
      if (!res.ok || json.ok === false) throw new Error(typeof json.error === "string" ? json.error : "Failed to load detail.");
      const artifact = (json.artifact ?? {}) as Record<string, unknown>;
      const blog = (artifact.blog ?? {}) as Record<string, unknown>;
      const tool = (artifact.tool ?? {}) as Record<string, unknown>;
      const blogResult = (blog.result ?? {}) as Record<string, unknown>;
      const toolSpec = (tool.spec ?? {}) as Record<string, unknown>;
      setSelectedKeyword({
        keyword,
        blogResultText: Object.keys(blogResult).length ? JSON.stringify(blogResult, null, 2) : "",
        toolSpecText: Object.keys(toolSpec).length ? JSON.stringify(toolSpec, null, 2) : "",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load keyword detail";
      setFeedback({ type: "error", text: msg });
    } finally {
      setKeywordModalLoading(false);
    }
  }

  async function keywordDetailAction(action: "save" | "regenerate_blog" | "regenerate_tool" | "regenerate_all") {
    if (!selectedKeyword) return;
    setKeywordModalLoading(true);
    try {
      const payload: Record<string, unknown> = {
        action,
        keyword: selectedKeyword.keyword,
      };
      if (action === "save") {
        if (selectedKeyword.blogResultText.trim()) payload.blogResult = JSON.parse(selectedKeyword.blogResultText);
        if (selectedKeyword.toolSpecText.trim()) payload.toolSpec = JSON.parse(selectedKeyword.toolSpecText);
      }
      const res = await fetch("/api/seo-console/keyword-detail", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as Record<string, unknown>;
      if (!res.ok || json.ok === false) throw new Error(typeof json.error === "string" ? json.error : "Keyword action failed");
      const artifact = (json.artifact ?? {}) as Record<string, unknown>;
      const blog = (artifact.blog ?? {}) as Record<string, unknown>;
      const tool = (artifact.tool ?? {}) as Record<string, unknown>;
      const blogResult = (blog.result ?? {}) as Record<string, unknown>;
      const toolSpec = (tool.spec ?? {}) as Record<string, unknown>;
      setSelectedKeyword((prev) =>
        prev
          ? {
              ...prev,
              blogResultText: Object.keys(blogResult).length ? JSON.stringify(blogResult, null, 2) : prev.blogResultText,
              toolSpecText: Object.keys(toolSpec).length ? JSON.stringify(toolSpec, null, 2) : prev.toolSpecText,
            }
          : prev,
      );
      setFeedback({ type: "ok", text: `${action.replace("_", " ")} completed.` });
      await mutate();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Keyword action failed";
      setFeedback({ type: "error", text: msg });
    } finally {
      setKeywordModalLoading(false);
    }
  }

  async function runAction(label: string, url: string, body: Record<string, unknown>) {
    setLoadingAction(label);
    setFeedback(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as Record<string, unknown>;
      if (!res.ok || json.ok === false) throw new Error(typeof json.error === "string" ? json.error : "Action failed");
      setFeedback({ type: "ok", text: `${label} completed.` });
      await Promise.all([mutate(), mutateConfig(), mutateOutreach()]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Action failed";
      setFeedback({ type: "error", text: msg });
    } finally {
      setLoadingAction(null);
    }
  }

  if (!clientReady || isLoading)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-medium text-slate-700 shadow-sm">Loading {info.title}…</div>
    );
  if (error)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-sm">
        <p className="font-semibold">Failed to load {info.title}</p>
        <p className="mt-1 text-sm text-rose-800">{String(error.message)}</p>
      </div>
    );

  return (
    <main className="space-y-4 text-slate-900">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-600">{info.title}</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{info.title} Control Panel</h1>
        <p className="mt-1 text-sm text-slate-600">{info.description}</p>
      </section>

      {section === "opportunities" ? (
        <>
          <DataTable
            columns={["Keyword", "Intent", "CPC", "Priority", "Actions"]}
            rows={(Array.isArray((snapshot.opportunityEngine as Record<string, unknown>)?.keywordIntel)
              ? ((snapshot.opportunityEngine as Record<string, unknown>).keywordIntel as Array<Record<string, unknown>>)
              : []
            )
              .slice(0, 12)
              .map((r) => [
                <button
                  key={`${r.keyword}-detail`}
                  type="button"
                  disabled={keywordModalLoading}
                  onClick={() => void openKeywordDetail(String(r.keyword))}
                  className={`${actionBtnClass} px-3 py-1.5 text-left font-semibold`}
                >
                  {String(r.keyword)}
                </button>,
                String(r.searchIntent ?? r.funnelIntent),
                num(r.cpcScore).toFixed(0),
                String(num(r.priority ?? r.monetizationPotential).toFixed(0)),
                <div key={`${r.keyword}-actions`} className="flex gap-2">
                  <button
                    type="button"
                    disabled={loadingAction === `generate_blog:${String(r.keyword)}`}
                    onClick={() =>
                      void runAction(`generate_blog:${String(r.keyword)}`, "/api/seo-console/action", {
                        action: "generate_blog",
                        topic: r.keyword,
                        primaryKeyword: r.keyword,
                      })
                    }
                    className={actionBtnClass}
                  >
                    {loadingAction === `generate_blog:${String(r.keyword)}` ? <LoadingDot /> : "Generate Blog"}
                  </button>
                  <button
                    type="button"
                    disabled={loadingAction === `create_tool:${String(r.keyword)}`}
                    onClick={() =>
                      void runAction(`create_tool:${String(r.keyword)}`, "/api/seo-console/action", {
                        action: "run_pr_script",
                        script: "tool",
                        keyword: String(r.keyword),
                        toolSlug: String(r.keyword),
                        toolName: `Tool for ${String(r.keyword)}`,
                      })
                    }
                    className={actionBtnClass}
                  >
                    {loadingAction === `create_tool:${String(r.keyword)}` ? <LoadingDot /> : "Create Tool"}
                  </button>
                </div>,
              ])}
          />
        </>
      ) : null}

      {section === "content-engine" ? (
        <DataTable
          columns={["Blog", "Status", "Actions"]}
          rows={(Array.isArray((snapshot.opportunityEngine as Record<string, unknown>)?.blogIdeas)
            ? ((snapshot.opportunityEngine as Record<string, unknown>).blogIdeas as Array<Record<string, unknown>>)
            : []
          )
            .slice(0, 10)
            .map((b) => [
              <span key={`${b.title}-title`} className="font-medium text-slate-900 dark:text-slate-100">
                {String(b.title)}
              </span>,
              <StatusBadge key={`${b.title}-status`} status="draft" />,
              <div key={`${b.title}-actions`} className="flex gap-2">
                <button type="button" disabled={loadingAction === "approve"} onClick={() => void runAction("approve", "/api/seo-console/action", { action: "run_pr_script", script: "blog" })} className={actionBtnClass}>{loadingAction === "approve" ? <LoadingDot /> : "Approve"}</button>
                <button type="button" disabled={loadingAction === "edit"} onClick={() => void runAction("edit", "/api/seo-console/action", { action: "run_audit" })} className={actionBtnClass}>{loadingAction === "edit" ? <LoadingDot /> : "Edit"}</button>
                <button type="button" disabled={loadingAction === `regenerate:${String(b.keyword)}`} onClick={() => void runAction(`regenerate:${String(b.keyword)}`, "/api/seo-console/action", { action: "generate_blog", topic: b.keyword, primaryKeyword: b.keyword })} className={actionBtnClass}>{loadingAction === `regenerate:${String(b.keyword)}` ? <LoadingDot /> : "Regenerate"}</button>
              </div>,
            ])}
        />
      ) : null}

      {section === "tool-engine" ? (
        <DataTable
          columns={["Proposal", "Priority", "Actions"]}
          rows={(Array.isArray((snapshot.opportunityEngine as Record<string, unknown>)?.toolIdeas)
            ? ((snapshot.opportunityEngine as Record<string, unknown>).toolIdeas as Array<Record<string, unknown>>)
            : []
          )
            .slice(0, 10)
            .map((t) => [
              <span key={`${t.title}-title`} className="font-medium text-slate-900 dark:text-slate-100">
                {String(t.title)}
              </span>,
              String(num(t.priority)),
              <div key={`${t.title}-actions`} className="flex gap-2">
                <button
                  type="button"
                  disabled={loadingAction === `approve_tool:${String(t.slugHint)}`}
                  onClick={() =>
                    void runAction(`approve_tool:${String(t.slugHint)}`, "/api/seo-console/action", {
                      action: "run_pr_script",
                      script: "tool",
                      keyword: String(t.slugHint).replace(/-/g, " "),
                      toolSlug: String(t.slugHint),
                      toolName: String(t.title),
                      toolCategory: "finance",
                    })
                  }
                  className={actionBtnClass}
                >
                  {loadingAction === `approve_tool:${String(t.slugHint)}` ? <LoadingDot /> : "Approve"}
                </button>
                <button type="button" disabled={loadingAction === "edit_logic"} onClick={() => void runAction("edit_logic", "/api/seo-console/action", { action: "run_audit" })} className={actionBtnClass}>{loadingAction === "edit_logic" ? <LoadingDot /> : "Edit logic"}</button>
                <button type="button" disabled={loadingAction === "disable_tool"} onClick={() => void runAction("disable_tool", "/api/seo-console/action", { action: "override_decisions", enabled: true })} className={actionBtnClass}>{loadingAction === "disable_tool" ? <LoadingDot /> : "Disable"}</button>
              </div>,
            ])}
          emptyMessage="No tool proposals yet. Run AI to generate."
        />
      ) : null}

      {section === "revenue" ? (
        <DataTable
          columns={["Page", "RPM", "Revenue"]}
          rows={(Array.isArray(snapshot.revenueLeaderboard) ? (snapshot.revenueLeaderboard as Array<Record<string, unknown>>) : [])
            .slice(0, 12)
            .map((r) => [String(r.path), `$${num(r.rpm).toFixed(2)}`, `$${num(r.earnings).toFixed(2)}`])}
        />
      ) : null}

      {section === "clusters" ? (
        <DataTable
          columns={["Cluster", "Score", "Performance", "Actions"]}
          rows={(Array.isArray(snapshot.clusterPerformance) ? (snapshot.clusterPerformance as Array<Record<string, unknown>>) : [])
            .slice(0, 12)
            .map((c) => [
              String(c.clusterId ?? c.name),
              num(c.performanceScore ?? c.score).toFixed(0),
              `${num(c.conversionRate ?? c.conversion).toFixed(2)} CVR`,
              <div key={`${c.clusterId}-actions`} className="flex gap-2">
                <button onClick={() => void runAction("focus_cluster", "/api/seo-console/control", { activeCluster: c.clusterId })} className="rounded-lg border px-2 py-1 text-xs">Focus</button>
                <button onClick={() => void runAction("expand_cluster", "/api/seo-console/action", { action: "refresh_clusters" })} className="rounded-lg border px-2 py-1 text-xs">Expand</button>
              </div>,
            ])}
        />
      ) : null}

      {section === "seo-health" ? (
        <DataTable
          columns={["Issue", "Path", "Actions"]}
          rows={(Array.isArray(snapshot.siteHealth) ? (snapshot.siteHealth as Array<Record<string, unknown>>) : [])
            .slice(0, 12)
            .map((i) => [
              String(i.issue ?? i.message ?? "SEO issue"),
              String(i.path ?? "-"),
              <div key={`${i.path}-actions`} className="flex gap-2">
                <button onClick={() => void runAction("fix_issue", "/api/seo-console/action", { action: "run_audit" })} className="rounded-lg border px-2 py-1 text-xs">Fix issue</button>
                <button onClick={() => void runAction("generate_pr", "/api/seo-console/action", { action: "run_pr_script", script: "autofix" })} className="rounded-lg border px-2 py-1 text-xs">Generate PR</button>
              </div>,
            ])}
          emptyMessage="No SEO issues detected."
        />
      ) : null}

      {section === "monetization" ? (
        <DataTable
          columns={["Target Page", "Fix", "Impact", "Actions"]}
          rows={(Array.isArray((snapshot.monetizationScorecard as Record<string, unknown>)?.actions)
            ? ((snapshot.monetizationScorecard as Record<string, unknown>).actions as Array<Record<string, unknown>>)
            : []
          )
            .slice(0, 10)
            .map((a) => [
              String(a.targetPage),
              String(a.exactFix),
              `$${num(a.expectedRevenueImpactUsd).toFixed(0)}`,
              <div key={`${a.targetPage}-actions`} className="flex gap-2">
                <button onClick={() => void runAction("fix_cta", "/api/seo-console/action", { action: "sprint_execution", id: `${a.targetPage}:${a.exactFix}`, status: "done" })} className="rounded-lg border px-2 py-1 text-xs">Fix CTA</button>
                <button onClick={() => void runAction("improve_content", "/api/seo-console/action", { action: "generate_blog", topic: a.targetPage })} className="rounded-lg border px-2 py-1 text-xs">Improve content</button>
              </div>,
            ])}
        />
      ) : null}

      {section === "execution" ? (
        <DataTable
          columns={["Action", "Status", "Expected Impact", "Actions"]}
          rows={(Array.isArray(snapshot.sprintExecutionLog) ? (snapshot.sprintExecutionLog as Array<Record<string, unknown>>) : [])
            .slice(0, 12)
            .map((s) => [
              `${String(s.targetPage)} (${String(s.exactFix)})`,
              <StatusBadge key={`${s.id}-status`} status={String(s.status)} />,
              `$${num(s.expectedRevenueImpactUsd).toFixed(0)}`,
              <div key={`${s.id}-actions`} className="flex gap-2">
                <button onClick={() => void runAction("mark_done", "/api/seo-console/action", { action: "sprint_execution", id: s.id, status: "done" })} className="rounded-lg border px-2 py-1 text-xs">Mark done</button>
                <button onClick={() => void runAction("update_result", "/api/seo-console/action", { action: "sprint_execution", id: s.id, status: "pending" })} className="rounded-lg border px-2 py-1 text-xs">Update result</button>
              </div>,
            ])}
        />
      ) : null}

      {section === "automation" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <ActionCard
            title="Cron + Jobs"
            description="Run or pause automation workflows."
            actions={[
              { label: "Run now", onClick: () => void runAction("run_now", "/api/seo-console/action", { action: "automation_bundle" }), loading: loadingAction === "run_now" },
              { label: "Pause", onClick: () => void runAction("pause", "/api/seo-console/action", { action: "toggle_pause" }), loading: loadingAction === "pause" },
            ]}
          />
          <ActionCard
            title="Automation Execution"
            description="Refresh clusters and audit queue."
            actions={[
              { label: "Run audit", onClick: () => void runAction("run_audit", "/api/seo-console/action", { action: "run_audit" }), loading: loadingAction === "run_audit" },
              { label: "Refresh clusters", onClick: () => void runAction("refresh_clusters", "/api/seo-console/action", { action: "refresh_clusters" }), loading: loadingAction === "refresh_clusters" },
            ]}
          />
        </div>
      ) : null}

      {section === "backlinks" ? (
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Backlink discovery (templates)</h3>
            <p className="mb-3 text-xs text-slate-500">Query seeds from live opportunities - verify every domain manually before outreach.</p>
            <DataTable
              columns={["Domain (seed)", "Query", "Relevance", "Authority", "Spam", "Contact"]}
              rows={(Array.isArray(snapshot.backlinkDiscovery) ? (snapshot.backlinkDiscovery as Array<Record<string, unknown>>) : []).map((p) => [
                String(p.domain),
                <span key={String(p.query)} className="text-xs">{String(p.query)}</span>,
                String(num(p.relevanceScore)),
                String(num(p.authorityScore)),
                <StatusBadge key={String(p.domain)} status={String(p.spamRisk)} />,
                String(p.contactHint).slice(0, 48),
              ])}
              emptyMessage="No discovery rows - add keyword opportunities in aggregates."
            />
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Outreach Queue</h3>
            <DataTable
              columns={["Prospect", "Status", "Actions"]}
              rows={outreachMessages.slice(0, 12).map((m) => [
                String(m.to ?? m.subject ?? "Prospect"),
                <StatusBadge key={`${m.id}-status`} status={String(m.status ?? "pending")} />,
                <div key={`${m.id}-actions`} className="flex gap-2">
                  <button onClick={() => void runAction("approve", "/api/seo-console/outreach", { action: "approve", id: m.id })} className="rounded-lg border px-2 py-1 text-xs">Approve</button>
                  <button onClick={() => void runAction("send", "/api/seo-console/outreach", { action: "send", id: m.id })} className="rounded-lg border px-2 py-1 text-xs">Send</button>
                  <button onClick={() => void runAction("replied", "/api/seo-console/outreach", { action: "replied", id: m.id, note: "Marked from dashboard." })} className="rounded-lg border px-2 py-1 text-xs">Mark replied</button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== "undefined" ? window.prompt("Full https URL where the link was placed", "https://") : null;
                      if (!url || !url.trim().startsWith("http")) return;
                      void runAction("link_acquired", "/api/seo-console/outreach", { action: "link_acquired", id: m.id, url: url.trim() });
                    }}
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-900"
                  >
                    Link acquired
                  </button>
                </div>,
              ])}
              emptyMessage="No outreach data yet. Run AI to generate."
            />
          </section>
          <section className="grid gap-4 xl:grid-cols-2">
            <ActionCard
              title="Templates"
              description="Outreach template controls."
              actions={[
                { label: "Edit template", onClick: () => void runAction("edit_template", "/api/seo-console/action", { action: "run_audit" }), loading: loadingAction === "edit_template" },
                { label: "Save template", onClick: () => void runAction("save_template", "/api/seo-console/action", { action: "run_audit" }), loading: loadingAction === "save_template" },
              ]}
            />
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="font-medium">Daily Limit</h4>
              <p className="mt-1 text-sm text-slate-500">Outreach send usage today.</p>
              <div className="mt-3">
                <ProgressBar value={num(outreachData?.sentCount)} max={num(outreachData?.dailyCap)} />
              </div>
            </article>
          </section>
        </div>
      ) : null}

      {section === "settings" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <ActionCard
            title="System Config"
            description="Pause system or force execution."
            actions={[
              { label: "Pause system", onClick: () => void runAction("pause_system", "/api/seo-console/action", { action: "toggle_pause" }), loading: loadingAction === "pause_system" },
              { label: "Force execution", onClick: () => void runAction("force_execution", "/api/seo-console/action", { action: "automation_bundle" }), loading: loadingAction === "force_execution" },
            ]}
          />
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="font-medium">AI Controls</h4>
            <div className="mt-3 grid gap-2">
              <ControlToggle label="AI Enabled" enabled={config.aiEnabled === true} disabled={loadingAction === "toggle_ai"} onToggle={(next) => void runAction("toggle_ai", "/api/seo-console/control", { aiEnabled: next, paused: !next })} />
              <ControlToggle label="High Intent Mode" enabled={config.highIntentMode === true} disabled={loadingAction === "toggle_hi"} onToggle={(next) => void runAction("toggle_hi", "/api/seo-console/control", { highIntentMode: next })} />
              <ControlToggle label="Business Mode" enabled={config.businessMode === true} disabled={loadingAction === "toggle_biz"} onToggle={(next) => void runAction("toggle_biz", "/api/seo-console/control", { businessMode: next })} />
              <ControlToggle
                label="Execution mode (dashboard)"
                enabled={config.dashboardMode === "execution"}
                disabled={loadingAction === "toggle_exec_dash"}
                onToggle={(next) => void runAction("toggle_exec_dash", "/api/seo-console/control", { dashboardMode: next ? "execution" : "analysis" })}
              />
              <ControlToggle
                label="Revenue boost mode"
                enabled={config.revenueBoostMode === true}
                disabled={loadingAction === "toggle_rev_boost"}
                onToggle={(next) => void runAction("toggle_rev_boost", "/api/seo-console/control", { revenueBoostMode: next })}
              />
            </div>
          </article>
        </div>
      ) : null}

      {selectedKeyword ? (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Keyword Detail: {selectedKeyword.keyword}</h2>
              <button type="button" className={actionBtnClass} onClick={() => setSelectedKeyword(null)}>
                Close
              </button>
            </div>
            <p className="mb-3 text-xs text-slate-300">
              Edit generated blog payload JSON and tool spec JSON, then save or regenerate with Gemini/Groq.
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="text-xs text-slate-300">
                Generated Blog Content (JSON payload)
                <textarea
                  className="mt-1 h-72 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 font-mono text-xs text-white"
                  value={selectedKeyword.blogResultText}
                  onChange={(e) => setSelectedKeyword((prev) => (prev ? { ...prev, blogResultText: e.target.value } : prev))}
                />
              </label>
              <label className="text-xs text-slate-300">
                Tool Spec / Code (JSON)
                <textarea
                  className="mt-1 h-72 w-full rounded-lg border border-slate-700 bg-slate-900 p-2 font-mono text-xs text-white"
                  value={selectedKeyword.toolSpecText}
                  onChange={(e) => setSelectedKeyword((prev) => (prev ? { ...prev, toolSpecText: e.target.value } : prev))}
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" disabled={keywordModalLoading} className={actionBtnClass} onClick={() => void keywordDetailAction("save")}>
                {keywordModalLoading ? <LoadingDot /> : "Save changes"}
              </button>
              <button type="button" disabled={keywordModalLoading} className={actionBtnClass} onClick={() => void keywordDetailAction("regenerate_blog")}>
                {keywordModalLoading ? <LoadingDot /> : "Regenerate blog"}
              </button>
              <button type="button" disabled={keywordModalLoading} className={actionBtnClass} onClick={() => void keywordDetailAction("regenerate_tool")}>
                {keywordModalLoading ? <LoadingDot /> : "Regenerate tool"}
              </button>
              <button type="button" disabled={keywordModalLoading} className={actionBtnClass} onClick={() => void keywordDetailAction("regenerate_all")}>
                {keywordModalLoading ? <LoadingDot /> : "Regenerate all"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {feedback ? (
        <div
          className={`fixed right-4 top-4 z-[60] rounded-xl border px-4 py-3 text-sm shadow-2xl ${
            feedback.type === "ok"
              ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
              : "border-rose-400/40 bg-rose-500/15 text-rose-100"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}
    </main>
  );
}
