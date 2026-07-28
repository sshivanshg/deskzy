import type { ProcessResult } from "./types";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Encode failed"))),
      type,
      quality,
    );
  });
}

function fitMaxEdge(
  width: number,
  height: number,
  maxEdge: number,
): { width: number; height: number } {
  if (!maxEdge || maxEdge <= 0) return { width, height };
  const longest = Math.max(width, height);
  if (longest <= maxEdge) return { width, height };
  const scale = maxEdge / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function drawToCanvas(
  img: CanvasImageSource,
  width: number,
  height: number,
  fillWhite: boolean,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  if (fillWhite) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

export type CompressImageOptions = {
  quality?: number;
  maxEdge?: number;
  targetBytes?: number;
};

/**
 * Compress (and optionally downscale) an image in the browser.
 * When `targetBytes` is set, binary-searches JPEG quality and may shrink
 * dimensions until under the cap — or throws if still too large.
 */
export async function compressImage(
  file: File,
  qualityOrOpts: number | CompressImageOptions = 0.7,
): Promise<ProcessResult> {
  const opts: CompressImageOptions =
    typeof qualityOrOpts === "number"
      ? { quality: qualityOrOpts }
      : qualityOrOpts;

  const startQuality = clamp(
    opts.quality ?? 0.7,
    0.15,
    0.95,
  );
  const img = await loadImage(file);
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  ({ width, height } = fitMaxEdge(width, height, opts.maxEdge ?? 0));

  const forceJpeg = Boolean(opts.targetBytes) || file.type !== "image/png";
  const type = forceJpeg ? "image/jpeg" : "image/png";
  const ext = type === "image/png" ? "png" : "jpg";

  let blob: Blob;
  let usedQuality = startQuality;
  let targetHit = true;

  if (opts.targetBytes && opts.targetBytes > 0) {
    const result = await encodeUnderTarget(
      img,
      width,
      height,
      opts.targetBytes,
      startQuality,
    );
    blob = result.blob;
    usedQuality = result.quality;
    width = result.width;
    height = result.height;
    targetHit = result.hit;
    if (!targetHit) {
      throw new Error(
        `Could not get under ${formatBytes(opts.targetBytes)} even at lowest quality. Try a smaller max size or a different image.`,
      );
    }
  } else {
    const canvas = drawToCanvas(img, width, height, type === "image/jpeg");
    blob = await canvasToBlob(
      canvas,
      type,
      type === "image/png" ? undefined : startQuality,
    );
  }

  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`,
    meta: {
      before: file.size,
      after: blob.size,
      width,
      height,
      quality: Number(usedQuality.toFixed(2)),
      targetHit: targetHit ? 1 : 0,
      format: ext,
    },
  };
}

async function encodeUnderTarget(
  img: HTMLImageElement,
  startW: number,
  startH: number,
  targetBytes: number,
  preferredQuality: number,
): Promise<{
  blob: Blob;
  quality: number;
  width: number;
  height: number;
  hit: boolean;
}> {
  let width = startW;
  let height = startH;
  let smallest: {
    blob: Blob;
    quality: number;
    width: number;
    height: number;
  } | null = null;

  for (let round = 0; round < 6; round++) {
    let lo = 0.15;
    let hi = Math.min(0.92, Math.max(preferredQuality, 0.55));
    let bestFit: { blob: Blob; quality: number } | null = null;

    for (let i = 0; i < 8; i++) {
      const q = Number((((lo + hi) / 2)).toFixed(3));
      const canvas = drawToCanvas(img, width, height, true);
      const blob = await canvasToBlob(canvas, "image/jpeg", q);
      if (!smallest || blob.size < smallest.blob.size) {
        smallest = { blob, quality: q, width, height };
      }
      if (blob.size <= targetBytes) {
        bestFit = { blob, quality: q };
        lo = q;
      } else {
        hi = q;
      }
    }

    if (bestFit) {
      return {
        blob: bestFit.blob,
        quality: bestFit.quality,
        width,
        height,
        hit: true,
      };
    }

    width = Math.max(1, Math.round(width * 0.85));
    height = Math.max(1, Math.round(height * 0.85));
    if (width < 32 && height < 32) break;
  }

  return {
    blob: smallest!.blob,
    quality: smallest!.quality,
    width: smallest!.width,
    height: smallest!.height,
    hit: Boolean(smallest && smallest.blob.size <= targetBytes),
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export async function resizeImage(
  file: File,
  width: number,
  height: number,
  keepAspect: boolean,
): Promise<ProcessResult> {
  const img = await loadImage(file);
  let w = width;
  let h = height;
  if (keepAspect) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (w / h > ratio) w = Math.round(h * ratio);
    else h = Math.round(w / ratio);
  }
  const canvas = drawToCanvas(img, w, h, false);
  const type = file.type || "image/png";
  const blob = await canvasToBlob(canvas, type, 0.92);
  const ext = type.split("/")[1] || "png";
  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, "") + `-resized.${ext}`,
    meta: { width: w, height: h },
  };
}

export async function convertImage(
  file: File,
  format: "image/png" | "image/jpeg" | "image/webp",
): Promise<ProcessResult> {
  const img = await loadImage(file);
  const canvas = drawToCanvas(
    img,
    img.naturalWidth,
    img.naturalHeight,
    format === "image/jpeg",
  );
  const blob = await canvasToBlob(canvas, format, 0.92);
  const ext = format === "image/jpeg" ? "jpg" : format.split("/")[1];
  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, "") + `.${ext}`,
    meta: { format: ext },
  };
}

export async function webpToPng(file: File): Promise<ProcessResult> {
  return convertImage(file, "image/png");
}
