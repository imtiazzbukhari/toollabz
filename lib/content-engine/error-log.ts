import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export const VALID_AUTOMATION_ERROR_CATEGORIES = [
  "typescript_error",
  "syntax_error",
  "runtime_error",
  "api_error",
] as const;

export type AutomationErrorCategory = (typeof VALID_AUTOMATION_ERROR_CATEGORIES)[number];

export type AutomationErrorLogRow = {
  id: string;
  ts: string;
  source: string;
  category: AutomationErrorCategory;
  message: string;
  module?: string;
  detail?: string;
};

const errorLogPath = path.join(process.cwd(), "lib", "content-engine", "error-log.json");

function readRows(): AutomationErrorLogRow[] {
  try {
    if (!existsSync(errorLogPath)) return [];
    const parsed = JSON.parse(readFileSync(errorLogPath, "utf8")) as unknown;
    return Array.isArray(parsed) ? (parsed as AutomationErrorLogRow[]) : [];
  } catch {
    return [];
  }
}

function writeRows(rows: readonly AutomationErrorLogRow[]): void {
  mkdirSync(path.dirname(errorLogPath), { recursive: true });
  writeFileSync(errorLogPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

export function classifyAutomationError(message: string, moduleHint?: string): AutomationErrorCategory {
  const m = `${moduleHint ?? ""} ${message}`.toLowerCase();
  if (/\bts\d{3,5}\b|typescript|type\s+'.*'\s+is\s+not\s+assignable/i.test(m)) return "typescript_error";
  if (/syntaxerror|unexpected token|unterminated|string literal|parsing error/i.test(m)) return "syntax_error";
  if (/fetch failed|api|http\s*(4\d{2}|5\d{2})|request failed|endpoint/i.test(m)) return "api_error";
  return "runtime_error";
}

export function appendAutomationErrorLog(input: {
  source: string;
  message: string;
  module?: string;
  detail?: string;
  category?: AutomationErrorCategory;
}): AutomationErrorLogRow {
  const row: AutomationErrorLogRow = {
    id: `err_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    ts: new Date().toISOString(),
    source: input.source,
    module: input.module,
    message: input.message.slice(0, 4000),
    detail: input.detail?.slice(0, 12000),
    category: input.category ?? classifyAutomationError(input.message, input.module),
  };
  const next = [row, ...readRows()].slice(0, 500);
  writeRows(next);
  return row;
}

export function readAutomationErrorLogs(limit = 100): AutomationErrorLogRow[] {
  return readRows().slice(0, limit);
}

