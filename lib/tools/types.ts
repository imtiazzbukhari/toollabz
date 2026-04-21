export type ToolCategory =
  | "converters"
  | "calculators"
  | "pdf"
  | "generators"
  | "image"
  | "developer"
  | "finance"
  | "utility"
  | "real-estate"
  | "business"
  | "marketing"
  | "legal"
  | "creator";

export type ToolFAQ = { question: string; answer: string };

export type ToolFieldType = "number" | "text" | "textarea" | "select";

export interface ToolField {
  name: string;
  label: string;
  type: ToolFieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  step?: number;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  fields: ToolField[];
  keywords: string[];
  howToUse: string[];
  faqs: ToolFAQ[];
  related: string[];
}
