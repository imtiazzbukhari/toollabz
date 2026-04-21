"use client";

import { forwardRef, memo, useCallback, useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ToolComputationResult } from "@/lib/tools/computation-result";
import { toolGlassPanel } from "@/lib/tool-ui";

function buildCopyText(result: ToolComputationResult): string {
  const lines = [result.title, result.value, ...(result.extra ?? [])];
  return lines.filter(Boolean).join("\n");
}

const ResultBox = forwardRef<HTMLDivElement, { result: ToolComputationResult | null }>(function ResultBox(
  { result },
  ref,
) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    if (!result) return;
    const text = buildCopyText(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [result]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="scroll-mt-24 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
    >
      <div aria-live="polite" aria-atomic="true">
        {!result ? (
          <div className="rounded-2xl border-2 border-dashed border-violet-200/55 bg-white/35 p-6 text-center text-sm text-slate-500 shadow-[0_4px_24px_rgba(99,102,241,0.06)] backdrop-blur-md">
            <p className="font-medium text-slate-600">Result</p>
            <p className="mt-1">Your output will appear here after you run the tool.</p>
          </div>
        ) : (
          <div
            className={`p-6 sm:p-7 ${
              result.error
                ? "rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50/90 to-orange-50/50 shadow-[0_8px_28px_rgba(225,29,72,0.08)] backdrop-blur-md"
                : `${toolGlassPanel} border-violet-300/50 bg-gradient-to-br from-white/55 via-violet-50/40 to-blue-50/35`
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.2em] ${result.error ? "text-rose-600" : "text-violet-600"}`}
              >
                {result.title}
              </p>
              <button
                type="button"
                onClick={() => void onCopy()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-violet-200/80 bg-white/80 px-2.5 py-1 text-xs font-semibold text-violet-800 shadow-sm transition hover:bg-violet-50"
                aria-label={copied ? "Copied to clipboard" : "Copy result to clipboard"}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-2 break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{result.value}</p>
            {!!result.extra?.length && (
              <ul className="mt-4 list-disc space-y-1.5 border-t border-violet-200/40 pt-4 pl-5 text-sm text-slate-700">
                {result.extra.map((item, i) => (
                  <li key={`${item}-${i}`}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default memo(ResultBox);
