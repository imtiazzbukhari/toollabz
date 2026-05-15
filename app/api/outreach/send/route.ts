import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { loadOutreachQueue, saveOutreachQueue, canSendToday } from "@/lib/content-engine/outreach/queue-store";
import { sendOutreachViaSmtp } from "@/lib/content-engine/outreach/smtp-send";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sends one **approved** message. OUTREACH_DRY_RUN=0 required to hit SMTP (default dry).
 */
export async function POST(req: NextRequest) {
  const denied = assertContentEngineAuthorized(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const id = typeof rec.id === "string" ? rec.id : "";
  const confirmApproved = rec.confirmApproved === true;
  if (!id || !confirmApproved) {
    return Response.json({ ok: false, error: "Provide id and confirmApproved: true" }, { status: 400 });
  }

  const q = loadOutreachQueue();
  const msg = q.messages.find((m) => m.id === id);
  if (!msg || msg.status !== "approved") {
    return Response.json({ ok: false, error: "Message must be approved before send." }, { status: 400 });
  }
  if (!canSendToday(q)) {
    return Response.json({ ok: false, error: "Daily send cap reached." }, { status: 429 });
  }

  const dry = process.env.OUTREACH_DRY_RUN !== "0";
  if (dry) {
    return Response.json({
      ok: true,
      dryRun: true,
      note: "OUTREACH_DRY_RUN is not 0 - no email sent. Set OUTREACH_DRY_RUN=0 and SMTP env to send.",
    });
  }

  const sent = await sendOutreachViaSmtp(msg);
  if (!sent.ok) {
    msg.status = "failed";
    msg.failedReason = sent.error;
    const idx = q.messages.findIndex((m) => m.id === id);
    if (idx >= 0) q.messages[idx] = msg;
    q.updatedAt = new Date().toISOString();
    saveOutreachQueue(q);
    return Response.json({ ok: false, error: sent.error }, { status: 502 });
  }

  msg.status = "sent";
  msg.sentAt = new Date().toISOString();
  const day = new Date().toISOString().slice(0, 10);
  if (q.sentDay !== day) {
    q.sentDay = day;
    q.sentCount = 1;
  } else {
    q.sentCount += 1;
  }
  const idx = q.messages.findIndex((m) => m.id === id);
  if (idx >= 0) q.messages[idx] = msg;
  q.updatedAt = new Date().toISOString();
  saveOutreachQueue(q);

  return Response.json({ ok: true, message: msg });
}
