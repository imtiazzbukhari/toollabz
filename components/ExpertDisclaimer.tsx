const DEFAULT_COPY =
  "This tool provides estimates for informational purposes only and does not constitute legal, medical, or financial advice. Consult a qualified professional.";

export default function ExpertDisclaimer({ className = "" }: { className?: string }) {
  return (
    <aside
      role="note"
      className={`rounded-xl border border-amber-200/80 bg-amber-50/90 p-4 text-sm leading-relaxed text-amber-950 ${className}`.trim()}
    >
      <p className="font-semibold text-amber-900">Important</p>
      <p className="mt-1">{DEFAULT_COPY}</p>
    </aside>
  );
}
