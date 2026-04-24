const MAX_BYTES = 450_000;
const DEFAULT_UA =
  "Mozilla/5.0 (compatible; ToollabzContentIntel/1.0; +https://toollabz.com) AppleWebKit/537.36 (KHTML, like Gecko)";

export type FetchPageResult =
  | { ok: true; url: string; html: string; bytesRead: number }
  | { ok: false; url: string; error: string };

function isAllowedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetch competitor HTML with size cap (server-side only).
 */
export async function fetchPageHtml(url: string, timeoutMs = 14_000): Promise<FetchPageResult> {
  if (!isAllowedUrl(url)) return { ok: false, url, error: "Only https URLs are allowed." };
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: {
        "User-Agent": process.env.CONTENT_ENGINE_FETCH_UA?.trim() || DEFAULT_UA,
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    clearTimeout(t);
    if (!res.ok) return { ok: false, url, error: `HTTP ${res.status}` };
    const reader = res.body?.getReader();
    if (!reader) {
      const text = await res.text();
      return { ok: true, url, html: text.slice(0, MAX_BYTES), bytesRead: Math.min(text.length, MAX_BYTES) };
    }
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > MAX_BYTES) {
          const slice = value.subarray(0, Math.max(0, MAX_BYTES - (total - value.byteLength)));
          if (slice.byteLength) chunks.push(slice);
          break;
        }
        chunks.push(value);
      }
    }
    const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
    const html = buf.toString("utf8", 0, Math.min(buf.length, MAX_BYTES));
    return { ok: true, url, html, bytesRead: html.length };
  } catch (e) {
    clearTimeout(t);
    const msg = e instanceof Error ? e.message : "fetch_failed";
    return { ok: false, url, error: msg };
  }
}
