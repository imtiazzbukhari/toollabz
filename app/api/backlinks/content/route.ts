import type { NextRequest } from "next/server";
import { assertDashboardDataAuthorized } from "@/lib/content-engine/seo-console-auth";
import { buildContentQualityWarnings } from "@/lib/backlinks/run-content-generation";
import { getContentByProspect, getProspect, updateProspect, upsertContent, type ContentRow } from "@/lib/db/backlinks-db";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export async function GET(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  const prospectId = req.nextUrl.searchParams.get("prospectId")?.trim();
  if (!prospectId) return Response.json({ ok: false, error: "prospectId_required" }, { status: 400 });
  const row = getContentByProspect(prospectId);
  return Response.json({ ok: true, content: row ?? null });
}

export async function PATCH(req: NextRequest) {
  const denied = assertDashboardDataAuthorized(req);
  if (denied) return denied;
  let body: {
    prospectId?: string;
    body?: string;
    title?: string | null;
    subject_line?: string | null;
    anchor_text?: string | null;
    toollabz_tool_url?: string | null;
    approved_by_user?: boolean;
    meta_description?: string | null;
    suggested_tags?: string | null;
    extra_json?: string | null;
    content_type?: string;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const prospectId = body.prospectId?.trim();
  if (!prospectId) {
    return Response.json({ ok: false, error: "prospectId_required" }, { status: 400 });
  }
  const existing = getContentByProspect(prospectId);
  const prospect = getProspect(prospectId);
  if (!prospect) return Response.json({ ok: false, error: "prospect_not_found" }, { status: 404 });
  const nextBody = typeof body.body === "string" ? body.body : (existing?.body ?? "");
  if (!nextBody.trim()) {
    return Response.json({ ok: false, error: "body_required" }, { status: 400 });
  }
  const wc = countWords(nextBody);
  const contentType = body.content_type ?? existing?.content_type ?? "resource_pitch";
  const title = body.title !== undefined ? body.title : existing?.title ?? null;
  const subject_line = body.subject_line !== undefined ? body.subject_line : existing?.subject_line ?? null;
  const anchor_text = body.anchor_text !== undefined ? body.anchor_text : existing?.anchor_text ?? null;
  const toollabz_tool_url = body.toollabz_tool_url !== undefined ? body.toollabz_tool_url : existing?.toollabz_tool_url ?? null;
  const meta_description = body.meta_description !== undefined ? body.meta_description : existing?.meta_description ?? null;
  const suggested_tags = body.suggested_tags !== undefined ? body.suggested_tags : existing?.suggested_tags ?? null;
  const extra_json = body.extra_json !== undefined ? body.extra_json : existing?.extra_json ?? null;

  let articleBody: string | undefined;
  if (prospect.page_type === "write_for_us" && nextBody.includes("#")) {
    const parts = nextBody.split("\n\n");
    articleBody = parts.slice(1).join("\n\n") || nextBody;
  } else if (prospect.page_type === "write_for_us") {
    articleBody = nextBody;
  }

  const warnings = buildContentQualityWarnings({
    pageType: prospect.page_type,
    articleBody: prospect.page_type === "write_for_us" ? articleBody : undefined,
    emailBody: prospect.page_type !== "write_for_us" ? nextBody : undefined,
    anchor: anchor_text ?? undefined,
    toolUrl: toollabz_tool_url ?? undefined,
  });

  const id = existing?.id ?? randomUUID();
  upsertContent({
    id,
    prospect_id: prospectId,
    content_type: contentType,
    title,
    subject_line,
    body: nextBody,
    toollabz_tool_url,
    anchor_text,
    word_count: wc,
    quality_warnings: JSON.stringify(warnings),
    approved_by_user: body.approved_by_user ? 1 : (existing?.approved_by_user ?? 0),
    meta_description,
    suggested_tags,
    extra_json,
  });
  const pr = getProspect(prospectId);
  if (pr && (pr.status === "new" || pr.status === "content_ready")) {
    updateProspect(prospectId, { status: "content_ready" });
  }
  const content = getContentByProspect(prospectId) as ContentRow;
  return Response.json({ ok: true, content, warnings });
}
