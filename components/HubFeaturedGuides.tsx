import Link from "next/link";
import type { BlogPostResolved } from "@/lib/blog/registry";
import { toolGlassCard } from "@/lib/tool-ui";

export default function HubFeaturedGuides({ posts, title = "Featured guides" }: { posts: BlogPostResolved[]; title?: string }) {
  if (!posts.length) return null;
  return (
    <section className="mt-12" aria-labelledby="hub-featured-guides">
      <h2 id="hub-featured-guides" className="text-xl font-bold text-slate-900 sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Long-form explainers that pair with the calculators in this hub. Open a post, then return here to plug in your own numbers.
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className={`block h-full p-5 transition hover:-translate-y-0.5 ${toolGlassCard} hover:border-violet-300/60 hover:shadow-[0_12px_32px_rgba(99,102,241,0.1)]`}
            >
              <p className="text-xs font-medium text-violet-600">{p.publishedAt}</p>
              <p className="mt-1 font-semibold text-slate-900">{p.title}</p>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{p.excerpt}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-violet-700">Read guide →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
