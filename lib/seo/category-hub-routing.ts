import type { DirectoryGroupId } from "@/lib/tools/directory-groups";
import type { ToolCategory, ToolDefinition } from "@/lib/tools/types";
import { isAiToolSlug } from "@/lib/tools/directory-groups";

/**
 * When a `/category/[slug]` page shares the same long-form hub as a directory landing,
 * prefer the directory URL as the canonical to avoid duplicate ranking dilution.
 */
export function preferredCanonicalForCategory(category: string): `/${string}` | null {
  switch (category) {
    case "finance":
      return "/finance-tools";
    case "real-estate":
      return "/real-estate-tools";
    case "business":
      return "/business-tools";
    case "marketing":
    case "creator":
      return "/marketing-tools";
    case "developer":
      return "/developer-tools";
    case "pdf":
      return "/pdf-tools";
    case "utility":
    case "converters":
    case "legal":
    case "calculators":
      return "/utility-tools";
    default:
      return null;
  }
}

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
