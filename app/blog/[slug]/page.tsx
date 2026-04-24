import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { blogPostBySlug, blogPostSlugs, blogPosts } from "@/lib/blog/registry";
import { getRelatedToolsForBlogPost } from "@/lib/blog/related-tools";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";

export function generateStaticParams() {
  return blogPostSlugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) return {};
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.seoTitle,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.dateModified,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.description,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) notFound();

  const Body = post.Article;
  const relatedTools = getRelatedToolsForBlogPost(post, 6);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.dateModified,
    author: { "@type": "Organization", name: "Toollabz", url: siteUrl },
    publisher: { "@type": "Organization", name: "Toollabz", url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
  };
  const faqJsonLd =
    post.faqSchema && post.faqSchema.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqSchema.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-violet-600">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <Link href="/blog" className="transition hover:text-violet-600">
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden />
        <span className="line-clamp-1 font-medium text-slate-700">{post.title}</span>
      </nav>

      <header className={`mb-10 p-6 sm:p-8 ${toolGlassPanel}`} data-content-section="intro">
        <p className="text-xs font-medium uppercase tracking-wider text-violet-600">Blog</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 text-balance sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">Published {post.publishedAt}</p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">{post.excerpt}</p>
      </header>

      <article className="max-w-3xl" data-content-section="body">
        <Body />
      </article>

      <section className="mt-14 max-w-3xl" aria-labelledby="blog-related-tools" data-content-section="related">
        <h2 id="blog-related-tools" className="text-xl font-bold text-slate-900 sm:text-2xl">
          Related tools
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Jump from reading to calculating: open a tool, enter your own inputs, and keep the article open in another tab if you
          want the narrative side by side with the numbers.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {relatedTools.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tools/${t.slug}`}
                className={`block h-full p-4 transition hover:-translate-y-0.5 ${toolGlassCard} hover:border-violet-300/60 hover:shadow-[0_12px_32px_rgba(99,102,241,0.1)]`}
              >
                <p className="font-semibold text-slate-900">{t.name}</p>
                <p className="mt-1 text-sm text-slate-600">{t.shortDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-14 border-t border-violet-200/40 pt-8">
        <p className="text-sm font-semibold text-slate-900">More posts</p>
        <ul className="mt-3 space-y-2 text-sm text-violet-700">
          {blogPosts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 4)
            .map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="underline-offset-2 hover:underline">
                  {p.title}
                </Link>
              </li>
            ))}
        </ul>
        <Link
          href="/blog"
          className="mt-4 inline-block text-sm font-medium text-slate-600 underline-offset-2 hover:text-violet-700 hover:underline"
        >
          ← All posts
        </Link>
      </footer>
    </div>
  );
}
