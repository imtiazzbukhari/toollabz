/** Normalize GSC / GA4 page URLs to a site-relative path starting with `/`. */
export function normalizeSearchConsolePath(pageUrl: string): string {
  const raw = pageUrl.trim();
  if (!raw) return "/";
  try {
    const u = new URL(raw.includes("://") ? raw : `https://placeholder.test${raw.startsWith("/") ? "" : "/"}${raw}`);
    const p = u.pathname || "/";
    return p.startsWith("/") ? p : `/${p}`;
  } catch {
    const noQuery = raw.split("?")[0] ?? raw;
    return noQuery.startsWith("/") ? noQuery : `/${noQuery}`;
  }
}

export function isoDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** GSC finalized data is often ~2 days behind; default “yesterday” in API terms. */
export function defaultGscEndLagDays(): number {
  const n = Number(process.env.GSC_DATA_LAG_DAYS ?? 2);
  return Number.isFinite(n) && n >= 0 && n <= 5 ? Math.floor(n) : 2;
}

export function addDaysUtc(isoDate: string, delta: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return isoDateUTC(dt);
}

/** Human-readable UTC windows aligned with dashboard rollups (28d current + prior 28d). */
export function rollupWindowLabelsUtc(): { current28d: string; previous28d: string } {
  const lag = defaultGscEndLagDays();
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - lag);
  const endStr = isoDateUTC(end);
  const curStart = addDaysUtc(endStr, -27);
  const prevEnd = addDaysUtc(endStr, -28);
  const prevStart = addDaysUtc(endStr, -55);
  return {
    current28d: `${curStart} → ${endStr} (UTC)`,
    previous28d: `${prevStart} → ${prevEnd} (UTC)`,
  };
}
