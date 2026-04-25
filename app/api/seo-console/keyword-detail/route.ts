import type { NextRequest } from "next/server";
import { isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";
import { getKeywordArtifact, keywordToSlug, saveKeywordArtifactEdits, saveKeywordToolArtifact } from "@/lib/content-engine/keyword-artifact-store";
import type { BlogPipelineResult, ToolGenerationSpec } from "@/lib/content-engine/types";
import { runBlogGenerationPipeline } from "@/lib/content-engine/pipeline";
import { generateToolSpecWithGroq } from "@/lib/content-engine/llm-groq";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

function deriveToolName(keyword: string): string {
  const safe = keyword
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 10)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return safe ? `${safe} Tool` : "Generated Tool";
}

export async function GET(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  const keyword = req.nextUrl.searchParams.get("keyword")?.trim() || "";
  if (!keyword) return Response.json({ ok: false, error: "keyword is required." }, { status: 400 });
  const artifact = getKeywordArtifact(keyword);
  return Response.json({ ok: true, artifact, keyword, slug: keywordToSlug(keyword) });
}

export async function POST(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }
  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const action = typeof rec.action === "string" ? rec.action : "save";
  const keyword = typeof rec.keyword === "string" ? rec.keyword.trim() : "";
  if (!keyword) return Response.json({ ok: false, error: "keyword is required." }, { status: 400 });

  if (action === "regenerate_blog" || action === "regenerate_all") {
    const result = await runBlogGenerationPipeline({ topic: keyword, primaryKeyword: keyword, mode: "safe" });
    if (action === "regenerate_blog") {
      const artifact = saveKeywordArtifactEdits({ keyword, blogResult: result });
      return Response.json({ ok: true, artifact });
    }
    const toolSpec = await generateToolSpecWithGroq({
      keyword,
      slug: keywordToSlug(keyword),
      name: deriveToolName(keyword),
      category: "finance",
    });
    const artifact = saveKeywordArtifactEdits({ keyword, blogResult: result, toolSpec });
    return Response.json({ ok: true, artifact });
  }

  if (action === "regenerate_tool") {
    const toolSpec = await generateToolSpecWithGroq({
      keyword,
      slug: keywordToSlug(keyword),
      name: deriveToolName(keyword),
      category: typeof rec.toolCategory === "string" ? rec.toolCategory : "finance",
    });
    const artifact = saveKeywordToolArtifact(keyword, toolSpec);
    return Response.json({ ok: true, artifact });
  }

  const blogResult = rec.blogResult as BlogPipelineResult | undefined;
  const toolSpec = rec.toolSpec as ToolGenerationSpec | undefined;
  if (!blogResult && !toolSpec) {
    return Response.json({ ok: false, error: "Provide blogResult and/or toolSpec for save action." }, { status: 400 });
  }
  const artifact = saveKeywordArtifactEdits({ keyword, blogResult, toolSpec });
  return Response.json({ ok: true, artifact });
}
