import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import type { ProcessResult } from "./types";

function toBlob(bytes: Uint8Array, type: string) {
  const copy = new Uint8Array(bytes);
  return new Blob([copy], { type });
}

function downloadName(original: string, suffix: string, ext?: string) {
  const base = original.replace(/\.[^.]+$/, "") || "file";
  return `${base}-${suffix}${ext ? `.${ext}` : ""}`;
}

export async function mergePdfs(files: File[]): Promise<ProcessResult> {
  if (files.length < 2) throw new Error("Add at least 2 PDF files");
  const out = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await out.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  const bytes = await out.save();
  return {
    blob: toBlob(bytes, "application/pdf"),
    filename: "merged.pdf",
    meta: { files: files.length, pages: out.getPageCount() },
  };
}

export async function splitPdf(
  file: File,
  mode: "all" | "range",
  range?: { start: number; end: number },
): Promise<ProcessResult> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();

  if (mode === "all") {
    const zip = new JSZip();
    for (let i = 0; i < total; i++) {
      const out = await PDFDocument.create();
      const [page] = await out.copyPages(src, [i]);
      out.addPage(page);
      const saved = await out.save();
      zip.file(`page-${i + 1}.pdf`, saved);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    return {
      blob,
      filename: downloadName(file.name, "split", "zip"),
      meta: { pages: total },
    };
  }

  const start = Math.max(1, range?.start ?? 1);
  const end = Math.min(total, range?.end ?? total);
  if (start > end) throw new Error("Invalid page range");

  const out = await PDFDocument.create();
  const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  const saved = await out.save();
  return {
    blob: toBlob(saved, "application/pdf"),
    filename: downloadName(file.name, `p${start}-${end}`, "pdf"),
    meta: { pages: out.getPageCount(), from: start, to: end },
  };
}

export async function compressPdf(
  file: File,
  quality: "balanced" | "smallest" | "high",
): Promise<ProcessResult> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, src.getPageIndices());
  pages.forEach((p) => out.addPage(p));
  const useObjectStreams = quality !== "high";
  const saved = await out.save({ useObjectStreams });
  const blob = toBlob(saved, "application/pdf");
  return {
    blob,
    filename: downloadName(file.name, "compressed", "pdf"),
    meta: {
      before: file.size,
      after: blob.size,
      ratio: Math.round((blob.size / Math.max(file.size, 1)) * 100),
      quality,
    },
  };
}

export async function reorderPdf(
  file: File,
  order: number[],
): Promise<ProcessResult> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();
  const normalized =
    order.length === total ? order.map((n) => n - 1) : src.getPageIndices();
  for (const i of normalized) {
    if (i < 0 || i >= total) throw new Error("Invalid page order");
  }
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, normalized);
  pages.forEach((p) => out.addPage(p));
  const saved = await out.save();
  return {
    blob: toBlob(saved, "application/pdf"),
    filename: downloadName(file.name, "reordered", "pdf"),
    meta: { pages: total },
  };
}

export async function pdfPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return src.getPageCount();
}

export async function pdfToImages(file: File): Promise<ProcessResult> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const zip = new JSZip();

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unsupported");
    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;
    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("PNG encode failed"))),
        "image/png",
      );
    });
    zip.file(`page-${i}.png`, blob);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return {
    blob,
    filename: downloadName(file.name, "pages", "zip"),
    meta: { pages: doc.numPages },
  };
}
