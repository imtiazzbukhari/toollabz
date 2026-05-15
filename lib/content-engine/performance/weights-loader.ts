import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export type QualityDimensionWeights = {
  uniqueness: number;
  readability: number;
  depth: number;
  seo: number;
  usefulness: number;
  humanization: number;
};

export const DEFAULT_QUALITY_WEIGHTS: QualityDimensionWeights = {
  uniqueness: 0.18,
  readability: 0.14,
  depth: 0.22,
  seo: 0.18,
  usefulness: 0.14,
  humanization: 0.14,
};

let memo: QualityDimensionWeights | undefined;

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function clampWeights(w: QualityDimensionWeights): QualityDimensionWeights {
  const sum =
    w.uniqueness + w.readability + w.depth + w.seo + w.usefulness + w.humanization;
  if (sum <= 0) return { ...DEFAULT_QUALITY_WEIGHTS };
  const n = 1 / sum;
  return {
    uniqueness: w.uniqueness * n,
    readability: w.readability * n,
    depth: w.depth * n,
    seo: w.seo * n,
    usefulness: w.usefulness * n,
    humanization: w.humanization * n,
  };
}

/**
 * Optional `lib/content-engine/performance/weights.json` or `CONTENT_ENGINE_WEIGHTS_JSON` path.
 * Shape: `{ "dimensions": { "uniqueness": 0.2, ... } }` - values renormalized to sum to 1.
 */
export function loadQualityWeights(): QualityDimensionWeights {
  if (memo) return memo;

  const envPath = process.env.CONTENT_ENGINE_WEIGHTS_JSON?.trim();
  const candidates = [
    envPath,
    path.join(process.cwd(), "lib", "content-engine", "performance", "weights.json"),
  ].filter((p): p is string => Boolean(p));

  for (const filePath of candidates) {
    try {
      if (!existsSync(filePath)) continue;
      const raw = JSON.parse(readFileSync(filePath, "utf8")) as unknown;
      if (!isRecord(raw)) continue;
      const d = raw.dimensions;
      if (!isRecord(d)) continue;
      const w: QualityDimensionWeights = {
        uniqueness: Number(d.uniqueness),
        readability: Number(d.readability),
        depth: Number(d.depth),
        seo: Number(d.seo),
        usefulness: Number(d.usefulness),
        humanization: Number(d.humanization),
      };
      if (Object.values(w).some((x) => !Number.isFinite(x))) continue;
      memo = clampWeights(w);
      return memo;
    } catch {
      /* ignore */
    }
  }
  memo = DEFAULT_QUALITY_WEIGHTS;
  return memo;
}

/** Vitest: allow reloading weights from disk between tests. */
export function resetQualityWeightsCacheForTests(): void {
  memo = undefined;
}
