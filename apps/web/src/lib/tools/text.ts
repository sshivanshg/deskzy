import { marked } from "marked";
import QRCode from "qrcode";
import type { TextResult } from "./types";

export function formatJson(input: string): TextResult {
  const parsed = JSON.parse(input);
  return {
    text: JSON.stringify(parsed, null, 2),
    meta: { valid: 1 },
  };
}

export function base64Process(
  input: string,
  mode: "encode" | "decode",
): TextResult {
  if (mode === "encode") {
    return { text: btoa(unescape(encodeURIComponent(input))) };
  }
  return { text: decodeURIComponent(escape(atob(input))) };
}

export async function hashText(
  input: string,
  algo: "SHA-256" | "SHA-1",
): Promise<TextResult> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest(algo, data);
  const hex = [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { text: hex, meta: { algorithm: algo } };
}

export function generateUuids(count: number): TextResult {
  const lines = Array.from({ length: Math.min(100, Math.max(1, count)) }, () =>
    crypto.randomUUID(),
  );
  return { text: lines.join("\n"), meta: { count: lines.length } };
}

export async function generateQr(text: string): Promise<TextResult> {
  const dataUrl = await QRCode.toDataURL(text, {
    margin: 2,
    width: 512,
    errorCorrectionLevel: "M",
  });
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return {
    text: dataUrl,
    download: { blob, filename: "qrcode.png" },
    meta: { size: 512 },
  };
}

export function urlEncodeDecode(
  input: string,
  mode: "encode" | "decode",
): TextResult {
  return {
    text: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input),
  };
}

export function wordCount(input: string): TextResult {
  const trimmed = input.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = input.length;
  const charsNoSpace = input.replace(/\s/g, "").length;
  const lines = input ? input.split(/\n/).length : 0;
  const sentences = trimmed
    ? trimmed.split(/[.!?]+/).filter((s) => s.trim()).length
    : 0;
  return {
    text: [
      `Words: ${words}`,
      `Characters: ${chars}`,
      `Characters (no spaces): ${charsNoSpace}`,
      `Lines: ${lines}`,
      `Sentences: ${sentences}`,
    ].join("\n"),
    meta: { words, chars, lines, sentences },
  };
}

export function caseConvert(
  input: string,
  mode: "upper" | "lower" | "title" | "sentence",
): TextResult {
  switch (mode) {
    case "upper":
      return { text: input.toUpperCase() };
    case "lower":
      return { text: input.toLowerCase() };
    case "title":
      return {
        text: input.replace(/\w\S*/g, (w) =>
          w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        ),
      };
    case "sentence":
      return {
        text: input
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
      };
  }
}

export async function markdownToHtml(input: string): Promise<TextResult> {
  const html = await marked.parse(input);
  return { text: String(html) };
}

export function generatePassword(
  length: number,
  opts: { numbers: boolean; symbols: boolean },
): TextResult {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const syms = "!@#$%^&*()-_=+[]{};:,.?";
  let alphabet = lower + upper;
  if (opts.numbers) alphabet += nums;
  if (opts.symbols) alphabet += syms;
  const len = Math.min(128, Math.max(8, length));
  const bytes = new Uint32Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < len; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return { text: out, meta: { length: len } };
}

export async function shortenUrl(
  url: string,
  apiBase: string,
  opts?: { slug?: string; turnstileToken?: string },
): Promise<TextResult> {
  const body: { url: string; slug?: string; turnstileToken?: string } = { url };
  if (opts?.slug?.trim()) body.slug = opts.slug.trim();
  if (opts?.turnstileToken) body.turnstileToken = opts.turnstileToken;

  const res = await fetch(`${apiBase}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: {
    error?: string;
    shareUrl?: string;
    shortUrl?: string;
    code?: string;
    dest?: string;
    kind?: string;
    urls?: string[];
    upgradeUrl?: string;
  } = {};
  try {
    data = await res.json();
  } catch {
    throw new Error(
      res.ok
        ? "Invalid response from publish API"
        : "Publish unavailable — try again in a moment",
    );
  }
  if (!res.ok) {
    const err = new Error(data.error || "Failed to publish URL") as Error & {
      upgradeUrl?: string;
      status?: number;
    };
    err.upgradeUrl = data.upgradeUrl;
    err.status = res.status;
    throw err;
  }
  const published = data.shareUrl || data.shortUrl;
  if (!published) throw new Error("Publish API returned no URL");
  return {
    text: published,
    meta: {
      code: data.code || "",
      dest: data.dest || "",
      kind: data.kind || "single",
      count: data.urls?.length || (data.dest ? 1 : 0),
    },
  };
}

/** Create a multi-link published page from an explicit URL list. */
export async function shortenUrlList(
  urls: string[],
  apiBase: string,
  opts?: { slug?: string; turnstileToken?: string },
): Promise<TextResult> {
  const body: { urls: string[]; slug?: string; turnstileToken?: string } = {
    urls,
  };
  if (opts?.slug?.trim()) body.slug = opts.slug.trim();
  if (opts?.turnstileToken) body.turnstileToken = opts.turnstileToken;

  const res = await fetch(`${apiBase}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: {
    error?: string;
    shareUrl?: string;
    shortUrl?: string;
    code?: string;
    dest?: string;
    kind?: string;
    urls?: string[];
    upgradeUrl?: string;
  } = {};
  try {
    data = await res.json();
  } catch {
    throw new Error(
      res.ok
        ? "Invalid response from publish API"
        : "Publish unavailable — try again in a moment",
    );
  }
  if (!res.ok) {
    const err = new Error(data.error || "Failed to publish links") as Error & {
      upgradeUrl?: string;
      status?: number;
    };
    err.upgradeUrl = data.upgradeUrl;
    err.status = res.status;
    throw err;
  }
  const published = data.shareUrl || data.shortUrl;
  if (!published) throw new Error("Publish API returned no URL");
  return {
    text: published,
    meta: {
      code: data.code || "",
      dest: data.dest || "",
      kind: data.kind || "list",
      count: data.urls?.length || urls.length,
      urlsJson: JSON.stringify(data.urls || urls),
    },
  };
}
