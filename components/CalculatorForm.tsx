"use client";

import { memo, useCallback, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools/types";
import type { ToolComputationResult } from "@/lib/tools/computation-result";
import { toolGlassPanel, toolInputClass } from "@/lib/tool-ui";

const loadEngine = () => import("@/lib/tools/engine");

function CalculatorForm({
  tool,
  onResult,
}: {
  tool: ToolDefinition;
  onResult: (r: ToolComputationResult) => void;
}) {
  const [form, setForm] = useState<Record<string, string>>(
    () => Object.fromEntries(tool.fields.map((f) => [f.name, ""])) as Record<string, string>,
  );
  const formRef = useRef(form);
  formRef.current = form;

  const [hasGenerated, setHasGenerated] = useState(false);
  const isGeneratorTool = tool.slug.includes("generator") || tool.category === "generators";

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const { computeTool } = await loadEngine();
      const result = computeTool(tool.slug, formRef.current);
      onResult(result);
      if (isGeneratorTool && !result.error) setHasGenerated(true);
    },
    [tool.slug, isGeneratorTool, onResult],
  );

  return (
    <form onSubmit={submit} className={`space-y-5 p-6 sm:p-7 ${toolGlassPanel}`}>
      <div className="flex items-center gap-2 border-b border-violet-200/40 pb-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-md">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Input</p>
          <p className="text-sm font-medium text-slate-700">Enter your values</p>
        </div>
      </div>
      {tool.fields.map((field) => (
        <label key={field.name} className="block space-y-2">
          <span className="text-sm font-semibold text-slate-800">{field.label}</span>
          {field.type === "textarea" ? (
            <textarea
              className={`${toolInputClass} h-28 resize-y`}
              value={form[field.name] ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [field.name]: e.target.value }))}
            />
          ) : field.type === "select" ? (
            <select
              className={toolInputClass}
              value={form[field.name] ?? field.options?.[0]?.value ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [field.name]: e.target.value }))}
            >
              {(field.options ?? []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              min={field.min}
              step={field.step}
              placeholder={field.placeholder}
              className={toolInputClass}
              value={form[field.name] ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, [field.name]: e.target.value }))}
            />
          )}
        </label>
      ))}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(91,33,182,0.35)] transition hover:brightness-110 active:translate-y-px"
      >
        <Sparkles className="h-4 w-4" aria-hidden />
        {isGeneratorTool ? (hasGenerated ? "Regenerate" : "Generate") : "Calculate"}
      </button>
    </form>
  );
}

export default memo(CalculatorForm);
