/**
 * Classifies automation failures for the AI orchestrator.
 * Uses message heuristics only (no external deps).
 */

export type ErrorCategory = "github" | "network" | "invalid_data" | "missing_env" | "rate_limit" | "unknown";

export type ClassifiedError = {
  category: ErrorCategory;
  confidence: "high" | "medium" | "low";
  /** Normalized signal used for matching */
  signal: string;
};

const GITHUB_PATTERNS = [/github\.com/i, /GitHub PR create failed/i, /401.*github/i, /403.*github/i, /422/i];
const RATE_LIMIT_PATTERNS = [/429/i, /rate limit/i, /too many requests/i];
const NETWORK_PATTERNS = [/ECONNREFUSED/i, /ENOTFOUND/i, /ETIMEDOUT/i, /fetch failed/i, /network/i, /socket hang up/i];
const MISSING_ENV_PATTERNS = [
  /missing_GITHUB_TOKEN/i,
  /missing_GITHUB_REPOSITORY/i,
  /GEMINI_API_KEY is not configured/i,
  /GROQ_API_KEY/i,
  /missing_SITE_URL/i,
  /missing_CONTENT_ENGINE_SECRET/i,
];
const INVALID_DATA_PATTERNS = [/invalid_slug/i, /invalid json/i, /JSON parse/i, /not an object/i, /missing required/i];

export function classifyError(message: string, extra?: { httpStatus?: number }): ClassifiedError {
  const m = (message ?? "").trim();
  const lower = m.toLowerCase();

  if (extra?.httpStatus === 429 || RATE_LIMIT_PATTERNS.some((re) => re.test(m))) {
    return { category: "rate_limit", confidence: "high", signal: lower.slice(0, 200) };
  }
  if (MISSING_ENV_PATTERNS.some((re) => re.test(m))) {
    return { category: "missing_env", confidence: "high", signal: lower.slice(0, 200) };
  }
  if (GITHUB_PATTERNS.some((re) => re.test(m)) || /GitHub PR create failed/i.test(m)) {
    return { category: "github", confidence: "high", signal: lower.slice(0, 200) };
  }
  if (NETWORK_PATTERNS.some((re) => re.test(m))) {
    return { category: "network", confidence: "medium", signal: lower.slice(0, 200) };
  }
  if (INVALID_DATA_PATTERNS.some((re) => re.test(m))) {
    return { category: "invalid_data", confidence: "medium", signal: lower.slice(0, 200) };
  }
  if (extra?.httpStatus && extra.httpStatus >= 500) {
    return { category: "network", confidence: "low", signal: lower.slice(0, 200) };
  }

  return { category: "unknown", confidence: "low", signal: lower.slice(0, 200) || "empty" };
}
