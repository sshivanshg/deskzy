export const ADSTERRA_SITES = {
  smartlinkUrl:
    process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_URL ||
    "https://www.effectivecpmnetwork.com/zj2sps8whc?key=3cec01f882a153082fb93f4e78f6c660",
  nativeBannerKey:
    process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_KEY ||
    "fd742868294a438150076ea4a3ccfcfa",
  socialBarKey:
    process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_KEY ||
    "62943ef5d87ef0335bad4c6d467c03d6",
  popunderKey:
    process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_KEY ||
    "e3637ef5249ac9eda609856a62fb6ce6",
  banner468x60Key:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_468X60_KEY ||
    "7d7f699a1423ea2c632d24a8044e78cd",
  banner300x250Key:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300X250_KEY ||
    "7d7f699a1423ea2c632d24a8044e78cd",
  banner160x600Key:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_160X600_KEY ||
    "6f27de3d544cf1fdec9708e0b9766163",
  banner160x300Key:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_160X300_KEY ||
    "8815e92ed129d43df7b3b9fb6cebb28c",
  banner320x50Key:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_320X50_KEY ||
    "68fff9fcff11e52e568b7206fd26274b",
  banner728x90Key:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_728X90_KEY ||
    "fbeb42bb4cae56ff0055f01d8a2423dd",
} as const;

// Backward-compatible exports for legacy ad helpers that still exist in the tree.
export const ADSENSE_CLIENT = "";
export const ADSENSE_SLOTS = {
  home: "",
  tool: "",
  footer: "",
  category: "",
} as const;

export type AdSlotKey = keyof typeof ADSENSE_SLOTS;

export type AdsterraBannerKey =
  | "banner468x60Key"
  | "banner300x250Key"
  | "banner160x600Key"
  | "banner160x300Key"
  | "banner320x50Key"
  | "banner728x90Key";
