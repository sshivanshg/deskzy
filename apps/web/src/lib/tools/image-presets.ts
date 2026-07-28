export type ImagePreparePresetId =
  | "email"
  | "whatsapp"
  | "web"
  | "avatar"
  | "custom";

export type ImagePreparePreset = {
  id: ImagePreparePresetId;
  label: string;
  hint: string;
  maxEdge: number;
  quality: number;
  /** Soft size cap; omitted means no byte target */
  targetBytes?: number;
  /** For resize tool: default box */
  width: number;
  height: number;
};

export const IMAGE_PREPARE_PRESETS: ImagePreparePreset[] = [
  {
    id: "email",
    label: "Email",
    hint: "≤2048px · under 1 MB",
    maxEdge: 2048,
    quality: 0.75,
    targetBytes: 1_000_000,
    width: 2048,
    height: 2048,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    hint: "≤1600px · under 2 MB",
    maxEdge: 1600,
    quality: 0.72,
    targetBytes: 2_000_000,
    width: 1600,
    height: 1600,
  },
  {
    id: "web",
    label: "Web",
    hint: "≤1920px · under 400 KB",
    maxEdge: 1920,
    quality: 0.8,
    targetBytes: 400_000,
    width: 1920,
    height: 1920,
  },
  {
    id: "avatar",
    label: "Avatar",
    hint: "≤512px · under 150 KB",
    maxEdge: 512,
    quality: 0.85,
    targetBytes: 150_000,
    width: 512,
    height: 512,
  },
  {
    id: "custom",
    label: "Custom",
    hint: "Your quality, size & limits",
    maxEdge: 0,
    quality: 0.7,
    width: 800,
    height: 600,
  },
];

export function getImagePreset(
  id: string | undefined,
): ImagePreparePreset | undefined {
  return IMAGE_PREPARE_PRESETS.find((p) => p.id === id);
}

export function parseTargetBytes(
  value: string | undefined,
  unit: string | undefined,
): number | undefined {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  const u = (unit || "kb").toLowerCase();
  if (u === "mb") return Math.round(n * 1024 * 1024);
  if (u === "b") return Math.round(n);
  return Math.round(n * 1024);
}

export function formatTargetLabel(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return Number.isInteger(mb) ? `${mb} MB` : `${mb.toFixed(1)} MB`;
  }
  const kb = bytes / 1024;
  return Number.isInteger(kb) ? `${kb} KB` : `${kb.toFixed(0)} KB`;
}
