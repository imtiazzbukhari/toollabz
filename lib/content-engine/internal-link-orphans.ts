import { tools } from "@/lib/tools/data";
import type { GscPageMetric } from "./performance/types";

/** Count lightweight inbound signals from other tools (related[] + raw /tools/ slug mentions). */
export function countToolInboundSignals(targetSlug: string): number {
  const path = `/tools/${targetSlug}`;
  let n = 0;
  for (const t of tools) {
    if (t.slug === targetSlug) continue;
    if (t.related?.includes(targetSlug)) n += 2;
    if (t.description.includes(path)) n += 1;
  }
  return n;
}

export type OrphanLinkHint = {
  path: string;
  slug: string;
  impressions: number;
  inboundSignals: number;
  note: string;
};

/**
 * Flag tool URLs with meaningful GSC impressions but weak internal-graph support (heuristic, not a live crawl).
 */
export function buildOrphanToolLinkHints(pages: readonly GscPageMetric[], limit = 14): OrphanLinkHint[] {
  const out: OrphanLinkHint[] = [];
  for (const p of pages) {
    const m = p.path.match(/^\/tools\/([^/]+)\/?$/i);
    if (!m?.[1]) continue;
    const slug = m[1].toLowerCase();
    const inboundSignals = countToolInboundSignals(slug);
    if (p.impressions < 250) continue;
    if (inboundSignals >= 4) continue;
    out.push({
      path: p.path.startsWith("/") ? p.path : `/${p.path}`,
      slug,
      impressions: p.impressions,
      inboundSignals,
      note: "Low cross-linking from other tools; add contextual links from hubs and related calculators.",
    });
  }
  return out
    .sort((a, b) => b.impressions - a.impressions || a.inboundSignals - b.inboundSignals)
    .slice(0, limit);
}
