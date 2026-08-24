"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Check,
  CopySimple,
  FacebookLogo,
  RedditLogo,
  TelegramLogo,
  WhatsappLogo,
  XLogo,
} from "@phosphor-icons/react";
import { publicLinkUrl } from "@/lib/link-path";

type HopShareBarProps = {
  code: string;
};

function shareTargets(pageUrl: string) {
  const encoded = encodeURIComponent(pageUrl);
  const text = encodeURIComponent("Shared content");
  return [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encoded}`,
      Icon: WhatsappLogo,
    },
    {
      id: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encoded}&text=${text}`,
      Icon: TelegramLogo,
    },
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encoded}`,
      Icon: XLogo,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      Icon: FacebookLogo,
    },
    {
      id: "reddit",
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encoded}`,
      Icon: RedditLogo,
    },
  ] as const;
}

/** Copy page URL + social row — Pastelink-style reshare without interstitial. */
export function HopShareBar({ code }: HopShareBarProps) {
  const pageUrl = useMemo(() => publicLinkUrl(code), [code]);
  const [copied, setCopied] = useState(false);
  const targets = useMemo(() => shareTargets(pageUrl), [pageUrl]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [pageUrl]);

  return (
    <div className="space-y-3">
      <div className="rounded-[1.4rem] border border-white/70 bg-white/75 p-2 shadow-[0_12px_28px_rgba(119,92,139,0.08)]">
        <div className="mb-2 flex items-center justify-between gap-2 px-1.5 pt-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Link to share
          </span>
          <span className="text-[10px] text-[var(--muted)]">Copy or post</span>
        </div>
        <div className="flex gap-2">
          <input
            readOnly
            value={pageUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="min-w-0 flex-1 rounded-[1rem] border border-[rgba(185,162,197,0.28)] bg-white px-3 py-2.5 font-mono text-xs text-[var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:text-sm"
            aria-label="Page link"
          />
          <button
            type="button"
            onClick={() => void onCopy()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-[1rem] bg-[var(--accent)] px-3.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(131,103,153,0.22)] transition-transform hover:-translate-y-0.5 hover:opacity-95"
          >
            {copied ? (
              <>
                <Check size={15} weight="bold" />
                Copied
              </>
            ) : (
              <>
                <CopySimple size={15} weight="bold" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Share
        </span>
        {targets.map(({ id, label, href, Icon }) => (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/80 text-[var(--ink)] shadow-[0_8px_18px_rgba(119,92,139,0.08)] transition-transform transition-colors hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_24%,white)] hover:text-[var(--accent-ink)]"
            aria-label={`Share on ${label}`}
            title={label}
          >
            <Icon size={16} weight="fill" />
          </a>
        ))}
      </div>
    </div>
  );
}
