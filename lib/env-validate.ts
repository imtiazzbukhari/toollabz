/**
 * Optional startup validation for production clarity.
 * Call from `instrumentation.ts` on the Node runtime.
 */
export function validatePublicEnv(): void {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!site && process.env.NODE_ENV === "production") {
    console.warn("[env] NEXT_PUBLIC_SITE_URL is unset — canonical URLs may fall back to defaults.");
  }
  const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? process.env.NEXT_PUBLIC_GA_ID;
  if (!ga?.trim()) {
    console.info("[env] GA4 not configured (set NEXT_PUBLIC_GA_MEASUREMENT_ID or NEXT_PUBLIC_GA_ID).");
  }
  if (!process.env.MAILCHIMP_API_KEY?.trim()) {
    console.info("[env] Mailchimp not configured — newsletter accepts signups in pending_provider mode.");
  }
  if (!process.env.REDIS_URL?.trim()) {
    console.info("[env] REDIS_URL not set — using in-memory LRU for API caches.");
  }
}
