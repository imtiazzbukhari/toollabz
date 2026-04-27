import Image from "next/image";
import Link from "next/link";
import type { BlogAuthor } from "@/lib/blog/types";

export default function BlogAuthorBio({ author }: { author: BlogAuthor }) {
  const href = author.profilePath ?? "/about";
  return (
    <aside className="mt-12 rounded-2xl border border-violet-200/55 bg-white/75 p-6 shadow-sm" aria-labelledby="author-bio-heading">
      <h2 id="author-bio-heading" className="text-lg font-bold text-slate-900">
        About the author
      </h2>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        {author.imageSrc ? (
          <Image
            src={author.imageSrc}
            alt={`Photo of ${author.name}`}
            width={96}
            height={96}
            className="h-24 w-24 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-500 text-xl font-bold text-white"
            aria-hidden
          >
            {author.name
              .split(/\s+/)
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-base font-semibold text-slate-900">{author.name}</p>
          {author.jobTitle ? <p className="text-sm text-violet-700">{author.jobTitle}</p> : null}
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{author.bio}</p>
          <Link href={href} className="mt-3 inline-block text-sm font-semibold text-violet-800 underline-offset-2 hover:underline">
            View team &amp; mission →
          </Link>
        </div>
      </div>
    </aside>
  );
}
