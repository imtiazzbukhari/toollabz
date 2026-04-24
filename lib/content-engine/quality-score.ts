import type { BlogDraftPayload, QualityReport } from "./types";
import { qualityPassThreshold } from "./config";
import { loadQualityWeights } from "./performance/weights-loader";

const ROBOTIC_PHRASES = [
  "delve into",
  "landscape",
  "robust",
  "leverage",
  "in today's world",
  "it is important to note",
  "game-changer",
  "unlock",
  "navigate",
];

const TEMPLATE_PATTERNS = [/as an ai language model/gi, /in conclusion,/gi];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function uniqueRatio(tokens: string[]): number {
  if (tokens.length === 0) return 0;
  return new Set(tokens).size / tokens.length;
}

/** 0–100: shorter sentences score higher; very long blocks penalized. */
function readabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length === 0) return 20;
  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const longFrac = lengths.filter((n) => n > 35).length / lengths.length;
  let score = 100 - Math.max(0, (avg - 14) * 3);
  score -= longFrac * 40;
  return Math.max(0, Math.min(100, score));
}

function depthScore(body: string, faqs: number): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  const headings = (body.match(/^#{2,3}\s/gm) ?? []).length;
  let s = 0;
  if (words >= 900) s += 40;
  else if (words >= 650) s += 32;
  else if (words >= 450) s += 24;
  else s += 12;
  if (headings >= 5) s += 30;
  else if (headings >= 3) s += 22;
  else if (headings >= 1) s += 12;
  s += Math.min(30, faqs * 8);
  return Math.min(100, s);
}

function seoScore(draft: BlogDraftPayload, primaryKeyword: string): number {
  const title = draft.seoTitle.trim();
  const meta = draft.metaDescription.trim();
  const kw = primaryKeyword.toLowerCase();
  let s = 0;
  if (title.length >= 28 && title.length <= 66) s += 35;
  else if (title.length >= 18) s += 22;
  if (meta.length >= 120 && meta.length <= 165) s += 35;
  else if (meta.length >= 90) s += 22;
  const bodyStart = draft.bodyMarkdown.slice(0, 600).toLowerCase();
  if (kw && bodyStart.includes(kw)) s += 20;
  if (/^#\s/.test(draft.bodyMarkdown.trim())) s += 10;
  return Math.min(100, s);
}

function humanizationScore(text: string): number {
  const lower = text.toLowerCase();
  let penalty = 0;
  for (const p of ROBOTIC_PHRASES) {
    if (lower.includes(p)) penalty += 10;
  }
  for (const re of TEMPLATE_PATTERNS) {
    if (re.test(text)) penalty += 25;
  }
  const tokens = tokenize(text);
  const bigrams = new Map<string, number>();
  for (let i = 0; i < tokens.length - 1; i++) {
    const bg = `${tokens[i]} ${tokens[i + 1]}`;
    bigrams.set(bg, (bigrams.get(bg) ?? 0) + 1);
  }
  const repeats = [...bigrams.values()].filter((n) => n > 12).length;
  penalty += repeats * 4;
  return Math.max(0, 100 - Math.min(85, penalty));
}

function usefulnessScore(body: string): number {
  const bullets = (body.match(/^\s*[-*]\s/gm) ?? []).length;
  const steps = /step\s*\d|^\s*\d+\.\s/mi.test(body) ? 1 : 0;
  const example = /\b(example|for instance|say you)\b/i.test(body) ? 1 : 0;
  let s = 35;
  s += Math.min(35, bullets * 4);
  s += steps ? 15 : 0;
  s += example ? 15 : 0;
  return Math.min(100, s);
}

/**
 * Strict heuristic gate before any artifact is merged into the repo.
 * Pair with editorial review + automated tests for tools.
 */
export function scoreBlogDraft(draft: BlogDraftPayload, primaryKeyword: string): QualityReport {
  const text = `${draft.seoTitle}\n${draft.metaDescription}\n${draft.bodyMarkdown}`;
  const tokens = tokenize(text);
  const uniqueness = Math.round(uniqueRatio(tokens) * 100);
  const readability = Math.round(readabilityScore(draft.bodyMarkdown));
  const depth = Math.round(depthScore(draft.bodyMarkdown, draft.faqSchema?.length ?? 0));
  const seo = Math.round(seoScore(draft, primaryKeyword));
  const usefulness = Math.round(usefulnessScore(draft.bodyMarkdown));
  const humanization = Math.round(humanizationScore(text));

  const dims = { uniqueness, readability, depth, seo, usefulness, humanization };
  const w = loadQualityWeights();
  const score = Math.round(
    uniqueness * w.uniqueness +
      readability * w.readability +
      depth * w.depth +
      seo * w.seo +
      usefulness * w.usefulness +
      humanization * w.humanization,
  );

  /** Hard rejections only; softer dimensions still influence the aggregate score. */
  const reasons: string[] = [];
  if (humanization < 25) reasons.push("Humanization critically low (robotic phrasing, templates, or repeated bigrams).");
  if (depth < 28) reasons.push("Depth too low for publish (word count, headings, or FAQs).");
  if (seo < 30) reasons.push("SEO packaging too weak (title/meta length or primary keyword missing early).");
  if (readability < 22) reasons.push("Readability critically low (very long sentences dominate).");
  const threshold = qualityPassThreshold();
  if (score < threshold) reasons.push(`Aggregate score ${score} below threshold ${threshold}.`);
  const passed = reasons.length === 0;

  return { score, passed, reasons, dimensions: dims };
}
