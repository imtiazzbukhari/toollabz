/**
 * Apply SEO Postgres DDL (idempotent). Requires DATABASE_URL.
 * Usage: DATABASE_URL=... npx tsx scripts/db-migrate-seo.ts
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const files = ["001_seo_metrics.sql", "002_seo_sync_state.sql"] as const;

const client = new pg.Client({ connectionString: url });
await client.connect();
for (const file of files) {
  const sql = readFileSync(path.join(process.cwd(), "db", "migrations", file), "utf8");
  await client.query(sql);
  console.log(`Applied db/migrations/${file}`);
}
await client.end();
