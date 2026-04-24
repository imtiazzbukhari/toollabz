"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import ActionCard from "./controls/ActionCard";
import ControlToggle from "./controls/ControlToggle";
import DataTable from "./controls/DataTable";
import ProgressBar from "./controls/ProgressBar";
import StatusBadge from "./controls/StatusBadge";

const fetcher = async (url: string) => {
  const res = await fetch(url);
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

export default function SeoConsoleSectionPage({ section }: { section: keyof typeof sectionMap }) {
  const info = sectionMap[section];
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const { data, error, isLoading, mutate } = useSWR("/api/seo-console/data", fetcher, { refreshInterval: 45000 });
  const { data: configData, mutate: mutateConfig } = useSWR("/api/seo-console/control", fetcher, { refreshInterval: 30000 });
  const { data: outreachData, mutate: mutateOutreach } = useSWR(section === "backlinks" ? "/api/seo-console/outreach" : null, fetcher, {
    refreshInterval: 30000,
  });

  const snapshot = useMemo(() => ((data?.snapshot ?? {}) as Record<string, unknown>), [data]);
  const config = useMemo(() => ((configData?.config ?? {}) as Record<string, unknown>), [configData]);
  const outreachMessages = useMemo(
    () => (Array.isArray(outreachData?.messages) ? (outreachData.messages as Array<Record<string, unknown>>) : []),
    [outreachData],
  );

  async function runAction(label: string, url: string, body: Record<string, unknown>) {
    setLoadingAction(label);
    setFeedback(null);
    try {
      const res = await fetch(url, {
        method: "POST",
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

  if (isLoading) return <div className="rounded-2xl bg-slate-200/70 p-6 dark:bg-slate-800/60">Loading {info.title}...</div>;
  if (error) return <div className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-rose-700">Failed to load {info.title}: {String(error.message)}</div>;

  return (
    <main className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/70 p-6 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-500">{info.title}</p>
        <h1 className="mt-2 text-2xl font-semibold">{info.title} Control Panel</h1>
        <p className="mt-1 text-sm text-slate-500">{info.description}</p>
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
                String(r.keyword),
                String(r.searchIntent ?? r.funnelIntent),
                num(r.cpcScore).toFixed(0),
                num(r.monetizationPotential).toFixed(0),
                <div key={`${r.keyword}-actions`} className="flex gap-2">
                  <button onClick={() => void runAction("generate_blog", "/api/seo-console/action", { action: "generate_blog", topic: r.keyword })} className="rounded-lg border px-2 py-1 text-xs">Generate blog</button>
                  <button onClick={() => void runAction("create_tool", "/api/seo-console/action", { action: "run_pr_script", script: "tool" })} className="rounded-lg border px-2 py-1 text-xs">Create tool</button>
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
              String(b.title),
              <StatusBadge key={`${b.title}-status`} status="draft" />,
              <div key={`${b.title}-actions`} className="flex gap-2">
                <button onClick={() => void runAction("approve", "/api/seo-console/action", { action: "run_pr_script", script: "blog" })} className="rounded-lg border px-2 py-1 text-xs">Approve</button>
                <button onClick={() => void runAction("edit", "/api/seo-console/action", { action: "run_audit" })} className="rounded-lg border px-2 py-1 text-xs">Edit</button>
                <button onClick={() => void runAction("regenerate", "/api/seo-console/action", { action: "generate_blog", topic: b.keyword })} className="rounded-lg border px-2 py-1 text-xs">Regenerate</button>
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
              String(t.title),
              String(num(t.priority)),
              <div key={`${t.title}-actions`} className="flex gap-2">
                <button onClick={() => void runAction("approve_tool", "/api/seo-console/action", { action: "run_pr_script", script: "tool" })} className="rounded-lg border px-2 py-1 text-xs">Approve</button>
                <button onClick={() => void runAction("edit_logic", "/api/seo-console/action", { action: "run_audit" })} className="rounded-lg border px-2 py-1 text-xs">Edit logic</button>
                <button onClick={() => void runAction("disable_tool", "/api/seo-console/action", { action: "override_decisions", enabled: true })} className="rounded-lg border px-2 py-1 text-xs">Disable</button>
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
          <section className="rounded-2xl border border-white/10 bg-white/70 p-5 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Backlink discovery (templates)</h3>
            <p className="mb-3 text-xs text-slate-500">Query seeds from live opportunities — verify every domain manually before outreach.</p>
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
              emptyMessage="No discovery rows — add keyword opportunities in aggregates."
            />
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/70 p-5 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
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
                    className="rounded-lg border border-emerald-400/60 px-2 py-1 text-xs text-emerald-800 dark:text-emerald-200"
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
            <article className="rounded-2xl border border-white/10 bg-white/70 p-5 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
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
          <article className="rounded-2xl border border-white/10 bg-white/70 p-5 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
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

      {feedback ? <div className={`rounded-xl p-3 text-sm ${feedback.type === "ok" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>{feedback.text}</div> : null}
    </main>
  );
}
