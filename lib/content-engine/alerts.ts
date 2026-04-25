export type AlertLevel = "info" | "warn" | "critical";

export type AlertPayload = {
  level: AlertLevel;
  source: "orchestrator";
  title: string;
  message: string;
  meta?: Record<string, unknown>;
};

/** Console sink today; swap implementation for Telegram/webhook later. */
export function sendAlert(payload: AlertPayload): void {
  const line = `[orchestrator-alert][${payload.level}] ${payload.title}: ${payload.message}`;
  if (payload.level === "critical") {
    console.error(line, payload.meta ?? "");
  } else if (payload.level === "warn") {
    console.warn(line, payload.meta ?? "");
  } else {
    console.info(line, payload.meta ?? "");
  }
}

/** Future: registerWebhook(url), registerTelegram(botToken, chatId), etc. */
export type AlertSink = (payload: AlertPayload) => void;

const extraSinks: AlertSink[] = [];

export function registerAlertSink(sink: AlertSink): void {
  extraSinks.push(sink);
}

export function broadcastAlert(payload: AlertPayload): void {
  sendAlert(payload);
  for (const sink of extraSinks) {
    try {
      sink(payload);
    } catch {
      /* never throw from alert path */
    }
  }
}
