import type { NextRequest } from "next/server";
import { mergeBehaviorBeacons, parseBehaviorBeaconsBody } from "@/lib/content-engine/growth/merge-behavior-rollups";
import { loadBehaviorAggregates } from "@/lib/content-engine/growth/load-behavior-aggregates";
import { persistBehaviorMergeFromRequestBody } from "@/lib/content-engine/growth/persist-behavior-aggregates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ingestKey(): string | undefined {
  return process.env.TOOLLABZ_BEHAVIOR_INGEST_KEY?.trim();
}

/**
 * First-party behavior beacons (scroll, active time, exit section).
 * Set `TOOLLABZ_BEHAVIOR_INGEST_KEY` and `NEXT_PUBLIC_TOOLLABZ_BEHAVIOR_INGEST_KEY` to the same random value.
 * Optional: `CONTENT_ENGINE_BEHAVIOR_PERSIST=1` + `CONTENT_ENGINE_BEHAVIOR_JSON` to append rollups on disk (self-hosted / workers).
 */
export async function POST(req: NextRequest) {
  const expected = ingestKey();
  if (!expected) {
    return Response.json({ ok: false, error: "Behavior ingest is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const headerKey = req.headers.get("x-toollabz-behavior-key");
  const bodyKey = typeof rec.ingestKey === "string" ? rec.ingestKey : "";
  if (headerKey !== expected && bodyKey !== expected) {
    return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const beacons = parseBehaviorBeaconsBody(body);
  if (beacons.length === 0) {
    return Response.json({ ok: false, error: "Provide { events: [{ path, maxScroll, activeMs, lastSection? }] }." }, { status: 400 });
  }

  if (process.env.CONTENT_ENGINE_BEHAVIOR_PERSIST === "1") {
    const persisted = persistBehaviorMergeFromRequestBody(body);
    if (!persisted.ok) {
      return Response.json({ ok: false, error: persisted.error ?? "persist_failed" }, { status: 400 });
    }
    return Response.json({ ok: true, persisted: true, samplePaths: beacons.map((b) => b.path) });
  }

  const current = loadBehaviorAggregates();
  const updatedAt = new Date().toISOString().slice(0, 10);
  const merged = mergeBehaviorBeacons(current, beacons, updatedAt);
  return Response.json({
    ok: true,
    persisted: false,
    note: "Merged in-memory for response only; set CONTENT_ENGINE_BEHAVIOR_PERSIST=1 to write aggregates.",
    rollupPreview: Object.keys(merged.byPath).length,
    samplePaths: beacons.map((b) => b.path),
  });
}
