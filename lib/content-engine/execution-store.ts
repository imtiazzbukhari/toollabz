import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { PageExecutionSnapshot } from "./execution/metrics-snapshot";

export type SmartActionExecutionStatus = "pending" | "approved" | "executed";

export type SmartActionExecutionRow = {
  actionId: string;
  status: SmartActionExecutionStatus;
  titleSnapshot: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  sprintQueued?: boolean;
};

export type ExecutionMetricDeltas = {
  ctrChangePct: number | null;
  trafficChangePct: number | null;
  positionChange: number | null;
};

export type ExecutionImpactClassification = "success" | "neutral" | "failed";

export type ExecutionHistoryRow = {
  id: string;
  actionId: string;
  kind: "fix_now" | "generate_pr" | "queue_sprint" | "bulk" | "content_improve" | "expansion_pack" | "approve" | "other";
  executedAt: string;
  result: string;
  /** Optional human label captured at execution time. */
  titleSnapshot?: string;
  /** Page path when action targets a URL (GSC path). */
  path?: string;
  beforeMetrics?: Record<string, unknown>;
  afterMetrics?: Record<string, unknown>;
  beforeSnapshot?: PageExecutionSnapshot;
  afterSnapshot?: PageExecutionSnapshot;
  metricDeltas?: ExecutionMetricDeltas;
  impactClassification?: ExecutionImpactClassification;
  successScore?: number;
  revenueImpactUsd?: number | null;
};

function baseDir(): string {
  return process.env.CONTENT_ENGINE_CONSOLE_STORE_DIR?.trim() || path.join(process.cwd(), "lib", "content-engine", "console-store");
}

function readJson<T>(name: string, fallback: T): T {
  const p = path.join(baseDir(), name);
  try {
    if (!existsSync(p)) return fallback;
    return JSON.parse(readFileSync(p, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(name: string, value: unknown): void {
  const p = path.join(baseDir(), name);
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(value, null, 2), "utf8");
}

export function loadSmartActionExecutions(): SmartActionExecutionRow[] {
  return readJson<SmartActionExecutionRow[]>("execution-queue.json", []);
}

export function saveSmartActionExecutions(rows: readonly SmartActionExecutionRow[]): void {
  writeJson("execution-queue.json", [...rows]);
}

export function upsertSmartActionExecution(input: {
  actionId: string;
  titleSnapshot: string;
  status: SmartActionExecutionStatus;
  notes?: string;
  sprintQueued?: boolean;
}): SmartActionExecutionRow[] {
  const rows = loadSmartActionExecutions();
  const now = new Date().toISOString();
  const idx = rows.findIndex((r) => r.actionId === input.actionId);
  const row: SmartActionExecutionRow = {
    actionId: input.actionId,
    status: input.status,
    titleSnapshot: input.titleSnapshot,
    createdAt: idx >= 0 ? rows[idx]!.createdAt : now,
    updatedAt: now,
    notes: input.notes ?? rows[idx]?.notes,
    sprintQueued: input.sprintQueued ?? rows[idx]?.sprintQueued,
  };
  if (idx >= 0) rows[idx] = row;
  else rows.unshift(row);
  saveSmartActionExecutions(rows.slice(0, 200));
  return rows;
}

export function loadExecutionHistory(): ExecutionHistoryRow[] {
  return readJson<ExecutionHistoryRow[]>("execution-history.json", []);
}

export function appendExecutionHistory(row: Omit<ExecutionHistoryRow, "id" | "executedAt">): ExecutionHistoryRow[] {
  const hist = loadExecutionHistory();
  const next: ExecutionHistoryRow = {
    ...row,
    id: `ex_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    executedAt: new Date().toISOString(),
  };
  const merged = [next, ...hist].slice(0, 300);
  writeJson("execution-history.json", merged);
  return merged;
}

export function updateExecutionHistoryRow(id: string, patch: Partial<ExecutionHistoryRow>): ExecutionHistoryRow | null {
  const hist = loadExecutionHistory();
  const idx = hist.findIndex((h) => h.id === id);
  if (idx < 0) return null;
  const prev = hist[idx]!;
  const merged: ExecutionHistoryRow = { ...prev, ...patch, id: prev.id, actionId: patch.actionId ?? prev.actionId, kind: patch.kind ?? prev.kind, executedAt: prev.executedAt };
  hist[idx] = merged;
  writeJson("execution-history.json", hist);
  return merged;
}
