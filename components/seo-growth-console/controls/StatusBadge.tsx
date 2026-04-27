export default function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls =
    s === "done" || s === "sent" || s === "replied" || s === "published" || s === "link_acquired" || s === "success"
      ? "bg-emerald-500/15 text-emerald-600"
      : s === "failed"
        ? "bg-rose-500/15 text-rose-600"
      : s === "neutral"
        ? "bg-slate-400/20 text-slate-600 dark:text-slate-300"
      : s === "pending" || s === "draft" || s === "pr"
        ? "bg-amber-500/15 text-amber-800 dark:text-amber-200"
        : "bg-slate-300/40 text-slate-700 dark:bg-slate-700/60 dark:text-slate-300";
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${cls}`}>{status}</span>;
}
