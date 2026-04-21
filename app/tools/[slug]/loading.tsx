export default function ToolPageLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-48 rounded-full bg-violet-200/50" />
        <div className="h-10 max-w-xl rounded-xl bg-white/50" />
        <div className="h-5 max-w-2xl rounded-lg bg-white/40" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr,1fr]">
          <div className="h-72 rounded-2xl border border-violet-200/30 bg-white/35" />
          <div className="h-48 rounded-2xl border border-violet-200/30 bg-white/30" />
        </div>
      </div>
    </div>
  );
}
