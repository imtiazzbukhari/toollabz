"use client";

import { useMemo, useState } from "react";

export default function EmbedCalculatorButton({ slug, name }: { slug: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const embedCode = useMemo(
    () =>
      `<iframe src="https://toollabz.com/embed/${slug}" width="100%" height="450" frameborder="0" title="${name} by Toollabz"></iframe>`,
    [slug, name],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-800 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
        aria-expanded={open}
      >
        Embed
      </button>
      {open ? (
        <div className="mt-3 max-w-xl rounded-2xl border border-violet-200 bg-white p-4 shadow-lg">
          <p className="text-sm text-slate-700">Copy and paste this code into your website:</p>
          <textarea
            readOnly
            value={embedCode}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-xs text-slate-800"
            onClick={(event) => event.currentTarget.select()}
          />
          <button
            type="button"
            onClick={copy}
            className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {copied ? "Copied" : "Copy Code"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
