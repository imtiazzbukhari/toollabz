import { execFileSync } from "node:child_process";
import { siteUrl } from "@/lib/seo";
import type { ErrorCategory } from "./error-classifier";
import { pingGoogleSitemap } from "./google-indexing";
import { assertSafeAction, type SafeOrchestratorAction } from "./safety-guard";

const root = process.cwd();

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export type AutoFixContext = {
  toolSlug?: string;
  toolName?: string;
  rawMessage: string;
};

export type AutoFixResult =
  | { applied: true; action: string; detail?: string }
  | { applied: false; reason: string; critical?: boolean };

function runToolProposalPr(toolSlug: string, toolName: string): AutoFixResult {
  const action: SafeOrchestratorAction = { type: "retry_tool_proposal_pr", toolSlug, toolName };
  const gate = assertSafeAction(action);
  if (!gate.ok) return { applied: false, reason: gate.reason };

  try {
    execFileSync(
      "npm",
      ["run", "content-engine:tool-proposal-pr", "--silent"],
      {
        cwd: root,
        stdio: ["ignore", "pipe", "pipe"],
        env: {
          ...process.env,
          TOOL_SLUG: toolSlug,
          TOOL_NAME: toolName,
        },
      },
    );
    return { applied: true, action: "retry_tool_proposal_pr", detail: `${toolSlug}` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "exec_failed";
    return { applied: false, reason: msg };
  }
}

/**
 * Applies a single safe remediation for a classified failure.
 * Callers must throttle retries per slug (orchestrator).
 */
export async function applyAutoFix(
  category: ErrorCategory,
  ctx: AutoFixContext,
): Promise<AutoFixResult> {
  switch (category) {
    case "missing_env":
      return { applied: false, reason: "missing_env_no_auto_fix", critical: true };

    case "network": {
      const delay: SafeOrchestratorAction = { type: "delay_ms", ms: 3000 };
      const g = assertSafeAction(delay);
      if (!g.ok) return { applied: false, reason: g.reason };
      await sleep(delay.ms);
      const slug = ctx.toolSlug?.trim();
      const name = (ctx.toolName ?? slug)?.trim();
      if (slug && name) return runToolProposalPr(slug, name);
      const ping = assertSafeAction({ type: "ping_sitemap" });
      if (!ping.ok) return { applied: false, reason: ping.reason };
      const r = await pingGoogleSitemap();
      if (r.ok) return { applied: true, action: "network_delay_then_sitemap_ping", detail: String(r.status) };
      return { applied: false, reason: r.error ?? "ping_failed" };
    }

    case "github":
    case "rate_limit": {
      if (category === "rate_limit") {
        const d: SafeOrchestratorAction = { type: "delay_ms", ms: 5000 };
        const g = assertSafeAction(d);
        if (g.ok) await sleep(d.ms);
      }
      const slug = ctx.toolSlug?.trim();
      const name = (ctx.toolName ?? slug)?.trim();
      if (!slug || !name) return { applied: false, reason: "missing_slug_or_name_for_pr_retry" };
      return runToolProposalPr(slug, name);
    }

    case "invalid_data": {
      const looksSlug = /invalid_slug|slug/i.test(ctx.rawMessage);
      if (!looksSlug) return { applied: false, reason: "invalid_data_no_slug_rule" };
      const baseName = (ctx.toolName ?? ctx.toolSlug)?.trim();
      if (!baseName) return { applied: false, reason: "missing_name_for_slug_regen" };
      const newSlug = slugify(baseName);
      if (!newSlug) return { applied: false, reason: "slugify_empty" };
      return runToolProposalPr(newSlug, baseName);
    }

    case "unknown":
    default:
      return { applied: false, reason: "unknown_category_no_fix" };
  }
}

/** Sitemap subsystem failures: ping + optional warm (read-only GET). */
export async function applySitemapSubsystemFix(): Promise<AutoFixResult> {
  const pingGate = assertSafeAction({ type: "ping_sitemap" });
  if (!pingGate.ok) return { applied: false, reason: pingGate.reason };
  const r = await pingGoogleSitemap();
  if (!r.ok) return { applied: false, reason: r.error ?? "sitemap_ping_failed" };
  try {
    const warmUrl = `${siteUrl}/sitemap.xml`;
    await fetch(warmUrl, { method: "GET", cache: "no-store", signal: AbortSignal.timeout(15_000) });
  } catch {
    /* warm is best-effort */
  }
  return { applied: true, action: "sitemap_ping_and_warm", detail: String(r.status) };
}
