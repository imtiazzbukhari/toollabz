export type ToolExpansionPack = {
  slug: string;
  variations: string[];
  supportingBlogs: string[];
};

/**
 * Auto-suggest expansion pack for high-ROI tools (suggestions only; no auto-publish).
 */
export function buildToolExpansionPack(slug: string): ToolExpansionPack {
  const label = slug.replace(/-/g, " ");
  return {
    slug,
    variations: [
      `${slug}-advanced`,
      `${slug}-comparison`,
      `${slug}-quick`,
    ],
    supportingBlogs: [
      `Deep guide: ${label} scenarios that drive calculator usage`,
      `Comparison: ${label} vs common alternatives (honest tradeoffs)`,
    ],
  };
}
