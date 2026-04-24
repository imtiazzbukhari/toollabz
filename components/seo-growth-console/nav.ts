import {
  Bot,
  BrainCircuit,
  CircleGauge,
  Cpu,
  DollarSign,
  FileCode2,
  LayoutDashboard,
  Link as LinkIcon,
  PlayCircle,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const seoConsoleNavItems = [
  { label: "Overview", href: "/seo-growth-console", icon: LayoutDashboard },
  { label: "Opportunities", href: "/seo-growth-console/opportunities", icon: Sparkles },
  { label: "Content Engine", href: "/seo-growth-console/content-engine", icon: FileCode2 },
  { label: "Tool Engine", href: "/seo-growth-console/tool-engine", icon: Cpu },
  { label: "Revenue", href: "/seo-growth-console/revenue", icon: DollarSign },
  { label: "Clusters", href: "/seo-growth-console/clusters", icon: BrainCircuit },
  { label: "SEO Health", href: "/seo-growth-console/seo-health", icon: ShieldCheck },
  { label: "Monetization", href: "/seo-growth-console/monetization", icon: CircleGauge },
  { label: "Execution", href: "/seo-growth-console/execution", icon: PlayCircle },
  { label: "Automation", href: "/seo-growth-console/automation", icon: Bot },
  { label: "Backlinks", href: "/seo-growth-console/backlinks", icon: LinkIcon },
  { label: "Settings", href: "/seo-growth-console/settings", icon: Settings },
] as const;
