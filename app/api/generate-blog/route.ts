import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { runBlogGenerationPipeline } from "@/lib/content-engine/pipeline";
import type { PublishMode } from "@/lib/content-engine/types";
import type { IntentStageMode } from "@/lib/content-engine/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseMode(raw: unknown): PublishMode {
  return raw === "auto" ? "auto" : "safe";
}

function parseIntentStage(raw: unknown): IntentStageMode | undefined {
  if (raw === "auto" || raw === "awareness" || raw === "comparison" || raw === "decision") return raw;
  return undefined;
}

export async function POST(req: NextRequest) {
  const denied = assertContentEngineAuthorized(req);
  if (denied) return denied;

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return Response.json(
      {
        ok: false,
        error: "OPENAI_API_KEY is not configured. Blog generation is disabled to fail safe.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Body must be a JSON object." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const topic = typeof b.topic === "string" ? b.topic.trim() : "";
  const primaryKeyword =
    typeof b.primaryKeyword === "string" && b.primaryKeyword.trim()
      ? b.primaryKeyword.trim()
      : topic;
  const mode = parseMode(b.mode);
  const variationSeed = typeof b.variationSeed === "string" && b.variationSeed.trim() ? b.variationSeed.trim() : undefined;
  const intentStage = parseIntentStage(b.intentStage);
  const behaviorPath = typeof b.behaviorPath === "string" && b.behaviorPath.trim().startsWith("/") ? b.behaviorPath.trim() : undefined;
  const highIntentMode = b.highIntentMode === true;

  if (topic.length < 8) {
    return Response.json({ ok: false, error: "`topic` must be a string with at least 8 characters." }, { status: 400 });
  }
  if (primaryKeyword.length < 3) {
    return Response.json({ ok: false, error: "`primaryKeyword` is too short." }, { status: 400 });
  }

  try {
    const result = await runBlogGenerationPipeline({
      topic,
      primaryKeyword,
      mode,
      variationSeed,
      intentStage,
      behaviorPath,
      highIntentMode,
    });
    const notify = req.nextUrl.searchParams.get("notify") === "1";
    let ping: { ok: boolean; status?: number; error?: string } | undefined;
    if (notify && result.wouldAutoPublish) {
      const { pingGoogleSitemap } = await import("@/lib/content-engine/google-indexing");
      ping = await pingGoogleSitemap();
    }

    return Response.json({
      ok: true,
      published: false,
      note: "Drafts are never written to disk from this route. Merge via PR after human review + manifest regeneration.",
      result: {
        mode: result.mode,
        draft: result.draft,
        quality: result.quality,
        wouldAutoPublish: result.wouldAutoPublish,
        internalLinks: result.internalLinks,
        adsenseFlags: result.adsenseFlags,
        funnel: result.funnel,
        behaviorHintsApplied: result.behaviorHintsApplied,
      },
      ping,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown_error";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
