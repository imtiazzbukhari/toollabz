export type PageType = "informational" | "comparison" | "decision" | "calculator";

export type PageTypeRow = {
  path: string;
  type: PageType;
  monetizationPriority: number;
};

function classify(path: string): PageType {
  const p = path.toLowerCase();
  if (p.startsWith("/tools/")) return "calculator";
  if (/\b(vs|compare|comparison|alternative|alternatives)\b/.test(p.replace(/[-/]/g, " "))) return "comparison";
  if (/\b(calculator|estimate|payment|roi|payoff|checklist|best)\b/.test(p.replace(/[-/]/g, " "))) return "decision";
  return "informational";
}

export function buildPageTypeClassification(paths: readonly string[], max = 60): PageTypeRow[] {
  const out: PageTypeRow[] = [];
  for (const path of paths.slice(0, max)) {
    const type = classify(path);
    const monetizationPriority =
      type === "calculator" ? 95 : type === "decision" ? 85 : type === "comparison" ? 72 : 48;
    out.push({ path, type, monetizationPriority });
  }
  out.sort((a, b) => b.monetizationPriority - a.monetizationPriority || a.path.localeCompare(b.path));
  return out;
}

