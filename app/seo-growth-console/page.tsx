import type { Metadata } from "next";
import SeoGrowthConsoleDashboard from "@/components/seo-growth-console/SeoGrowthConsoleDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SEO Growth Console",
  robots: { index: false, follow: false },
};

export default function SeoGrowthConsolePage() {
  return <SeoGrowthConsoleDashboard />;
}
