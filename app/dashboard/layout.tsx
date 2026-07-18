import type { Metadata } from "next";
import { countProspectsByStatus } from "@/lib/db/backlinks-db";
import DashboardHeader from "./DashboardHeader";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  let contentReady = 0;
  try {
    contentReady = countProspectsByStatus("content_ready");
  } catch {
    contentReady = 0;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardHeader contentReady={contentReady} />
      {children}
    </div>
  );
}
