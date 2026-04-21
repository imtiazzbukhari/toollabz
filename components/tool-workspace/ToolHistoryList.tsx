"use client";

import { Trash2 } from "lucide-react";
import type { ToolHistoryEntry } from "./tool-workspace-types";

export default function ToolHistoryList({
  history,
  onClear,
}: {
  history: ToolHistoryEntry[];
  onClear: () => void;
}) {
  return (
    <div className="mt-4 border-t border-violet-200/50 pt-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Recent actions</p>
        {history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-white/70 hover:text-slate-700"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Clear
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-sm text-slate-500">No history yet.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((item) => (
            <li
              key={item.id}
              className={`rounded-xl border p-3 ${
                item.error ? "border-rose-200/70 bg-rose-50/70" : "border-violet-200/70 bg-white/65"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-[11px] font-bold uppercase tracking-wide ${
                    item.error ? "text-rose-600" : "text-violet-600"
                  }`}
                >
                  {item.title}
                </p>
                <span className="text-[11px] text-slate-500">{item.at}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-slate-700">{item.value}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
