import type { NextRequest } from "next/server";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import { listProspects } from "@/lib/db/backlinks-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const pageType = searchParams.get("pageType") ?? undefined;
  const includeRejected = searchParams.get("includeRejected") === "1";
  const minScore = searchParams.get("minScore") ? Number(searchParams.get("minScore")) : undefined;
  const rows = listProspects({ category, status, pageType, includeRejected, minScore: Number.isFinite(minScore) ? minScore : undefined });
  return Response.json({ ok: true, prospects: rows });
}
