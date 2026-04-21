import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools/types";
import { DIRECTORY_SECTIONS, type DirectoryGroupId } from "@/lib/tools/directory-groups";
import { toolGlassPanel } from "@/lib/tool-ui";

type Props = {
  tools: readonly ToolDefinition[];
  /** Current directory hub (for cross-links to sibling hubs). */
  currentGroup: DirectoryGroupId;
};

export default function CategoryToolSpotlights({ tools, currentGroup }: Props) {
  const picks = tools.slice(0, 10);
  const others = DIRECTORY_SECTIONS.filter((s) => s.id !== currentGroup).slice(0, 5);

  return (
    <section className={`mb-10 p-6 sm:p-8 ${toolGlassPanel}`} aria-labelledby="category-spotlights-heading">
      <h2 id="category-spotlights-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
        Strong picks in this category
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
        Use these direct links to jump into individual tools (each opens the same Toollabz layout you already use). For
        adjacent workflows, also browse{" "}
        {others.map((s, i) => (
          <span key={s.id}>
            {i > 0 ? ", " : null}
            <Link href={s.href} className="font-medium text-violet-700 underline-offset-2 hover:underline">
              {s.title}
            </Link>
          </span>
        ))}
        .
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700 sm:text-base">
        {picks.map((t) => (
          <li key={t.slug}>
            <Link href={`/tools/${t.slug}`} className="font-medium text-violet-800 underline-offset-2 hover:underline">
              {t.name}
            </Link>
            <span className="text-slate-600"> - {t.shortDescription}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-slate-600">
        <Link href="/tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          Open the full tools directory
        </Link>{" "}
        to search every calculator, including items not listed in this short comparison list.
      </p>
    </section>
  );
}
