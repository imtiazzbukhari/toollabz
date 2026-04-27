const MODEL = process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-20250514";

export async function callClaudeJson(system: string, user: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Anthropic API error ${res.status}: ${text.slice(0, 400)}`);
  const data = JSON.parse(text) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const block = data.content?.find((c) => c.type === "text");
  const out = block?.text?.trim() ?? "";
  if (!out) throw new Error("Empty response from Claude");
  return out;
}

/** Extract first JSON object from model output (handles markdown fences). */
export function parseJsonObject(raw: string): Record<string, unknown> {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in model output");
  return JSON.parse(s.slice(start, end + 1)) as Record<string, unknown>;
}
