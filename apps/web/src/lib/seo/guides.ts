export type GuideFaq = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  toolSlug: string;
  relatedToolSlugs: string[];
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  faqs: GuideFaq[];
  body: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "compress-pdf-for-email",
    title: "How to compress a PDF for email without uploading it",
    description:
      "Shrink a PDF so it fits email attachment limits. Deskzy compresses privately in your browser — no cloud upload.",
    toolSlug: "compress-pdf",
    relatedToolSlugs: ["merge-pdf", "split-pdf", "pdf-to-images"],
    keywords: [
      "compress pdf for email",
      "reduce pdf size",
      "shrink pdf attachment",
      "pdf under 25mb",
    ],
    publishedAt: "2026-07-29",
    faqs: [
      {
        q: "What size should a PDF be for email?",
        a: "Most providers limit attachments to about 20–25 MB. Aim under 10 MB when you can so the message still sends quickly.",
      },
      {
        q: "Does Deskzy upload my PDF to compress it?",
        a: "No. Compress PDF runs entirely in your browser. The file never leaves your device.",
      },
      {
        q: "Will compressing ruin text quality?",
        a: "Text usually stays sharp. Images inside the PDF may be recompressed depending on the preset you choose.",
      },
    ],
    body: `Email providers reject oversized attachments. If your PDF is too large, compress it before you hit send.

## Why browser compression matters

Cloud compressors upload your contract, invoice, or ID scan to someone else's server. Deskzy's [Compress PDF](/tools/compress-pdf) tool processes the file locally, so sensitive documents stay on your device.

## Steps

1. Open [Compress PDF](/tools/compress-pdf).
2. Drop your PDF into the tool.
3. Pick a preset — **smallest** for tight email limits, **balanced** for everyday use, or **high** when quality matters more than size.
4. Download the smaller file and attach it to your email.

## Tips if it is still too big

- Split a long PDF and send only the pages you need with [Split PDF](/tools/split-pdf).
- Merge only the essential files with [Merge PDF](/tools/merge-pdf) instead of one giant scan pack.
- Export image-heavy pages and compress images separately with [Compress Image](/tools/compress-image).

## When to use Deskzy vs a cloud tool

Use Deskzy when privacy matters or you do not want an account. Use a cloud service only if you need advanced OCR or server-side features Deskzy does not offer yet.`,
  },
  {
    slug: "merge-pdf-without-uploading",
    title: "Merge PDF files online without uploading to the cloud",
    description:
      "Combine multiple PDFs into one document privately in your browser. Free merge PDF with no signup on Deskzy.",
    toolSlug: "merge-pdf",
    relatedToolSlugs: ["split-pdf", "compress-pdf", "reorder-pdf"],
    keywords: [
      "merge pdf online free",
      "combine pdf without upload",
      "join pdf files",
      "private pdf merger",
    ],
    publishedAt: "2026-07-29",
    faqs: [
      {
        q: "Can I merge PDFs without an account?",
        a: "Yes. Deskzy Merge PDF works immediately with no signup.",
      },
      {
        q: "Are my files uploaded when I merge?",
        a: "No. Merging happens in your browser using Web APIs. Files stay on your device.",
      },
      {
        q: "Can I control the order of pages?",
        a: "Yes. Arrange files before merging. Use Reorder PDF afterward if you need to rearrange pages inside one file.",
      },
    ],
    body: `Need one PDF from several exports, scans, or signed pages? Merge them locally instead of sending every file to a random converter site.

## How private merge works

Deskzy [Merge PDF](/tools/merge-pdf) reads your files in the browser and writes a single combined PDF. Nothing is stored on Deskzy servers.

## Steps

1. Open [Merge PDF](/tools/merge-pdf).
2. Select two or more PDF files.
3. Arrange the order if needed, then click Merge.
4. Download the combined document.

## After you merge

- Shrink the result for email with [Compress PDF](/tools/compress-pdf).
- Pull pages apart again with [Split PDF](/tools/split-pdf).
- Fix page order with [Reorder PDF](/tools/reorder-pdf).

Private merge is ideal for contracts, homework packs, and travel documents you would rather not upload.`,
  },
  {
    slug: "free-url-shortener-no-signup",
    title: "Free URL shortener with no signup — short links on jfas.site",
    description:
      "Shorten long URLs into clean jfas.site links without creating an account. Free link shortener for sharing, bios, and QR codes.",
    toolSlug: "url-shortener",
    relatedToolSlugs: ["qr-code", "utm-builder", "bio-link"],
    keywords: [
      "free url shortener",
      "shorten link no signup",
      "bitly alternative free",
      "jfas.site short link",
    ],
    publishedAt: "2026-07-29",
    faqs: [
      {
        q: "Is Deskzy's URL shortener free?",
        a: "Yes. Create short links with no account wall for normal use.",
      },
      {
        q: "What domain do short links use?",
        a: "Short links use jfas.site with a /p/ path, for example jfas.site/p/your-code.",
      },
      {
        q: "Do you upload my files when I shorten a link?",
        a: "No. Only the URL string is sent to the API. PDF and image tools stay fully in-browser.",
      },
    ],
    body: `Long tracking URLs break in chats and look messy on slides. A short link is easier to share — and you should not need an account for a simple paste.

## Shorten in three steps

1. Open the [URL Shortener](/tools/url-shortener) (or go to \`/shorten\`).
2. Paste your full URL and click Shorten.
3. Copy the \`jfas.site/p/...\` link and share it.

## Pair short links with other Deskzy tools

- Turn the short URL into a printable code with the [QR Code Generator](/tools/qr-code).
- Add campaign tags first with the [UTM Builder](/tools/utm-builder), then shorten the tracked URL.
- Drop short links into a downloadable bio page with the [Bio Link Creator](/tools/bio-link).

## Privacy note

The shortener is a hybrid tool: only the URL text is stored so redirects work. It does not upload documents or photos.`,
  },
  {
    slug: "compress-image-for-whatsapp",
    title: "Compress an image for WhatsApp without losing the important detail",
    description:
      "Shrink JPG, PNG, or WebP photos for WhatsApp and chat apps. Private image compression in your browser on Deskzy.",
    toolSlug: "compress-image",
    relatedToolSlugs: ["resize-image", "convert-image", "webp-to-png"],
    keywords: [
      "compress image for whatsapp",
      "shrink photo for chat",
      "reduce jpg size",
      "optimize image online free",
    ],
    publishedAt: "2026-07-29",
    faqs: [
      {
        q: "What image size works well for WhatsApp?",
        a: "Under 1–2 MB usually sends quickly. Use the WhatsApp or Email preset in Compress Image when available.",
      },
      {
        q: "Does compression upload my photos?",
        a: "No. Deskzy compresses images in your browser. Files stay on your device.",
      },
      {
        q: "Can I resize instead of compressing?",
        a: "Yes. Use Resize Image for exact dimensions, then compress if the file is still large.",
      },
    ],
    body: `Chat apps slow down (or refuse) huge camera rolls. Compress before you send so the photo arrives without the wait.

## Steps

1. Open [Compress Image](/tools/compress-image).
2. Drop a JPG, PNG, or WebP file.
3. Choose a WhatsApp / Email-style preset or set a target size.
4. Download the smaller image and send it.

## Related fixes

- Need exact pixels for an avatar? Use [Resize Image](/tools/resize-image).
- Wrong format? Use [Convert Image](/tools/convert-image) or [WebP to PNG](/tools/webp-to-png).

All of these run privately in the browser — useful when the photo is personal or work-sensitive.`,
  },
  {
    slug: "create-qr-code-from-url",
    title: "Create a free QR code from any URL (and pair it with a short link)",
    description:
      "Generate a downloadable PNG QR code from a URL or text. Free, private, no watermark — optional Deskzy short link first.",
    toolSlug: "qr-code",
    relatedToolSlugs: ["url-shortener", "whatsapp-link", "utm-builder"],
    keywords: [
      "qr code generator free",
      "create qr from url",
      "qr code png download",
      "qr for short link",
    ],
    publishedAt: "2026-07-29",
    faqs: [
      {
        q: "Is the QR code free to download?",
        a: "Yes. Download a PNG with no watermark and no signup.",
      },
      {
        q: "Should I shorten the URL before making a QR?",
        a: "Often yes. Shorter URLs make denser codes easier to scan, and you can update messaging around a short link more easily.",
      },
      {
        q: "Is QR generation private?",
        a: "Yes. Generation runs in your browser. Content is not uploaded.",
      },
    ],
    body: `QR codes turn a URL into something people can open from print, packaging, or a slide.

## Best workflow

1. (Optional) Shorten the destination with the [URL Shortener](/tools/url-shortener).
2. Open the [QR Code Generator](/tools/qr-code).
3. Paste the URL (or any text) and generate.
4. Download the PNG for print or digital use.

## Ideas

- Menu or flyer → short link → QR
- WhatsApp support number → [WhatsApp link](/tools/whatsapp-link) → QR
- Campaign landing page → [UTM Builder](/tools/utm-builder) → short link → QR

Private generation means your draft URLs never need to hit a third-party QR farm.`,
  },
  {
    slug: "whatsapp-click-to-chat-link",
    title: "How to make a WhatsApp click-to-chat (wa.me) link",
    description:
      "Build a wa.me link with country code and optional prefilled message. Free WhatsApp URL generator — private, no signup.",
    toolSlug: "whatsapp-link",
    relatedToolSlugs: ["qr-code", "url-shortener", "bio-link"],
    keywords: [
      "whatsapp click to chat",
      "wa.me generator",
      "whatsapp link with message",
      "whatsapp url builder",
    ],
    publishedAt: "2026-07-29",
    faqs: [
      {
        q: "What is a wa.me link?",
        a: "It opens WhatsApp (app or web) to a chat with a specific number, optionally with a draft message already filled in.",
      },
      {
        q: "Do I include the + in the phone number?",
        a: "No. Choose the country dial code in the tool and enter the national number separately.",
      },
      {
        q: "Can I put the WhatsApp link in a QR code?",
        a: "Yes. Generate the wa.me URL, then use Deskzy's QR generator so people can scan to chat.",
      },
    ],
    body: `A click-to-chat link removes the friction of saving a number. Customers tap once and land in WhatsApp with your message ready.

## Steps

1. Open the [WhatsApp Link Generator](/tools/whatsapp-link).
2. Pick a country code and enter the phone number.
3. Optionally add a prefilled message (“Hi, I saw your site…”).
4. Copy the \`wa.me\` link.

## Share it everywhere

- Add it to Instagram or LinkedIn bios via a [short jfas.site link](/tools/url-shortener).
- Print it as a [QR code](/tools/qr-code) for stores and events.
- Include it on a [bio link page](/tools/bio-link) you host yourself.

The builder runs locally — Deskzy does not store your number or message.`,
  },
  {
    slug: "utm-campaign-url-builder",
    title: "Build UTM campaign URLs (then shorten them)",
    description:
      "Add utm_source, utm_medium, and utm_campaign to any landing page URL. Free UTM builder with presets — private in your browser.",
    toolSlug: "utm-builder",
    relatedToolSlugs: ["url-shortener", "qr-code", "whatsapp-link"],
    keywords: [
      "utm builder",
      "utm campaign url",
      "utm parameters generator",
      "google ads utm",
    ],
    publishedAt: "2026-07-29",
    faqs: [
      {
        q: "Which UTM fields are required?",
        a: "Source, medium, and campaign are the most useful. Term and content are optional for finer breakdowns.",
      },
      {
        q: "Does the UTM builder send my URLs to a server?",
        a: "No. Building happens in your browser. Nothing is stored on Deskzy.",
      },
      {
        q: "Can I shorten a UTM link?",
        a: "Yes. After generating, use Deskzy's URL shortener. The short link keeps your UTM query string on redirect.",
      },
    ],
    body: `UTM parameters tell analytics which campaign sent the click. Build them consistently so reports stay clean.

## Steps

1. Open the [UTM Builder](/tools/utm-builder).
2. Paste your landing page URL.
3. Use a preset (Google Ads, Instagram, LinkedIn, newsletter) or fill fields manually.
4. Copy the tracked URL — or shorten it with the [URL Shortener](/tools/url-shortener).

## Naming tips

- Keep \`utm_source\` and \`utm_medium\` lowercase and consistent (\`instagram\`, \`social\`).
- Put the readable campaign name in \`utm_campaign\`.
- Use \`utm_content\` for A/B creative variants.

Pair with a [QR code](/tools/qr-code) when the campaign is offline.`,
  },
];

export function getAllGuides(): Guide[] {
  return GUIDES;
}

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getGuidesForTool(toolSlug: string): Guide[] {
  return GUIDES.filter(
    (g) =>
      g.toolSlug === toolSlug || g.relatedToolSlugs.includes(toolSlug),
  );
}
