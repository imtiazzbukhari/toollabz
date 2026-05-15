import Link from "next/link";
import type { ToolListingPreview } from "@/lib/tools/tool-listing";
import { getToolCardIcon } from "@/utils/icons";
import { getToolCategoryIconGradient } from "@/utils/tool-category-visual";

export default function ToolCard({ tool }: { tool: ToolListingPreview }) {
  const Icon = getToolCardIcon(tool);
  const iconTone = getToolCategoryIconGradient(tool.category);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex h-full min-h-[9.5rem] flex-col rounded-2xl border border-white/50 bg-white/75 p-4 shadow-[0_8px_20px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(76,29,149,0.12)] sm:p-5"
    >
      <div
        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconTone} text-white transition duration-300 group-hover:shadow-[0_0_22px_rgba(99,102,241,0.35)]`}
      >
        <Icon className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="mt-3 flex min-h-0 flex-1 flex-col">
        <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{tool.name}</span>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-snug text-slate-600">{tool.shortDescription}</p>
      </div>
    </Link>
  );
}
