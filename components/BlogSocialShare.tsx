import { absoluteUrl } from "@/lib/seo";

export default function BlogSocialShare({ title, path }: { title: string; path: string }) {
  const url = encodeURIComponent(absoluteUrl(path));
  const text = encodeURIComponent(`${title} — Toollabz`);
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  const twitter = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-violet-200/40 pt-6">
      <p className="text-sm font-semibold text-slate-800">Share</p>
      <a
        href={twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-violet-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-violet-300 hover:text-violet-800"
      >
        X / Twitter
      </a>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-violet-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-violet-300 hover:text-violet-800"
      >
        LinkedIn
      </a>
      <a
        href={facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-violet-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-violet-300 hover:text-violet-800"
      >
        Facebook
      </a>
    </div>
  );
}
