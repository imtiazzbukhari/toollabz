import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { BlogPipelineResult, ToolGenerationSpec } from "./types";

export type KeywordArtifact = {
  keyword: string;
  slug: string;
  updatedAt: string;
  blog?: {
    updatedAt: string;
    source: "gemini";
    result: BlogPipelineResult;
    markdownPath: string;
  };
  tool?: {
    updatedAt: string;
    source: "groq";
    spec: ToolGenerationSpec;
    specPath: string;
  };
};

type ArtifactIndex = {
  items: KeywordArtifact[];
};

function baseDir(): string {
  return process.env.CONTENT_ENGINE_GENERATED_DIR?.trim() || path.join(process.cwd(), "lib", "content-engine", "generated");
}

function indexPath(): string {
  return path.join(baseDir(), "keywords.json");
}

function readIndex(): ArtifactIndex {
  const p = indexPath();
  try {
    if (!existsSync(p)) return { items: [] };
    const parsed = JSON.parse(readFileSync(p, "utf8")) as ArtifactIndex;
    if (!Array.isArray(parsed.items)) return { items: [] };
    return parsed;
  } catch {
    return { items: [] };
  }
}

function writeIndex(index: ArtifactIndex): void {
  const p = indexPath();
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, `${JSON.stringify(index, null, 2)}\n`, "utf8");
}

export function keywordToSlug(keyword: string): string {
  return keyword
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function ensureItem(keyword: string): KeywordArtifact {
  const slug = keywordToSlug(keyword);
  const index = readIndex();
  const existing = index.items.find((x) => x.keyword === keyword);
  if (existing) return existing;
  const now = new Date().toISOString();
  const next: KeywordArtifact = { keyword, slug, updatedAt: now };
  index.items = [next, ...index.items].slice(0, 500);
  writeIndex(index);
  return next;
}

function upsert(item: KeywordArtifact): KeywordArtifact {
  const index = readIndex();
  const filtered = index.items.filter((x) => x.keyword !== item.keyword);
  index.items = [{ ...item, updatedAt: new Date().toISOString() }, ...filtered].slice(0, 500);
  writeIndex(index);
  return index.items[0];
}

export function getKeywordArtifact(keyword: string): KeywordArtifact | null {
  const clean = keyword.trim();
  if (!clean) return null;
  const index = readIndex();
  return index.items.find((x) => x.keyword === clean) ?? null;
}

export function listKeywordArtifacts(limit = 80): KeywordArtifact[] {
  return readIndex().items.slice(0, limit);
}

export function saveKeywordBlogArtifact(keyword: string, result: BlogPipelineResult): KeywordArtifact {
  const current = ensureItem(keyword);
  const now = new Date().toISOString();
  const blogsDir = path.join(baseDir(), "blogs");
  mkdirSync(blogsDir, { recursive: true });
  const markdownPath = path.join("lib", "content-engine", "generated", "blogs", `${current.slug}.md`);
  const fullMarkdownPath = path.join(process.cwd(), markdownPath);
  const md = [
    `# ${result.draft.seoTitle}`,
    "",
    `- keyword: ${keyword}`,
    `- savedAt: ${now}`,
    "",
    result.draft.bodyMarkdown,
    "",
  ].join("\n");
  writeFileSync(fullMarkdownPath, md, "utf8");
  return upsert({
    ...current,
    blog: {
      updatedAt: now,
      source: "gemini",
      result,
      markdownPath,
    },
  });
}

export function saveKeywordToolArtifact(keyword: string, spec: ToolGenerationSpec): KeywordArtifact {
  const current = ensureItem(keyword);
  const now = new Date().toISOString();
  const toolDir = path.join(baseDir(), "tools");
  mkdirSync(toolDir, { recursive: true });
  const specPath = path.join("lib", "content-engine", "generated", "tools", `${current.slug}.json`);
  const fullPath = path.join(process.cwd(), specPath);
  writeFileSync(fullPath, `${JSON.stringify(spec, null, 2)}\n`, "utf8");
  return upsert({
    ...current,
    tool: {
      updatedAt: now,
      source: "groq",
      spec,
      specPath,
    },
  });
}

export function saveKeywordArtifactEdits(input: { keyword: string; blogResult?: BlogPipelineResult; toolSpec?: ToolGenerationSpec }): KeywordArtifact {
  const { keyword, blogResult, toolSpec } = input;
  const current = ensureItem(keyword);
  let next = current;
  if (blogResult) next = saveKeywordBlogArtifact(keyword, blogResult);
  if (toolSpec) next = saveKeywordToolArtifact(keyword, toolSpec);
  return next;
}
