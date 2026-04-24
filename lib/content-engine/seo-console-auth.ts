import type { NextRequest } from "next/server";
import { getContentEngineSecret } from "./config";

export function timingSafeStringEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

export function getSeoConsoleSecret(): string | undefined {
  return process.env.TOOLLABZ_SEO_CONSOLE_SECRET?.trim();
}

/** Edge-safe base64url (no Node Buffer). */
export function encodeSeoCookieToken(secret: string): string {
  const bytes = new TextEncoder().encode(secret);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Cookie stores base64url(secret bytes); header may send raw secret for scripts. */
export function isSeoConsoleAuthenticated(req: NextRequest): boolean {
  const secret = getSeoConsoleSecret();
  if (!secret) return false;
  const expected = encodeSeoCookieToken(secret);
  const cookieRaw = req.cookies.get("tlz_seo_console")?.value ?? "";
  if (cookieRaw && timingSafeStringEq(cookieRaw, expected)) return true;
  const header = req.headers.get("x-seo-console-secret");
  if (header && timingSafeStringEq(header, secret)) return true;
  return false;
}

/** Dashboard JSON: SEO console session OR existing content-engine secret (CI / scripts). */
export function assertDashboardDataAuthorized(req: NextRequest): Response | null {
  if (isSeoConsoleAuthenticated(req)) return null;
  const engine = getContentEngineSecret();
  const header = req.headers.get("x-toollabz-secret");
  const auth = req.headers.get("authorization");
  const bearer = auth?.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : undefined;
  if (engine && (header === engine || bearer === engine)) return null;
  return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
}
