import type { TextResult } from "./types";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export type BioBlockType = "link" | "social" | "embed" | "header" | "image";

export type BioButtonStyle = "filled" | "outline" | "rounded" | "square";

export type BioBgMode = "solid" | "gradient" | "image";

export type BioFontPairing = "clean" | "editorial" | "mono" | "soft";

export type BioSocialPlatform =
  | "instagram"
  | "x"
  | "youtube"
  | "tiktok"
  | "whatsapp"
  | "email"
  | "other";

export type BioBlock = {
  id: string;
  type: BioBlockType;
  label: string;
  url: string;
  /** Extra URLs for social icon rows */
  urls: string[];
  /** Section header text */
  text: string;
  /** Base64 data URL for image/banner blocks */
  imageData: string;
  imageAlt: string;
};

export type BioThemeConfig = {
  bgMode: BioBgMode;
  bgColor: string;
  bgColor2: string;
  bgImage: string;
  buttonStyle: BioButtonStyle;
  fontPairing: BioFontPairing;
  textColor: string;
  mutedColor: string;
  buttonBg: string;
  buttonText: string;
};

export type BioPageConfig = {
  version: 1;
  profile: {
    displayName: string;
    bio: string;
    avatarData: string;
    verified: boolean;
  };
  theme: BioThemeConfig;
  blocks: BioBlock[];
};

export const BIO_STORAGE_KEY = "deskzy:bio-link-draft";

export const BIO_FONT_PAIRINGS: Record<
  BioFontPairing,
  { label: string; family: string }
> = {
  clean: {
    label: "Clean sans",
    family:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  editorial: {
    label: "Editorial",
    family: 'Georgia, "Times New Roman", "Liberation Serif", serif',
  },
  mono: {
    label: "Mono",
    family:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  soft: {
    label: "Soft rounded",
    family:
      '"Avenir Next", "Segoe UI", Candara, "Gill Sans", "Trebuchet MS", sans-serif',
  },
};

export const BIO_THEME_PRESETS: {
  id: string;
  label: string;
  theme: Partial<BioThemeConfig>;
}[] = [
  {
    id: "deskzy",
    label: "Deskzy teal",
    theme: {
      bgMode: "solid",
      bgColor: "#0B4239",
      bgColor2: "#1F6B57",
      textColor: "#F4F7F6",
      mutedColor: "#A8C5BE",
      buttonBg: "#E8F2EF",
      buttonText: "#0B4239",
      buttonStyle: "filled",
    },
  },
  {
    id: "light",
    label: "Minimal light",
    theme: {
      bgMode: "solid",
      bgColor: "#F7F4EF",
      bgColor2: "#E8E2D8",
      textColor: "#1A1A1A",
      mutedColor: "#6B6B6B",
      buttonBg: "#1A1A1A",
      buttonText: "#FFFFFF",
      buttonStyle: "rounded",
    },
  },
  {
    id: "sunset",
    label: "Sunset wash",
    theme: {
      bgMode: "gradient",
      bgColor: "#2B1B12",
      bgColor2: "#C45C26",
      textColor: "#FFF8F2",
      mutedColor: "#E8C4AE",
      buttonBg: "#FFF8F2",
      buttonText: "#2B1B12",
      buttonStyle: "filled",
    },
  },
  {
    id: "ink",
    label: "High contrast",
    theme: {
      bgMode: "solid",
      bgColor: "#0A0A0A",
      bgColor2: "#222222",
      textColor: "#FAFAFA",
      mutedColor: "#A3A3A3",
      buttonBg: "#FAFAFA",
      buttonText: "#0A0A0A",
      buttonStyle: "square",
    },
  },
];

export function createBlockId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createBlock(type: BioBlockType = "link"): BioBlock {
  return {
    id: createBlockId(),
    type,
    label: "",
    url: "",
    urls: type === "social" ? [""] : [],
    text: type === "header" ? "Section" : "",
    imageData: "",
    imageAlt: "",
  };
}

export function defaultBioConfig(): BioPageConfig {
  return {
    version: 1,
    profile: {
      displayName: "",
      bio: "",
      avatarData: "",
      verified: false,
    },
    theme: {
      bgMode: "solid",
      bgColor: "#0B4239",
      bgColor2: "#1F6B57",
      bgImage: "",
      buttonStyle: "filled",
      fontPairing: "clean",
      textColor: "#F4F7F6",
      mutedColor: "#A8C5BE",
      buttonBg: "#E8F2EF",
      buttonText: "#0B4239",
    },
    blocks: [createBlock("link"), createBlock("link")],
  };
}

export function detectSocialPlatform(url: string): BioSocialPlatform {
  const raw = url.trim().toLowerCase();
  if (!raw) return "other";
  if (raw.startsWith("mailto:") || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw)) {
    return "email";
  }
  try {
    const u = new URL(normalizeBaseUrl(raw));
    const host = u.hostname.replace(/^www\./, "");
    if (host.includes("instagram.com")) return "instagram";
    if (
      host === "x.com" ||
      host === "twitter.com" ||
      host.endsWith(".x.com") ||
      host.endsWith(".twitter.com")
    ) {
      return "x";
    }
    if (host.includes("youtube.com") || host === "youtu.be") return "youtube";
    if (host.includes("tiktok.com")) return "tiktok";
    if (host.includes("wa.me") || host.includes("whatsapp.com")) {
      return "whatsapp";
    }
  } catch {
    /* ignore */
  }
  return "other";
}

export function normalizeBioUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("mailto:")) return trimmed;
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
    return `mailto:${trimmed}`;
  }
  return normalizeBaseUrl(trimmed);
}

export function isValidBioUrl(raw: string): boolean {
  const url = normalizeBioUrl(raw);
  if (!url) return false;
  if (url.startsWith("mailto:")) {
    return /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url);
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function parseYoutubeId(url: string): string | null {
  try {
    const u = new URL(normalizeBaseUrl(url));
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1).split("/")[0] || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" || parts[0] === "shorts") {
        return parts[1] || null;
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function isSpotifyUrl(url: string): boolean {
  try {
    const u = new URL(normalizeBaseUrl(url));
    return u.hostname.includes("spotify.com");
  } catch {
    return false;
  }
}

export function spotifyEmbedUrl(url: string): string | null {
  try {
    const u = new URL(normalizeBaseUrl(url));
    if (!u.hostname.includes("spotify.com")) return null;
    const path = u.pathname.replace(/^\/embed/, "");
    return `https://open.spotify.com/embed${path}`;
  } catch {
    return null;
  }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asBool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function sanitizeBlock(raw: unknown): BioBlock | null {
  if (!isPlainObject(raw)) return null;
  const type = asString(raw.type, "link") as BioBlockType;
  if (!["link", "social", "embed", "header", "image"].includes(type)) {
    return null;
  }
  const urls = Array.isArray(raw.urls)
    ? raw.urls.filter((u): u is string => typeof u === "string")
    : [];
  return {
    id: asString(raw.id) || createBlockId(),
    type,
    label: asString(raw.label),
    url: asString(raw.url),
    urls,
    text: asString(raw.text),
    imageData: asString(raw.imageData),
    imageAlt: asString(raw.imageAlt),
  };
}

/** Migrate legacy {id,label,url}[] into blocks */
function migrateLegacyLinks(raw: unknown): BioBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!isPlainObject(item)) return null;
      return {
        id: asString(item.id) || createBlockId(),
        type: "link" as const,
        label: asString(item.label),
        url: asString(item.url),
        urls: [],
        text: "",
        imageData: "",
        imageAlt: "",
      };
    })
    .filter((b): b is BioBlock => Boolean(b));
}

export function parseBioConfig(raw: string | unknown): BioPageConfig | null {
  let data: unknown = raw;
  if (typeof raw === "string") {
    if (!raw.trim()) return null;
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!isPlainObject(data)) return null;

  // New format
  if (data.version === 1 || data.profile || data.blocks) {
    const themeRaw = isPlainObject(data.theme) ? data.theme : {};
    const profileRaw = isPlainObject(data.profile) ? data.profile : {};
    const blocksRaw = Array.isArray(data.blocks) ? data.blocks : [];
    const blocks = blocksRaw
      .map(sanitizeBlock)
      .filter((b): b is BioBlock => Boolean(b));
    const base = defaultBioConfig();
    return {
      version: 1,
      profile: {
        displayName: asString(profileRaw.displayName, base.profile.displayName),
        bio: asString(profileRaw.bio, base.profile.bio),
        avatarData: asString(profileRaw.avatarData),
        verified: asBool(profileRaw.verified),
      },
      theme: {
        ...base.theme,
        bgMode: (["solid", "gradient", "image"].includes(
          asString(themeRaw.bgMode),
        )
          ? asString(themeRaw.bgMode)
          : base.theme.bgMode) as BioBgMode,
        bgColor: asString(themeRaw.bgColor, base.theme.bgColor),
        bgColor2: asString(themeRaw.bgColor2, base.theme.bgColor2),
        bgImage: asString(themeRaw.bgImage),
        buttonStyle: (["filled", "outline", "rounded", "square"].includes(
          asString(themeRaw.buttonStyle),
        )
          ? asString(themeRaw.buttonStyle)
          : base.theme.buttonStyle) as BioButtonStyle,
        fontPairing: (["clean", "editorial", "mono", "soft"].includes(
          asString(themeRaw.fontPairing),
        )
          ? asString(themeRaw.fontPairing)
          : base.theme.fontPairing) as BioFontPairing,
        textColor: asString(themeRaw.textColor, base.theme.textColor),
        mutedColor: asString(themeRaw.mutedColor, base.theme.mutedColor),
        buttonBg: asString(themeRaw.buttonBg, base.theme.buttonBg),
        buttonText: asString(themeRaw.buttonText, base.theme.buttonText),
      },
      blocks: blocks.length > 0 ? blocks : base.blocks,
    };
  }

  // Legacy linksJson array
  if (Array.isArray(data)) {
    const blocks = migrateLegacyLinks(data);
    if (blocks.length === 0) return null;
    return { ...defaultBioConfig(), blocks };
  }

  return null;
}

export function configFromToolOptions(
  options: Record<string, string>,
): BioPageConfig {
  if (options.configJson) {
    const parsed = parseBioConfig(options.configJson);
    if (parsed) return parsed;
  }

  // Legacy seed from title/subtitle/linksJson/theme
  const base = defaultBioConfig();
  if (options.linksJson) {
    let parsed: unknown = [];
    try {
      parsed = JSON.parse(options.linksJson);
    } catch {
      parsed = [];
    }
    const links = migrateLegacyLinks(parsed);
    if (links.length) base.blocks = links;
  }
  if (options.title) base.profile.displayName = options.title;
  if (options.subtitle) base.profile.bio = options.subtitle;
  const preset = BIO_THEME_PRESETS.find((p) => p.id === options.theme);
  if (preset) base.theme = { ...base.theme, ...preset.theme };
  return base;
}

export function configToToolOptions(config: BioPageConfig): Record<string, string> {
  const linkBlocks = config.blocks.filter((b) => b.type === "link");
  return {
    configJson: JSON.stringify(config),
    title: config.profile.displayName,
    subtitle: config.profile.bio,
    linksJson: JSON.stringify(
      linkBlocks.map((b) => ({ id: b.id, label: b.label, url: b.url })),
    ),
    theme: "custom",
    format: "html",
  };
}

export type BlockValidation = {
  labelError?: string;
  urlError?: string;
  urlsErrors?: (string | undefined)[];
  imageError?: string;
  textError?: string;
};

export function validateBlock(block: BioBlock): BlockValidation {
  const v: BlockValidation = {};
  switch (block.type) {
    case "link": {
      if (!block.label.trim()) v.labelError = "Add a label";
      if (!block.url.trim()) v.urlError = "Add a URL";
      else if (!isValidBioUrl(block.url)) v.urlError = "Enter a valid URL";
      break;
    }
    case "social": {
      const urls = block.urls.length ? block.urls : [block.url];
      v.urlsErrors = urls.map((u) => {
        if (!u.trim()) return "Add a URL";
        if (!isValidBioUrl(u)) return "Enter a valid URL";
        return undefined;
      });
      break;
    }
    case "embed": {
      if (!block.url.trim()) v.urlError = "Add a YouTube or Spotify URL";
      else if (!isValidBioUrl(block.url)) v.urlError = "Enter a valid URL";
      else if (!parseYoutubeId(block.url) && !isSpotifyUrl(block.url)) {
        v.urlError = "Use a YouTube or Spotify link";
      }
      break;
    }
    case "header": {
      if (!block.text.trim()) v.textError = "Add section text";
      break;
    }
    case "image": {
      if (!block.imageData) v.imageError = "Upload an image";
      break;
    }
  }
  return v;
}

export function blockHasErrors(v: BlockValidation): boolean {
  if (v.labelError || v.urlError || v.imageError || v.textError) return true;
  if (v.urlsErrors?.some(Boolean)) return true;
  return false;
}

export function isExportableBlock(block: BioBlock): boolean {
  const v = validateBlock(block);
  return !blockHasErrors(v);
}

export function exportableBlocks(config: BioPageConfig): BioBlock[] {
  return config.blocks.filter(isExportableBlock);
}

export function canExportBio(config: BioPageConfig): boolean {
  return (
    Boolean(config.profile.displayName.trim()) ||
    exportableBlocks(config).length > 0
  );
}

function buttonRadius(style: BioButtonStyle): string {
  switch (style) {
    case "square":
      return "6px";
    case "rounded":
      return "14px";
    case "filled":
    case "outline":
    default:
      return "999px";
  }
}

function buttonCss(theme: BioThemeConfig): string {
  const radius = buttonRadius(theme.buttonStyle);
  const outline = theme.buttonStyle === "outline";
  return `
.bio-btn {
  display: block;
  width: 100%;
  padding: 14px 18px;
  border-radius: ${radius};
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  text-align: center;
  box-sizing: border-box;
  transition: transform 0.15s ease, opacity 0.15s ease;
  ${
    outline
      ? `background: transparent; color: ${theme.buttonBg}; border: 2px solid ${theme.buttonBg};`
      : `background: ${theme.buttonBg}; color: ${theme.buttonText}; border: 2px solid transparent;`
  }
}
.bio-btn:hover { transform: translateY(-1px); opacity: 0.92; }
.bio-btn:active { transform: translateY(0); }
`;
}

function backgroundCss(theme: BioThemeConfig): string {
  if (theme.bgMode === "image" && theme.bgImage) {
    return `background: ${theme.bgColor} center / cover no-repeat url("${theme.bgImage}");`;
  }
  if (theme.bgMode === "gradient") {
    return `background: linear-gradient(160deg, ${theme.bgColor} 0%, ${theme.bgColor2} 100%);`;
  }
  return `background: ${theme.bgColor};`;
}

const SOCIAL_SVGS: Record<BioSocialPlatform, string> = {
  instagram: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.7A2.9 2.9 0 1 1 14.9 12 2.9 2.9 0 0 1 12 14.9zm5.95-8.85a1.15 1.15 0 1 0 1.15 1.15 1.15 1.15 0 0 0-1.15-1.15z"/></svg>`,
  x: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.78L23 22h-6.5l-5.1-6.66L5.7 22H2.6l7.28-8.33L1 2h6.66l4.6 6.1L18.9 2zm-1.14 18h1.8L6.36 3.9H4.43L17.76 20z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M14.5 3c.4 2.4 1.9 4.1 4.3 4.5v2.7c-1.5-.1-2.9-.6-4.1-1.5v6.4a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v2.9a3 3 0 1 0 2.1 2.9V3h2.7z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 7 12.5l-.2.3.3 1.8-1.8-.3-.3.2A8.2 8.2 0 0 1 4.7 7.8 8.2 8.2 0 0 1 12 3.8zm-3.1 3.3c-.2 0-.5.1-.7.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 1.9.7 2.3.6 2.7.6.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-1.4-.7c-.2-.1-.4 0-.5.1l-.6.7c-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.4l.4-.5c.1-.1.2-.3.1-.4L9.2 7.3c-.1-.3-.3-.3-.3-.3z"/></svg>`,
  email: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2.2V18h18V7.2l-9 5.4L3 7.2zm1.5-.7L12 11l7.5-4.5H4.5z"/></svg>`,
  other: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M14.5 4.5a4.5 4.5 0 0 1 0 6.4l-1.1 1.1-1.4-1.4 1.1-1.1a2.5 2.5 0 1 0-3.5-3.5L8.5 7.1 7.1 5.7l1.1-1.1a4.5 4.5 0 0 1 6.3-.1zm-3.4 7.5 1.4 1.4-1.1 1.1a2.5 2.5 0 1 0 3.5 3.5l1.1-1.1 1.4 1.4-1.1 1.1a4.5 4.5 0 1 1-6.4-6.4l1.2-1zm.7-2.1 5.7 5.7-1.4 1.4-5.7-5.7 1.4-1.4z"/></svg>`,
};

function verifiedBadgeSvg(color: string): string {
  return `<svg class="bio-verified" viewBox="0 0 24 24" width="18" height="18" fill="${color}" aria-label="Verified"><path d="M12 2l2.1 1.2 2.4-.3.9 2.2 2.2.9-.3 2.4L21 12l-1.2 2.1.3 2.4-2.2.9-.9 2.2-2.4-.3L12 22l-2.1-1.2-2.4.3-.9-2.2-2.2-.9.3-2.4L2 12l1.2-2.1-.3-2.4 2.2-.9.9-2.2 2.4.3L12 2zm-1.2 12.1 5-5 1.4 1.4-6.4 6.4-3.5-3.5 1.4-1.4 2.1 2.1z"/></svg>`;
}

function renderBlockHtml(block: BioBlock, theme: BioThemeConfig): string {
  switch (block.type) {
    case "link": {
      const href = escapeHtml(normalizeBioUrl(block.url));
      const label = escapeHtml(block.label.trim());
      return `<a class="bio-btn" href="${href}" rel="noopener noreferrer" target="_blank">${label}</a>`;
    }
    case "social": {
      const urls = (block.urls.length ? block.urls : [block.url]).filter((u) =>
        isValidBioUrl(u),
      );
      if (!urls.length) return "";
      const icons = urls
        .map((u) => {
          const platform = detectSocialPlatform(u);
          const href = escapeHtml(normalizeBioUrl(u));
          const label = platform === "other" ? "Link" : platform;
          return `<a class="bio-social" href="${href}" rel="noopener noreferrer" target="_blank" aria-label="${escapeHtml(label)}">${SOCIAL_SVGS[platform]}</a>`;
        })
        .join("");
      return `<nav class="bio-social-row" aria-label="Social links">${icons}</nav>`;
    }
    case "embed": {
      const yt = parseYoutubeId(block.url);
      if (yt) {
        const title = escapeHtml(block.label.trim() || "Watch on YouTube");
        return `<a class="bio-embed" href="${escapeHtml(normalizeBioUrl(block.url))}" rel="noopener noreferrer" target="_blank">
  <img src="https://img.youtube.com/vi/${escapeHtml(yt)}/hqdefault.jpg" alt="${title}" loading="lazy" width="480" height="270"/>
  <span class="bio-embed-label">${title}</span>
</a>`;
      }
      if (isSpotifyUrl(block.url)) {
        const embed = spotifyEmbedUrl(block.url);
        const title = escapeHtml(block.label.trim() || "Listen on Spotify");
        if (embed) {
          return `<div class="bio-spotify">
  <iframe src="${escapeHtml(embed)}" title="${title}" loading="lazy" allow="encrypted-media" allowfullscreen=""></iframe>
  <a class="bio-embed-label" href="${escapeHtml(normalizeBioUrl(block.url))}" rel="noopener noreferrer" target="_blank">${title}</a>
</div>`;
        }
      }
      return "";
    }
    case "header": {
      const text = escapeHtml(block.text.trim());
      return `<div class="bio-divider"><h2>${text}</h2></div>`;
    }
    case "image": {
      if (!block.imageData) return "";
      const alt = escapeHtml(block.imageAlt.trim() || "Banner");
      return `<figure class="bio-banner"><img src="${block.imageData}" alt="${alt}"/></figure>`;
    }
    default:
      return "";
  }
}

export function renderBioHtml(config: BioPageConfig): string {
  const theme = config.theme;
  const name = escapeHtml(config.profile.displayName.trim() || "Links");
  const bio = config.profile.bio.trim()
    ? `<p class="bio-tagline">${escapeHtml(config.profile.bio.trim())}</p>`
    : "";
  const avatar = config.profile.avatarData
    ? `<img class="bio-avatar" src="${config.profile.avatarData}" alt="" width="88" height="88"/>`
    : "";
  const verified = config.profile.verified
    ? verifiedBadgeSvg(theme.buttonBg)
    : "";
  const blocks = exportableBlocks(config)
    .map((b) => renderBlockHtml(b, theme))
    .filter(Boolean)
    .join("\n");
  const font = BIO_FONT_PAIRINGS[theme.fontPairing]?.family || BIO_FONT_PAIRINGS.clean.family;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="color-scheme" content="light dark"/>
<title>${name}</title>
<style>
:root {
  --bio-ink: ${theme.textColor};
  --bio-muted: ${theme.mutedColor};
  --bio-btn: ${theme.buttonBg};
  --bio-btn-ink: ${theme.buttonText};
}
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  ${backgroundCss(theme)}
  color: var(--bio-ink);
  font-family: ${font};
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
.bio-page {
  width: min(100%, 28rem);
  margin: 0 auto;
  padding: 3rem 1.25rem 4rem;
  text-align: center;
}
.bio-avatar {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 999px;
  object-fit: cover;
  margin: 0 auto 1rem;
  display: block;
  border: 3px solid color-mix(in srgb, var(--bio-ink) 18%, transparent);
}
.bio-name {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 1.85rem);
  letter-spacing: -0.03em;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;
}
.bio-verified { flex-shrink: 0; }
.bio-tagline {
  margin: 0.5rem 0 0;
  color: var(--bio-muted);
  font-size: 0.95rem;
}
.bio-stack {
  margin-top: 1.75rem;
  display: grid;
  gap: 0.75rem;
}
${buttonCss(theme)}
.bio-social-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.25rem 0;
}
.bio-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  color: var(--bio-btn-ink);
  background: var(--bio-btn);
  text-decoration: none;
}
.bio-social:hover { opacity: 0.9; }
.bio-divider h2 {
  margin: 0.5rem 0 0.15rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bio-muted);
}
.bio-banner {
  margin: 0;
  border-radius: 1rem;
  overflow: hidden;
}
.bio-banner img {
  display: block;
  width: 100%;
  height: auto;
}
.bio-embed {
  display: block;
  border-radius: 1rem;
  overflow: hidden;
  text-decoration: none;
  color: var(--bio-ink);
  background: color-mix(in srgb, var(--bio-ink) 8%, transparent);
}
.bio-embed img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
.bio-embed-label {
  display: block;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: inherit;
  text-decoration: none;
}
.bio-spotify iframe {
  width: 100%;
  height: 152px;
  border: 0;
  border-radius: 12px;
}
.bio-empty {
  color: var(--bio-muted);
  font-size: 0.9rem;
}
@media (min-width: 720px) {
  .bio-page { padding-top: 4rem; }
}
</style>
</head>
<body>
<main class="bio-page">
  <header>
    ${avatar}
    <h1 class="bio-name">${name}${verified}</h1>
    ${bio}
  </header>
  <div class="bio-stack">
    ${blocks || `<p class="bio-empty">Add links to get started</p>`}
  </div>
</main>
</body>
</html>`;
}

export function renderBioMarkdown(config: BioPageConfig): string {
  const lines: string[] = [
    `# ${config.profile.displayName.trim() || "Links"}`,
  ];
  if (config.profile.bio.trim()) {
    lines.push("", config.profile.bio.trim());
  }
  lines.push("");
  for (const block of exportableBlocks(config)) {
    switch (block.type) {
      case "link":
        lines.push(
          `- [${block.label.trim()}](${normalizeBioUrl(block.url)})`,
        );
        break;
      case "social": {
        const urls = (block.urls.length ? block.urls : [block.url]).filter(
          isValidBioUrl,
        );
        for (const u of urls) {
          const p = detectSocialPlatform(u);
          lines.push(`- [${p}](${normalizeBioUrl(u)})`);
        }
        break;
      }
      case "embed":
        lines.push(
          `- [${block.label.trim() || "Embed"}](${normalizeBioUrl(block.url)})`,
        );
        break;
      case "header":
        lines.push("", `## ${block.text.trim()}`, "");
        break;
      case "image":
        if (block.imageData) {
          lines.push(
            `![${block.imageAlt.trim() || "Banner"}](${block.imageData.slice(0, 64)}…)`,
          );
        }
        break;
    }
  }
  return lines.join("\n").trim() + "\n";
}

export function renderBioJson(config: BioPageConfig): string {
  return JSON.stringify(config, null, 2);
}

export function saveBioDraft(config: BioPageConfig): void {
  try {
    localStorage.setItem(
      BIO_STORAGE_KEY,
      JSON.stringify({ savedAt: Date.now(), config }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function loadBioDraft(): { savedAt: number; config: BioPageConfig } | null {
  try {
    const raw = localStorage.getItem(BIO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt?: number; config?: unknown };
    const config = parseBioConfig(parsed.config);
    if (!config) return null;
    return { savedAt: parsed.savedAt || Date.now(), config };
  } catch {
    return null;
  }
}

export function clearBioDraft(): void {
  try {
    localStorage.removeItem(BIO_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function isDefaultLookingConfig(config: BioPageConfig): boolean {
  const emptyProfile =
    !config.profile.displayName.trim() &&
    !config.profile.bio.trim() &&
    !config.profile.avatarData &&
    !config.profile.verified;
  const emptyBlocks = config.blocks.every((b) => {
    if (b.type === "header") return !b.text.trim() || b.text === "Section";
    if (b.type === "image") return !b.imageData;
    if (b.type === "social") {
      return (b.urls.length ? b.urls : [b.url]).every((u) => !u.trim());
    }
    return !b.label.trim() && !b.url.trim();
  });
  return emptyProfile && emptyBlocks;
}

export function runBioLink(
  options: Record<string, string>,
  format: "html" | "markdown" | "json" = "html",
): TextResult {
  const config = configFromToolOptions(options);
  if (!canExportBio(config)) {
    throw new Error(
      "Add a display name or at least one complete block to export",
    );
  }

  if (format === "json") {
    const text = renderBioJson(config);
    return {
      text,
      meta: { blocks: exportableBlocks(config).length, format: "json" },
    };
  }

  if (format === "markdown") {
    return {
      text: renderBioMarkdown(config),
      meta: { blocks: exportableBlocks(config).length, format: "markdown" },
    };
  }

  const html = renderBioHtml(config);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  return {
    text: html,
    download: { blob, filename: "bio-link.html" },
    meta: { blocks: exportableBlocks(config).length, format: "html" },
  };
}

/** Read a file as a compressed-enough data URL (max edge ~512 for avatars, ~1200 for banners) */
export async function fileToDataUrl(
  file: File,
  opts: { maxEdge?: number; quality?: number } = {},
): Promise<string> {
  const maxEdge = opts.maxEdge ?? 512;
  const quality = opts.quality ?? 0.82;
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}
