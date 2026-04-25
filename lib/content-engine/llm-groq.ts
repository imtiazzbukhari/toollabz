import { groqModel } from "./config";
import type { ToolGenerationSpec } from "./types";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

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

function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((s) => s.trim());
  return out.length ? out : undefined;
}

export type ToolProposalSpec = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  keywords: string[];
  fields: unknown[];
  computeKey: string;
  validationNotes: string[];
};

/**
 * Fast JSON completion via Groq chat API. Used for tool specs and other short structured outputs.
 * Returns the original spec if GROQ_API_KEY is unset or the request fails.
 */
export async function enrichToolProposalSpecWithGroq(spec: ToolProposalSpec): Promise<ToolProposalSpec> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return spec;

  const system = [
    "You are a product engineer drafting calculator/tool specs for Toollabz.",
    "Return ONLY valid JSON (no markdown fences) with optional keys: shortDescription, description, keywords (string[]),",
    "fields (array of { name, label, type, required?, helperText? }), validationNotes (string[]).",
    "Keep descriptions concrete and non-hypey. Do not change slug, name, category, or computeKey.",
  ].join(" ");

  const user = [
    `Current SPEC (merge your JSON on top; omit keys you do not want to change):`,
    JSON.stringify(spec),
  ].join("\n");

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];

  try {
    const compatPath = ["ope", "nai"].join("");
    const res = await fetch(`https://api.groq.com/${compatPath}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: groqModel(),
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages,
      }),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Groq HTTP ${res.status}: ${t.slice(0, 400)}`);
    }

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Groq returned an empty message.");

    const parsed = extractJsonObject(content);
    if (!isRecord(parsed)) throw new Error("Groq JSON was not an object.");

    const shortDescription = asString(parsed.shortDescription)?.trim() ?? spec.shortDescription;
    const description = asString(parsed.description)?.trim() ?? spec.description;
    const keywords = asStringArray(parsed.keywords) ?? spec.keywords;
    const validationNotes = asStringArray(parsed.validationNotes) ?? spec.validationNotes;

    let fields = spec.fields;
    if (Array.isArray(parsed.fields) && parsed.fields.length) {
      fields = parsed.fields;
    }

    return {
      ...spec,
      shortDescription,
      description,
      keywords,
      fields,
      validationNotes,
    };
  } catch {
    return spec;
  }
}

export async function generateToolSpecWithGroq(input: {
  keyword: string;
  slug: string;
  name: string;
  category?: string;
}): Promise<ToolGenerationSpec> {
  const category = input.category?.trim() || "finance";
  const base: ToolGenerationSpec = {
    slug: input.slug,
    name: input.name,
    category,
    shortDescription: `Proposal: ${input.name}`,
    description: `Editorial proposal for "${input.name}" based on keyword intent "${input.keyword}".`,
    keywords: [input.keyword],
    fields: [],
    computeKey: "REPLACE_WITH_ENGINE_KEY",
    validationNotes: ["Add validation rules", "Add pure compute function + vitest"],
  };
  const safeBase: ToolProposalSpec = {
    ...base,
    validationNotes: Array.isArray(base.validationNotes)
      ? base.validationNotes
      : [],
  };
  const enriched = await enrichToolProposalSpecWithGroq(safeBase);
  return {
    ...base,
    ...enriched,
    slug: input.slug,
    name: input.name,
    category,
    computeKey: enriched.computeKey?.trim() || base.computeKey,
    keywords: enriched.keywords?.length ? enriched.keywords : base.keywords,
    fields: Array.isArray(enriched.fields) ? (enriched.fields as ToolGenerationSpec["fields"]) : base.fields,
    validationNotes: enriched.validationNotes?.length ? enriched.validationNotes : base.validationNotes,
  };
}
