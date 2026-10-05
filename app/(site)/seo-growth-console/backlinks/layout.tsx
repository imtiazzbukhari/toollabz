import type { ReactNode } from "react";
import BacklinksSubnav from "@/components/seo-growth-console/backlinks/BacklinksSubnav";

export default function BacklinksLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <BacklinksSubnav />
      {children}
    </div>
  );
}
