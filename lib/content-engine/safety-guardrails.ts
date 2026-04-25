import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { appendAutomationErrorLog, classifyAutomationError } from "./error-log";

export type BuildValidationStatus = "success" | "failed";

export type SafetyStatus = {
  updatedAt: string;
  buildStatus: BuildValidationStatus;
  typecheckStatus: BuildValidationStatus;
  lastError: string | null;
  failingModules: string[];
  safeModeEnabled: boolean;
};

const safetyPath = path.join(process.cwd(), "lib", "content-engine", "safety-status.json");

function parseFailingModules(output: string): string[] {
  const lines = output.split("\n").slice(0, 250);
  const modules: string[] = [];
  for (const line of lines) {
    const m = line.match(/([A-Za-z0-9_\-./]+\.ts[x]?):\d+:\d+/) ?? line.match(/([A-Za-z0-9_\-./]+\.ts[x]?)[(]\d+,\d+[)]/);
    if (m?.[1] && !modules.includes(m[1])) modules.push(m[1]);
    if (modules.length >= 20) break;
  }
  return modules;
}

function defaultSafetyStatus(): SafetyStatus {
  return {
    updatedAt: new Date(0).toISOString(),
    buildStatus: "failed",
    typecheckStatus: "failed",
    lastError: null,
    failingModules: [],
    safeModeEnabled: String(process.env.SYSTEM_SAFE_MODE ?? "").toLowerCase() === "true",
  };
}

export function readSafetyStatus(): SafetyStatus {
  try {
    if (!existsSync(safetyPath)) return defaultSafetyStatus();
    const parsed = JSON.parse(readFileSync(safetyPath, "utf8")) as Partial<SafetyStatus>;
    const safeModeEnabled = String(process.env.SYSTEM_SAFE_MODE ?? "").toLowerCase() === "true";
    return {
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString(),
      buildStatus: parsed.buildStatus === "success" ? "success" : "failed",
      typecheckStatus: parsed.typecheckStatus === "success" ? "success" : "failed",
      lastError: typeof parsed.lastError === "string" ? parsed.lastError : null,
      failingModules: Array.isArray(parsed.failingModules) ? parsed.failingModules.filter((x): x is string => typeof x === "string") : [],
      safeModeEnabled,
    };
  } catch {
    return defaultSafetyStatus();
  }
}

export function writeSafetyStatus(patch: Partial<SafetyStatus>): SafetyStatus {
  const current = readSafetyStatus();
  const next: SafetyStatus = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
    safeModeEnabled: String(process.env.SYSTEM_SAFE_MODE ?? "").toLowerCase() === "true",
  };
  mkdirSync(path.dirname(safetyPath), { recursive: true });
  writeFileSync(safetyPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return next;
}

function runCommand(command: string, args: string[]): { ok: true; output: string } | { ok: false; output: string; errorMessage: string } {
  try {
    const output = execFileSync(command, args, {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });
    return { ok: true, output };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    let raw = "";
    let out = "";
    if (typeof error === "object" && error !== null) {
      const stderrVal = Reflect.get(error, "stderr");
      const stdoutVal = Reflect.get(error, "stdout");
      if (stderrVal != null) raw = String(stderrVal);
      if (stdoutVal != null) out = String(stdoutVal);
    }
    return { ok: false, output: `${out}\n${raw}`.trim(), errorMessage: msg };
  }
}

export function runMandatoryValidationWithRetry(context: string): {
  ok: boolean;
  buildStatus: BuildValidationStatus;
  typecheckStatus: BuildValidationStatus;
  lastError: string | null;
  failingModules: string[];
} {
  const attempts = 2;
  let lastError: string | null = null;
  let failingModules: string[] = [];

  for (let i = 0; i < attempts; i++) {
    const tsc = runCommand("npx", ["tsc", "--noEmit"]);
    if (!tsc.ok) {
      const category = classifyAutomationError(tsc.output || tsc.errorMessage, "tsc");
      failingModules = parseFailingModules(tsc.output);
      lastError = `[${context}] typecheck failed (attempt ${i + 1}/${attempts}): ${tsc.errorMessage}`;
      appendAutomationErrorLog({
        source: context,
        module: "tsc",
        category,
        message: lastError,
        detail: tsc.output,
      });
      continue;
    }

    const build = runCommand("npm", ["run", "build"]);
    if (!build.ok) {
      const category = classifyAutomationError(build.output || build.errorMessage, "build");
      failingModules = parseFailingModules(build.output);
      lastError = `[${context}] build failed (attempt ${i + 1}/${attempts}): ${build.errorMessage}`;
      appendAutomationErrorLog({
        source: context,
        module: "build",
        category,
        message: lastError,
        detail: build.output,
      });
      continue;
    }

    writeSafetyStatus({
      buildStatus: "success",
      typecheckStatus: "success",
      lastError: null,
      failingModules: [],
    });
    return {
      ok: true,
      buildStatus: "success",
      typecheckStatus: "success",
      lastError: null,
      failingModules: [],
    };
  }

  writeSafetyStatus({
    buildStatus: "failed",
    typecheckStatus: lastError?.includes("typecheck failed") ? "failed" : readSafetyStatus().typecheckStatus,
    lastError,
    failingModules,
  });
  return {
    ok: false,
    buildStatus: "failed",
    typecheckStatus: lastError?.includes("typecheck failed") ? "failed" : readSafetyStatus().typecheckStatus,
    lastError,
    failingModules,
  };
}

