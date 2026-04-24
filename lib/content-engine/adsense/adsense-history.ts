import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { AdsenseReadinessReport } from "./adsense-readiness";

export type AdsenseHistoryRow = {
  date: string;
  score: number;
  approvalProbability: number;
  issuesCount: number;
};

function storePath(): string {
  return process.env.CONTENT_ENGINE_ADSENSE_HISTORY_JSON?.trim() ?? path.join(process.cwd(), "lib", "content-engine", "adsense", "adsense-history.json");
}

export function loadAdsenseHistory(): AdsenseHistoryRow[] {
  const p = storePath();
  try {
    if (!existsSync(p)) return [];
    const raw = JSON.parse(readFileSync(p, "utf8")) as unknown;
    return Array.isArray(raw) ? (raw as AdsenseHistoryRow[]) : [];
  } catch {
    return [];
  }
}

export function saveAdsenseHistory(rows: readonly AdsenseHistoryRow[]): void {
  const p = storePath();
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(rows, null, 2), "utf8");
}

export function appendAdsenseHistory(report: AdsenseReadinessReport): AdsenseHistoryRow[] {
  const rows = loadAdsenseHistory();
  const next: AdsenseHistoryRow = {
    date: new Date().toISOString().slice(0, 10),
    score: report.score,
    approvalProbability: report.approvalProbability,
    issuesCount: report.issues.length,
  };
  const last = rows[0];
  if (last?.date === next.date) {
    rows[0] = next;
  } else {
    rows.unshift(next);
  }
  const trimmed = rows.slice(0, 60);
  saveAdsenseHistory(trimmed);
  return trimmed;
}
