"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ADSTERRA_POPUNDER_SCRIPT_URLS,
  ADSTERRA_SMARTLINKS,
  ADSTERRA_SITES,
  type AdsterraBannerKey,
} from "@/lib/ads";
import { SHARE_URL } from "@/lib/seo/site";

declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, string>;
    };
  }
}

type BannerSize = "468x60" | "300x250" | "160x600" | "160x300" | "320x50" | "728x90";

type AdsterraBannerProps = {
  size: BannerSize;
  className?: string;
  label?: string;
};

const BANNER_META: Record<BannerSize, { keyName: AdsterraBannerKey; width: number; height: number }> = {
  "468x60": { keyName: "banner468x60Key", width: 468, height: 60 },
  "300x250": { keyName: "banner300x250Key", width: 300, height: 250 },
  "160x600": { keyName: "banner160x600Key", width: 160, height: 600 },
  "160x300": { keyName: "banner160x300Key", width: 160, height: 300 },
  "320x50": { keyName: "banner320x50Key", width: 320, height: 50 },
  "728x90": { keyName: "banner728x90Key", width: 728, height: 90 },
};

function injectScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.body.appendChild(s);
}

function isShareHost() {
  try {
    return window.location.origin === new URL(SHARE_URL).origin;
  } catch {
    return false;
  }
}

export function AdsterraBanner({
  size,
  className = "",
  label = "Advertisement",
}: AdsterraBannerProps) {
  const meta = BANNER_META[size];
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const pushed = useRef(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const containerId = useMemo(
    () => `adsterra-${meta.keyName}-${meta.width}x${meta.height}-${reactId}`,
    [meta.height, meta.keyName, meta.width, reactId],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (!("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "500px 0px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isNearViewport || pushed.current) return;
    const key = ADSTERRA_SITES[meta.keyName];
    if (!key) return;

    const options = document.createElement("script");
    options.text = `atOptions = { key: '${key}', format: 'iframe', height: ${meta.height}, width: ${meta.width}, params: {} };`;
    const invoke = document.createElement("script");
    invoke.id = `${containerId}-src`;
    invoke.async = true;
    invoke.src = `https://www.highperformanceformat.com/${key}/invoke.js`;

    const host = document.getElementById(containerId);
    if (!host) return;
    host.appendChild(options);
    host.appendChild(invoke);
    pushed.current = true;
  }, [containerId, isNearViewport, meta.height, meta.keyName, meta.width]);

  return (
    <div className={className}>
      <aside
        className="overflow-hidden rounded-2xl border border-[var(--stroke)]/80 bg-[var(--panel-soft)]/40"
        aria-label={label}
      >
        <p className="px-3 pt-2 text-center text-[10px] font-medium uppercase tracking-wider text-[var(--muted)] opacity-60">
          {label}
        </p>
        <div className="flex items-center justify-center px-2 pb-2">
          <div
            ref={hostRef}
            id={containerId}
            className="flex min-h-[60px] items-center justify-center"
            style={{ width: "100%", maxWidth: meta.width }}
          />
        </div>
      </aside>
    </div>
  );
}

export function AdsterraNativeBanner({ className = "" }: { className?: string }) {
  const containerId = "adsterra-native-banner";
  useEffect(() => {
    injectScript(
      `https://pl30871158.effectivecpmnetwork.com/fd742868294a438150076ea4a3ccfcfa/invoke.js`,
      `${containerId}-src`,
    );
  }, []);

  return (
    <div className={className}>
      <aside
        className="overflow-hidden rounded-2xl border border-[var(--stroke)]/80 bg-[var(--panel-soft)]/40"
        aria-label="Advertisement"
      >
        <p className="px-3 pt-2 text-center text-[10px] font-medium uppercase tracking-wider text-[var(--muted)] opacity-60">
          Advertisement
        </p>
        <div className="px-2 pb-2">
          <div id={containerId} className="min-h-[120px]" />
        </div>
      </aside>
    </div>
  );
}

export function AdsterraPopunder() {
  useEffect(() => {
    if (!isShareHost()) return;
    ADSTERRA_POPUNDER_SCRIPT_URLS.forEach((src, index) => {
      injectScript(src, `adsterra-popunder-${index}-src`);
    });
  }, []);

  return null;
}

export function AdsterraSocialBar() {
  useEffect(() => {
    if (!isShareHost()) return;
    injectScript(
      `https://pl30871325.effectivecpmnetwork.com/be07d4749a39c3a2e8a8437fb5df0287/invoke.js`,
      "adsterra-socialbar-src",
    );
  }, []);

  return null;
}

export function AdsterraMobileBanner({ className = "" }: { className?: string }) {
  return <AdsterraBanner size="320x50" className={className} />;
}

export function AdsterraShareExtras() {
  // Retained as a compatibility shim. Background, popunder, and page-overlay
  // formats made shared pages difficult to use, so only visible in-flow ads run.
  return null;
}

export function AdsterraSmartlinkCta() {
  const smartlink = useMemo(() => {
    if (ADSTERRA_SMARTLINKS.length === 0) return ADSTERRA_SITES.smartlinkUrl;
    const index = Math.floor(Math.random() * ADSTERRA_SMARTLINKS.length);
    return ADSTERRA_SMARTLINKS[index] || ADSTERRA_SITES.smartlinkUrl;
  }, []);

  if (!smartlink) return null;

  return (
    <a
      href={smartlink}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--panel)] px-4 py-3 transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]/35"
    >
      <span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Sponsored
        </span>
        <span className="mt-0.5 block text-sm font-medium text-[var(--ink)]">
          Discover more offers
        </span>
      </span>
      <span className="text-xs font-semibold text-[var(--accent)]">
        Open
      </span>
    </a>
  );
}

export function AdsterraSoftRail({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="hidden lg:block">
        <AdsterraBanner size="728x90" />
      </div>
      <div className="lg:hidden">
        <AdsterraBanner size="320x50" />
      </div>
    </div>
  );
}

export function AdsterraRevenueStack({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <AdsterraSoftRail />
    </div>
  );
}
