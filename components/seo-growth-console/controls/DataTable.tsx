import type { ReactNode } from "react";

export default function DataTable({
  columns,
  rows,
  emptyMessage,
}: {
  columns: string[];
  rows: Array<Array<ReactNode>>;
  emptyMessage?: string;
}) {
  if (!rows.length) {
    return <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">{emptyMessage ?? "No data yet. Run AI to generate."}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <table className="min-w-full text-sm text-slate-800 dark:text-slate-100">
        <thead className="bg-slate-100 dark:bg-slate-800/90">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-t border-slate-200 bg-white odd:bg-slate-50/90 dark:border-slate-700 dark:bg-slate-900 dark:odd:bg-slate-800/60"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2.5 align-top text-slate-800 dark:text-slate-100">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
