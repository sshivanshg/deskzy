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
    description:
      "Shorten on deskzy.xyz, then QR, UTM, WhatsApp, and bio — the share stack.",
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
      "Merge PDF files free in your browser — combine multiple documents into one. Private, fast, no signup, and your files never leave your device. Try Deskzy now.",
    runtime: "browser",
    input: "files",
    accept: "application/pdf",
    aliases: [
      "combine pdf",
      "join pdf",
      "merge pdf online free",
      "merge pdf without upload",
    ],
    related: ["split-pdf", "compress-pdf", "pdf-to-images"],
    popular: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    category: "pdf",
    description: "Extract pages or split a PDF into separate files.",
    seoTitle: "Split PDF online free",
    seoDescription:
      "Split PDF pages free in your browser. Extract ranges or save each page separately — files never leave your device. No signup required. Open Deskzy Split PDF.",
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
      "Compress PDF files privately in your browser to shrink size for email or upload. Free, no signup, and your document never leaves your device. Try Deskzy.",
    runtime: "browser",
    input: "file",
    accept: "application/pdf",
    aliases: [
      "shrink pdf",
      "reduce pdf size",
      "compress pdf for email",
      "pdf compressor online free",
    ],
    related: ["merge-pdf", "split-pdf", "pdf-to-images"],
    popular: true,
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images",
    category: "pdf",
    description: "Render PDF pages as PNG images.",
    seoTitle: "PDF to PNG online free",
    seoDescription:
      "Convert PDF pages to PNG images free in your browser. Private rendering with no upload and no signup — export pages for slides, web, or print with Deskzy.",
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
    seoDescription:
      "Reorder PDF pages privately in your browser. Drag to rearrange, then download the updated file — free, no signup, and nothing is uploaded to a server.",
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
      "Compress images free in your browser with Email, WhatsApp, Web, and Avatar presets — or set an exact size. Private, no signup. Optimize photos on Deskzy.",
    runtime: "browser",
    input: "file",
    accept: "image/jpeg,image/png,image/webp",
    aliases: [
      "shrink image",
      "optimize image",
      "compress image for whatsapp",
      "reduce photo size",
    ],
    related: ["resize-image", "convert-image", "webp-to-png"],
    popular: true,
  },
  {
    slug: "resize-image",
    name: "Resize Image",
    category: "image",
    description: "Resize an image to exact dimensions.",
    seoTitle: "Resize image online free",
    seoDescription:
      "Resize images free in your browser to exact dimensions. Scale photos for web, social, or print without uploading. Private, no signup — try Deskzy Resize.",
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
    seoDescription:
      "Convert image formats free in your browser — PNG, JPG, and WebP. Private conversion with no upload and no signup. Switch formats instantly on Deskzy.",
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
    seoDescription:
      "Convert WebP to PNG free and privately in your browser. No upload, no signup — get a compatible PNG for apps that need it. Open Deskzy WebP to PNG.",
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
    seoDescription:
      "Pretty-print and validate JSON free in your browser. Fix syntax errors instantly with a private formatter — no signup, nothing uploaded. Try Deskzy JSON.",
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
    seoDescription:
      "Base64 encode and decode free in your browser. Instant, private conversion for text and data strings — no signup required. Open Deskzy Base64 tools.",
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
    seoDescription:
      "Generate SHA-256 or SHA-1 hashes free in your browser. Private checksums with no upload and no signup — verify integrity instantly on Deskzy.",
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
    seoDescription:
      "Generate UUID v4 identifiers free in your browser. Instant, private GUIDs for apps and databases — no signup required. Create UUIDs on Deskzy now.",
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
    seoDescription:
      "Generate QR codes free in your browser from any text or URL. Download as PNG — private, no signup, nothing uploaded. Create a QR on Deskzy in seconds.",
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
      "Free URL shortener with no signup. Paste a long link and get a short deskzy.xyz URL instantly. Only the URL string is sent — shorten links online now.",
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
    related: ["link-list", "qr-code", "utm-builder", "bio-link"],
    popular: true,
  },
  {
    slug: "link-list",
    name: "Multi-Link Shortener",
    category: "links",
    description:
      "Add several links one by one and get one short deskzy.xyz URL that opens a list page.",
    seoTitle: "Multi-link shortener free — share multiple URLs as one",
    seoDescription:
      "Free multi-link shortener. Add several URLs and get one short deskzy.xyz link that opens a shareable list. No signup.",
    runtime: "hybrid",
    input: "form",
    aliases: [
      "paste links",
      "multiple links",
      "multi url shortener",
      "link list",
      "pastelinks",
      "share multiple urls",
    ],
    related: ["url-shortener", "bio-link", "qr-code"],
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
    related: ["qr-code", "url-shortener", "link-list"],
    popular: true,
  },
  {
    slug: "bio-link",
    name: "Bio Link Creator",
    category: "links",
    description:
      "Build a private link-in-bio page — profile, rich blocks, live preview, download HTML.",
    seoTitle: "Bio link creator free — link in bio page builder",
    seoDescription:
      "Create a link-in-bio page with profile photo, unlimited blocks, themes, and live preview. Copy Markdown or JSON, or download standalone HTML. Private — nothing is hosted or uploaded.",
    runtime: "browser",
    input: "form",
    aliases: [
      "link in bio",
      "biolink",
      "linktree alternative",
      "bio page builder",
    ],
    related: ["url-shortener", "link-list", "qr-code"],
    popular: true,
  },
  {
    slug: "url-encode",
    name: "URL Encode / Decode",
    category: "text",
    description: "Encode or decode URL components.",
    seoTitle: "URL encode decode online",
    seoDescription:
      "URL-encode and decode strings free in your browser. Percent-encode query values privately with no signup. Open Deskzy URL Encode / Decode to start.",
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
    seoDescription:
      "Count words, characters, and sentences free in your browser. Instant private word counter — no signup, nothing uploaded. Paste text into Deskzy now.",
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
    seoDescription:
      "Convert text case free in your browser — upper, lower, title, and more. Instant, private, no signup. Switch casing with Deskzy Case Converter today.",
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
    seoDescription:
      "Convert Markdown to HTML free in your browser. Private preview and export with no upload and no signup. Paste Markdown into Deskzy and get clean HTML.",
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
    seoDescription:
      "Generate strong random passwords free in your browser. Private, no signup — create secure passwords offline-style on your device with Deskzy.",
    runtime: "browser",
    input: "text",
    aliases: ["random password"],
    related: ["uuid-generator", "hash-generator", "json-formatter"],
  },
  {
    slug: "media-converter",
    name: "Media Converter",
    category: "media",
    description:
      "Convert video and audio in your browser — video to audio, video to video, or audio to audio.",
    seoTitle: "Media converter online — video & audio",
    seoDescription:
      "Convert video and audio privately in your browser. Video to MP3, WAV, MP4, WebM, and more — free, no upload, no signup. Open Deskzy Media Converter.",
    runtime: "browser",
    input: "file",
    accept: "video/*,audio/*",
    aliases: [
      "convert video",
      "convert audio",
      "video converter",
      "audio converter online",
    ],
    related: [
      "video-to-mp3",
      "video-to-wav",
      "audio-converter",
      "compress-image",
    ],
    popular: true,
  },
  {
    slug: "video-to-mp3",
    name: "Video to MP3",
    category: "media",
    description: "Extract audio from video files as MP3 in your browser.",
    seoTitle: "Video to MP3 converter online",
    seoDescription:
      "Convert video to MP3 privately in your browser. Extract audio without uploading to a remote farm — free media tools on Deskzy. No signup required.",
    runtime: "browser",
    input: "file",
    accept: "video/*,audio/*",
    aliases: ["mp4 to mp3", "extract audio", "video to audio"],
    related: [
      "media-converter",
      "video-to-wav",
      "audio-converter",
      "compress-image",
    ],
    popular: true,
  },
  {
    slug: "video-to-wav",
    name: "Video to WAV",
    category: "media",
    description: "Extract lossless WAV audio from video in your browser.",
    seoTitle: "Video to WAV converter online",
    seoDescription:
      "Convert video to WAV privately in your browser. Extract uncompressed audio without uploading — free on Deskzy. No signup required.",
    runtime: "browser",
    input: "file",
    accept: "video/*,audio/*",
    aliases: ["mp4 to wav", "extract wav", "video to wav"],
    related: [
      "video-to-mp3",
      "media-converter",
      "audio-converter",
      "compress-image",
    ],
  },
  {
    slug: "audio-converter",
    name: "Audio Converter",
    category: "media",
    description: "Convert audio between MP3, WAV, M4A, and OGG in your browser.",
    seoTitle: "Audio converter online — MP3, WAV, M4A, OGG",
    seoDescription:
      "Convert audio formats privately in your browser — MP3, WAV, M4A, OGG. Free, no upload, no signup. Open Deskzy Audio Converter.",
    runtime: "browser",
    input: "file",
    accept: "audio/*,video/*",
    aliases: [
      "mp3 converter",
      "wav to mp3",
      "m4a to mp3",
      "convert audio format",
    ],
    related: [
      "media-converter",
      "video-to-mp3",
      "video-to-wav",
      "compress-image",
    ],
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
  list: "link-list",
  multilink: "link-list",
  "link-list": "link-list",
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
  mp3: "video-to-mp3",
  "convert-media": "media-converter",
  "media-convert": "media-converter",
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
    id: "link-list",
    label: "Share multiple links",
    hint: "Add links one by one → one list short URL",
    href: "/tools/link-list",
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
    id: "json",
    label: "Format JSON",
    hint: "Pretty-print or minify",
    href: "/tools/json-formatter",
  },
  {
    id: "webp",
    label: "WebP to PNG",
    hint: "Convert WebP for apps that need PNG",
    href: "/tools/webp-to-png",
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
