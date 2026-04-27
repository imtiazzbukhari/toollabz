"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Loader2, Save } from "lucide-react";
import { backlinksFetch } from "./backlinks-fetch";

type Prospect = { id: string; domain: string; page_type: string; status: string; quality_score: number };
type ContentRow = {
  id: string;
  prospect_id: string;
  content_type: string;
  title: string | null;
  subject_line: string | null;
  body: string;
  toollabz_tool_url: string | null;
  anchor_text: string | null;
  word_count: number;
  quality_warnings: string;
};

export default function ContentGeneratorClient() {
  const { data: list } = useSWR("/api/backlinks/prospects?status=new", (u) => backlinksFetch<{ prospects: Prospect[] }>(u));
  const prospects = (list?.prospects ?? []).filter((p) => p.quality_score >= 7);
  const [prospectId, setProspectId] = useState("");
  const [content, setContent] = useState<ContentRow | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [toolUrl, setToolUrl] = useState("");
  const [anchor, setAnchor] = useState("");
  const [busy, setBusy] = useState(false);
  const [warn, setWarn] = useState<string[]>([]);

  useEffect(() => {
    if (!prospectId) return;
    void (async () => {
      try {
        const res = await backlinksFetch<{ content: ContentRow | null }>(`/api/backlinks/content?prospectId=${encodeURIComponent(prospectId)}`);
        if (res.content) {
          setContent(res.content);
          setTitle(res.content.title ?? "");
          setSubject(res.content.subject_line ?? "");
          setBody(res.content.body);
          setToolUrl(res.content.toollabz_tool_url ?? "");
          setAnchor(res.content.anchor_text ?? "");
          try {
            setWarn(JSON.parse(res.content.quality_warnings || "[]") as string[]);
          } catch {
            setWarn([]);
          }
        } else {
          setContent(null);
          setTitle("");
          setSubject("");
          setBody("");
          setToolUrl("");
          setAnchor("");
          setWarn([]);
        }
      } catch {
        setContent(null);
      }
    })();
  }, [prospectId]);

  async function generate() {
    if (!prospectId) return;
    setBusy(true);
    setWarn([]);
    try {
      const res = await backlinksFetch<{ warnings?: string[] }>("/api/backlinks/generate-content", {
        method: "POST",
        body: JSON.stringify({ prospectId }),
      });
      setWarn(Array.isArray(res.warnings) ? res.warnings : []);
      const c = await backlinksFetch<{ content: ContentRow | null }>(`/api/backlinks/content?prospectId=${encodeURIComponent(prospectId)}`);
      if (c.content) {
        setContent(c.content);
        setTitle(c.content.title ?? "");
        setSubject(c.content.subject_line ?? "");
        setBody(c.content.body);
        setToolUrl(c.content.toollabz_tool_url ?? "");
        setAnchor(c.content.anchor_text ?? "");
      }
    } catch (e) {
      setWarn([e instanceof Error ? e.message : "Generation failed"]);
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!prospectId) return;
    setBusy(true);
    try {
      await backlinksFetch("/api/backlinks/content", {
        method: "PATCH",
        body: JSON.stringify({
          prospectId,
          title,
          subject_line: subject,
          body,
          toollabz_tool_url: toolUrl,
          anchor_text: anchor,
          approved_by_user: true,
        }),
      });
    } finally {
      setBusy(false);
    }
  }

  const selected = prospects.find((p) => p.id === prospectId);
  const pageType = selected?.page_type ?? "write_for_us";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Content generator</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Claude drafts guest posts, resource pitches, or directory copy. Edit before saving; quality warnings are advisory except
          hard gates enforced server-side.
        </p>
      </div>

      <p className="rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
        Server needs <code className="rounded bg-white/70 px-1 dark:bg-slate-900">ANTHROPIC_API_KEY</code>. If the API returns 503, paste a draft manually into the body field and save.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">
          Prospect (status: new, score ≥7)
          <select
            value={prospectId}
            onChange={(e) => setProspectId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
          >
            <option value="">Select…</option>
            {prospects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.domain} — {p.page_type} ({p.quality_score})
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button
            type="button"
            disabled={!prospectId || busy}
            onClick={() => void generate()}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {busy ? "Generating…" : "Generate with Claude"}
          </button>
        </div>
      </div>

      {prospectId ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Detected content type: <strong>{pageType}</strong>
        </p>
      ) : null}

      {warn.length > 0 ? (
        <ul className="list-disc space-y-1 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          {warn.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}

      {prospectId ? (
        <div className="space-y-4 rounded-2xl border border-white/20 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">
            Title (guest posts)
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
          </label>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">
            Subject (pitches)
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
            />
          </label>
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">
            Body / article
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed dark:border-slate-600 dark:bg-slate-950"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">
              Toollabz URL
              <input
                value={toolUrl}
                onChange={(e) => setToolUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
              />
            </label>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-100">
              Anchor text
              <input
                value={anchor}
                onChange={(e) => setAnchor(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
              />
            </label>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
          >
            <Save className="h-4 w-4" />
            Save edits & mark approved for outreach
          </button>
          {content ? <p className="text-xs text-slate-500">Content id: {content.id}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
