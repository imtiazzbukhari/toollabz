import { getPrStatusRows } from "@/scripts/content-engine/lib/auto-runner-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await getPrStatusRows();
  return Response.json({ ok: true, rows });
}
