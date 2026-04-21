"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ToolListingPreview } from "@/lib/tools/tool-listing";
import {
  DIRECTORY_POPULAR_SLUGS,
  DIRECTORY_PREVIEW_LIMIT,
  DIRECTORY_SECTIONS,
  getDirectoryGroup,
} from "@/lib/tools/directory-groups";
import ToolCard from "@/components/ToolCard";
import { toolInputClass } from "@/lib/tool-ui";

type Props = {
  tools: ToolListingPreview[];
  totalCount: number;
};

function toolHaystack(tool: ToolListingPreview): string {
  return `${tool.name} ${tool.shortDescription} ${tool.keywords.join(" ")}`.toLowerCase();
}

export default function ToolsDirectoryClient({ tools, totalCount }: Props) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const initialQ = searchParams.get("q");
    if (initialQ && initialQ !== query) {
      setQuery(initialQ);
    }
  }, [searchParams, query]);

  const normalized = query.trim().toLowerCase();

  const popularTools = useMemo(() => {
    const map = new Map(tools.map((t) => [t.slug, t]));
    return DIRECTORY_POPULAR_SLUGS.map((slug) => map.get(slug)).filter(Boolean) as ToolListingPreview[];
  }, [tools]);

  const matchingTools = useMemo(() => {
    if (!normalized) return null;
    return tools.filter((t) => toolHaystack(t).includes(normalized));
  }, [tools, normalized]);

  const sections = useMemo(() => {
    return DIRECTORY_SECTIONS.map((meta) => ({
      ...meta,
      tools: tools
        .filter((t) => getDirectoryGroup(t) === meta.id)
        .slice(0, DIRECTORY_PREVIEW_LIMIT),
    }));
  }, [tools]);

  return (
    <>
      <div className="relative mt-6 max-w-xl">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools by name or keyword…"
          className={`${toolInputClass} pl-10`}
          aria-label="Search tools"
          autoComplete="off"
        />
      </div>

      <p className="mt-3 text-sm font-medium text-slate-500">
        {matchingTools ? (
          <>
            Showing <span className="text-violet-700">{matchingTools.length}</span> match
            {matchingTools.length === 1 ? "" : "es"} of {totalCount} tools
          </>
        ) : (
          <>
            <span className="text-violet-700">{totalCount}</span> tools across eight categories  -  type to filter.
          </>
        )}
      </p>

      {matchingTools ? (
        <section className="mt-10" aria-label="Search results">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Search results</h2>
          {matchingTools.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">Nothing matched. Try a shorter word or browse the categories below.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matchingTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} showThumbnail={false} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="mt-10" aria-labelledby="popular-tools-heading">
            <h2 id="popular-tools-heading" className="text-xl font-bold text-slate-900 sm:text-2xl">
              Popular tools
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Fast starting points - salary, loans, paychecks, and ROI - used all the time in job offers and side projects.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popularTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} showThumbnail={false} />
              ))}
            </div>
          </section>

          <div className="mt-14 space-y-14">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={`section-${section.id}`}>
                <div className="max-w-3xl">
                  <h2 id={`section-${section.id}`} className="text-xl font-bold text-slate-900 sm:text-2xl">
                    <Link href={section.href} className="transition hover:text-violet-800">
                      {section.heading}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.description}</p>
                  <p className="mt-2 text-sm">
                    <Link
                      href={section.href}
                      className="font-medium text-violet-700 underline-offset-2 hover:underline"
                    >
                      View all {section.title.toLowerCase()} →
                    </Link>
                  </p>
                </div>
                {section.tools.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">No tools in this group yet.</p>
                ) : (
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {section.tools.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} showThumbnail={false} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </>
  );
}
