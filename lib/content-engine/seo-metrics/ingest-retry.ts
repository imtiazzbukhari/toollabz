/**
 * Bounded retries for Google HTTP APIs (quota / transient errors).
 */

export type IngestStructuredLogEvent = {
  event: "ingest_retry" | "ingest_error" | "ingest_day_failed" | "ingest_quota" | "ingest_ok";
  source?: string;
  label?: string;
  attempt?: number;
  backoffMs?: number;
  day?: string;
  message?: string;
};

/** stdout JSON lines - pick up in your log drain without adding vendors. */
export function ingestStructuredLog(entry: IngestStructuredLogEvent): void {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry });
  process.stdout.write(`${line}\n`);
}

function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/** HTTP status from thrown messages like `GSC searchAnalytics 429:` */
function httpStatusFromMessage(msg: string): number | null {
  const m = /\b(\d{3})\b/.exec(msg);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export function isRetryableIngestError(e: unknown): boolean {
  const msg = messageOf(e);
  const st = httpStatusFromMessage(msg);
  if (st === 429 || st === 408) {
    ingestStructuredLog({ event: "ingest_quota", message: msg.slice(0, 240) });
    return true;
  }
  if (st === 500 || st === 502 || st === 503 || st === 504) return true;
  if (/AbortSignal|timeout|ETIMEDOUT|ECONNRESET|fetch failed/i.test(msg)) return true;
  return false;
}

export async function withIngestRetries<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const max = Math.min(8, Math.max(1, Number(process.env.SEO_INGEST_MAX_RETRIES ?? 4)));
  let last: unknown;
  for (let attempt = 0; attempt < max; attempt++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      const msg = messageOf(e);
      if (!isRetryableIngestError(e) || attempt === max - 1) throw e;
      const backoff = Math.min(12_000, 400 * 2 ** attempt + Math.floor(Math.random() * 250));
      ingestStructuredLog({ event: "ingest_retry", label, attempt: attempt + 1, backoffMs: backoff, message: msg.slice(0, 200) });
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  throw last;
}
