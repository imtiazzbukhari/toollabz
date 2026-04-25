import { Loader2 } from "lucide-react";

export default function ActionCard({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions: Array<{ label: string; onClick: () => void; loading?: boolean; disabled?: boolean }>;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/70 p-5 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <h4 className="font-medium">{title}</h4>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            disabled={a.disabled || a.loading}
            onClick={a.onClick}
            className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 text-xs font-semibold transition-all duration-200 hover:scale-[1.03] hover:border-violet-400 hover:shadow-[0_0_16px_rgba(139,92,246,0.35)] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/80"
          >
            {a.loading ? <><Loader2 className="mr-1 inline h-3 w-3 animate-spin" />{a.label}</> : a.label}
          </button>
        ))}
      </div>
    </article>
  );
}
