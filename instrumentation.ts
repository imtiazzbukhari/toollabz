export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validatePublicEnv } = await import("@/lib/env-validate");
    validatePublicEnv();
    const { initDb } = await import("@/lib/db/backlinks-db");
    try {
      initDb();
    } catch {
      /* optional: better-sqlite3 unavailable in some CI slices */
    }
  }
}
