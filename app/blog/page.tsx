import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog/registry";
import { siteUrl } from "@/lib/seo";
import { toolGlassCard } from "@/lib/tool-ui";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Blog | Toollabz - Free Online Tools" },
  description:
    "Practical guides on take-home pay, loans & EMI, VAT, PDF workflows, and ROI — written for people who actually use Toollabz calculators.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Toollabz - Free Online Tools",
    description: "Guides that pair with our free tools: salary, EMI, VAT, PDF merge, housing, ROI, and more.",
    url: `${siteUrl}/blog`,
    type: "website",
    siteName: "Toollabz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Toollabz - Free Online Tools",
    description: "Guides paired with free calculators and PDF utilities on Toollabz.",
  },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Blog</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
        Short reads that match how the tools work - numbers, tradeoffs, and the stuff people forget to put in a spreadsheet.
      </p>
      <div className="mt-10 space-y-5">
        {blogPosts.map((post) => (
          <article key={post.slug} className={`p-5 sm:p-6 ${toolGlassCard}`}>
            <p className="text-xs text-slate-500">{post.publishedAt}</p>
            {(post.category || post.tags.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.category ? (
                  <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-800">
                    {post.category}
                  </span>
                ) : null}
                {post.tags.map((tag) => (
                  <span
                    key={`${post.slug}-${tag}`}
                    className="rounded-full border border-violet-200/70 bg-white/80 px-2.5 py-0.5 text-[11px] text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              <Link href={`/blog/${post.slug}`} className="transition hover:text-violet-800">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-block text-sm font-medium text-violet-700 underline-offset-2 hover:underline"
            >
              Read post →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
