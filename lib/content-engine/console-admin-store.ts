import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type ConsoleAdminConfig = {
  aiEnabled: boolean;
  highIntentMode: boolean;
  businessMode: boolean;
  /** Prioritize decision/calculator/high CPC; suppress low-value informational worklists in UI + heuristics. */
  revenueBoostMode: boolean;
  /** Analysis = read-only emphasis; Execution = action-first UI and batch tools. */
  dashboardMode: "analysis" | "execution";
  paused: boolean;
  overrideDecisions: boolean;
  activeCluster: string;
  activeClusters: string[];
  updatedAt: string;
};

export type PromptVersion = {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
};

export type ConsoleLogItem = {
  id: string;
  level: "info" | "error" | "warn";
  type: "ai_action" | "pr_created" | "blog_generated" | "task_failed" | "system";
  message: string;
  createdAt: string;
  meta?: Record<string, unknown>;
};

function baseDir(): string {
  return process.env.CONTENT_ENGINE_CONSOLE_STORE_DIR?.trim() || path.join(process.cwd(), "lib", "content-engine", "console-store");
}

function filePath(name: string): string {
  return path.join(baseDir(), name);
}

function readJson<T>(name: string, fallback: T): T {
  const p = filePath(name);
  try {
    if (!existsSync(p)) return fallback;
    return JSON.parse(readFileSync(p, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(name: string, value: unknown): void {
  const p = filePath(name);
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(value, null, 2), "utf8");
}

export function getConsoleAdminConfig(): ConsoleAdminConfig {
  const raw = readJson<Partial<ConsoleAdminConfig> & Record<string, unknown>>("config.json", {});
  const base: ConsoleAdminConfig = {
    aiEnabled: true,
    highIntentMode: false,
    businessMode: false,
    revenueBoostMode: false,
    dashboardMode: "analysis",
    paused: false,
    overrideDecisions: false,
    activeCluster: "finance",
    activeClusters: ["finance", "seo", "mortgage"],
    updatedAt: new Date().toISOString(),
  };
  return {
    ...base,
    ...raw,
    revenueBoostMode: raw.revenueBoostMode === true,
    dashboardMode: raw.dashboardMode === "execution" ? "execution" : "analysis",
    activeClusters: Array.isArray(raw.activeClusters) ? (raw.activeClusters as string[]) : base.activeClusters,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : base.updatedAt,
  };
}

export function updateConsoleAdminConfig(input: Partial<Omit<ConsoleAdminConfig, "updatedAt">>): ConsoleAdminConfig {
  const next: ConsoleAdminConfig = {
    ...getConsoleAdminConfig(),
    ...input,
    updatedAt: new Date().toISOString(),
  };
  writeJson("config.json", next);
  return next;
}

export function getPromptVersions(): PromptVersion[] {
  return readJson<PromptVersion[]>("prompts.json", []);
}

export function savePromptVersion(content: string, createdBy = "admin"): PromptVersion[] {
  const versions = getPromptVersions();
  const next: PromptVersion = {
    id: `p_${Date.now().toString(36)}`,
    content,
    createdAt: new Date().toISOString(),
    createdBy,
  };
  const merged = [next, ...versions].slice(0, 50);
  writeJson("prompts.json", merged);
  return merged;
}

export function getConsoleLogs(): ConsoleLogItem[] {
  return readJson<ConsoleLogItem[]>("logs.json", []);
}

export function appendConsoleLog(input: Omit<ConsoleLogItem, "id" | "createdAt"> & Partial<Pick<ConsoleLogItem, "meta">>): ConsoleLogItem[] {
  const logs = getConsoleLogs();
  const next: ConsoleLogItem = {
    id: `l_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    meta: input.meta,
    level: input.level,
    type: input.type,
    message: input.message,
  };
  const merged = [next, ...logs].slice(0, 200);
  writeJson("logs.json", merged);
  return merged;
}
