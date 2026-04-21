/**
 * First focusable control: jumps keyboard users past header/nav to main content.
 */
export default function SkipToMainLink() {
  return (
    <a
      href="#main-content"
      className="pointer-events-none fixed left-4 top-0 z-[200] -translate-y-[120%] rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg opacity-0 transition focus:pointer-events-auto focus:translate-y-4 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
