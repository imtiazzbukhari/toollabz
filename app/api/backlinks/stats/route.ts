import type { NextRequest } from "next/server";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import {
  getActivity,
  getBacklinksDb,
  outreachStats,
  type ActivityEntry,
} from "@/lib/db/backlinks-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = assertDashboardDataAuthorized(request);
  if (denied) return denied;

  const db = getBacklinksDb();
  const base = outreachStats();

  const sent = db.prepare("SELECT COUNT(*) as c FROM outreach_log WHERE sent_at IS NOT NULL").get() as { c: number };
  const responded = db.prepare("SELECT COUNT(*) as c FROM outreach_log WHERE response_date IS NOT NULL").get() as { c: number };
  const responseRate = sent.c > 0 ? Math.round((responded.c / sent.c) * 1000) / 10 : 0;
  const approved = db.prepare("SELECT COUNT(*) as c FROM outreach_log WHERE response_type = 'approved'").get() as { c: number };
  const approvalRate = responded.c > 0 ? Math.round((approved.c / responded.c) * 1000) / 10 : 0;

  const totalProspects = (db.prepare("SELECT COUNT(*) as c FROM prospects").get() as { c: number }).c;
  const totalLive = (
    db.prepare("SELECT COUNT(*) as c FROM live_links WHERE date_lost IS NULL OR date_lost = ''").get() as { c: number }
  ).c;

  const avgRow = db
    .prepare(
      `SELECT AVG(julianday(ll.date_live) - julianday(o.sent_at)) as avg_days
       FROM live_links ll
       INNER JOIN outreach_log o ON o.prospect_id = ll.prospect_id
       WHERE o.sent_at IS NOT NULL AND ll.date_live IS NOT NULL`,
    )
    .get() as { avg_days: number | null };
  const avgSentToLiveDays =
    avgRow.avg_days != null && Number.isFinite(avgRow.avg_days) ? Math.round(avgRow.avg_days * 10) / 10 : 0;

  const bestRow = db
    .prepare(
      `SELECT c.content_type as t, COUNT(*) as cnt
       FROM live_links ll
       INNER JOIN content c ON c.prospect_id = ll.prospect_id
       GROUP BY c.content_type
       ORDER BY cnt DESC
       LIMIT 1`,
    )
    .get() as { t: string | null; cnt: number } | undefined;
  const bestPerformingContentType = bestRow?.t && bestRow.cnt > 0 ? bestRow.t : "-";

  const activity: ActivityEntry[] = getActivity(40);

  return Response.json({
    ok: true,
    prospectsThisMonth: base.prospectsThisMonth,
    sentThisMonth: base.sentThisMonth,
    liveThisMonth: base.liveThisMonth,
    contentReady: base.contentReady,
    responseRate,
    approvalRate,
    anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    serpConfigured: Boolean(process.env.SERPAPI_KEY?.trim()),
    totalProspects,
    totalLive,
    avgSentToLiveDays,
    bestPerformingContentType,
    activity,
  });
}
