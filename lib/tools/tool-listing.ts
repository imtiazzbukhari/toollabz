import type { ToolDefinition } from "./types";

/** Minimal tool fields for directory / cards - smaller RSC + client payload than full `ToolDefinition`. */
export type ToolListingPreview = Pick<ToolDefinition, "slug" | "name" | "shortDescription" | "category" | "keywords">;

export function toToolListingPreview(tool: ToolDefinition): ToolListingPreview {
  return {
    slug: tool.slug,
    name: tool.name,
    shortDescription: tool.shortDescription,
    category: tool.category,
    keywords: tool.keywords,
  };
}
