import type { PerformanceAggregates } from "../performance/types";
import type { OutreachQueueSummary } from "../outreach/queue-store";

export type AuthorityTrackingSnapshot = {
  backlinksAcquiredProxy: number;
  domainAuthorityProxy: number;
  trafficGrowthVsLinks: "aligned" | "traffic_leads" | "links_lead";
  series: Array<{ label: string; authority: number; traffic: number }>;
  note: string;
};

/**
 * Lightweight authority proxy: outreach outcomes + GSC traffic momentum (not Moz API).
 */
export function buildAuthorityTrackingSnapshot(
  performance: PerformanceAggregates | null,
  outreach: OutreachQueueSummary,
): AuthorityTrackingSnapshot {
  const pages = performance?.pages ?? [];
  const prev = performance?.pagesPrevious ?? [];
  const curClicks = pages.reduce((n, p) => n + p.clicks, 0);
  const prevClicks = prev.reduce((n, p) => n + p.clicks, 0);
  const trafficDeltaPct = prevClicks > 0 ? ((curClicks - prevClicks) / prevClicks) * 100 : curClicks > 0 ? 100 : 0;

  const backlinksAcquiredProxy = outreach.linkAcquired + outreach.replied + Math.floor(outreach.sent * 0.2);
  const domainAuthorityProxy = Math.min(100, Math.round(32 + backlinksAcquiredProxy * 2.2 + Math.min(18, trafficDeltaPct)));

  let trafficGrowthVsLinks: AuthorityTrackingSnapshot["trafficGrowthVsLinks"] = "aligned";
  if (trafficDeltaPct > 8 && backlinksAcquiredProxy < 2) trafficGrowthVsLinks = "traffic_leads";
  if (backlinksAcquiredProxy >= 4 && trafficDeltaPct < -3) trafficGrowthVsLinks = "links_lead";

  const series = [
    { label: "T1", authority: Math.max(10, domainAuthorityProxy - 6), traffic: Math.max(0, prevClicks) },
    { label: "T2", authority: domainAuthorityProxy - 2, traffic: Math.max(0, Math.round((prevClicks + curClicks) / 2)) },
    { label: "T3", authority: domainAuthorityProxy, traffic: Math.max(0, curClicks) },
  ];

  return {
    backlinksAcquiredProxy,
    domainAuthorityProxy,
    trafficGrowthVsLinks,
    series,
    note: "Authority is a heuristic proxy from outreach signals + traffic delta until DR imports are wired.",
  };
}
