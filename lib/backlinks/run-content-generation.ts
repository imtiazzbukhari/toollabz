import { randomUUID } from "node:crypto";
import { callClaudeJson, parseJsonObject } from "@/lib/backlinks/anthropic-generate";
import {
  audienceForCategory,
  directoryListingPrompt,
  guestPostPrompt,
  resourcePitchPrompt,
  toneFromSignals,
} from "@/lib/backlinks/prompts";
import { pickToolForCategory } from "@/lib/backlinks/tool-picks";
import { anchorLooksKeywordStuffed, QUALITY_GATES } from "@/lib/backlinks/quality-gates";
import { getContentByProspect, getProspect, updateProspect, upsertContent, type ContentRow } from "@/lib/db/backlinks-db";

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function buildContentQualityWarnings(opts: {
  pageType: string;
  articleBody?: string;
  emailBody?: string;
  anchor?: string;
  toolUrl?: string;
}): string[] {
  const w: string[] = [];
  if (opts.pageType === "write_for_us" && opts.articleBody) {
    const wc = countWords(opts.articleBody);
    if (wc < 1000) w.push(`Article under ${QUALITY_GATES.minContentWords} words (${wc}).`);
    if (opts.toolUrl && !opts.articleBody.includes("toollabz.com") && !opts.articleBody.includes("toollabz")) {
      w.push("No obvious Toollabz link found in article body - verify manually.");
    }
    if (opts.anchor && anchorLooksKeywordStuffed(opts.anchor)) {
      w.push("Anchor text may be keyword-stuffed.");
    }
  }
  if (opts.pageType !== "write_for_us" && opts.emailBody) {
    const wc = countWords(opts.emailBody);
    if (wc > 150) w.push(`Email over 150 words (${wc}).`);
  }
  return w;
}

export async function generateContentForProspect(prospectId: string): Promise<{
  content: ContentRow;
  warnings: string[];
}> {
  const p = getProspect(prospectId);
  if (!p) throw new Error("Prospect not found");
  if (p.status === "rejected") throw new Error("Cannot generate for rejected prospect");
  if (p.quality_score < QUALITY_GATES.minProspectScoreToShow) {
    throw new Error(
      `Quality gate: prospect score ${p.quality_score} is below minimum ${QUALITY_GATES.minProspectScoreToShow}`,
    );
  }

  const tool = pickToolForCategory(p.category);
  const audience = audienceForCategory(p.category);
  const tone = toneFromSignals(Boolean(p.has_write_for_us));

  const system =
    "You are an expert SEO outreach writer for Toollabz, a free online calculators and tools site. Follow instructions exactly and output only JSON.";

  let user = "";
  let contentType = "guest_post";
  let title: string | null = null;
  let subjectLine: string | null = null;
  let body = "";
  let anchor: string | null = null;
  let toolUrl = tool.url;

  if (p.page_type === "write_for_us") {
    contentType = "guest_post";
    user = guestPostPrompt({
      prospectDomain: p.domain,
      category: p.category,
      audience,
      tone,
      toolUrl: tool.url,
      toolName: tool.name,
    });
  } else if (p.page_type === "resource_page") {
    contentType = "resource_pitch";
    user = resourcePitchPrompt({
      prospectUrl: p.full_url,
      pageFocus: p.meta_description ?? p.page_title ?? `${p.category} tools and resources`,
      toolName: tool.name,
      toolUrl: tool.url,
      toolDescription: tool.description,
    });
  } else {
    contentType = "directory_listing";
    user = directoryListingPrompt({
      directoryName: p.domain,
      categories: [p.category, "productivity", "free tools"],
    });
  }

  const raw = await callClaudeJson(system, user);
  const json = parseJsonObject(raw);

  if (p.page_type === "write_for_us") {
    title = String(json.title ?? "");
    const article = String(json.article_body ?? "");
    body = `# ${title}\n\n${article}`;
    anchor = json.toollabz_anchor_text != null ? String(json.toollabz_anchor_text) : null;
    toolUrl = String(json.toollabz_link_url ?? tool.url);
  } else if (p.page_type === "resource_page") {
    subjectLine = String(json.subject_line ?? "");
    body = String(json.email_body ?? "");
  } else {
    body = JSON.stringify(json, null, 2);
  }

  const wc =
    p.page_type === "write_for_us"
      ? countWords(String(json.article_body ?? ""))
      : countWords(body);

  const warnings = buildContentQualityWarnings({
    pageType: p.page_type,
    articleBody: p.page_type === "write_for_us" ? String(json.article_body ?? "") : undefined,
    emailBody: p.page_type === "resource_page" ? body : undefined,
    anchor: anchor ?? undefined,
    toolUrl,
  });

  const id = randomUUID();
  upsertContent({
    id,
    prospect_id: prospectId,
    content_type: contentType,
    title,
    subject_line: subjectLine,
    body,
    toollabz_tool_url: toolUrl,
    anchor_text: anchor,
    word_count: wc,
    quality_warnings: JSON.stringify(warnings),
    approved_by_user: 0,
    meta_description:
      p.page_type === "write_for_us" && json.meta_description != null && String(json.meta_description).trim()
        ? String(json.meta_description).trim()
        : null,
    suggested_tags: null,
    extra_json: null,
  });

  updateProspect(prospectId, { status: "content_ready" });

  const content = getContentByProspect(prospectId);
  if (!content) throw new Error("Content save failed");
  return { content, warnings };
}
