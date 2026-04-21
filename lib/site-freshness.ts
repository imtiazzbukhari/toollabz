/**
 * Site-wide content refresh stamp for visible "Last updated" copy and JSON-LD dates.
 * Override in production with NEXT_PUBLIC_SITE_LAST_UPDATED=YYYY-MM-DD when you ship content changes.
 */
const RAW = process.env.NEXT_PUBLIC_SITE_LAST_UPDATED?.trim() ?? "2026-04-21";

function normalizeIsoDate(s: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return "2026-04-21";
}

export const SITE_LAST_UPDATED_ISO = normalizeIsoDate(RAW);

/** ISO datetime (noon UTC) for schema.org dateModified fields. */
export const SITE_LAST_UPDATED_DATE_TIME = `${SITE_LAST_UPDATED_ISO}T12:00:00.000Z`;

export function formatSiteLastUpdatedForDisplay(): string {
  const d = new Date(SITE_LAST_UPDATED_ISO + "T12:00:00Z");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

/** Stable per-slug rank that shifts when SITE_LAST_UPDATED_ISO changes (freshness shuffle without random SSR). */
export function freshnessRankForSlug(slug: string): number {
  let h = 0;
  const seed = `${slug}|${SITE_LAST_UPDATED_ISO}`;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  return h;
}
