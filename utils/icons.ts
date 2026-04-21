import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  FileText,
  FileStack,
  Sparkles,
  Repeat,
  Code2,
  Wand2,
  Briefcase,
  Megaphone,
  Landmark,
  Gavel,
  Palette,
  Users,
  BadgeDollarSign,
  Banknote,
  ChartLine,
  CircleDollarSign,
  TrendingUp,
  Rocket,
  Shield,
  ScrollText,
  TriangleAlert,
  Youtube,
} from "lucide-react";

/** Distinct card icons for high-traffic / homepage tools (fallback: category icon). */
const toolCardIcons: Record<string, LucideIcon> = {
  "salary-after-tax-calculator": BadgeDollarSign,
  "paycheck-calculator-usa": Banknote,
  "loan-calculator": Calculator,
  "adsense-revenue-calculator": ChartLine,
  "freelance-rate-calculator": CircleDollarSign,
  "roi-calculator": TrendingUp,
  "saas-valuation-calculator": Rocket,
  "privacy-policy-generator": Shield,
  "terms-and-conditions-generator": ScrollText,
  "disclaimer-generator": TriangleAlert,
  "ai-content-humanizer": Sparkles,
  "youtube-metadata-generator": Youtube,
};

const categoryIcons: Record<string, LucideIcon> = {
  converters: Repeat,
  calculators: Calculator,
  pdf: FileStack,
  generators: Wand2,
  image: Palette,
  developer: Code2,
  finance: Landmark,
  utility: Sparkles,
  "real-estate": Briefcase,
  business: Briefcase,
  marketing: Megaphone,
  legal: Gavel,
  creator: Users,
};

export function getCategoryIcon(category: string): LucideIcon {
  return categoryIcons[category] ?? FileText;
}

export function getToolCardIcon(tool: { slug: string; category: string }): LucideIcon {
  return toolCardIcons[tool.slug] ?? getCategoryIcon(tool.category);
}

