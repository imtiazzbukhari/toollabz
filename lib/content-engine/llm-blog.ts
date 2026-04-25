import { geminiModel } from "./config";
import type { BlogDraftPayload } from "./types";
import type { VariationProfile } from "./variation";
import { variationPromptFragment } from "./variation";
import { highValueCommercialIntentAddendum } from "./monetization/content-intent-prompt";

function extractJsonObject(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("Model did not return JSON.");
  return JSON.parse(text.slice(start, end + 1)) as unknown;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function asFaq(v: unknown): BlogDraftPayload["faqSchema"] {
  if (!Array.isArray(v)) return undefined;
  const out: NonNullable<BlogDraftPayload["faqSchema"]> = [];
  for (const row of v) {
    if (!isRecord(row)) continue;
    const q = asString(row.question);
    const a = asString(row.answer);
    if (q && a) out.push({ question: q, answer: a });
  }
  return out.length ? out : undefined;
}

function geminiPartsText(data: unknown): string {
  const root = data as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const parts = root.candidates?.[0]?.content?.parts;
  if (!parts?.length) return "";
  return parts.map((p) => p.text ?? "").join("");
}

/**
 * Blog draft via Google Gemini (generateContent). Requires GEMINI_API_KEY.
 */
export async function generateBlogDraft(
  topic: string,
  primaryKeyword: string,
  variation?: VariationProfile,
  /** Intent / conversion / engagement instructions (optional). */
  funnelAugment?: string,
): Promise<BlogDraftPayload> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("GEMINI_API_KEY is not configured.");

  const variationBlock = variation ? variationPromptFragment(variation) : "";

  const system = [
    "You are an experienced personal finance + software tools writer for Toollabz.",
    "Write like a careful human editor: concrete, specific, non-hypey.",
    "Avoid generic AI filler. Use short paragraphs, clear headings, and real examples with numbers where plausible.",
    "Return ONLY valid JSON with keys: seoTitle, metaDescription, slugSuggestion, bodyMarkdown, faqSchema (array of {question,answer}).",
    "bodyMarkdown must be Markdown: start with a single H1 line (# ...) then sections including: introduction, explanation, step-by-step, real examples, common mistakes, FAQs (as normal headings; faqSchema duplicates concise Q&A for schema).",
    "Do not mention being an AI. No HTML.",
    highValueCommercialIntentAddendum(),
    variationBlock,
  ]
    .filter(Boolean)
    .join(" ");

  const userParts = [
    `Topic: ${topic}`,
    `Primary keyword (use naturally, not stuffed): ${primaryKeyword}`,
    "Target length: 900–1400 words in bodyMarkdown (excluding the H1).",
  ];
  if (funnelAugment?.trim()) {
    userParts.push("", "Additional funnel instructions (must follow):", funnelAugment.trim());
  }
  const user = userParts.join("\n");

  const model = geminiModel().replace(/^models\//, "");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.65,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Gemini error HTTP ${res.status}: ${t.slice(0, 500)}`);
  }

  const body = await res.json();
  const text = geminiPartsText(body);
  if (!text.trim()) throw new Error("Gemini returned an empty message.");

  const parsed = extractJsonObject(text);
  if (!isRecord(parsed)) throw new Error("Gemini JSON was not an object.");

  const seoTitle = asString(parsed.seoTitle)?.trim();
  const metaDescription = asString(parsed.metaDescription)?.trim();
  const slugSuggestion = asString(parsed.slugSuggestion)?.trim();
  const bodyMarkdown = asString(parsed.bodyMarkdown)?.trim();
  const faqSchema = asFaq(parsed.faqSchema);

  if (!seoTitle || !metaDescription || !slugSuggestion || !bodyMarkdown) {
    throw new Error("Gemini JSON missing required string fields.");
  }

  return { seoTitle, metaDescription, slugSuggestion, bodyMarkdown, faqSchema };
}
