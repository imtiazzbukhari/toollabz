export default function ToolsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="animate-pulse space-y-5">
        <div className="h-4 w-28 rounded-full bg-violet-200/50" />
        <div className="h-10 w-72 rounded-xl bg-white/50" />
        <div className="h-5 w-[32rem] max-w-full rounded-lg bg-white/40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-44 rounded-2xl border border-violet-200/30 bg-white/35" />
          ))}
        </div>
      </div>
    </div>
  );
}
