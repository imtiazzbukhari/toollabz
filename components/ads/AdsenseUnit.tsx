"use client";

/**
 * Reusable AdSense display unit wrapper.
 *
 * Insertion points (add when you have real `data-ad-slot` values from AdSense):
 * - Homepage: e.g. `app/page.tsx` — between hero and directory grid (in-content).
 * - Tool workspace: e.g. `components/tool-workspace/ToolWorkspaceClient.tsx` — narrow column (sidebar).
 * - Blog articles: e.g. under first `<h2>` in article body components (in-content).
 *
 * Until `adSlot` is passed, this component renders nothing (no empty placeholders).
 */

import { useEffect, useRef } from "react";
import { ADSENSE_PUBLISHER_ID } from "@/lib/analytics/env";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

/** Layout presets map to common AdSense responsive / placement patterns. */
export type AdsenseUnitVariant = "responsive" | "in-content" | "sidebar";

/** Tailwind-friendly wrappers for consistent spacing when you enable units. */
export const adsenseResponsiveContainerClass = "my-6 w-full min-w-0 max-w-full";
export const adsenseInContentContainerClass = "my-8 w-full min-w-0 max-w-3xl mx-auto";
export const adsenseSidebarContainerClass = "w-full max-w-[300px] shrink-0";

type InsDataAttrs = {
  "data-ad-format"?: "auto";
  "data-full-width-responsive"?: "true" | "false";
};

/**
 * Preset `<ins>` data attributes. Variant mostly guides layout wrappers below;
 * all presets use responsive display unless you swap for a fixed-size unit in AdSense.
 */
export function getAdsenseVariantDataAttrs(variant: AdsenseUnitVariant): InsDataAttrs {
  switch (variant) {
    case "sidebar":
      return { "data-ad-format": "auto", "data-full-width-responsive": "false" };
    case "in-content":
    case "responsive":
    default:
      return { "data-ad-format": "auto", "data-full-width-responsive": "true" };
  }
}

export type AdsenseUnitProps = {
  /** Ad unit slot id from AdSense UI — required for any visual ad. */
  adSlot?: string;
  variant?: AdsenseUnitVariant;
  className?: string;
  /** Extra classes on the outer wrapper (use preset container classes above). */
  wrapperClassName?: string;
  /** Set false to keep a configured slot out of the tree (feature flags). */
  enabled?: boolean;
};

export default function AdsenseUnit({
  adSlot,
  variant = "responsive",
  className,
  wrapperClassName,
  enabled = true,
}: AdsenseUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const didPush = useRef(false);
  const slot = adSlot?.trim() ?? "";

  const dataAttrs = getAdsenseVariantDataAttrs(variant);

  useEffect(() => {
    if (!enabled || !slot) return;
    if (didPush.current) return;
    const el = insRef.current;
    if (!el) return;
    didPush.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      didPush.current = false; // e.g. script blocked; allow retry if effect re-runs
    }
  }, [enabled, slot, variant]);

  if (!enabled || !slot) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      <ins
        ref={insRef}
        className={["adsbygoogle", "block", className].filter(Boolean).join(" ")}
        style={{ display: "block" }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        {...dataAttrs}
      />
    </div>
  );
}
