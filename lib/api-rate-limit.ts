type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Simple fixed-window rate limiter (in-memory). Best-effort on serverless multi-instance;
 * combine with CDN/WAF limits in production.
 */
export function checkRateLimit(key: string, max: number, windowMs: number): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (b.count >= max) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

export function rateLimitKey(prefix: string, id: string): string {
  return `${prefix}:${id}`;
}
