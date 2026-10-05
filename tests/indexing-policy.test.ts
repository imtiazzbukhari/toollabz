import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { toolMap, tools } from "../lib/tools/data";
import { blogPosts } from "../lib/blog/registry";
import {
  BLOG_REDIRECTS,
  CONSOLIDATED_TOOLS,
  YMYL_NOINDEX_TOOLS,
  isToolIndexable,
} from "../lib/seo/indexing-policy";
import { buildRedirectRules } from "../lib/seo/redirect-rules";
import { toolMetadata } from "../lib/seo";

const root = path.resolve(__dirname, "..");

describe("indexing policy", () => {
  it("consolidation keepers are live, indexable, and not themselves consolidated", () => {
    for (const [from, to] of Object.entries(CONSOLIDATED_TOOLS)) {
      expect(toolMap.has(from), `${from} should no longer be served`).toBe(false);
      expect(toolMap.has(to), `${to} keeper must exist`).toBe(true);
      expect(to in CONSOLIDATED_TOOLS, `${to} must not chain`).toBe(false);
      expect(isToolIndexable(to)).toBe(true);
    }
  });

  it("YMYL noindex tools are served but unlisted and emit robots noindex", () => {
    for (const slug of YMYL_NOINDEX_TOOLS) {
      const tool = toolMap.get(slug);
      if (!tool) continue;
      expect(tools.some((t) => t.slug === slug)).toBe(false);
      expect(toolMetadata(tool).robots).toEqual({ index: false, follow: true });
    }
  });

  it("indexable tools never emit robots noindex", () => {
    for (const tool of tools) expect((toolMetadata(tool) as { robots?: unknown }).robots).toBeUndefined();
  });

  it("blog redirects target a live tool or a live blog post (no chains)", () => {
    const blog = new Set(blogPosts.map((p) => p.slug));
    for (const [slug, dest] of Object.entries(BLOG_REDIRECTS)) {
      expect(blog.has(slug), `${slug} must be removed from the registry`).toBe(false);
      if (dest.startsWith("/tools/")) expect(toolMap.has(dest.slice(7)), `${slug} -> ${dest}`).toBe(true);
      else expect(blog.has(dest.slice(6)), `${slug} -> ${dest}`).toBe(true);
    }
  });

  it("every redirect rule is permanent and points at a non-redirected path", () => {
    const rules = buildRedirectRules();
    expect(rules.length).toBeGreaterThan(30);
    for (const rule of rules) {
      expect(rule.permanent).toBe(true);
      if (rule.destination.startsWith("/tools/") && !rule.destination.includes(":")) {
        const slug = rule.destination.slice(7);
        expect(slug in CONSOLIDATED_TOOLS, `${rule.source} -> ${rule.destination}`).toBe(false);
        expect(toolMap.has(slug), `${rule.source} -> ${rule.destination}`).toBe(true);
      }
    }
  });

  it("source code only links to live tool and blog URLs", () => {
    const files = execSync(
      "git ls-files 'app/**/*.ts' 'app/**/*.tsx' 'components/**/*.tsx' 'lib/**/*.ts' 'lib/**/*.tsx'",
      { cwd: root, encoding: "utf8" },
    )
      .split("\n")
      .filter(
        (f) =>
          f &&
          !f.startsWith("lib/seo/") &&
          !f.startsWith("lib/tools/data.ts") &&
          !f.startsWith("lib/content-engine/pipeline") &&
          !f.startsWith("app/api/"),
      );
    const blog = new Set(blogPosts.map((p) => p.slug));
    const problems: string[] = [];
    for (const file of files) {
      let text: string;
      try {
        text = readFileSync(path.join(root, file), "utf8");
      } catch {
        continue;
      }
      for (const m of text.matchAll(/["'`]\/tools\/([a-z0-9][a-z0-9-]+)(?=["'`?#/ ])/g)) {
        const slug = m[1]!;
        if (slug === "sitemap" || slug === "cm-to-feet") continue;
        if (!toolMap.has(slug)) problems.push(`${file}: /tools/${slug}`);
      }
      for (const m of text.matchAll(/["'`]\/blog\/([a-z0-9][a-z0-9-]+)(?=["'`?#/ ])/g)) {
        const slug = m[1]!;
        if (slug === "sitemap") continue;
        if (!blog.has(slug)) problems.push(`${file}: /blog/${slug}`);
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
});
