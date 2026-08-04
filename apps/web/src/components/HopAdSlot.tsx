"use client";

import { useEffect, useRef } from "react";

/**
 * Single Hilltop zone for hop pages — injected into this slot (not document.body)
 * so banners stay below the destination links instead of covering the CTA.
 */
const HOP_ZONE = {
  id: "hilltop-hop-7287877",
  src: "//massivesalad.com/biX.V/sJdpGVl/0TY/Wtcu/VeWm/9/u/ZNUblvkNP/TncXyRO/DWcF4CNGz/cgtXNczCIG4jN/zIgU4SMoQ_",
} as const;

/** Let visitors see / tap Open before any ad script runs. */
const LOAD_AFTER_MS = 4_000;

function prefersLightData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (conn?.saveData) return true;
  if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") {
    return true;
  }
  return false;
}

function absoluteSrc(src: string) {
  return src.startsWith("//") ? `https:${src}` : src;
}

/** Reserved ad area below hop link actions — deferred, one zone only. */
export function HopAdSlot() {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersLightData()) return;
    const slot = slotRef.current;
    if (!slot) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled || document.hidden) return;
      if (document.getElementById(HOP_ZONE.id)) return;

      const s = document.createElement("script");
      s.id = HOP_ZONE.id;
      s.async = true;
      s.referrerPolicy = "no-referrer-when-downgrade";
      s.src = absoluteSrc(HOP_ZONE.src);
      slot.appendChild(s);
    }, LOAD_AFTER_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <aside
      className="mt-8 w-full overflow-hidden rounded-2xl border border-[var(--stroke)]/70 bg-[color-mix(in_srgb,var(--surface)_55%,transparent)]"
      aria-label="Sponsored"
    >
      <p className="px-3 pt-2 text-center text-[10px] font-medium uppercase tracking-wider text-[var(--muted)] opacity-70">
        Sponsored
      </p>
      <div
        ref={slotRef}
        id="deskzy-hop-ad-slot"
        className="flex min-h-[90px] w-full items-center justify-center px-2 pb-3 pt-1"
      />
    </aside>
  );
}
