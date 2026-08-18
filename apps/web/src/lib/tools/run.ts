import { compressPdf, mergePdfs, pdfToImages, reorderPdf, splitPdf } from "./pdf";
import {
  compressImage,
  convertImage,
  resizeImage,
  webpToPng,
} from "./image";
import {
  base64Process,
  caseConvert,
  formatJson,
  generatePassword,
  generateQr,
  generateUuids,
  hashText,
  markdownToHtml,
  shortenUrl,
  shortenUrlList,
  urlEncodeDecode,
  wordCount,
} from "./text";
import { runBioLink, runUtmBuilder, runWhatsAppLink } from "./links";
import { convertMedia } from "./media";
import type { ProcessResult, TextResult } from "./types";

export type RunInput = {
  files: File[];
  text: string;
  options: Record<string, string>;
  turnstileToken?: string;
};

export type RunOutput =
  | ({ kind: "file" } & ProcessResult)
  | ({ kind: "text" } & TextResult);

function apiBase() {
  // Same-origin Next route — works even when Go API is down
  return "/api";
}

export async function runTool(
  slug: string,
  input: RunInput,
): Promise<RunOutput> {
  const { files, text, options, turnstileToken } = input;

  switch (slug) {
    case "merge-pdf":
      return { kind: "file", ...(await mergePdfs(files)) };
    case "split-pdf":
      return {
        kind: "file",
        ...(await splitPdf(files[0], (options.mode as "all" | "range") || "range", {
          start: Number(options.start || 1),
          end: Number(options.end || 1),
        })),
      };
    case "compress-pdf":
      return {
        kind: "file",
        ...(await compressPdf(
          files[0],
          (options.quality as "balanced" | "smallest" | "high") || "balanced",
        )),
      };
    case "pdf-to-images":
      return { kind: "file", ...(await pdfToImages(files[0])) };
    case "reorder-pdf": {
      const order = (options.order || "")
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
      return { kind: "file", ...(await reorderPdf(files[0], order)) };
    }
    case "compress-image":
      return {
        kind: "file",
        ...(await compressImage(files[0], {
          quality: Number(options.quality || 0.7),
          maxEdge: Number(options.maxEdge || 0) || undefined,
          targetBytes: Number(options.targetBytes || 0) || undefined,
        })),
      };
    case "resize-image":
      return {
        kind: "file",
        ...(await resizeImage(
          files[0],
          Number(options.width || 800),
          Number(options.height || 600),
          options.keepAspect !== "0",
        )),
      };
    case "convert-image":
      return {
        kind: "file",
        ...(await convertImage(
          files[0],
          (options.format as "image/png" | "image/jpeg" | "image/webp") ||
            "image/png",
        )),
      };
    case "webp-to-png":
      return { kind: "file", ...(await webpToPng(files[0])) };
    case "json-formatter":
      return { kind: "text", ...formatJson(text) };
    case "base64":
      return {
        kind: "text",
        ...base64Process(text, (options.mode as "encode" | "decode") || "encode"),
      };
    case "hash-generator":
      return {
        kind: "text",
        ...(await hashText(text, (options.algo as "SHA-256" | "SHA-1") || "SHA-256")),
      };
    case "uuid-generator":
      return { kind: "text", ...generateUuids(Number(options.count || 5)) };
    case "qr-code":
      return { kind: "text", ...(await generateQr(text)) };
    case "url-shortener":
      return {
        kind: "text",
        ...(await shortenUrl(text, apiBase(), {
          slug: options.slug || undefined,
          turnstileToken,
        })),
      };
    case "link-list": {
      let urls: string[] = [];
      try {
        const parsed = JSON.parse(options.links || "[]") as unknown;
        if (Array.isArray(parsed)) urls = parsed.map(String).filter(Boolean);
      } catch {
        urls = [];
      }
      if (urls.length < 2) {
        throw new Error("Add at least two links");
      }
      return {
        kind: "text",
        ...(await shortenUrlList(urls, apiBase(), {
          slug: options.slug || undefined,
          turnstileToken,
        })),
      };
    }
    case "utm-builder":
      return { kind: "text", ...runUtmBuilder(options) };
    case "whatsapp-link":
      return { kind: "text", ...runWhatsAppLink(options) };
    case "bio-link":
      return {
        kind: "text",
        ...runBioLink(
          options,
          (options.format as "html" | "markdown" | "json") || "html",
        ),
      };
    case "url-encode":
      return {
        kind: "text",
        ...urlEncodeDecode(text, (options.mode as "encode" | "decode") || "encode"),
      };
    case "word-counter":
      return { kind: "text", ...wordCount(text) };
    case "case-converter":
      return {
        kind: "text",
        ...caseConvert(
          text,
          (options.mode as "upper" | "lower" | "title" | "sentence") || "upper",
        ),
      };
    case "markdown-to-html":
      return { kind: "text", ...(await markdownToHtml(text)) };
    case "password-generator":
      return {
        kind: "text",
        ...generatePassword(Number(options.length || 20), {
          numbers: options.numbers !== "0",
          symbols: options.symbols !== "0",
        }),
      };
    case "media-converter":
    case "video-to-mp3":
    case "video-to-wav":
    case "audio-converter":
      return {
        kind: "file",
        ...(await convertMedia(files[0], slug, options)),
      };
    default:
      throw new Error("Unknown tool");
  }
}
