import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeDollarSign,
  BadgePercent,
  Banknote,
  Bitcoin,
  Braces,
  Briefcase,
  Calculator,
  Calendar,
  Car,
  ChartLine,
  CircleDollarSign,
  Clock,
  Code2,
  Coins,
  CreditCard,
  Database,
  FileJson,
  FileJson2,
  FileStack,
  FileText,
  Fuel,
  Gavel,
  Home,
  KeyRound,
  Landmark,
  Megaphone,
  Palette,
  Percent,
  PiggyBank,
  PoundSterling,
  Receipt,
  Regex,
  Repeat,
  Rocket,
  Scale,
  ScrollText,
  Shield,
  Sparkles,
  Stethoscope,
  TriangleAlert,
  TrendingUp,
  Truck,
  Users,
  WalletCards,
  Wand2,
  Youtube,
} from "lucide-react";

/** Distinct icons for flagship slugs (checked before slug patterns). */
const toolCardIcons: Record<string, LucideIcon> = {
  "salary-after-tax-calculator": BadgeDollarSign,
  "salary-after-tax-calculator-uk": PoundSterling,
  "self-employed-tax-calculator-uk": Receipt,
  "self-employed-tax-calculator-uk": Receipt,
  "dividend-tax-calculator-uk": PiggyBank,
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
  "gst-calculator-australia": BadgePercent,
  "jwt-decoder": KeyRound,
  "json-validator": Braces,
};

/** First matching rule wins; tuned for specificity (e.g. truck before generic legal). */
const slugIconPatterns: Array<{ match: (slug: string) => boolean; icon: LucideIcon }> = [
  { match: (s) => s.includes("truck"), icon: Truck },
  { match: (s) => s.includes("motorcycle") || s.includes("scooter-accident"), icon: Car },
  { match: (s) => s.includes("car-accident") || s.includes("auto-accident"), icon: Car },
  { match: (s) => s.includes("malpractice") || s.includes("medical-malpractice"), icon: Stethoscope },
  { match: (s) => s.includes("settlement") || s.includes("compensation") || s.includes("small-claims"), icon: Scale },
  { match: (s) => s.includes("crypto") || s.includes("bitcoin"), icon: Bitcoin },
  { match: (s) => s.includes("gst"), icon: BadgePercent },
  { match: (s) => s.includes("vat") || s.includes("sales-tax"), icon: Receipt },
  { match: (s) => s.includes("jwt"), icon: KeyRound },
  { match: (s) => s.includes("json"), icon: FileJson },
  { match: (s) => s.includes("sql") || s.includes("cron"), icon: Database },
  { match: (s) => s.includes("yaml") || s.includes("xml-"), icon: FileJson2 },
  { match: (s) => s.includes("regex"), icon: Regex },
  { match: (s) => s.includes("mortgage") || s.includes("rent-vs") || s.includes("home-equity") || s.includes("property-tax"), icon: Home },
  { match: (s) => s.includes("loan") || s.includes("emi") || s.includes("amortization"), icon: WalletCards },
  {
    match: (s) =>
      s.includes("salary") || s.includes("paycheck") || s.includes("pay-scale") || s.includes("wage") || s.includes("take-home"),
    icon: BadgeDollarSign,
  },
  { match: (s) => s.endsWith("-uk") || s.includes("uk-road") || s.includes("dividend-tax-calculator-uk"), icon: PoundSterling },
  { match: (s) => s.includes("zakat"), icon: Coins },
  {
    match: (s) =>
      s.includes("stripe") ||
      s.includes("paypal") ||
      s.includes("etsy") ||
      s.includes("ebay-fee") ||
      (s.includes("invoice-") && s.includes("fee")),
    icon: CreditCard,
  },
  {
    match: (s) =>
      s.includes("roas") || s.includes("cpc-calculator") || s.includes("adsense") || s.includes("ctr") || s.includes("affiliate-earnings"),
    icon: ChartLine,
  },
  {
    match: (s) =>
      s.includes("churn") ||
      s.includes("ltv") ||
      s.includes("cac") ||
      s.includes("mrr") ||
      s.includes("arr-calculator") ||
      s.includes("burn-rate") ||
      s.includes("runway"),
    icon: Rocket,
  },
  { match: (s) => s.includes("break-even") || s.includes("margin-calculator") || s.includes("markup"), icon: Percent },
  { match: (s) => s.includes("pdf"), icon: FileStack },
  {
    match: (s) =>
      s.includes("timezone") || s.includes("date-difference") || s.includes("age-calculator") || s.includes("working-days"),
    icon: Calendar,
  },
  { match: (s) => s.includes("fuel") || s.includes("gas-cost") || s.includes("mpg"), icon: Fuel },
  {
    match: (s) =>
      s.includes("calorie") || s.includes("bmi") || s.includes("sleep") || s.includes("burnout") || s.includes("stress-"),
    icon: Activity,
  },
  { match: (s) => s.includes("time-") && s.includes("converter"), icon: Clock },
];

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
  const explicit = toolCardIcons[tool.slug];
  if (explicit) return explicit;
  for (const { match, icon } of slugIconPatterns) {
    if (match(tool.slug)) return icon;
  }
  return getCategoryIcon(tool.category);
}
