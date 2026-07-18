"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "tlz_recent_tools_v1";
const MAX = 6;

type RecentItem = { slug: string; name: string; at: number };

function readRecent(): RecentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentItem[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

function writeRecent(items: RecentItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    /* ignore quota */
  }
}

export function trackRecentTool(slug: string, name: string) {
  if (typeof window === "undefined") return;
  const next = [{ slug, name, at: Date.now() }, ...readRecent().filter((r) => r.slug !== slug)].slice(0, MAX);
  writeRecent(next);
}

export default function RecentlyUsedTools({ currentSlug }: { currentSlug: string }) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    setItems(readRecent().filter((r) => r.slug !== currentSlug));
  }, [currentSlug]);

  if (items.length === 0) return null;

  return (
    <section className="mt-8 rounded-xl border border-violet-100 bg-white/80 p-5" aria-labelledby="recent-tools-heading">
      <h2 id="recent-tools-heading" className="text-lg font-bold text-slate-900">
        Recently used
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/tools/${item.slug}`}
              className="inline-flex rounded-lg border border-violet-200/70 bg-violet-50/50 px-3 py-1.5 font-medium text-violet-800 hover:bg-violet-50"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
