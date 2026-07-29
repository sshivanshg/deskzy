"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle,
  Copy,
  DownloadSimple,
  LockSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import type { ToolDefinition } from "@/lib/tools/registry";
import { getRelatedTools, getToolsByCategory } from "@/lib/tools/registry";
import {
  formatTargetLabel,
  getImagePreset,
  IMAGE_PREPARE_PRESETS,
  parseTargetBytes,
} from "@/lib/tools/image-presets";
import { freeDailyCap } from "@/lib/entitlements";
import {
  BioLinkBuilder,
  UtmBuilderForm,
  WhatsAppLinkForm,
} from "./LinkToolForms";
import { Dropzone } from "./Dropzone";
import { ToolBusyEffect } from "./ToolBusyEffect";
import { UpgradeModal, gateToolUsage } from "./UpgradeModal";
import { SavedPresetsBar } from "./SavedPresetsBar";
import { runTool } from "@/lib/tools/run";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const searchParams = useSearchParams();
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [meta, setMeta] = useState<Record<string, string | number> | null>(
    null,
  );
  const [options, setOptions] = useState<Record<string, string>>(() => {
    if (tool.slug === "whatsapp-link") return { country: "IN", dial: "91" };
    if (tool.slug === "bio-link") return { theme: "deskzy", format: "html" };
    if (tool.slug === "url-shortener") return { slug: "" };
    if (tool.slug === "compress-image") {
      return {
        preset: "web",
        quality: "0.8",
        maxEdge: "1920",
        targetBytes: "400000",
        targetValue: "400",
        targetUnit: "kb",
      };
    }
    if (tool.slug === "resize-image") {
      return {
        preset: "web",
        width: "1920",
        height: "1920",
        keepAspect: "1",
      };
    }
    return {} as Record<string, string>;
  });
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeInfo, setUpgradeInfo] = useState<{
    used?: number;
    limit?: number;
    message?: string;
  }>({});

  useEffect(() => {
    if (tool.slug === "qr-code") {
      const fromQuery = searchParams.get("url");
      if (fromQuery) setText(fromQuery);
    }
    if (tool.slug === "url-shortener") {
      try {
        const prefill = sessionStorage.getItem("deskzy:prefill-url");
        if (prefill) {
          setText(prefill);
          sessionStorage.removeItem("deskzy:prefill-url");
        }
      } catch {
        /* ignore */
      }
    }
  }, [tool.slug, searchParams]);

  const siblings = useMemo(
    () => getToolsByCategory(tool.category).filter((t) => t.slug !== tool.slug),
    [tool],
  );
  const related = useMemo(() => getRelatedTools(tool.slug), [tool.slug]);
  const categoryTools = getToolsByCategory(tool.category);

  const privacy =
    tool.runtime === "browser"
      ? "Stays in browser"
      : tool.runtime === "hybrid"
        ? "API for links only"
        : "Processed on server";

  async function onRun(override?: Record<string, string>) {
    setBusy(true);
    setError(null);
    setCopied(false);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultName(null);
    setResultText(null);
    setMeta(null);
    const merged = { ...options, ...override };
    if (override?.format) setOptions(merged);
    try {
      if (freeDailyCap(tool.slug) !== null) {
        const gate = await gateToolUsage(tool.slug);
        if (!gate.ok) {
          setUpgradeInfo({
            used: gate.used,
            limit: gate.limit,
            message: gate.message,
          });
          setUpgradeOpen(true);
          setBusy(false);
          return;
        }
      }

      const out = await runTool(tool.slug, { files, text, options: merged });
      if (out.kind === "file") {
        const url = URL.createObjectURL(out.blob);
        setResultUrl(url);
        setResultName(out.filename);
        setMeta(out.meta ?? null);
      } else {
        setResultText(out.text);
        setMeta(out.meta ?? null);
        if (out.download) {
          const url = URL.createObjectURL(out.download.blob);
          setResultUrl(url);
          setResultName(out.download.filename);
        }
        if (tool.slug === "bio-link" && override?.format === "markdown") {
          try {
            await navigator.clipboard.writeText(out.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {
            /* clipboard may be blocked */
          }
        }
      }
    } catch (e) {
      const err = e as Error & { upgradeUrl?: string; status?: number };
      if (err.status === 402 || err.upgradeUrl) {
        setUpgradeInfo({ message: err.message });
        setUpgradeOpen(true);
      } else {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFiles([]);
    setText("");
    setResultText(null);
    setMeta(null);
    setError(null);
    setCopied(false);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultName(null);
  }

  const canRun =
    tool.input === "form"
      ? tool.slug === "utm-builder"
        ? Boolean(options.baseUrl?.trim())
        : tool.slug === "whatsapp-link"
          ? Boolean(options.phone?.trim())
          : tool.slug === "bio-link"
            ? Boolean(options.linksJson)
            : true
      : tool.input === "text"
        ? tool.slug === "uuid-generator" ||
          tool.slug === "password-generator" ||
          text.trim().length > 0
        : tool.input === "files"
          ? files.length > 0
          : files.length === 1;

  const done = Boolean(resultUrl || resultText);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[220px_1fr] lg:py-12">
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {tool.category} tools
          </p>
          <ul className="mt-3 space-y-1">
            {categoryTools.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                    t.slug === tool.slug
                      ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                      : "text-[var(--muted)] hover:bg-white/50 hover:text-[var(--ink)]"
                  }`}
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="reveal min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <Link
            href={`/${tool.category}`}
            className="rounded-full border border-[var(--stroke)] bg-white/40 px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.12em] hover:text-[var(--ink)]"
          >
            {tool.category}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--ink)]">{tool.name}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
            {tool.name}
            <span className="block text-lg font-normal text-[var(--muted)] md:text-xl">
              Private &amp; free
            </span>
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
            <LockSimple size={12} weight="bold" />
            {privacy}
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-[var(--muted)] leading-relaxed">
          {tool.description}
        </p>

        <div className="mt-8 space-y-4">
          <ToolBusyEffect active={busy} slug={tool.slug}>
            <div className={busy ? "min-h-[12rem]" : undefined}>
              {tool.input === "form" ? (
                <div className="shell">
                  <div className="shell-core p-5 md:p-6">
                    <ToolOptions
                      slug={tool.slug}
                      options={options}
                      setOptions={setOptions}
                    />
                  </div>
                </div>
              ) : tool.input === "text" ? (
                tool.slug === "uuid-generator" ||
                tool.slug === "password-generator" ? (
                  <div className="shell">
                    <div className="shell-core px-5 py-4 text-sm text-[var(--muted)]">
                      Set your options below, then generate. Nothing is stored.
                    </div>
                  </div>
                ) : (
                  <div className="shell">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={10}
                      placeholder="Paste input here…"
                      className="field field-mono !rounded-[calc(var(--radius-core)-2px)] !border-0 bg-transparent shadow-none focus:!shadow-none"
                      disabled={busy}
                    />
                  </div>
                )
              ) : (
                <Dropzone
                  accept={tool.accept}
                  multiple={tool.input === "files"}
                  files={files}
                  onChange={setFiles}
                />
              )}

              {tool.input !== "form" && (
                <div className="mt-4">
                  <ToolOptions
                    slug={tool.slug}
                    options={options}
                    setOptions={setOptions}
                  />
                </div>
              )}
            </div>
          </ToolBusyEffect>

          <div className="flex flex-wrap gap-3 pt-1">
            {tool.slug === "bio-link" ? (
              <>
                <button
                  type="button"
                  disabled={!canRun || busy}
                  onClick={() => onRun({ format: "html" })}
                  className="btn-primary"
                >
                  {busy ? (
                    <>
                      <span className="busy-dot" />
                      Working
                    </>
                  ) : (
                    <>
                      Download HTML
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                        <ArrowRight size={14} weight="bold" />
                      </span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={!canRun || busy}
                  className="btn-secondary"
                  onClick={() => onRun({ format: "markdown" })}
                >
                  {copied ? "Copied Markdown" : "Copy Markdown"}
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={!canRun || busy}
                onClick={() => onRun()}
                className="btn-primary"
              >
                {busy ? (
                  <>
                    <span className="busy-dot" />
                    Working
                  </>
                ) : (
                  <>
                    {actionLabel(tool.slug)}
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                      <ArrowRight size={14} weight="bold" />
                    </span>
                  </>
                )}
              </button>
            )}
            {done && (
              <button type="button" className="btn-secondary" onClick={reset}>
                Start over
              </button>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--warn-ink)_20%,transparent)] bg-[var(--warn-bg)] px-4 py-3 text-sm text-[var(--warn-ink)]">
              <span className="mt-0.5 shrink-0">
                <WarningCircle size={18} weight="fill" />
              </span>
              <p>{error}</p>
            </div>
          )}

          {done && (
            <div className="shell reveal">
              <div className="shell-core p-5 md:p-6">
                <div className="flex items-center gap-2 text-[var(--ok-ink)]">
                  <CheckCircle size={18} weight="fill" />
                  <p className="text-sm font-semibold">Done</p>
                </div>
                {meta && (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {Object.entries(meta)
                      .map(([k, v]) =>
                        k === "before" || k === "after"
                          ? `${k}: ${formatBytes(Number(v))}`
                          : `${k}: ${v}`,
                      )
                      .join(" · ")}
                  </p>
                )}

                {resultText && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--bg)]">
                    {resultText.startsWith("data:image") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resultText}
                        alt="Generated QR code"
                        className="mx-auto max-w-xs p-6"
                      />
                    ) : (
                      <pre className="max-h-80 overflow-auto p-4 text-sm whitespace-pre-wrap">
                        {resultText}
                      </pre>
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {resultUrl && resultName && (
                    <a
                      href={resultUrl}
                      download={resultName}
                      className="btn-primary"
                    >
                      <DownloadSimple size={16} weight="bold" />
                      Download
                      <span className="max-w-[10rem] truncate opacity-80">
                        {resultName}
                      </span>
                    </a>
                  )}
                  {resultText && !resultText.startsWith("data:image") && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={async () => {
                        await navigator.clipboard.writeText(resultText);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1600);
                      }}
                    >
                      <Copy size={16} weight="bold" />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  )}
                  {(tool.slug === "utm-builder" ||
                    tool.slug === "whatsapp-link" ||
                    tool.slug === "url-shortener") &&
                    resultText &&
                    !resultText.startsWith("data:image") && (
                      <Link
                        href={`/tools/qr-code?url=${encodeURIComponent(resultText)}`}
                        className="btn-secondary"
                      >
                        Make QR
                      </Link>
                    )}
                  {tool.slug === "utm-builder" && resultText && (
                    <Link
                      href="/tools/url-shortener"
                      className="btn-secondary"
                      onClick={() => {
                        try {
                          sessionStorage.setItem(
                            "deskzy:prefill-url",
                            resultText,
                          );
                        } catch {
                          /* ignore */
                        }
                      }}
                    >
                      Shorten
                    </Link>
                  )}
                </div>

                {related.length > 0 && (
                  <div className="mt-6 border-t border-[var(--stroke)] pt-5">
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      Next up
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {related.map((t) => (
                        <Link
                          key={t.slug}
                          href={`/tools/${t.slug}`}
                          className="chip hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                          {t.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-2 lg:hidden">
          {siblings.slice(0, 6).map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="chip">
              {t.name}
            </Link>
          ))}
        </div>
      </div>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        used={upgradeInfo.used}
        limit={upgradeInfo.limit}
        message={upgradeInfo.message}
      />
    </div>
  );
}

function actionLabel(slug: string) {
  if (slug.includes("compress")) return "Compress";
  if (slug.includes("merge")) return "Merge";
  if (slug.includes("split")) return "Split";
  if (
    slug.includes("convert") ||
    slug.includes("webp") ||
    slug.includes("markdown")
  )
    return "Convert";
  if (slug === "url-shortener") return "Shorten";
  if (slug === "utm-builder" || slug === "whatsapp-link") return "Generate link";
  if (slug.includes("generator") || slug === "qr-code") return "Generate";
  if (slug === "json-formatter") return "Format";
  return "Run";
}

function ToolOptions({
  slug,
  options,
  setOptions,
}: {
  slug: string;
  options: Record<string, string>;
  setOptions: (o: Record<string, string>) => void;
}) {
  const set = (k: string, v: string) => setOptions({ ...options, [k]: v });

  if (slug === "compress-pdf") {
    return (
      <OptionRow label="Quality">
        {(["balanced", "smallest", "high"] as const).map((q) => (
          <button
            key={q}
            type="button"
            className="chip"
            data-active={(options.quality || "balanced") === q}
            onClick={() => set("quality", q)}
          >
            {q}
          </button>
        ))}
      </OptionRow>
    );
  }
  if (slug === "split-pdf") {
    return (
      <div className="space-y-3">
        <OptionRow label="Mode">
          <button
            type="button"
            className="chip"
            data-active={(options.mode || "range") === "range"}
            onClick={() => set("mode", "range")}
          >
            Page range
          </button>
          <button
            type="button"
            className="chip"
            data-active={options.mode === "all"}
            onClick={() => set("mode", "all")}
          >
            All pages (ZIP)
          </button>
        </OptionRow>
        {(options.mode || "range") === "range" && (
          <div className="flex flex-wrap gap-3">
            <label className="text-sm text-[var(--muted)]">
              From
              <input
                type="number"
                min={1}
                value={options.start || "1"}
                onChange={(e) => set("start", e.target.value)}
                className="field ml-2 !inline-flex !w-20 !rounded-xl !py-2"
              />
            </label>
            <label className="text-sm text-[var(--muted)]">
              To
              <input
                type="number"
                min={1}
                value={options.end || "1"}
                onChange={(e) => set("end", e.target.value)}
                className="field ml-2 !inline-flex !w-20 !rounded-xl !py-2"
              />
            </label>
          </div>
        )}
      </div>
    );
  }
  if (slug === "compress-image") {
    const presetId = options.preset || "web";
    const preset = getImagePreset(presetId);
    const isCustom = presetId === "custom";
    return (
      <div className="space-y-3">
        <SavedPresetsBar
          kind="image"
          current={options}
          onApply={(payload) => setOptions({ ...options, ...payload })}
        />
        <OptionRow label="Use case">
          {IMAGE_PREPARE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              data-active={presetId === p.id}
              onClick={() => {
                if (p.id === "custom") {
                  setOptions({
                    ...options,
                    preset: "custom",
                    quality: options.quality || "0.7",
                    maxEdge: options.maxEdge || "",
                    targetBytes: options.targetBytes || "",
                    targetValue: options.targetValue || "",
                    targetUnit: options.targetUnit || "kb",
                  });
                  return;
                }
                setOptions({
                  ...options,
                  preset: p.id,
                  quality: String(p.quality),
                  maxEdge: String(p.maxEdge),
                  targetBytes: p.targetBytes ? String(p.targetBytes) : "",
                  targetValue: p.targetBytes
                    ? String(Math.round(p.targetBytes / 1024))
                    : "",
                  targetUnit: "kb",
                });
              }}
            >
              {p.label}
            </button>
          ))}
        </OptionRow>
        {preset && !isCustom ? (
          <p className="text-xs text-[var(--muted)]">{preset.hint}</p>
        ) : null}
        {isCustom ? (
          <div className="space-y-3">
            <OptionRow label="Quality">
              {[0.9, 0.7, 0.5].map((q) => (
                <button
                  key={q}
                  type="button"
                  className="chip"
                  data-active={Number(options.quality || "0.7") === q}
                  onClick={() => set("quality", String(q))}
                >
                  {q === 0.9 ? "High" : q === 0.7 ? "Balanced" : "Smallest"}
                </button>
              ))}
            </OptionRow>
            <div className="flex flex-wrap items-end gap-3 text-sm">
              <label className="text-[var(--muted)]">
                Max edge (px)
                <input
                  type="number"
                  min={0}
                  placeholder="optional"
                  value={options.maxEdge || ""}
                  onChange={(e) => set("maxEdge", e.target.value)}
                  className="field mt-1 !w-28 !rounded-xl !py-2"
                />
              </label>
              <label className="text-[var(--muted)]">
                Under
                <span className="mt-1 flex gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 400"
                    value={options.targetValue || ""}
                    onChange={(e) => {
                      const targetValue = e.target.value;
                      const targetBytes = parseTargetBytes(
                        targetValue,
                        options.targetUnit || "kb",
                      );
                      setOptions({
                        ...options,
                        targetValue,
                        targetBytes: targetBytes ? String(targetBytes) : "",
                      });
                    }}
                    className="field !w-24 !rounded-xl !py-2"
                  />
                  <select
                    value={options.targetUnit || "kb"}
                    onChange={(e) => {
                      const targetUnit = e.target.value;
                      const targetBytes = parseTargetBytes(
                        options.targetValue,
                        targetUnit,
                      );
                      setOptions({
                        ...options,
                        targetUnit,
                        targetBytes: targetBytes ? String(targetBytes) : "",
                      });
                    }}
                    className="field !w-20 !rounded-xl !py-2"
                  >
                    <option value="kb">KB</option>
                    <option value="mb">MB</option>
                  </select>
                </span>
              </label>
            </div>
          </div>
        ) : null}
        {options.targetBytes ? (
          <p className="text-xs text-[var(--muted)]">
            Will aim for under {formatTargetLabel(Number(options.targetBytes))}
            {Number(options.maxEdge) > 0
              ? ` · max ${options.maxEdge}px`
              : ""}
            . PNG may convert to JPEG to hit the size.
          </p>
        ) : null}
      </div>
    );
  }
  if (slug === "resize-image") {
    const presetId = options.preset || "custom";
    return (
      <div className="space-y-3">
        <OptionRow label="Use case">
          {IMAGE_PREPARE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              data-active={presetId === p.id}
              onClick={() => {
                if (p.id === "custom") {
                  set("preset", "custom");
                  return;
                }
                setOptions({
                  ...options,
                  preset: p.id,
                  width: String(p.width),
                  height: String(p.height),
                  keepAspect: "1",
                });
              }}
            >
              {p.label}
            </button>
          ))}
        </OptionRow>
        <div className="flex flex-wrap items-end gap-3 text-sm">
          <label className="text-[var(--muted)]">
            Width
            <input
              type="number"
              value={options.width || "800"}
              onChange={(e) => {
                setOptions({
                  ...options,
                  preset: "custom",
                  width: e.target.value,
                });
              }}
              className="field mt-1 !w-28 !rounded-xl !py-2"
            />
          </label>
          <label className="text-[var(--muted)]">
            Height
            <input
              type="number"
              value={options.height || "600"}
              onChange={(e) => {
                setOptions({
                  ...options,
                  preset: "custom",
                  height: e.target.value,
                });
              }}
              className="field mt-1 !w-28 !rounded-xl !py-2"
            />
          </label>
          <label className="mb-2 flex items-center gap-2 text-[var(--muted)]">
            <input
              id="keep-aspect"
              type="checkbox"
              checked={options.keepAspect !== "0"}
              onChange={(e) => set("keepAspect", e.target.checked ? "1" : "0")}
            />
            Keep aspect
          </label>
        </div>
      </div>
    );
  }
  if (slug === "convert-image") {
    return (
      <OptionRow label="Format">
        {(["image/png", "image/jpeg", "image/webp"] as const).map((f) => (
          <button
            key={f}
            type="button"
            className="chip"
            data-active={(options.format || "image/png") === f}
            onClick={() => set("format", f)}
          >
            {f.split("/")[1].toUpperCase()}
          </button>
        ))}
      </OptionRow>
    );
  }
  if (slug === "base64" || slug === "url-encode") {
    return (
      <OptionRow label="Mode">
        <button
          type="button"
          className="chip"
          data-active={(options.mode || "encode") === "encode"}
          onClick={() => set("mode", "encode")}
        >
          Encode
        </button>
        <button
          type="button"
          className="chip"
          data-active={options.mode === "decode"}
          onClick={() => set("mode", "decode")}
        >
          Decode
        </button>
      </OptionRow>
    );
  }
  if (slug === "hash-generator") {
    return (
      <OptionRow label="Algorithm">
        <button
          type="button"
          className="chip"
          data-active={(options.algo || "SHA-256") === "SHA-256"}
          onClick={() => set("algo", "SHA-256")}
        >
          SHA-256
        </button>
        <button
          type="button"
          className="chip"
          data-active={options.algo === "SHA-1"}
          onClick={() => set("algo", "SHA-1")}
        >
          SHA-1
        </button>
      </OptionRow>
    );
  }
  if (slug === "uuid-generator") {
    return (
      <label className="text-sm text-[var(--muted)]">
        Count
        <input
          type="number"
          min={1}
          max={100}
          value={options.count || "5"}
          onChange={(e) => set("count", e.target.value)}
          className="field ml-2 !inline-flex !w-24 !rounded-xl !py-2"
        />
      </label>
    );
  }
  if (slug === "case-converter") {
    return (
      <OptionRow label="Case">
        {(["upper", "lower", "title", "sentence"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className="chip"
            data-active={(options.mode || "upper") === m}
            onClick={() => set("mode", m)}
          >
            {m}
          </button>
        ))}
      </OptionRow>
    );
  }
  if (slug === "password-generator") {
    return (
      <div className="flex flex-wrap items-end gap-4 text-sm">
        <label className="text-[var(--muted)]">
          Length
          <input
            type="number"
            min={8}
            max={128}
            value={options.length || "20"}
            onChange={(e) => set("length", e.target.value)}
            className="field mt-1 !w-24 !rounded-xl !py-2"
          />
        </label>
        <label className="mb-2 flex items-center gap-2 text-[var(--muted)]">
          <input
            type="checkbox"
            checked={options.numbers !== "0"}
            onChange={(e) => set("numbers", e.target.checked ? "1" : "0")}
          />
          Numbers
        </label>
        <label className="mb-2 flex items-center gap-2 text-[var(--muted)]">
          <input
            type="checkbox"
            checked={options.symbols !== "0"}
            onChange={(e) => set("symbols", e.target.checked ? "1" : "0")}
          />
          Symbols
        </label>
      </div>
    );
  }
  if (slug === "reorder-pdf") {
    return (
      <label className="block text-sm text-[var(--muted)]">
        Page order (comma-separated, 1-based)
        <input
          value={options.order || ""}
          onChange={(e) => set("order", e.target.value)}
          placeholder="e.g. 3,1,2,4"
          className="field mt-2"
        />
      </label>
    );
  }
  if (slug === "url-shortener") {
    return (
      <div className="mt-3 space-y-2">
        <label className="block text-sm text-[var(--muted)]">
          Custom slug{" "}
          <span className="text-xs text-[var(--accent)]">(Pro)</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="shrink-0 font-mono text-sm text-[var(--muted)]">
              deskzy.xyz/r/
            </span>
            <input
              value={options.slug || ""}
              onChange={(e) => set("slug", e.target.value.toLowerCase())}
              placeholder="your-brand"
              className="field flex-1 font-mono"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </label>
        <p className="text-xs text-[var(--muted)]">
          Leave blank for a random short code. Custom paths require{" "}
          <Link href="/pricing" className="text-[var(--accent)] underline-offset-2 hover:underline">
            Pro
          </Link>
          . Free short links are unlimited.
        </p>
      </div>
    );
  }
  if (slug === "utm-builder") {
    return <UtmBuilderForm options={options} setOptions={setOptions} />;
  }
  if (slug === "whatsapp-link") {
    return <WhatsAppLinkForm options={options} setOptions={setOptions} />;
  }
  if (slug === "bio-link") {
    return <BioLinkBuilder options={options} setOptions={setOptions} />;
  }
  return null;
}

function OptionRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      {children}
    </div>
  );
}
