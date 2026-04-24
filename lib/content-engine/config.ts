import type { PublishMode } from "./types";

/** Minimum aggregate score (0–100) to treat content as publish-quality (evaluated at call time). */
export function qualityPassThreshold(): number {
  return Number(process.env.CONTENT_ENGINE_QUALITY_MIN ?? "72");
}

/** AUTO mode requires this extra margin over the pass threshold. */
export function autoModeMargin(): number {
  return Number(process.env.CONTENT_ENGINE_AUTO_MARGIN ?? "8");
}

export function autoPublishThreshold(mode: PublishMode): number {
  const base = qualityPassThreshold();
  return mode === "auto" ? base + autoModeMargin() : base;
}

export function getContentEngineSecret(): string | undefined {
  return process.env.CONTENT_ENGINE_SECRET?.trim() || process.env.CRON_SECRET?.trim();
}

export function isCronEnabled(): boolean {
  return process.env.CONTENT_ENGINE_CRON_ENABLED === "1" || process.env.CONTENT_ENGINE_CRON_ENABLED === "true";
}

export function openAiModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

/** Enables fast approval metadata for high-confidence PR candidates. */
export function fastApprovalModeEnabled(): boolean {
  const v = process.env.CONTENT_ENGINE_FAST_APPROVAL?.trim().toLowerCase();
  return v === "1" || v === "true";
}

/** Optional cluster focus mode: comma-separated cluster IDs (e.g. "loan-core,salary-paycheck"). */
export function activeClusterIds(): string[] {
  const raw = process.env.CONTENT_ENGINE_ACTIVE_CLUSTERS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Strongly bias action-oriented content structures for decision intent. */
export function highIntentContentModeEnabled(): boolean {
  const v = process.env.CONTENT_ENGINE_HIGH_INTENT_MODE?.trim().toLowerCase();
  return v === "1" || v === "true";
}

/** Revenue-first mode: prioritize commercial / high-conversion opportunities and suppress low-value traffic work. */
export function businessModeEnabled(): boolean {
  const v = process.env.CONTENT_ENGINE_BUSINESS_MODE?.trim().toLowerCase();
  return v === "1" || v === "true";
}

/** Approval-hardening mode for AdSense readiness and stricter publishing gates. */
export function adsenseApprovalModeEnabled(): boolean {
  const v = process.env.CONTENT_ENGINE_ADSENSE_MODE?.trim().toLowerCase();
  return v === "1" || v === "true";
}
