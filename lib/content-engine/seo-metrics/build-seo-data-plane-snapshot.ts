import { isSeoPostgresConfigured } from "@/lib/db/seo-postgres";
import { loadGa4GscJoinLast28d } from "./merge-performance";
import { computeSeoOpportunitiesFromDb, loadIndexingHistory, loadRecentSeoIngestStatus } from "./real-opportunities";
import { loadSeoIngestHealth, type SeoIngestHealthSnapshot } from "./ingest-health";
import { loadRecentSeoIngestEvents, type SeoIngestLogRow } from "./ingest-history";

export type SeoDataPlaneSnapshot = {
  postgres: boolean;
  /** Populated when Postgres is configured but reads failed (connection, permissions, etc.). */
  dbError?: string;
  opportunities: Awaited<ReturnType<typeof computeSeoOpportunitiesFromDb>>;
  ga4GscJoin: Awaited<ReturnType<typeof loadGa4GscJoinLast28d>>;
  ingest: Awaited<ReturnType<typeof loadRecentSeoIngestStatus>>;
  indexingHistory: Awaited<ReturnType<typeof loadIndexingHistory>>;
  ingestHealth: SeoIngestHealthSnapshot | null;
  recentIngestRuns: SeoIngestLogRow[];
};

export async function buildSeoDataPlaneSnapshot(): Promise<SeoDataPlaneSnapshot> {
  if (!isSeoPostgresConfigured()) {
    return {
      postgres: false,
      opportunities: [],
      ga4GscJoin: [],
      ingest: { lastGsc: null, lastGa4: null },
      indexingHistory: [],
      ingestHealth: null,
      recentIngestRuns: [],
    };
  }
  try {
    const [opportunities, ga4GscJoin, ingest, indexingHistory, ingestHealth, recentIngestRuns] = await Promise.all([
      computeSeoOpportunitiesFromDb(),
      loadGa4GscJoinLast28d(),
      loadRecentSeoIngestStatus(),
      loadIndexingHistory(20),
      loadSeoIngestHealth(),
      loadRecentSeoIngestEvents(12),
    ]);
    return {
      postgres: true,
      opportunities,
      ga4GscJoin,
      ingest,
      indexingHistory,
      ingestHealth,
      recentIngestRuns,
    };
  } catch (e) {
    return {
      postgres: true,
      dbError: e instanceof Error ? e.message : String(e),
      opportunities: [],
      ga4GscJoin: [],
      ingest: { lastGsc: null, lastGa4: null },
      indexingHistory: [],
      ingestHealth: null,
      recentIngestRuns: [],
    };
  }
}
