#!/usr/bin/env node
/**
 * Opens a PR with a tool implementation proposal (spec + checklist only).
 * Does NOT modify lib/tools/data.ts or app routes — human moves code after review.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pipelineLog } from "./lib/log.mjs";
import { sanitizeSlug } from "./lib/slug.mjs";

const root = process.cwd();

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
  const token = process.env.GITHUB_TOKEN;
  const baseBranch = process.env.CONTENT_ENGINE_BASE_BRANCH || "main";
  const dryRun = process.env.CONTENT_ENGINE_DRY_RUN === "1";

  const rawSlug = process.env.TOOL_SLUG || process.argv[2];
  const name = process.env.TOOL_NAME || process.argv[3] || "";
  const category = process.env.TOOL_CATEGORY || process.argv[4] || "finance";

  if (!token) {
    pipelineLog({ step: "abort", reason: "missing_GITHUB_TOKEN" });
    process.exit(1);
  }
  if (!rawSlug || !name) {
    pipelineLog({ step: "abort", reason: "missing_TOOL_SLUG_or_TOOL_NAME" });
    process.exit(1);
  }

  const slug = sanitizeSlug(rawSlug);
  const { owner, repo } = parseRepo();
  const dir = path.join(root, "lib", "content-engine", "tool-proposals", slug);
  if (existsSync(dir)) {
    pipelineLog({ step: "skip_pr", reason: "proposal_dir_exists", slug });
    process.exit(0);
  }

  const spec = {
    slug,
    name,
    category,
    shortDescription: `Proposal: ${name}`,
    description:
      `Editorial proposal for "${name}". Replace this with a precise description, inputs, outputs, and edge cases before implementation.`,
    keywords: [slug.replace(/-/g, " ")],
    fields: [],
    computeKey: "REPLACE_WITH_ENGINE_KEY",
    validationNotes: ["Add validation rules", "Add pure compute function + vitest"],
  };

  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "SPEC.json"), `${JSON.stringify(spec, null, 2)}\n`, "utf8");

  const readme = [
    `# Tool proposal: ${name}`,
    "",
    "## Scope",
    "",
    "This PR adds **proposal artifacts only**. It does **not** register a live tool.",
    "",
    "## Next steps (human)",
    "",
    "1. Finalize `SPEC.json` (fields, computeKey, validation).",
    "2. Implement pure logic under `lib/tools/` and tests under `tests/`.",
    "3. Register the tool in `lib/tools/data.ts` and ensure `lib/tools/engine.ts` handles `computeKey`.",
    "4. Add or extend `app/tools/[slug]/page.tsx` wiring if needed.",
    "",
    "## Safety",
    "",
    "- Do not merge tool data until review + automated tests pass.",
    "",
  ].join("\n");
  writeFileSync(path.join(dir, "README.md"), readme, "utf8");

  const branch = `content-engine/tool-proposal-${slug}-${Date.now().toString(36)}`;

  if (dryRun) {
    pipelineLog({ step: "dry_run_ok", slug, branch });
    process.exit(0);
  }

  const authRemote = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;
  runGit(["fetch", "origin", baseBranch]);
  runGit(["checkout", baseBranch]);
  runGit(["pull", "--ff-only", "origin", baseBranch]);
  runGit(["checkout", "-b", branch]);

  const rel = path.join("lib", "content-engine", "tool-proposals", slug);
  runGit(["add", path.join(rel, "SPEC.json"), path.join(rel, "README.md")]);
  runGit(["commit", "-m", `content-engine: tool proposal ${slug}\n\nSpec + checklist only (no live tool).`]);
  runGit(["remote", "set-url", "origin", authRemote]);
  runGit(["push", "-u", "origin", branch]);

  const pr = await createPullRequest(owner, repo, token, {
    title: `Tool proposal: ${name} (${slug})`,
    head: branch,
    base: baseBranch,
    body: [
      "## Tool proposal (no auto-deploy)",
      "",
      `Slug: \`${slug}\` · Category: \`${category}\``,
      "",
      "Implements **Task 4**: PR contains spec + checklist only. Wire tool after review.",
    ].join("\n"),
  });

  pipelineLog({ step: "pr_created", pr: pr.number, url: pr.html_url, slug });
}

main().catch((e) => {
  pipelineLog({ step: "fatal", error: e instanceof Error ? e.message : String(e) });
  process.exit(1);
});
