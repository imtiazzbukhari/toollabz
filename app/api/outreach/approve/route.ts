import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { approveOutreachMessage } from "@/lib/content-engine/outreach/queue-store";

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
  const id = typeof (body as { id?: unknown }).id === "string" ? (body as { id: string }).id : "";
  if (!id) return Response.json({ ok: false, error: "id required" }, { status: 400 });
  const msg = approveOutreachMessage(id);
  if (!msg) return Response.json({ ok: false, error: "Not found or not pending" }, { status: 400 });
  return Response.json({ ok: true, message: msg });
}
