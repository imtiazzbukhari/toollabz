"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { ArrowRight, Link2, Mail, Radar, Sparkles } from "lucide-react";
import { backlinksFetch } from "./backlinks-fetch";
import { backlinksContentGeneratorPath, backlinksOutreachPath } from "./backlinks-routes";

type ActivityEntry = {
  id: string;
  ts: string;
  kind: string;
  message: string;
  prospect_id: string | null;
  created_at: string;
};

type Stats = {
  prospectsThisMonth?: number;
  sentThisMonth?: number;
  liveThisMonth?: number;
  contentReady?: number;
  responseRate?: number;
  approvalRate?: number;
  anthropicConfigured?: boolean;
  serpConfigured?: boolean;
  totalProspects?: number;
  totalLive?: number;
  avgSentToLiveDays?: number;
  bestPerformingContentType?: string;
  activity?: ActivityEntry[];
};

function MetricSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 h-3 w-24 rounded bg-slate-200" />
      <div className="h-8 w-16 rounded bg-slate-200" />
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
      <p className="text-sm font-medium text-rose-900">Something went wrong</p>
      <p className="mt-1 text-sm text-rose-700">{message}</p>
    </div>
  );
}

export default function BacklinksOverviewClient() {
  const pathname = usePathname();
  const base = pathname.startsWith("/dashboard/backlinks") ? "/dashboard/backlinks" : "/seo-growth-console/backlinks";
  const genHref = backlinksContentGeneratorPath(pathname);
  const outreachHref = backlinksOutreachPath(pathname);
  const { data, error, isLoading } = useSWR("/api/backlinks/stats", (url) => backlinksFetch<Stats & { ok?: boolean }>(url));

  const prospects = data?.prospectsThisMonth ?? 0;
  const sent = data?.sentThisMonth ?? 0;
  const live = data?.liveThisMonth ?? 0;
  const ready = data?.contentReady ?? 0;
  const progress = Math.min(100, Math.round((live / 8) * 100));

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Backlink outreach</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Find sites that may link to Toollabz, draft personalized outreach with AI, send from your own inbox (no bulk
          email from this app), then log replies and verified live links. Discovery can use SerpAPI where configured.
        </p>
      </header>

      <div className="space-y-3">
        {!data?.anthropicConfigured ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-snug text-amber-950">
            Add <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[13px]">ANTHROPIC_API_KEY</code> for AI
            content generation.
          </p>
        ) : null}
        {!data?.serpConfigured ? (
          <p className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-snug text-sky-950">
            Add <code className="rounded bg-sky-100 px-1.5 py-0.5 font-mono text-[13px]">SERPAPI_KEY</code> for Google
            prospect discovery (optional).
          </p>
        ) : null}
        {error ? <ErrorBox message={String((error as Error).message)} /> : null}
        <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm leading-snug text-violet-950">
          <span className="font-semibold text-violet-900">Rules (enforced in code):</span> DR 30+ estimates · Max 8 live
          links/month · Max 2 live links/domain · Natural anchors only · Manual send required (no bulk SMTP).
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
          : [
              { label: "Prospects (month)", value: prospects, icon: Radar },
              { label: "Content ready", value: ready, icon: Sparkles },
              { label: "Sent (month)", value: sent, icon: Mail },
              { label: "Live (month)", value: live, icon: Link2 },
            ].map((c) => (
              <div key={c.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <c.icon className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
                  {c.label}
                </div>
                <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{c.value}</p>
              </div>
            ))}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Monthly live links target</h2>
        <p className="mt-1 text-sm text-slate-600">Goal: 8 verified live links per month (rolling).</p>
        <div className="mt-4 h-3.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full min-w-0 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Response rate", value: `${data?.responseRate ?? 0}%` },
            { label: "Approval rate", value: `${data?.approvalRate ?? 0}%` },
            { label: "Total prospects", value: String(data?.totalProspects ?? 0) },
            { label: "Total live", value: String(data?.totalLive ?? 0) },
            { label: "Avg sent → live", value: `${data?.avgSentToLiveDays ?? 0}d` },
            { label: "Best content type", value: data?.bestPerformingContentType ?? "—" },
          ].map((row) => (
            <div key={row.label} className="rounded-md border border-slate-100 bg-slate-50/80 px-3 py-2">
              <dt className="text-xs font-medium text-slate-500">{row.label}</dt>
              <dd className="mt-0.5 text-sm font-semibold text-slate-900">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {data?.activity && data.activity.length > 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Recent activity</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-800">
            {data.activity.slice(0, 12).map((a) => (
              <li key={a.id} className="border-b border-slate-100 pb-2 last:border-0">
                <span className="text-xs text-slate-600">{a.ts.slice(0, 19)}</span> · {a.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-3">
        <Link
          href={`${base}/prospect-finder`}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          Find prospects <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={genHref}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-violet-300 hover:bg-slate-50"
        >
          Generate content
        </Link>
        <Link
          href={outreachHref}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-violet-300 hover:bg-slate-50"
        >
          Outreach queue <Mail className="h-4 w-4" aria-hidden />
        </Link>
        <a
          href="/api/backlinks/export"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm"
        >
          Export CSV
        </a>
      </section>
    </div>
  );
}
