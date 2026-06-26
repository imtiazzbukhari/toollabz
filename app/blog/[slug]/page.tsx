import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { capStaticParams } from "@/lib/build/static-generation";
import { blogPostBySlug, blogPostSlugs } from "@/lib/blog/registry";
import { getRelatedToolsForBlogPost } from "@/lib/blog/related-tools";
import { absoluteUrl, generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { toolGlassCard, toolGlassPanel } from "@/lib/tool-ui";
import BlogAuthorBio from "@/components/BlogAuthorBio";
import BlogSocialShare from "@/components/BlogSocialShare";
import BlogReadingProgress from "@/components/BlogReadingProgress";
import { getRelatedBlogPostsForPost } from "@/lib/blog/related-posts";
import { formatSiteLastUpdatedForDisplay, SITE_LAST_UPDATED_ISO } from "@/lib/site-freshness";
import { BLOG_PHASE3_UPGRADES, expandBlogFaqAnswer } from "@/lib/blog/phase3-upgrades";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  const slugs = [...blogPostSlugs].sort((a, b) => a.localeCompare(b));
  return capStaticParams(slugs.map((slug) => ({ slug })));
}

type Props = { params: Promise<{ slug: string }> };

const ogImage = absoluteUrl("/logo-toollabz.webp");

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  const url = absoluteUrl(path);
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: {
      canonical: url,
      languages: {
        "en-GB": url,
        "en-US": url,
        "en-AU": url,
        "x-default": url,
      },
    },
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
  const phase3Upgrade = BLOG_PHASE3_UPGRADES[post.slug];
  const faqPairs = post.faqSchema?.map((faq) => ({
    question: faq.question,
    answer: expandBlogFaqAnswer(post.slug, faq.answer),
  }));
  const relatedTools = getRelatedToolsForBlogPost(post, 6);
  const path = `/blog/${post.slug}`;
  const postUrl = absoluteUrl(path);

  const articleJsonLd = generateArticleSchema({
    title: post.title,
    description: post.description,
    url: postUrl,
    publishedDate: post.publishedAt,
    modifiedDate: post.dateModified,
    authorName: post.author.name,
  });
  const faqJsonLd =
    faqPairs && faqPairs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqPairs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: absoluteUrl("/") },
    { name: "Blog", url: absoluteUrl("/blog") },
    { name: post.title, url: postUrl },
  ]);

  const relatedPosts = getRelatedBlogPostsForPost(post, 5);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <BlogReadingProgress postSlug={post.slug} />
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
          <span>Published {formatDate(post.publishedAt)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingTimeMinutes} min read</span>
          <span aria-hidden>·</span>
          <span>
            Reviewed {formatSiteLastUpdatedForDisplay()} ({SITE_LAST_UPDATED_ISO})
          </span>
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
        {post.editorialNote && post.editorialNote.length > 0 ? (
          <aside className="mt-5 rounded-xl border border-violet-200/60 bg-white/80 p-4 text-sm leading-relaxed text-slate-700">
            <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Editorial standards</p>
            {post.editorialNote.map((line) => (
              <p key={line} className="mt-2">
                {line}
              </p>
            ))}
          </aside>
        ) : null}
      </header>

      {post.keyTakeaways && post.keyTakeaways.length > 0 ? (
        <section className={`mb-10 max-w-3xl p-5 sm:p-6 ${toolGlassCard}`} aria-label="Key takeaways">
          <h2 className="text-sm font-bold uppercase tracking-wide text-violet-800">Key takeaways</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-800 sm:text-base">
            {post.keyTakeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      ) : null}

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
        <div className="mb-6 text-sm text-slate-500">
          <span>By {post.author.name ?? "Toollabz Editorial Team"}</span>
          <span> · Published {formatDate(post.publishedAt)}</span>
          {post.dateModified && post.dateModified.slice(0, 10) !== post.publishedAt ? (
            <span> · Updated {formatDate(post.dateModified)}</span>
          ) : null}
        </div>
        {phase3Upgrade ? (
          <section className="mb-8 rounded-xl border border-sky-200 bg-sky-50 px-5 py-4 text-slate-800">
            <p className="font-semibold text-slate-950">Quick Answer</p>
            <p className="mt-2 leading-7">{phase3Upgrade.quickAnswer}</p>
            <p className="mt-3 text-sm">
              Source:{" "}
              <a href={phase3Upgrade.source.href} className="font-medium text-violet-800 underline-offset-2 hover:underline" rel="noreferrer">
                {phase3Upgrade.source.label}
              </a>
            </p>
          </section>
        ) : null}
        <Body />
        {phase3Upgrade ? (
          <section className="mt-8 space-y-5">
            <div className="overflow-x-auto rounded-xl border border-violet-100 bg-white/90">
              <table className="min-w-full text-left text-sm text-slate-700">
                <caption className="border-b border-violet-100 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-violet-700">
                  Comparison table
                </caption>
                <thead className="bg-slate-50 text-slate-900">
                  <tr>
                    {phase3Upgrade.table.headers.map((header) => (
                      <th key={header} className="px-4 py-3 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {phase3Upgrade.table.rows.map((row) => (
                    <tr key={row.join("-")} className="border-t border-violet-100">
                      {row.map((cell) => (
                        <td key={cell} className="px-4 py-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <aside className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950">
              <p className="text-sm font-bold uppercase tracking-wide">Key Takeaway</p>
              <p className="mt-2 leading-7">{phase3Upgrade.takeaway}</p>
            </aside>
          </section>
        ) : null}
      </article>

      {post.whenToUseTools && post.whenToUseTools.length > 0 ? (
        <section className="mx-auto mt-10 max-w-3xl" aria-labelledby="when-tools">
          <h2 id="when-tools" className="text-lg font-bold text-slate-900 sm:text-xl">
            When to pair this guide with a live calculator
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
            {post.whenToUseTools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {post.commonMistakes && post.commonMistakes.length > 0 ? (
        <section className="mx-auto mt-10 max-w-3xl" aria-labelledby="common-mistakes-blog">
          <h2 id="common-mistakes-blog" className="text-lg font-bold text-slate-900 sm:text-xl">
            Common mistakes
          </h2>
          <div className="mt-4 space-y-4">
            {post.commonMistakes.map((m) => (
              <div key={m.title} className={`rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 sm:p-5 ${toolGlassCard}`}>
                <h3 className="text-base font-semibold text-amber-950">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-amber-950/90">{m.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {post.sources && post.sources.length > 0 ? (
        <section className="mx-auto mt-10 max-w-3xl" aria-labelledby="sources-blog">
          <h2 id="sources-blog" className="text-lg font-bold text-slate-900 sm:text-xl">
            References & further reading
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {post.sources.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a href={s.href} className="font-medium text-violet-800 underline-offset-2 hover:underline" rel="noreferrer">
                    {s.label}
                  </a>
                ) : (
                  s.label
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {faqPairs && faqPairs.length > 0 ? (
        <section className="mx-auto mt-12 max-w-3xl" aria-labelledby="post-faq" data-content-section="faq">
          <h2 id="post-faq" className="text-xl font-bold text-slate-900 sm:text-2xl">
            Frequently asked questions
          </h2>
          <dl className="mt-5 space-y-6">
            {faqPairs.map((f) => (
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
