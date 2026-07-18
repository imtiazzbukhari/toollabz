"use client";

import { useEffect, useState } from "react";
import { trackRecentTool } from "./RecentlyUsedTools";

export default function ToolSessionActions({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const [shareState, setShareState] = useState<"idle" | "copied" | "shared">("idle");

  useEffect(() => {
    trackRecentTool(slug, name);
  }, [slug, name]);

  const share = async () => {
    const url = `${window.location.origin}/tools/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url, text: `Toollabz — ${name}` });
        setShareState("shared");
      } else {
        await navigator.clipboard.writeText(url);
        setShareState("copied");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setShareState("copied");
      } catch {
        setShareState("idle");
      }
    }
    window.setTimeout(() => setShareState("idle"), 2000);
  };

  const printPage = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={share}
        className="inline-flex rounded-xl border border-violet-300/60 bg-white/70 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 focus-visible:ring-offset-2"
        aria-live="polite"
      >
        {shareState === "copied" ? "Link copied" : shareState === "shared" ? "Shared" : "Share"}
      </button>
      <button
        type="button"
        onClick={printPage}
        className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 focus-visible:ring-offset-2"
      >
        Print / Save PDF
      </button>
    </div>
  );
}
