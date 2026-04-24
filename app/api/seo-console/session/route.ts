import type { NextRequest } from "next/server";
import { encodeSeoCookieToken, getSeoConsoleSecret, timingSafeStringEq } from "@/lib/content-engine/seo-console-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sets httpOnly session cookie for /seo-growth-console. Requires TOOLLABZ_SEO_CONSOLE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = getSeoConsoleSecret();
  if (!secret) {
    return Response.json({ ok: false, error: "TOOLLABZ_SEO_CONSOLE_SECRET is not configured." }, { status: 503 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const rec = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const provided = typeof rec.secret === "string" ? rec.secret : "";
  if (!timingSafeStringEq(provided, secret)) {
    return Response.json({ ok: false, error: "Invalid secret." }, { status: 401 });
  }

  const token = encodeSeoCookieToken(secret);
  const res = Response.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    `tlz_seo_console=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 12}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  );
  return res;
}

export async function DELETE() {
  const res = Response.json({ ok: true });
  res.headers.append("Set-Cookie", "tlz_seo_console=; Path=/; HttpOnly; Max-Age=0");
  return res;
}
