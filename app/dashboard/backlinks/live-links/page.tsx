"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Live = {
  id: string;
  prospect_id: string | null;
  source_url: string;
  dr: number | null;
  type: string | null;
  anchor: string | null;
  dofollow: number;
  relevance: number | null;
  date_live: string;
  date_lost: string | null;
};

type Prospect = { id: string; domain: string; status: string };

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
      <p className="text-sm font-medium text-rose-900">Something went wrong</p>
      <p className="mt-1 text-sm text-rose-700">{message}</p>
    </div>
  );
}

function DrBadge({ dr }: { dr: number | null }) {
  if (dr == null) return <span className="text-slate-600">—</span>;
  const cls =
    dr >= 60 ? "bg-emerald-100 text-emerald-800" : dr >= 30 ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{dr}</span>;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: "include", ...init });
  const j = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error((j as { error?: string }).error ?? res.statusText);
  return j as T;
}

export default function LiveLinksPage() {
  const [rows, setRows] = useState<Live[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [prospectId, setProspectId] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [dr, setDr] = useState(40);
  const [anchor, setAnchor] = useState("");
  const [dofollow, setDofollow] = useState(true);
  const [relevance, setRelevance] = useState(8);
  const [verifyNote, setVerifyNote] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const j = await api<{ ok: boolean; live_links: Live[] }>("/api/backlinks/live-links");
      setRows(j.live_links ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!formOpen) return;
    void (async () => {
      try {
        const j = await api<{ ok: boolean; prospects: Prospect[] }>("/api/backlinks/prospects?status=approved");
        setProspects(j.prospects ?? []);
      } catch {
        setProspects([]);
      }
    })();
  }, [formOpen]);

  const metrics = useMemo(() => {
    const total = rows.length;
    const drs = rows.map((r) => r.dr).filter((d): d is number => d != null);
    const avgDr = drs.length ? Math.round((drs.reduce((a, b) => a + b, 0) / drs.length) * 10) / 10 : 0;
    const df = rows.filter((r) => r.dofollow).length;
    const pctDf = total ? Math.round((df / total) * 1000) / 10 : 0;
    const start = new Date();
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
    const iso = start.toISOString().slice(0, 10);
    const thisMonth = rows.filter((r) => r.date_live >= iso).length;
    return { total, avgDr, pctDf, thisMonth };
  }, [rows]);

  async function verifyAndAdd() {
    setErr(null);
    setVerifyNote(null);
    if (!prospectId || !sourceUrl.trim()) {
      setErr("Select a prospect and enter source URL.");
      return;
    }
    const res = await fetch("/api/backlinks/verify-live", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prospectId,
        liveUrl: sourceUrl.trim(),
        relevance,
        dr,
        anchor: anchor.trim() || null,
        dofollow,
      }),
    });
    const j = (await res.json()) as { ok: boolean; found?: boolean; message?: string; error?: string };
    if (!res.ok || !j.ok) {
      setErr(j.error ?? j.message ?? "Request failed");
      return;
    }
    setVerifyNote({ ok: Boolean(j.found), text: j.found ? "Link verified ✓" : (j.message ?? "Not found yet — check URL") });
    if (j.found) {
      setFormOpen(false);
      setProspectId("");
      setSourceUrl("");
      await load();
    }
  }

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Live links</h1>
          <p className="mt-1 text-sm text-slate-600">Verified placements. DR should be re-checked in Ahrefs.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setFormOpen(true);
              setVerifyNote(null);
            }}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Add live link manually
          </button>
          <Link href="/dashboard/backlinks" className="self-center text-sm font-medium text-violet-700 hover:text-violet-900 hover:underline">
            ← Overview
          </Link>
        </div>
      </div>

      {err ? <ErrorBox message={err} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total live links", value: metrics.total },
          { label: "Average DR", value: metrics.avgDr },
          { label: "% Dofollow", value: `${metrics.pctDf}%` },
          { label: "Links this month", value: metrics.thisMonth },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{m.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{loading ? "—" : m.value}</p>
          </div>
        ))}
      </div>

      {formOpen ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Verify & add</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Prospect (approved)
              <select
                className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                value={prospectId}
                onChange={(e) => setProspectId(e.target.value)}
              >
                <option value="">Select…</option>
                {prospects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.domain}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Source URL
              <input
                className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              DR (reference)
              <input
                type="number"
                className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                value={dr}
                onChange={(e) => setDr(Number(e.target.value))}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Anchor text
              <input
                className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900"
                value={anchor}
                onChange={(e) => setAnchor(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <input type="checkbox" checked={dofollow} onChange={(e) => setDofollow(e.target.checked)} />
              Dofollow
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Relevance (7–10)
              <input
                type="range"
                min={7}
                max={10}
                className="mt-1 block w-full"
                value={relevance}
                onChange={(e) => setRelevance(Number(e.target.value))}
              />
              <span className="text-xs text-slate-600">{relevance}</span>
            </label>
          </div>
          {verifyNote ? (
            <div
              className={
                verifyNote.ok
                  ? "mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
                  : "mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
              }
            >
              {verifyNote.text}
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void verifyAndAdd()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              Verify & Add
            </button>
            <button type="button" className="text-sm font-medium text-slate-700 hover:underline" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">Source URL</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">DR</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">Type</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">Anchor</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">D/NF</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">Relevance</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">Date live</th>
              <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-12 text-center">
                  <p className="text-sm text-slate-500">No verified live links yet.</p>
                  <button
                    type="button"
                    onClick={() => setFormOpen(true)}
                    className="mt-3 text-sm font-medium text-violet-700 hover:underline"
                  >
                    Add one →
                  </button>
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="max-w-xs truncate px-3 py-2">
                    <a href={r.source_url} className="font-medium text-violet-700 hover:text-violet-900" target="_blank" rel="noreferrer">
                      {r.source_url}
                    </a>
                  </td>
                  <td className="px-3 py-2">
                    <DrBadge dr={r.dr} />
                  </td>
                  <td className="px-3 py-2 text-slate-800">{r.type ?? "—"}</td>
                  <td className="px-3 py-2 text-slate-600">{r.anchor ?? "—"}</td>
                  <td className="px-3 py-2 text-slate-800">{r.dofollow ? "D" : "NF"}</td>
                  <td className="px-3 py-2 text-slate-800">{r.relevance ?? "—"}</td>
                  <td className="px-3 py-2 text-sm text-slate-700">{r.date_live.slice(0, 10)}</td>
                  <td className="px-3 py-2 text-slate-800">{r.date_lost ? "Lost" : "Active"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
