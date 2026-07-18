/** Accessible SVG showing input → formula → result (improves understanding, not decoration). */
export default function FormulaFlowDiagram({
  toolName,
  inputs,
  formula,
}: {
  toolName: string;
  inputs: string[];
  formula: string;
}) {
  const inputLabel = inputs.slice(0, 3).join(" · ") || "Inputs";
  return (
    <figure
      className="mt-4 overflow-x-auto rounded-xl border border-violet-100 bg-white/90 p-4"
      aria-label={`Calculation flow for ${toolName}`}
      aria-describedby="formula-flow-caption"
    >
      <svg viewBox="0 0 640 140" className="mx-auto h-auto w-full max-w-2xl text-slate-700" role="img">
        <title>{`${toolName}: inputs to formula to result`}</title>
        <rect x="8" y="32" width="170" height="76" rx="12" className="fill-violet-50 stroke-violet-300" strokeWidth="2" />
        <text x="93" y="62" textAnchor="middle" className="fill-slate-800 text-[14px] font-semibold">
          Inputs
        </text>
        <text x="93" y="86" textAnchor="middle" className="fill-slate-600 text-[12px]">
          {inputLabel.length > 22 ? `${inputLabel.slice(0, 22)}…` : inputLabel}
        </text>

        <path d="M186 70 H230" className="stroke-violet-400" strokeWidth="2" markerEnd="url(#arrow)" />

        <rect x="236" y="24" width="220" height="92" rx="12" className="fill-slate-950 stroke-slate-700" strokeWidth="2" />
        <text x="346" y="54" textAnchor="middle" className="fill-violet-200 text-[14px] font-semibold">
          Formula
        </text>
        <text x="346" y="82" textAnchor="middle" className="fill-white text-[12px]">
          {formula.length > 34 ? `${formula.slice(0, 34)}…` : formula}
        </text>

        <path d="M464 70 H508" className="stroke-violet-400" strokeWidth="2" markerEnd="url(#arrow)" />

        <rect x="516" y="32" width="116" height="76" rx="12" className="fill-emerald-50 stroke-emerald-300" strokeWidth="2" />
        <text x="574" y="76" textAnchor="middle" className="fill-emerald-900 text-[14px] font-semibold">
          Result
        </text>

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" className="fill-violet-400" />
          </marker>
        </defs>
      </svg>
      <figcaption id="formula-flow-caption" className="mt-2 text-center text-sm text-slate-600">
        How {toolName} turns labeled inputs into a documented result.
      </figcaption>
    </figure>
  );
}
