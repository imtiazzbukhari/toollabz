/** Single client beacon (aggregated per session exit or heartbeat). */
export type BehaviorBeacon = {
  path: string;
  /** Max scroll depth observed this session, 0–1. */
  maxScroll: number;
  /** Active (visible tab) time in ms, capped server-side. */
  activeMs: number;
  /** Last `[data-content-section]` in view when leaving or sampling. */
  lastSection?: string;
  /** Optional inferred query term from referrer or landing params. */
  entryKeyword?: string;
  /** Number of clicks toward `/tools/*` during this sampled session. */
  toolClicks?: number;
  /** Number of conversion-marked interactions (`data-conversion-event`). */
  conversionEvents?: number;
  /** Coarse user segment hint inferred client-side. */
  segmentHint?: "scanner" | "researcher" | "ready_to_act";
};

/** Rolled-up metrics per path for the growth engine. */
export type PageBehaviorRollup = {
  path: string;
  sampleCount: number;
  avgMaxScroll: number;
  avgActiveMs: number;
  /** Approximate distribution of max scroll (0–1) in quartile buckets. */
  scrollHistogram: { q0_25: number; q25_50: number; q50_75: number; q75_1: number };
  /** Count of exit beacons attributed to last visible section id. */
  exitBySection: Record<string, number>;
  /** Landing-intent hints observed for this page. */
  entryKeywords: Record<string, number>;
  /** Interaction-driven conversion counters. */
  toolClickCount: number;
  conversionEventCount: number;
  /** Segment distribution to support lightweight personalization logic. */
  segmentCounts: Record<"scanner" | "researcher" | "ready_to_act", number>;
  updatedAt: string;
};

export type BehaviorAggregates = {
  updatedAt: string;
  /** Source note for humans (e.g. first-party collect + nightly merge). */
  source?: string;
  byPath: Record<string, PageBehaviorRollup>;
};
