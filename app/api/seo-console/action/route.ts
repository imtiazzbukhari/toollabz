import { execSync } from "node:child_process";
import type { NextRequest } from "next/server";
import { runBlogGenerationPipeline } from "@/lib/content-engine/pipeline";
import { buildDashboardSnapshot } from "@/lib/content-engine/dashboard/build-dashboard-snapshot";
import { updateSprintExecution } from "@/lib/content-engine/dashboard/sprint-execution-tracker";
import { appendConsoleLog, getConsoleAdminConfig, updateConsoleAdminConfig } from "@/lib/content-engine/console-admin-store";
import { isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

function runScript(command: string): string {
  return execSync(command, { cwd: process.cwd(), timeout: 120000, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
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
  const action = typeof rec.action === "string" ? rec.action : "";

  try {
    if (action === "generate_blog") {
      const topic = typeof rec.topic === "string" ? rec.topic : "Revenue optimization playbook for SEO calculators";
      const primaryKeyword = typeof rec.primaryKeyword === "string" ? rec.primaryKeyword : "revenue optimization seo";
      const result = await runBlogGenerationPipeline({ topic, primaryKeyword, mode: "safe" });
      appendConsoleLog({ type: "blog_generated", level: "info", message: `Blog draft generated: ${topic}` });
      return Response.json({ ok: true, result });
    }

    if (action === "automation_bundle") {
      const snapshot = buildDashboardSnapshot();
      appendConsoleLog({ type: "ai_action", level: "info", message: "Automation bundle refreshed." });
      return Response.json({ ok: true, bundle: snapshot });
    }

    if (action === "sprint_execution") {
      const id = typeof rec.id === "string" ? rec.id : "";
      const status = rec.status === "done" ? "done" : rec.status === "pending" ? "pending" : null;
      if (!id || !status) return Response.json({ ok: false, error: "id and status are required." }, { status: 400 });
      const row = updateSprintExecution({ id, status });
      if (!row) return Response.json({ ok: false, error: "Sprint row not found." }, { status: 404 });
      appendConsoleLog({ type: "ai_action", level: "info", message: `Sprint action ${status}: ${id}` });
      return Response.json({ ok: true, row });
    }

    if (action === "run_pr_script") {
      const script = typeof rec.script === "string" ? rec.script : "";
      const allowed: Record<string, string> = {
        blog: "npm run content-engine:blog-pr",
        growth: "npm run content-engine:growth-pr",
        programmatic: "npm run content-engine:programmatic-pr",
        scaling: "npm run content-engine:scaling-pr",
        tool: "npm run content-engine:tool-proposal-pr",
        autofix: "npm run content-engine:autofix-pr",
      };
      const cmd = allowed[script];
      if (!cmd) return Response.json({ ok: false, error: "Invalid script." }, { status: 400 });
      const output = runScript(cmd);
      appendConsoleLog({ type: "pr_created", level: "info", message: `PR script executed: ${script}` });
      return Response.json({ ok: true, output });
    }

    if (action === "toggle_pause") {
      const current = getConsoleAdminConfig();
      const config = updateConsoleAdminConfig({ paused: !current.paused, aiEnabled: current.paused });
      appendConsoleLog({ type: "system", level: "warn", message: config.paused ? "AI system paused." : "AI system resumed." });
      return Response.json({ ok: true, config });
    }

    if (action === "override_decisions") {
      const config = updateConsoleAdminConfig({ overrideDecisions: rec.enabled === true });
      appendConsoleLog({ type: "system", level: "warn", message: `Override decisions ${config.overrideDecisions ? "enabled" : "disabled"}.` });
      return Response.json({ ok: true, config });
    }

    if (action === "run_audit" || action === "refresh_clusters") {
      const snapshot = buildDashboardSnapshot();
      appendConsoleLog({ type: "ai_action", level: "info", message: action === "run_audit" ? "Audit completed." : "Clusters refreshed." });
      return Response.json({ ok: true, snapshot });
    }

    return Response.json({ ok: false, error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown action error";
    appendConsoleLog({ type: "task_failed", level: "error", message });
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
