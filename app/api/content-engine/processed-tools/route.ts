import { readProcessedTools } from "@/scripts/content-engine/lib/auto-runner-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    processed: readProcessedTools().processed,
  });
}
