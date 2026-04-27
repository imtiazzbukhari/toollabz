"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Prospect = {
  id: string;
  domain: string;
  full_url: string;
  dr_estimate: number;
  category: string;
  has_write_for_us: number;
  has_resources_page: number;
  contact_email: string | null;
  page_type: string;
  status: string;
  quality_score: number;
  quality_rejection_reason: string | null;
  notes: string;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: "include", ...init });
  const j = (await res.json().catch(() => ({}))) as T & { error?: string; ok?: boolean };
  if (res.status === 401) throw new Error("Unauthorized — sign in via SEO console.");
  if (!res.ok) throw new Error((j as { error?: string }).error ?? res.statusText);
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

export default function ProspectFinderPage() {
  const [category, setCategory] = useState("tools");
  const [status, setStatus] = useState<string>("");
  const [pageType, setPageType] = useState<string>("");
  const [rows, setRows] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (category && category !== "all") qs.set("category", category);
      if (status) qs.set("status", status);
      if (pageType) qs.set("pageType", pageType);
      qs.set("includeRejected", "0");
      const j = await api<{ ok: boolean; prospects: Prospect[] }>(`/api/backlinks/prospects?${qs.toString()}`);
      setRows(j.prospects ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [category, status, pageType]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedIds = useMemo(() => Object.keys(selected).filter((id) => selected[id]), [selected]);

  async function runFind() {
    setFinding(true);
    setError(null);
    try {
      const j = await api<{ ok: boolean; added: number; serpNotice: string | null }>("/api/backlinks/find-prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      if (!j.ok) throw new Error("Find failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Find failed");
    } finally {
      setFinding(false);
    }
  }

  async function generateOne(id: string) {
    setError(null);
    try {
      await api("/api/backlinks/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectId: id }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generate failed");
    }
  }

  async function bulkGenerate() {
    if (!selectedIds.length) return;
    setBulk(true);
    setError(null);
    try {
      await api("/api/backlinks/bulk-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectIds: selectedIds }),
      });
      setSelected({});
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk generate failed");
    } finally {
      setBulk(false);
    }
  }

  async function rejectRow(id: string) {
    await api(`/api/backlinks/prospects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    await load();
  }

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Prospect finder</h1>
          <p className="mt-1 text-sm text-slate-600">
            Curated seeds + optional SerpAPI discovery. Only prospects scoring ≥6 are stored.
          </p>
        </div>
        <Link href="/dashboard/backlinks" className="text-sm text-violet-700 hover:underline">
          ← Overview
        </Link>
      </div>

      {error ? <ErrorBox message={error} /> : null}

      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Category</span>
          <select
            className="mt-1 block rounded border border-slate-300 px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="tools">tools</option>
            <option value="finance">finance</option>
            <option value="pdf">pdf</option>
            <option value="ai">ai</option>
            <option value="business">business</option>
            <option value="real-estate">real-estate</option>
            <option value="marketing">marketing</option>
            <option value="developer">developer</option>
            <option value="utility">utility</option>
          </select>
        </label>
        <button
          type="button"
          disabled={finding}
          onClick={() => void runFind()}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:text-white"
        >
          {finding ? "Finding…" : "Run discovery"}
        </button>
        <a
          href="/api/backlinks/export"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Export CSV
        </a>
      </div>

      <div className="flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <label className="text-sm">
          <span className="font-medium text-slate-700">Filter status</span>
          <select className="mt-1 block rounded border border-slate-300 px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="new">new</option>
            <option value="content_ready">content_ready</option>
            <option value="sent">sent</option>
            <option value="approved">approved</option>
            <option value="negotiating">negotiating</option>
            <option value="live">live</option>
            <option value="rejected">rejected</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-700">Page type</span>
          <select
            className="mt-1 block rounded border border-slate-300 px-3 py-2 text-sm"
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
          >
            <option value="">All</option>
            <option value="write_for_us">write_for_us</option>
            <option value="resource_page">resource_page</option>
            <option value="tool_directory">tool_directory</option>
          </select>
        </label>
        <button
          type="button"
          disabled={!selectedIds.length || bulk}
          onClick={() => void bulkGenerate()}
          className="self-end rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100 disabled:opacity-40"
        >
          {bulk ? "Generating…" : "Generate selected"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-700">
            <tr>
              <th className="w-8 min-w-8 px-2 py-2">
                <input
                  type="checkbox"
                  aria-label="Select all on page"
                  onChange={(e) => {
                    const on = e.target.checked;
                    const next: Record<string, boolean> = {};
                    for (const r of rows) {
                      if (r.status === "new" && !r.quality_rejection_reason) next[r.id] = on;
                    }
                    setSelected(next);
                  }}
                />
              </th>
              <th className="px-3 py-2">Domain</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Score</th>
              <th className="hidden px-3 py-2 sm:table-cell">DR est.</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-12 text-center">
                  <p className="text-sm text-slate-500">No prospects yet.</p>
                  <button
                    type="button"
                    onClick={() => void runFind()}
                    className="mt-3 text-sm font-medium text-violet-700 hover:underline"
                  >
                    Run discovery →
                  </button>
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                  <td className="w-8 min-w-8 px-2 py-2">
                    {r.status === "new" ? (
                      <input
                        type="checkbox"
                        checked={Boolean(selected[r.id])}
                        onChange={(e) => setSelected((s) => ({ ...s, [r.id]: e.target.checked }))}
                      />
                    ) : null}
                  </td>
                  <td className="max-w-[180px] truncate px-3 py-2 font-medium text-slate-900" title={r.domain}>
                    {r.domain}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{r.category}</td>
                  <td className="px-3 py-2 text-slate-600">{r.page_type}</td>
                  <td className="px-3 py-2 text-slate-800">{r.quality_score}</td>
                  <td className="hidden px-3 py-2 text-slate-800 sm:table-cell">{r.dr_estimate}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        className="text-left text-sm font-medium text-violet-700 hover:text-violet-900 hover:underline disabled:opacity-50"
                        onClick={() => void generateOne(r.id)}
                        disabled={r.status === "rejected" || r.status === "live"}
                      >
                        Generate
                      </button>
                      <button
                        type="button"
                        className="text-left text-sm font-medium text-rose-800 hover:underline"
                        onClick={() => void rejectRow(r.id)}
                      >
                        Reject
                      </button>
                      <a
                        href={r.full_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-violet-700 hover:text-violet-900 hover:underline"
                      >
                        Open
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
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
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-slate-100"}`}>{status}</span>;
}
