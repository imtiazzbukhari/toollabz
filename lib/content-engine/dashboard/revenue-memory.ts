import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { SprintExecutionRecord } from "./sprint-execution-tracker";
import { clusterIdForPath } from "./cluster-utils";
import { buildPageTypeClassification } from "./page-type-classifier";

export type RevenueMemoryRecord = {
  actionId: string;
  weekOf: string;
  targetPage: string;
  fixType: SprintExecutionRecord["exactFix"];
  pageType: "informational" | "comparison" | "decision" | "calculator";
  clusterId: string | null;
  expectedRevenueImpactUsd: number;
  actualRevenueImpactUsd: number;
  completedAt: string;
  roiRatio: number;
  loggedAt: string;
};

function memoryPath(): string {
  return (
    process.env.CONTENT_ENGINE_REVENUE_MEMORY_JSON?.trim() ??
    path.join(process.cwd(), "lib", "content-engine", "dashboard", "revenue-memory.json")
  );
}

export function loadRevenueMemory(): RevenueMemoryRecord[] {
  const p = memoryPath();
  try {
    if (!existsSync(p)) return [];
    const raw = JSON.parse(readFileSync(p, "utf8")) as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter((x): x is RevenueMemoryRecord => Boolean(x) && typeof x === "object") as RevenueMemoryRecord[];
  } catch {
    return [];
  }
}

export function saveRevenueMemory(rows: readonly RevenueMemoryRecord[]): void {
  const p = memoryPath();
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(rows, null, 2), "utf8");
}

export function syncRevenueMemoryFromExecution(rows: readonly SprintExecutionRecord[]): RevenueMemoryRecord[] {
  const prev = loadRevenueMemory();
  const byId = new Map(prev.map((r) => [r.actionId, r]));
  for (const r of rows) {
    if (r.status !== "done" || !Number.isFinite(r.actualRevenueImpactUsd)) continue;
    if (byId.has(r.id)) continue;
    const pt = buildPageTypeClassification([r.targetPage], 1)[0]?.type ?? "informational";
    const expected = Math.max(0.01, r.expectedRevenueImpactUsd);
    const actual = Math.max(0, r.actualRevenueImpactUsd ?? 0);
    byId.set(r.id, {
      actionId: r.id,
      weekOf: r.weekOf,
      targetPage: r.targetPage,
      fixType: r.exactFix,
      pageType: pt,
      clusterId: clusterIdForPath(r.targetPage),
      expectedRevenueImpactUsd: r.expectedRevenueImpactUsd,
      actualRevenueImpactUsd: actual,
      completedAt: r.completionDate ?? new Date().toISOString().slice(0, 10),
      roiRatio: Number((actual / expected).toFixed(3)),
      loggedAt: new Date().toISOString(),
    });
  }
  const out = [...byId.values()].sort((a, b) => a.completedAt.localeCompare(b.completedAt) || a.actionId.localeCompare(b.actionId));
  saveRevenueMemory(out);
  return out;
}

