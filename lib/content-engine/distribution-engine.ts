import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const storePath = path.join(root, "lib", "content-engine", "distribution.json");
const DAILY_POST_LIMIT = 2;

export type DistributionDraft = {
  slug: string;
  keyword: string;
  platform: "twitter" | "pinterest" | "reddit";
  post: string;
  strategy: string;
  safeMode: true;
  status: "draft" | "posted";
  postedAt?: string;
  ts: string;
};

type DistributionStore = { rows: DistributionDraft[] };

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(filePath: string, data: unknown): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readStore(): DistributionStore {
  const parsed = safeReadJson<Partial<DistributionStore>>(storePath, {});
  return { rows: Array.isArray(parsed.rows) ? parsed.rows : [] };
}

function writeStore(store: DistributionStore): void {
  writeJson(storePath, { rows: store.rows.slice(0, 1000) });
}

export function generateDistributionDrafts(input: { slug: string; keyword: string }): DistributionDraft[] {
  const baseUrl = `https://example.com/tools/${input.slug}`;
  return [
    {
      slug: input.slug,
      keyword: input.keyword,
      platform: "twitter",
      post: `Built a free ${input.keyword} tool with practical examples. Try it: ${baseUrl} #seo #buildinpublic`,
      strategy: "Post during peak weekday hours, then reply with use-case thread.",
      safeMode: true,
      status: "draft",
      ts: new Date().toISOString(),
    },
    {
      slug: input.slug,
      keyword: input.keyword,
      platform: "pinterest",
      post: `Pin idea: '${input.keyword} checklist + calculator'. Landing page: ${baseUrl}`,
      strategy: "Create one infographic pin and one carousel pin; no repetitive posting.",
      safeMode: true,
      status: "draft",
      ts: new Date().toISOString(),
    },
    {
      slug: input.slug,
      keyword: input.keyword,
      platform: "reddit",
      post: `I built a ${input.keyword} tool and summarized the methodology. Looking for feedback: ${baseUrl}`,
      strategy: "Share only in relevant subreddit with context and transparent self-promo.",
      safeMode: true,
      status: "draft",
      ts: new Date().toISOString(),
    },
  ];
}

export function recordDistributionDrafts(rows: DistributionDraft[]): void {
  const prev = readStore();
  const next = [...rows, ...prev.rows].filter(
    (row, idx, all) => idx === all.findIndex((x) => x.slug === row.slug && x.platform === row.platform),
  );
  writeStore({ rows: next.slice(0, 1000) });
}

export function readDistributionDrafts(limit = 200): DistributionDraft[] {
  return readStore().rows.slice(0, limit);
}

function isSameDayIso(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10);
}

export function executeDistributionPosts(maxPosts = 2): Array<{ slug: string; platform: string; status: "posted" | "skipped"; reason?: string }> {
  const store = readStore();
  const now = new Date().toISOString();
  const postedToday = store.rows.filter((r) => r.status === "posted" && r.postedAt && isSameDayIso(r.postedAt, now)).length;
  const remaining = Math.max(0, Math.min(maxPosts, DAILY_POST_LIMIT - postedToday));
  if (remaining <= 0) return [];

  const results: Array<{ slug: string; platform: string; status: "posted" | "skipped"; reason?: string }> = [];
  let posted = 0;
  const nextRows = [...store.rows];
  for (const row of nextRows) {
    if (posted >= remaining) break;
    if (row.status !== "draft") continue;
    // Controlled safe execution path; real API posting can be added behind env flags.
    row.status = "posted";
    row.postedAt = now;
    posted += 1;
    results.push({ slug: row.slug, platform: row.platform, status: "posted" });
  }
  writeStore({ rows: nextRows });
  return results;
}

