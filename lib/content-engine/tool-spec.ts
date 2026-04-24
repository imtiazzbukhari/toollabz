import type { ToolGenerationSpec } from "./types";
import { toolMap } from "@/lib/tools/data";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateToolSpec(spec: ToolGenerationSpec): { ok: true } | { ok: false; reasons: string[] } {
  const reasons: string[] = [];
  if (!SLUG_RE.test(spec.slug)) reasons.push("Invalid slug (lowercase letters, numbers, hyphens only).");
  if (!spec.name?.trim()) reasons.push("Tool name is required.");
  if (!spec.description?.trim() || spec.description.trim().length < 40) reasons.push("Description too vague or too short.");
  if (!spec.shortDescription?.trim()) reasons.push("Short description is required.");
  if (!spec.fields?.length) reasons.push("At least one input field is required.");
  if (toolMap.has(spec.slug)) reasons.push("Slug already exists; choose a new slug.");
  if (!spec.computeKey?.trim()) reasons.push("computeKey is required and must map to a tested pure function.");
  for (const f of spec.fields) {
    if (!f.name?.trim()) reasons.push("Each field needs a name.");
    if (!f.label?.trim()) reasons.push(`Field ${f.name} needs a label.`);
    if (f.type === "select" && (!f.options || f.options.length === 0)) reasons.push(`Select field ${f.name} needs options.`);
  }
  if (reasons.length) return { ok: false, reasons };
  return { ok: true };
}
