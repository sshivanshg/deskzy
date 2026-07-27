"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import {
  BIO_THEMES,
  COUNTRY_CODES,
  UTM_PRESETS,
  buildUtmUrl,
  buildWhatsAppUrl,
  parseBioLinks,
  renderBioHtml,
  validBioLinks,
  type BioLinkItem,
  type BioTheme,
  type UtmPresetId,
} from "@/lib/tools/links";

type OptionsProps = {
  options: Record<string, string>;
  setOptions: (o: Record<string, string>) => void;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm text-[var(--muted)]">
      <span className="mb-1.5 block font-medium text-[var(--ink)]">{label}</span>
      {children}
    </label>
  );
}

function LiveUrl({ url, warning }: { url: string | null; warning?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--bg)] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Live preview
      </p>
      <p className="mt-2 break-all font-mono text-sm text-[var(--ink)]">
        {url || "Fill in the fields to preview your link"}
      </p>
      {warning && (
        <p className="mt-2 text-xs text-[var(--warn-ink)]">{warning}</p>
      )}
    </div>
  );
}

export function UtmBuilderForm({ options, setOptions }: OptionsProps) {
  const set = (k: string, v: string) => setOptions({ ...options, [k]: v });

  const preview = useMemo(() => {
    try {
      return buildUtmUrl({
        baseUrl: options.baseUrl || "",
        source: options.source || "",
        medium: options.medium || "",
        campaign: options.campaign || "",
        term: options.term,
        content: options.content,
      });
    } catch {
      return null;
    }
  }, [options]);

  function applyPreset(id: UtmPresetId) {
    const p = UTM_PRESETS[id];
    setOptions({
      ...options,
      preset: id,
      source: p.source,
      medium: p.medium,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-[var(--muted)]">Presets</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(UTM_PRESETS) as UtmPresetId[]).map((id) => (
            <button
              key={id}
              type="button"
              className="chip"
              data-active={options.preset === id}
              onClick={() => applyPreset(id)}
            >
              {UTM_PRESETS[id].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Base URL">
            <input
              value={options.baseUrl || ""}
              onChange={(e) => set("baseUrl", e.target.value)}
              placeholder="https://example.com/landing"
              className="field"
            />
          </Field>
        </div>
        <Field label="utm_source">
          <input
            value={options.source || ""}
            onChange={(e) => set("source", e.target.value)}
            placeholder="google"
            className="field"
          />
        </Field>
        <Field label="utm_medium">
          <input
            value={options.medium || ""}
            onChange={(e) => set("medium", e.target.value)}
            placeholder="cpc"
            className="field"
          />
        </Field>
        <Field label="utm_campaign">
          <input
            value={options.campaign || ""}
            onChange={(e) => set("campaign", e.target.value)}
            placeholder="spring_sale"
            className="field"
          />
        </Field>
        <Field label="utm_term (optional)">
          <input
            value={options.term || ""}
            onChange={(e) => set("term", e.target.value)}
            placeholder="keyword"
            className="field"
          />
        </Field>
        <Field label="utm_content (optional)">
          <input
            value={options.content || ""}
            onChange={(e) => set("content", e.target.value)}
            placeholder="banner_a"
            className="field"
          />
        </Field>
      </div>

      <LiveUrl url={preview?.url ?? null} warning={preview?.warning} />

      {preview?.url && (
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href={`/tools/url-shortener`}
            className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]"
            onClick={() => {
              try {
                sessionStorage.setItem("deskzy:prefill-url", preview.url);
              } catch {
                /* ignore */
              }
            }}
          >
            Shorten with Deskzy
          </Link>
          <Link
            href={`/tools/qr-code?url=${encodeURIComponent(preview.url)}`}
            className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Make QR
          </Link>
        </div>
      )}
    </div>
  );
}

export function WhatsAppLinkForm({ options, setOptions }: OptionsProps) {
  const set = (k: string, v: string) => setOptions({ ...options, [k]: v });
  const country = options.country || "IN";
  const selected = COUNTRY_CODES.find((c) => c.code === country) || COUNTRY_CODES[0];
  const dial = country === "OTHER" ? options.dial || "" : selected.dial;

  const preview = useMemo(() => {
    try {
      return buildWhatsAppUrl({
        dial,
        phone: options.phone || "",
        message: options.message,
      });
    } catch {
      return null;
    }
  }, [dial, options.phone, options.message]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Country">
          <select
            value={country}
            onChange={(e) => {
              const next = e.target.value;
              const match = COUNTRY_CODES.find((c) => c.code === next);
              setOptions({
                ...options,
                country: next,
                dial: next === "OTHER" ? options.dial || "" : match?.dial || "",
              });
            }}
            className="field"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
                {c.dial ? ` (+${c.dial})` : ""}
              </option>
            ))}
          </select>
        </Field>
        {country === "OTHER" ? (
          <Field label="Country code">
            <input
              value={options.dial || ""}
              onChange={(e) => set("dial", e.target.value)}
              placeholder="91"
              className="field"
              inputMode="numeric"
            />
          </Field>
        ) : (
          <Field label="Dial code">
            <input value={`+${selected.dial}`} disabled className="field opacity-70" />
          </Field>
        )}
        <div className="sm:col-span-2">
          <Field label="Phone number">
            <input
              value={options.phone || ""}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="9876543210"
              className="field"
              inputMode="tel"
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Prefilled message (optional)">
            <textarea
              value={options.message || ""}
              onChange={(e) => set("message", e.target.value)}
              rows={3}
              placeholder="Hi! I found you on Deskzy…"
              className="field"
            />
          </Field>
        </div>
      </div>

      <LiveUrl url={preview} />

      {preview && (
        <Link
          href={`/tools/qr-code?url=${encodeURIComponent(preview)}`}
          className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Make QR
        </Link>
      )}
    </div>
  );
}

function newLink(): BioLinkItem {
  return {
    id: crypto.randomUUID(),
    label: "",
    url: "",
  };
}

export function BioLinkBuilder({ options, setOptions }: OptionsProps) {
  const [links, setLinks] = useState<BioLinkItem[]>(() => {
    const parsed = parseBioLinks(options.linksJson || "");
    return parsed.length > 0 ? parsed : [newLink(), newLink()];
  });

  const title = options.title || "";
  const subtitle = options.subtitle || "";
  const theme = (options.theme as BioTheme) || "deskzy";
  const themeColors = BIO_THEMES[theme];

  useEffect(() => {
    if (!options.linksJson) {
      setOptions({
        ...options,
        linksJson: JSON.stringify(links),
        theme: options.theme || "deskzy",
        format: options.format || "html",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed once
  }, []);

  function sync(nextLinks: BioLinkItem[], patch: Record<string, string> = {}) {
    setLinks(nextLinks);
    setOptions({
      ...options,
      ...patch,
      linksJson: JSON.stringify(nextLinks),
      format: options.format || "html",
      theme: patch.theme || options.theme || "deskzy",
    });
  }

  const previewHtml = useMemo(() => {
    try {
      return renderBioHtml({
        title: title || "Your name",
        subtitle,
        links,
        theme,
      });
    } catch {
      return "";
    }
  }, [title, subtitle, links, theme]);

  const canExport = validBioLinks(links).length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) =>
              setOptions({
                ...options,
                title: e.target.value,
                linksJson: JSON.stringify(links),
              })
            }
            placeholder="Alex Chen"
            className="field"
          />
        </Field>
        <Field label="Subtitle (optional)">
          <input
            value={subtitle}
            onChange={(e) =>
              setOptions({
                ...options,
                subtitle: e.target.value,
                linksJson: JSON.stringify(links),
              })
            }
            placeholder="Designer · Maker"
            className="field"
          />
        </Field>

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--ink)]">Theme</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(BIO_THEMES) as BioTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                className="chip"
                data-active={theme === t}
                onClick={() => sync(links, { theme: t })}
              >
                {BIO_THEMES[t].label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--ink)]">
              Links ({links.length}/8)
            </p>
            <button
              type="button"
              className="chip"
              disabled={links.length >= 8}
              onClick={() => {
                if (links.length >= 8) return;
                sync([...links, newLink()]);
              }}
            >
              <Plus size={14} weight="bold" />
              Add link
            </button>
          </div>
          {links.map((link, index) => (
            <div
              key={link.id}
              className="rounded-2xl border border-[var(--stroke)] bg-white/40 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Link {index + 1}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="chip !px-2 !py-1"
                    disabled={index === 0}
                    aria-label="Move up"
                    onClick={() => {
                      if (index === 0) return;
                      const next = [...links];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      sync(next);
                    }}
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="chip !px-2 !py-1"
                    disabled={index === links.length - 1}
                    aria-label="Move down"
                    onClick={() => {
                      if (index === links.length - 1) return;
                      const next = [...links];
                      [next[index], next[index + 1]] = [next[index + 1], next[index]];
                      sync(next);
                    }}
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    className="chip !px-2 !py-1"
                    disabled={links.length <= 1}
                    aria-label="Remove"
                    onClick={() => {
                      if (links.length <= 1) return;
                      sync(links.filter((l) => l.id !== link.id));
                    }}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
              <input
                value={link.label}
                onChange={(e) => {
                  const next = links.map((l) =>
                    l.id === link.id ? { ...l, label: e.target.value } : l,
                  );
                  sync(next);
                }}
                placeholder="Label"
                className="field mb-2 !rounded-xl !py-2"
              />
              <input
                value={link.url}
                onChange={(e) => {
                  const next = links.map((l) =>
                    l.id === link.id ? { ...l, url: e.target.value } : l,
                  );
                  sync(next);
                }}
                placeholder="https://"
                className="field !rounded-xl !py-2"
              />
            </div>
          ))}
        </div>

        {!canExport && (
          <p className="text-xs text-[var(--muted)]">
            Add at least one link with a label and valid URL to export.
          </p>
        )}
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Phone preview
        </p>
        <div
          className="mx-auto overflow-hidden rounded-[2rem] border-[6px] border-[var(--ink)]/80 shadow-xl"
          style={{ maxWidth: 280 }}
        >
          <div
            className="min-h-[420px] px-4 py-8 text-center"
            style={{ background: themeColors.bg, color: themeColors.ink }}
          >
            <p className="text-lg font-semibold tracking-tight">
              {title || "Your name"}
            </p>
            {subtitle ? (
              <p className="mt-1 text-xs" style={{ color: themeColors.muted }}>
                {subtitle}
              </p>
            ) : null}
            <div className="mt-6 space-y-2">
              {validBioLinks(links).map((l) => (
                <div
                  key={l.id}
                  className="rounded-full px-3 py-2.5 text-sm font-semibold"
                  style={{
                    background: themeColors.btn,
                    color: themeColors.btnInk,
                  }}
                >
                  {l.label}
                </div>
              ))}
              {validBioLinks(links).length === 0 && (
                <p className="text-xs" style={{ color: themeColors.muted }}>
                  Links appear here
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Keep HTML in sync for generate — hidden mirror */}
        <textarea
          className="sr-only"
          readOnly
          value={previewHtml}
          aria-hidden
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
