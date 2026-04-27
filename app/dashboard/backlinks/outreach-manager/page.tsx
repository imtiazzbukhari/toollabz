"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type ContentRow = {
  id: string;
  prospect_id: string;
  content_type: string;
  title: string | null;
  subject_line: string | null;
  body: string;
  toollabz_tool_url: string | null;
  anchor_text: string | null;
  word_count: number;
};

type OutreachLog = {
  sent_at: string | null;
  follow_up_date: string | null;
  follow_up_sent_at: string | null;
  follow_up_subject: string | null;
  follow_up_body: string | null;
  response_type: string | null;
};

type QueueItem = {
  id: string;
  domain: string;
  status: string;
  quality_score: number;
  contact_email: string | null;
  page_type: string;
  subject_line: string | null;
  content_title: string | null;
  content_type: string | null;
  body_preview: string | null;
  sent_at: string | null;
  follow_up_date: string | null;
  response_type: string | null;
  content: ContentRow | null;
  outreach_log: OutreachLog | null;
};

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
      <p className="text-sm font-medium text-rose-900">Something went wrong</p>
      <p className="mt-1 text-sm text-rose-700">{message}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-slate-100 text-slate-800",
    content_ready: "bg-violet-100 text-violet-900",
    sent: "bg-amber-100 text-amber-900",
    approved: "bg-sky-100 text-sky-900",
    negotiating: "bg-indigo-100 text-indigo-900",
    live: "bg-emerald-100 text-emerald-900",
    rejected: "bg-rose-100 text-rose-900",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-slate-100 text-slate-800"}`}>{status}</span>;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: "include", ...init });
  const j = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (res.status === 401) throw new Error("Unauthorized — sign in via SEO console.");
  if (!res.ok) throw new Error((j as { error?: string }).error ?? res.statusText);
  return j as T;
}

function daysSinceSent(sentAt: string | null | undefined): number | null {
  if (!sentAt) return null;
  const t = Date.parse(sentAt);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86400000);
}

export default function OutreachManagerPage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [needsFollowUp, setNeedsFollowUp] = useState<QueueItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<QueueItem | null>(null);
  const [responseType, setResponseType] = useState("approved");
  const [responseNotes, setResponseNotes] = useState("");
  const [followUpDraft, setFollowUpDraft] = useState<{ id: string; subject: string; body: string } | null>(null);
  const [verifyRow, setVerifyRow] = useState<QueueItem | null>(null);
  const [liveUrl, setLiveUrl] = useState("");
  const [relevance, setRelevance] = useState(8);
  const [verifyMsg, setVerifyMsg] = useState<{ tone: "ok" | "warn"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const j = await api<{ ok: boolean; items: QueueItem[]; needsFollowUp: QueueItem[] }>("/api/backlinks/outreach");
      setItems(j.items ?? []);
      setNeedsFollowUp(j.needsFollowUp ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const followUpDueIds = useMemo(() => new Set(needsFollowUp.map((r) => r.id)), [needsFollowUp]);

  async function markSent(row: QueueItem) {
    setError(null);
    try {
      await api("/api/backlinks/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_sent", prospectId: row.id }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not mark sent");
    }
  }

  function copyEmail(row: QueueItem) {
    const c = row.content;
    const subj = c?.subject_line ?? row.subject_line ?? "Toollabz";
    const body = c?.body ?? row.body_preview ?? "";
    void navigator.clipboard.writeText(`Subject: ${subj}\n\n${body}`);
  }

  function openGmail(row: QueueItem) {
    const c = row.content;
    const subject = c?.subject_line ?? row.subject_line ?? "Toollabz";
    const body = c?.body ?? row.body_preview ?? "";
    const url = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
  }

  async function saveResponse() {
    if (!modal) return;
    setError(null);
    try {
      await api("/api/backlinks/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "record_response",
          prospectId: modal.id,
          response_type: responseType,
          notes: responseNotes,
        }),
      });
      setModal(null);
      setResponseNotes("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function generateFollowUp(row: QueueItem) {
    setError(null);
    try {
      const j = await api<{ ok: boolean; subject_line: string; email_body: string }>("/api/backlinks/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_follow_up", prospectId: row.id }),
      });
      setFollowUpDraft({ id: row.id, subject: j.subject_line, body: j.email_body });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Follow-up failed");
    }
  }

  async function markFollowUpSent(row: QueueItem) {
    setError(null);
    try {
      await api("/api/backlinks/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_follow_up_sent", prospectId: row.id }),
      });
      setFollowUpDraft(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function verifyLive() {
    if (!verifyRow || !liveUrl.trim()) return;
    setError(null);
    setVerifyMsg(null);
    const res = await fetch("/api/backlinks/verify-live", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospectId: verifyRow.id, liveUrl: liveUrl.trim(), relevance }),
    });
    const j = (await res.json()) as { ok: boolean; found?: boolean; message?: string; error?: string };
    if (!res.ok || !j.ok) {
      setError(j.error ?? j.message ?? "Verification failed");
      return;
    }
    setVerifyMsg({
      tone: j.found ? "ok" : "warn",
      text: j.found ? "Link verified ✓" : (j.message ?? "Not found yet — check URL"),
    });
    if (j.found) {
      setVerifyRow(null);
      setLiveUrl("");
      await load();
    }
  }

  const sentTs = (row: QueueItem) => row.outreach_log?.sent_at ?? row.sent_at;

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Outreach manager</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Send email from your own account. Use Copy / Open Gmail, then mark status here. Automated bulk sending is not supported.
          </p>
        </div>
        <Link href="/dashboard/backlinks" className="text-sm font-medium text-violet-700 hover:text-violet-900 hover:underline">
          ← Overview
        </Link>
      </div>

      {error ? <ErrorBox message={error} /> : null}

      {needsFollowUp.length > 0 ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Follow-up due (≥7 days since sent)</p>
          <ul className="mt-2 list-inside list-disc text-slate-800">
            {needsFollowUp.map((r) => (
              <li key={r.id}>
                <span className="font-medium text-slate-900">{r.domain}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-600">Loading queue…</p>
      ) : items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500">No prospects in queue yet.</p>
          <Link href="/dashboard/backlinks/content-generator" className="mt-3 inline-block text-sm font-medium text-violet-700 hover:underline">
            Generate content →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((row) => {
            const c = row.content;
            const ct = c?.content_type ?? row.content_type ?? "—";
            const subj = c?.subject_line ?? row.subject_line;
            const days = daysSinceSent(sentTs(row));
            const showFollowUp =
              row.status === "sent" && days != null && days >= 7 && row.response_type !== "approved" && row.response_type !== "rejected";
            return (
              <div key={row.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-900">{row.domain}</span>
                      <StatusBadge status={row.status} />
                      {followUpDueIds.has(row.id) ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Follow-up due</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                      Content type: <span className="text-slate-800">{ct}</span>
                    </p>
                    {subj ? (
                      <p className="mt-1 text-sm text-slate-800">
                        <span className="font-medium text-slate-700">Subject:</span> {subj}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm text-slate-800">
                      <span className="font-medium text-slate-700">Contact:</span> {row.contact_email ?? "—"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Sent: {sentTs(row) ? sentTs(row)!.slice(0, 10) : "Not sent yet"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col flex-wrap gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => copyEmail(row)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Copy Email
                  </button>
                  <button
                    type="button"
                    onClick={() => openGmail(row)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Open Gmail
                  </button>
                  {row.status === "content_ready" ? (
                    <button
                      type="button"
                      onClick={() => void markSent(row)}
                      className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
                    >
                      Mark as Sent
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setModal(row);
                      setResponseType("approved");
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Record Response
                  </button>
                  {showFollowUp ? (
                    <button
                      type="button"
                      onClick={() => void generateFollowUp(row)}
                      className="rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100"
                    >
                      Generate Follow-up
                    </button>
                  ) : null}
                  {row.status === "approved" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyRow(row);
                        setVerifyMsg(null);
                      }}
                      className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
                    >
                      Verify live link
                    </button>
                  ) : null}
                </div>
                {c?.body ? (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer font-medium text-violet-700 hover:text-violet-900">View content</summary>
                    <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded border border-slate-200 bg-slate-50 p-3 text-slate-800">
                      {c.body}
                    </pre>
                  </details>
                ) : null}
                {showFollowUp && followUpDraft?.id === row.id ? (
                  <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-700">Generated follow-up</p>
                    <p className="text-sm text-slate-900">{followUpDraft.subject}</p>
                    <pre className="whitespace-pre-wrap text-sm text-slate-800">{followUpDraft.body}</pre>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800"
                        onClick={() =>
                          void navigator.clipboard.writeText(`Subject: ${followUpDraft.subject}\n\n${followUpDraft.body}`)
                        }
                      >
                        Copy Follow-up
                      </button>
                      <button
                        type="button"
                        onClick={() => void markFollowUpSent(row)}
                        className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
                      >
                        Mark Follow-up Sent
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Record response — {modal.domain}</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-800">
              <label className="flex items-center gap-2">
                <input type="radio" name="rt" checked={responseType === "approved"} onChange={() => setResponseType("approved")} />
                Approved
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="rt" checked={responseType === "rejected"} onChange={() => setResponseType("rejected")} />
                Rejected
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="rt" checked={responseType === "negotiating"} onChange={() => setResponseType("negotiating")} />
                Negotiating
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="rt" checked={responseType === "no_response"} onChange={() => setResponseType("no_response")} />
                No response
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Notes
              <textarea
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                rows={3}
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
              />
            </label>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void saveResponse()}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                Save
              </button>
              <button type="button" className="text-sm font-medium text-slate-700 hover:text-violet-700" onClick={() => setModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {verifyRow ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Verify live link</h2>
            <p className="mt-1 text-sm text-slate-600">We fetch the page and check for toollabz.com before logging.</p>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              Live page URL
              <input
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
              />
            </label>
            <label className="mt-3 block text-sm font-medium text-slate-700">
              Relevance (7–10)
              <input
                type="number"
                min={7}
                max={10}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                value={relevance}
                onChange={(e) => setRelevance(Number(e.target.value))}
              />
            </label>
            {verifyMsg ? (
              <div
                className={
                  verifyMsg.tone === "ok"
                    ? "mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
                    : "mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
                }
              >
                {verifyMsg.text}
              </div>
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="text-sm font-medium text-slate-700 hover:underline" onClick={() => setVerifyRow(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                onClick={() => void verifyLive()}
              >
                Verify & Add
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
