"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  COUNTRY_CODES,
  UTM_PRESETS,
  buildUtmUrl,
  buildWhatsAppUrl,
  type UtmPresetId,
} from "@/lib/tools/links";
import { MultiLinkBuilder } from "./MultiLinkBuilder";
import { SavedPresetsBar } from "./SavedPresetsBar";

export { BioLinkBuilder } from "./BioLinkBuilder";

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
      <SavedPresetsBar
        kind="utm"
        current={options}
        onApply={(payload) => setOptions({ ...options, ...payload })}
      />

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

function parseLinksOption(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map(String).filter(Boolean);
  } catch {
    return [];
  }
}

export function LinkListForm({ options, setOptions }: OptionsProps) {
  const links = useMemo(() => parseLinksOption(options.links), [options.links]);

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1.5 text-sm font-medium text-[var(--ink)]">Your links</p>
        <p className="mb-3 text-xs text-[var(--muted)]">
          Add each link one at a time — better on phones than spaces or Enter.
          Paste several at once into the field if you already copied them.
        </p>
        <MultiLinkBuilder
          links={links}
          onChange={(next) =>
            setOptions({ ...options, links: JSON.stringify(next) })
          }
          density="roomy"
          draftPlaceholder="https://…"
        />
      </div>

      <label className="block text-sm text-[var(--muted)]">
        Custom slug{" "}
        <span className="text-xs text-[var(--accent)]">(Pro)</span>
        <div className="mt-2 flex items-center gap-2">
          <span className="shrink-0 font-mono text-sm text-[var(--muted)]">
            deskzy.xyz/r/
          </span>
          <input
            value={options.slug || ""}
            onChange={(e) =>
              setOptions({ ...options, slug: e.target.value.toLowerCase() })
            }
            placeholder="your-brand"
            className="field flex-1 font-mono"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </label>
    </div>
  );
}
