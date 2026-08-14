"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT } from "@/lib/ads";

/**
 * Loads AdSense on the product site only.
 * Turn on Auto ads in AdSense → Sites → deskzy.xyz for page-level fill.
 * Manual units use MonetizationSlot + NEXT_PUBLIC_ADSENSE_SLOT_*.
 */
export function AdSenseLoader() {
  useEffect(() => {
    if (document.getElementById("adsense-src")) return;
    const s = document.createElement("script");
    s.id = "adsense-src";
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    document.head.appendChild(s);
  }, []);

  return null;
}
