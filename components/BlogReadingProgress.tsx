"use client";

import { useEffect, useState } from "react";
import { event } from "@/lib/analytics/gtag";

/** Thin scroll progress bar (no layout shift; fixed height). */
export default function BlogReadingProgress({ postSlug }: { postSlug?: string }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.documentElement;
    const tracked = new Set<number>();
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const nextPct = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      setPct(nextPct);
      if (!postSlug) return;
      const scrolled = nextPct * 100;
      [25, 50, 75, 100].forEach((milestone) => {
        if (scrolled >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone);
          event("blog_scroll_depth", {
            event_category: "Blog Engagement",
            post_slug: postSlug,
            depth_percentage: milestone,
          });
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [postSlug]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-violet-100/90"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct * 100)}
      aria-label="Reading progress"
    >
      <div className="h-full bg-gradient-to-r from-violet-600 to-blue-500" style={{ width: `${pct * 100}%` }} />
    </div>
  );
}
