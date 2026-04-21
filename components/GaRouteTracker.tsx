"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_TRACKING_ID, pageview } from "@/lib/analytics/gtag";

/**
 * Sends GA4 page_path on client navigations (App Router does not full reload).
 * Renders nothing; no visual impact.
 */
export default function GaRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_TRACKING_ID) return;
    const q = searchParams?.toString();
    const path = pathname || "/";
    const url = q ? `${path}?${q}` : path;

    if (typeof window !== "undefined" && window.gtag) {
      pageview(url);
      return;
    }

    let attempts = 0;
    const maxAttempts = 80;
    const id = window.setInterval(() => {
      attempts += 1;
      if (typeof window !== "undefined" && window.gtag) {
        pageview(url);
        window.clearInterval(id);
      } else if (attempts >= maxAttempts) {
        window.clearInterval(id);
      }
    }, 200);

    return () => window.clearInterval(id);
  }, [pathname, searchParams]);

  return null;
}
