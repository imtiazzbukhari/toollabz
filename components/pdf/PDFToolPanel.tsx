"use client";

import { useRef, useState } from "react";
import { FileStack } from "lucide-react";
import type { ToolComputationResult } from "@/lib/tools/computation-result";
import { toolGlassPanel, toolInputClass } from "@/lib/tool-ui";

function downloadBytes(bytes: Uint8Array, filename: string, type = "application/pdf") {
  const blob = new Blob([new Uint8Array(bytes)], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function parsePageRange(input: string, maxPages: number) {
  const set = new Set<number>();
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((x) => Number(x.trim()));
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < a || b > maxPages) {
        throw new Error(`Invalid range: ${part}`);
      }
      for (let i = a; i <= b; i++) set.add(i - 1);
    } else {
      const n = Number(part);
      if (!Number.isInteger(n) || n < 1 || n > maxPages) throw new Error(`Invalid page: ${part}`);
      set.add(n - 1);
    }
  }
  return [...set].sort((a, b) => a - b);
}

export default function PDFToolPanel({
  slug,
  onResult,
}: {
  slug: string;
  onResult: (result: ToolComputationResult) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1-1");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const run = async () => {
    try {
      setBusy(true);
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      if (slug === "pdf-merge") {
        if (files.length < 2) throw new Error("Please upload at least two PDF files.");
        const merged = await PDFDocument.create();
        for (const file of files) {
          const bytes = new Uint8Array(await file.arrayBuffer());
          const pdf = await PDFDocument.load(bytes);
          const copied = await merged.copyPages(pdf, pdf.getPageIndices());
          copied.forEach((page) => merged.addPage(page));
        }
        const out = await merged.save({ useObjectStreams: true });
        downloadBytes(out, "merged.pdf");
        onResult({ title: "PDF Merge", value: `Merged ${files.length} files successfully.` });
        return;
      }

      if (slug === "pdf-split") {
        if (files.length !== 1) throw new Error("Please upload exactly one PDF file.");
        const source = await PDFDocument.load(new Uint8Array(await files[0].arrayBuffer()));
        const pageIndexes = parsePageRange(range, source.getPageCount());
        if (!pageIndexes.length) throw new Error("Please enter a valid page range.");
        const out = await PDFDocument.create();
        const copied = await out.copyPages(source, pageIndexes);
        copied.forEach((page) => out.addPage(page));
        downloadBytes(await out.save({ useObjectStreams: true }), "split.pdf");
        onResult({ title: "PDF Split", value: `Exported ${pageIndexes.length} page(s).` });
        return;
      }

      if (slug === "pdf-compress") {
        if (files.length !== 1) throw new Error("Please upload exactly one PDF file.");
        const input = new Uint8Array(await files[0].arrayBuffer());
        const source = await PDFDocument.load(input);
        source.setTitle("");
        source.setAuthor("");
        source.setProducer("Toollabz");
        const out = await source.save({ useObjectStreams: true, addDefaultPage: false });
        downloadBytes(out, "compressed.pdf");
        const saved = Math.max(0, input.length - out.length);
        const percent = input.length > 0 ? ((saved / input.length) * 100).toFixed(2) : "0.00";
        onResult({ title: "PDF Compress", value: `Output ready. Size change: ${percent}%` });
        return;
      }

      if (slug === "word-to-pdf") {
        if (!content.trim()) throw new Error("Please enter document content.");
        const doc = await PDFDocument.create();
        let page = doc.addPage();
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const { height } = page.getSize();
        const fontSize = 12;
        const lines = content.split(/\n/);
        let y = height - 50;
        for (const line of lines) {
          page.drawText(line.slice(0, 120), { x: 40, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
          y -= 16;
          if (y < 40) {
            y = height - 50;
            page = doc.addPage();
          }
        }
        downloadBytes(await doc.save({ useObjectStreams: true }), "document.pdf");
        onResult({ title: "Word to PDF", value: "PDF generated and downloaded." });
        return;
      }

      if (slug === "pdf-to-word") {
        if (files.length !== 1) throw new Error("Please upload exactly one PDF file.");
        const bytes = new Uint8Array(await files[0].arrayBuffer());
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(bytes) });
        const pdf = await loadingTask.promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const line = content.items
            .map((item) => ("str" in item && typeof item.str === "string" ? item.str : ""))
            .join(" ");
          text += `\n\n--- Page ${i} ---\n${line}`;
        }
        const blob = new Blob([text.trim() || "No extractable text found."], { type: "application/msword" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pdf-content.doc";
        a.click();
        URL.revokeObjectURL(url);
        onResult({ title: "PDF to Word", value: "Extracted text document downloaded." });
        return;
      }

      onResult({ title: "PDF Tool", value: "Unsupported PDF action.", error: true });
    } catch (error) {
      onResult({ title: "PDF Tool Error", value: (error as Error).message, error: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`space-y-5 p-6 sm:p-7 ${toolGlassPanel}`}>
      <div className="flex items-center gap-2 border-b border-violet-200/40 pb-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-violet-600 text-white shadow-md">
          <FileStack className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">PDF workspace</p>
          <p className="text-sm font-medium text-slate-700">Upload and process files</p>
        </div>
      </div>
      <div className="block space-y-2">
        <span className="text-sm font-semibold text-slate-800">Upload PDF file{slug === "pdf-merge" ? "s" : ""}</span>
        <input
          ref={fileInputRef}
          type="file"
          multiple={slug === "pdf-merge"}
          accept="application/pdf"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="sr-only"
          aria-label={`Choose PDF file${slug === "pdf-merge" ? "s" : ""} to upload`}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex min-h-[44px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-300/80 bg-violet-50/40 px-4 py-4 text-center transition hover:border-violet-400 hover:bg-violet-50/80 sm:py-5`}
        >
          <span className="text-sm font-semibold text-violet-900">Tap to choose PDF{slug === "pdf-merge" ? "s" : ""}</span>
          <span className="mt-1 text-xs text-slate-600">Works on mobile and desktop — opens your device file picker.</span>
        </button>
        {files.length > 0 ? (
          <p className="text-xs text-slate-600" aria-live="polite">
            Selected: {files.map((f) => f.name).join(", ")}
          </p>
        ) : null}
      </div>

      {slug === "pdf-split" && (
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-800">Page range</span>
          <input
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="e.g. 1-3,5"
            className={toolInputClass}
          />
        </label>
      )}

      {slug === "word-to-pdf" && (
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-800">Document content</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className={`${toolInputClass} h-32 resize-y`} />
        </label>
      )}

      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-violet-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(91,33,182,0.35)] transition hover:brightness-110 active:translate-y-px disabled:opacity-60"
      >
        {busy ? "Processing…" : "Process PDF"}
      </button>
    </div>
  );
}
