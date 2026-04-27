"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { Loader2, Sparkles, Ban, Download } from "lucide-react";
import { backlinksFetch } from "./backlinks-fetch";
import { backlinksContentGeneratorPath } from "./backlinks-routes";

type Prospect = {
  id: string;
  domain: string;
  category: string;
  page_type: string;
  quality_score: number;
  status: string;
  full_url: string;
};

const CATEGORIES = ["finance", "pdf", "ai", "business", "real-estate", "tools", "marketing", "developer", "utility"] as const;

function statusBadge(status: string) {
  const map: Record<string, string> = {
    new: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
    content_ready: "bg-violet-200 text-violet-900 dark:bg-violet-900 dark:text-violet-100",
    sent: "bg-sky-200 text-sky-900 dark:bg-sky-900 dark:text-sky-100",
    approved: "bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100",
    rejected: "bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100",
    live: "bg-cyan-200 text-cyan-900 dark:bg-cyan-900 dark:text-cyan-100",
  };
  return map[status] ?? "bg-slate-200 text-slate-800";
}

export default function ProspectFinderClient() {
  const pathname = usePathname();
  const genHref = backlinksContentGeneratorPath(pathname);
  const [category, setCategory] = useState<string>("finance");
  const [filterCat, setFilterCat] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPageType, setFilterPageType] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (filterCat) p.set("category", filterCat);
    if (filterStatus) p.set("status", filterStatus);
    if (filterPageType) p.set("pageType", filterPageType);
    if (filterStatus === "rejected") p.set("includeRejected", "1");
    return p.toString();
  }, [filterCat, filterStatus, filterPageType]);

  const { data, mutate, isLoading } = useSWR(`/api/backlinks/prospects?${qs}`, (url) =>
    backlinksFetch<{ prospects: Prospect[] }>(url),
  );

  const prospects = data?.prospects ?? [];

  async function runFind() {
    setBusy(true);
    setNotice(null);
    try {
      const res = await backlinksFetch<{ added?: number; skipped?: number; serpNotice?: string | null }>(
        "/api/backlinks/find-prospects",
        { method: "POST", body: JSON.stringify({ category }) },
      );
      setNotice(
        `Added ${res.added ?? 0}, skipped ${res.skipped ?? 0}. ${res.serpNotice ?? ""}`.trim(),
      );
      await mutate();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Find failed");
    } finally {
      setBusy(false);
    }
  }

  async function generateOne(id: string) {
    setBusy(true);
    try {
      await backlinksFetch("/api/backlinks/generate-content", { method: "POST", body: JSON.stringify({ prospectId: id }) });
      await mutate();
    } finally {
      setBusy(false);
    }
  }

  async function rejectOne(id: string) {
    await backlinksFetch(`/api/backlinks/prospects/${id}`, { method: "PATCH", body: JSON.stringify({ status: "rejected" }) });
    await mutate();
  }

  async function bulkGenerate() {
    const ids = prospects.filter((p) => p.status === "new" && p.quality_score >= 7).slice(0, 5).map((p) => p.id);
    if (!ids.length) return;
    setBusy(true);
    try {
      await backlinksFetch("/api/backlinks/bulk-generate", { method: "POST", body: JSON.stringify({ prospectIds: ids }) });
      await mutate();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Prospect finder</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Curated seeds always run; SerpAPI expands results when <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">SERPAPI_KEY</code>{" "}
          is set. Only prospects scoring ≥6 are listed by default.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/20 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-48 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void runFind()}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Run discovery
        </button>
        <a
          href="/api/backlinks/export"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:text-slate-100"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </a>
        <button
          type="button"
          disabled={busy}
          onClick={() => void bulkGenerate()}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-violet-300 px-4 py-2.5 text-sm font-semibold text-violet-800 dark:border-violet-700 dark:text-violet-200"
        >
          <Sparkles className="h-4 w-4" />
          Generate all (max 5)
        </button>
        <Link href={genHref} className="text-sm font-semibold text-violet-700 underline-offset-2 hover:underline dark:text-violet-300">
          Open generator →
        </Link>
      </div>
      {notice ? <p className="text-sm text-slate-700 dark:text-slate-300">{notice}</p> : null}

      <div className="flex flex-wrap gap-3 rounded-2xl border border-white/20 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-900/60">
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
        >
          <option value="">All statuses</option>
          <option value="new">new</option>
          <option value="content_ready">content_ready</option>
          <option value="sent">sent</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="live">live</option>
        </select>
        <select
          value={filterPageType}
          onChange={(e) => setFilterPageType(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
        >
          <option value="">All page types</option>
          <option value="write_for_us">write_for_us</option>
          <option value="resource_page">resource_page</option>
          <option value="tool_directory">tool_directory</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/80 shadow-inner dark:border-slate-800 dark:bg-slate-900/80">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Domain</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Page type</th>
              <th className="px-3 py-2">Score</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : prospects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  No prospects match filters.
                </td>
              </tr>
            ) : (
              prospects.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{p.domain}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{p.category}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{p.page_type}</td>
                  <td className="px-3 py-2 font-semibold">{p.quality_score}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy || p.status !== "new" || p.quality_score < 7}
                        title={p.quality_score < 7 ? "Quality gate: score must be ≥7 to generate" : undefined}
                        onClick={() => void generateOne(p.id)}
                        className="rounded-lg bg-violet-600 px-2 py-1 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Generate
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void rejectOne(p.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-800 dark:border-rose-700 dark:text-rose-200"
                      >
                        <Ban className="h-3 w-3" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
