import type { ToolDefinition } from "@/lib/tools/types";
import type { Locale } from "./locales";
import type { LocalizedToolSlug } from "./catalog";
import { getToolCopy } from "./tool-messages";

/** Overlay translated chrome onto a tool. Field `name` keys stay English for the engine. */
export function localizeToolDefinition(tool: ToolDefinition, locale: Locale): ToolDefinition {
  const copy = getToolCopy(locale, tool.slug as LocalizedToolSlug);
  return {
    ...tool,
    name: copy.name,
    description: copy.description,
    shortDescription: copy.intro,
    howToUse: copy.howToUse,
    faqs: copy.faqs,
    fields: tool.fields.map((field) => ({
      ...field,
      label: copy.fields[field.name] ?? field.label,
    })),
  };
}
