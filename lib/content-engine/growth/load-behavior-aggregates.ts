import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { BehaviorAggregates } from "./behavior-types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function parseRollup(urlPath: string, row: unknown): import("./behavior-types").PageBehaviorRollup | null {
  if (!isRecord(row)) return null;
  const sampleCount = Number(row.sampleCount);
  const avgMaxScroll = Number(row.avgMaxScroll);
  const avgActiveMs = Number(row.avgActiveMs);
  if (!Number.isFinite(sampleCount) || sampleCount < 0) return null;
  if (!Number.isFinite(avgMaxScroll) || !Number.isFinite(avgActiveMs)) return null;
  const sh = row.scrollHistogram;
  const exitBySection = isRecord(row.exitBySection) ? (row.exitBySection as Record<string, number>) : {};
  const hist = isRecord(sh)
    ? {
        q0_25: Number(sh.q0_25) || 0,
        q25_50: Number(sh.q25_50) || 0,
        q50_75: Number(sh.q50_75) || 0,
        q75_1: Number(sh.q75_1) || 0,
      }
    : { q0_25: 0, q25_50: 0, q50_75: 0, q75_1: 0 };
  const entryKeywordsRaw = isRecord(row.entryKeywords) ? row.entryKeywords : {};
  const entryKeywords = Object.fromEntries(
    Object.entries(entryKeywordsRaw)
      .filter(([k, v]) => typeof k === "string" && typeof v === "number" && Number.isFinite(v))
      .map(([k, v]) => [k.toLowerCase().slice(0, 80), Math.max(0, Math.floor(Number(v)))]),
  );
  const segmentRaw = isRecord(row.segmentCounts) ? row.segmentCounts : {};
  const segmentCounts = {
    scanner: Number(segmentRaw.scanner) || 0,
    researcher: Number(segmentRaw.researcher) || 0,
    ready_to_act: Number(segmentRaw.ready_to_act) || 0,
  };
  const updatedAt = typeof row.updatedAt === "string" ? row.updatedAt : new Date().toISOString().slice(0, 10);
  return {
    path: urlPath,
    sampleCount: Math.floor(sampleCount),
    avgMaxScroll,
    avgActiveMs,
    scrollHistogram: hist,
    exitBySection: Object.fromEntries(
      Object.entries(exitBySection).filter(([, v]) => typeof v === "number" && Number.isFinite(v)),
    ),
    entryKeywords,
    toolClickCount: Math.max(0, Math.floor(Number(row.toolClickCount) || 0)),
    conversionEventCount: Math.max(0, Math.floor(Number(row.conversionEventCount) || 0)),
    segmentCounts,
    updatedAt,
  };
}

function parseAggregates(raw: unknown): BehaviorAggregates | null {
  if (!isRecord(raw)) return null;
  const byPathRaw = raw.byPath;
  if (!isRecord(byPathRaw)) return null;
  const byPath: BehaviorAggregates["byPath"] = {};
  for (const [p, row] of Object.entries(byPathRaw)) {
    const pathKey = p.startsWith("/") ? p : `/${p}`;
    const rollup = parseRollup(pathKey, row);
    if (rollup) byPath[pathKey] = rollup;
  }
  const updatedAt = typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString().slice(0, 10);
  const source = typeof raw.source === "string" ? raw.source : undefined;
  return { updatedAt, source, byPath };
}

/**
 * Optional first-party behavior rollups for engagement feedback.
 * `CONTENT_ENGINE_BEHAVIOR_JSON` → `lib/content-engine/growth/behavior-aggregates.json`.
 */
export function loadBehaviorAggregates(): BehaviorAggregates | null {
  const envPath = process.env.CONTENT_ENGINE_BEHAVIOR_JSON?.trim();
  const candidates = [
    envPath,
    path.join(process.cwd(), "lib", "content-engine", "growth", "behavior-aggregates.json"),
  ].filter((p): p is string => Boolean(p));

  for (const filePath of candidates) {
    try {
      if (!existsSync(filePath)) continue;
      const parsed = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
      const out = parseAggregates(parsed);
      if (out && Object.keys(out.byPath).length > 0) return out;
    } catch {
      /* ignore */
    }
  }
  return null;
}
