export type ToolCategory = "pdf" | "media" | "image" | "text";
export type ToolRuntime = "browser" | "edge" | "hybrid";
export type ToolInput = "file" | "files" | "text";

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
    description: "Formatters, generators, and URL tools.",
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
    description: "Shrink JPG, PNG, or WebP file size.",
    seoTitle: "Compress image online free",
    seoDescription: "Compress images in your browser. Private and fast.",
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
    category: "text",
    description: "Create a QR code from any text or URL.",
    seoTitle: "QR code generator online free",
    seoDescription: "Generate QR codes in your browser. Download as PNG.",
    runtime: "browser",
    input: "text",
    aliases: ["qr generator", "create qr"],
    related: ["url-shortener", "url-encode", "password-generator"],
    popular: true,
  },
  {
    slug: "url-shortener",
    name: "URL Shortener",
    category: "text",
    description: "Shorten long URLs with a fast Go-powered API.",
    seoTitle: "URL shortener free",
    seoDescription: "Shorten URLs instantly. Fast edge-ready architecture.",
    runtime: "hybrid",
    input: "text",
    aliases: ["short link", "link shortener"],
    related: ["qr-code", "url-encode", "json-formatter"],
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
    related: ["base64", "url-shortener", "json-formatter"],
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
    related: ["uuid-generator", "hash-generator", "qr-code"],
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
    related: ["compress-image", "qr-code", "url-shortener"],
    popular: true,
  },
];

export function getTool(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.popular);
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return getPopularTools();
  return TOOLS.filter((t) => {
    const hay = [t.name, t.description, t.slug, ...t.aliases]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function getRelatedTools(slug: string): ToolDefinition[] {
  const tool = getTool(slug);
  if (!tool) return [];
  return tool.related
    .map((s) => getTool(s))
    .filter((t): t is ToolDefinition => Boolean(t));
}
