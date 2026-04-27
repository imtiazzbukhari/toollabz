"use client";

import { useEffect } from "react";

/**
 * Development-only: logs viewport width and flags common overflow risks.
 * Does not render UI.
 */
export default function ResponsiveTestWrapper() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const log = () => {
      const w = window.innerWidth;
      const sw = document.documentElement.scrollWidth;
      if (sw > w + 2) {
        console.warn("[responsive-test] Horizontal overflow", { innerWidth: w, scrollWidth: sw });
      } else {
        console.info("[responsive-test] viewport", w);
      }
    };
    log();
    window.addEventListener("resize", log);
    return () => window.removeEventListener("resize", log);
  }, []);
  return null;
}
