import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type SystemStatus = {
  name: string;
  status: "running" | "failed" | "idle";
  lastRun: string;
  errors: string[];
};

type SystemStatusStore = {
  systems: SystemStatus[];
};

const storePath = path.join(process.cwd(), "lib", "content-engine", "system-status.json");

function readStore(): SystemStatusStore {
  try {
    if (!existsSync(storePath)) return { systems: [] };
    const parsed = JSON.parse(readFileSync(storePath, "utf8")) as SystemStatusStore;
    return { systems: Array.isArray(parsed.systems) ? parsed.systems : [] };
  } catch {
    return { systems: [] };
  }
}

function writeStore(store: SystemStatusStore): void {
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export function getSystemStatuses(): SystemStatus[] {
  return readStore().systems;
}

export function setSystemStatus(input: { name: string; status: "running" | "failed" | "idle"; error?: string }): void {
  const now = new Date().toISOString();
  const store = readStore();
  const idx = store.systems.findIndex((s) => s.name === input.name);
  const existing = idx >= 0 ? store.systems[idx] : null;
  const next: SystemStatus = {
    name: input.name,
    status: input.status,
    lastRun: now,
    errors:
      input.status === "failed"
        ? [input.error ?? "unknown_error", ...(existing?.errors ?? [])].slice(0, 10)
        : existing?.errors ?? [],
  };
  if (idx >= 0) store.systems[idx] = next;
  else store.systems.push(next);
  writeStore(store);
}
