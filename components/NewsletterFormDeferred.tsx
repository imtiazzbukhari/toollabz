"use client";

import dynamic from "next/dynamic";

const NewsletterForm = dynamic(() => import("./NewsletterForm"), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-[3.25rem] w-full max-w-md rounded-2xl border border-violet-200/25 bg-white/25 animate-pulse"
      aria-hidden
    />
  ),
});

export default function NewsletterFormDeferred({ variant = "hero" }: { variant?: "hero" | "footer" }) {
  return <NewsletterForm variant={variant} />;
}
