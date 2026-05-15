import { createSign } from "node:crypto";

function toBase64Url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function buildServiceAccountJwt(email: string, privateKey: string, scopes: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: email,
    scope: scopes,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const toSign = `${encodedHeader}.${encodedPayload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(toSign);
  const signature = signer.sign(privateKey, "base64url");
  return `${toSign}.${signature}`;
}

/**
 * OAuth access token for Google APIs using a service account JWT.
 * @param scopes Space-separated OAuth scopes.
 */
export async function fetchGoogleServiceAccountAccessToken(scopes: string): Promise<string | null> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !privateKeyRaw) return null;
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  try {
    const assertion = buildServiceAccountJwt(email, privateKey, scopes);
    const body = new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    });
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string };
    return json.access_token?.trim() || null;
  } catch {
    return null;
  }
}

export const GOOGLE_SCOPE_WEBMASTERS = "https://www.googleapis.com/auth/webmasters.readonly";
export const GOOGLE_SCOPE_ANALYTICS_READ = "https://www.googleapis.com/auth/analytics.readonly";

export function googleScopesWebmastersAndAnalytics(): string {
  return `${GOOGLE_SCOPE_WEBMASTERS} ${GOOGLE_SCOPE_ANALYTICS_READ}`;
}
