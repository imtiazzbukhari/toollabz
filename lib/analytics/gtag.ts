/**
 * Google Analytics 4 via gtag.js (browser only).
 *
 * Env: NEXT_PUBLIC_GA_ID — measurement ID (e.g. G-XXXXXXXXXX).
 */

export const GA_TRACKING_ID = (
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
  process.env.NEXT_PUBLIC_GA_ID ??
  ""
).trim();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * SPA / App Router: send a virtual page view after navigation.
 * @param url Path + optional query (e.g. /tools/loan-calculator?q=1)
 */
export function pageview(url: string): void {
  if (typeof window === "undefined" || !GA_TRACKING_ID) return;
  const path = url.startsWith("/") ? url : `/${url}`;
  window.gtag?.("config", GA_TRACKING_ID, {
    page_path: path,
    page_location: window.location.href,
  });
}

/**
 * Custom GA4 event.
 */
export function event(action: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !GA_TRACKING_ID) return;
  window.gtag?.("event", action, params ?? {});
}

export function trackToolUsed(slug: string, toolName: string, toolCategory?: string): void {
  event("tool_used", {
    tool_slug: slug,
    tool_name: toolName,
    tool_category: toolCategory ?? "",
    calculation_type: "tool_open",
  });
}

export function trackCalculation(slug: string, toolCategory?: string): void {
  event("tool_calculation", { tool_slug: slug, tool_category: toolCategory ?? "" });
}

export function trackGenerate(slug: string, toolCategory?: string): void {
  event("tool_generate", { tool_slug: slug, tool_category: toolCategory ?? "" });
}

export function trackNewsletterSignup(source: string): void {
  event("newsletter_signup", { signup_source: source });
}

export function trackPdfToolUsed(slug: string): void {
  event("pdf_tool_used", { tool_slug: slug });
}

export function trackWebVital(metric: { name: string; value: number; rating: string; id: string }): void {
  event("web_vitals", {
    metric_name: metric.name,
    metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    metric_rating: metric.rating,
    metric_id: metric.id,
  });
}
