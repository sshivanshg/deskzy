"use client";

import { useCallback, useState } from "react";
import { ArrowSquareOut, Check, CopySimple } from "@phosphor-icons/react";
import {
  codeFromShareUrl,
  shareVariantsForCode,
  type ShareVariant,
} from "@/lib/link-path";

type ShareResultPanelProps = {
  /** Full primary share URL or bare code. */
  shareUrlOrCode: string;
  /** Compact for home dock; roomier for tool workspace. */
  density?: "compact" | "roomy";
  className?: string;
};

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function VariantRow({
  variant,
  density,
}: {
  variant: ShareVariant;
  density: "compact" | "roomy";
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await copyText(variant.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }, [variant.url]);

  const inputPad = density === "roomy" ? "px-3 py-2.5 text-sm" : "px-2.5 py-2 text-xs";

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-semibold text-[var(--ink)]">{variant.label}</p>
        <p className="hidden text-[10px] text-[var(--muted)] sm:block">{variant.hint}</p>
      </div>
      <div className="flex gap-2">
        <input
          readOnly
          value={variant.url}
          onFocus={(e) => e.currentTarget.select()}
          className={`min-w-0 flex-1 rounded-lg border border-[var(--stroke)] bg-[var(--panel)] font-mono text-[var(--ink)] ${inputPad}`}
          aria-label={variant.label}
        />
        <button
          type="button"
          onClick={() => void onCopy()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 text-xs font-semibold text-white hover:opacity-90 sm:px-3.5 sm:text-sm"
        >
          {copied ? (
            <>
              <Check size={14} weight="bold" />
              Copied
            </>
          ) : (
            <>
              <CopySimple size={14} weight="bold" />
              Copy
            </>
          )}
        </button>
      </div>
      <p className="text-[10px] text-[var(--muted)] sm:hidden">{variant.hint}</p>
    </div>
  );
}

/**
 * Creator-only box (Pastelink-style): multiple domain variants of the same paste.
 * Shown after publish — not on the public hop page.
 */
export function ShareResultPanel({
  shareUrlOrCode,
  density = "roomy",
  className = "",
}: ShareResultPanelProps) {
  const code =
    codeFromShareUrl(shareUrlOrCode) ||
    (/^[A-Za-z0-9_-]{3,64}$/.test(shareUrlOrCode.trim())
      ? shareUrlOrCode.trim()
      : null);

  if (!code) return null;

  const variants = shareVariantsForCode(code);
  const primary = variants[0]?.url;

  return (
    <div
      className={`rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-3 sm:p-4 ${className}`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Only visible to you
        </p>
        {primary ? (
          <a
            href={primary}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-ink)] underline-offset-2 hover:underline"
          >
            Open page
            <ArrowSquareOut size={12} weight="bold" />
          </a>
        ) : null}
      </div>

      <p className="mb-3 text-xs leading-relaxed text-[var(--muted)]">
        Same published page, different domains. If one site blocks a link, copy
        another variant below.
      </p>

      <div className="space-y-3">
        {variants.map((v) => (
          <VariantRow key={v.id} variant={v} density={density} />
        ))}
      </div>
    </div>
  );
}
