export default function PremiumPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[50vh] overflow-hidden bg-gradient-to-br from-[#f3f4ff] via-[#eef2ff] to-[#e0e7ff]">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
      >
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-violet-400/25 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
