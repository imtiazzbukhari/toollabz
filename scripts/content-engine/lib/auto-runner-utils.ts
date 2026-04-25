import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const processedStorePath = path.join(root, "lib", "content-engine", "processed-tools.json");
const runnerLogsPath = path.join(root, "lib", "content-engine", "runner-logs.json");
const RETRY_WINDOW_MS = 10 * 60 * 1000;
const MAX_RETRIES = 3;

export type LatestToolData = {
  toolName: string;
  toolSlug: string;
  hash: string;
  priority: "high" | "normal" | "low";
  updatedAt: string;
  source: "derived";
};

export type ProcessedToolEntry = {
  slug: string;
  hash: string;
  status: "success" | "failed";
  retryCount: number;
  lastAttempt: string;
  processedAt: string;
};

export type ProcessedToolsStore = {
  processed: ProcessedToolEntry[];
};

export type RunnerLogEntry = {
  ts: string;
  system: string;
  step: "scan" | "skip" | "create";
  toolSlug: string;
  status: "ok" | "failed";
  reason?: string;
  source: "derived";
};

type ToolCandidate = {
  toolName: string;
  toolSlug: string;
  priority: "high" | "normal" | "low";
  updatedAt: number;
  raw: string;
};

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function normalizePriority(v: unknown): "high" | "normal" | "low" {
  const value = typeof v === "string" ? v.trim().toLowerCase() : "";
  if (value === "high" || value === "normal" || value === "low") return value;
  if (typeof v === "number") {
    if (v >= 80) return "high";
    if (v <= 30) return "low";
  }
  return "normal";
}

function normalizeProcessedStatus(value: unknown): "success" | "failed" {
  return value === "failed" ? "failed" : "success";
}

function fromGeneratedKeywords(): ToolCandidate[] {
  const filePath = path.join(root, "lib", "content-engine", "generated", "keywords.json");
  const parsed = safeReadJson<{
    items?: Array<{
      updatedAt?: string;
      priority?: string | number;
      tool?: { updatedAt?: string; spec?: { name?: string; slug?: string; priority?: string | number } };
    }>;
  }>(
    filePath,
    {},
  );
  const rows = Array.isArray(parsed.items) ? parsed.items : [];
  const out: ToolCandidate[] = [];
  for (const row of rows) {
    const spec = row.tool?.spec;
    if (!spec?.name) continue;
    const ts = Date.parse(row.tool?.updatedAt ?? row.updatedAt ?? "");
    const updatedAt = Number.isFinite(ts) ? ts : 0;
    const toolName = spec.name.trim();
    const toolSlug = slugify(spec.slug?.trim() || toolName);
    if (!toolSlug || !toolName) continue;
    const priority = normalizePriority(spec.priority ?? row.priority);
    out.push({ toolName, toolSlug, priority, updatedAt, raw: JSON.stringify(spec) });
  }
  return out;
}

function fromToolProposalSpecs(): ToolCandidate[] {
  const base = path.join(root, "lib", "content-engine", "tool-proposals");
  if (!existsSync(base)) return [];
  const dirs = readdirSync(base, { withFileTypes: true }).filter((d) => d.isDirectory());
  const out: ToolCandidate[] = [];
  for (const dir of dirs) {
    const specPath = path.join(base, dir.name, "SPEC.json");
    if (!existsSync(specPath)) continue;
    const parsed = safeReadJson<{ name?: string; slug?: string; priority?: string | number }>(specPath, {});
    if (!parsed.name) continue;
    const updatedAt = statSync(specPath).mtimeMs;
    const toolName = parsed.name.trim();
    const toolSlug = slugify(parsed.slug?.trim() || dir.name || toolName);
    if (!toolSlug) continue;
    const raw = readFileSync(specPath, "utf8");
    out.push({ toolName, toolSlug, priority: normalizePriority(parsed.priority), updatedAt, raw });
  }
  return out;
}

export function getToolQueueData(): LatestToolData[] {
  const merged = [...fromGeneratedKeywords(), ...fromToolProposalSpecs()];
  const bySlug = new Map<string, ToolCandidate>();
  for (const row of merged) {
    const prev = bySlug.get(row.toolSlug);
    if (!prev || row.updatedAt > prev.updatedAt) bySlug.set(row.toolSlug, row);
  }
  const priorityOrder = { high: 0, normal: 1, low: 2 } as const;
  return [...bySlug.values()]
    .sort((a, b) => {
      const pa = priorityOrder[a.priority];
      const pb = priorityOrder[b.priority];
      if (pa !== pb) return pa - pb;
      return b.updatedAt - a.updatedAt;
    })
    .map((row) => ({
      toolName: row.toolName,
      toolSlug: row.toolSlug,
      hash: createHash("sha256").update(`${row.toolSlug}:${row.toolName}:${row.raw}`).digest("hex").slice(0, 16),
      priority: row.priority,
      updatedAt: new Date(row.updatedAt || Date.now()).toISOString(),
      source: "derived",
    }));
}

export function getLatestToolData(): LatestToolData | null {
  return getToolQueueData()[0] ?? null;
}

export function readProcessedTools(): ProcessedToolsStore {
  const raw = safeReadJson<ProcessedToolsStore>(processedStorePath, { processed: [] });
  const processed = Array.isArray(raw.processed) ? raw.processed : [];
  return {
    processed: processed
      .map<ProcessedToolEntry>((item) => ({
        slug: String(item.slug ?? ""),
        hash: String(item.hash ?? ""),
        status: normalizeProcessedStatus(item.status),
        retryCount: Number.isFinite(item.retryCount) ? Number(item.retryCount) : 0,
        lastAttempt: typeof item.lastAttempt === "string" ? item.lastAttempt : new Date(0).toISOString(),
        processedAt: typeof item.processedAt === "string" ? item.processedAt : new Date().toISOString(),
      }))
      .filter((item) => Boolean(item.slug) && Boolean(item.hash)),
  };
}

export function isToolProcessed(slug: string, hash: string): boolean {
  const store = readProcessedTools();
  const item = store.processed.find((x) => x.slug === slug || x.hash === hash);
  if (!item) return false;
  if (item.status === "success") return true;
  const elapsed = Date.now() - Date.parse(item.lastAttempt);
  const retryAllowed = item.retryCount < MAX_RETRIES && elapsed >= RETRY_WINDOW_MS;
  return !retryAllowed;
}

function writeProcessedTools(store: ProcessedToolsStore): void {
  mkdirSync(path.dirname(processedStorePath), { recursive: true });
  writeFileSync(processedStorePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export function markToolProcessed(slug: string, hash: string, status: "success" | "failed"): void {
  const store = readProcessedTools();
  const idx = store.processed.findIndex((item) => item.slug === slug || item.hash === hash);
  const now = new Date().toISOString();
  const existing = idx >= 0 ? store.processed[idx] : null;
  const retryCount = status === "failed" ? (existing?.retryCount ?? 0) + 1 : existing?.retryCount ?? 0;
  const nextEntry: ProcessedToolEntry = {
    slug,
    hash,
    status,
    retryCount,
    lastAttempt: now,
    processedAt: status === "success" ? now : existing?.processedAt ?? now,
  };
  const nextRows = idx >= 0 ? [...store.processed] : [...store.processed];
  if (idx >= 0) nextRows[idx] = nextEntry;
  else nextRows.unshift(nextEntry);
  writeProcessedTools({ processed: nextRows.slice(0, 2000) });
}

export function readRunnerLogs(): RunnerLogEntry[] {
  const parsed = safeReadJson<{ logs?: RunnerLogEntry[] } | RunnerLogEntry[]>(runnerLogsPath, { logs: [] });
  const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed.logs) ? parsed.logs : [];
  return rows.slice(0, 500).map((r) => ({
    ts: r.ts,
    system: r.system || "runner",
    step: r.step,
    toolSlug: r.toolSlug,
    status: r.status,
    reason: r.reason,
    source: "derived",
  }));
}

export function appendRunnerLog(entry: Omit<RunnerLogEntry, "ts"> & Partial<Pick<RunnerLogEntry, "ts">>): void {
  const current = readRunnerLogs();
  const row: RunnerLogEntry = {
    ts: entry.ts ?? new Date().toISOString(),
    system: entry.system,
    step: entry.step,
    toolSlug: entry.toolSlug,
    status: entry.status,
    reason: entry.reason,
    source: "derived",
  };
  const next = [row, ...current].slice(0, 500);
  mkdirSync(path.dirname(runnerLogsPath), { recursive: true });
  writeFileSync(runnerLogsPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
}

export async function hasOpenPrForSlug(slug: string): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repository = process.env.GITHUB_REPOSITORY?.trim();
  if (!token || !repository) return false;
  const [owner, repo] = repository.split("/");
  if (!owner || !repo) return false;
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=100`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) return false;
  const pulls = (await res.json()) as Array<{ title?: string; body?: string; head?: { ref?: string } }>;
  return pulls.some((pr) => {
    const title = (pr.title ?? "").toLowerCase();
    const body = (pr.body ?? "").toLowerCase();
    const head = (pr.head?.ref ?? "").toLowerCase();
    const needle = slug.toLowerCase();
    return title.includes(needle) || body.includes(`slug: \`${needle}\``) || head.includes(`tool-proposal-${needle}-`);
  });
}

export async function getPrStatusRows(): Promise<Array<{ slug: string; status: "open" | "merged" | "closed" | "failed"; createdAt: string; url?: string }>> {
  const processed = readProcessedTools().processed;
  const failedRows = processed
    .filter((x) => x.status === "failed")
    .map((x) => ({ slug: x.slug, status: "failed" as const, createdAt: x.lastAttempt }));
  const token = process.env.GITHUB_TOKEN?.trim();
  const repository = process.env.GITHUB_REPOSITORY?.trim();
  if (!token || !repository) return failedRows;
  const [owner, repo] = repository.split("/");
  if (!owner || !repo) return failedRows;
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) return failedRows;
  const pulls = (await res.json()) as Array<{
    title?: string;
    body?: string;
    state?: string;
    merged_at?: string | null;
    created_at?: string;
    html_url?: string;
    head?: { ref?: string };
  }>;
  const rows = pulls
    .map((pr) => {
      const title = pr.title ?? "";
      const body = pr.body ?? "";
      const head = pr.head?.ref ?? "";
      const slugMatch =
        title.match(/\(([^)]+)\)\s*$/)?.[1] ??
        body.match(/Slug:\s*`([^`]+)`/i)?.[1] ??
        head.match(/tool-proposal-([a-z0-9-]+)-/i)?.[1];
      if (!slugMatch) return null;
      const status: "open" | "merged" | "closed" =
        pr.state === "open"
          ? "open"
          : pr.merged_at
            ? "merged"
            : pr.state === "closed"
              ? "closed"
              : "closed";
      return { slug: slugify(slugMatch), status, createdAt: pr.created_at ?? new Date().toISOString(), url: pr.html_url };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  const bySlug = new Map<string, { slug: string; status: "open" | "merged" | "closed" | "failed"; createdAt: string; url?: string }>();
  for (const row of [...rows, ...failedRows]) {
    const prev = bySlug.get(row.slug);
    if (!prev || Date.parse(row.createdAt) > Date.parse(prev.createdAt)) bySlug.set(row.slug, row);
  }
  return [...bySlug.values()].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
