import type { BehaviorAggregates, BehaviorBeacon, PageBehaviorRollup } from "./behavior-types";

const MAX_ACTIVE_MS = 600_000;
const MAX_SCROLL = 1;

function bucketScroll(s: number): keyof PageBehaviorRollup["scrollHistogram"] {
  if (s < 0.25) return "q0_25";
  if (s < 0.5) return "q25_50";
  if (s < 0.75) return "q50_75";
  return "q75_1";
}

function normalizeBeacon(b: BehaviorBeacon): BehaviorBeacon | null {
  const path = typeof b.path === "string" ? b.path.trim() : "";
  if (!path.startsWith("/") || path.length > 512) return null;
  const maxScroll = Math.min(MAX_SCROLL, Math.max(0, Number(b.maxScroll)));
  const activeMs = Math.min(MAX_ACTIVE_MS, Math.max(0, Math.floor(Number(b.activeMs))));
  if (!Number.isFinite(maxScroll) || !Number.isFinite(activeMs)) return null;
  const lastSection =
    typeof b.lastSection === "string" && b.lastSection.length > 0 && b.lastSection.length <= 64
      ? b.lastSection.replace(/[^\w-]/g, "").slice(0, 64) || undefined
      : undefined;
  const entryKeywordRaw = typeof b.entryKeyword === "string" ? b.entryKeyword.toLowerCase().trim() : "";
  const entryKeyword = entryKeywordRaw.replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").slice(0, 80).trim() || undefined;
  const toolClicks = Number.isFinite(Number(b.toolClicks)) ? Math.max(0, Math.floor(Number(b.toolClicks))) : 0;
  const conversionEvents = Number.isFinite(Number(b.conversionEvents)) ? Math.max(0, Math.floor(Number(b.conversionEvents))) : 0;
  const segmentHint =
    b.segmentHint === "scanner" || b.segmentHint === "researcher" || b.segmentHint === "ready_to_act"
      ? b.segmentHint
      : undefined;
  return { path, maxScroll, activeMs, lastSection, entryKeyword, toolClicks, conversionEvents, segmentHint };
}

function emptyRollup(path: string, updatedAt: string): PageBehaviorRollup {
  return {
    path,
    sampleCount: 0,
    avgMaxScroll: 0,
    avgActiveMs: 0,
    scrollHistogram: { q0_25: 0, q25_50: 0, q50_75: 0, q75_1: 0 },
    exitBySection: {},
    entryKeywords: {},
    toolClickCount: 0,
    conversionEventCount: 0,
    segmentCounts: { scanner: 0, researcher: 0, ready_to_act: 0 },
    updatedAt,
  };
}

function mergeOne(existing: PageBehaviorRollup, b: BehaviorBeacon, updatedAt: string): PageBehaviorRollup {
  const n = existing.sampleCount + 1;
  const avgMaxScroll = (existing.avgMaxScroll * existing.sampleCount + b.maxScroll) / n;
  const avgActiveMs = (existing.avgActiveMs * existing.sampleCount + b.activeMs) / n;
  const hist = { ...existing.scrollHistogram };
  hist[bucketScroll(b.maxScroll)] += 1;
  const exitBySection = { ...existing.exitBySection };
  const exitKey = b.lastSection ?? "_unknown";
  exitBySection[exitKey] = (exitBySection[exitKey] ?? 0) + 1;
  const entryKeywords = { ...existing.entryKeywords };
  if (b.entryKeyword) entryKeywords[b.entryKeyword] = (entryKeywords[b.entryKeyword] ?? 0) + 1;
  const segmentCounts = { ...existing.segmentCounts };
  if (b.segmentHint) segmentCounts[b.segmentHint] += 1;
  return {
    path: existing.path,
    sampleCount: n,
    avgMaxScroll,
    avgActiveMs,
    scrollHistogram: hist,
    exitBySection,
    entryKeywords,
    toolClickCount: existing.toolClickCount + (b.toolClicks ?? 0),
    conversionEventCount: existing.conversionEventCount + (b.conversionEvents ?? 0),
    segmentCounts,
    updatedAt,
  };
}

/**
 * Merge validated beacons into aggregates (pure). Call after normalizing paths.
 */
export function mergeBehaviorBeacons(
  current: BehaviorAggregates | null,
  beacons: readonly BehaviorBeacon[],
  updatedAt: string,
): BehaviorAggregates {
  const byPath: Record<string, PageBehaviorRollup> = current ? { ...current.byPath } : {};
  for (const raw of beacons) {
    const b = normalizeBeacon(raw);
    if (!b) continue;
    const prev = byPath[b.path] ?? emptyRollup(b.path, updatedAt);
    byPath[b.path] = mergeOne(prev, b, updatedAt);
  }
  return {
    updatedAt,
    source: current?.source,
    byPath,
  };
}

export function parseBehaviorBeaconsBody(body: unknown): BehaviorBeacon[] {
  if (!body || typeof body !== "object") return [];
  const rec = body as Record<string, unknown>;
  const events = rec.events;
  if (!Array.isArray(events)) return [];
  const out: BehaviorBeacon[] = [];
  for (const e of events) {
    if (!e || typeof e !== "object") continue;
    const o = e as Record<string, unknown>;
    out.push({
      path: typeof o.path === "string" ? o.path : "",
      maxScroll: Number(o.maxScroll),
      activeMs: Number(o.activeMs),
      lastSection: typeof o.lastSection === "string" ? o.lastSection : undefined,
      entryKeyword: typeof o.entryKeyword === "string" ? o.entryKeyword : undefined,
      toolClicks: Number(o.toolClicks ?? 0),
      conversionEvents: Number(o.conversionEvents ?? 0),
      segmentHint:
        o.segmentHint === "scanner" || o.segmentHint === "researcher" || o.segmentHint === "ready_to_act"
          ? o.segmentHint
          : undefined,
    });
  }
  return out.slice(0, 25);
}
