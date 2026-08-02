import type { TextResult } from "./types";

export type UtmFields = {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
};

export type UtmPresetId = "google-ads" | "instagram" | "newsletter" | "linkedin";

export const UTM_PRESETS: Record<
  UtmPresetId,
  { label: string; source: string; medium: string }
> = {
  "google-ads": { label: "Google Ads", source: "google", medium: "cpc" },
  instagram: { label: "Instagram", source: "instagram", medium: "social" },
  newsletter: { label: "Newsletter", source: "newsletter", medium: "email" },
  linkedin: { label: "LinkedIn", source: "linkedin", medium: "social" },
};

export function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function buildUtmUrl(fields: UtmFields): { url: string; warning?: string } {
  const base = normalizeBaseUrl(fields.baseUrl);
  if (!base) throw new Error("Enter a base URL");

  let parsed: URL;
  try {
    parsed = new URL(base);
  } catch {
    throw new Error("Enter a valid base URL");
  }

  const params = parsed.searchParams;
  if (fields.source.trim()) params.set("utm_source", fields.source.trim());
  if (fields.medium.trim()) params.set("utm_medium", fields.medium.trim());
  if (fields.campaign.trim()) params.set("utm_campaign", fields.campaign.trim());
  if (fields.term?.trim()) params.set("utm_term", fields.term.trim());
  if (fields.content?.trim()) params.set("utm_content", fields.content.trim());

  let warning: string | undefined;
  if (
    fields.source.trim() &&
    fields.medium.trim() &&
    !fields.campaign.trim()
  ) {
    warning = "Campaign is empty — ads reporting works better with utm_campaign";
  }

  return { url: parsed.toString(), warning };
}

export function runUtmBuilder(options: Record<string, string>): TextResult {
  const { url, warning } = buildUtmUrl({
    baseUrl: options.baseUrl || "",
    source: options.source || "",
    medium: options.medium || "",
    campaign: options.campaign || "",
    term: options.term,
    content: options.content,
  });
  return {
    text: url,
    meta: {
      source: options.source || "",
      medium: options.medium || "",
      campaign: options.campaign || "",
      ...(warning ? { note: warning } : {}),
    },
  };
}

export const COUNTRY_CODES: { code: string; label: string; dial: string }[] = [
  { code: "IN", label: "India", dial: "91" },
  { code: "US", label: "United States", dial: "1" },
  { code: "GB", label: "United Kingdom", dial: "44" },
  { code: "AE", label: "UAE", dial: "971" },
  { code: "SG", label: "Singapore", dial: "65" },
  { code: "AU", label: "Australia", dial: "61" },
  { code: "CA", label: "Canada", dial: "1" },
  { code: "DE", label: "Germany", dial: "49" },
  { code: "OTHER", label: "Other / custom", dial: "" },
];

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function buildWhatsAppUrl(opts: {
  dial: string;
  phone: string;
  message?: string;
}): string {
  const dial = digitsOnly(opts.dial);
  const phone = digitsOnly(opts.phone);
  if (!dial) throw new Error("Select or enter a country code");
  if (!phone) throw new Error("Enter a phone number");
  const e164 = `${dial}${phone}`;
  const base = `https://wa.me/${e164}`;
  const msg = opts.message?.trim();
  if (!msg) return base;
  return `${base}?text=${encodeURIComponent(msg)}`;
}

export function runWhatsAppLink(options: Record<string, string>): TextResult {
  const country = options.country || "IN";
  const fromList = COUNTRY_CODES.find((c) => c.code === country);
  const dial =
    country === "OTHER"
      ? options.dial || ""
      : fromList?.dial || options.dial || "";
  const url = buildWhatsAppUrl({
    dial,
    phone: options.phone || "",
    message: options.message,
  });
  return {
    text: url,
    meta: { phone: digitsOnly(`${dial}${options.phone || ""}`) },
  };
}

// Bio link — re-export from dedicated module (keeps existing import paths working)
export {
  BIO_FONT_PAIRINGS,
  BIO_STORAGE_KEY,
  BIO_THEME_PRESETS,
  canExportBio,
  clearBioDraft,
  configFromToolOptions,
  configToToolOptions,
  createBlock,
  createBlockId,
  defaultBioConfig,
  detectSocialPlatform,
  escapeHtml,
  exportableBlocks,
  fileToDataUrl,
  isDefaultLookingConfig,
  isExportableBlock,
  isSpotifyUrl,
  isValidBioUrl,
  loadBioDraft,
  normalizeBioUrl,
  parseBioConfig,
  parseYoutubeId,
  renderBioHtml,
  renderBioJson,
  renderBioMarkdown,
  runBioLink,
  saveBioDraft,
  spotifyEmbedUrl,
  validateBlock,
  blockHasErrors,
  type BioBgMode,
  type BioBlock,
  type BioBlockType,
  type BioButtonStyle,
  type BioFontPairing,
  type BioPageConfig,
  type BioSocialPlatform,
  type BioThemeConfig,
  type BlockValidation,
} from "./bio-link";

/** @deprecated Use BioBlock / BioPageConfig — kept for any leftover callers */
export type BioLinkItem = { id: string; label: string; url: string };
export type BioTheme = "deskzy" | "light" | "dark";

export const BIO_THEMES: Record<
  BioTheme,
  { label: string; bg: string; ink: string; muted: string; btn: string; btnInk: string }
> = {
  deskzy: {
    label: "Deskzy teal",
    bg: "#0B4239",
    ink: "#F4F7F6",
    muted: "#A8C5BE",
    btn: "#E8F2EF",
    btnInk: "#0B4239",
  },
  light: {
    label: "Minimal light",
    bg: "#F7F4EF",
    ink: "#1A1A1A",
    muted: "#6B6B6B",
    btn: "#1A1A1A",
    btnInk: "#FFFFFF",
  },
  dark: {
    label: "High contrast",
    bg: "#0A0A0A",
    ink: "#FAFAFA",
    muted: "#A3A3A3",
    btn: "#FAFAFA",
    btnInk: "#0A0A0A",
  },
};

export function parseBioLinks(raw: string): BioLinkItem[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as BioLinkItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => l && typeof l.url === "string");
  } catch {
    return [];
  }
}

export function validBioLinks(links: BioLinkItem[]): BioLinkItem[] {
  return links.filter((l) => {
    const url = normalizeBaseUrl(l.url);
    if (!url) return false;
    try {
      new URL(url);
      return Boolean(l.label.trim());
    } catch {
      return false;
    }
  });
}
