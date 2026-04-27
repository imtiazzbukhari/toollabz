"use client";

import useSWR from "swr";
import { backlinksFetch } from "./backlinks-fetch";

type Live = {
  id: string;
  source_url: string;
  dr: number | null;
  type: string | null;
  anchor: string | null;
  date_live: string;
};

export default function LiveLinksClient() {
  const { data, isLoading } = useSWR("/api/backlinks/live-links", (u) => backlinksFetch<{ links: Live[] }>(u));
  const links = data?.links ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Live backlinks</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">Verified placements that mention Toollabz on the page HTML.</p>
      <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Source URL</th>
              <th className="px-3 py-2">DR est.</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Date live</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : links.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                  No verified live links yet.
                </td>
              </tr>
            ) : (
              links.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2">
                    <a href={l.source_url} className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300" target="_blank" rel="noreferrer">
                      {l.source_url}
                    </a>
                  </td>
                  <td className="px-3 py-2">{l.dr ?? "—"}</td>
                  <td className="px-3 py-2">{l.type ?? "—"}</td>
                  <td className="px-3 py-2">{l.date_live}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
