import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { appendOutreachDraft } from "@/lib/content-engine/outreach/queue-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const to = typeof rec.to === "string" ? rec.to : "";
  const subject = typeof rec.subject === "string" ? rec.subject : "";
  const text = typeof rec.body === "string" ? rec.body : "";
  if (!to.includes("@") || subject.length < 4 || text.length < 20) {
    return Response.json({ ok: false, error: "Provide to, subject, body (min lengths)." }, { status: 400 });
  }
  const msg = appendOutreachDraft({ to, subject, body: text });
  return Response.json({ ok: true, message: msg });
}
