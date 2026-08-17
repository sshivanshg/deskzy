export const ADSTERRA_SITES = {
  smartlinkUrl:
    process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_URL ||
    "https://consistinvention.com/qfb1kff3m?key=8a450f6d402314be8891210668fff57e",
  nativeBannerKey:
    process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_KEY ||
    "fd742868294a438150076ea4a3ccfcfa",
  socialBarKey:
    process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_KEY ||
    "62943ef5d87ef0335bad4c6d467c03d6",
  popunderKey:
    process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_KEY ||
    "e3637ef5249ac9eda609856a62fb6ce6",
  popunderScriptUrl:
    process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SCRIPT_URL ||
    "https://consistinvention.com/e3/63/7e/e3637ef5249ac9eda609856a62fb6ce6.js",
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
  popunderPageKey:
    process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_PAGE_KEY ||
    "2734a01a3f819930c8d935220a678213",
  popunderPageScriptUrl:
    process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_PAGE_SCRIPT_URL ||
    "https://consistinvention.com/27/34/a0/2734a01a3f819930c8d935220a678213.js",
  nativeBannerPageKey:
    process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_PAGE_KEY ||
    "be07d4749a39c3a2e8a8437fb5df0287",
  nativeBanner2PageKey:
    process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_BANNER_2_PAGE_KEY ||
    "385e4e06654555edc2cc79b3765b5ae3",
  smartlinkPageUrl:
    process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_PAGE_URL ||
    "https://consistinvention.com/qfb1kff3m?key=8a450f6d402314be8891210668fff57e",
  banner300x250PageKey:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300X250_PAGE_KEY ||
    "3a3cf26e6024c1039ab8271055a0c71b",
  banner160x600PageKey:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_160X600_PAGE_KEY ||
    "6d86f55adae4e0a1ec0c09acafd81f42",
  banner160x300PageKey:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_160X300_PAGE_KEY ||
    "49941b5f377ac4321531b075aa2aa782",
  banner320x50PageKey:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_320X50_PAGE_KEY ||
    "567be273117ae4454cc60b7b3d5729e0",
  banner728x90PageKey:
    process.env.NEXT_PUBLIC_ADSTERRA_BANNER_728X90_PAGE_KEY ||
    "1cdf877070ef9a0d013ed3e2686c63d8",
} as const;

export const ADSTERRA_SMARTLINKS = [
  process.env.NEXT_PUBLIC_ADSTERRA_YOURURL_SMARTLINK_URL ||
    "https://consistinvention.com/qfb1kff3m?key=8a450f6d402314be8891210668fff57e",
  process.env.NEXT_PUBLIC_ADSTERRA_YOURURL_SMARTLINK_URL ||
    "https://consistinvention.com/qfb1kff3m?key=8a450f6d402314be8891210668fff57e",
  process.env.NEXT_PUBLIC_ADSTERRA_YOURURL_SMARTLINK_URL ||
    "https://consistinvention.com/qfb1kff3m?key=8a450f6d402314be8891210668fff57e",
  process.env.NEXT_PUBLIC_ADSTERRA_YOURURL_SMARTLINK_URL ||
    "https://consistinvention.com/qfb1kff3m?key=8a450f6d402314be8891210668fff57e",
  process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_URL ||
    "https://consistinvention.com/zj2sps8whc?key=3cec01f882a153082fb93f4e78f6c660",
  process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_ALT_URL ||
    "https://consistinvention.com/y4tfnbii?key=576de01255fd68ede722c60f770ebfa2",
  process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_ALT_2_URL ||
    "https://consistinvention.com/xj135rghz?key=92e7b2d975bf4b928cd8a0c22ce32fa7",
].filter(Boolean);

export const ADSTERRA_POPUNDER_SCRIPT_URLS = [
  ADSTERRA_SITES.popunderScriptUrl,
  ADSTERRA_SITES.popunderPageScriptUrl,
].filter(Boolean);

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
