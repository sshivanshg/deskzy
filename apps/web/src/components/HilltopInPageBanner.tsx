"use client";

import { useEffect, useId, useRef } from "react";

/** In-page Hilltop banner zones (visible inventory — not floating Multitag). */
const BANNER_ZONES = {
  mobile: {
    idPrefix: "hilltop-inpage-m",
    src: "//massivesalad.com/biX.V/sJdpGVl/0TY/Wtcu/VeWm/9/u/ZNUblvkNP/TncXyRO/DWcF4CNGz/cgtXNczCIG4jN/zIgU4SMoQ_",
  },
  desktop: {
    idPrefix: "hilltop-inpage-d",
    src: "//massivesalad.com/bHXXVrsld.Ghls0/YHWmcz/ne/m/9bu/ZoUtl-kXPJTlcwyjOzD/cT4kO/DxkOtEN/zAIp4KNMzVgO5_MZwX",
  },
} as const;

const LOAD_AFTER_MS = 1_500;

function absoluteSrc(src: string) {
  return src.startsWith("//") ? `https:${src}` : src;
}

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

type HilltopInPageBannerProps = {
  /** Unique key so multiple slots on one page don't collide */
  placement: string;
  size?: "compact" | "banner";
  className?: string;
};

/**
 * Visible reserved ad area that injects Hilltop into this slot.
 * Product pages only — never mount on hop/share.
 */
export function HilltopInPageBanner({
  placement,
  size = "banner",
  className = "",
}: HilltopInPageBannerProps) {
  const reactId = useId().replace(/:/g, "");
  const slotRef = useRef<HTMLDivElement>(null);
  const minH = size === "banner" ? "min-h-[120px]" : "min-h-[90px]";

  useEffect(() => {
    if (prefersLightData()) return;
    const slot = slotRef.current;
    if (!slot) return;

    let cancelled = false;
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;
    const zone = isMobile ? BANNER_ZONES.mobile : BANNER_ZONES.desktop;
    const scriptId = `${zone.idPrefix}-${placement}-${reactId}`;

    const timer = window.setTimeout(() => {
      if (cancelled || document.hidden) return;
      if (document.getElementById(scriptId)) return;

      const s = document.createElement("script");
      s.id = scriptId;
      s.async = true;
      s.referrerPolicy = "no-referrer-when-downgrade";
      s.src = absoluteSrc(zone.src);
      slot.appendChild(s);
    }, LOAD_AFTER_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [placement, reactId]);

  return (
    <aside
      className={`overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--panel-soft)]/50 ${minH} ${className}`}
      aria-label="Advertisement"
    >
      <p className="px-3 pt-2 text-center text-[10px] font-medium uppercase tracking-wider text-[var(--muted)] opacity-70">
        Advertisement
      </p>
      <div
        ref={slotRef}
        className="flex min-h-[90px] w-full items-center justify-center px-2 pb-3 pt-1"
      />
    </aside>
  );
}
