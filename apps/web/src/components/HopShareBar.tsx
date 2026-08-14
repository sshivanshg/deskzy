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
      <div className="flex gap-2">
        <input
          readOnly
          value={pageUrl}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-lg border border-[var(--stroke)] bg-[var(--bg)] px-3 py-2.5 font-mono text-xs text-[var(--ink)] sm:text-sm"
          aria-label="Page link"
        />
        <button
          type="button"
          onClick={() => void onCopy()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3.5 text-sm font-semibold text-white hover:opacity-90"
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--stroke)] bg-[var(--bg-elevated)] text-[var(--ink)] transition-colors hover:border-[var(--stroke-strong)] hover:text-[var(--accent-ink)]"
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
