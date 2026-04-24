import type { ContentEngineEvent } from "./types";

/**
 * Structured logs for observability (ship to your log drain in production).
 * Never logs secrets or full article bodies by default.
 */
export function contentEngineLog(event: ContentEngineEvent): void {
  const line = JSON.stringify({ ts: new Date().toISOString(), service: "content-engine", ...event });
  if (event.type.endsWith("fail")) console.error(line);
  else console.info(line);
}
