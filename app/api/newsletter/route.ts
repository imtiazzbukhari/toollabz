import type { NextRequest } from "next/server";
import { checkRateLimit, rateLimitKey } from "@/lib/api-rate-limit";
import { siteUrl } from "@/lib/seo";
import { sanitizeEmail } from "@/lib/sanitize";

export const runtime = "nodejs";

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    const site = new URL(siteUrl);
    return u.protocol === site.protocol && u.hostname.replace(/^www\./i, "") === site.hostname.replace(/^www\./i, "");
  } catch {
    return origin.includes("localhost") || origin.includes("127.0.0.1");
  }
}

async function mailchimpSubscribe(email: string): Promise<{ ok: boolean; detail?: string }> {
  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const listId = process.env.MAILCHIMP_LIST_ID?.trim();
  const dc = process.env.MAILCHIMP_SERVER_PREFIX?.trim();
  if (!apiKey || !listId || !dc) {
    return { ok: false, detail: "mailchimp_not_configured" };
  }
  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${encodeURIComponent(listId)}/members`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email, status: "subscribed" }),
  });
  if (res.status === 200 || res.status === 201) return { ok: true };
  const text = await res.text().catch(() => "");
  if (res.status === 400 && text.includes("Member Exists")) return { ok: true };
  return { ok: false, detail: text.slice(0, 200) };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "local";
  const rl = checkRateLimit(rateLimitKey("newsletter", ip), 5, 3_600_000);
  if (!rl.ok) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter), "Cache-Control": "no-store, no-cache" } },
    );
  }

  if (!isAllowedOrigin(req.headers.get("origin"))) {
    return Response.json(
      { error: "forbidden" },
      { status: 403, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "invalid_json" },
      { status: 400, headers: { "Cache-Control": "no-store, no-cache" } },
    );
  }
  const raw = body as { email?: unknown; _honey?: unknown; company_website?: unknown };
  const honey = typeof raw._honey === "string" ? raw._honey : "";
  const legacyHoney = typeof raw.company_website === "string" ? raw.company_website : "";
  if (honey.trim() || legacyHoney.trim()) {
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store, no-cache" } });
  }
  const email = sanitizeEmail(raw.email);
  if (!email) {
    return Response.json(
      { error: "invalid_email" },
      { status: 400, headers: { "Cache-Control": "no-store, no-cache" } },
    );
  }

  const mc = await mailchimpSubscribe(email);
  if (!mc.ok && mc.detail === "mailchimp_not_configured") {
    if (typeof console !== "undefined" && console.warn) {
      console.warn("[newsletter] MAILCHIMP_API_KEY / MAILCHIMP_LIST_ID / MAILCHIMP_SERVER_PREFIX not set; accepting signup without remote sync.");
    }
    return Response.json(
      { ok: true, mode: "pending_provider" },
      { headers: { "Cache-Control": "no-store, no-cache" } },
    );
  }
  if (!mc.ok) {
    return Response.json(
      { error: "subscribe_failed" },
      { status: 502, headers: { "Cache-Control": "no-store, no-cache" } },
    );
  }
  return Response.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
  );
}
