import Link from "next/link";
import { LineChart, Link2 } from "lucide-react";

export default function DashboardHomePage() {
  return (
    <main className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Internal tools for Toollabz operations and growth.</p>
      </div>
      <div className="grid min-h-[200px] gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/content-engine"
          className="flex min-h-[200px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-300 hover:shadow-md"
        >
          <LineChart className="h-8 w-8 text-violet-600" aria-hidden />
          <h2 className="mt-3 text-lg font-semibold text-slate-900">Content Engine</h2>
          <p className="mt-2 text-sm text-slate-600">Orchestrator, processed tools, PR status, and runner logs.</p>
        </Link>
        <Link
          href="/dashboard/backlinks"
          className="flex min-h-[200px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-300 hover:shadow-md"
        >
          <Link2 className="h-8 w-8 text-violet-600" aria-hidden />
          <h2 className="mt-3 text-lg font-semibold text-slate-900">Backlink Outreach</h2>
          <p className="mt-2 text-sm text-slate-600">Prospect discovery, Claude drafts, manual-send queue, and live link verification.</p>
        </Link>
      </div>
    </main>
  );
}
