import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toolGlassCard } from "@/lib/tool-ui";

type Props = {
  href: string;
  title: string;
  description: string;
  ctaLabel?: string;
};

/** Styled in-article CTA linking to a live Toollabz calculator or utility. */
export default function BlogToolCallout({ href, title, description, ctaLabel = "Open the free tool" }: Props) {
  return (
    <aside
      className={`not-prose my-10 flex flex-col gap-3 border border-violet-300/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${toolGlassCard}`}
      aria-label="Tool recommendation"
    >
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-600">Try it on Toollabz</p>
        <p className="mt-1 text-lg font-bold text-slate-900">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
      <Link
        href={href}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </aside>
  );
}
