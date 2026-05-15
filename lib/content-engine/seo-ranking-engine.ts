import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchGoogleServiceAccountAccessToken, GOOGLE_SCOPE_WEBMASTERS } from "@/lib/google/service-account-token";
import { buildSitemapEntries } from "./sitemap-data";

const root = process.cwd();
const rankingsPath = path.join(root, "lib", "content-engine", "seo-rankings.json");
const competitorCachePath = path.join(root, "lib", "content-engine", "competitor-cache.json");
const gscDataPath = path.join(root, "lib", "content-engine", "gsc-data.json");

const STAGNANT_CYCLES = 4;
const COMPETITOR_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type RankingTrend = "up" | "down" | "stagnant";

export type SeoRankingRow = {
  keyword: string;
  slug: string;
  indexed: boolean;
  position: number;
  prevPosition?: number;
  trend: RankingTrend;
  stagnantCycles: number;
  internalScore: number;
  lastChecked: string;
  impressions?: number;
  clicks?: number;
  source: "gsc" | "synthetic";
};

export type SeoOptimizationAction = {
  action: "optimize_headings" | "expand_sections" | "append_internal_links" | "indexing_recovery";
  slug: string;
  keyword: string;
  suggestions: string[];
  ts: string;
  status: "ok" | "skipped" | "failed";
  reason?: string;
};

export type CompetitorSnapshot = {
  keyword: string;
  headings: string[];
  wordCount: number;
  fetchedAt: string;
};

type RankingsStore = {
  rows: SeoRankingRow[];
  actions: SeoOptimizationAction[];
};

type CompetitorStore = {
  snapshots: CompetitorSnapshot[];
};

type RankingSignal = {
  keyword: string;
  slug: string;
  processedStatus: "success" | "failed" | "none";
  retryCount: number;
  hasOpenPr: boolean;
};

export type GscRow = {
  slug: string;
  keyword: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  ts: string;
};

export type GscStore = {
  updatedAt: string;
  rows: GscRow[];
};

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function fetchGoogleAccessToken(): Promise<string | null> {
  return fetchGoogleServiceAccountAccessToken(GOOGLE_SCOPE_WEBMASTERS);
}

function writeJson(filePath: string, data: unknown): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readRankingsStore(): RankingsStore {
  const raw = safeReadJson<Partial<RankingsStore>>(rankingsPath, {});
  return {
    rows: Array.isArray(raw.rows) ? raw.rows : [],
    actions: Array.isArray(raw.actions) ? raw.actions : [],
  };
}

function writeRankingsStore(store: RankingsStore): void {
  writeJson(rankingsPath, {
    rows: store.rows.slice(0, 300),
    actions: store.actions.slice(0, 300),
  });
}

function readCompetitorStore(): CompetitorStore {
  const raw = safeReadJson<Partial<CompetitorStore>>(competitorCachePath, {});
  return { snapshots: Array.isArray(raw.snapshots) ? raw.snapshots : [] };
}

function writeCompetitorStore(store: CompetitorStore): void {
  writeJson(competitorCachePath, { snapshots: store.snapshots.slice(0, 500) });
}

function readGscStore(): GscStore {
  return safeReadJson<GscStore>(gscDataPath, { updatedAt: "", rows: [] });
}

export function writeGscStore(store: GscStore): void {
  writeJson(gscDataPath, {
    updatedAt: store.updatedAt,
    rows: store.rows.slice(0, 1500),
  });
}

function safeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function positionToTrend(position: number, prevPosition?: number, stagnantCycles = 0): RankingTrend {
  if (typeof prevPosition !== "number") return "stagnant";
  if (position < prevPosition) return "up";
  if (position > prevPosition) return "down";
  if (stagnantCycles >= STAGNANT_CYCLES) return "stagnant";
  return "up";
}

function buildKeywordFromSlug(slug: string): string {
  return slug.replace(/-/g, " ");
}

/**
 * SAFE ranking proxy (no aggressive scraping):
 * internal score from index status, PR state, and processing health.
 */
function computeSyntheticPosition(signal: RankingSignal, indexed: boolean): number {
  let score = 60;
  if (indexed) score += 18;
  if (signal.processedStatus === "success") score += 12;
  if (signal.hasOpenPr) score += 4;
  score -= Math.min(20, signal.retryCount * 5);
  const bounded = Math.max(10, Math.min(95, score));
  // lower rank number is better; map score to pseudo position 1..90
  return Math.max(1, Math.round(100 - bounded));
}

export async function refreshGscDataForSlugs(slugs: string[]): Promise<GscStore> {
  const siteUrl = process.env.GSC_SITE_URL?.trim();
  const token = await fetchGoogleAccessToken();
  if (!siteUrl || !token || !slugs.length) return readGscStore();
  const endDate = new Date();
  const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const body = {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    dimensions: ["query", "page"],
    rowLimit: 2500,
  };
  try {
    const encodedSite = encodeURIComponent(siteUrl);
    const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(14_000),
    });
    if (!res.ok) return readGscStore();
    const json = (await res.json()) as {
      rows?: Array<{ keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }>;
    };
    const known = new Set(slugs);
    const next: GscRow[] = [];
    for (const row of json.rows ?? []) {
      const keyword = row.keys?.[0]?.trim().toLowerCase() ?? "";
      const pageUrl = row.keys?.[1]?.trim() ?? "";
      if (!keyword || !pageUrl) continue;
      const slug = pageUrl.split("/").filter(Boolean).pop()?.toLowerCase() ?? "";
      if (!slug || !known.has(slug)) continue;
      next.push({
        slug,
        keyword,
        impressions: Number(row.impressions ?? 0),
        clicks: Number(row.clicks ?? 0),
        ctr: Number(row.ctr ?? 0),
        position: Number(row.position ?? 100),
        ts: new Date().toISOString(),
      });
    }
    const mergedBySlug = new Map<string, GscRow>();
    for (const r of next) {
      const prev = mergedBySlug.get(r.slug);
      if (!prev || r.impressions > prev.impressions) mergedBySlug.set(r.slug, r);
    }
    const store = { updatedAt: new Date().toISOString(), rows: [...mergedBySlug.values()] };
    writeGscStore(store);
    return store;
  } catch {
    return readGscStore();
  }
}

export function buildSeoRankings(signals: RankingSignal[]): SeoRankingRow[] {
  const now = new Date().toISOString();
  const prevBySlug = new Map(readRankingsStore().rows.map((r) => [r.slug, r]));
  const gscBySlug = new Map(readGscStore().rows.map((r) => [r.slug, r]));
  const indexedSet = new Set(
    buildSitemapEntries()
      .map((e) => e.loc)
      .filter(Boolean)
      .map((loc) => loc.replace(/^https?:\/\/[^/]+/, "")),
  );
  const out: SeoRankingRow[] = [];
  for (const s of signals) {
    const route = s.slug.startsWith("blog-") ? `/blog/${s.slug}` : `/tools/${s.slug}`;
    const indexed = indexedSet.has(route) || indexedSet.has(`/${s.slug}`);
    const prev = prevBySlug.get(s.slug);
    const gsc = gscBySlug.get(s.slug);
    const position = gsc?.position ?? computeSyntheticPosition(s, indexed);
    const stagnantCycles = prev && prev.position === position ? (prev.stagnantCycles ?? 0) + 1 : 0;
    const trend = positionToTrend(position, prev?.position, stagnantCycles);
    out.push({
      keyword: gsc?.keyword || s.keyword || buildKeywordFromSlug(s.slug),
      slug: s.slug,
      indexed,
      position,
      prevPosition: prev?.position,
      trend,
      stagnantCycles,
      internalScore: Math.max(0, 100 - position),
      lastChecked: now,
      impressions: gsc?.impressions ?? 0,
      clicks: gsc?.clicks ?? 0,
      source: gsc ? "gsc" : "synthetic",
    });
  }
  return out.sort((a, b) => a.position - b.position).slice(0, 150);
}

export async function fetchCompetitorSnapshot(keyword: string): Promise<CompetitorSnapshot | null> {
  const safeKeyword = keyword.trim().toLowerCase();
  if (!safeKeyword) return null;
  const store = readCompetitorStore();
  const existing = store.snapshots.find((x) => x.keyword.toLowerCase() === safeKeyword);
  if (existing && Date.now() - Date.parse(existing.fetchedAt) < COMPETITOR_TTL_MS) return existing;

  try {
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(keyword)}`;
    const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return existing ?? null;
    const html = await res.text();
    const headings = [...html.matchAll(/class="result__a"[^>]*>(.*?)<\/a>/g)]
      .map((m) => m[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 5);
    const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = plain ? plain.split(" ").length : 0;
    const snap: CompetitorSnapshot = {
      keyword: safeKeyword,
      headings,
      wordCount,
      fetchedAt: new Date().toISOString(),
    };
    const next = [snap, ...store.snapshots.filter((x) => x.keyword.toLowerCase() !== safeKeyword)];
    writeCompetitorStore({ snapshots: next.slice(0, 500) });
    return snap;
  } catch {
    return existing ?? null;
  }
}

export function detectRankingTrends(rows: SeoRankingRow[]): Array<{ keyword: string; slug: string; trend: RankingTrend; lastChecked: string }> {
  return rows.map((r) => ({
    keyword: r.keyword,
    slug: r.slug,
    trend: r.trend,
    lastChecked: r.lastChecked,
  }));
}

export function buildOptimizationSuggestions(row: SeoRankingRow, competitor?: CompetitorSnapshot | null): string[] {
  const suggestions: string[] = [];
  suggestions.push(`Add a tighter H2 around "${row.keyword}" near the first content block.`);
  suggestions.push("Expand one practical example section by 120-180 words with user intent language.");
  suggestions.push(`Append 2 internal links from related calculators/articles to /tools/${safeSlug(row.slug)}.`);
  if (competitor?.headings?.[0]) {
    suggestions.push(`Consider a comparison section inspired by competitor angle: "${competitor.headings[0]}".`);
  }
  return suggestions.slice(0, 4);
}

export function persistSeoRankings(rows: SeoRankingRow[]): void {
  const prev = readRankingsStore();
  writeRankingsStore({
    rows,
    actions: prev.actions,
  });
}

export function appendSeoOptimizationAction(action: SeoOptimizationAction): void {
  const prev = readRankingsStore();
  writeRankingsStore({
    rows: prev.rows,
    actions: [action, ...prev.actions].slice(0, 300),
  });
}

export function readSeoRankingSnapshot(): { rows: SeoRankingRow[]; actions: SeoOptimizationAction[] } {
  const store = readRankingsStore();
  return { rows: store.rows, actions: store.actions };
}

