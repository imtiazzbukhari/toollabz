import type { NextRequest } from "next/server";
import { assertContentEngineAuthorized } from "@/lib/content-engine/http-auth";
import { loadOutreachQueue, DAILY_CAP } from "@/lib/content-engine/outreach/queue-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = assertContentEngineAuthorized(req);
  if (denied) return denied;
  const q = loadOutreachQueue();
  const dry = process.env.OUTREACH_DRY_RUN !== "0";
  return Response.json({
    ok: true,
    dryRunDefault: dry,
    dailyCap: DAILY_CAP,
    sentDay: q.sentDay,
    sentCount: q.sentCount,
    messages: q.messages.slice(-40),
  });
}
