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

export async function compressImage(
  file: File,
  quality: number,
): Promise<ProcessResult> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.drawImage(img, 0, 0);
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await canvasToBlob(
    canvas,
    type,
    type === "image/png" ? undefined : quality,
  );
  const ext = type === "image/png" ? "png" : "jpg";
  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`,
    meta: {
      before: file.size,
      after: blob.size,
      width: canvas.width,
      height: canvas.height,
    },
  };
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
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.drawImage(img, 0, 0, w, h);
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
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);
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
