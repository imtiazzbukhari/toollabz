"use client";

import { useState } from "react";
import useSWR from "swr";
import { backlinksFetch } from "./backlinks-fetch";
import { Copy, CheckCircle2, Mail } from "lucide-react";

type Row = {
  id: string;
  domain: string;
  status: string;
  quality_score: number;
  page_type: string;
  subject_line: string | null;
  content_title: string | null;
  body_preview: string | null;
  sent_at: string | null;
  follow_up_date: string | null;
  response_type: string | null;
};

export default function OutreachManagerClient() {
  const { data, mutate } = useSWR("/api/backlinks/outreach", (u) => backlinksFetch<{ items: Row[]; needsFollowUp: Row[] }>(u));
  const items = data?.items ?? [];
  const followUps = data?.needsFollowUp ?? [];
  const [modal, setModal] = useState<{ prospectId: string; domain: string } | null>(null);
  const [liveUrl, setLiveUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function copyEmail(row: Row) {
    const full = await backlinksFetch<{ content: { subject_line: string | null; body: string } | null }>(
      `/api/backlinks/content?prospectId=${encodeURIComponent(row.id)}`,
    );
    const subj = full.content?.subject_line ?? "Toollabz";
    const text = `Subject: ${subj}\n\n${full.content?.body ?? ""}`;
    await navigator.clipboard.writeText(text);
  }

  function openGmail(row: Row) {
    void (async () => {
      const full = await backlinksFetch<{ content: { subject_line: string | null; body: string } | null }>(
        `/api/backlinks/content?prospectId=${encodeURIComponent(row.id)}`,
      );
      const sub = full.content?.subject_line ?? "Toollabz";
      const body = full.content?.body ?? "";
      const url = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
      window.open(url, "_blank");
    })();
  }

  async function markSent(id: string) {
    setBusy(true);
    try {
      await backlinksFetch("/api/backlinks/outreach", { method: "POST", body: JSON.stringify({ action: "mark_sent", prospectId: id }) });
      await mutate();
    } finally {
      setBusy(false);
    }
  }

  async function markResponse(prospectId: string, responseType: string) {
    setBusy(true);
    try {
      await backlinksFetch("/api/backlinks/outreach", {
        method: "POST",
        body: JSON.stringify({ action: "record_response", prospectId, response_type: responseType }),
      });
      await mutate();
      setModal(null);
    } finally {
      setBusy(false);
    }
  }

  async function verifyLive(prospectId: string) {
    setBusy(true);
    try {
      await backlinksFetch("/api/backlinks/verify-live", {
        method: "POST",
        body: JSON.stringify({ prospectId, liveUrl }),
      });
      await mutate();
      setModal(null);
      setLiveUrl("");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Verify failed");
    } finally {
      setBusy(false);
    }
  }

  async function followDraft(id: string) {
    const res = await backlinksFetch<{ subject_line: string; email_body: string }>("/api/backlinks/outreach", {
      method: "POST",
      body: JSON.stringify({ action: "generate_follow_up", prospectId: id }),
    });
    await navigator.clipboard.writeText(`${res.subject_line}\n\n${res.email_body}`);
    alert("Follow-up copied to clipboard");
  }

  const queue = items.filter((r) => r.status === "content_ready");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Outreach manager</h1>
        <p className="mt-2 rounded-xl border border-rose-200/80 bg-rose-50/90 p-3 text-sm text-rose-950 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-50">
          <strong>Manual send only.</strong> Content is ready - you send the email from your own mailbox. Automated bulk sending
          violates anti-spam laws and Google guidelines. Each message should be personally sent and tracked here.
        </p>
      </div>

      <section className="rounded-2xl border border-white/20 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Ready to send</h2>
        <div className="mt-3 space-y-3">
          {queue.length === 0 ? (
            <p className="text-sm text-slate-500">No rows in content_ready.</p>
          ) : (
            queue.map((row) => (
              <div
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-950/40"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{row.domain}</p>
                  <p className="text-xs text-slate-500">
                    {row.page_type} · score {row.quality_score} · {row.subject_line ?? row.content_title ?? "-"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void copyEmail(row)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold dark:border-slate-600"
                  >
                    <Copy className="h-3 w-3" />
                    Copy email
                  </button>
                  <button
                    type="button"
                    onClick={() => openGmail(row)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold dark:border-slate-600"
                  >
                    <Mail className="h-3 w-3" />
                    Open Gmail
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void markSent(row.id)}
                    className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white"
                  >
                    Mark as sent
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {followUps.length > 0 ? (
        <section className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <h2 className="text-sm font-bold text-amber-950 dark:text-amber-100">Follow-up due (7+ days since send)</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {followUps.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2">
                <span>{r.domain}</span>
                <button type="button" className="text-xs font-semibold text-violet-700 underline" onClick={() => void followDraft(r.id)}>
                  Copy AI follow-up
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-white/20 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Response tracking</h2>
        <p className="mt-1 text-xs text-slate-500">Mark outcomes for sent or approved prospects.</p>
        <div className="mt-3 space-y-2">
          {items
            .filter((r) => r.status === "sent" || r.status === "approved")
            .map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-2 dark:border-slate-700">
                <span className="text-sm font-medium">{r.domain}</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-slate-800 px-2 py-1 text-xs font-semibold text-white dark:bg-slate-200 dark:text-slate-900"
                    onClick={() => setModal({ prospectId: r.id, domain: r.domain })}
                  >
                    Got response / Live URL
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Update {modal.domain}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                onClick={() => void markResponse(modal.prospectId, "approved")}
              >
                Approved
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                onClick={() => void markResponse(modal.prospectId, "rejected")}
              >
                Rejected
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-900"
                onClick={() => void markResponse(modal.prospectId, "negotiating")}
              >
                Negotiating
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-slate-600"
                onClick={() => void markResponse(modal.prospectId, "no_response")}
              >
                No response
              </button>
            </div>
            <label className="mt-4 block text-sm font-medium text-slate-800 dark:text-slate-100">
              Live backlink URL (after approval)
              <input
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com/article#..."
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
              />
            </label>
            <button
              type="button"
              disabled={busy || !liveUrl.trim()}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              onClick={() => void verifyLive(modal.prospectId)}
            >
              <CheckCircle2 className="h-4 w-4" />
              Verify & record live link
            </button>
            <button type="button" className="mt-3 ml-2 text-sm text-slate-600 underline" onClick={() => setModal(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
