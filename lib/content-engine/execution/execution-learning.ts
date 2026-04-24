import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ExecutionHistoryRow } from "../execution-store";
import type { SmartDecisionAction } from "../dashboard/smart-decision-actions";

export type ExecutionLearningState = {
  updatedAt: string;
  /** Execution history kind → confidence multiplier (clamped when applied). */
  kindMultipliers: Partial<Record<ExecutionHistoryRow["kind"], number>>;
  /** Normalized page path → multiplier for scorecard-style actions on that path. */
  pathMultipliers: Record<string, number>;
};

function baseDir(): string {
  return process.env.CONTENT_ENGINE_CONSOLE_STORE_DIR?.trim() || path.join(process.cwd(), "lib", "content-engine", "console-store");
}

function learningPath(): string {
  return path.join(baseDir(), "execution-learning.json");
}

const DEFAULT_STATE: ExecutionLearningState = {
  updatedAt: new Date(0).toISOString(),
  kindMultipliers: {},
  pathMultipliers: {},
};

export function loadExecutionLearningState(): ExecutionLearningState {
  const p = learningPath();
  try {
    if (!existsSync(p)) return { ...DEFAULT_STATE, updatedAt: new Date().toISOString() };
    const raw = JSON.parse(readFileSync(p, "utf8")) as Partial<ExecutionLearningState>;
    return {
      updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
      kindMultipliers: raw.kindMultipliers && typeof raw.kindMultipliers === "object" ? raw.kindMultipliers : {},
      pathMultipliers: raw.pathMultipliers && typeof raw.pathMultipliers === "object" ? raw.pathMultipliers : {},
    };
  } catch {
    return { ...DEFAULT_STATE, updatedAt: new Date().toISOString() };
  }
}

export function saveExecutionLearningState(state: ExecutionLearningState): void {
  const p = learningPath();
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }, null, 2), "utf8");
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Recompute multipliers from classified execution history (last N rows).
 * Fail-safe: empty or malformed history yields gentle defaults.
 */
export function recomputeExecutionLearningFromHistory(
  history: readonly ExecutionHistoryRow[],
  maxRows = 120,
): ExecutionLearningState {
  const kindMultipliers: Partial<Record<ExecutionHistoryRow["kind"], number>> = {};
  const pathMultipliers: Record<string, number> = {};

  const slice = history.filter((h) => h.impactClassification).slice(0, maxRows);
  for (const h of slice) {
    const k = h.kind;
    const base = kindMultipliers[k] ?? 1;
    const delta =
      h.impactClassification === "success" ? 0.02 : h.impactClassification === "failed" ? -0.035 : 0.005;
    kindMultipliers[k] = clamp(base + delta, 0.82, 1.18);

    const p = typeof h.path === "string" ? h.path.trim() : "";
    if (p.startsWith("/")) {
      const pb = pathMultipliers[p] ?? 1;
      const pd =
        h.impactClassification === "success" ? 0.03 : h.impactClassification === "failed" ? -0.045 : 0.01;
      pathMultipliers[p] = clamp(pb + pd, 0.78, 1.22);
    }
  }

  return {
    updatedAt: new Date().toISOString(),
    kindMultipliers,
    pathMultipliers,
  };
}

function extractPathFromTitle(title: string): string | null {
  const m = title.match(/\s+on\s+(\/[^\s]+)/);
  return m?.[1] ?? null;
}

/**
 * Apply execution-outcome multipliers to confidence (and lightly to traffic estimate).
 * Missing learning state is a no-op multiplier of 1.
 */
export function applyExecutionLearningToSmartDecisions(
  actions: readonly SmartDecisionAction[],
  learning: ExecutionLearningState | null,
): SmartDecisionAction[] {
  if (!learning) return [...actions];
  return actions.map((a) => {
    let mult = 1;
    const pth = extractPathFromTitle(a.title);
    if (pth && learning.pathMultipliers[pth] != null) mult *= learning.pathMultipliers[pth] ?? 1;
    if (a.sources.includes("monetization_scorecard")) mult *= learning.kindMultipliers.fix_now ?? learning.kindMultipliers.queue_sprint ?? 1;
    if (a.sources.includes("weekly_decision_engine")) mult *= learning.kindMultipliers.queue_sprint ?? 1;
    mult = clamp(mult, 0.75, 1.2);
    const confidence = clamp(a.confidence * mult, 0.32, 0.95);
    const expectedTrafficGainPct = clamp(a.expectedTrafficGainPct * (0.92 + (mult - 1) * 0.4), 1, 40);
    return {
      ...a,
      confidence,
      expectedTrafficGainPct: Number(expectedTrafficGainPct.toFixed(1)),
      learningMultiplier: Number(mult.toFixed(3)),
    };
  });
}
