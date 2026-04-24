export default function ControlToggle({
  label,
  enabled,
  disabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  disabled?: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(!enabled)}
      className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 text-sm disabled:opacity-60 dark:border-slate-700"
    >
      {label}
      <span className={`rounded-full px-2 py-1 text-xs ${enabled ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-200 text-slate-500 dark:bg-slate-800"}`}>
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}
