import type { NextRequest } from "next/server";
import { isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";
import {
  appendExecutionHistory,
  loadExecutionHistory,
  loadSmartActionExecutions,
  upsertSmartActionExecution,
} from "@/lib/content-engine/execution-store";
import { appendConsoleLog } from "@/lib/content-engine/console-admin-store";
import { buildDashboardSnapshot, type DashboardSnapshot } from "@/lib/content-engine/dashboard/build-dashboard-snapshot";
import { buildContentImprovementSuggestions } from "@/lib/content-engine/dashboard/content-improvement-suggestions";
import { buildToolExpansionPack } from "@/lib/content-engine/dashboard/tool-expansion-pack";
import { updateSprintExecution } from "@/lib/content-engine/dashboard/sprint-execution-tracker";
import { execSync } from "node:child_process";
import { pageExecutionSnapshotFromPerformanceRow } from "@/lib/content-engine/execution/metrics-snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

function runScript(command: string): string {
  return execSync(command, { cwd: process.cwd(), timeout: 120000, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
}

function resolvePathForActionId(snap: DashboardSnapshot, actionId: string): string {
  const trigger = snap.performanceTriggers.find((t) => t.id === actionId);
  if (trigger) return trigger.path;
  const smart = snap.smartDecisionActions.find((a) => a.id === actionId);
  if (smart) {
    const m = smart.title.match(/\s+on\s+(\/[^\s]+)/);
    if (m?.[1]) return m[1];
  }
  return "";
}

export async function GET(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  return Response.json({
    ok: true,
    queue: loadSmartActionExecutions(),
    history: loadExecutionHistory(),
  });
}

export async function POST(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const op = typeof rec.operation === "string" ? rec.operation : "";

  const snap = await buildDashboardSnapshot();
  const pageMetrics = new Map(snap.pagePerformance.map((p) => [p.path, p]));

  try {
    if (op === "approve" || op === "set_status") {
      const actionId = typeof rec.actionId === "string" ? rec.actionId : "";
      const title = typeof rec.title === "string" ? rec.title : actionId;
      const status = rec.status === "executed" || rec.status === "approved" || rec.status === "pending" ? rec.status : null;
      if (!actionId || !status) return Response.json({ ok: false, error: "actionId and status required." }, { status: 400 });
      upsertSmartActionExecution({ actionId, titleSnapshot: title, status });
      appendExecutionHistory({ actionId, kind: "approve", result: `status=${status}`, beforeMetrics: {} });
      appendConsoleLog({ type: "ai_action", level: "info", message: `Smart action ${status}: ${actionId}` });
      return Response.json({ ok: true, queue: loadSmartActionExecutions(), history: loadExecutionHistory() });
    }

    if (op === "queue_sprint") {
      const actionId = typeof rec.actionId === "string" ? rec.actionId : "";
      const title = typeof rec.title === "string" ? rec.title : actionId;
      if (!actionId) return Response.json({ ok: false, error: "actionId required." }, { status: 400 });
      upsertSmartActionExecution({ actionId, titleSnapshot: title, status: "approved", sprintQueued: true });
      appendExecutionHistory({ actionId, kind: "queue_sprint", result: "Queued for sprint review.", beforeMetrics: {} });
      appendConsoleLog({ type: "ai_action", level: "info", message: `Queued sprint: ${actionId}` });
      return Response.json({ ok: true, queue: loadSmartActionExecutions(), history: loadExecutionHistory() });
    }

    if (op === "generate_pr") {
      const actionId = typeof rec.actionId === "string" ? rec.actionId : "";
      const script = typeof rec.script === "string" ? rec.script : "growth";
      const allowed: Record<string, string> = {
        blog: "npm run content-engine:blog-pr",
        growth: "npm run content-engine:growth-pr",
        autofix: "npm run content-engine:autofix-pr",
      };
      const cmd = allowed[script] ?? allowed.growth;
      const out = runScript(cmd);
      if (actionId) {
        upsertSmartActionExecution({
          actionId,
          titleSnapshot: typeof rec.title === "string" ? rec.title : actionId,
          status: "executed",
        });
      }
      appendExecutionHistory({
        actionId: actionId || "bulk",
        kind: "generate_pr",
        result: `PR script: ${script}`,
        afterMetrics: { outputChars: out.length },
      });
      appendConsoleLog({ type: "pr_created", level: "info", message: `Execution PR: ${script}` });
      return Response.json({ ok: true, output: out.slice(0, 4000), queue: loadSmartActionExecutions(), history: loadExecutionHistory() });
    }

    if (op === "fix_now") {
      const actionId = typeof rec.actionId === "string" ? rec.actionId : "";
      const path = typeof rec.path === "string" ? rec.path : "";
      const perfRow = path ? pageMetrics.get(path) : undefined;
      const beforeSnap = perfRow ? pageExecutionSnapshotFromPerformanceRow(perfRow) : null;
      upsertSmartActionExecution({
        actionId: actionId || `fix_${Date.now()}`,
        titleSnapshot: typeof rec.title === "string" ? rec.title : "Fix now",
        status: "executed",
      });
      appendExecutionHistory({
        actionId: actionId || "fix",
        kind: "fix_now",
        result: "Recorded fix intent; apply edits via CMS/PR workflow.",
        path: path || undefined,
        titleSnapshot: typeof rec.title === "string" ? rec.title : undefined,
        beforeSnapshot: beforeSnap ?? undefined,
        beforeMetrics: beforeSnap ? ({ ...beforeSnap } as Record<string, unknown>) : {},
      });
      appendConsoleLog({ type: "ai_action", level: "info", message: `Fix now recorded: ${path || actionId}` });
      return Response.json({ ok: true, queue: loadSmartActionExecutions(), history: loadExecutionHistory() });
    }

    if (op === "bulk") {
      const ids = Array.isArray(rec.actionIds) ? rec.actionIds.filter((x): x is string => typeof x === "string") : [];
      const bulkKind = rec.bulkKind === "fix_now" ? "fix_now" : "sprint";
      if (bulkKind === "fix_now") {
        for (const id of ids.slice(0, 20)) {
          const path = resolvePathForActionId(snap, id);
          const perfRow = path ? pageMetrics.get(path) : undefined;
          const beforeSnap = perfRow ? pageExecutionSnapshotFromPerformanceRow(perfRow) : null;
          upsertSmartActionExecution({ actionId: id, titleSnapshot: id, status: "executed" });
          appendExecutionHistory({
            actionId: id,
            kind: "fix_now",
            result: path ? `Batch fix recorded for ${path}.` : "Batch fix recorded (no path resolved).",
            path: path || undefined,
            beforeSnapshot: beforeSnap ?? undefined,
            beforeMetrics: beforeSnap ? ({ ...beforeSnap } as Record<string, unknown>) : {},
          });
        }
        appendConsoleLog({ type: "ai_action", level: "info", message: `Bulk fix_now (${ids.length})` });
      } else {
        for (const id of ids.slice(0, 20)) {
          upsertSmartActionExecution({ actionId: id, titleSnapshot: id, status: "approved", sprintQueued: true });
        }
        appendExecutionHistory({
          actionId: "bulk",
          kind: "bulk",
          result: `Bulk queued ${ids.length} actions for sprint.`,
        });
        appendConsoleLog({ type: "ai_action", level: "info", message: `Bulk execution queued (${ids.length})` });
      }
      return Response.json({ ok: true, queue: loadSmartActionExecutions(), history: loadExecutionHistory() });
    }

    if (op === "content_improve") {
      const path = typeof rec.path === "string" ? rec.path : "/blog/example";
      const suggestions = buildContentImprovementSuggestions({ path, titleHint: typeof rec.titleHint === "string" ? rec.titleHint : undefined });
      appendExecutionHistory({
        actionId: `ci_${path}`,
        kind: "content_improve",
        result: "Suggestions generated (not applied).",
      });
      return Response.json({ ok: true, suggestions });
    }

    if (op === "expansion_pack") {
      const slug = typeof rec.slug === "string" ? rec.slug : "";
      if (!slug) return Response.json({ ok: false, error: "slug required." }, { status: 400 });
      const pack = buildToolExpansionPack(slug);
      appendExecutionHistory({ actionId: `exp_${slug}`, kind: "expansion_pack", result: "Expansion pack generated." });
      return Response.json({ ok: true, pack });
    }

    if (op === "mark_sprint_done") {
      const id = typeof rec.sprintId === "string" ? rec.sprintId : "";
      if (!id) return Response.json({ ok: false, error: "sprintId required." }, { status: 400 });
      const row = updateSprintExecution({ id, status: "done" });
      if (!row) return Response.json({ ok: false, error: "Sprint row not found." }, { status: 404 });
      appendExecutionHistory({ actionId: id, kind: "other", result: "Sprint marked done from execution engine." });
      return Response.json({ ok: true, row });
    }

    return Response.json({ ok: false, error: "Unknown operation." }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "execution_error";
    appendConsoleLog({ type: "task_failed", level: "error", message });
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
