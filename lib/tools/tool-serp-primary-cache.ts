import type { ToolDefinition } from "./types";
import { tools } from "./data";
import { CTR_TOOL_TITLES } from "./tool-ctr-titles";

/** Short CTR boosters after tool name (keeps full titles under SERP limits). */
const SERP_BOOSTERS = [
  "Free 2026",
  "Online Free",
  "Instant Free",
  "Free Tool",
  "Online 2026",
  "Free Online",
  "2026 Online",
  "Instant Online",
] as const;

function hashSlug(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

/**
 * Default primary SERP line (before ` | Toollabz` suffix). Always includes `tool.name` at the start
 * so aggressive length clamps never strip the official product name (integrity tests).
 */
function basePrimaryLine(tool: ToolDefinition): string {
  const ctr = CTR_TOOL_TITLES[tool.slug];
  if (ctr?.trim()) return ctr.trim();

  const name = tool.name.trim();
  const booster = SERP_BOOSTERS[hashSlug(tool.slug) % SERP_BOOSTERS.length];
  return `${name} - ${booster}`;
}

function disambiguatedLine(tool: ToolDefinition, base: string): string {
  const cat = tool.category.split("-").join(" ");
  const tagged = `${base} (${cat})`;
  return tagged.length <= 118 ? tagged : `${base} (${tool.slug.slice(0, 10)})`;
}

const SERP_PRIMARY_BY_SLUG: ReadonlyMap<string, string> = (() => {
  const primaries = tools.map((t) => ({ slug: t.slug, line: basePrimaryLine(t) }));
  const byLine = new Map<string, string[]>();
  for (const p of primaries) {
    const list = byLine.get(p.line) ?? [];
    list.push(p.slug);
    byLine.set(p.line, list);
  }
  const out = new Map<string, string>();
  for (const [line, slugs] of byLine) {
    if (slugs.length === 1) {
      out.set(slugs[0], line);
      continue;
    }
    for (const slug of slugs) {
      const tool = tools.find((t) => t.slug === slug)!;
      out.set(slug, disambiguatedLine(tool, line));
    }
  }
  return out;
})();

export function getSerpPrimaryLine(tool: ToolDefinition): string {
  return SERP_PRIMARY_BY_SLUG.get(tool.slug) ?? tool.name.trim();
}
