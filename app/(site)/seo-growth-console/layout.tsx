import type { Metadata } from "next";
import type { ReactNode } from "react";
import SeoGrowthConsoleLayoutShell from "@/components/seo-growth-console/SeoGrowthConsoleLayoutShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO Growth Console",
  robots: { index: false, follow: false },
};

export default function SeoGrowthConsoleLayout({ children }: { children: ReactNode }) {
  return <SeoGrowthConsoleLayoutShell>{children}</SeoGrowthConsoleLayoutShell>;
}
