import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const monetizationPath = path.join(root, "lib", "content-engine", "monetization.json");
const revenuePath = path.join(root, "lib", "content-engine", "revenue.json");
const ctaPath = path.join(root, "lib", "content-engine", "cta-performance.json");

export type MonetizationIntent = "informational" | "commercial" | "transactional";

export type MonetizationSignal = {
  slug: string;
  keyword: string;
  type: MonetizationIntent;
  optimizationApplied: boolean;
  ts: string;
  actions: string[];
  reason?: string;
};

export type RevenueRow = {
  slug: string;
  pageViews: number;
  ctaClicks: number;
  conversions: number;
  conversionRate: number;
  ts: string;
};

type MonetizationStore = {
  rows: MonetizationSignal[];
};

type RevenueStore = {
  rows: RevenueRow[];
};

type CtaVariantPerformance = {
  slug: string;
  variantId: "cta_a" | "cta_b" | "cta_c";
  label: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  ts: string;
};

type CtaStore = {
  rows: CtaVariantPerformance[];
};

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

function readStore(): MonetizationStore {
  const parsed = safeReadJson<Partial<MonetizationStore>>(monetizationPath, {});
  return { rows: Array.isArray(parsed.rows) ? parsed.rows : [] };
}

function writeStore(store: MonetizationStore): void {
  writeJson(monetizationPath, { rows: store.rows.slice(0, 500) });
}

function readRevenueStore(): RevenueStore {
  const parsed = safeReadJson<Partial<RevenueStore>>(revenuePath, {});
  return { rows: Array.isArray(parsed.rows) ? parsed.rows : [] };
}

function writeRevenueStore(store: RevenueStore): void {
  writeJson(revenuePath, { rows: store.rows.slice(0, 1000) });
}

function readCtaStore(): CtaStore {
  const parsed = safeReadJson<Partial<CtaStore>>(ctaPath, {});
  return { rows: Array.isArray(parsed.rows) ? parsed.rows : [] };
}

function writeCtaStore(store: CtaStore): void {
  writeJson(ctaPath, { rows: store.rows.slice(0, 2000) });
}

export function detectIntent(keyword: string, slug?: string): MonetizationIntent {
  const x = `${keyword} ${slug ?? ""}`.toLowerCase();
  const transactional = /(buy|price|pricing|coupon|deal|book|download|order|subscription|checkout)/i.test(x);
  if (transactional) return "transactional";
  const commercial = /(best|vs|review|top|software|tool|calculator|platform|comparison|alternative|affiliate)/i.test(x);
  if (commercial) return "commercial";
  return "informational";
}

export function buildMonetizationActions(intent: MonetizationIntent): string[] {
  if (intent !== "commercial") return [];
  return [
    "Append CTA block: [Try this workflow with your own inputs].",
    "Insert affiliate placeholder: [AFFILIATE_LINK_PLACEHOLDER].",
    "Add a short comparison section with pros/cons bullets.",
  ];
}

export function getCtaVariants(): Array<{ id: "cta_a" | "cta_b" | "cta_c"; label: string; text: string }> {
  return [
    { id: "cta_a", label: "Direct utility CTA", text: "Try this tool now and get instant results." },
    { id: "cta_b", label: "Benefit CTA", text: "Save time and avoid mistakes with this calculator." },
    { id: "cta_c", label: "Proof CTA", text: "Used by teams daily. Run your numbers in seconds." },
  ];
}

export function chooseCtaVariantForSlug(slug: string): { id: "cta_a" | "cta_b" | "cta_c"; label: string; text: string } {
  const variants = getCtaVariants();
  const best = getBestCtaVariant(slug);
  if (best) {
    const selected = variants.find((v) => v.id === best.variantId);
    if (selected) return selected;
  }
  const hash = slug.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return variants[hash % variants.length];
}

export function recordCtaPerformance(input: {
  slug: string;
  variantId: "cta_a" | "cta_b" | "cta_c";
  label: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ts?: string;
}): CtaVariantPerformance {
  const impressions = Math.max(0, Math.round(input.impressions));
  const clicks = Math.max(0, Math.round(input.clicks));
  const conversions = Math.max(0, Math.round(input.conversions));
  const row: CtaVariantPerformance = {
    slug: input.slug,
    variantId: input.variantId,
    label: input.label,
    impressions,
    clicks,
    conversions,
    ctr: impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
    conversionRate: impressions > 0 ? Number(((conversions / impressions) * 100).toFixed(2)) : 0,
    ts: input.ts ?? new Date().toISOString(),
  };
  const prev = readCtaStore();
  writeCtaStore({
    rows: [row, ...prev.rows].slice(0, 2000),
  });
  return row;
}

export function getBestCtaVariant(slug: string): CtaVariantPerformance | null {
  const rows = readCtaStore().rows.filter((x) => x.slug === slug);
  if (!rows.length) return null;
  const merged = new Map<string, { row: CtaVariantPerformance; weight: number }>();
  for (const row of rows) {
    const prev = merged.get(row.variantId);
    if (!prev) {
      merged.set(row.variantId, { row: { ...row }, weight: 1 });
      continue;
    }
    const nextWeight = prev.weight + 1;
    prev.row.impressions += row.impressions;
    prev.row.clicks += row.clicks;
    prev.row.conversions += row.conversions;
    prev.row.ctr = prev.row.impressions > 0 ? Number(((prev.row.clicks / prev.row.impressions) * 100).toFixed(2)) : 0;
    prev.row.conversionRate =
      prev.row.impressions > 0 ? Number(((prev.row.conversions / prev.row.impressions) * 100).toFixed(2)) : 0;
    prev.weight = nextWeight;
  }
  return [...merged.values()]
    .map((x) => x.row)
    .sort((a, b) => b.conversionRate - a.conversionRate || b.ctr - a.ctr)
    .at(0) ?? null;
}

export function readCtaPerformance(limit = 200): CtaVariantPerformance[] {
  return readCtaStore().rows.slice(0, limit);
}

export function recordMonetizationSignal(signal: MonetizationSignal): void {
  const prev = readStore();
  const next = [signal, ...prev.rows.filter((x) => !(x.slug === signal.slug && x.ts === signal.ts))];
  writeStore({ rows: next.slice(0, 500) });
}

export function readMonetizationSignals(limit = 200): MonetizationSignal[] {
  return readStore().rows.slice(0, limit);
}

export function recordRevenueSignal(input: Omit<RevenueRow, "conversionRate" | "ts"> & { ts?: string }): RevenueRow {
  const pageViews = Math.max(0, Math.round(input.pageViews));
  const ctaClicks = Math.max(0, Math.round(input.ctaClicks));
  const conversions = Math.max(0, Math.round(input.conversions));
  const row: RevenueRow = {
    slug: input.slug,
    pageViews,
    ctaClicks,
    conversions,
    conversionRate: pageViews > 0 ? Number(((conversions / pageViews) * 100).toFixed(2)) : 0,
    ts: input.ts ?? new Date().toISOString(),
  };
  const prev = readRevenueStore();
  const next = [row, ...prev.rows.filter((x) => !(x.slug === row.slug && x.ts === row.ts))];
  writeRevenueStore({ rows: next.slice(0, 1000) });
  return row;
}

export function readRevenueSignals(limit = 300): RevenueRow[] {
  return readRevenueStore().rows.slice(0, limit);
}

export function buildRevenueSummary(limit = 10): {
  pageViews: number;
  ctaClicks: number;
  conversions: number;
  conversionRate: number;
  topPages: Array<{ slug: string; views: number; ctaClicks: number; conversions: number }>;
} {
  const rows = readRevenueSignals(500);
  const totals = { pageViews: 0, ctaClicks: 0, conversions: 0 };
  const bySlug = new Map<string, { views: number; ctaClicks: number; conversions: number }>();
  for (const r of rows) {
    totals.pageViews += r.pageViews;
    totals.ctaClicks += r.ctaClicks;
    totals.conversions += r.conversions;
    const prev = bySlug.get(r.slug) ?? { views: 0, ctaClicks: 0, conversions: 0 };
    bySlug.set(r.slug, {
      views: prev.views + r.pageViews,
      ctaClicks: prev.ctaClicks + r.ctaClicks,
      conversions: prev.conversions + r.conversions,
    });
  }
  const topPages = [...bySlug.entries()]
    .map(([slug, x]) => ({ slug, views: x.views, ctaClicks: x.ctaClicks, conversions: x.conversions }))
    .sort((a, b) => b.conversions - a.conversions || b.ctaClicks - a.ctaClicks || b.views - a.views)
    .slice(0, limit);
  const conversionRate = totals.pageViews > 0 ? Number(((totals.conversions / totals.pageViews) * 100).toFixed(2)) : 0;
  return { ...totals, conversionRate, topPages };
}

