import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { markReplied } from "@/lib/content-engine/outreach/queue-store";

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
  const id = typeof rec.id === "string" ? rec.id : "";
  const note = typeof rec.note === "string" ? rec.note : "";
  if (!id || note.length < 3) return Response.json({ ok: false, error: "id and note required" }, { status: 400 });
  const ok = markReplied(id, note);
  if (!ok) {
    return Response.json({ ok: false, error: "Message not found or not in sent status." }, { status: 400 });
  }
  return Response.json({ ok: true });
}
