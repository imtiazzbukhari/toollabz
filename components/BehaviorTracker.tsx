"use client";

import { useEffect } from "react";

function scrollDepth(): number {
  const el = document.documentElement;
  const scrollHeight = el.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return 1;
  return Math.min(1, window.scrollY / scrollHeight);
}

function postPayload(body: Record<string, unknown>) {
  const payload = JSON.stringify(body);
  const url = "/api/behavior/collect";
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
      return;
    }
  } catch {
    /* fall through */
  }
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

function inferEntryKeyword(): string | undefined {
  try {
    const own = new URLSearchParams(window.location.search);
    const direct = own.get("utm_term") || own.get("keyword") || own.get("q");
    if (direct) return direct.slice(0, 80);
    if (!document.referrer) return undefined;
    const ref = new URL(document.referrer);
    const q = ref.searchParams.get("q") || ref.searchParams.get("p") || ref.searchParams.get("query");
    return q?.slice(0, 80) || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Max scroll, visible-tab dwell, last `[data-content-section]` in view.
 * Enable with `NEXT_PUBLIC_TOOLLABZ_BEHAVIOR_INGEST_KEY` === server `TOOLLABZ_BEHAVIOR_INGEST_KEY`.
 */
export default function BehaviorTracker() {
  const ingestKey = process.env.NEXT_PUBLIC_TOOLLABZ_BEHAVIOR_INGEST_KEY?.trim();

  useEffect(() => {
    if (!ingestKey) return;
    const path = window.location.pathname;
    if (!path.startsWith("/blog/") && !path.startsWith("/tools/")) return;

    let maxScroll = 0;
    let activeMs = 0;
    let lastSection: string | undefined;
    let toolClicks = 0;
    let conversionEvents = 0;
    const entryKeyword = inferEntryKeyword();
    let lastMark = performance.now();

    const accrueVisible = () => {
      if (document.visibilityState !== "visible") return;
      const now = performance.now();
      activeMs += Math.min(120_000, now - lastMark);
      lastMark = now;
    };

    const onScroll = () => {
      accrueVisible();
      maxScroll = Math.max(maxScroll, scrollDepth());
    };

    const sections = [...document.querySelectorAll<HTMLElement>("[data-content-section]")];
    const ratios = new Map<string, number>();
    const io =
      sections.length > 0
        ? new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                const id = (e.target as HTMLElement).dataset.contentSection;
                if (!id) continue;
                ratios.set(id, e.intersectionRatio);
              }
              let best = "";
              let bestR = 0;
              for (const [id, r] of ratios) {
                if (r > bestR) {
                  bestR = r;
                  best = id;
                }
              }
              if (best && bestR >= 0.25) lastSection = best;
            },
            { root: null, threshold: [0, 0.25, 0.5, 0.75, 1] },
          )
        : null;
    for (const el of sections) io?.observe(el);

    const flush = () => {
      accrueVisible();
      maxScroll = Math.max(maxScroll, scrollDepth());
      postPayload({
        ingestKey,
        events: [
          {
            path,
            maxScroll,
            activeMs: Math.min(600_000, Math.floor(activeMs)),
            lastSection,
            entryKeyword,
            toolClicks,
            conversionEvents,
            segmentHint:
              maxScroll < 0.35 && activeMs < 20_000
                ? "scanner"
                : maxScroll > 0.65 && activeMs > 45_000
                  ? "ready_to_act"
                  : "researcher",
          },
        ],
      });
    };

    const onDocClick = (ev: MouseEvent) => {
      const t = ev.target as HTMLElement | null;
      if (!t) return;
      const a = t.closest("a[href]") as HTMLAnchorElement | null;
      if (a?.getAttribute("href")?.startsWith("/tools/")) toolClicks += 1;
      if (t.closest("[data-conversion-event]")) conversionEvents += 1;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const interval = window.setInterval(() => {
      accrueVisible();
      maxScroll = Math.max(maxScroll, scrollDepth());
    }, 5000);

    const onVis = () => {
      if (document.visibilityState === "hidden") {
        flush();
      } else {
        lastMark = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", flush);
    document.addEventListener("click", onDocClick, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("click", onDocClick);
      io?.disconnect();
    };
  }, [ingestKey]);

  return null;
}
