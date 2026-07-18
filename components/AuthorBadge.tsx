import Link from "next/link";

type AuthorBadgeProps = {
  name: string;
  role: string;
  lastReviewed: string;
  profileHref?: string;
  className?: string;
};

export default function AuthorBadge({
  name,
  role,
  lastReviewed,
  profileHref,
  className = "",
}: AuthorBadgeProps) {
  return (
    <div
      className={`rounded-2xl border border-violet-200/70 bg-white/80 p-4 text-sm text-slate-700 shadow-sm ${className}`}
    >
      <p className="font-semibold text-slate-900">
        Reviewed by{" "}
        {profileHref ? (
          <Link href={profileHref} className="text-violet-800 underline-offset-2 hover:underline">
            {name}
          </Link>
        ) : (
          name
        )}
      </p>
      <p className="mt-1">
        {role} | Last reviewed {lastReviewed}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        See{" "}
        <Link href="/methodology" className="font-medium text-violet-800 underline-offset-2 hover:underline">
          methodology
        </Link>{" "}
        and{" "}
        <Link href="/editorial-policy" className="font-medium text-violet-800 underline-offset-2 hover:underline">
          editorial policy
        </Link>
        .
      </p>
    </div>
  );
}
