import type { ToolCategory } from "@/lib/tools/registry";

type CategorySeo = {
  seoTitle: string;
  seoDescription: string;
  intro: string;
  faqs: { q: string; a: string }[];
};

export const CATEGORY_SEO: Record<ToolCategory, CategorySeo> = {
  pdf: {
    seoTitle: "Free PDF tools online — merge, split, compress",
    seoDescription:
      "Private PDF tools in your browser. Merge, split, compress, reorder, and convert PDFs with no upload and no signup.",
    intro:
      "Deskzy PDF tools run in your browser so contracts, invoices, and personal documents never touch a cloud server. Merge multiple PDFs, split pages, compress for email, reorder pages, or export pages as images — all free.",
    faqs: [
      {
        q: "Are Deskzy PDF tools really private?",
        a: "Yes. PDF processing uses browser APIs. Files stay on your device.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. All PDF tools work immediately without signup.",
      },
    ],
  },
  image: {
    seoTitle: "Free image tools online — compress, resize, convert",
    seoDescription:
      "Compress, resize, and convert images privately in your browser. JPG, PNG, WebP support. No signup.",
    intro:
      "Optimize images without uploading to unknown servers. Compress photos for web, resize to exact dimensions, convert between PNG/JPG/WebP, or turn WebP into PNG for apps that need it.",
    faqs: [
      {
        q: "Which image formats are supported?",
        a: "JPEG, PNG, WebP, and GIF for resize. Compress and convert support JPG, PNG, and WebP.",
      },
      {
        q: "Will compressing reduce quality?",
        a: "You choose the quality preset. Higher quality keeps more detail; smallest files prioritize size.",
      },
    ],
  },
  media: {
    seoTitle: "Free media tools — video to MP3 converter",
    seoDescription:
      "Convert video to MP3 in your browser. Private media utilities with no signup on Deskzy.",
    intro:
      "Extract audio from video files without sending them to a remote converter farm. Deskzy media tools prioritize privacy and speed.",
    faqs: [
      {
        q: "Does video to MP3 upload my file?",
        a: "Processing is designed to run in-browser. Your video stays local during conversion.",
      },
      {
        q: "What video formats work?",
        a: "Common video and audio formats supported by your browser can be used as input.",
      },
    ],
  },
  text: {
    seoTitle: "Free text & developer tools — JSON, Base64, UUID",
    seoDescription:
      "JSON formatter, Base64, hash generator, UUID, password tools, and more. Free online dev utilities.",
    intro:
      "Format JSON, encode Base64, generate UUIDs and passwords, convert case, and more. Browser-first utilities with no signup. Looking for short links, QR, UTM, or WhatsApp? See Deskzy Links tools.",
    faqs: [
      {
        q: "Where did the URL shortener go?",
        a: "URL shortener, QR codes, UTM builder, WhatsApp links, and bio pages live under Deskzy Links tools.",
      },
      {
        q: "Are developer tools safe for production secrets?",
        a: "Browser tools don't upload input, but avoid pasting live secrets on any website if policy forbids it.",
      },
    ],
  },
  links: {
    seoTitle: "Free link tools — shortener, QR, UTM, WhatsApp, bio",
    seoDescription:
      "Shorten URLs, generate QR codes, build UTM campaign links, WhatsApp click-to-chat, and bio link pages. Free link tools on Deskzy.",
    intro:
      "Deskzy Links covers the full share stack: free URL shortener on deskzy.xyz, private QR codes, UTM campaign builders, WhatsApp wa.me links, and downloadable bio link HTML — mostly in your browser, no account required.",
    faqs: [
      {
        q: "Is the URL shortener free?",
        a: "Yes. Create deskzy.xyz short links with no signup. Only the URL string is sent to our edge API.",
      },
      {
        q: "Do UTM, WhatsApp, and bio tools upload my data?",
        a: "No. Those builders run entirely in your browser. Bio pages are downloaded as HTML — Deskzy does not host them.",
      },
      {
        q: "Can I make a QR code for my short or WhatsApp link?",
        a: "Yes. Use Make QR from the tool result, or open the QR generator and paste any URL.",
      },
    ],
  },
};
