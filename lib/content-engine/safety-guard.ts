/**
 * Allow-list for orchestrator auto-fix actions. No destructive ops.
 */

export type SafeOrchestratorAction =
  | { type: "ping_sitemap" }
  | { type: "retry_tool_proposal_pr"; toolSlug: string; toolName: string }
  | { type: "delay_ms"; ms: number }
  | { type: "log_only"; message: string };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidToolSlug(slug: string): boolean {
  return Boolean(slug && SLUG_RE.test(slug) && slug.length <= 80);
}

export function assertSafeAction(action: SafeOrchestratorAction): { ok: true } | { ok: false; reason: string } {
  switch (action.type) {
    case "ping_sitemap":
      return { ok: true };
    case "delay_ms":
      if (!Number.isFinite(action.ms) || action.ms < 0 || action.ms > 60_000) {
        return { ok: false, reason: "delay_ms_out_of_bounds" };
      }
      return { ok: true };
    case "log_only":
      return { ok: true };
    case "retry_tool_proposal_pr":
      if (!isValidToolSlug(action.toolSlug)) return { ok: false, reason: "invalid_tool_slug" };
      if (!action.toolName.trim() || action.toolName.length > 200) return { ok: false, reason: "invalid_tool_name" };
      return { ok: true };
    default:
      return { ok: false, reason: "unknown_action_type" };
  }
}
