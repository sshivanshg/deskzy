"use client";

/**
 * Hilltop Multitag overlays disabled — they were blanking the page (white pop overlays).
 * Keep AdSense in-page MonetizationSlot only for UX-safe revenue.
 * Zone scripts retained below if we re-enable a non-overlay format later.
 */
const _DISABLED_ZONES = [
  {
    id: "hilltop-zone-7287877",
    src: "//massivesalad.com/biX.V/sJdpGVl/0TY/Wtcu/VeWm/9/u/ZNUblvkNP/TncXyRO/DWcF4CNGz/cgtXNczCIG4jN/zIgU4SMoQ_",
  },
  {
    id: "hilltop-zone-7287889",
    src: "//massivesalad.com/bHXXVrsld.Ghls0/YHWmcz/ne/m/9bu/ZoUtl-kXPJTlcwyjOzD/cT4kO/DxkOtEN/zAIp4KNMzVgO5_MZwX",
  },
  {
    id: "hilltop-zone-7296109",
    src: "//massivesalad.com/brX/V.srdxGxlL0oYOWsc_/-eWmy9WuFZ/UelikCP/TMcayHOfTxYyxsMKDGkbtnNyz-ID5/NLj/EVxZMTwU",
  },
] as const;

void _DISABLED_ZONES;

export function HilltopAds() {
  return null;
}
