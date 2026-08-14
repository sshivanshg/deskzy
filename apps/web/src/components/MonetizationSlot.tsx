"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, ADSENSE_SLOTS, type AdSlotKey } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type MonetizationSlotProps = {
  slot: AdSlotKey;
  size?: "compact" | "banner";
  className?: string;
};

/**
 * AdSense display unit (v1 / 2057346330) in reserved product-page slots.
 * Never mount on hop/share pages.
 */
export function MonetizationSlot({
  slot,
  size = "banner",
  className = "",
}: MonetizationSlotProps) {
  const adSlot = ADSENSE_SLOTS[slot];
  const pushed = useRef(false);
  const minH = size === "banner" ? "min-h-[100px]" : "min-h-[72px]";

  useEffect(() => {
    if (!adSlot || pushed.current) return;

    let cancelled = false;
    let attempts = 0;

    const tryPush = () => {
      if (cancelled || pushed.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        if (attempts++ < 20) {
          window.setTimeout(tryPush, 250);
        }
      }
    };

    // Wait a tick so <ins> is in the DOM, then push (script may still be loading).
    const t = window.setTimeout(tryPush, 100);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [adSlot]);

  if (!adSlot) return null;

  return (
    <div className={className}>
      <aside
        className={`max-h-[320px] overflow-hidden rounded-2xl border border-[var(--stroke)]/80 bg-[var(--panel-soft)]/40 ${minH}`}
        aria-label="Advertisement"
      >
        <p className="px-3 pt-2 text-center text-[10px] font-medium uppercase tracking-wider text-[var(--muted)] opacity-60">
          Advertisement
        </p>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: size === "banner" ? 100 : 72 }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
    </div>
  );
}
