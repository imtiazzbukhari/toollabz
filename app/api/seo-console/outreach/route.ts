import type { NextRequest } from "next/server";
import { isSeoConsoleAuthenticated } from "@/lib/content-engine/seo-console-auth";
import { approveOutreachMessage, DAILY_CAP, loadOutreachQueue, markLinkAcquired, markReplied } from "@/lib/content-engine/outreach/queue-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!isSeoConsoleAuthenticated(req)) return unauthorized();
  const q = loadOutreachQueue();
  return Response.json({
    ok: true,
    dailyCap: DAILY_CAP,
    sentCount: q.sentCount,
    sentDay: q.sentDay,
    messages: q.messages.slice(-80).reverse(),
  });
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
  const action = typeof rec.action === "string" ? rec.action : "";
  const id = typeof rec.id === "string" ? rec.id : "";
  if (!id) return Response.json({ ok: false, error: "id required" }, { status: 400 });

  if (action === "approve") {
    const msg = approveOutreachMessage(id);
    if (!msg) return Response.json({ ok: false, error: "Not found or not pending." }, { status: 400 });
    return Response.json({ ok: true, message: msg });
  }
  if (action === "send") {
    // Delegate send to existing secured execution endpoint through internal fetch.
    const host = req.nextUrl.origin;
    const res = await fetch(`${host}/api/outreach/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-toollabz-secret": process.env.CONTENT_ENGINE_SECRET ?? process.env.CRON_SECRET ?? "" },
      body: JSON.stringify({ id, confirmApproved: true }),
    });
    const data = await res.json();
    if (!res.ok) return Response.json(data, { status: res.status });
    return Response.json(data);
  }
  if (action === "replied") {
    const note = typeof rec.note === "string" ? rec.note : "Replied from SEO console.";
    const ok = markReplied(id, note);
    if (!ok) return Response.json({ ok: false, error: "Message not found or not sent." }, { status: 400 });
    return Response.json({ ok: true });
  }
  if (action === "link_acquired") {
    const url = typeof rec.url === "string" ? rec.url.trim() : "";
    if (!url.startsWith("http")) return Response.json({ ok: false, error: "Valid http(s) url required." }, { status: 400 });
    const msg = markLinkAcquired(id, url);
    if (!msg) return Response.json({ ok: false, error: "Message not found or invalid state." }, { status: 400 });
    return Response.json({ ok: true, message: msg });
  }
  return Response.json({ ok: false, error: "Unsupported action." }, { status: 400 });
}
