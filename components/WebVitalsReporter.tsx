"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Logs Core Web Vitals in development. In production, POSTs JSON to
 * NEXT_PUBLIC_WEB_VITALS_ENDPOINT when set (e.g. your analytics ingest).
 */
export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      console.info("[web-vitals]", metric.name, Math.round(metric.value * 10) / 10, metric.rating);
      return;
    }
    const url = process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT;
    if (!url) return;
    const payload = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
      } else {
        void fetch(url, { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true });
      }
    } catch {
      /* ignore */
    }
  });
  return null;
}
