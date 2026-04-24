"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const WebVitalsReporter = dynamic(() => import("@/components/WebVitalsReporter"), { ssr: false });
const GaRouteTracker = dynamic(() => import("@/components/GaRouteTracker"), { ssr: false });
const BehaviorTracker = dynamic(() => import("@/components/BehaviorTracker"), { ssr: false });

/**
 * Loads analytics observers after hydration so the server HTML stays lean
 * for crawlers (no visual change).
 */
export default function DeferredClientObservers() {
  return (
    <>
      <WebVitalsReporter />
      <Suspense fallback={null}>
        <GaRouteTracker />
      </Suspense>
      <BehaviorTracker />
    </>
  );
}
