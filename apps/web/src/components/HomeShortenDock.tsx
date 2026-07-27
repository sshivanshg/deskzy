"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LinkSimple } from "@phosphor-icons/react";
import { shortenUrl } from "@/lib/tools/text";

function looksLikeUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    const u = new URL(withProtocol);
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}

export function HomeShortenDock() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | null>(null);

  const clearCopiedTimeout = () => {
    if (copiedTimeoutRef.current !== null) {
      window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = null;
    }
  };

  useEffect(() => () => clearCopiedTimeout(), []);

  const reset = () => {
    clearCopiedTimeout();
    setShortUrl(null);
    setError(null);
    setCopied(false);
    setUrl("");
  };

  const onShorten = async () => {
    if (!looksLikeUrl(url) || busy) return;
    setBusy(true);
    setError(null);
    try {
      const raw = url.trim();
      const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      const result = await shortenUrl(normalized, "/api");
      setShortUrl(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to shorten URL");
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    if (!shortUrl) return;
    setError(null);
    try {
      await navigator.clipboard.writeText(shortUrl);
      clearCopiedTimeout();
      setCopied(true);
      copiedTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        copiedTimeoutRef.current = null;
      }, 1600);
    } catch {
      setError("Could not copy — select the link and copy manually");
    }
  };

  if (shortUrl) {
    return (
      <div className="rounded-2xl border border-[var(--accent)]/28 bg-[var(--accent-soft)] p-3.5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--accent-ink)]">
          <LinkSimple size={18} weight="bold" />
          Short link ready
        </div>
        <p className="mb-3 break-all rounded-xl border border-[var(--stroke)] bg-white px-3 py-2.5 font-mono text-sm text-[var(--ink)]">
          {shortUrl}
        </p>
        <div className="flex gap-2">
          <button type="button" className="btn-primary flex-1 !py-2.5" onClick={onCopy}>
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" className="btn-secondary flex-1 !py-2.5" onClick={reset}>
            Shorten another
          </button>
        </div>
        {error ? (
          <p id="home-shorten-copy-error" className="mt-2 text-sm text-[var(--warn-ink)]" role="alert">
            {error}
          </p>
        ) : null}
        <Link
          href="/tools/url-shortener"
          className="mt-3 inline-block text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Open full shortener
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--accent)]/28 bg-[var(--accent-soft)] p-3.5">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--accent-ink)]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
          <LinkSimple size={16} weight="bold" />
        </span>
        Shorten a link
      </div>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="home-shorten-url">
          URL to shorten
        </label>
        <input
          id="home-shorten-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onShorten();
          }}
          placeholder="https://…"
          disabled={busy}
          className="field min-w-0 flex-1 !rounded-xl !py-2.5 !text-base"
          autoComplete="url"
          inputMode="url"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "home-shorten-error" : undefined}
        />
        <button
          type="button"
          className="btn-primary shrink-0 !px-4 !py-2.5"
          disabled={busy || !looksLikeUrl(url)}
          onClick={() => void onShorten()}
        >
          {busy ? "…" : "Shorten"}
        </button>
      </div>
      {error ? (
        <p id="home-shorten-error" className="mt-2 text-sm text-[var(--warn-ink)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
