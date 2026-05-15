import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
      <p className="leading-7 text-slate-700">
        A sane PDF workflow is less about which logo sits on the landing page and more about an ordered pipeline: normalize
        sources, assemble page order, compress for the delivery channel, archive a lossless sibling if compliance demands it, and
        document the preset so your future self does not play forensic archaeologist.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="pipeline">
        A five-step pipeline freelancers actually follow
      </h2>
      <ol className="mt-3 list-decimal space-y-3 pl-6 text-slate-700">
        <li>
          <strong>Ingest</strong> - collect Word exports, slide PDFs, scanner apps, and signed scans into one folder with versioned
          filenames.
        </li>
        <li>
          <strong>Normalize</strong> - print-to-PDF only when fonts explode; otherwise prefer native exports to keep vectors.
        </li>
        <li>
          <strong>Assemble</strong> - merge appendices, insert cover page, confirm page numbering matches the table of contents.
        </li>
        <li>
          <strong>Targeted split</strong> - extract client-only pages before sending externally.
        </li>
        <li>
          <strong>Compress + verify</strong> - choose presets per channel; open in Chrome + Acrobat Reader if stakes are high.
        </li>
      </ol>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="compare">
        Free stacks compared (philosophy, not brand boxing)
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm text-slate-800">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Stack</th>
              <th className="px-4 py-3">Wins</th>
              <th className="px-4 py-3">Trade-offs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-medium">Browser-native tools</td>
              <td className="px-4 py-3">No installs, fast for ad hoc merges</td>
              <td className="px-4 py-3">Policy limits on classified docs</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Desktop author tools</td>
              <td className="px-4 py-3">Rich preflight, batch actions</td>
              <td className="px-4 py-3">License cost + update churn</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">CLI automation</td>
              <td className="px-4 py-3">Repeatable CI pipelines</td>
              <td className="px-4 py-3">Engine quirks need test PDFs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="cluster">
        Deep dives on Toollabz
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Quality-sensitive merges belong with{" "}
        <Link href="/blog/merge-pdf-without-losing-quality-metadata-fonts" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          merge without losing quality
        </Link>
        ; byte-sensitive sends pair with{" "}
        <Link href="/blog/compress-pdf-safely-for-email-and-archiving" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          safe compression
        </Link>
        . Foundational posts{" "}
        <Link href="/blog/how-to-merge-pdf-files-for-free" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          merge PDFs for free
        </Link>{" "}
        and{" "}
        <Link href="/blog/merge-pdf-files-free-five-methods-compared" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          five methods compared
        </Link>{" "}
        still anchor decision-making when you distrust marketing adjectives.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="tools">
        Toollabz PDF suite
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Chain{" "}
        <Link href="/tools/pdf-merge" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          PDF merge
        </Link>
        ,{" "}
        <Link href="/tools/pdf-split" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          PDF split
        </Link>
        , and{" "}
        <Link href="/tools/pdf-compress" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          PDF compress
        </Link>
        . When you must lift text out for quotes,{" "}
        <Link href="/tools/pdf-to-word" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          PDF to Word
        </Link>{" "}
        extraction can slot between merge and archival steps.
      </p>

      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl" id="hub">
        Hub
      </h2>
      <p className="mt-3 leading-7 text-slate-700">
        Everything lives on the{" "}
        <Link href="/pdf-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          PDF tools hub
        </Link>
        , alongside{" "}
        <Link href="/utility-tools" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          utilities
        </Link>{" "}
        like{" "}
        <Link href="/tools/mb-to-gb" className="font-medium text-violet-700 underline-offset-2 hover:underline">
          MB → GB
        </Link>{" "}
        when you narrate attachment budgets to clients.
      </p>
    </>
  );
}

export const bestFreePdfWorkflowsPost: BlogPostDefinition = {
  slug: "best-free-pdf-workflows-merge-split-compress-archiving",
  title: "Best free PDF workflows: merge, split, compress, and archive",
  description:
    "Lay out a five-step freelance-friendly PDF pipeline, compare browser vs desktop vs CLI stacks, and link to Toollabz merge/split/compress tools plus deep dives on quality and compression.",
  excerpt:
    "Normalize sources, assemble, split for audience, compress per channel, and archive intentionally - free workflows fail when steps are implicit.",
  publishedAt: "2026-05-12",
  dateModified: "2026-05-14T12:00:00.000Z",
  category: "PDF",
  tags: ["PDF workflow", "merge", "split", "compress"],
  readingTimeMinutes: 13,
  relatedToolSlugs: ["pdf-merge", "pdf-split", "pdf-compress", "pdf-to-word", "word-to-pdf", "mb-to-gb"],
  relatedPostsSlugs: [
    "merge-pdf-without-losing-quality-metadata-fonts",
    "compress-pdf-safely-for-email-and-archiving",
    "how-to-merge-pdf-files-for-free",
    "merge-pdf-files-free-five-methods-compared",
  ],
  tableOfContents: [
    { id: "pipeline", label: "Five-step pipeline" },
    { id: "compare", label: "Stack comparison" },
    { id: "cluster", label: "Cluster deep dives" },
    { id: "tools", label: "Toollabz suite" },
    { id: "hub", label: "Hubs" },
  ],
  keyTakeaways: [
    "Write the pipeline down - merge order, compression preset, and archival location - so teammates reproduce it.",
    "Pick stack based on data sensitivity, not only convenience.",
    "Verify in the same viewer family your recipients use when stakes are contractual.",
  ],
  editorialNote: [
    "Client-side processing reduces transit risk but never bypasses corporate infosec review for regulated data.",
  ],
  whenToUseTools: [
    "Use merge when bundling statements + cover letters; split when redacting unrelated chapters; compress right before outbound email.",
  ],
  commonMistakes: [
    {
      title: "Compressing then merging",
      body: "You may multiply compression artifacts - assemble first, then compress the final bundle unless you have a tested reason not to.",
    },
    {
      title: "Skipping checksum/versioning",
      body: "Filename v2_final_REAL is not a retention policy - use dated archives or git LFS for serious document control.",
    },
  ],
  sources: [{ label: "PDF Association  -  PDF basics", href: "https://www.pdfa.org/resource/iso-standard-32000-pdf/" }],
  faqSchema: [
    {
      question: "Is a browser workflow safe for NDAs?",
      answer:
        "Depends on device policy and whether extensions exfiltrate content; consult your security team - Toollabz client-side tools still run on potentially managed hardware.",
    },
    {
      question: "What is the smallest reliable stack?",
      answer:
        "Merge + spot-check + compress + archive sibling often beats ten exotic utilities with overlapping features.",
    },
  ],
  Article,
};
