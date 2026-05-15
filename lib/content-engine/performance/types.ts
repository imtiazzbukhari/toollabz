/** Single URL row (from Search Console export or API ingestion). */
export type GscPageMetric = {
  path: string;
  clicks: number;
  impressions: number;
  /** Average position when available (optional). */
  position?: number;
};

/** Optional AdSense / analytics export merged by path with GSC rows. */
export type PageRevenueMetric = {
  path: string;
  /** USD (or your account currency) per 1,000 sessions/pageviews - align with your import script. */
  rpm: number;
  earnings?: number;
  /** Ad / monetized impressions when available. */
  monetizedImpressions?: number;
};

/** Optional committed or CI-ingested performance snapshot. */
export type PerformanceAggregates = {
  updatedAt: string;
  pages: GscPageMetric[];
  /** Prior period (optional) for declining-clicks detection in refresh engine. */
  pagesPrevious?: GscPageMetric[];
  /** RPM + earnings keyed by same `path` as GSC pages (e.g. `/tools/loan-calculator`). */
  pageRevenue?: PageRevenueMetric[];
  /** High-level notes for humans (e.g. import source). */
  source?: string;
};

/** Used to suggest edits to `weights.json` (offline or scheduled job). */
export type ContentOutcome = {
  slug: string;
  passedQuality: boolean;
  clicks: number;
  impressions: number;
};
