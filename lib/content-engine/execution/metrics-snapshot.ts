import type { PerformanceAggregates } from "../performance/types";
import type { PagePerformanceRow } from "../dashboard/page-performance";

export type PageExecutionSnapshot = {
  impressions: number;
  clicks: number;
  /** CTR as percentage 0–100 (same scale as page performance table). */
  ctr: number;
  position: number | null;
  /** ISO time when snapshot was taken (optional). */
  capturedAt?: string;
};

function n(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const x = Number(v);
    return Number.isFinite(x) ? x : fallback;
  }
  return fallback;
}

/**
 * Safe GSC row → snapshot. Missing page returns null (caller must not crash).
 */
export function pageExecutionSnapshotFromAggregates(
  path: string,
  performance: PerformanceAggregates | null,
): PageExecutionSnapshot | null {
  if (!path || !performance?.pages?.length) return null;
  const p = performance.pages.find((x) => x.path === path);
  if (!p) return null;
  const impressions = Math.max(0, n(p.impressions));
  const clicks = Math.max(0, n(p.clicks));
  const ctrRatio = impressions > 0 ? clicks / impressions : 0;
  const pos = p.position;
  return {
    impressions,
    clicks,
    ctr: Number((ctrRatio * 100).toFixed(4)),
    position: pos != null && Number.isFinite(pos) ? Number(pos.toFixed(2)) : null,
    capturedAt: performance.updatedAt,
  };
}

export function pageExecutionSnapshotFromPerformanceRow(row: PagePerformanceRow): PageExecutionSnapshot {
  return {
    impressions: n(row.impressions),
    clicks: n(row.clicks),
    ctr: n(row.ctr),
    position: row.averagePosition != null && Number.isFinite(row.averagePosition) ? n(row.averagePosition) : null,
  };
}

/** Parse loose JSON / legacy history metrics into a snapshot; invalid → null fields coerced. */
export function pageExecutionSnapshotFromUnknown(raw: Record<string, unknown> | null | undefined): PageExecutionSnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const impressions = n(raw.impressions);
  const clicks = n(raw.clicks);
  const ctr = n(raw.ctr);
  const positionRaw = raw.position ?? raw.averagePosition;
  const position = positionRaw != null && Number.isFinite(n(positionRaw)) ? n(positionRaw) : null;
  if (impressions <= 0 && clicks <= 0 && ctr <= 0 && position == null) return null;
  return {
    impressions,
    clicks,
    ctr: ctr > 0 && ctr <= 1 ? Number((ctr * 100).toFixed(4)) : ctr,
    position,
    capturedAt: typeof raw.capturedAt === "string" ? raw.capturedAt : undefined,
  };
}
