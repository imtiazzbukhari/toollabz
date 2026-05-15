"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { Link2, ListFilter, Mail, Radar, Sparkles } from "lucide-react";
import { backlinksBasePath, isDashboardBacklinks } from "./backlinks-routes";

function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function BacklinksSubnav() {
  const pathname = usePathname() ?? "";
  const base = backlinksBasePath(pathname);
  const dash = isDashboardBacklinks(pathname);

  const items = [
    { seg: "", label: "Overview", icon: Link2, badge: false },
    { seg: "/prospect-finder", label: "Prospect Finder", icon: Radar, badge: false },
    { seg: dash ? "/content-generator" : "/generate", label: "Content Generator", icon: Sparkles, badge: true },
    { seg: dash ? "/outreach-manager" : "/outreach", label: "Outreach", icon: Mail, badge: false },
    { seg: "/live-links", label: "Live Links", icon: ListFilter, badge: false },
  ] as const;

  const { data } = useSWR<{ contentReady?: number }>("/api/backlinks/badge", async (url: string) => {
    const res = await fetch(url, { credentials: "include" });
    return (await res.json()) as { contentReady?: number };
  });

  return (
    <nav className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      {items.map((item) => {
        const href = `${base}${item.seg}`;
        const active = pathname === href || (item.seg !== "" && pathname.startsWith(href));
        const Icon = item.icon;
        const badge = item.badge && (data?.contentReady ?? 0) > 0 ? data?.contentReady : null;
        return (
          <Link
            key={href}
            href={href}
            className={cx(
              "relative inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50 hover:text-violet-700",
            )}
          >
            <Icon className={cx("h-4 w-4 shrink-0", active ? "text-white" : "text-violet-600")} aria-hidden />
            {item.label}
            {badge != null && badge > 0 ? (
              <span className="ml-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">{badge}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
