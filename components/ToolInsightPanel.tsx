import type { ToolPageInsight } from "@/lib/tools/tool-insights-types";

export default function ToolInsightPanel({ insight }: { insight: ToolPageInsight | null }) {
  if (!insight) return null;

  return (
    <div className="mt-4 space-y-3 border-t border-violet-200/50 pt-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Quick answer</p>
        <p className="mt-1 text-sm font-medium leading-snug text-slate-900">{insight.quickAnswer}</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-700">{insight.explain}</p>
      <div className="rounded-xl border border-violet-200/60 bg-white/60 px-3 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Example</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-800">{insight.example}</p>
      </div>
      {insight.insights.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Insights</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-snug text-slate-700">
            {insight.insights.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="shrink-0 text-violet-500" aria-hidden>
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
