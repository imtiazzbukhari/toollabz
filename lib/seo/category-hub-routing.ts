import type { DirectoryGroupId } from "@/lib/tools/directory-groups";
import type { ToolCategory, ToolDefinition } from "@/lib/tools/types";
import { isAiToolSlug } from "@/lib/tools/directory-groups";

/** Maps a `/category/[slug]` listing to the same SEO long-form hub as directory landings. */
export function resolveDirectoryGroupForCategoryPage(
  category: string,
  filtered: readonly ToolDefinition[],
): DirectoryGroupId {
  const c = category as ToolCategory;
  switch (c) {
    case "finance":
      return "finance";
    case "real-estate":
      return "real-estate";
    case "business":
      return "business-saas";
    case "marketing":
      return "marketing";
    case "developer":
      return "developer";
    case "pdf":
      return "pdf";
    case "utility":
    case "converters":
    case "legal":
    case "calculators":
      return "utility";
    case "creator":
      return "marketing";
    case "generators":
    case "image":
      return filtered.some((t) => isAiToolSlug(t.slug)) ? "ai" : "utility";
    default:
      return "utility";
  }
}
