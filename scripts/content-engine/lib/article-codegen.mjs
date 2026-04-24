import { sanitizeSlug } from "./slug.mjs";

/**
 * @param {string} text
 */
function splitInlineLinks(text) {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", text: text.slice(last, m.index) });
    parts.push({ type: "link", label: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", text: text.slice(last) });
  if (parts.length === 0) parts.push({ type: "text", text });
  return parts;
}

/**
 * @param {string} md
 * @returns {Array<{type:string, text?:string, items?:string[]}>}
 */
export function markdownToBlocks(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  if (lines[0]?.startsWith("# ")) i = 1;

  let para = [];
  /** @type {string[] | null} */
  let list = null;

  const flushPara = () => {
    const t = para.join("\n").trim();
    if (t) blocks.push({ type: "p", text: t });
    para = [];
  };
  const flushList = () => {
    if (list?.length) blocks.push({ type: "ul", items: [...list] });
    list = null;
  };

  for (; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (!t) {
      flushPara();
      flushList();
      continue;
    }
    if (t.startsWith("## ") && !t.startsWith("###")) {
      flushPara();
      flushList();
      blocks.push({ type: "h2", text: t.slice(3).trim() });
      continue;
    }
    if (t.startsWith("### ")) {
      flushPara();
      flushList();
      blocks.push({ type: "h3", text: t.slice(4).trim() });
      continue;
    }
    if (t.startsWith("- ")) {
      flushPara();
      if (!list) list = [];
      list.push(t.slice(2).trim());
      continue;
    }
    flushList();
    para.push(line);
  }
  flushPara();
  flushList();
  return blocks;
}

function emitInlineJsx(text) {
  const parts = splitInlineLinks(text);
  return parts
    .map((p) => {
      if (p.type === "text") return `{${JSON.stringify(p.text)}}`;
      const href = p.href;
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return `<Link href={${JSON.stringify(href)}} className="font-medium text-violet-700 underline-offset-2 hover:underline">{${JSON.stringify(p.label)}}</Link>`;
      }
      return `<a href={${JSON.stringify(href)}} className="font-medium text-violet-700 underline-offset-2 hover:underline" rel="noopener noreferrer">{${JSON.stringify(p.label)}}</a>`;
    })
    .join("");
}

function emitParagraphJsx(text, pClass) {
  return `<p className="${pClass}">${emitInlineJsx(text)}</p>`;
}

/**
 * @param {{
 *   slug: string;
 *   title: string;
 *   seoTitle: string;
 *   description: string;
 *   excerpt: string;
 *   publishedAt: string;
 *   bodyMarkdown: string;
 *   faqSchema?: Array<{ question: string; answer: string }>;
 *   relatedToolSlugs: string[];
 *   internalLinks: Array<{ href: string; anchor: string }>;
 * }} input
 */
export function buildArticleTsx(input) {
  const exportSlug = sanitizeSlug(input.slug);
  const blocks = markdownToBlocks(input.bodyMarkdown);
  const jsxLines = [];
  let firstP = true;
  for (const b of blocks) {
    if (b.type === "h2") {
      jsxLines.push(
        `      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">{${JSON.stringify(b.text)}}</h2>`,
      );
      firstP = false;
    } else if (b.type === "h3") {
      jsxLines.push(`      <h3 className="mt-6 text-lg font-semibold text-slate-900">{${JSON.stringify(b.text)}}</h3>`);
      firstP = false;
    } else if (b.type === "p") {
      const cls = firstP ? "mt-3 leading-7 text-slate-700" : "mt-3 leading-7 text-slate-700";
      firstP = false;
      jsxLines.push("      " + emitParagraphJsx(b.text, cls));
    } else if (b.type === "ul" && b.items?.length) {
      jsxLines.push(`      <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-700">`);
      for (const it of b.items) {
        jsxLines.push(`        <li className="leading-7 text-slate-700">${emitInlineJsx(it)}</li>`);
      }
      jsxLines.push(`      </ul>`);
    }
  }

  /** FAQ block from schema */
  const faq = input.faqSchema ?? [];
  if (faq.length) {
    jsxLines.push(
      `      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">FAQ</h2>`,
    );
    for (const f of faq) {
      jsxLines.push(`      <h3 className="mt-6 text-lg font-semibold text-slate-900">{${JSON.stringify(f.question)}}</h3>`);
      jsxLines.push(`      <p className="mt-2 leading-7 text-slate-700">{${JSON.stringify(f.answer)}}</p>`);
    }
  }

  if (input.internalLinks?.length) {
    jsxLines.push(
      `      <h2 className="mt-10 text-xl font-bold text-slate-900 sm:text-2xl">Related on Toollabz</h2>`,
      `      <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-700">`,
    );
    for (const l of input.internalLinks) {
      jsxLines.push(
        `        <li><Link href={${JSON.stringify(l.href)}} className="font-medium text-violet-700 underline-offset-2 hover:underline">{${JSON.stringify(l.anchor)}}</Link></li>`,
      );
    }
    jsxLines.push(`      </ul>`);
  }

  const relatedJson = JSON.stringify([...new Set(input.relatedToolSlugs)].filter(Boolean));
  const faqJson = JSON.stringify(faq);

  return `import Link from "next/link";
import type { BlogPostDefinition } from "../types";

function Article() {
  return (
    <>
${jsxLines.join("\n")}
    </>
  );
}

export const automatedBlogPost: BlogPostDefinition = {
  slug: ${JSON.stringify(exportSlug)},
  seoTitle: ${JSON.stringify(input.seoTitle)},
  description: ${JSON.stringify(input.description)},
  title: ${JSON.stringify(input.title)},
  excerpt: ${JSON.stringify(input.excerpt)},
  publishedAt: ${JSON.stringify(input.publishedAt)},
  relatedToolSlugs: ${relatedJson},
  faqSchema: ${faqJson},
  Article,
};
`;
}
