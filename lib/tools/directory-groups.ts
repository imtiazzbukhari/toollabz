import type { ToolDefinition } from "./types";
import { POPULAR_TOOL_SLUGS } from "./popular-tools";

/** High-level groups for the /tools directory and category landings */
export type DirectoryGroupId =
  | "finance"
  | "real-estate"
  | "business-saas"
  | "marketing"
  | "ai"
  | "developer"
  | "utility"
  | "pdf";

const AI_SLUG = (slug: string) => slug.startsWith("ai-") || slug.endsWith("-ai");

/** True when the tool slug is treated as an AI assistant / generator for directory grouping. */
export function isAiToolSlug(slug: string): boolean {
  return AI_SLUG(slug);
}

/**
 * Maps every tool to exactly one directory group (SEO + navigation).
 * AI tools are detected by slug so they surface under AI even if `category` is `generators`.
 */
export function getDirectoryGroup(tool: Pick<ToolDefinition, "slug" | "category">): DirectoryGroupId {
  if (AI_SLUG(tool.slug)) return "ai";

  switch (tool.category) {
    case "finance":
      return "finance";
    case "real-estate":
      return "real-estate";
    case "pdf":
      return "pdf";
    case "developer":
      return "developer";
    case "utility":
    case "converters":
    case "legal":
      return "utility";
    case "marketing":
      return "marketing";
    case "business":
      return "business-saas";
    case "creator":
      return "marketing";
    case "generators":
      if (tool.slug === "business-name-generator" || tool.slug === "startup-name-generator") {
        return "business-saas";
      }
      return "utility";
    default:
      return "utility";
  }
}

export function toolsInDirectoryGroup(tools: readonly ToolDefinition[], group: DirectoryGroupId): ToolDefinition[] {
  return tools.filter((t) => getDirectoryGroup(t) === group);
}

/** Featured slugs for the top of /tools (order preserved) */
export const DIRECTORY_POPULAR_SLUGS: readonly string[] = [...POPULAR_TOOL_SLUGS];

/** Max cards per group on the all-tools page (full lists live on category pages) */
export const DIRECTORY_PREVIEW_LIMIT = 12;

export type DirectorySectionMeta = {
  id: DirectoryGroupId;
  /** User-visible section title */
  title: string;
  /** SEO H2 / visible heading */
  heading: string;
  /** Short intro under the heading */
  description: string;
  /** Category landing href */
  href: string;
};

export const DIRECTORY_SECTIONS: DirectorySectionMeta[] = [
  {
    id: "finance",
    title: "Finance tools",
    heading: "Finance tools",
    description: "Loans, paychecks, tax estimates, savings, and everyday money math - without a spreadsheet degree.",
    href: "/finance-tools",
  },
  {
    id: "real-estate",
    title: "Real estate tools",
    heading: "Real estate tools",
    description: "Rent vs buy, mortgage affordability, rental yield, and property ROI when you’re comparing addresses.",
    href: "/real-estate-tools",
  },
  {
    id: "business-saas",
    title: "Business & SaaS tools",
    heading: "Business & SaaS tools",
    description: "ROI, margins, CAC, LTV, and break-even - numbers you actually use in a pitch or budget review.",
    href: "/business-tools",
  },
  {
    id: "marketing",
    title: "Marketing tools",
    heading: "Marketing tools",
    description: "Campaign ROI, conversion rates, and creator metrics when you’re tuning funnels or content.",
    href: "/marketing-tools",
  },
  {
    id: "ai",
    title: "AI tools",
    heading: "AI tools",
    description: "Drafts and ideas for email, social, resumes, and product copy when you want a fast first pass.",
    href: "/ai-tools",
  },
  {
    id: "developer",
    title: "Developer tools",
    heading: "Developer tools",
    description: "JSON, encoding, regex, and API helpers for the ‘just fix this payload’ moments.",
    href: "/developer-tools",
  },
  {
    id: "utility",
    title: "Utility tools",
    heading: "Utility tools",
    description: "Converters, text helpers, generators, and odds-and-ends you open ten times a week.",
    href: "/utility-tools",
  },
  {
    id: "pdf",
    title: "PDF tools",
    heading: "PDF tools",
    description: "Merge, split, compress, and convert without installing another desktop app.",
    href: "/pdf-tools",
  },
];

/** Marketing hub landing for internal links (matches DIRECTORY_SECTIONS). */
export function getMarketingHubForTool(tool: ToolDefinition): { href: string; title: string } {
  const id = getDirectoryGroup(tool);
  const section = DIRECTORY_SECTIONS.find((s) => s.id === id);
  if (section) return { href: section.href, title: section.title };
  return { href: "/tools", title: "All tools" };
}
