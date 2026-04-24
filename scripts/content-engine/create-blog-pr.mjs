#!/usr/bin/env node
/**
 * Safe publish pipeline: discover → generate (production API) → quality gate → commit on branch → GitHub PR.
 * Never pushes to main. Requires GITHUB_TOKEN, GITHUB_REPOSITORY, SITE_URL, CONTENT_ENGINE_SECRET.
 */
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { buildArticleTsx } from "./lib/article-codegen.mjs";
import { pipelineLog } from "./lib/log.mjs";
import { postHumanReviewAssistComment } from "./lib/pr-comment.mjs";
import { sanitizeSlug } from "./lib/slug.mjs";

const root = process.cwd();

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _raw: text };
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${url}: ${text.slice(0, 500)}`);
  }
  return json;
}

function parseRepo() {
  const r = process.env.GITHUB_REPOSITORY || "";
  const [owner, repo] = r.split("/");
  if (!owner || !repo) {
    throw new Error("GITHUB_REPOSITORY is required (format: owner/repo)");
  }
  return { owner, repo };
}

async function createPullRequest(owner, repo, token, { title, head, base, body }) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, head, base, body }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`GitHub PR create failed ${res.status}: ${text.slice(0, 800)}`);
  }
  return JSON.parse(text);
}

function runGit(args, env = process.env) {
  execFileSync("git", args, { cwd: root, stdio: "inherit", env: { ...env, GIT_TERMINAL_PROMPT: "0" } });
}

async function main() {
  const siteUrl = (process.env.SITE_URL || process.env.CONTENT_ENGINE_SITE_URL || "").replace(/\/$/, "");
  const secret = process.env.CONTENT_ENGINE_SECRET || process.env.CRON_SECRET;
  const token = process.env.GITHUB_TOKEN;
  const baseBranch = process.env.CONTENT_ENGINE_BASE_BRANCH || "main";
  const dryRun = process.env.CONTENT_ENGINE_DRY_RUN === "1" || process.env.CONTENT_ENGINE_DRY_RUN === "true";

  if (!siteUrl || !secret) {
    pipelineLog({ step: "abort", reason: "missing_SITE_URL_or_CONTENT_ENGINE_SECRET" });
    process.exit(1);
  }
  if (!token) {
    pipelineLog({ step: "abort", reason: "missing_GITHUB_TOKEN" });
    process.exit(1);
  }

  const { owner, repo } = parseRepo();
  const apiHeaders = { "x-toollabz-secret": secret };

  pipelineLog({ step: "cron_fetch", siteUrl });
  const cron = await fetchJson(`${siteUrl}/api/content-engine/cron-daily`, { headers: apiHeaders });

  const prioritized = cron?.stats?.prioritized;
  if (!Array.isArray(prioritized) || prioritized.length === 0) {
    pipelineLog({ step: "abort", reason: "no_prioritized_opportunities" });
    process.exit(0);
  }

  const pick = prioritized[0];
  const topic = pick.suggestedBlogTitle || `Practical guide: ${pick.keyword}`;
  const primaryKeyword = pick.keyword;
  const variationSeed = `${primaryKeyword}|${pick.clusterId ?? "na"}|${new Date().toISOString().slice(0, 10)}`;

  pipelineLog({ step: "generate_blog", topic, primaryKeyword, variationSeed });
  const gen = await fetchJson(`${siteUrl}/api/generate-blog`, {
    method: "POST",
    headers: { ...apiHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ topic, primaryKeyword, mode: "safe", variationSeed }),
  });

  if (!gen?.ok || !gen?.result) {
    pipelineLog({ step: "abort", reason: "generate_blog_failed", gen });
    process.exit(1);
  }

  const { draft, quality, internalLinks } = gen.result;
  if (!quality?.passed) {
    pipelineLog({ step: "skip_pr", reason: "quality_not_passed", score: quality?.score, reasons: quality?.reasons });
    process.exit(0);
  }

  const slug = sanitizeSlug(draft.slugSuggestion || primaryKeyword);
  if (!slug || slug.length < 4) {
    pipelineLog({ step: "skip_pr", reason: "invalid_slug", slugSuggestion: draft.slugSuggestion });
    process.exit(0);
  }

  const articleRel = path.join("lib", "blog", "articles", `${slug}.tsx`);
  const articlePath = path.join(root, articleRel);
  if (existsSync(articlePath)) {
    pipelineLog({ step: "skip_pr", reason: "article_already_exists", slug });
    process.exit(0);
  }

  const pubDate = new Date().toISOString().slice(0, 10);
  const title = (pick.suggestedBlogTitle || draft.seoTitle.replace(/\s*\|.*$/, "").trim()).slice(0, 200);
  const excerpt = draft.metaDescription.length > 240 ? `${draft.metaDescription.slice(0, 237)}...` : draft.metaDescription;

  const tsx = buildArticleTsx({
    slug,
    title,
    seoTitle: draft.seoTitle,
    description: draft.metaDescription,
    excerpt,
    publishedAt: pubDate,
    bodyMarkdown: draft.bodyMarkdown,
    faqSchema: draft.faqSchema,
    relatedToolSlugs: Array.isArray(pick.linkToolSlugs) ? pick.linkToolSlugs : [],
    internalLinks: Array.isArray(internalLinks) ? internalLinks : [],
  });

  const branch = `content-engine/blog-${slug}-${Date.now().toString(36)}`;

  if (dryRun) {
    pipelineLog({ step: "dry_run_ok", slug, branch, qualityScore: quality.score });
    process.exit(0);
  }

  const authRemote = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;

  runGit(["fetch", "origin", baseBranch]);
  runGit(["checkout", baseBranch]);
  runGit(["pull", "--ff-only", "origin", baseBranch]);
  runGit(["checkout", "-b", branch]);

  writeFileSync(articlePath, tsx, "utf8");
  pipelineLog({ step: "wrote_article", path: articleRel });

  execFileSync("node", ["scripts/generate-blog-manifest.mjs"], { cwd: root, stdio: "inherit" });

  runGit(["add", articleRel, "lib/blog/articles.manifest.ts"]);
  runGit([
    "commit",
    "-m",
    `content-engine: add blog ${slug}\n\nQuality score: ${quality.score}. Keyword: ${primaryKeyword}.`,
  ]);
  runGit(["remote", "set-url", "origin", authRemote]);
  runGit(["push", "-u", "origin", branch]);

  const pr = await createPullRequest(owner, repo, token, {
    title: `Blog: ${title}`,
    head: branch,
    base: baseBranch,
    body: [
      "## Automated blog proposal",
      "",
      `- **Slug:** \`${slug}\``,
      `- **Quality score:** ${quality.score}`,
      `- **Primary keyword:** ${primaryKeyword}`,
      "",
      "### Review checklist",
      "",
      "- [ ] Claims are accurate and appropriately scoped",
      "- [ ] Related tools and internal links are sensible",
      "- [ ] Merge when ready; post-merge workflow can ping Google sitemap",
      "",
      `_Pipeline ref: ${branch}_`,
    ].join("\n"),
  });

  try {
    await postHumanReviewAssistComment(owner, repo, pr.number, token, {
      slug,
      qualityScore: quality.score,
      primaryKeyword,
    });
    pipelineLog({ step: "pr_review_comment_ok", pr: pr.number });
  } catch (e) {
    pipelineLog({ step: "pr_review_comment_fail", pr: pr.number, error: e instanceof Error ? e.message : String(e) });
  }

  pipelineLog({ step: "pr_created", pr: pr.number, url: pr.html_url, slug, qualityScore: quality.score });
}

main().catch((e) => {
  pipelineLog({ step: "fatal", error: e instanceof Error ? e.message : String(e) });
  process.exit(1);
});
