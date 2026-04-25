import { siteUrl } from "@/lib/seo";
import { contentEngineLog } from "./logging";
import { setSystemStatus } from "./system-status";

export function googlePingUrlForSitemap(sitemapUrl: string): string {
  const encoded = encodeURIComponent(sitemapUrl);
  return `https://www.google.com/ping?sitemap=${encoded}`;
}

const MAX_ATTEMPTS = 3;
const BASE_MS = 600;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Best-effort sitemap ping (Google documents this endpoint; treat as a hint, not guaranteed indexing).
 */
export async function pingGoogleSitemap(sitemapUrl = `${siteUrl}/sitemap.xml`): Promise<{ ok: boolean; status?: number; error?: string }> {
  setSystemStatus({ name: "sitemap-generator", status: "running" });
  contentEngineLog({ type: "sitemap_ping_start", sitemapUrl });
  const url = googlePingUrlForSitemap(sitemapUrl);
  let lastStatus: number | undefined;
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { method: "GET", redirect: "follow", cache: "no-store" });
      lastStatus = res.status;
      if (res.ok) {
        contentEngineLog({ type: "sitemap_ping_ok", sitemapUrl, status: res.status, attempt });
        setSystemStatus({ name: "sitemap-generator", status: "idle" });
        return { ok: true, status: res.status };
      }
      lastError = `HTTP ${res.status}`;
      contentEngineLog({ type: "sitemap_ping_fail", sitemapUrl, status: res.status, message: lastError, attempt });
    } catch (e) {
      lastError = e instanceof Error ? e.message : "unknown_error";
      contentEngineLog({ type: "sitemap_ping_fail", sitemapUrl, message: lastError, attempt });
    }
    if (attempt < MAX_ATTEMPTS) await sleep(BASE_MS * attempt);
  }

  setSystemStatus({ name: "sitemap-generator", status: "failed", error: lastError ?? "sitemap_ping_failed" });
  return { ok: false, status: lastStatus, error: lastError };
}
