#!/usr/bin/env node
/**
 * Opens a PR with lib/content-engine/action-queue/latest.md (CTR + behavior checklists).
 * Does not change live metadata or articles. Requires GITHUB_TOKEN, GITHUB_REPOSITORY, SITE_URL, CONTENT_ENGINE_SECRET.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pipelineLog } from "./lib/log.mjs";

const root = process.cwd();

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { Accept: "application/json", ...options.headers },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _raw: text };
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}: ${text.slice(0, 500)}`);
  return json;
}

function parseRepo() {
  const r = process.env.GITHUB_REPOSITORY || "";
  const [owner, repo] = r.split("/");
  if (!owner || !repo) throw new Error("GITHUB_REPOSITORY is required (format: owner/repo)");
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
  if (!res.ok) throw new Error(`GitHub PR create failed ${res.status}: ${text.slice(0, 800)}`);
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

  const cron = await fetchJson(`${siteUrl}/api/content-engine/cron-daily`, { headers: apiHeaders });
  const md = typeof cron?.stats?.growthActionQueueMarkdown === "string" ? cron.stats.growthActionQueueMarkdown : "";
  if (!md.trim()) {
    pipelineLog({ step: "abort", reason: "empty_growth_markdown" });
    process.exit(0);
  }

  const rel = path.join("lib", "content-engine", "action-queue", "latest.md");
  const abs = path.join(root, rel);
  mkdirSync(path.dirname(abs), { recursive: true });

  if (dryRun) {
    pipelineLog({ step: "dry_run_ok", bytes: md.length });
    process.exit(0);
  }

  const branch = `content-engine/growth-queue-${Date.now().toString(36)}`;
  const authRemote = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;

  runGit(["fetch", "origin", baseBranch]);
  runGit(["checkout", baseBranch]);
  runGit(["pull", "--ff-only", "origin", baseBranch]);
  runGit(["checkout", "-b", branch]);

  writeFileSync(abs, md, "utf8");
  pipelineLog({ step: "wrote_markdown", path: rel });

  runGit(["add", rel]);
  runGit(["commit", "-m", "content-engine: refresh growth action queue (CTR + behavior)\n\nAutomated suggestions only - review before any CMS/SERP edits."]);
  runGit(["remote", "set-url", "origin", authRemote]);
  runGit(["push", "-u", "origin", branch]);

  const pr = await createPullRequest(owner, repo, token, {
    title: "SEO growth queue: CTR experiments + behavior checklists",
    head: branch,
    base: baseBranch,
    body: [
      "## Automated growth action queue",
      "",
      `This PR updates \`${rel}\` with **suggested** SERP variants and behavior-driven content tasks.`,
      "",
      "- [ ] CTR titles/metas: validate tone vs brand; apply manually in CMS if approved",
      "- [ ] Behavior tasks: map each path to the correct template (blog vs tool layout)",
      "",
      "_No live routes or metadata were changed automatically._",
    ].join("\n"),
  });

  pipelineLog({ step: "pr_created", pr: pr.number, url: pr.html_url });
}

main().catch((e) => {
  pipelineLog({ step: "fatal", error: e instanceof Error ? e.message : String(e) });
  process.exit(1);
});
