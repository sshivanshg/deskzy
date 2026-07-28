export type ToolCategory = "pdf" | "media" | "image" | "text" | "links";
export type ToolRuntime = "browser" | "edge" | "hybrid";
export type ToolInput = "file" | "files" | "text" | "form";

export type ToolDefinition = {
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  seoTitle: string;
  seoDescription: string;
  runtime: ToolRuntime;
  input: ToolInput;
  accept?: string;
  aliases: string[];
  related: string[];
  popular?: boolean;
};

export const CATEGORIES: {
  id: ToolCategory;
  name: string;
  description: string;
}[] = [
  {
    id: "pdf",
    name: "PDF",
    description: "Merge, split, compress, and organize PDFs in your browser.",
  },
  {
    id: "media",
    name: "Media",
    description: "Convert and prepare audio and video files.",
  },
  {
    id: "image",
    name: "Image",
    description: "Compress, resize, and convert images privately.",
  },
  {
    id: "text",
    name: "Text & Dev",
    description: "Formatters, generators, and text utilities.",
  },
  {
    id: "links",
    name: "Links",
    description: "Shorten, QR, UTM, WhatsApp, and bio link tools.",
  },
];

export const TOOLS: ToolDefinition[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    category: "pdf",
    description: "Combine multiple PDFs into one file.",
    seoTitle: "Merge PDF online free",
    seoDescription:
      "Merge PDF files in your browser. Private, fast, no signup.",
    runtime: "browser",
    input: "files",
    accept: "application/pdf",
    aliases: ["combine pdf", "join pdf"],
    related: ["split-pdf", "compress-pdf", "pdf-to-images"],
    popular: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    description: "Extract pages or split a PDF into separate files.",
    seoTitle: "Split PDF online free",
    seoDescription: "Split PDF pages in your browser. Files never leave your device.",
    runtime: "browser",
    input: "file",
    accept: "application/pdf",
    aliases: ["extract pdf pages"],
    related: ["merge-pdf", "compress-pdf", "reorder-pdf"],
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    category: "pdf",
    description: "Reduce PDF file size without uploading to a server.",
    seoTitle: "Compress PDF online free",
    seoDescription:
      "Compress PDF files privately in your browser. No signup required.",
    runtime: "browser",
    input: "file",
    accept: "application/pdf",
    aliases: ["shrink pdf", "reduce pdf size"],
    related: ["merge-pdf", "split-pdf", "pdf-to-images"],
    popular: true,
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images",
    category: "pdf",
    description: "Render PDF pages as PNG images.",
    seoTitle: "PDF to PNG online free",
    seoDescription: "Convert PDF pages to PNG images in your browser.",
    runtime: "browser",
    input: "file",
    accept: "application/pdf",
    aliases: ["pdf to png", "pdf to jpg"],
    related: ["compress-pdf", "merge-pdf", "compress-image"],
  },
  {
    slug: "reorder-pdf",
    name: "Reorder PDF",
    category: "pdf",
    description: "Change the page order of a PDF.",
    seoTitle: "Reorder PDF pages online",
    seoDescription: "Reorder PDF pages privately in your browser.",
    runtime: "browser",
    input: "file",
    accept: "application/pdf",
    aliases: ["organize pdf", "rearrange pdf"],
    related: ["split-pdf", "merge-pdf", "compress-pdf"],
  },
  {
    slug: "compress-image",
    name: "Compress Image",
    category: "image",
    description: "Shrink photos with use-case presets or a target file size.",
    seoTitle: "Compress image online free",
    seoDescription:
      "Compress images in your browser with Email, WhatsApp, Web, and Avatar presets — or set an exact size limit. Private and free.",
    runtime: "browser",
    input: "file",
    accept: "image/jpeg,image/png,image/webp",
    aliases: ["shrink image", "optimize image"],
    related: ["resize-image", "convert-image", "webp-to-png"],
    popular: true,
  },
  {
    slug: "resize-image",
    name: "Resize Image",
    category: "image",
    description: "Resize an image to exact dimensions.",
    seoTitle: "Resize image online free",
    seoDescription: "Resize images in your browser without uploading.",
    runtime: "browser",
    input: "file",
    accept: "image/jpeg,image/png,image/webp,image/gif",
    aliases: ["scale image"],
    related: ["compress-image", "convert-image", "webp-to-png"],
  },
  {
    slug: "convert-image",
    name: "Convert Image",
    category: "image",
    description: "Convert between PNG, JPG, and WebP.",
    seoTitle: "Image format converter online",
    seoDescription: "Convert image formats in your browser.",
    runtime: "browser",
    input: "file",
    accept: "image/jpeg,image/png,image/webp",
    aliases: ["png to jpg", "jpg to png", "webp converter"],
    related: ["webp-to-png", "compress-image", "resize-image"],
  },
  {
    slug: "webp-to-png",
    name: "WebP to PNG",
    category: "image",
    description: "Convert WebP images to PNG.",
    seoTitle: "WebP to PNG converter online",
    seoDescription: "Convert WebP to PNG privately in your browser.",
    runtime: "browser",
    input: "file",
    accept: "image/webp",
    aliases: ["webp converter"],
    related: ["convert-image", "compress-image", "resize-image"],
    popular: true,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "text",
    description: "Format and validate JSON instantly.",
    seoTitle: "JSON formatter and validator online",
    seoDescription: "Pretty-print and validate JSON in your browser.",
    runtime: "browser",
    input: "text",
    aliases: ["json pretty", "json validate", "jsonlint"],
    related: ["base64", "hash-generator", "uuid-generator"],
    popular: true,
  },
  {
    slug: "base64",
    name: "Base64 Encode / Decode",
    category: "text",
    description: "Encode or decode Base64 text.",
    seoTitle: "Base64 encode decode online",
    seoDescription: "Base64 encode and decode instantly in your browser.",
    runtime: "browser",
    input: "text",
    aliases: ["base64 encoder", "base64 decoder"],
    related: ["json-formatter", "hash-generator", "url-encode"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "text",
    description: "Generate SHA-256 or SHA-1 hashes.",
    seoTitle: "SHA-256 hash generator online",
    seoDescription: "Generate cryptographic hashes in your browser.",
    runtime: "browser",
    input: "text",
    aliases: ["sha256", "checksum", "md5 online"],
    related: ["uuid-generator", "base64", "json-formatter"],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "text",
    description: "Generate UUID v4 identifiers.",
    seoTitle: "UUID generator online",
    seoDescription: "Generate UUID v4 values instantly.",
    runtime: "browser",
    input: "text",
    aliases: ["guid generator"],
    related: ["hash-generator", "password-generator", "json-formatter"],
  },
  {
    slug: "qr-code",
    name: "QR Code Generator",
    category: "links",
    description: "Create a QR code from any text or URL.",
    seoTitle: "QR code generator online free",
    seoDescription: "Generate QR codes in your browser. Download as PNG.",
    runtime: "browser",
    input: "text",
    aliases: ["qr generator", "create qr"],
    related: ["url-shortener", "whatsapp-link", "utm-builder"],
    popular: true,
  },
  {
    slug: "url-shortener",
    name: "URL Shortener",
    category: "links",
    description: "Turn long links into short deskzy.xyz URLs in one paste.",
    seoTitle: "URL shortener free — shorten links online",
    seoDescription:
      "Free URL shortener with no signup. Paste a long link, get a short deskzy.xyz URL instantly. Only the URL string is sent to our API.",
    runtime: "hybrid",
    input: "text",
    aliases: [
      "short link",
      "link shortener",
      "shorten url",
      "shorten link",
      "tiny url",
      "bitly",
    ],
    related: ["qr-code", "utm-builder", "bio-link"],
    popular: true,
  },
  {
    slug: "utm-builder",
    name: "UTM Builder",
    category: "links",
    description:
      "Add UTM parameters to any URL for campaign tracking — with presets for ads and social.",
    seoTitle: "UTM builder online free — campaign URL generator",
    seoDescription:
      "Free UTM parameter builder. Add source, medium, campaign, term, and content. Presets for Google Ads, Instagram, LinkedIn, and newsletters. Private — runs in your browser.",
    runtime: "browser",
    input: "form",
    aliases: [
      "utm generator",
      "utm link builder",
      "campaign url builder",
      "utm parameters",
    ],
    related: ["url-shortener", "qr-code", "whatsapp-link"],
    popular: true,
  },
  {
    slug: "whatsapp-link",
    name: "WhatsApp Link Generator",
    category: "links",
    description:
      "Create a click-to-chat wa.me link with country code and a prefilled message.",
    seoTitle: "WhatsApp link generator free — wa.me click to chat",
    seoDescription:
      "Generate WhatsApp click-to-chat links with country code and message. Free wa.me URL builder — private, no signup.",
    runtime: "browser",
    input: "form",
    aliases: [
      "wa.me generator",
      "whatsapp click to chat",
      "whatsapp url",
      "whatsapp message link",
    ],
    related: ["qr-code", "url-shortener", "bio-link"],
    popular: true,
  },
  {
    slug: "bio-link",
    name: "Bio Link Creator",
    category: "links",
    description:
      "Build a simple link-in-bio page in your browser — themes, reorder links, download HTML.",
    seoTitle: "Bio link creator free — link in bio page builder",
    seoDescription:
      "Create a link-in-bio page with themes and up to 8 links. Preview live, copy Markdown, or download standalone HTML. Private — nothing is hosted or stored.",
    runtime: "browser",
    input: "form",
    aliases: [
      "link in bio",
      "biolink",
      "linktree alternative",
      "bio page builder",
    ],
    related: ["url-shortener", "qr-code", "whatsapp-link"],
    popular: true,
  },
  {
    slug: "url-encode",
    name: "URL Encode / Decode",
    category: "text",
    description: "Encode or decode URL components.",
    seoTitle: "URL encode decode online",
    seoDescription: "URL-encode and decode strings in your browser.",
    runtime: "browser",
    input: "text",
    aliases: ["percent encoding"],
    related: ["base64", "utm-builder", "json-formatter"],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    category: "text",
    description: "Count words, characters, and sentences.",
    seoTitle: "Word counter online",
    seoDescription: "Count words and characters instantly.",
    runtime: "browser",
    input: "text",
    aliases: ["character counter"],
    related: ["case-converter", "markdown-to-html", "json-formatter"],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "text",
    description: "Switch between upper, lower, title, and more.",
    seoTitle: "Case converter online",
    seoDescription: "Convert text case instantly in your browser.",
    runtime: "browser",
    input: "text",
    aliases: ["uppercase", "lowercase", "title case"],
    related: ["word-counter", "markdown-to-html", "json-formatter"],
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML",
    category: "text",
    description: "Convert Markdown to HTML.",
    seoTitle: "Markdown to HTML converter",
    seoDescription: "Convert Markdown to HTML in your browser.",
    runtime: "browser",
    input: "text",
    aliases: ["md to html"],
    related: ["json-formatter", "word-counter", "case-converter"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "text",
    description: "Generate strong random passwords.",
    seoTitle: "Password generator online",
    seoDescription: "Generate secure passwords in your browser.",
    runtime: "browser",
    input: "text",
    aliases: ["random password"],
    related: ["uuid-generator", "hash-generator", "json-formatter"],
  },
  {
    slug: "video-to-mp3",
    name: "Video to MP3",
    category: "media",
    description: "Extract audio from video files in your browser (coming soon: ffmpeg.wasm).",
    seoTitle: "Video to MP3 converter online",
    seoDescription: "Convert video to MP3 privately. Browser-based pipeline.",
    runtime: "browser",
    input: "file",
    accept: "video/*,audio/*",
    aliases: ["mp4 to mp3", "extract audio"],
    related: ["compress-image", "webp-to-png", "url-shortener"],
    popular: true,
  },
];

export function getTool(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category);
}

/** Intent → tool slug for short paths like /shorten → url-shortener */
export const ROUTE_SHORTCUTS: Record<string, string> = {
  shorten: "url-shortener",
  short: "url-shortener",
  link: "url-shortener",
  compress: "compress-pdf",
  merge: "merge-pdf",
  split: "split-pdf",
  qr: "qr-code",
  utm: "utm-builder",
  whatsapp: "whatsapp-link",
  wa: "whatsapp-link",
  bio: "bio-link",
  biolink: "bio-link",
  webp: "webp-to-png",
  json: "json-formatter",
  hash: "hash-generator",
  uuid: "uuid-generator",
  password: "password-generator",
  base64: "base64",
  resize: "resize-image",
};

export type UseCase = {
  id: string;
  label: string;
  hint: string;
  href: string;
};

/** Homepage “I need to…” paths for specific use cases */
export const USE_CASES: UseCase[] = [
  {
    id: "shorten",
    label: "Shorten a link",
    hint: "Paste any URL → short deskzy.xyz link",
    href: "/tools/url-shortener",
  },
  {
    id: "compress-pdf",
    label: "Compress a PDF",
    hint: "Shrink file size in the browser",
    href: "/tools/compress-pdf",
  },
  {
    id: "merge-pdf",
    label: "Merge PDFs",
    hint: "Combine multiple PDFs into one",
    href: "/tools/merge-pdf",
  },
  {
    id: "compress-image",
    label: "Compress an image",
    hint: "Smaller JPG/PNG/WebP, private",
    href: "/tools/compress-image",
  },
  {
    id: "webp",
    label: "WebP to PNG",
    hint: "Convert WebP for apps that need PNG",
    href: "/tools/webp-to-png",
  },
  {
    id: "qr",
    label: "Make a QR code",
    hint: "From any text or URL",
    href: "/tools/qr-code",
  },
  {
    id: "utm",
    label: "Build a UTM link",
    hint: "Track campaigns with utm_ params",
    href: "/tools/utm-builder",
  },
  {
    id: "whatsapp",
    label: "WhatsApp click-to-chat",
    hint: "wa.me link with a prefilled message",
    href: "/tools/whatsapp-link",
  },
  {
    id: "bio",
    label: "Create a bio link page",
    hint: "Themes + downloadable HTML",
    href: "/tools/bio-link",
  },
  {
    id: "json",
    label: "Format JSON",
    hint: "Pretty-print or minify",
    href: "/tools/json-formatter",
  },
  {
    id: "password",
    label: "Generate a password",
    hint: "Strong random passwords",
    href: "/tools/password-generator",
  },
];

export function getPopularTools(): ToolDefinition[] {
  const popular = TOOLS.filter((t) => t.popular);
  return popular.sort((a, b) => {
    if (a.slug === "url-shortener") return -1;
    if (b.slug === "url-shortener") return 1;
    return 0;
  });
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return getPopularTools();
  const shortcut = ROUTE_SHORTCUTS[q.replace(/\s+/g, "")];
  if (shortcut) {
    const tool = getTool(shortcut);
    if (tool) return [tool, ...TOOLS.filter((t) => t.slug !== shortcut)];
  }
  return TOOLS.filter((t) => {
    const hay = [t.name, t.description, t.slug, ...t.aliases]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function resolveShortcut(segment: string): string | undefined {
  return ROUTE_SHORTCUTS[segment.trim().toLowerCase()];
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getTool(slug);
  if (!tool) return [];
  return tool.related
    .map((s) => getTool(s))
    .filter((t): t is ToolDefinition => Boolean(t));
}
