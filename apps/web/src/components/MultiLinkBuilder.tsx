"use client";

import { useId, useState } from "react";
import { Plus, TrashSimple } from "@phosphor-icons/react";
import { looksLikeUrl } from "@/lib/normalize-url";

function hostPreview(raw: string): string {
  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withScheme);
    const rest = `${u.pathname === "/" ? "" : u.pathname}${u.search}`;
    return rest && rest !== "/" ? `${u.host}${rest.length > 36 ? `${rest.slice(0, 36)}…` : rest}` : u.host;
  } catch {
    return raw;
  }
}

type MultiLinkBuilderProps = {
  links: string[];
  onChange: (links: string[]) => void;
  disabled?: boolean;
  /** compact = home dock; roomy = tool page */
  density?: "compact" | "roomy";
  minLinks?: number;
  draftPlaceholder?: string;
};

/**
 * Explicit add/remove link list — mobile-friendly (no space/newline parsing).
 * Paste of several URLs into the draft field still expands into multiple rows.
 */
export function MultiLinkBuilder({
  links,
  onChange,
  disabled,
  density = "roomy",
  minLinks = 0,
  draftPlaceholder = "Paste or type a link, then Add",
}: MultiLinkBuilderProps) {
  const draftId = useId();
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);

  const compact = density === "compact";

  const commitTokens = (raw: string) => {
    const parts = raw
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const valid: string[] = [];
    let bad = 0;
    for (const part of parts) {
      if (looksLikeUrl(part)) valid.push(part);
      else bad += 1;
    }
    if (valid.length === 0) {
      setDraftError(
        bad > 0 ? "That doesn’t look like a link" : "Enter a link first",
      );
      return;
    }
    onChange([...links, ...valid]);
    setDraft("");
    setDraftError(
      bad > 0 ? `Added ${valid.length}; skipped ${bad} invalid` : null,
    );
  };

  const addDraft = () => {
    if (disabled) return;
    commitTokens(draft);
  };

  const removeAt = (index: number) => {
    if (disabled) return;
    if (links.length <= minLinks) return;
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {links.length > 0 ? (
        <ul className="space-y-1.5">
          {links.map((link, i) => (
            <li
              key={`${i}-${link}`}
              className={`flex items-center gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--panel)] ${
                compact ? "px-2.5 py-2" : "px-3 py-2.5"
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[11px] font-semibold text-[var(--accent-ink)]">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-[var(--ink)]">
                {hostPreview(link)}
              </span>
              <button
                type="button"
                className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--warn-ink)] disabled:opacity-40"
                aria-label={`Remove link ${i + 1}`}
                disabled={disabled || links.length <= minLinks}
                onClick={() => removeAt(i)}
              >
                <TrashSimple size={16} weight="bold" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={`flex gap-2 ${compact ? "" : "flex-col sm:flex-row"}`}>
        <label className="sr-only" htmlFor={draftId}>
          Add a link
        </label>
        <input
          id={draftId}
          type="url"
          inputMode="url"
          autoComplete="url"
          value={draft}
          disabled={disabled}
          placeholder={draftPlaceholder}
          onChange={(e) => {
            setDraft(e.target.value);
            setDraftError(null);
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text");
            const tokens = pasted
              .split(/\s+/)
              .map((t) => t.trim())
              .filter((t) => looksLikeUrl(t));
            if (tokens.length >= 2) {
              e.preventDefault();
              onChange([...links, ...tokens]);
              setDraft("");
              setDraftError(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addDraft();
            }
          }}
          className={`field min-w-0 flex-1 !rounded-xl !text-base ${
            compact ? "!py-2.5" : "!py-3"
          }`}
        />
        <button
          type="button"
          className={`btn-secondary shrink-0 ${
            compact ? "!px-3 !py-2.5" : "!px-4 !py-3 sm:min-w-[6.5rem]"
          }`}
          disabled={disabled || !draft.trim()}
          onClick={addDraft}
        >
          <Plus size={16} weight="bold" />
          Add
        </button>
      </div>
      {draftError ? (
        <p className="text-xs text-[var(--warn-ink)]" role="status">
          {draftError}
        </p>
      ) : (
        <p className="text-xs text-[var(--muted)]">
          Tap Add after each link
          {links.length > 0 ? ` · ${links.length} added` : ""}. Paste several at
          once if you already have them copied.
        </p>
      )}
    </div>
  );
}
