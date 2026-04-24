/**
 * Demand-driven content engine types (blogs + tools).
 * Publishing to production routes remains a human/CI step unless explicitly extended.
 */

export type SearchIntent = "informational" | "transactional" | "mixed";

export type PublishMode = "safe" | "auto";

export type ContentEngineEvent =
  | { type: "generate_blog_start"; topic: string; mode: PublishMode }
  | { type: "generate_blog_done"; topic: string; mode: PublishMode; score: number; approved: boolean }
  | { type: "generate_blog_rejected"; topic: string; reasons: string[] }
  | { type: "sitemap_ping_start"; sitemapUrl: string }
  | { type: "sitemap_ping_ok"; sitemapUrl: string; status: number; attempt: number }
  | { type: "sitemap_ping_fail"; sitemapUrl: string; status?: number; message: string; attempt: number }
  | { type: "cron_daily"; skipped: boolean; reason?: string };

export type KeywordOpportunity = {
  keyword: string;
  intent: SearchIntent;
  /** 0–1 heuristic; higher = more monetization-like phrasing */
  monetizationScore: number;
  /** 0–1 heuristic; higher = we believe competition is lower */
  competitionScore: number;
  sources: string[];
  /** 0–100 CPC proxy for revenue-aware ranking. */
  cpcProxy?: number;
  /** 0–100 blended monetization potential (keyword + tool context). */
  monetizationPotential?: number;
};

export type PrioritizedOpportunity = {
  keyword: string;
  intent: SearchIntent;
  priority: number;
  suggestedBlogTitle?: string;
  suggestedToolAngle?: string;
  linkToolSlugs: string[];
  /** Discovery sources (e.g. tool:slug) for low-value heuristics. */
  opportunitySources?: string[];
  /** When GSC aggregates boost this row. */
  performanceBoost?: number;
  /** CTR / engagement proxy boost from GSC. */
  engagementBoost?: number;
  /** Combined RPM-protection penalties (low value + SERP fatigue). */
  revenuePenalty?: number;
  /** 0–100 CPC proxy (revenue engine). */
  cpcScore?: number;
  /** 0–100 monetization potential (revenue engine). */
  monetizationPotential?: number;
  /** Topic cluster for topical authority planning. */
  clusterId?: string;
  clusterPillarToolSlug?: string;
  clusterSiblingCount?: number;
  /** Optional RPM-derived boost from `pageRevenue` + GSC join (dashboard / explainability). */
  rpmBoost?: number;
};

export type BlogDraftPayload = {
  seoTitle: string;
  metaDescription: string;
  slugSuggestion: string;
  /** Markdown body */
  bodyMarkdown: string;
  faqSchema?: Array<{ question: string; answer: string }>;
};

export type QualityReport = {
  score: number;
  passed: boolean;
  reasons: string[];
  dimensions: {
    uniqueness: number;
    readability: number;
    depth: number;
    seo: number;
    usefulness: number;
    humanization: number;
  };
};

export type ToolFieldSpec = {
  name: string;
  label: string;
  type: "number" | "text" | "textarea" | "select";
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  step?: number;
};

/** Step 1: declarative tool specification (logic stays in pure functions + tests). */
export type ToolGenerationSpec = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  keywords: string[];
  fields: ToolFieldSpec[];
  /** Identifier of registered pure compute in engine (must exist). */
  computeKey: string;
  validationNotes?: string[];
};

export type InternalLinkSuggestion = {
  href: string;
  anchor: string;
  reason: string;
};

export type BlogPipelineResult = {
  mode: PublishMode;
  draft: BlogDraftPayload;
  quality: QualityReport;
  /** In SAFE mode, always false from HTTP API; true only when CI commits artifacts. */
  wouldAutoPublish: boolean;
  internalLinks: InternalLinkSuggestion[];
  adsenseFlags: string[];
  /** Full-funnel metadata for API consumers / PR bodies. */
  funnel?: {
    intentStage: "awareness" | "comparison" | "decision";
    internalLinkStrategy: "authority-augmented";
  };
  /** First-party behavior hints appended to the LLM prompt when `behaviorPath` was set. */
  behaviorHintsApplied?: string[];
};
