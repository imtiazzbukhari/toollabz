import type { NextRequest } from "next/server";
import { getPromptVersions, savePromptVersion } from "@/lib/content-engine/console-admin-store";
import { isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";
import { runBlogGenerationPipeline } from "@/lib/content-engine/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  const versions = getPromptVersions();
  return Response.json({ ok: true, versions, active: versions[0] ?? null });
}

export async function POST(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const content = typeof rec.content === "string" ? rec.content.trim() : "";
  const test = rec.test === true;
  if (!content) return Response.json({ ok: false, error: "content is required." }, { status: 400 });

  const versions = savePromptVersion(content);
  if (!test) return Response.json({ ok: true, versions, active: versions[0] ?? null });

  const topic = typeof rec.topic === "string" && rec.topic.trim() ? rec.topic.trim() : "Best SEO opportunities for calculator pages";
  const result = await runBlogGenerationPipeline({
    topic,
    primaryKeyword: "seo opportunities calculator",
    mode: "safe",
    intentStage: "comparison",
  });
  return Response.json({
    ok: true,
    versions,
    active: versions[0] ?? null,
    testResult: {
      quality: result.quality,
      wouldAutoPublish: result.wouldAutoPublish,
      seoTitle: result.draft.seoTitle,
    },
  });
}
