import { Suspense } from "react";
import SeoConsoleLoginForm from "./SeoConsoleLoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SEO console sign-in",
  robots: { index: false, follow: false },
};

export default function SeoConsoleLoginPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-slate-600">Loading…</p>}>
      <SeoConsoleLoginForm />
    </Suspense>
  );
}
