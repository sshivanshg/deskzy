"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

type UpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  used?: number;
  limit?: number;
};

export function UpgradeModal({
  open,
  onClose,
  title = "Daily Free limit reached",
  message = "Upgrade to Pro for unlimited PDF & image processing, custom short slugs, and link analytics.",
  used,
  limit,
}: UpgradeModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--stroke)] bg-[var(--bg-elevated)] p-5 shadow-[var(--shadow)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="font-display text-xl font-semibold tracking-tight">
          {title}
        </h2>
        {typeof used === "number" && typeof limit === "number" ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            Used {used} of {limit} free runs today for this tool.
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{message}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/pricing" className="btn-primary flex-1 justify-center">
            View Pro plans
          </Link>
          <button type="button" className="btn-secondary flex-1 justify-center" onClick={onClose}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

const ANON_KEY = "deskzy_anon";

export function ensureAnonId(): string {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id || !/^[a-zA-Z0-9_-]{8,64}$/.test(id)) {
      id = crypto.randomUUID().replace(/-/g, "");
      localStorage.setItem(ANON_KEY, id);
    }
    // Mirror to cookie for server routes that prefer cookies
    document.cookie = `${ANON_KEY}=${id}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    return id;
  } catch {
    return `tmp${Date.now().toString(36)}`;
  }
}

export async function gateToolUsage(toolSlug: string): Promise<
  | { ok: true }
  | { ok: false; used: number; limit: number; message: string }
> {
  const anon = ensureAnonId();
  const res = await fetch("/api/usage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-deskzy-anon": anon,
    },
    body: JSON.stringify({ toolSlug, increment: true }),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    unlimited?: boolean;
    used?: number;
    limit?: number;
    error?: string;
  };
  if (res.status === 402 || data.ok === false) {
    return {
      ok: false,
      used: data.used ?? 0,
      limit: data.limit ?? 0,
      message: data.error || "Daily Free limit reached",
    };
  }
  if (!res.ok) {
    // Fail open so local tools still work if usage API is down
    return { ok: true };
  }
  return { ok: true };
}

/** For components that need to know if upgrade modal state helpers are mounted */
export function useUpgradeGate() {
  const [upgrade, setUpgrade] = useState<{
    open: boolean;
    used?: number;
    limit?: number;
    message?: string;
  }>({ open: false });

  return {
    upgrade,
    showLimit: (used: number, limit: number, message?: string) =>
      setUpgrade({ open: true, used, limit, message }),
    close: () => setUpgrade((u) => ({ ...u, open: false })),
  };
}
