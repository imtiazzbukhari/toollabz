#!/usr/bin/env node
/**
 * PR with lib/content-engine/auto-fix-queue/*.md from CTR + behavior queues (preview API).
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

  if (!siteUrl || !secret || !token) {
    pipelineLog({ step: "abort", reason: "missing_env" });
    process.exit(1);
  }

  const apiHeaders = { "x-toollabz-secret": secret };
  const prev = await fetchJson(`${siteUrl}/api/content-engine/auto-fix-preview`, { headers: apiHeaders });
  const files = prev?.files;
  if (!Array.isArray(files) || files.length === 0) {
    pipelineLog({ step: "abort", reason: "no_auto_fix_files" });
    process.exit(0);
  }

  const dir = path.join(root, "lib", "content-engine", "auto-fix-queue");
  mkdirSync(dir, { recursive: true });

  if (dryRun) {
    pipelineLog({ step: "dry_run_ok", fileCount: files.length });
    process.exit(0);
  }

  const { owner, repo } = parseRepo();
  const branch = `content-engine/autofix-${Date.now().toString(36)}`;
  const authRemote = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;

  runGit(["fetch", "origin", baseBranch]);
  runGit(["checkout", baseBranch]);
  runGit(["pull", "--ff-only", "origin", baseBranch]);
  runGit(["checkout", "-b", branch]);

  const relPaths = [];
  for (const f of files) {
    if (!f?.filename || !f?.markdown) continue;
    const rel = path.join("lib", "content-engine", "auto-fix-queue", f.filename);
    const abs = path.join(root, rel);
    writeFileSync(abs, f.markdown, "utf8");
    relPaths.push(rel);
  }

  if (relPaths.length === 0) {
    pipelineLog({ step: "abort", reason: "no_valid_files" });
    process.exit(0);
  }

  runGit(["add", ...relPaths]);
  runGit(["commit", "-m", "content-engine: auto-fix drafts (CTR + behavior)\n\nEditorial suggestions only - no live metadata changes."]);
  runGit(["remote", "set-url", "origin", authRemote]);
  runGit(["push", "-u", "origin", branch]);

  const pr = await createPullRequest(owner, repo, token, {
    title: "Content auto-fix queue (CTR + behavior drafts)",
    head: branch,
    base: baseBranch,
    body: [
      "## Automated content improvement drafts",
      "",
      "Markdown checklists and SERP variants under `lib/content-engine/auto-fix-queue/`.",
      "",
      "- [ ] Review each path in CMS / code",
      "- [ ] Apply only after editorial approval",
      "",
      "_No automatic deploy._",
    ].join("\n"),
  });

  pipelineLog({ step: "pr_created", pr: pr.number, url: pr.html_url, files: relPaths.length });
}

main().catch((e) => {
  pipelineLog({ step: "fatal", error: e instanceof Error ? e.message : String(e) });
  process.exit(1);
});
