"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronLeft, ChevronRight, Moon, RefreshCw, Search, Sun } from "lucide-react";
import useSWR from "swr";
import SignOutButton from "@/app/seo-growth-console/SignOutButton";
import { seoConsoleNavItems } from "./nav";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : `Failed: ${url}`);
  return data;
};

function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

export default function SeoGrowthConsoleLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { data, mutate } = useSWR("/api/seo-console/control", fetcher, { refreshInterval: 30000 });
  const config = (data?.config ?? {}) as Record<string, unknown>;

  return (
    <div className={darkMode ? "dark bg-slate-950 text-slate-100" : "bg-gradient-to-b from-slate-100 via-slate-50 to-white text-slate-900"}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1700px] gap-4 p-4">
        <aside className={cx("sticky top-4 h-[calc(100vh-2rem)] rounded-3xl border border-white/10 bg-white/70 p-3 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80", sidebarCollapsed ? "w-[92px]" : "w-[260px]")}>
          <div className="mb-5 flex items-center justify-between px-2">
            {!sidebarCollapsed ? <p className="text-sm font-semibold tracking-wide">AI Control Center</p> : null}
            <button type="button" onClick={() => setSidebarCollapsed((v) => !v)} className="rounded-xl border border-slate-300/50 p-2 dark:border-slate-700">
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
          <nav className="space-y-1">
            {seoConsoleNavItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cx(
                    "relative z-10 flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm",
                    active
                      ? "bg-violet-600 text-white shadow-xl shadow-violet-500/30"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed ? <span>{label}</span> : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <header className="sticky top-4 z-20 rounded-3xl border border-white/10 bg-white/70 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl border border-slate-200/60 bg-slate-50/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/45">
                <Search className="h-4 w-4 text-slate-500" />
                <input aria-label="Search dashboard" placeholder="Search opportunities, prompts, clusters..." className="w-full bg-transparent text-sm outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <span className={cx("rounded-full px-3 py-1 text-xs font-medium", config.aiEnabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700")}>
                  {config.aiEnabled ? "AI running" : "AI idle"}
                </span>
                <button type="button" className="rounded-xl border border-slate-300/60 p-2 dark:border-slate-700"><Bell className="h-4 w-4" /></button>
                <button type="button" onClick={() => setDarkMode((v) => !v)} className="rounded-xl border border-slate-300/60 p-2 dark:border-slate-700">
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button type="button" onClick={() => void mutate()} className="rounded-xl border border-slate-300/60 p-2 dark:border-slate-700"><RefreshCw className="h-4 w-4" /></button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" />
                <SignOutButton />
              </div>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
