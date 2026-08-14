/** AdSense publisher — product site only (never hop/share pages). */
export const ADSENSE_CLIENT = "ca-pub-3303889870292458";

/**
 * Display units (one per placement):
 * - v1   (2057346330) — home
 * - v2   (2639086258) — tool pages
 * - v3   (9586416793) — footer
 * - v1.1 (6115296834) — category pages
 */
export const ADSENSE_SLOTS = {
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || "2057346330",
  tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL || "2639086258",
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || "9586416793",
  category: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY || "6115296834",
} as const;

export type AdSlotKey = keyof typeof ADSENSE_SLOTS;
