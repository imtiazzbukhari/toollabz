export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-2 rounded-full bg-violet-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">{value}/{max}</p>
    </div>
  );
}
