"use client";

import dynamic from "next/dynamic";

const BookmarkToolButton = dynamic(() => import("./BookmarkToolButton"), {
  ssr: false,
  loading: () => (
    <span
      className="inline-flex min-h-[42px] min-w-[11.5rem] items-center justify-center rounded-xl border border-transparent"
      aria-hidden
    />
  ),
});

export default function BookmarkToolButtonDeferred({ slug }: { slug: string }) {
  return <BookmarkToolButton slug={slug} />;
}
