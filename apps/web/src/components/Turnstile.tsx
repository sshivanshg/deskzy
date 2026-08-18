"use client";

import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          action: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

type TurnstileProps = {
  action: string;
  onToken: (token: string) => void;
  onExpire?: () => void;
  resetKey?: number;
  className?: string;
};

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SCRIPT_ID = "cloudflare-turnstile-api";

export function isTurnstileEnabled(): boolean {
  return Boolean(SITE_KEY);
}

export function Turnstile({
  action,
  onToken,
  onExpire,
  resetKey = 0,
  className,
}: TurnstileProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) return;
    if (window.turnstile) {
      setReady(true);
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setReady(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => setReady(true), { once: true });
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!SITE_KEY || !ready || !container || !window.turnstile) return;
    if (widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: SITE_KEY,
      action,
      theme: "auto",
      callback: onToken,
      "expired-callback": () => {
        onToken("");
        onExpire?.();
      },
      "error-callback": () => {
        onToken("");
        onExpire?.();
      },
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action, onExpire, onToken, ready]);

  useEffect(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetKey]);

  if (!SITE_KEY) return null;

  return (
    <div className={className}>
      <div id={id} ref={containerRef} className="min-h-[65px]" />
    </div>
  );
}
