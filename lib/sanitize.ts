/** Trim and bound length for free-text fields (defense in depth; prefer validation at boundaries). */
export function sanitizePlainText(input: unknown, maxLen: number): string {
  if (typeof input !== "string") return "";
  return input.replace(/\u0000/g, "").trim().slice(0, maxLen);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export function sanitizeEmail(input: unknown): string | null {
  const s = sanitizePlainText(input, 254).toLowerCase();
  if (!s || !EMAIL_RE.test(s)) return null;
  return s;
}
