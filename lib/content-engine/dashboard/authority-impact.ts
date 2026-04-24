import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { PerformanceAggregates } from "../performance/types";

export type BacklinkImpactRecord = {
  path: string;
  backlinksAcquired: number;
  acquiredAt: string;
};

export type AuthorityImpactRow = {
  path: string;
  backlinksAcquired: number;
  rankingDelta: number | null;
  trafficDeltaPct: number | null;
  impactScore: number;
};

function loadRecords(): BacklinkImpactRecord[] {
  const file =
    process.env.CONTENT_ENGINE_BACKLINK_IMPACT_JSON?.trim() ??
    path.join(process.cwd(), "lib", "content-engine", "dashboard", "backlink-impact.json");
  try {
    if (!existsSync(file)) return [];
    const parsed = JSON.parse(readFileSync(file, "utf8")) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is BacklinkImpactRecord => Boolean(x) && typeof x === "object")
      .map((x) => ({
        path: typeof x.path === "string" ? x.path : "",
        backlinksAcquired: Number(x.backlinksAcquired) || 0,
        acquiredAt: typeof x.acquiredAt === "string" ? x.acquiredAt : "",
      }))
      .filter((x) => x.path.startsWith("/") && x.backlinksAcquired > 0);
  } catch {
    return [];
  }
}

export function buildAuthorityImpactSnapshot(perf: PerformanceAggregates | null, max = 20): AuthorityImpactRow[] {
  const records = loadRecords();
  const curByPath = new Map((perf?.pages ?? []).map((p) => [p.path, p]));
  const prevByPath = new Map((perf?.pagesPrevious ?? []).map((p) => [p.path, p]));
  const out: AuthorityImpactRow[] = [];
  for (const r of records) {
    const cur = curByPath.get(r.path);
    const prev = prevByPath.get(r.path);
    const rankingDelta =
      cur?.position != null && prev?.position != null ? Number((prev.position - cur.position).toFixed(2)) : null;
    const trafficDeltaPct =
      cur && prev && prev.clicks > 0 ? Number((((cur.clicks - prev.clicks) / prev.clicks) * 100).toFixed(2)) : null;
    const impactScore = Math.min(
      100,
      Math.round(r.backlinksAcquired * 12 + (rankingDelta ?? 0) * 7 + ((trafficDeltaPct ?? 0) > 0 ? (trafficDeltaPct ?? 0) * 0.35 : 0)),
    );
    out.push({ path: r.path, backlinksAcquired: r.backlinksAcquired, rankingDelta, trafficDeltaPct, impactScore });
  }
  out.sort((a, b) => b.impactScore - a.impactScore || a.path.localeCompare(b.path));
  return out.slice(0, max);
}

