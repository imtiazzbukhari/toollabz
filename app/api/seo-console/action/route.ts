import { execSync } from "node:child_process";
import type { NextRequest } from "next/server";
import { runBlogGenerationPipeline } from "@/lib/content-engine/pipeline";
import { buildDashboardSnapshot } from "@/lib/content-engine/dashboard/build-dashboard-snapshot";
import { updateSprintExecution } from "@/lib/content-engine/dashboard/sprint-execution-tracker";
import { appendConsoleLog, getConsoleAdminConfig, updateConsoleAdminConfig } from "@/lib/content-engine/console-admin-store";
import { isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";
import { keywordToSlug, saveKeywordBlogArtifact } from "@/lib/content-engine/keyword-artifact-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

function sanitizeToolProposalSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function deriveToolName(keyword: string): string {
  const cleaned = keyword.trim();
  if (!cleaned) return "Generated Tool";
  return `${cleaned
    .split(/\s+/)
    .slice(0, 10)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ")} Tool`;
}

function runScript(command: string, extraEnv?: Record<string, string>): string {
  const env = { ...process.env, ...extraEnv };
  return execSync(command, { cwd: process.cwd(), timeout: 120000, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], env });
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
      saveKeywordBlogArtifact(primaryKeyword, result);
      appendConsoleLog({ type: "blog_generated", level: "info", message: `Blog draft generated: ${topic}` });
      return Response.json({ ok: true, result });
    }

    if (action === "automation_bundle") {
      const snapshot = await buildDashboardSnapshot();
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

      let extraEnv: Record<string, string> | undefined;
      if (script === "tool") {
        const keywordSeed = typeof rec.keyword === "string" ? rec.keyword.trim() : "";
        const rawSlug = typeof rec.toolSlug === "string" ? rec.toolSlug : keywordSeed;
        const toolSlug = sanitizeToolProposalSlug(rawSlug || keywordToSlug(keywordSeed));
        const toolName =
          typeof rec.toolName === "string" && rec.toolName.trim() ? rec.toolName.trim() : deriveToolName(keywordSeed || toolSlug);
        const toolCategory =
          typeof rec.toolCategory === "string" && rec.toolCategory.trim() ? rec.toolCategory.trim() : "finance";
        if (!toolSlug) {
          return Response.json({ ok: false, error: "Unable to derive toolSlug. Provide keyword or toolSlug." }, { status: 400 });
        }
        extraEnv = { TOOL_SLUG: toolSlug, TOOL_NAME: toolName, TOOL_CATEGORY: toolCategory };
      }

      const output = runScript(cmd, extraEnv);
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
      const snapshot = await buildDashboardSnapshot();
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
