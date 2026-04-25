#!/usr/bin/env npx tsx
import { execFileSync } from "node:child_process";
import { appendRunnerLog, getToolQueueData, hasOpenPrForSlug, isToolProcessed, markToolProcessed } from "./lib/auto-runner-utils";
import { setSystemStatus } from "../../lib/content-engine/system-status";
import { pingGoogleSitemap } from "../../lib/content-engine/google-indexing";
import { appendAutomationErrorLog, classifyAutomationError } from "../../lib/content-engine/error-log";
import { readSafetyStatus, runMandatoryValidationWithRetry } from "../../lib/content-engine/safety-guardrails";

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const MAX_TOOLS_PER_CYCLE = 5;
const SAFE_MODE = String(process.env.SYSTEM_SAFE_MODE ?? "").toLowerCase() === "true";

function logRow(row: {
  step: "scan" | "skip" | "create";
  toolSlug: string;
  status: "ok" | "failed";
  reason?: string;
  source?: "derived";
  error?: string;
}): void {
  const line = {
    ts: new Date().toISOString(),
    service: "content-engine-auto-runner",
    source: "derived" as const,
    ...row,
  };
  console.log(JSON.stringify(line));
  appendRunnerLog({
    step: row.step,
    toolSlug: row.toolSlug,
    status: row.status,
    reason: row.reason ?? row.error,
    system: "runner",
    source: "derived",
  });
}

function runToolProposal(toolName: string, toolSlug: string): void {
  execFileSync("npm", ["run", "content-engine:tool-proposal-pr"], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: {
      ...process.env,
      TOOL_NAME: toolName,
      TOOL_SLUG: toolSlug,
    },
  });
}

function runToolProposalWithRetry(toolName: string, toolSlug: string): { ok: true } | { ok: false; error: string } {
  const maxAttempts = 2;
  let lastError = "unknown_error";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      runToolProposal(toolName, toolSlug);
      return { ok: true };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      appendAutomationErrorLog({
        source: "auto-runner",
        module: toolSlug,
        category: classifyAutomationError(lastError, toolSlug),
        message: `tool proposal failed attempt ${attempt}/${maxAttempts}`,
        detail: lastError,
      });
    }
  }
  return { ok: false, error: lastError };
}

async function runCycle(): Promise<void> {
  setSystemStatus({ name: "runner", status: "running" });
  setSystemStatus({ name: "content-engine", status: "running" });
  const validation = runMandatoryValidationWithRetry("auto-runner");
  if (!validation.ok || validation.buildStatus !== "success") {
    const reason = validation.lastError ?? "pre_build_validation_failed";
    setSystemStatus({ name: "runner", status: "failed", error: reason });
    setSystemStatus({ name: "content-engine", status: "failed", error: reason });
    logRow({ step: "skip", toolSlug: "", status: "failed", reason: "validation_failed", error: reason });
    appendAutomationErrorLog({
      source: "auto-runner",
      module: "preflight",
      category: classifyAutomationError(reason),
      message: reason,
      detail: validation.failingModules.join(","),
    });
    return;
  }

  const effectiveMaxTools = SAFE_MODE ? 1 : MAX_TOOLS_PER_CYCLE;
  const queue = getToolQueueData().slice(0, effectiveMaxTools);
  if (!queue.length) {
    logRow({ step: "scan", toolSlug: "", status: "ok", reason: "no_tool_found" });
    setSystemStatus({ name: "runner", status: "idle" });
    setSystemStatus({ name: "content-engine", status: "idle" });
    return;
  }

  for (const tool of queue) {
    if (!tool.toolSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.toolSlug)) {
      logRow({ step: "skip", toolSlug: tool.toolSlug || "", status: "failed", reason: "invalid_slug" });
      continue;
    }

    logRow({ step: "scan", toolSlug: tool.toolSlug, status: "ok", reason: `priority_${tool.priority}` });

    if (isToolProcessed(tool.toolSlug, tool.hash)) {
      logRow({ step: "skip", toolSlug: tool.toolSlug, status: "ok", reason: "duplicate" });
      continue;
    }

    if (await hasOpenPrForSlug(tool.toolSlug)) {
      markToolProcessed(tool.toolSlug, tool.hash, "success");
      logRow({ step: "skip", toolSlug: tool.toolSlug, status: "ok", reason: "duplicate" });
      continue;
    }

    try {
      setSystemStatus({ name: "tool-pr-creator", status: "running" });
      const proposal = runToolProposalWithRetry(tool.toolName, tool.toolSlug);
      if (!proposal.ok) throw new Error(proposal.error);
      markToolProcessed(tool.toolSlug, tool.hash, "success");
      setSystemStatus({ name: "tool-pr-creator", status: "idle" });
      if (!SAFE_MODE) {
        await pingGoogleSitemap();
      }
      logRow({ step: "create", toolSlug: tool.toolSlug, status: "ok", reason: "new" });
    } catch (error) {
      markToolProcessed(tool.toolSlug, tool.hash, "failed");
      const errMsg = error instanceof Error ? error.message : String(error);
      setSystemStatus({
        name: "tool-pr-creator",
        status: "failed",
        error: errMsg,
      });
      logRow({
        step: "skip",
        toolSlug: tool.toolSlug,
        status: "failed",
        reason: "create_failed",
        error: errMsg,
      });
      appendAutomationErrorLog({
        source: "auto-runner",
        module: tool.toolSlug,
        category: classifyAutomationError(errMsg, tool.toolSlug),
        message: "auto-runner task failed after retry policy",
        detail: errMsg,
      });
    }
  }
  const safety = readSafetyStatus();
  if (safety.buildStatus !== "success") {
    setSystemStatus({ name: "runner", status: "failed", error: "build_status_not_success" });
    logRow({ step: "skip", toolSlug: "", status: "failed", reason: "build_status_not_success" });
    return;
  }
  setSystemStatus({ name: "runner", status: "idle" });
  setSystemStatus({ name: "content-engine", status: "idle" });
}

async function main(): Promise<void> {
  const tick = async () => {
    try {
      await runCycle();
    } catch (error) {
      setSystemStatus({ name: "runner", status: "failed", error: error instanceof Error ? error.message : String(error) });
      logRow({
        step: "skip",
        toolSlug: "",
        status: "failed",
        reason: "runner_error",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  await tick();
  setInterval(() => {
    void tick();
  }, FIVE_MINUTES_MS);
}

void main();
