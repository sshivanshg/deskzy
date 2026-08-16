"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  ADSTERRA_SITES,
  type AdsterraBannerKey,
} from "@/lib/ads";

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

export function AdsterraBanner({
  size,
  className = "",
  label = "Advertisement",
}: AdsterraBannerProps) {
  const meta = BANNER_META[size];
  const pushed = useRef(false);
  const containerId = useMemo(
    () => `adsterra-${meta.keyName}-${meta.width}x${meta.height}`,
    [meta.height, meta.keyName, meta.width],
  );

  useEffect(() => {
    if (pushed.current) return;
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
  }, [containerId, meta.keyName]);

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
    injectScript(
      `https://pl30871160.effectivecpmnetwork.com/e3/63/7e/e3637ef5249ac9eda609856a62fb6ce6.js`,
      "adsterra-popunder-src",
    );
  }, []);

  return null;
}

export function AdsterraSocialBar() {
  useEffect(() => {
    injectScript(
      `https://pl30871159.effectivecpmnetwork.com/62/94/3e/62943ef5d87ef0335bad4c6d467c03d6.js`,
      "adsterra-socialbar-src",
    );
  }, []);

  return null;
}

export function AdsterraMobileBanner({ className = "" }: { className?: string }) {
  return <AdsterraBanner size="320x50" className={className} />;
}
