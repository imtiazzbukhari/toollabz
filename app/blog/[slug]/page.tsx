import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { blogPostBySlug, blogPostSlugs, blogPosts } from "@/lib/blog/registry";
import { getRelatedToolsForBlogPost } from "@/lib/blog/related-tools";
import { absoluteUrl, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import BlogAuthorBio from "@/components/BlogAuthorBio";
import BlogSocialShare from "@/components/BlogSocialShare";

export const revalidate = 3600;

export function generateStaticParams() {
  return blogPostSlugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

const ogImage = absoluteUrl("/logo-toollabz.webp");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  const url = absoluteUrl(path);
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      title: post.seoTitle,
      description: post.description,
      url,
      type: "article",
      siteName: "Toollabz",
      publishedTime: post.publishedAt,
      modifiedTime: post.dateModified,
      images: [{ url: ogImage, width: 469, height: 469, alt: "Toollabz" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) notFound();

  const Body = post.Article;
  const relatedTools = getRelatedToolsForBlogPost(post, 6);
  const path = `/blog/${post.slug}`;
  const authorUrl = absoluteUrl(post.author.profilePath ?? "/about");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.dateModified,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.jobTitle,
      description: post.author.bio,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Toollabz",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo-toollabz.webp") },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
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

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path },
  ]);

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
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
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
          <span>Published {post.publishedAt}</span>
          <span aria-hidden>·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </p>
        {(post.category || post.tags.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.category ? (
              <span className="rounded-full bg-violet-100 px-3 py-0.5 text-xs font-semibold text-violet-800">{post.category}</span>
            ) : null}
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-violet-200/70 bg-white/80 px-3 py-0.5 text-xs text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">{post.excerpt}</p>
      </header>

      {post.tableOfContents && post.tableOfContents.length > 0 ? (
        <nav
          className={`mb-10 max-w-3xl p-5 sm:p-6 ${toolGlassCard}`}
          aria-label="Table of contents"
        >
          <p className="text-sm font-bold text-slate-900">On this page</p>
          <ol className="mt-3 space-y-2 text-sm text-violet-800">
            {post.tableOfContents.map((row) => (
              <li key={row.id}>
                <a href={`#${row.id}`} className="underline-offset-2 hover:underline">
                  {row.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <article className="max-w-3xl" data-content-section="body">
        <Body />
      </article>

      {post.faqSchema && post.faqSchema.length > 0 ? (
        <section className="mx-auto mt-12 max-w-3xl" aria-labelledby="post-faq" data-content-section="faq">
          <h2 id="post-faq" className="text-xl font-bold text-slate-900 sm:text-2xl">
            Frequently asked questions
          </h2>
          <dl className="mt-5 space-y-6">
            {post.faqSchema.map((f) => (
              <div key={f.question} className={`rounded-xl border border-violet-200/50 p-4 sm:p-5 ${toolGlassCard}`}>
                <dt className="text-base font-semibold text-slate-900">{f.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-700">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <BlogSocialShare title={post.title} path={path} />
      <BlogAuthorBio author={post.author} />

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
        <p className="text-sm font-semibold text-slate-900">Related posts</p>
        <ul className="mt-3 space-y-2 text-sm text-violet-700">
          {relatedPosts.map((p) => (
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
