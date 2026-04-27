import { countProspectsByStatus } from "@/lib/db/backlinks-db";
import DashboardHeader from "./DashboardHeader";

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
