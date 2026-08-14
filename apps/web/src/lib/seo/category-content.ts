import type { ToolCategory } from "@/lib/tools/registry";

type CategorySeo = {
  seoTitle: string;
  seoDescription: string;
  intro: string;
  /** Extra body copy for thin-content category pages (pdf / image / media). */
  body?: string[];
  faqs: { q: string; a: string }[];
};

export const CATEGORY_SEO: Record<ToolCategory, CategorySeo> = {
  pdf: {
    seoTitle: "Free PDF tools online — merge, split, compress",
    seoDescription:
      "Free private PDF tools in your browser — merge, split, compress, reorder, and convert to images. No upload, no signup. Process contracts and invoices on Deskzy.",
    intro:
      "Deskzy PDF tools run in your browser so contracts, invoices, and personal documents never touch a cloud server. Merge multiple PDFs, split pages, compress for email, reorder pages, or export pages as images — all free.",
    body: [
      "Teams and freelancers often need to combine scanned pages, shrink a file before email, or pull a single page from a longer packet. Uploading those documents to a random converter site creates unnecessary risk. Deskzy keeps PDF work on your device using browser APIs, so you stay in control of sensitive material.",
      "Start with Merge PDF when you have several files to combine, Split PDF when you need a page range, or Compress PDF when attachments bounce for size. Reorder PDF helps you fix page sequence after a scan, and PDF to Images turns pages into PNGs for slides, tickets, or social posts.",
      "Every tool on this page is free to try without an account. Prefer a share page or QR code for sharing the finished file? Deskzy Links tools sit alongside these PDF utilities in the same toolkit.",
    ],
    faqs: [
      {
        q: "Are Deskzy PDF tools really private?",
        a: "Yes. PDF processing uses browser APIs. Files stay on your device.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. All PDF tools work immediately without signup.",
      },
      {
        q: "Which PDF jobs can I do here?",
        a: "Merge, split, compress, reorder pages, and convert pages to PNG images — all in the browser.",
      },
    ],
  },
  image: {
    seoTitle: "Free image tools online — compress, resize, convert",
    seoDescription:
      "Compress, resize, and convert images privately in your browser. JPG, PNG, and WebP — free image tools with no signup. Optimize photos fast on Deskzy.",
    intro:
      "Optimize images without uploading to unknown servers. Compress photos for web, resize to exact dimensions, convert between PNG/JPG/WebP, or turn WebP into PNG for apps that need it.",
    body: [
      "Large camera photos slow down sites and get rejected by chat apps. Deskzy image tools let you pick a use-case preset (Email, WhatsApp, Web, Avatar) or an exact byte target, then download a smaller file without sending the original to our servers.",
      "Resize Image sets precise width and height for thumbnails and product shots. Convert Image and WebP to PNG help when a CMS or email client only accepts certain formats. Because everything runs locally, you can work with client assets and personal photos with less worry.",
      "Pair compressed images with Deskzy PDF or Links tools when you need to attach them to a document or share a short URL. No signup is required to start.",
    ],
    faqs: [
      {
        q: "Which image formats are supported?",
        a: "JPEG, PNG, WebP, and GIF for resize. Compress and convert support JPG, PNG, and WebP.",
      },
      {
        q: "Will compressing reduce quality?",
        a: "You choose the quality preset. Higher quality keeps more detail; smallest files prioritize size.",
      },
      {
        q: "Do my photos get uploaded?",
        a: "No. Compression, resize, and convert run in your browser. Files stay on your device.",
      },
    ],
  },
  media: {
    seoTitle: "Free media tools — video to MP3, WAV, converter",
    seoDescription:
      "Convert video and audio in your browser — video to MP3/WAV, audio formats, MP4/WebM. Private ffmpeg.wasm tools, free, no signup. Try Deskzy media.",
    intro:
      "Convert video and audio without sending large files to a remote farm. Deskzy media tools run ffmpeg.wasm in your browser for privacy and speed.",
    body: [
      "Remote video converters often require uploads of large files and unclear retention policies. Deskzy’s media path keeps processing in the browser so your clips are not parked on someone else’s disk while you wait.",
      "Start with Video to MP3 or Video to WAV when you need an audio track for podcasts, notes, or sharing without the full video. Use Audio Converter to switch between MP3, WAV, M4A, and OGG. Media Converter is the flexible hub — pick Video → Audio, Video → Video (MP4/WebM), or Audio → Audio from one workspace.",
      "Looking for image or PDF utilities next? Browse Deskzy Image and PDF categories — same privacy-first approach, still free to open without an account.",
    ],
    faqs: [
      {
        q: "Does video conversion upload my file?",
        a: "No. Processing runs in-browser with ffmpeg.wasm. Your media stays local during conversion.",
      },
      {
        q: "What formats work?",
        a: "Common video and audio containers as input. Outputs include MP3, WAV, M4A, OGG, MP4, and WebM depending on the convert type you choose.",
      },
      {
        q: "Is an account required?",
        a: "No. Media tools are available without signup.",
      },
    ],
  },
  text: {
    seoTitle: "Free text & developer tools — JSON, Base64, UUID",
    seoDescription:
      "Free developer text tools — JSON formatter, Base64, hash generator, UUID, password, and case converter. Private in your browser, no signup. Open Deskzy.",
    intro:
      "Format JSON, encode Base64, generate UUIDs and passwords, convert case, and more. Browser-first utilities with no signup. Looking for shared links, QR, UTM, or WhatsApp? See Deskzy Links tools.",
    body: [
      "Small developer utilities should be quick, predictable, and easy to inspect. Deskzy text tools keep input on the page and run locally in the browser, which makes them useful for formatting snippets, checking copied payloads, creating identifiers, and cleaning draft text without opening a heavy dashboard.",
      "Use JSON Formatter for readable API responses, Base64 for encoding and decoding strings, Hash Generator for checksums, UUID Generator for identifiers, and Password Generator when you need a random value for a non-shared credential workflow. Case Converter, URL Encode, Word Counter, and Markdown to HTML cover everyday writing and publishing cleanup.",
      "These tools are not a substitute for your company's secret-management policy. If a production token, private key, or regulated record should never enter a web page, keep following that rule. For ordinary snippets and drafts, the browser-first workflow keeps the job fast and avoids unnecessary uploads.",
    ],
    faqs: [
      {
        q: "Where did Share Link go?",
        a: "Share Link, QR codes, UTM builder, WhatsApp links, and bio pages live under Deskzy Links tools.",
      },
      {
        q: "Are developer tools safe for production secrets?",
        a: "Browser tools don't upload input, but avoid pasting live secrets on any website if policy forbids it.",
      },
      {
        q: "Do text tools require an account?",
        a: "No. They open immediately and run in your browser.",
      },
    ],
  },
  links: {
    seoTitle: "Deskzy Links — share links, QR, UTM, WhatsApp",
    seoDescription:
      "Deskzy Links: publish share pages on deskzy.xyz, QR codes, UTM builder, WhatsApp wa.me links, and bio pages. No signup. Share faster with Deskzy.",
    intro:
      "Deskzy Links is the share stack: paste a URL and publish a clean deskzy.xyz page, then pair it with a QR code, UTM campaign params, a WhatsApp wa.me link, or a downloadable bio page — mostly in your browser, no account required.",
    body: [
      "Shared links are the core. Only the URL string is sent to Deskzy’s edge API so pages work; we do not upload files. QR, UTM, WhatsApp, and bio builders run locally so campaign text and contact details stay on your device.",
      "Need to compress a PDF or image before you share? Deskzy’s file tools sit alongside Links and process privately in the browser — complementary utilities, same no-signup start.",
    ],
    faqs: [
      {
        q: "Is Share Link free?",
        a: "Yes. Create deskzy.xyz share pages with no signup. Only the URL string is sent to our edge API.",
      },
      {
        q: "Do UTM, WhatsApp, and bio tools upload my data?",
        a: "No. Those builders run entirely in your browser. Bio pages are downloaded as HTML — Deskzy does not host them.",
      },
      {
        q: "Can I make a QR code for my shared or WhatsApp link?",
        a: "Yes. Use Make QR from the tool result, or open the QR generator and paste any URL.",
      },
    ],
  },
};
