import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

const root = process.cwd();
const storePath = path.join(root, "lib", "content-engine", "backlinks.json");

export type BacklinkOpportunity = {
  slug: string;
  keyword: string;
  targetDomain: string;
  outreachMessage: string;
  status: "new" | "outreach_drafted" | "sent" | "replied" | "acquired";
  contactEmail?: string;
  sentAt?: string;
  repliedAt?: string;
  acquiredAt?: string;
  ts: string;
};

type BacklinkStore = { rows: BacklinkOpportunity[] };

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(filePath: string, data: unknown): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readStore(): BacklinkStore {
  const parsed = safeReadJson<Partial<BacklinkStore>>(storePath, {});
  return { rows: Array.isArray(parsed.rows) ? parsed.rows : [] };
}

function writeStore(store: BacklinkStore): void {
  writeJson(storePath, { rows: store.rows.slice(0, 800) });
}

export function generateOutreachMessage(input: { keyword: string; slug: string; targetDomain: string }): string {
  return [
    `Hi ${input.targetDomain} team,`,
    "",
    `We published a practical resource on "${input.keyword}" that includes actionable examples and a free tool.`,
    `If useful for your readers, consider referencing: https://example.com/tools/${input.slug}`,
    "",
    "Happy to share a custom summary paragraph for your audience.",
  ].join("\n");
}

export function findBacklinkOpportunities(rows: Array<{ slug: string; keyword: string; position: number }>): BacklinkOpportunity[] {
  const domains = ["medium.com", "dev.to", "hashnode.dev", "producthunt.com", "indiehackers.com"];
  const out: BacklinkOpportunity[] = [];
  for (const row of rows.filter((x) => x.position > 8 && x.position < 35).slice(0, 10)) {
    for (const domain of domains.slice(0, 2)) {
      out.push({
        slug: row.slug,
        keyword: row.keyword,
        targetDomain: domain,
        contactEmail: `editor@${domain}`,
        outreachMessage: generateOutreachMessage({ keyword: row.keyword, slug: row.slug, targetDomain: domain }),
        status: "outreach_drafted",
        ts: new Date().toISOString(),
      });
    }
  }
  return out.slice(0, 20);
}

export function trackBacklinks(rows: BacklinkOpportunity[]): void {
  const prev = readStore();
  const next = [...rows, ...prev.rows].filter(
    (row, idx, all) => idx === all.findIndex((x) => x.slug === row.slug && x.targetDomain === row.targetDomain),
  );
  writeStore({ rows: next.slice(0, 800) });
}

export function readBacklinks(limit = 200): BacklinkOpportunity[] {
  return readStore().rows.slice(0, limit);
}

async function sendOutreachEmail(row: BacklinkOpportunity): Promise<boolean> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.OUTREACH_FROM_EMAIL?.trim();
  if (!host || !user || !pass || !from || !row.contactEmail) return false;
  try {
    const transport = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: String(process.env.SMTP_SECURE ?? "false") === "true",
      auth: { user, pass },
    });
    await transport.sendMail({
      from,
      to: row.contactEmail,
      subject: `Resource suggestion: ${row.keyword}`,
      text: row.outreachMessage,
    });
    return true;
  } catch {
    return false;
  }
}

export async function executeBacklinkOutreach(maxEmails = 2): Promise<Array<{ slug: string; targetDomain: string; status: "sent" | "skipped"; reason?: string }>> {
  const store = readStore();
  const results: Array<{ slug: string; targetDomain: string; status: "sent" | "skipped"; reason?: string }> = [];
  let sent = 0;
  const nextRows = [...store.rows];
  for (const row of nextRows) {
    if (sent >= maxEmails) break;
    if (row.status !== "outreach_drafted") continue;
    const ok = await sendOutreachEmail(row);
    if (!ok) {
      results.push({ slug: row.slug, targetDomain: row.targetDomain, status: "skipped", reason: "smtp_not_configured_or_send_failed" });
      continue;
    }
    row.status = "sent";
    row.sentAt = new Date().toISOString();
    sent += 1;
    results.push({ slug: row.slug, targetDomain: row.targetDomain, status: "sent" });
  }
  writeStore({ rows: nextRows });
  return results;
}

export function summarizeOutreach(rows = readBacklinks(500)): { sent: number; replied: number; acquired: number } {
  return rows.reduce(
    (acc, row) => {
      if (row.status === "sent") acc.sent += 1;
      if (row.status === "replied") acc.replied += 1;
      if (row.status === "acquired") acc.acquired += 1;
      return acc;
    },
    { sent: 0, replied: 0, acquired: 0 },
  );
}

