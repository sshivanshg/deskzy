import type { TextResult } from "./types";

export type UtmFields = {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
};

export type UtmPresetId = "google-ads" | "instagram" | "newsletter" | "linkedin";

export const UTM_PRESETS: Record<
  UtmPresetId,
  { label: string; source: string; medium: string }
> = {
  "google-ads": { label: "Google Ads", source: "google", medium: "cpc" },
  instagram: { label: "Instagram", source: "instagram", medium: "social" },
  newsletter: { label: "Newsletter", source: "newsletter", medium: "email" },
  linkedin: { label: "LinkedIn", source: "linkedin", medium: "social" },
};

export function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function buildUtmUrl(fields: UtmFields): { url: string; warning?: string } {
  const base = normalizeBaseUrl(fields.baseUrl);
  if (!base) throw new Error("Enter a base URL");

  let parsed: URL;
  try {
    parsed = new URL(base);
  } catch {
    throw new Error("Enter a valid base URL");
  }

  const params = parsed.searchParams;
  if (fields.source.trim()) params.set("utm_source", fields.source.trim());
  if (fields.medium.trim()) params.set("utm_medium", fields.medium.trim());
  if (fields.campaign.trim()) params.set("utm_campaign", fields.campaign.trim());
  if (fields.term?.trim()) params.set("utm_term", fields.term.trim());
  if (fields.content?.trim()) params.set("utm_content", fields.content.trim());

  let warning: string | undefined;
  if (
    fields.source.trim() &&
    fields.medium.trim() &&
    !fields.campaign.trim()
  ) {
    warning = "Campaign is empty — ads reporting works better with utm_campaign";
  }

  return { url: parsed.toString(), warning };
}

export function runUtmBuilder(options: Record<string, string>): TextResult {
  const { url, warning } = buildUtmUrl({
    baseUrl: options.baseUrl || "",
    source: options.source || "",
    medium: options.medium || "",
    campaign: options.campaign || "",
    term: options.term,
    content: options.content,
  });
  return {
    text: url,
    meta: {
      source: options.source || "",
      medium: options.medium || "",
      campaign: options.campaign || "",
      ...(warning ? { note: warning } : {}),
    },
  };
}

export const COUNTRY_CODES: { code: string; label: string; dial: string }[] = [
  { code: "IN", label: "India", dial: "91" },
  { code: "US", label: "United States", dial: "1" },
  { code: "GB", label: "United Kingdom", dial: "44" },
  { code: "AE", label: "UAE", dial: "971" },
  { code: "SG", label: "Singapore", dial: "65" },
  { code: "AU", label: "Australia", dial: "61" },
  { code: "CA", label: "Canada", dial: "1" },
  { code: "DE", label: "Germany", dial: "49" },
  { code: "OTHER", label: "Other / custom", dial: "" },
];

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function buildWhatsAppUrl(opts: {
  dial: string;
  phone: string;
  message?: string;
}): string {
  const dial = digitsOnly(opts.dial);
  const phone = digitsOnly(opts.phone);
  if (!dial) throw new Error("Select or enter a country code");
  if (!phone) throw new Error("Enter a phone number");
  const e164 = `${dial}${phone}`;
  const base = `https://wa.me/${e164}`;
  const msg = opts.message?.trim();
  if (!msg) return base;
  return `${base}?text=${encodeURIComponent(msg)}`;
}

export function runWhatsAppLink(options: Record<string, string>): TextResult {
  const country = options.country || "IN";
  const fromList = COUNTRY_CODES.find((c) => c.code === country);
  const dial =
    country === "OTHER"
      ? options.dial || ""
      : fromList?.dial || options.dial || "";
  const url = buildWhatsAppUrl({
    dial,
    phone: options.phone || "",
    message: options.message,
  });
  return {
    text: url,
    meta: { phone: digitsOnly(`${dial}${options.phone || ""}`) },
  };
}

export type BioLinkItem = { id: string; label: string; url: string };
export type BioTheme = "deskzy" | "light" | "dark";

export const BIO_THEMES: Record<
  BioTheme,
  { label: string; bg: string; ink: string; muted: string; btn: string; btnInk: string }
> = {
  deskzy: {
    label: "Deskzy teal",
    bg: "#0B4239",
    ink: "#F4F7F6",
    muted: "#A8C5BE",
    btn: "#E8F2EF",
    btnInk: "#0B4239",
  },
  light: {
    label: "Minimal light",
    bg: "#F7F4EF",
    ink: "#1A1A1A",
    muted: "#6B6B6B",
    btn: "#1A1A1A",
    btnInk: "#FFFFFF",
  },
  dark: {
    label: "High contrast",
    bg: "#0A0A0A",
    ink: "#FAFAFA",
    muted: "#A3A3A3",
    btn: "#FAFAFA",
    btnInk: "#0A0A0A",
  },
};

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function parseBioLinks(raw: string): BioLinkItem[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as BioLinkItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => l && typeof l.url === "string");
  } catch {
    return [];
  }
}

export function validBioLinks(links: BioLinkItem[]): BioLinkItem[] {
  return links.filter((l) => {
    const url = normalizeBaseUrl(l.url);
    if (!url) return false;
    try {
      new URL(url);
      return Boolean(l.label.trim());
    } catch {
      return false;
    }
  });
}

export function renderBioMarkdown(opts: {
  title: string;
  subtitle?: string;
  links: BioLinkItem[];
}): string {
  const links = validBioLinks(opts.links);
  const lines = [`# ${opts.title.trim() || "Links"}`];
  if (opts.subtitle?.trim()) lines.push("", opts.subtitle.trim());
  lines.push("");
  for (const l of links) {
    lines.push(`- [${l.label.trim()}](${normalizeBaseUrl(l.url)})`);
  }
  return lines.join("\n");
}

export function renderBioHtml(opts: {
  title: string;
  subtitle?: string;
  links: BioLinkItem[];
  theme: BioTheme;
}): string {
  const theme = BIO_THEMES[opts.theme] || BIO_THEMES.deskzy;
  const title = escapeHtml(opts.title.trim() || "Links");
  const subtitle = opts.subtitle?.trim()
    ? `<p style="margin:8px 0 28px;color:${theme.muted};font-size:15px;line-height:1.5">${escapeHtml(opts.subtitle.trim())}</p>`
    : `<div style="height:20px"></div>`;
  const links = validBioLinks(opts.links)
    .map((l) => {
      const href = escapeHtml(normalizeBaseUrl(l.url));
      const label = escapeHtml(l.label.trim());
      return `<a href="${href}" style="display:block;margin:0 0 12px;padding:14px 18px;border-radius:999px;background:${theme.btn};color:${theme.btnInk};text-decoration:none;font-weight:600;font-size:15px">${label}</a>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
</head>
<body style="margin:0;min-height:100vh;background:${theme.bg};color:${theme.ink};font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<main style="max-width:420px;margin:0 auto;padding:48px 20px 64px;text-align:center">
<h1 style="margin:0;font-size:28px;letter-spacing:-0.03em">${title}</h1>
${subtitle}
${links || `<p style="color:${theme.muted}">Add at least one link</p>`}
</main>
</body>
</html>`;
}

export function runBioLink(
  options: Record<string, string>,
  format: "html" | "markdown" = "html",
): TextResult {
  const links = parseBioLinks(options.linksJson || "[]");
  const title = options.title || "";
  const subtitle = options.subtitle || "";
  const theme = (options.theme as BioTheme) || "deskzy";
  const valid = validBioLinks(links);
  if (valid.length === 0) {
    throw new Error("Add at least one link with a label and valid URL");
  }

  if (format === "markdown") {
    return {
      text: renderBioMarkdown({ title, subtitle, links }),
      meta: { links: valid.length, format: "markdown" },
    };
  }

  const html = renderBioHtml({ title, subtitle, links, theme });
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  return {
    text: html,
    download: { blob, filename: "bio-link.html" },
    meta: { links: valid.length, theme, format: "html" },
  };
}
