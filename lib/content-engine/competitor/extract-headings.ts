/** Strip common non-content regions before heading extraction. */
export function stripNoiseFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
}

/**
 * Extract visible heading text from HTML (best-effort, no DOM parser dependency).
 */
export function extractHeadingsFromHtml(html: string): string[] {
  const cleaned = stripNoiseFromHtml(html);
  const re = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(cleaned)) !== null) {
    const raw = m[1] ?? "";
    const text = raw
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 1 && text.length < 200) out.push(text);
  }
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const t of out) {
    const k = normalizeHeadingKey(t);
    if (seen.has(k)) continue;
    seen.add(k);
    deduped.push(t);
  }
  return deduped;
}

export function normalizeHeadingKey(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}
