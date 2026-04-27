import type { NextRequest } from "next/server";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import { listProspects } from "@/lib/db/backlinks-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  const rows = listProspects({ includeRejected: true, minScore: 0 });
  const header = ["domain", "category", "page_type", "quality_score", "status", "full_url", "contact_email"].join(",");
  const lines = rows.map((r) =>
    [r.domain, r.category, r.page_type, r.quality_score, r.status, `"${r.full_url.replace(/"/g, '""')}"`, r.contact_email ?? ""].join(
      ",",
    ),
  );
  const csv = [header, ...lines].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="backlink-prospects.csv"',
    },
  });
}
