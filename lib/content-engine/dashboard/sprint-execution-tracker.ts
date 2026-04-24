import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { MonetizationSprintPlan } from "./monetization-sprint";

export type SprintExecutionStatus = "pending" | "done";

export type SprintExecutionRecord = {
  id: string;
  weekOf: string;
  targetPage: string;
  exactFix: "rewrite" | "link" | "cta" | "ad_placement";
  status: SprintExecutionStatus;
  expectedRevenueImpactUsd: number;
  confidence: "high" | "medium" | "low";
  completionDate?: string;
  actualRevenueImpactUsd?: number;
  updatedAt: string;
};

function storePath(): string {
  return (
    process.env.CONTENT_ENGINE_SPRINT_EXECUTION_JSON?.trim() ??
    path.join(process.cwd(), "lib", "content-engine", "dashboard", "sprint-execution.json")
  );
}

export function loadSprintExecutionLog(): SprintExecutionRecord[] {
  const p = storePath();
  try {
    if (!existsSync(p)) return [];
    const raw = JSON.parse(readFileSync(p, "utf8")) as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter((r): r is SprintExecutionRecord => Boolean(r) && typeof r === "object") as SprintExecutionRecord[];
  } catch {
    return [];
  }
}

export function saveSprintExecutionLog(rows: readonly SprintExecutionRecord[]): void {
  const p = storePath();
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(rows, null, 2), "utf8");
}

export function syncSprintPlanActions(plan: MonetizationSprintPlan): SprintExecutionRecord[] {
  const now = new Date().toISOString();
  const prev = loadSprintExecutionLog();
  const byId = new Map(prev.map((p) => [p.id, p]));
  for (const a of plan.topActions) {
    const id = `${plan.weekOf}:${a.targetPage}:${a.exactFix}`;
    if (byId.has(id)) continue;
    byId.set(id, {
      id,
      weekOf: plan.weekOf,
      targetPage: a.targetPage,
      exactFix: a.exactFix,
      status: "pending",
      expectedRevenueImpactUsd: a.expectedRevenueImpactUsd,
      confidence: a.confidence,
      updatedAt: now,
    });
  }
  const out = [...byId.values()].sort((a, b) => a.weekOf.localeCompare(b.weekOf) || a.id.localeCompare(b.id));
  saveSprintExecutionLog(out);
  return out;
}

export function updateSprintExecution(input: {
  id: string;
  status: SprintExecutionStatus;
  completionDate?: string;
  actualRevenueImpactUsd?: number;
}): SprintExecutionRecord | null {
  const rows = loadSprintExecutionLog();
  const idx = rows.findIndex((r) => r.id === input.id);
  if (idx < 0) return null;
  const row = rows[idx]!;
  const next: SprintExecutionRecord = {
    ...row,
    status: input.status,
    completionDate: input.completionDate ?? row.completionDate ?? (input.status === "done" ? new Date().toISOString().slice(0, 10) : undefined),
    actualRevenueImpactUsd:
      typeof input.actualRevenueImpactUsd === "number" && Number.isFinite(input.actualRevenueImpactUsd)
        ? input.actualRevenueImpactUsd
        : row.actualRevenueImpactUsd,
    updatedAt: new Date().toISOString(),
  };
  rows[idx] = next;
  saveSprintExecutionLog(rows);
  return next;
}

