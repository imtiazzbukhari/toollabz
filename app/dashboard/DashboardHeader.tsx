"use client";

import Link from "next/link";
import { LineChart, Link2 } from "lucide-react";

function NavLink({
  href,
  icon,
  label,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 font-medium text-slate-700 transition-colors hover:text-violet-700"
    >
      <span className="text-violet-600">{icon}</span>
      {label}
      {badge != null && badge > 0 ? (
        <span className="rounded-full bg-violet-600 px-2 py-0.5 text-xs font-semibold text-white">{badge}</span>
      ) : null}
    </Link>
  );
}

export default function DashboardHeader({ contentReady }: { contentReady: number }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/dashboard" className="text-lg font-semibold text-slate-900 hover:text-violet-700">
            Toollabz Dashboard
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <NavLink
              href="/dashboard/content-engine"
              icon={<LineChart className="h-4 w-4" aria-hidden />}
              label="Content Engine"
            />
            <NavLink
              href="/dashboard/backlinks"
              icon={<Link2 className="h-4 w-4" aria-hidden />}
              label="Backlink Outreach"
              badge={contentReady}
            />
          </nav>
        </div>
        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-violet-700">
          ← Site home
        </Link>
      </div>
    </header>
  );
}
