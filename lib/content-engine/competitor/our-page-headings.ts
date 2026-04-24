import { blogPostBySlug } from "@/lib/blog/registry";
import { toolMap } from "@/lib/tools/data";

/**
 * Structural headings we expect on templates (proxy for on-page H2s) — not a live DOM crawl.
 */
export function getOurTemplateHeadingsForPath(path: string): string[] {
  const blog = path.replace(/\/+$/, "").match(/^\/blog\/([^/?#]+)$/i);
  if (blog?.[1]) {
    const post = blogPostBySlug(blog[1]);
    if (!post) return [];
    return [post.title, "Related tools", "FAQ"];
  }
  const tool = path.replace(/\/+$/, "").match(/^\/tools\/([^/?#]+)$/i);
  if (tool?.[1]) {
    const t = toolMap.get(tool[1]);
    if (!t) return [];
    return [t.name, "What this tool does", "Example usage", "FAQs", "Related tools"];
  }
  return [];
}
