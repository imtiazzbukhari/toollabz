import type { NextRequest } from "next/server";
import { appendConsoleLog, getConsoleLogs } from "@/lib/content-engine/console-admin-store";
import { isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  return Response.json({ ok: true, rows: getConsoleLogs() });
}

export async function POST(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const type = rec.type;
  const level = rec.level;
  const message = typeof rec.message === "string" ? rec.message.trim() : "";
  if (!message || (type !== "ai_action" && type !== "pr_created" && type !== "blog_generated" && type !== "task_failed" && type !== "system")) {
    return Response.json({ ok: false, error: "Invalid log payload." }, { status: 400 });
  }
  const logs = appendConsoleLog({
    type,
    level: level === "error" || level === "warn" ? level : "info",
    message,
    meta: typeof rec.meta === "object" && rec.meta ? (rec.meta as Record<string, unknown>) : undefined,
  });
  return Response.json({ ok: true, rows: logs });
}
