import Link from "next/link";

const TOC_ITEMS: readonly { id: string; label: string }[] = [
  { id: "what-this-tool-does", label: "What is this tool?" },
  { id: "how-to-use", label: "How to use" },
  { id: "tool-guides", label: "Guides" },
  { id: "tool-detailed-guide", label: "Detailed guide" },
  { id: "tool-formula", label: "Formula" },
  { id: "tool-comparison", label: "Compare" },
  { id: "example-usage", label: "Examples" },
  { id: "tool-benefits", label: "Use cases" },
  { id: "tool-features", label: "Features" },
  { id: "common-mistakes", label: "Mistakes" },
  { id: "tool-faqs", label: "FAQs" },
  { id: "related-tools", label: "Related" },
] as const;

/** Lightweight, server-rendered jump list-no client JS. Sticky on large screens. */
export default function ToolPageTocStrip() {
  return (
    <nav
      className="sticky top-0 z-10 -mx-4 mb-6 border-y border-violet-200/50 bg-[#f5f6ff]/95 px-3 py-2 backdrop-blur-sm sm:-mx-6 sm:px-4 lg:top-4"
      aria-label="On this page"
    >
      <p className="mb-1.5 hidden text-[11px] font-semibold uppercase tracking-wide text-violet-800/90 sm:block">On this page</p>
      <ul className="flex max-w-full flex-wrap gap-1.5 sm:gap-2">
        {TOC_ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className="inline-flex rounded-full border border-violet-200/80 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-800 sm:px-3 sm:text-xs"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
