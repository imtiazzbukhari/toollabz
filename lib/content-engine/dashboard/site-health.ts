import type { GscPageMetric } from "../performance/types";
import { blogPosts } from "@/lib/blog/registry";
import { tools } from "@/lib/tools/data";

export type SiteHealthIssue = {
  kind: "orphan_tool" | "deep_serp" | "duplicate_title" | "thin_excerpt" | "note";
  path?: string;
  detail: string;
};

function linkedToolSlugsFromBlogs(): Set<string> {
  const s = new Set<string>();
  for (const p of blogPosts) {
    for (const slug of p.relatedToolSlugs ?? []) s.add(slug.toLowerCase());
  }
  return s;
}

export function detectSiteHealthIssues(pages: readonly GscPageMetric[] | undefined, max = 25): SiteHealthIssue[] {
  const issues: SiteHealthIssue[] = [];
  const linked = linkedToolSlugsFromBlogs();

  let orphanCount = 0;
  for (const t of tools) {
    if (orphanCount >= 10) break;
    if (!linked.has(t.slug.toLowerCase())) {
      orphanCount += 1;
      issues.push({
        kind: "orphan_tool",
        path: `/tools/${t.slug}`,
        detail: `Tool not referenced as related content from any blog post (add to relatedToolSlugs or guides).`,
      });
    }
  }

  if (pages?.length) {
    for (const p of pages) {
      if (p.position != null && p.position > 12 && p.impressions >= 400) {
        issues.push({
          kind: "deep_serp",
          path: p.path,
          detail: `Avg position ${p.position.toFixed(1)} with ${p.impressions} impressions. Consider internal links + refresh.`,
        });
      }
    }
  }

  const titles = new Map<string, string[]>();
  for (const post of blogPosts) {
    const k = post.title.trim().toLowerCase();
    const arr = titles.get(k) ?? [];
    arr.push(`/blog/${post.slug}`);
    titles.set(k, arr);
  }
  for (const [, paths] of titles) {
    if (paths.length > 1) {
      issues.push({
        kind: "duplicate_title",
        detail: `Duplicate title across: ${paths.join(", ")}`,
      });
    }
  }

  let thin = 0;
  for (const post of blogPosts) {
    if (thin >= 5) break;
    if (post.excerpt.length < 70) {
      thin += 1;
      issues.push({
        kind: "thin_excerpt",
        path: `/blog/${post.slug}`,
        detail: "Short excerpt may read as thin in SERP; expand with one concrete outcome line.",
      });
    }
  }

  issues.push({
    kind: "note",
    detail:
      "Broken-link crawl and full duplicate-body detection are not run here (add CI link checker or Search Console URL inspection export).",
  });

  return issues.slice(0, max);
}
