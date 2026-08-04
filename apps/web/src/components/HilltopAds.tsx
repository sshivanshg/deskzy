"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** HilltopAds Multitag banners — deferred so first paint / tools stay responsive. */
const ZONES = [
  {
    // mobile · 7287877–7287881
    id: "hilltop-zone-7287877",
    src: "//massivesalad.com/biX.V/sJdpGVl/0TY/Wtcu/VeWm/9/u/ZNUblvkNP/TncXyRO/DWcF4CNGz/cgtXNczCIG4jN/zIgU4SMoQ_",
  },
  {
    // lapp · 7287889–7287893
    id: "hilltop-zone-7287889",
    src: "//massivesalad.com/bHXXVrsld.Ghls0/YHWmcz/ne/m/9bu/ZoUtl-kXPJTlcwyjOzD/cT4kO/DxkOtEN/zAIp4KNMzVgO5_MZwX",
  },
] as const;

const SESSION_KEY = "deskzy-hilltop-loaded-v2";

/** Min time on page before tags may inject. */
const MIN_DWELL_MS = 12_000;
/** Extra idle wait after dwell so we never compete with boot. */
const IDLE_SLACK_MS = 2_000;
/** Stagger second zone so both don't contend for the main thread. */
const ZONE_STAGGER_MS = 2_500;

function pathBlocked(pathname: string | null): boolean {
  if (!pathname) return true;
  // /r/ uses HopAdSlot below the links instead of floating Multitag overlays.
  const blockedPrefixes = [
    "/r/",
    "/account",
    "/login",
    "/signup",
    "/auth",
    "/invite",
    "/api",
    "/privacy",
    "/terms",
  ];
  return blockedPrefixes.some(
    (p) => pathname === p.replace(/\/$/, "") || pathname.startsWith(p),
  );
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

function absoluteSrc(src: string) {
  return src.startsWith("//") ? `https:${src}` : src;
}

function injectZones() {
  if (typeof document === "undefined") return;
  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
  } catch {
    /* private mode — still allow once this document */
  }

  ZONES.forEach((zone, index) => {
    window.setTimeout(() => {
      if (document.getElementById(zone.id)) return;
      const s = document.createElement("script");
      s.id = zone.id;
      s.async = true;
      s.referrerPolicy = "no-referrer-when-downgrade";
      s.src = absoluteSrc(zone.src);
      document.body.appendChild(s);
    }, index * ZONE_STAGGER_MS);
  });

  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

function whenIdle(cb: () => void) {
  const ric = (
    window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    }
  ).requestIdleCallback;

  if (typeof ric === "function") {
    const id = ric(() => cb(), { timeout: IDLE_SLACK_MS + 1_000 });
    return () => {
      (
        window as Window & { cancelIdleCallback?: (handle: number) => void }
      ).cancelIdleCallback?.(id);
    };
  }
  const t = window.setTimeout(cb, IDLE_SLACK_MS);
  return () => window.clearTimeout(t);
}

export function HilltopAds() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathBlocked(pathname)) return;
    if (prefersLightData()) return;

    let cancelled = false;
    let idleCleanup: (() => void) | undefined;
    let interactionCleanup: (() => void) | undefined;

    const dwellTimer = window.setTimeout(() => {
      if (cancelled) return;

      const arm = () => {
        if (cancelled) return;
        idleCleanup = whenIdle(() => {
          if (cancelled || document.hidden) return;
          injectZones();
        });
      };

      let engaged = false;
      const onEngage = () => {
        if (engaged) return;
        engaged = true;
        interactionCleanup?.();
        arm();
      };

      window.addEventListener("scroll", onEngage, { passive: true, once: true });
      window.addEventListener("pointerdown", onEngage, { once: true });
      window.addEventListener("keydown", onEngage, { once: true });

      interactionCleanup = () => {
        window.removeEventListener("scroll", onEngage);
        window.removeEventListener("pointerdown", onEngage);
        window.removeEventListener("keydown", onEngage);
      };

      const fallback = window.setTimeout(onEngage, 8_000);
      const prevCleanup = interactionCleanup;
      interactionCleanup = () => {
        window.clearTimeout(fallback);
        prevCleanup();
      };
    }, MIN_DWELL_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(dwellTimer);
      idleCleanup?.();
      interactionCleanup?.();
    };
  }, [pathname]);

  return null;
}
