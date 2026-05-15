import { readFileSync } from "node:fs";
import path from "node:path";
import type { Pool, PoolConfig } from "pg";
import { Pool as PgPool } from "pg";

let pool: Pool | null = null;

export function isSeoPostgresConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getSeoPool(): Pool {
  if (!isSeoPostgresConfigured()) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!pool) {
    const cfg: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.SEO_PG_POOL_MAX ?? 4),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    };
    pool = new PgPool(cfg);
  }
  return pool;
}

/** Close pool (tests / scripts). */
export async function closeSeoPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

let schemaReady = false;

const MIGRATION_FILES = ["001_seo_metrics.sql", "002_seo_sync_state.sql"] as const;

/** Idempotent DDL for SEO tables (safe for serverless cold start). */
export async function ensureSeoMetricsSchema(): Promise<void> {
  if (schemaReady) return;
  const p = getSeoPool();
  for (const file of MIGRATION_FILES) {
    const sqlPath = path.join(process.cwd(), "db", "migrations", file);
    const sql = readFileSync(sqlPath, "utf8");
    await p.query(sql);
  }
  schemaReady = true;
}
