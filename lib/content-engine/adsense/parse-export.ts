import type { PageRevenueMetric } from "../performance/types";

function normPath(p: string): string {
  const t = p.trim();
  if (!t) return "";
  try {
    const u = new URL(t.startsWith("http") ? t : `https://toollabz.com${t.startsWith("/") ? t : `/${t}`}`);
    return u.pathname || "";
  } catch {
    return t.startsWith("/") ? t : `/${t}`;
  }
}

/**
 * Parse AdSense / revenue CSV (flexible headers). Expected columns include URL + RPM and/or earnings.
 * Example headers: Page URL, Page RPM, Estimated earnings, Impressions
 */
export function parseAdSensePageRevenueCsv(csvText: string): PageRevenueMetric[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const header = lines[0]!.split(",").map((h) => h.trim().toLowerCase());
  const idx = (name: RegExp) => header.findIndex((h) => name.test(h));

  const urlI = idx(/url|page path|page$/i);
  const rpmI = idx(/rpm|page rpm|ecpm/i);
  const earnI = idx(/earning|revenue|estimated/i);
  const impI = idx(/monetized|ad impression|impression/i);

  if (urlI < 0) return [];

  const out: PageRevenueMetric[] = [];
  for (let r = 1; r < lines.length; r++) {
    const cols = splitCsvLine(lines[r]!);
    const pathRaw = cols[urlI]?.trim() ?? "";
    const path = normPath(pathRaw);
    if (!path.startsWith("/")) continue;

    const rpmRaw = rpmI >= 0 ? cols[rpmI] : "";
    const earnRaw = earnI >= 0 ? cols[earnI] : "";
    const impRaw = impI >= 0 ? cols[impI] : "";

    const rpm = parseMoney(rpmRaw);
    const earnings = earnRaw ? parseMoney(earnRaw) : undefined;
    const monetizedImpressions = impRaw ? parseIntDigits(impRaw) : undefined;

    if (rpm == null && earnings == null) continue;
    out.push({
      path,
      rpm: rpm ?? 0,
      earnings: earnings ?? undefined,
      monetizedImpressions: monetizedImpressions ?? undefined,
    });
  }
  return dedupeByPath(out);
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      q = !q;
      continue;
    }
    if (ch === "," && !q) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function parseMoney(s: string): number | null {
  const t = s.replace(/[$,]/g, "").trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function parseIntDigits(s: string): number | undefined {
  const t = s.replace(/[,]/g, "").replace(/\..*$/, "").trim();
  const n = Number(t);
  return Number.isFinite(n) ? Math.floor(n) : undefined;
}

function dedupeByPath(rows: PageRevenueMetric[]): PageRevenueMetric[] {
  const m = new Map<string, PageRevenueMetric>();
  for (const row of rows) m.set(row.path, row);
  return [...m.values()];
}
