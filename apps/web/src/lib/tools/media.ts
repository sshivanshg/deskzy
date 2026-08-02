import type { FFmpeg } from "@ffmpeg/ffmpeg";
import type { ProcessResult } from "./types";

export type MediaMode = "video-to-audio" | "video-to-video" | "audio-to-audio";
export type MediaFormat = "mp3" | "wav" | "m4a" | "ogg" | "mp4" | "webm";

export const MEDIA_TOOL_SLUGS = [
  "media-converter",
  "video-to-mp3",
  "video-to-wav",
  "audio-converter",
] as const;

export type MediaToolSlug = (typeof MEDIA_TOOL_SLUGS)[number];

export function isMediaToolSlug(slug: string): slug is MediaToolSlug {
  return (MEDIA_TOOL_SLUGS as readonly string[]).includes(slug);
}

export const AUDIO_FORMATS: MediaFormat[] = ["mp3", "wav", "m4a", "ogg"];
export const VIDEO_FORMATS: MediaFormat[] = ["mp4", "webm"];

export function formatsForMode(mode: MediaMode): MediaFormat[] {
  return mode === "video-to-video" ? VIDEO_FORMATS : AUDIO_FORMATS;
}

export function defaultOptionsForSlug(slug: string): {
  mode: MediaMode;
  format: MediaFormat;
} {
  switch (slug) {
    case "video-to-wav":
      return { mode: "video-to-audio", format: "wav" };
    case "audio-converter":
      return { mode: "audio-to-audio", format: "mp3" };
    case "video-to-mp3":
    case "media-converter":
    default:
      return { mode: "video-to-audio", format: "mp3" };
  }
}

const MAX_INPUT_BYTES = 200 * 1024 * 1024;
const CORE_VERSION = "0.12.10";
const CORE_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

const MIME: Record<MediaFormat, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  mp4: "video/mp4",
  webm: "video/webm",
};

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import("@ffmpeg/ffmpeg"),
      import("@ffmpeg/util"),
    ]);
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${CORE_BASE}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    });
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  try {
    return await loadPromise;
  } catch (err) {
    loadPromise = null;
    ffmpegInstance = null;
    throw err;
  }
}

function inputExt(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  const mime = file.type.toLowerCase();
  if (mime.includes("mp4") || mime.includes("m4v")) return "mp4";
  if (mime.includes("webm")) return "webm";
  if (mime.includes("quicktime") || mime.includes("mov")) return "mov";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("aac") || mime.includes("m4a")) return "m4a";
  return "bin";
}

function buildArgs(
  inName: string,
  outName: string,
  mode: MediaMode,
  format: MediaFormat,
): string[] {
  const base = ["-i", inName];

  if (mode === "video-to-video") {
    if (format === "webm") {
      return [
        ...base,
        "-c:v",
        "libvpx-vp9",
        "-b:v",
        "1M",
        "-c:a",
        "libopus",
        outName,
      ];
    }
    return [
      ...base,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-c:a",
      "aac",
      outName,
    ];
  }

  // audio extract / audio convert
  switch (format) {
    case "mp3":
      return [...base, "-vn", "-acodec", "libmp3lame", "-q:a", "2", outName];
    case "wav":
      return [...base, "-vn", outName];
    case "m4a":
      return [...base, "-vn", "-c:a", "aac", outName];
    case "ogg":
      return [...base, "-vn", "-c:a", "libvorbis", outName];
    default:
      return [...base, "-vn", "-acodec", "libmp3lame", "-q:a", "2", outName];
  }
}

function resolveModeFormat(
  slug: string,
  options: Record<string, string>,
): { mode: MediaMode; format: MediaFormat } {
  const defaults = defaultOptionsForSlug(slug);
  const mode = (options.mode as MediaMode) || defaults.mode;
  let format = (options.format as MediaFormat) || defaults.format;
  const allowed = formatsForMode(mode);
  if (!allowed.includes(format)) {
    format = allowed[0];
  }
  return { mode, format };
}

export async function convertMedia(
  file: File,
  slug: string,
  options: Record<string, string> = {},
): Promise<ProcessResult> {
  if (!file) throw new Error("Choose a media file to convert.");
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error(
      "File is too large (max 200 MB). Try a shorter clip or compress first.",
    );
  }

  const { mode, format } = resolveModeFormat(slug, options);
  const ffmpeg = await getFFmpeg();
  const { fetchFile } = await import("@ffmpeg/util");

  const inName = `input.${inputExt(file)}`;
  const outName = `output.${format}`;

  try {
    await ffmpeg.writeFile(inName, await fetchFile(file));
    const code = await ffmpeg.exec(buildArgs(inName, outName, mode, format));
    if (code !== 0) {
      throw new Error(
        "Conversion failed. Try another input format or a shorter file.",
      );
    }
    const data = await ffmpeg.readFile(outName);
    const bytes =
      typeof data === "string"
        ? new TextEncoder().encode(data)
        : new Uint8Array(data);
    const blob = new Blob([bytes], { type: MIME[format] });
    const base = file.name.replace(/\.[^.]+$/, "") || "converted";
    return {
      blob,
      filename: `${base}.${format}`,
      meta: { mode, format, bytes: blob.size },
    };
  } finally {
    try {
      await ffmpeg.deleteFile(inName);
    } catch {
      /* ignore */
    }
    try {
      await ffmpeg.deleteFile(outName);
    } catch {
      /* ignore */
    }
  }
}
