import type { ReactNode } from "react";
import BacklinksSubnav from "@/components/seo-growth-console/backlinks/BacklinksSubnav";

export default function DashboardBacklinksLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <BacklinksSubnav />
      {children}
    </div>
  );
}
