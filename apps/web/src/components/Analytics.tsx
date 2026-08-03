"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CONSENT_KEY = "deskzy-analytics-consent";

type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    if (v === "granted" || v === "denied") return v;
  } catch {
    /* private mode */
  }
  return null;
}

function loadGa(id: string) {
  if (document.getElementById("ga4-src")) return;

  const src = document.createElement("script");
  src.id = "ga4-src";
  src.async = true;
  src.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(src);

  const init = document.createElement("script");
  init.id = "ga4-init";
  init.text = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${id}', { anonymize_ip: true });
  `;
  document.head.appendChild(init);
}

export function Analytics() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
  }, []);

  useEffect(() => {
    if (consent === "granted" && GA_ID) loadGa(GA_ID);
  }, [consent]);

  if (!GA_ID) return null;

  function choose(next: "granted" | "denied") {
    try {
      window.localStorage.setItem(CONSENT_KEY, next);
    } catch {
      /* ignore */
    }
    setConsent(next);
  }

  if (!ready || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-5"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-[var(--stroke)] bg-[var(--paper)]/95 p-4 shadow-[0_12px_40px_rgba(11,66,57,0.14)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Optional analytics help us improve Deskzy. Files still stay in your
          browser. See our{" "}
          <Link
            href="/privacy"
            className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-full border border-[var(--stroke)] bg-[var(--panel-soft)] px-4 py-2 text-sm font-medium text-[var(--ink)] hover:border-[var(--stroke-strong)]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
