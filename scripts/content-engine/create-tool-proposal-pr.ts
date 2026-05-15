#!/usr/bin/env npx tsx
/**
 * Opens a PR with a tool implementation proposal (spec + checklist only).
 * Does NOT modify lib/tools/data.ts or app routes - human moves code after review.
 *
 * Local validation (no GitHub): CONTENT_ENGINE_DRY_RUN=1 TOOL_SLUG=my-tool TOOL_NAME="My Tool" npm run content-engine:tool-proposal-pr
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pipelineLog } from "./lib/log.mjs";
import { enrichToolProposalSpecWithGroq, type ToolProposalSpec } from "../../lib/content-engine/llm-groq";
import { setSystemStatus } from "../../lib/content-engine/system-status";

const root = process.cwd();
const DEFAULT_TOOL_NAME = "auto-generated-tool";

type ResolveSource = "env" | "derived" | "fallback";

type ResolvedToolIdentity = {
  toolName: string;
  toolSlug: string;
  source: ResolveSource;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function readLatestToolNameFromGeneratedStore(): string | undefined {
  const generatedPath = path.join(root, "lib", "content-engine", "generated", "keywords.json");
  if (!existsSync(generatedPath)) return undefined;
  try {
    const parsed = JSON.parse(readFileSync(generatedPath, "utf8")) as {
      items?: Array<{ tool?: { spec?: { name?: unknown } } }>;
    };
    const first = parsed.items?.[0]?.tool?.spec?.name;
    return typeof first === "string" && first.trim() ? first.trim() : undefined;
  } catch {
    return undefined;
  }
}

function readLatestToolNameFromToolProposals(): string | undefined {
  const base = path.join(root, "lib", "content-engine", "tool-proposals");
  if (!existsSync(base)) return undefined;
  const dirs = readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const specPath = path.join(base, d.name, "SPEC.json");
      const mtimeMs = existsSync(specPath) ? statSync(specPath).mtimeMs : 0;
      return { specPath, mtimeMs };
    })
    .filter((d) => d.mtimeMs > 0)
    .sort((a, b) => b.mtimeMs - a.mtimeMs);
  const latest = dirs[0];
  if (!latest) return undefined;
  try {
    const parsed = JSON.parse(readFileSync(latest.specPath, "utf8")) as { name?: unknown };
    return typeof parsed.name === "string" && parsed.name.trim() ? parsed.name.trim() : undefined;
  } catch {
    return undefined;
  }
}

function readLatestToolName(): string | undefined {
  return readLatestToolNameFromGeneratedStore() ?? readLatestToolNameFromToolProposals();
}

function resolveToolIdentity(args: string[]): ResolvedToolIdentity {
  const envName = process.env.TOOL_NAME?.trim();
  const envSlug = process.env.TOOL_SLUG?.trim();
  const argSlug = args[2]?.trim();
  const argName = args[3]?.trim();
  const keyword = process.env.TOOL_KEYWORD?.trim() || args[5]?.trim() || "";

  const derivedName = readLatestToolName();
  const toolName =
    envName ||
    argName ||
    derivedName ||
    (keyword
      ? `${keyword
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 10)
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ")} Tool`
      : DEFAULT_TOOL_NAME);

  const rawSlug = envSlug || argSlug || slugify(toolName) || DEFAULT_TOOL_NAME;
  const toolSlug = slugify(rawSlug) || DEFAULT_TOOL_NAME;
  const source: ResolveSource = envName || envSlug ? "env" : derivedName || keyword ? "derived" : "fallback";
  return { toolName, toolSlug, source };
}

function parseRepo() {
  const r = process.env.GITHUB_REPOSITORY || "";
  const [owner, repo] = r.split("/");
  if (!owner || !repo) {
    throw new Error("GITHUB_REPOSITORY is required (format: owner/repo)");
  }
  return { owner, repo };
}

async function createPullRequest(owner: string, repo: string, token: string, payload: { title: string; head: string; base: string; body: string }) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`GitHub PR create failed ${res.status}: ${text.slice(0, 800)}`);
  }
  return JSON.parse(text) as { number: number; html_url: string };
}

function runGit(args: string[], env = process.env) {
  execFileSync("git", args, { cwd: root, stdio: "inherit", env: { ...env, GIT_TERMINAL_PROMPT: "0" } });
}

async function main() {
  setSystemStatus({ name: "tool-pr-creator", status: "running" });
  const token = process.env.GITHUB_TOKEN?.trim();
  const baseBranch = process.env.CONTENT_ENGINE_BASE_BRANCH || "main";
  const dryRun = process.env.CONTENT_ENGINE_DRY_RUN === "1";

  const { toolName: name, toolSlug: slug, source } = resolveToolIdentity(process.argv);
  pipelineLog({ step: "tool_identity_resolved", toolName: name, toolSlug: slug, source });
  const category = process.env.TOOL_CATEGORY || process.argv[4] || "finance";

  if (!dryRun && !token) {
    setSystemStatus({ name: "tool-pr-creator", status: "failed", error: "missing_GITHUB_TOKEN" });
    pipelineLog({ step: "abort", reason: "missing_GITHUB_TOKEN" });
    process.exit(1);
  }

  if (!dryRun && !process.env.GITHUB_REPOSITORY?.trim()) {
    setSystemStatus({ name: "tool-pr-creator", status: "failed", error: "missing_GITHUB_REPOSITORY" });
    pipelineLog({ step: "abort", reason: "missing_GITHUB_REPOSITORY" });
    process.exit(1);
  }

  const dir = path.join(root, "lib", "content-engine", "tool-proposals", slug);
  if (existsSync(dir)) {
    setSystemStatus({ name: "tool-pr-creator", status: "idle" });
    pipelineLog({ step: "skip_pr", reason: "proposal_dir_exists", slug });
    process.exit(0);
  }

  let spec: ToolProposalSpec = {
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

  spec = await enrichToolProposalSpecWithGroq(spec);

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
    setSystemStatus({ name: "tool-pr-creator", status: "idle" });
    pipelineLog({ step: "dry_run_ok", slug, branch });
    process.exit(0);
  }

  const { owner, repo } = parseRepo();
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

  const pr = await createPullRequest(owner, repo, token!, {
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
  setSystemStatus({ name: "tool-pr-creator", status: "idle" });
}

main().catch((e) => {
  setSystemStatus({ name: "tool-pr-creator", status: "failed", error: e instanceof Error ? e.message : String(e) });
  pipelineLog({ step: "fatal", error: e instanceof Error ? e.message : String(e) });
  process.exit(1);
});
