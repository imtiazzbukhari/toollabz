import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { BehaviorAggregates } from "./behavior-types";
import { mergeBehaviorBeacons, parseBehaviorBeaconsBody } from "./merge-behavior-rollups";

function behaviorOutputPath(): string | null {
  const env = process.env.CONTENT_ENGINE_BEHAVIOR_JSON?.trim();
  if (env) return env;
  return path.join(process.cwd(), "lib", "content-engine", "growth", "behavior-aggregates.json");
}

export function persistBehaviorMergeFromRequestBody(body: unknown): {
  ok: boolean;
  merged?: BehaviorAggregates;
  error?: string;
  persisted: boolean;
} {
  if (process.env.CONTENT_ENGINE_BEHAVIOR_PERSIST !== "1") {
    return { ok: false, error: "Persistence disabled (set CONTENT_ENGINE_BEHAVIOR_PERSIST=1).", persisted: false };
  }
  const beacons = parseBehaviorBeaconsBody(body);
  if (beacons.length === 0) return { ok: false, error: "No valid events.", persisted: false };

  const outPath = behaviorOutputPath();
  if (!outPath) return { ok: false, error: "No output path.", persisted: false };

  let current: BehaviorAggregates | null = null;
  try {
    const raw = JSON.parse(readFileSync(outPath, "utf8")) as unknown;
    if (raw && typeof raw === "object" && "byPath" in raw) {
      current = raw as BehaviorAggregates;
    }
  } catch {
    current = null;
  }

  const updatedAt = new Date().toISOString().slice(0, 10);
  const merged = mergeBehaviorBeacons(current, beacons, updatedAt);
  merged.source = merged.source ?? "first_party_collect";

  const dir = path.dirname(outPath);
  mkdirSync(dir, { recursive: true });
  const tmp = `${outPath}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(merged, null, 2), "utf8");
  renameSync(tmp, outPath);

  return { ok: true, merged, persisted: true };
}
