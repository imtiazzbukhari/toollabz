/** Basic SSRF guard for server-side fetches. */

const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "0.0.0.0", "metadata.google.internal"]);

function isPrivateIpv4(hostname: string): boolean {
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return false;
  const [a, b] = hostname.split(".").map(Number);
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

export function assertPublicHttpUrl(raw: string): URL {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error("Invalid URL");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http(s) URLs are allowed");
  }
  const host = u.hostname.toLowerCase();
  if (!host || BLOCKED_HOSTS.has(host) || host.endsWith(".local")) {
    throw new Error("Host not allowed");
  }
  if (isPrivateIpv4(host)) throw new Error("Private IP not allowed");
  if (host.startsWith("10.") || host.startsWith("192.168.")) throw new Error("Private host not allowed");
  return u;
}
