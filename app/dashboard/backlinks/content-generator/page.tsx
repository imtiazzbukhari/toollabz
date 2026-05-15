"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Prospect = { id: string; domain: string; category: string; page_type: string; status: string };

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
  quality_warnings: string;
  meta_description?: string | null;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: "include", ...init });
  const j = (await res.json().catch(() => ({}))) as T & { error?: string; message?: string };
  if (res.status === 401) throw new Error("Unauthorized - sign in via SEO console.");
  if (!res.ok) throw new Error((j as { error?: string }).error ?? (j as { message?: string }).message ?? res.statusText);
  return j as T;
}

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

export default function ContentGeneratorPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [prospectId, setProspectId] = useState("");
  const [content, setContent] = useState<ContentRow | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadProspects = useCallback(async () => {
    const [n, c] = await Promise.all([
      api<{ ok: boolean; prospects: Prospect[] }>("/api/backlinks/prospects?status=new"),
      api<{ ok: boolean; prospects: Prospect[] }>("/api/backlinks/prospects?status=content_ready"),
    ]);
    const map = new Map<string, Prospect>();
    for (const p of [...(n.prospects ?? []), ...(c.prospects ?? [])]) map.set(p.id, p);
    setProspects([...map.values()].sort((a, b) => a.domain.localeCompare(b.domain)));
  }, []);

  useEffect(() => {
    void loadProspects().catch(() => {});
  }, [loadProspects]);

  async function loadContent(id: string) {
    if (!id) {
      setContent(null);
      return;
    }
    const j = await api<{ ok: boolean; content: ContentRow | null }>(`/api/backlinks/content?prospectId=${encodeURIComponent(id)}`);
    setContent(j.content);
    if (j.content?.quality_warnings) {
      try {
        setWarnings(JSON.parse(j.content.quality_warnings) as string[]);
      } catch {
        setWarnings([]);
      }
    } else setWarnings([]);
  }

  useEffect(() => {
    if (prospectId) void loadContent(prospectId).catch((e) => setError(e instanceof Error ? e.message : "Load content failed"));
  }, [prospectId]);

  async function generate() {
    if (!prospectId) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const j = await api<{ ok: boolean; content: ContentRow; warnings?: string[] }>("/api/backlinks/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectId }),
      });
      setContent(j.content);
      setWarnings(Array.isArray(j.warnings) ? j.warnings : []);
      await loadProspects();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generate failed");
    } finally {
      setLoading(false);
    }
  }

  async function patchContent(approved: boolean) {
    if (!prospectId || !content) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const j = await api<{ ok: boolean; content: ContentRow; warnings?: string[] }>("/api/backlinks/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId,
          content_type: content.content_type,
          title: content.title,
          subject_line: content.subject_line,
          body: content.body,
          toollabz_tool_url: content.toollabz_tool_url,
          anchor_text: content.anchor_text,
          meta_description: content.meta_description ?? null,
          approved_by_user: approved,
        }),
      });
      setContent(j.content);
      setWarnings(Array.isArray(j.warnings) ? j.warnings : []);
      if (approved) {
        await api(`/api/backlinks/prospects/${prospectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "content_ready" }),
        });
        setSuccess("Approved and moved to outreach queue.");
      }
      await loadProspects();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  const ct = content?.content_type ?? "";

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Content generator</h1>
          <p className="mt-1 text-sm text-slate-600">Draft with AI, edit fields, save, then approve to send from Outreach.</p>
        </div>
        <Link href="/dashboard/backlinks" className="text-sm font-medium text-violet-700 hover:text-violet-900 hover:underline">
          ← Overview
        </Link>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Requires <code className="rounded bg-amber-100 px-1 text-amber-950">ANTHROPIC_API_KEY</code> on the server. Without it, the
        generate API returns an error - you can still paste copy and save.
      </div>

      {error ? <ErrorBox message={error} /> : null}
      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{success}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
          <label className="block text-sm font-medium text-slate-700">Prospect</label>
          <p className="mt-1 text-xs text-slate-600">Statuses: new, content_ready</p>
          <select
            className="mt-2 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            value={prospectId}
            onChange={(e) => setProspectId(e.target.value)}
          >
            <option value="">Select…</option>
            {prospects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.domain} ({p.page_type})
              </option>
            ))}
          </select>
          {prospectId ? (
            <div className="mt-3">
              {prospects.find((p) => p.id === prospectId) ? (
                <StatusBadge status={prospects.find((p) => p.id === prospectId)!.status} />
              ) : null}
            </div>
          ) : null}
          <button
            type="button"
            disabled={!prospectId || loading}
            onClick={() => void generate()}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:text-white"
          >
            {loading ? "Generating…" : "Generate with AI"}
          </button>
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
          {warnings.map((w) => (
            <div key={w} className="flex gap-2 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <span aria-hidden>⚠</span>
              <span>{w}</span>
            </div>
          ))}

          {content ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Content type</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800">{ct}</span>
                <span className="text-xs text-slate-600">Words: {content.word_count}</span>
              </div>

              {(ct === "guest_post" || content.title != null) && (
                <>
                  <label className="block text-sm font-medium text-slate-700">
                    Title
                    <input
                      className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                      value={content.title ?? ""}
                      onChange={(e) => setContent({ ...content, title: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    Meta description
                    <input
                      className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                      value={content.meta_description ?? ""}
                      onChange={(e) => setContent({ ...content, meta_description: e.target.value })}
                    />
                  </label>
                </>
              )}

              {(ct === "resource_pitch" || ct === "guest_post") && (
                <label className="block text-sm font-medium text-slate-700">
                  Subject line
                  <input
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                    value={content.subject_line ?? ""}
                    onChange={(e) => setContent({ ...content, subject_line: e.target.value })}
                  />
                </label>
              )}

              <label className="block text-sm font-medium text-slate-700">
                Body
                <textarea
                  className="mt-1 min-h-[280px] w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900"
                  value={content.body}
                  onChange={(e) => setContent({ ...content, body: e.target.value })}
                />
              </label>

              {(ct === "guest_post" || ct === "resource_pitch" || ct === "directory_listing") && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700">
                    Tool URL
                    <input
                      className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                      value={content.toollabz_tool_url ?? ""}
                      onChange={(e) => setContent({ ...content, toollabz_tool_url: e.target.value })}
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Anchor text
                    <input
                      className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                      value={content.anchor_text ?? ""}
                      onChange={(e) => setContent({ ...content, anchor_text: e.target.value })}
                    />
                  </label>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void patchContent(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void patchContent(true)}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:text-white"
                >
                  Approve & Move to Queue
                </button>
              </div>
            </>
          ) : prospectId ? (
            <p className="text-sm text-slate-600">No saved content yet - generate with AI or save after drafting elsewhere.</p>
          ) : (
            <p className="text-sm text-slate-600">Select a prospect to begin.</p>
          )}
        </div>
      </div>
    </main>
  );
}
