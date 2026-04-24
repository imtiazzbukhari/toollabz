import type { NextRequest } from "next/server";
import { getContentEngineSecret } from "./config";

export function assertContentEngineAuthorized(req: NextRequest): Response | null {
  const expected = getContentEngineSecret();
  if (!expected) {
    return Response.json({ ok: false, error: "CONTENT_ENGINE_SECRET (or CRON_SECRET) is not set." }, { status: 503 });
  }
  const header = req.headers.get("x-toollabz-secret");
  const auth = req.headers.get("authorization");
  const bearer = auth?.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : undefined;
  if (header === expected || bearer === expected) return null;
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}
