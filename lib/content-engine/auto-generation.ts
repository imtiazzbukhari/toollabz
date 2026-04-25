import type { PrioritizedOpportunity, ToolGenerationSpec } from "./types";
import { runBlogGenerationPipeline } from "./pipeline";
import { generateToolSpecWithGroq } from "./llm-groq";
import { saveKeywordBlogArtifact, saveKeywordToolArtifact, keywordToSlug } from "./keyword-artifact-store";
import { appendConsoleLog } from "./console-admin-store";
import { setSystemStatus } from "./system-status";

export function isHighPriorityOpportunity(row: Pick<PrioritizedOpportunity, "priority" | "cpcScore">): boolean {
  return (row.cpcScore ?? 0) >= 80 || row.priority >= 80;
}

function toolNameForKeyword(keyword: string): string {
  const words = keyword
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 10)
    .map((w) => w[0].toUpperCase() + w.slice(1));
  return words.length ? `${words.join(" ")} Tool` : "Generated Tool";
}

export async function generateForKeyword(input: {
  keyword: string;
  toolCategory?: string;
}): Promise<{ keyword: string; blogSaved: boolean; toolSaved: boolean; toolSpec?: ToolGenerationSpec }> {
  const keyword = input.keyword.trim();
  if (!keyword) return { keyword: "", blogSaved: false, toolSaved: false };
  setSystemStatus({ name: "content-engine", status: "running" });

  const blog = await runBlogGenerationPipeline({
    topic: keyword,
    primaryKeyword: keyword,
    mode: "safe",
  });
  saveKeywordBlogArtifact(keyword, blog);

  const toolSpec = await generateToolSpecWithGroq({
    keyword,
    slug: keywordToSlug(keyword),
    name: toolNameForKeyword(keyword),
    category: input.toolCategory,
  });
  saveKeywordToolArtifact(keyword, toolSpec);

  appendConsoleLog({
    type: "ai_action",
    level: "info",
    message: `Auto-generated blog + tool artifacts for keyword: ${keyword}`,
  });
  setSystemStatus({ name: "content-engine", status: "idle" });
  return { keyword, blogSaved: true, toolSaved: true, toolSpec };
}

export async function runHighPriorityAutoGeneration(rows: PrioritizedOpportunity[], maxItems = 4): Promise<string[]> {
  const picked = rows.filter(isHighPriorityOpportunity).slice(0, maxItems);
  const done: string[] = [];
  for (const row of picked) {
    try {
      await generateForKeyword({ keyword: row.keyword });
      done.push(row.keyword);
    } catch (error) {
      setSystemStatus({
        name: "content-engine",
        status: "failed",
        error: error instanceof Error ? error.message : "unknown_error",
      });
      appendConsoleLog({
        type: "task_failed",
        level: "error",
        message: `Auto-generation failed for "${row.keyword}": ${error instanceof Error ? error.message : "unknown_error"}`,
      });
    }
  }
  return done;
}
