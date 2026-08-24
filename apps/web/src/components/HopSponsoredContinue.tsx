"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowSquareOut, X } from "@phosphor-icons/react";
import {
  AdsterraBanner,
  AdsterraSmartlinkCta,
  AdsterraSoftRail,
} from "@/components/Adsterra";

type HopSponsoredContinueProps = {
  dest: string | null;
  onClose: () => void;
};

const CONTINUE_SECONDS = 3;

function destinationHost(dest: string) {
  try {
    return new URL(dest).host;
  } catch {
    return "destination";
  }
}

export function HopSponsoredContinue({
  dest,
  onClose,
}: HopSponsoredContinueProps) {
  const [secondsLeft, setSecondsLeft] = useState(CONTINUE_SECONDS);
  const host = useMemo(() => (dest ? destinationHost(dest) : ""), [dest]);

  useEffect(() => {
    if (!dest) return;
    setSecondsLeft(CONTINUE_SECONDS);
  }, [dest]);

  useEffect(() => {
    if (!dest || secondsLeft <= 0) return;
    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [dest, secondsLeft]);

  if (!dest) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(71,55,79,0.28)] px-3 py-3 backdrop-blur-md sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Continue to destination"
    >
      <div className="w-full max-w-md overflow-hidden rounded-[1.85rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(250,244,248,0.94))] shadow-[0_24px_60px_rgba(73,54,84,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-white/70 px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Continue
            </p>
            <h2 className="mt-1 font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
              Opening {host}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/85 text-[var(--muted)] transition-transform transition-colors hover:-translate-y-0.5 hover:text-[var(--ink)]"
            aria-label="Close sponsored message"
          >
            <X size={14} weight="bold" />
          </button>
        </div>

        <div className="px-4 py-4">
          <a
            href={dest}
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center !rounded-full"
          >
            <ArrowSquareOut size={16} weight="bold" />
            {secondsLeft > 0
              ? `Continue in ${secondsLeft}s`
              : "Continue now"}
          </a>

          <p className="mt-2 text-center text-xs leading-relaxed text-[var(--muted)]">
            Sponsored messages help keep shared pages free.
          </p>

          <div className="mt-4">
            <AdsterraBanner size="300x250" />
          </div>
          <AdsterraSoftRail className="mt-4" />
          <AdsterraSmartlinkCta />
          <div className="mt-4">
            <AdsterraBanner size="320x50" />
          </div>
        </div>
      </div>
    </div>
  );
}
