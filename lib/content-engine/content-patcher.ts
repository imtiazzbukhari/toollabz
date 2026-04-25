import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const patchLogPath = path.join(root, "lib", "content-engine", "content-patches.json");
const optimizedDir = path.join(root, "lib", "content-engine", "generated", "optimized-pages");

export type ContentPatch = {
  title: string;
  markdown: string;
  source: "seo" | "internal-linking" | "monetization";
};

export type PatchApplyResult = {
  ok: boolean;
  slug: string;
  filePath: string;
  beforeSize: number;
  afterSize: number;
  reason?: string;
};

type PatchLogEntry = {
  ts: string;
  slug: string;
  source: ContentPatch["source"];
  title: string;
  beforeSize: number;
  afterSize: number;
  status: "ok" | "skipped" | "failed";
  reason?: string;
};

type PatchLogStore = {
  rows: PatchLogEntry[];
};

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function safeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function readLogStore(): PatchLogStore {
  const raw = safeReadJson<Partial<PatchLogStore>>(patchLogPath, {});
  return { rows: Array.isArray(raw.rows) ? raw.rows : [] };
}

function writeLogStore(store: PatchLogStore): void {
  mkdirSync(path.dirname(patchLogPath), { recursive: true });
  writeFileSync(patchLogPath, `${JSON.stringify({ rows: store.rows.slice(0, 1000) }, null, 2)}\n`, "utf8");
}

function logPatch(entry: PatchLogEntry): void {
  const prev = readLogStore();
  writeLogStore({ rows: [entry, ...prev.rows] });
}

function sanitizeMarkdown(input: string): string {
  const stripped = input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").trim();
  return stripped.slice(0, 5000);
}

/**
 * Applies additive-only patch: append a new markdown section.
 * Never removes/replaces existing content.
 */
export function applyContentPatch(slug: string, patch: ContentPatch): PatchApplyResult {
  const safe = safeSlug(slug);
  if (!safe) {
    return { ok: false, slug, filePath: "", beforeSize: 0, afterSize: 0, reason: "invalid_slug" };
  }
  const sanitized = sanitizeMarkdown(patch.markdown);
  if (!sanitized) {
    return { ok: false, slug: safe, filePath: "", beforeSize: 0, afterSize: 0, reason: "empty_patch" };
  }

  const filePath = path.join(optimizedDir, `${safe}.md`);
  mkdirSync(path.dirname(filePath), { recursive: true });
  const before = existsSync(filePath) ? readFileSync(filePath, "utf8") : `# ${safe}\n\n`;
  const beforeSize = before.length;
  const section = `\n\n## ${patch.title}\n\n${sanitized}\n`;
  // Skip duplicate exact section to avoid repeated spam.
  if (before.includes(section.trim())) {
    logPatch({
      ts: new Date().toISOString(),
      slug: safe,
      source: patch.source,
      title: patch.title,
      beforeSize,
      afterSize: beforeSize,
      status: "skipped",
      reason: "duplicate_patch_section",
    });
    return { ok: true, slug: safe, filePath, beforeSize, afterSize: beforeSize, reason: "duplicate_patch_section" };
  }
  const after = `${before}${section}`;
  writeFileSync(filePath, after, "utf8");
  const afterSize = after.length;
  logPatch({
    ts: new Date().toISOString(),
    slug: safe,
    source: patch.source,
    title: patch.title,
    beforeSize,
    afterSize,
    status: "ok",
  });
  return { ok: true, slug: safe, filePath, beforeSize, afterSize };
}

export function readContentPatchLogs(limit = 200): PatchLogEntry[] {
  return readLogStore().rows.slice(0, limit);
}

