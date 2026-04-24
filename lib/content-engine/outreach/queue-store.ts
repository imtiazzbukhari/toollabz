import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { OutreachMessage, OutreachQueueFile } from "./types";

function queuePath(): string {
  const env = process.env.CONTENT_ENGINE_OUTREACH_JSON?.trim();
  if (env) return env;
  return path.join(process.cwd(), "lib", "content-engine", "outreach", "outreach-queue.json");
}

function emptyQueue(): OutreachQueueFile {
  const day = new Date().toISOString().slice(0, 10);
  return { updatedAt: new Date().toISOString(), sentDay: day, sentCount: 0, messages: [] };
}

export function loadOutreachQueue(): OutreachQueueFile {
  const p = queuePath();
  try {
    if (!existsSync(p)) return emptyQueue();
    const raw = JSON.parse(readFileSync(p, "utf8")) as OutreachQueueFile;
    if (!raw || !Array.isArray(raw.messages)) return emptyQueue();
    return {
      updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
      sentDay: typeof raw.sentDay === "string" ? raw.sentDay : new Date().toISOString().slice(0, 10),
      sentCount: Number.isFinite(raw.sentCount) ? raw.sentCount : 0,
      messages: raw.messages,
    };
  } catch {
    return emptyQueue();
  }
}

export function saveOutreachQueue(q: OutreachQueueFile): void {
  const p = queuePath();
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(q, null, 2), "utf8");
}

export function appendOutreachDraft(input: { to: string; subject: string; body: string }): OutreachMessage {
  const q = loadOutreachQueue();
  const msg: OutreachMessage = {
    id: randomUUID(),
    to: input.to.trim(),
    subject: input.subject.trim(),
    body: input.body,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  q.messages.push(msg);
  q.updatedAt = new Date().toISOString();
  saveOutreachQueue(q);
  return msg;
}

export function approveOutreachMessage(id: string): OutreachMessage | null {
  const q = loadOutreachQueue();
  const m = q.messages.find((x) => x.id === id);
  if (!m || m.status !== "pending") return null;
  m.status = "approved";
  m.approvedAt = new Date().toISOString();
  q.updatedAt = new Date().toISOString();
  saveOutreachQueue(q);
  return m;
}

export function markReplied(id: string, note: string): boolean {
  const q = loadOutreachQueue();
  const m = q.messages.find((x) => x.id === id);
  if (!m || m.status !== "sent") return false;
  m.status = "replied";
  m.replyNote = note.slice(0, 2000);
  q.updatedAt = new Date().toISOString();
  saveOutreachQueue(q);
  return true;
}

export function markLinkAcquired(id: string, url: string): OutreachMessage | null {
  const q = loadOutreachQueue();
  const m = q.messages.find((x) => x.id === id);
  if (!m || (m.status !== "replied" && m.status !== "sent")) return null;
  m.status = "link_acquired";
  m.linkAcquiredUrl = url.trim().slice(0, 2000);
  m.linkAcquiredAt = new Date().toISOString();
  q.updatedAt = new Date().toISOString();
  saveOutreachQueue(q);
  return m;
}

export type OutreachQueueSummary = {
  total: number;
  pending: number;
  approved: number;
  sent: number;
  failed: number;
  replied: number;
  linkAcquired: number;
  sentToday: number;
  dailyCap: number;
};

export function summarizeOutreachQueue(): OutreachQueueSummary {
  const q = loadOutreachQueue();
  const by = { pending: 0, approved: 0, sent: 0, failed: 0, replied: 0, linkAcquired: 0 };
  for (const m of q.messages) {
    switch (m.status) {
      case "pending":
        by.pending += 1;
        break;
      case "approved":
        by.approved += 1;
        break;
      case "sent":
        by.sent += 1;
        break;
      case "failed":
        by.failed += 1;
        break;
      case "replied":
        by.replied += 1;
        break;
      case "link_acquired":
        by.linkAcquired += 1;
        break;
      default:
        break;
    }
  }
  const day = new Date().toISOString().slice(0, 10);
  const sentToday = q.sentDay === day ? q.sentCount : 0;
  return { total: q.messages.length, ...by, sentToday, dailyCap: DAILY_CAP };
}

const DAILY_CAP = Number(process.env.OUTREACH_DAILY_SEND_CAP ?? "8");

export function canSendToday(q: OutreachQueueFile): boolean {
  const day = new Date().toISOString().slice(0, 10);
  if (q.sentDay !== day) return true;
  return q.sentCount < DAILY_CAP;
}

export function recordSent(q: OutreachQueueFile): OutreachQueueFile {
  const day = new Date().toISOString().slice(0, 10);
  if (q.sentDay !== day) return { ...q, sentDay: day, sentCount: 1, updatedAt: new Date().toISOString() };
  return { ...q, sentCount: q.sentCount + 1, updatedAt: new Date().toISOString() };
}

export function updateMessageInQueue(msg: OutreachMessage): void {
  const q = loadOutreachQueue();
  const idx = q.messages.findIndex((m) => m.id === msg.id);
  if (idx >= 0) q.messages[idx] = msg;
  q.updatedAt = new Date().toISOString();
  saveOutreachQueue(q);
}

export { DAILY_CAP };
