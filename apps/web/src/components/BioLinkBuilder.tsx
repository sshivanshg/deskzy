"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  CheckCircle,
  Desktop,
  DeviceMobile,
  DotsSixVertical,
  Image as ImageIcon,
  LockSimple,
  Plus,
  SealCheck,
  Trash,
  UploadSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  BIO_FONT_PAIRINGS,
  BIO_THEME_PRESETS,
  blockHasErrors,
  canExportBio,
  configFromToolOptions,
  configToToolOptions,
  createBlock,
  defaultBioConfig,
  detectSocialPlatform,
  exportableBlocks,
  fileToDataUrl,
  isDefaultLookingConfig,
  isSpotifyUrl,
  isValidBioUrl,
  loadBioDraft,
  normalizeBioUrl,
  parseBioConfig,
  parseYoutubeId,
  saveBioDraft,
  validateBlock,
  type BioBlock,
  type BioBlockType,
  type BioButtonStyle,
  type BioFontPairing,
  type BioPageConfig,
  type BioSocialPlatform,
} from "@/lib/tools/bio-link";

type OptionsProps = {
  options: Record<string, string>;
  setOptions: (o: Record<string, string>) => void;
};

const BLOCK_TYPES: {
  type: BioBlockType;
  label: string;
  hint: string;
}[] = [
  { type: "link", label: "Link button", hint: "Standard labeled link" },
  { type: "social", label: "Social icons", hint: "Icon row from URLs" },
  { type: "embed", label: "Embed", hint: "YouTube or Spotify" },
  { type: "header", label: "Section", hint: "Header / divider" },
  { type: "image", label: "Image", hint: "Banner or photo" },
];

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm text-[var(--muted)]">
      <span className="mb-1.5 block font-medium text-[var(--ink)]">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 flex items-center gap-1 text-xs text-[var(--warn-ink)]">
          <WarningCircle size={12} weight="fill" />
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-[var(--muted)]">{hint}</span>
      ) : null}
    </label>
  );
}

function SocialIcon({
  platform,
  size = 18,
}: {
  platform: BioSocialPlatform;
  size?: number;
}) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true as const };
  switch (platform) {
    case "instagram":
      return (
        <svg {...common}>
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.7A2.9 2.9 0 1 1 14.9 12 2.9 2.9 0 0 1 12 14.9zm5.95-8.85a1.15 1.15 0 1 0 1.15 1.15 1.15 1.15 0 0 0-1.15-1.15z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18.9 2H22l-6.8 7.78L23 22h-6.5l-5.1-6.66L5.7 22H2.6l7.28-8.33L1 2h6.66l4.6 6.1L18.9 2zm-1.14 18h1.8L6.36 3.9H4.43L17.76 20z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14.5 3c.4 2.4 1.9 4.1 4.3 4.5v2.7c-1.5-.1-2.9-.6-4.1-1.5v6.4a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v2.9a3 3 0 1 0 2.1 2.9V3h2.7z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 7 12.5l-.2.3.3 1.8-1.8-.3-.3.2A8.2 8.2 0 0 1 4.7 7.8 8.2 8.2 0 0 1 12 3.8zm-3.1 3.3c-.2 0-.5.1-.7.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 1.9.7 2.3.6 2.7.6.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-1.4-.7c-.2-.1-.4 0-.5.1l-.6.7c-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.4l.4-.5c.1-.1.2-.3.1-.4L9.2 7.3c-.1-.3-.3-.3-.3-.3z" />
        </svg>
      );
    case "email":
      return (
        <svg {...common}>
          <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2.2V18h18V7.2l-9 5.4L3 7.2zm1.5-.7L12 11l7.5-4.5H4.5z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M14.5 4.5a4.5 4.5 0 0 1 0 6.4l-1.1 1.1-1.4-1.4 1.1-1.1a2.5 2.5 0 1 0-3.5-3.5L8.5 7.1 7.1 5.7l1.1-1.1a4.5 4.5 0 0 1 6.3-.1zm-3.4 7.5 1.4 1.4-1.1 1.1a2.5 2.5 0 1 0 3.5 3.5l1.1-1.1 1.4 1.4-1.1 1.1a4.5 4.5 0 1 1-6.4-6.4l1.2-1zm.7-2.1 5.7 5.7-1.4 1.4-5.7-5.7 1.4-1.4z" />
        </svg>
      );
  }
}

function buttonRadius(style: BioButtonStyle): string {
  switch (style) {
    case "square":
      return "6px";
    case "rounded":
      return "14px";
    default:
      return "999px";
  }
}

function LivePreview({
  config,
  mode,
}: {
  config: BioPageConfig;
  mode: "phone" | "desktop";
}) {
  const { theme, profile } = config;
  const outline = theme.buttonStyle === "outline";
  const radius = buttonRadius(theme.buttonStyle);
  const font = BIO_FONT_PAIRINGS[theme.fontPairing].family;

  let background: string;
  if (theme.bgMode === "image" && theme.bgImage) {
    background = `${theme.bgColor} center / cover no-repeat url(${theme.bgImage})`;
  } else if (theme.bgMode === "gradient") {
    background = `linear-gradient(160deg, ${theme.bgColor} 0%, ${theme.bgColor2} 100%)`;
  } else {
    background = theme.bgColor;
  }

  const blocks = exportableBlocks(config);
  const showEmpty = blocks.length === 0 && !profile.displayName.trim();

  const inner = (
    <div
      className="min-h-full px-5 py-8 text-center transition-[background] duration-300"
      style={{ background, color: theme.textColor, fontFamily: font }}
    >
      {profile.avatarData ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatarData}
          alt=""
          className="mx-auto mb-3 h-[72px] w-[72px] rounded-full object-cover"
          style={{
            border: `3px solid color-mix(in srgb, ${theme.textColor} 18%, transparent)`,
          }}
        />
      ) : (
        <div
          className="mx-auto mb-3 flex h-[72px] w-[72px] items-center justify-center rounded-full text-xs font-semibold uppercase tracking-wider opacity-50"
          style={{
            border: `2px dashed color-mix(in srgb, ${theme.textColor} 35%, transparent)`,
            color: theme.mutedColor,
          }}
        >
          Photo
        </div>
      )}

      <div className="inline-flex items-center justify-center gap-1.5">
        <p className="text-lg font-semibold tracking-tight">
          {profile.displayName.trim() || "Your name"}
        </p>
        {profile.verified ? (
          <span style={{ color: theme.buttonBg }} aria-label="Verified">
            <SealCheck size={18} weight="fill" />
          </span>
        ) : null}
      </div>

      {profile.bio.trim() ? (
        <p className="mt-1 text-xs leading-relaxed" style={{ color: theme.mutedColor }}>
          {profile.bio}
        </p>
      ) : (
        <p className="mt-1 text-xs opacity-40" style={{ color: theme.mutedColor }}>
          Bio / tagline
        </p>
      )}

      <div className="mt-6 grid gap-2.5">
        {showEmpty && (
          <p className="text-xs" style={{ color: theme.mutedColor }}>
            Add a link, social row, or section to see it here
          </p>
        )}
        {blocks.map((block) => {
          if (block.type === "link") {
            return (
              <div
                key={block.id}
                className="px-3 py-2.5 text-sm font-semibold"
                style={{
                  borderRadius: radius,
                  background: outline ? "transparent" : theme.buttonBg,
                  color: outline ? theme.buttonBg : theme.buttonText,
                  border: outline
                    ? `2px solid ${theme.buttonBg}`
                    : "2px solid transparent",
                }}
              >
                {block.label}
              </div>
            );
          }
          if (block.type === "social") {
            const urls = (block.urls.length ? block.urls : [block.url]).filter(
              isValidBioUrl,
            );
            return (
              <div key={block.id} className="flex flex-wrap justify-center gap-2 py-1">
                {urls.map((u, i) => (
                  <span
                    key={`${block.id}-${i}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: theme.buttonBg, color: theme.buttonText }}
                  >
                    <SocialIcon platform={detectSocialPlatform(u)} />
                  </span>
                ))}
              </div>
            );
          }
          if (block.type === "header") {
            return (
              <p
                key={block.id}
                className="pt-2 text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: theme.mutedColor }}
              >
                {block.text}
              </p>
            );
          }
          if (block.type === "image" && block.imageData) {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={block.id}
                src={block.imageData}
                alt={block.imageAlt || ""}
                className="w-full rounded-2xl object-cover"
              />
            );
          }
          if (block.type === "embed") {
            const yt = parseYoutubeId(block.url);
            if (yt) {
              return (
                <div
                  key={block.id}
                  className="overflow-hidden rounded-2xl text-left"
                  style={{
                    background: `color-mix(in srgb, ${theme.textColor} 8%, transparent)`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${yt}/hqdefault.jpg`}
                    alt=""
                    className="aspect-video w-full object-cover"
                  />
                  <p className="px-3 py-2 text-xs font-semibold">
                    {block.label.trim() || "Watch on YouTube"}
                  </p>
                </div>
              );
            }
            if (isSpotifyUrl(block.url)) {
              return (
                <div
                  key={block.id}
                  className="rounded-2xl px-3 py-4 text-left text-xs font-semibold"
                  style={{
                    background: `color-mix(in srgb, ${theme.textColor} 10%, transparent)`,
                  }}
                >
                  Spotify · {block.label.trim() || "Open track"}
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    </div>
  );

  if (mode === "desktop") {
    return (
      <div className="overflow-hidden rounded-2xl border border-[var(--stroke)] shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-[var(--stroke)] bg-white/60 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--stroke-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--stroke-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--stroke-strong)]" />
          <span className="ml-2 truncate font-mono text-[10px] text-[var(--muted)]">
            bio-link.html
          </span>
        </div>
        <div className="max-h-[520px] overflow-y-auto">{inner}</div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto overflow-hidden rounded-[2rem] border-[6px] border-[var(--ink)]/80 shadow-xl"
      style={{ maxWidth: 280 }}
    >
      <div className="max-h-[520px] overflow-y-auto">{inner}</div>
    </div>
  );
}

function BlockEditor({
  block,
  index,
  total,
  onChange,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  dragOver,
}: {
  block: BioBlock;
  index: number;
  total: number;
  onChange: (next: BioBlock) => void;
  onRemove: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  dragOver: boolean;
}) {
  const validation = validateBlock(block);
  const touchedEmpty =
    block.type === "link"
      ? Boolean(block.label || block.url)
      : block.type === "social"
        ? (block.urls.length ? block.urls : [block.url]).some((u) => u.trim())
        : block.type === "embed"
          ? Boolean(block.url || block.label)
          : block.type === "header"
            ? Boolean(block.text.trim() && block.text !== "Section")
            : Boolean(block.imageData);
  const showErrors = touchedEmpty && blockHasErrors(validation);
  const typeMeta = BLOCK_TYPES.find((t) => t.type === block.type);

  return (
    <div
      className={`rounded-2xl border bg-white/40 p-3 transition-colors ${
        dragOver
          ? "border-[var(--accent)] bg-[var(--accent-soft)]/40"
          : "border-[var(--stroke)]"
      }`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-bio-block={block.type}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="chip !cursor-grab !px-1.5 !py-1 active:!cursor-grabbing"
            draggable
            onDragStart={onDragStart}
            aria-label={`Drag to reorder block ${index + 1}`}
            title="Drag to reorder"
          >
            <DotsSixVertical size={16} />
          </button>
          <span className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            {typeMeta?.label || block.type} · {index + 1}/{total}
          </span>
        </div>
        <button
          type="button"
          className="chip !px-2 !py-1"
          aria-label="Remove block"
          onClick={onRemove}
        >
          <Trash size={14} />
        </button>
      </div>

      {block.type === "link" && (
        <div className="space-y-2">
          <input
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder="Label"
            className="field !rounded-xl !py-2"
            aria-invalid={showErrors && Boolean(validation.labelError)}
          />
          {showErrors && validation.labelError ? (
            <p className="text-xs text-[var(--warn-ink)]">{validation.labelError}</p>
          ) : null}
          <input
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="https://"
            className="field !rounded-xl !py-2"
            aria-invalid={showErrors && Boolean(validation.urlError)}
          />
          {showErrors && validation.urlError ? (
            <p className="text-xs text-[var(--warn-ink)]">{validation.urlError}</p>
          ) : null}
        </div>
      )}

      {block.type === "social" && (
        <div className="space-y-2">
          <p className="text-xs text-[var(--muted)]">
            Paste profile URLs — icons are detected automatically (Instagram, X,
            YouTube, TikTok, WhatsApp, Email).
          </p>
          {(block.urls.length ? block.urls : [""]).map((url, i) => {
            const platform = detectSocialPlatform(url);
            const err = showErrors ? validation.urlsErrors?.[i] : undefined;
            return (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--stroke)] bg-white/70 text-[var(--ink)]"
                  title={platform}
                >
                  <SocialIcon platform={platform} size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <input
                    value={url}
                    onChange={(e) => {
                      const urls = [...(block.urls.length ? block.urls : [""])];
                      urls[i] = e.target.value;
                      onChange({ ...block, urls });
                    }}
                    placeholder="https://instagram.com/you"
                    className="field !rounded-xl !py-2"
                  />
                  {err ? (
                    <p className="mt-1 text-xs text-[var(--warn-ink)]">{err}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="chip !px-2 !py-1"
                  aria-label="Remove URL"
                  disabled={(block.urls.length || 1) <= 1}
                  onClick={() => {
                    const urls = (block.urls.length ? block.urls : [""]).filter(
                      (_, j) => j !== i,
                    );
                    onChange({ ...block, urls: urls.length ? urls : [""] });
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
          <button
            type="button"
            className="chip"
            onClick={() =>
              onChange({
                ...block,
                urls: [...(block.urls.length ? block.urls : [""]), ""],
              })
            }
          >
            <Plus size={14} weight="bold" />
            Add social URL
          </button>
        </div>
      )}

      {block.type === "embed" && (
        <div className="space-y-2">
          <input
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
            placeholder="Optional caption"
            className="field !rounded-xl !py-2"
          />
          <input
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="YouTube or Spotify URL"
            className="field !rounded-xl !py-2"
          />
          {showErrors && validation.urlError ? (
            <p className="text-xs text-[var(--warn-ink)]">{validation.urlError}</p>
          ) : (
            <p className="text-xs text-[var(--muted)]">
              Preview card embeds in exported HTML (YouTube thumbnail / Spotify
              player).
            </p>
          )}
        </div>
      )}

      {block.type === "header" && (
        <div className="space-y-2">
          <input
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Section title"
            className="field !rounded-xl !py-2"
          />
          {showErrors && validation.textError ? (
            <p className="text-xs text-[var(--warn-ink)]">{validation.textError}</p>
          ) : null}
        </div>
      )}

      {block.type === "image" && (
        <div className="space-y-2">
          {block.imageData ? (
            <div className="relative overflow-hidden rounded-xl border border-[var(--stroke)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.imageData}
                alt={block.imageAlt || ""}
                className="max-h-36 w-full object-cover"
              />
              <button
                type="button"
                className="chip absolute right-2 top-2 !bg-white/90"
                onClick={() => onChange({ ...block, imageData: "" })}
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-[var(--stroke)] bg-white/50 px-4 py-6 text-center text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
              <ImageIcon size={22} />
              <span>Upload banner image</span>
              <span className="text-xs">Stays in your browser · embedded as base64</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const data = await fileToDataUrl(file, { maxEdge: 1200 });
                    onChange({ ...block, imageData: data });
                  } catch {
                    /* ignore */
                  }
                  e.target.value = "";
                }}
              />
            </label>
          )}
          <input
            value={block.imageAlt}
            onChange={(e) => onChange({ ...block, imageAlt: e.target.value })}
            placeholder="Alt text (optional)"
            className="field !rounded-xl !py-2"
          />
          {showErrors && validation.imageError ? (
            <p className="text-xs text-[var(--warn-ink)]">{validation.imageError}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function BioLinkBuilder({ options, setOptions }: OptionsProps) {
  const [config, setConfig] = useState<BioPageConfig>(() =>
    configFromToolOptions(options),
  );
  const [previewMode, setPreviewMode] = useState<"phone" | "desktop">("phone");
  const [draftPrompt, setDraftPrompt] = useState<{
    savedAt: number;
    config: BioPageConfig;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const seeded = useRef(false);
  const formId = useId();

  const syncOptions = useCallback(
    (next: BioPageConfig) => {
      setConfig(next);
      const mapped = configToToolOptions(next);
      setOptions({
        ...mapped,
        format: options.format === "markdown" || options.format === "json"
          ? options.format
          : "html",
      });
    },
    [options.format, setOptions],
  );

  // Seed options once
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (!options.configJson) {
      setOptions({
        ...options,
        ...configToToolOptions(config),
        format: options.format || "html",
      });
    }
    const draft = loadBioDraft();
    if (
      draft &&
      isDefaultLookingConfig(config) &&
      !isDefaultLookingConfig(draft.config)
    ) {
      setDraftPrompt(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, []);

  // Persist draft (debounced)
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!isDefaultLookingConfig(config)) saveBioDraft(config);
    }, 400);
    return () => window.clearTimeout(t);
  }, [config]);

  function update(patch: Partial<BioPageConfig> | ((c: BioPageConfig) => BioPageConfig)) {
    const next =
      typeof patch === "function" ? patch(config) : { ...config, ...patch };
    syncOptions(next);
  }

  function updateProfile(patch: Partial<BioPageConfig["profile"]>) {
    update({ ...config, profile: { ...config.profile, ...patch } });
  }

  function updateTheme(patch: Partial<BioPageConfig["theme"]>) {
    update({ ...config, theme: { ...config.theme, ...patch } });
  }

  function updateBlock(id: string, next: BioBlock) {
    update({
      ...config,
      blocks: config.blocks.map((b) => (b.id === id ? next : b)),
    });
  }

  function addBlock(type: BioBlockType) {
    update({ ...config, blocks: [...config.blocks, createBlock(type)] });
    setAddMenuOpen(false);
  }

  function removeBlock(id: string) {
    if (config.blocks.length <= 1) {
      update({ ...config, blocks: [createBlock("link")] });
      return;
    }
    update({ ...config, blocks: config.blocks.filter((b) => b.id !== id) });
  }

  function reorder(fromId: string, toId: string) {
    if (fromId === toId) return;
    const blocks = [...config.blocks];
    const from = blocks.findIndex((b) => b.id === fromId);
    const to = blocks.findIndex((b) => b.id === toId);
    if (from < 0 || to < 0) return;
    const [item] = blocks.splice(from, 1);
    blocks.splice(to, 0, item);
    update({ ...config, blocks });
  }

  function applyPreset(id: string) {
    const preset = BIO_THEME_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    updateTheme({ ...config.theme, ...preset.theme });
  }

  function handleImportJson(raw: string) {
    setImportError(null);
    const parsed = parseBioConfig(raw);
    if (!parsed) {
      setImportError("Could not parse that JSON. Use a Deskzy bio export.");
      return;
    }
    syncOptions(parsed);
  }

  const exportReady = canExportBio(config);
  const incompleteCount = config.blocks.filter(
    (b) =>
      (b.type === "link" && (b.label || b.url) && blockHasErrors(validateBlock(b))) ||
      (b.type === "social" &&
        (b.urls.some((u) => u.trim()) || b.url.trim()) &&
        blockHasErrors(validateBlock(b))) ||
      (b.type === "embed" && b.url && blockHasErrors(validateBlock(b))),
  ).length;

  return (
    <div className="space-y-5">
      {draftPrompt && (
        <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-soft)]/50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[var(--ink)]">
              Load previous draft?
            </p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Saved locally{" "}
              {new Date(draftPrompt.savedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              . Nothing left this device.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary !py-2 !text-sm"
              onClick={() => setDraftPrompt(null)}
            >
              Dismiss
            </button>
            <button
              type="button"
              className="btn-primary !py-2 !text-sm"
              onClick={() => {
                syncOptions(draftPrompt.config);
                setDraftPrompt(null);
              }}
            >
              Load draft
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--stroke)] bg-white/40 px-3 py-2 text-xs text-[var(--muted)]">
        <span className="text-[var(--accent)]">
          <LockSimple size={14} weight="bold" />
        </span>
        <span>
          Private builder — avatar, images, and draft stay in your browser.
          Nothing is uploaded. Export HTML to host yourself.
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          {/* Profile */}
          <section className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Profile
            </p>
            <div className="flex items-start gap-4">
              <button
                type="button"
                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[var(--stroke)] bg-white/60"
                onClick={() => avatarInputRef.current?.click()}
                aria-label="Upload profile photo"
              >
                {config.profile.avatarData ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={config.profile.avatarData}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-[var(--muted)]">
                    <UploadSimple size={20} />
                    <span className="text-[10px] font-medium">Photo</span>
                  </span>
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const data = await fileToDataUrl(file, { maxEdge: 512 });
                    updateProfile({ avatarData: data });
                  } catch {
                    /* ignore */
                  }
                  e.target.value = "";
                }}
              />
              <div className="min-w-0 flex-1 space-y-2">
                <Field label="Display name">
                  <input
                    value={config.profile.displayName}
                    onChange={(e) =>
                      updateProfile({ displayName: e.target.value })
                    }
                    placeholder="Alex Chen"
                    className="field"
                  />
                </Field>
                <Field label="Bio / tagline" hint="Optional one-liner under your name">
                  <input
                    value={config.profile.bio}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    placeholder="Designer · Maker"
                    className="field"
                  />
                </Field>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--ink)]">
                <input
                  type="checkbox"
                  checked={config.profile.verified}
                  onChange={(e) =>
                    updateProfile({ verified: e.target.checked })
                  }
                  className="accent-[var(--accent)]"
                />
                <span className="text-[var(--accent)]">
                  <SealCheck size={16} weight="fill" />
                </span>
                Show verified-style badge
              </label>
              {config.profile.avatarData ? (
                <button
                  type="button"
                  className="chip"
                  onClick={() => updateProfile({ avatarData: "" })}
                >
                  Remove photo
                </button>
              ) : null}
            </div>
          </section>

          {/* Theme */}
          <section className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Theme
            </p>
            <div className="flex flex-wrap gap-2">
              {BIO_THEME_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="chip"
                  onClick={() => applyPreset(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Background">
                <div className="flex flex-wrap gap-1.5">
                  {(["solid", "gradient", "image"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className="chip capitalize"
                      data-active={config.theme.bgMode === mode}
                      onClick={() => updateTheme({ bgMode: mode })}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Button style">
                <div className="flex flex-wrap gap-1.5">
                  {(
                    ["filled", "outline", "rounded", "square"] as BioButtonStyle[]
                  ).map((style) => (
                    <button
                      key={style}
                      type="button"
                      className="chip capitalize"
                      data-active={config.theme.buttonStyle === style}
                      onClick={() => updateTheme({ buttonStyle: style })}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Background color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.theme.bgColor}
                    onChange={(e) => updateTheme({ bgColor: e.target.value })}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--stroke)] bg-transparent p-1"
                    aria-label="Background color"
                  />
                  <input
                    value={config.theme.bgColor}
                    onChange={(e) => updateTheme({ bgColor: e.target.value })}
                    className="field !rounded-xl !py-2 font-mono text-xs"
                  />
                </div>
              </Field>
              {config.theme.bgMode === "gradient" ? (
                <Field label="Gradient end">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.theme.bgColor2}
                      onChange={(e) =>
                        updateTheme({ bgColor2: e.target.value })
                      }
                      className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--stroke)] bg-transparent p-1"
                      aria-label="Gradient end color"
                    />
                    <input
                      value={config.theme.bgColor2}
                      onChange={(e) =>
                        updateTheme({ bgColor2: e.target.value })
                      }
                      className="field !rounded-xl !py-2 font-mono text-xs"
                    />
                  </div>
                </Field>
              ) : (
                <Field label="Text color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.theme.textColor}
                      onChange={(e) =>
                        updateTheme({ textColor: e.target.value })
                      }
                      className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--stroke)] bg-transparent p-1"
                      aria-label="Text color"
                    />
                    <input
                      value={config.theme.textColor}
                      onChange={(e) =>
                        updateTheme({ textColor: e.target.value })
                      }
                      className="field !rounded-xl !py-2 font-mono text-xs"
                    />
                  </div>
                </Field>
              )}
            </div>

            {config.theme.bgMode === "image" && (
              <div className="space-y-2">
                {config.theme.bgImage ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="h-12 flex-1 rounded-xl border border-[var(--stroke)] bg-cover bg-center"
                      style={{ backgroundImage: `url(${config.theme.bgImage})` }}
                    />
                    <button
                      type="button"
                      className="chip"
                      onClick={() => updateTheme({ bgImage: "" })}
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="chip"
                    onClick={() => bgInputRef.current?.click()}
                  >
                    <UploadSimple size={14} />
                    Upload background image
                  </button>
                )}
                <input
                  ref={bgInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const data = await fileToDataUrl(file, { maxEdge: 1600 });
                      updateTheme({ bgImage: data, bgMode: "image" });
                    } catch {
                      /* ignore */
                    }
                    e.target.value = "";
                  }}
                />
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Button color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.theme.buttonBg}
                    onChange={(e) => updateTheme({ buttonBg: e.target.value })}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--stroke)] bg-transparent p-1"
                    aria-label="Button color"
                  />
                  <input
                    value={config.theme.buttonBg}
                    onChange={(e) => updateTheme({ buttonBg: e.target.value })}
                    className="field !rounded-xl !py-2 font-mono text-xs"
                  />
                </div>
              </Field>
              <Field label="Button text">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.theme.buttonText}
                    onChange={(e) =>
                      updateTheme({ buttonText: e.target.value })
                    }
                    className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--stroke)] bg-transparent p-1"
                    aria-label="Button text color"
                  />
                  <input
                    value={config.theme.buttonText}
                    onChange={(e) =>
                      updateTheme({ buttonText: e.target.value })
                    }
                    className="field !rounded-xl !py-2 font-mono text-xs"
                  />
                </div>
              </Field>
            </div>

            <Field label="Font pairing">
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(BIO_FONT_PAIRINGS) as BioFontPairing[]).map(
                  (key) => (
                    <button
                      key={key}
                      type="button"
                      className="chip"
                      data-active={config.theme.fontPairing === key}
                      onClick={() => updateTheme({ fontPairing: key })}
                      style={{ fontFamily: BIO_FONT_PAIRINGS[key].family }}
                    >
                      {BIO_FONT_PAIRINGS[key].label}
                    </button>
                  ),
                )}
              </div>
            </Field>
          </section>

          {/* Blocks */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Blocks ({config.blocks.length})
              </p>
              <div className="relative">
                <button
                  type="button"
                  className="chip"
                  onClick={() => setAddMenuOpen((o) => !o)}
                  aria-expanded={addMenuOpen}
                >
                  <Plus size={14} weight="bold" />
                  Add block
                </button>
                {addMenuOpen && (
                  <div className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--bg-elevated)] shadow-lg">
                    {BLOCK_TYPES.map((t) => (
                      <button
                        key={t.type}
                        type="button"
                        className="flex w-full flex-col items-start px-3 py-2.5 text-left text-sm hover:bg-[var(--accent-soft)]"
                        onClick={() => addBlock(t.type)}
                      >
                        <span className="font-medium text-[var(--ink)]">
                          {t.label}
                        </span>
                        <span className="text-xs text-[var(--muted)]">
                          {t.hint}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {config.blocks.length === 0 ||
            (config.blocks.length === 2 &&
              isDefaultLookingConfig(config) &&
              !config.profile.displayName) ? (
              <div className="rounded-2xl border border-dashed border-[var(--stroke)] bg-white/30 px-4 py-6 text-center">
                <p className="text-sm font-medium text-[var(--ink)]">
                  Build your bio page
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Start with a display name, then add link buttons, social icons,
                  embeds, sections, or images. Drag the handle to reorder —
                  unlimited blocks.
                </p>
              </div>
            ) : null}

            <div className="space-y-3" role="list" aria-label="Bio blocks">
              {config.blocks.map((block, index) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  index={index}
                  total={config.blocks.length}
                  onChange={(next) => updateBlock(block.id, next)}
                  onRemove={() => removeBlock(block.id)}
                  dragOver={dragOverId === block.id}
                  onDragStart={(e) => {
                    setDragId(block.id);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", block.id);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverId(block.id);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from =
                      dragId || e.dataTransfer.getData("text/plain");
                    if (from) reorder(from, block.id);
                    setDragId(null);
                    setDragOverId(null);
                  }}
                />
              ))}
            </div>

            {incompleteCount > 0 && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--warn-ink)]">
                <WarningCircle size={14} weight="fill" />
                {incompleteCount} block{incompleteCount === 1 ? "" : "s"} need
                a valid label or URL before they appear in the export.
              </p>
            )}
            {!exportReady && (
              <p className="text-xs text-[var(--muted)]">
                Add a display name or at least one complete block to export.
              </p>
            )}
          </section>

          {/* Import */}
          <section className="space-y-2 border-t border-[var(--stroke)] pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Import
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="chip"
                onClick={() => importInputRef.current?.click()}
              >
                Load JSON file
              </button>
              <button
                type="button"
                className="chip"
                onClick={() => {
                  const raw = window.prompt("Paste bio JSON config");
                  if (raw) handleImportJson(raw);
                }}
              >
                Paste JSON
              </button>
              <button
                type="button"
                className="chip"
                onClick={() => {
                  syncOptions(defaultBioConfig());
                  setImportError(null);
                }}
              >
                Reset builder
              </button>
            </div>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                handleImportJson(text);
                e.target.value = "";
              }}
            />
            {importError ? (
              <p className="text-xs text-[var(--warn-ink)]">{importError}</p>
            ) : (
              <p className="text-xs text-[var(--muted)]">
                Re-import a previous &quot;Copy as JSON&quot; export to continue
                editing.
              </p>
            )}
          </section>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Live preview
            </p>
            <div className="flex gap-1 rounded-full border border-[var(--stroke)] bg-white/50 p-0.5">
              <button
                type="button"
                className="chip !rounded-full !border-0 !px-2.5 !py-1"
                data-active={previewMode === "phone"}
                onClick={() => setPreviewMode("phone")}
                aria-pressed={previewMode === "phone"}
              >
                <DeviceMobile size={14} />
                Phone
              </button>
              <button
                type="button"
                className="chip !rounded-full !border-0 !px-2.5 !py-1"
                data-active={previewMode === "desktop"}
                onClick={() => setPreviewMode("desktop")}
                aria-pressed={previewMode === "desktop"}
              >
                <Desktop size={14} />
                Desktop
              </button>
            </div>
          </div>
          <LivePreview config={config} mode={previewMode} />
          {exportReady ? (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--muted)]">
              <span className="text-[var(--ok-ink)]">
                <CheckCircle size={14} weight="fill" />
              </span>
              Ready to export — updates as you type
            </p>
          ) : null}
          {/* Hidden sync for accessibility / form association */}
          <span id={formId} className="sr-only">
            Bio link builder
          </span>
        </div>
      </div>
    </div>
  );
}

/** Normalize a pasted URL for display helpers */
export function previewHref(url: string): string {
  return normalizeBioUrl(url);
}
