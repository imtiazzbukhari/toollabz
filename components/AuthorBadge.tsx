type AuthorBadgeProps = {
  name: string;
  role: string;
  lastReviewed: string;
  className?: string;
};

export default function AuthorBadge({ name, role, lastReviewed, className = "" }: AuthorBadgeProps) {
  return (
    <div
      className={`rounded-2xl border border-violet-200/70 bg-white/80 p-4 text-sm text-slate-700 shadow-sm ${className}`}
    >
      <p className="font-semibold text-slate-900">Reviewed by {name}</p>
      <p className="mt-1">
        {role} | Last updated {lastReviewed}
      </p>
    </div>
  );
}
