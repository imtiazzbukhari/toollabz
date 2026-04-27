/** Fetch a page and extract simple signals (best-effort, no JS rendering). */

export type EnrichResult = {
  title: string | null;
  metaDescription: string | null;
  hasWriteForUs: boolean;
  hasResourcesPage: boolean;
  contactEmail: string | null;
  sampleText: string;
};

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export async function enrichUrl(url: string, timeoutMs = 5000): Promise<EnrichResult> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  let html = "";
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "ToollabzBacklinkBot/1.0 (+https://toollabz.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    html = await res.text();
  } catch {
    return {
      title: null,
      metaDescription: null,
      hasWriteForUs: false,
      hasResourcesPage: false,
      contactEmail: null,
      sampleText: "",
    };
  } finally {
    clearTimeout(t);
  }

  const lower = html.toLowerCase();
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const metaMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const hasWriteForUs =
    lower.includes("write for us") || lower.includes("guest post") || lower.includes("contributor guidelines");
  const hasResourcesPage =
    lower.includes("resources") || lower.includes("tool directory") || lower.includes("submit") || lower.includes("add your tool");

  let contactEmail: string | null = null;
  const mails = html.match(EMAIL_RE);
  if (mails?.length) {
    const filtered = mails.filter((e) => !e.endsWith(".png") && !e.includes("example.com"));
    contactEmail = filtered[0] ?? null;
  }

  return {
    title: titleMatch?.[1]?.trim() ?? null,
    metaDescription: metaMatch?.[1]?.trim() ?? null,
    hasWriteForUs,
    hasResourcesPage,
    contactEmail,
    sampleText: html.slice(0, 8000),
  };
}
