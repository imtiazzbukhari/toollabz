import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isSeoPostgresConfigured } from "@/lib/db/seo-postgres";
import { runGscDailyIngest } from "@/lib/content-engine/seo-metrics/gsc-ingest";
import { runGa4DailyIngest } from "@/lib/content-engine/seo-metrics/ga4-ingest";
import { ingestStructuredLog } from "@/lib/content-engine/seo-metrics/ingest-retry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function verifyCronSecret(req: NextRequest): boolean {
  const secret = process.env.SEO_CRON_SECRET?.trim();
  if (!secret) return false;
  const got = (req.headers.get("x-seo-cron-secret") ?? "").trim();
  const a = Buffer.from(secret, "utf8");
  const b = Buffer.from(got, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Prevent crawlers / GET prefetch from hitting cron (POST only). */
export function GET() {
  return new NextResponse(null, { status: 405 });
}

/** Scheduled GSC (+ optional GA4) ingestion into Postgres. Protect with SEO_CRON_SECRET. */
export async function POST(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    ingestStructuredLog({ event: "ingest_error", source: "cron", message: "Unauthorized cron invocation" });
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isSeoPostgresConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL not configured" }, { status: 503 });
  }

  const backfillDays = Math.min(120, Math.max(1, Number(req.nextUrl.searchParams.get("backfill") ?? process.env.SEO_CRON_BACKFILL_DAYS ?? 1)));

  ingestStructuredLog({ event: "ingest_ok", source: "cron", message: `seo-daily start backfill=${backfillDays}` });

  try {
    const gsc = await runGscDailyIngest({ backfillDays });
    let ga4: Awaited<ReturnType<typeof runGa4DailyIngest>> = { days: [], rows: 0, failedDays: [], status: "ok" };
    let ga4Error: string | null = null;
    try {
      ga4 = await runGa4DailyIngest({ backfillDays });
    } catch (e) {
      ga4Error = e instanceof Error ? e.message : String(e);
      ga4 = { days: [], rows: 0, failedDays: [], status: "failed" };
      ingestStructuredLog({ event: "ingest_error", source: "ga4", message: ga4Error.slice(0, 400) });
    }
    ingestStructuredLog({
      event: "ingest_ok",
      source: "cron",
      message: `seo-daily done gsc=${gsc.status} ga4=${ga4.status}`,
    });
    return NextResponse.json({ ok: true, gsc, ga4, ga4Error });
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    ingestStructuredLog({ event: "ingest_error", source: "cron", message: err.slice(0, 500) });
    return NextResponse.json({ ok: false, error: err }, { status: 500 });
  }
}
