import type { ToolDefinition } from "@/lib/tools/types";

/** Full merged + deduped related pool (used for tests and layout). */
export function getRelatedToolsMergedDeduped(
  tool: ToolDefinition,
  catalog: readonly ToolDefinition[],
): ToolDefinition[] {
  const explicit: ToolDefinition[] = [];
  const sameCategory: ToolDefinition[] = [];
  const fallback: ToolDefinition[] = [];

  for (const t of catalog) {
    if (t.slug === tool.slug) continue;
    if (tool.related.includes(t.slug)) explicit.push(t);
    else if (t.category === tool.category) sameCategory.push(t);
    else fallback.push(t);
  }

  const merged = [...explicit, ...sameCategory, ...fallback];
  const seen = new Set<string>();
  const deduped: ToolDefinition[] = [];
  for (const item of merged) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    deduped.push(item);
  }
  return deduped;
}

/** Top related tools shown in ToolLayout (same rules, 4–6 items for internal linking + UX). */
export function getRelatedToolsForLayout(
  tool: ToolDefinition,
  catalog: readonly ToolDefinition[],
): ToolDefinition[] {
  const merged = [...getRelatedToolsMergedDeduped(tool, catalog)];
  const used = new Set(merged.map((t) => t.slug));
  used.add(tool.slug);
  if (merged.length < 4) {
    for (const t of catalog) {
      if (merged.length >= 6) break;
      if (used.has(t.slug)) continue;
      merged.push(t);
      used.add(t.slug);
    }
  }
  return merged.slice(0, 6);
}
