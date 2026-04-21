"use client";

import { useState } from "react";

export default function BookmarkToolButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/tools/${slug}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex rounded-xl border border-violet-300/60 bg-white/70 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-white"
      aria-live="polite"
    >
      {copied ? "Link copied" : "Bookmark this tool"}
    </button>
  );
}
