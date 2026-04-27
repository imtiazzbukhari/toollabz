import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import { callClaudeJson, parseJsonObject } from "@/lib/backlinks/anthropic-generate";
import { followUpPrompt } from "@/lib/backlinks/prompts";
import {
  getContentByProspect,
  getOutreachLog,
  addActivity,
  getProspect,
  listOutreachQueue,
  updateOutreachLog,
  updateProspect,
  type ContentRow,
  type OutreachLogRow,
  type OutreachQueueRow,
} from "@/lib/db/backlinks-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type OutreachQueueItem = OutreachQueueRow & {
  content: ContentRow | null;
  outreach_log: OutreachLogRow | null;
};

export async function GET(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  const rows = listOutreachQueue();
  const items: OutreachQueueItem[] = rows.map((row) => ({
    ...row,
    content: getContentByProspect(row.id) ?? null,
    outreach_log: getOutreachLog(row.id) ?? null,
  }));
  const now = Date.now();
  const needsFollowUp = items.filter((row) => {
    if (row.status !== "sent" || !row.follow_up_date) return false;
    const due = Date.parse(row.follow_up_date);
    return !Number.isNaN(due) && now >= due && row.response_type !== "approved" && row.response_type !== "rejected";
  });
  return Response.json({ ok: true, items, needsFollowUp });
}

type PostBody =
  | { action: "mark_sent"; prospectId: string }
  | { action: "record_response"; prospectId: string; response_type: string; notes?: string }
  | { action: "generate_follow_up"; prospectId: string }
  | { action: "mark_follow_up_sent"; prospectId: string };

function addDaysIso(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function followUpFallback(domain: string, subject: string, snippet: string) {
  const sub = subject.trim() ? `Re: ${subject.trim()}` : `Following up — Toollabz for ${domain}`;
  const body = `Hi,

Following up on my earlier email about featuring Toollabz (free calculators and tools) for ${domain}.

${snippet.trim() ? `Context:\n${snippet.trim().slice(0, 400)}${snippet.length > 400 ? "…" : ""}\n\n` : ""}Happy to tweak placement, anchor, or format.

Thanks,`;
  return { subject_line: sub, email_body: body };
}

export async function POST(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (body.action === "mark_sent") {
    const p = getProspect(body.prospectId);
    if (!p) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    const content = getContentByProspect(body.prospectId);
    if (!content) {
      return Response.json({ ok: false, error: "content_required_before_send" }, { status: 400 });
    }
    if (p.status !== "content_ready") {
      return Response.json({ ok: false, error: "invalid_status_for_send" }, { status: 400 });
    }
    updateOutreachLog(body.prospectId, {
      sent_at: new Date().toISOString(),
      follow_up_date: addDaysIso(7),
      response_type: null,
    });
    updateProspect(body.prospectId, { status: "sent" });
    addActivity({
      id: randomUUID(),
      ts: new Date().toISOString(),
      kind: "outreach",
      message: `Marked outreach sent: ${p.domain}`,
      prospect_id: body.prospectId,
    });
    return Response.json({ ok: true });
  }

  if (body.action === "record_response") {
    const p = getProspect(body.prospectId);
    if (!p) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    const allowed = new Set(["approved", "rejected", "negotiating", "no_response"]);
    if (!allowed.has(body.response_type)) {
      return Response.json({ ok: false, error: "invalid_response_type" }, { status: 400 });
    }
    updateOutreachLog(body.prospectId, {
      response_date: new Date().toISOString(),
      response_type: body.response_type,
      notes: body.notes ?? "",
    });
    const nextStatus =
      body.response_type === "approved"
        ? "approved"
        : body.response_type === "rejected"
          ? "rejected"
          : body.response_type === "negotiating"
            ? "negotiating"
            : "sent";
    updateProspect(body.prospectId, { status: nextStatus });
    addActivity({
      id: randomUUID(),
      ts: new Date().toISOString(),
      kind: "response",
      message: `Recorded ${body.response_type} for ${p.domain}`,
      prospect_id: body.prospectId,
    });
    return Response.json({ ok: true });
  }

  if (body.action === "generate_follow_up") {
    const c = getContentByProspect(body.prospectId);
    const p = getProspect(body.prospectId);
    if (!c || !p) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    let subject_line: string;
    let email_body: string;
    if (process.env.ANTHROPIC_API_KEY?.trim()) {
      const system = "You write concise outreach. Output JSON only.";
      const user = followUpPrompt({
        domain: p.domain,
        originalSubject: c.subject_line ?? "Toollabz listing",
        snippet: c.body.slice(0, 400),
      });
      try {
        const raw = await callClaudeJson(system, user);
        const json = parseJsonObject(raw);
        subject_line = String(json.subject_line ?? "");
        email_body = String(json.email_body ?? "");
      } catch {
        const fb = followUpFallback(p.domain, c.subject_line ?? "", c.body);
        subject_line = fb.subject_line;
        email_body = fb.email_body;
      }
    } else {
      const fb = followUpFallback(p.domain, c.subject_line ?? "", c.body);
      subject_line = fb.subject_line;
      email_body = fb.email_body;
    }
    updateOutreachLog(body.prospectId, {
      follow_up_subject: subject_line,
      follow_up_body: email_body,
    });
    return Response.json({ ok: true, subject_line, email_body });
  }

  if (body.action === "mark_follow_up_sent") {
    const p = getProspect(body.prospectId);
    if (!p) return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    updateOutreachLog(body.prospectId, {
      follow_up_sent_at: new Date().toISOString(),
    });
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: "unknown_action" }, { status: 400 });
}
