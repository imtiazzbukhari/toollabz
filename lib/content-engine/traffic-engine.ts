import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const storePath = path.join(root, "lib", "content-engine", "traffic-opportunities.json");

export type TrafficOpportunity = {
  keyword: string;
  score: number;
  reason: string;
  suggestedSlug: string;
  type: "low_competition" | "content_gap" | "new_topic";
};

type TrafficStore = { opportunities: TrafficOpportunity[]; updatedAt: string };

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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function detectTrafficOpportunities(
  rows: Array<{ slug: string; keyword: string; impressions?: number; clicks?: number; position: number }>,
): TrafficOpportunity[] {
  const opportunities: TrafficOpportunity[] = [];
  for (const row of rows) {
    const impressions = row.impressions ?? 0;
    const clicks = row.clicks ?? 0;
    const ctr = impressions > 0 ? clicks / impressions : 0;
    if (row.position > 9 && row.position < 25 && impressions > 20) {
      opportunities.push({
        keyword: row.keyword,
        score: 80,
        reason: "near page-one position with decent impressions",
        suggestedSlug: row.slug,
        type: "low_competition",
      });
    }
    if (impressions > 150 && ctr < 0.02) {
      opportunities.push({
        keyword: `${row.keyword} examples`,
        score: 75,
        reason: "high visibility but weak click-through",
        suggestedSlug: slugify(`${row.slug}-examples`),
        type: "content_gap",
      });
    }
    if (impressions < 15 && row.position > 35) {
      opportunities.push({
        keyword: `best ${row.keyword}`,
        score: 60,
        reason: "low visibility suggests adjacent topic expansion",
        suggestedSlug: slugify(`best-${row.slug}`),
        type: "new_topic",
      });
    }
  }
  return opportunities
    .sort((a, b) => b.score - a.score)
    .filter((x, idx, arr) => arr.findIndex((k) => k.suggestedSlug === x.suggestedSlug) === idx)
    .slice(0, 40);
}

export function persistTrafficOpportunities(opportunities: TrafficOpportunity[]): void {
  writeJson(storePath, { opportunities, updatedAt: new Date().toISOString() });
}

export function readTrafficOpportunities(): TrafficStore {
  return safeReadJson<TrafficStore>(storePath, { opportunities: [], updatedAt: "" });
}

