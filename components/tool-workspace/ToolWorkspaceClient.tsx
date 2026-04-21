"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { ToolDefinition } from "@/lib/tools/types";
import type { ToolComputationResult } from "@/lib/tools/computation-result";
import { trackCalculation, trackGenerate, trackToolUsed } from "@/lib/analytics/gtag";
import ResultBox from "@/components/ResultBox";
import { toolGlassPanel } from "@/lib/tool-ui";
import type { ToolHistoryEntry } from "./tool-workspace-types";
import ToolHistoryList from "./ToolHistoryList";

const CalculatorForm = dynamic(() => import("@/components/CalculatorForm"), {
  ssr: false,
  loading: () => (
    <div
      className={`space-y-5 p-6 sm:p-7 ${toolGlassPanel} animate-pulse`}
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b border-violet-200/40 pb-4">
        <div className="h-9 w-9 rounded-xl bg-violet-200/50" />
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-violet-200/40" />
          <div className="h-4 w-32 rounded bg-violet-100/50" />
        </div>
      </div>
      <div className="h-4 w-2/5 rounded-lg bg-violet-200/40" />
      <div className="h-11 rounded-xl bg-white/50" />
      <div className="h-11 rounded-xl bg-violet-100/40" />
      <div className="h-12 rounded-xl bg-violet-200/35" />
    </div>
  ),
});

const PDFToolPanel = dynamic(() => import("@/components/pdf/PDFToolPanel"), {
  ssr: false,
  loading: () => (
    <div
      className={`space-y-4 p-5 ${toolGlassPanel} animate-pulse`}
      aria-hidden
    >
      <div className="h-4 w-2/5 rounded-lg bg-violet-200/40" />
      <div className="h-11 rounded-xl bg-white/50" />
      <div className="h-11 rounded-xl bg-violet-100/40" />
    </div>
  ),
});

export default function ToolWorkspaceClient({
  tool,
  asideHeader,
  insightPanel,
}: {
  tool: ToolDefinition;
  asideHeader: ReactNode;
  insightPanel: ReactNode;
}) {
  const [result, setResult] = useState<ToolComputationResult | null>(null);
  const [history, setHistory] = useState<ToolHistoryEntry[]>([]);
  const resultRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result) return;
    const el = resultRegionRef.current;
    if (!el) return;

    const id = window.setTimeout(() => {
      const narrow = window.matchMedia("(max-width: 1023px)").matches;
      if (narrow) {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
          inline: "nearest",
        });
      }
      el.focus({ preventScroll: true });
    }, 0);

    return () => window.clearTimeout(id);
  }, [result]);

  const onResult = useCallback(
    (next: ToolComputationResult) => {
      if (!next.error) {
        trackToolUsed(tool.slug, tool.name);
        const isGenerate =
          tool.category === "pdf" || tool.category === "generators" || tool.slug.startsWith("ai-");
        if (isGenerate) {
          trackGenerate(tool.slug);
        } else {
          trackCalculation(tool.slug);
        }
      }
      setResult(next);
      const entry: ToolHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        title: next.title,
        value: next.value,
        error: next.error,
      };
      setHistory((prev) => [entry, ...prev].slice(0, 10));
    },
    [tool.slug, tool.name, tool.category],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      {tool.category === "pdf" ? (
        <PDFToolPanel slug={tool.slug} onResult={onResult} />
      ) : (
        <CalculatorForm tool={tool} onResult={onResult} />
      )}

      <aside className={`p-5 ${toolGlassPanel}`} aria-labelledby="tool-results-heading">
        {asideHeader}
        <ResultBox ref={resultRegionRef} result={result} />
        {insightPanel}
        <ToolHistoryList history={history} onClear={clearHistory} />
      </aside>
    </div>
  );
}
