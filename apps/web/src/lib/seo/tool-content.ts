import type { ToolDefinition } from "@/lib/tools/registry";

export type ToolSeoContent = {
  intro: string;
  steps: [string, string, string];
  privacy: string;
  faqs: { q: string; a: string }[];
};

const OVERRIDES: Partial<Record<string, ToolSeoContent>> = {
  "url-shortener": {
    intro:
      "Shorten long URLs into clean deskzy.xyz links. Free, instant, no account required. Only the URL string is sent to our API — never your files.",
    steps: [
      "Paste the full URL you want to shorten.",
      "Click Shorten to create a deskzy.xyz short link.",
      "Copy or share the link. Use our QR code tool for print-ready codes.",
    ],
    privacy:
      "The URL shortener is a hybrid tool: only the URL text is sent to Deskzy's edge API and stored in Cloudflare KV so redirects work. We do not upload files. Short links use the /r/ path on deskzy.xyz.",
    faqs: [
      {
        q: "Is the URL shortener free?",
        a: "Yes. Deskzy's URL shortener is free with no signup or daily limits for normal use.",
      },
      {
        q: "Do you upload my files when I shorten a link?",
        a: "No. Only the URL string is processed. All PDF, image, and most text tools run entirely in your browser.",
      },
      {
        q: "What domain do short links use?",
        a: "Short links are served on deskzy.xyz (for example deskzy.xyz/r/your-code) and redirect to your original URL.",
      },
      {
        q: "Can I create a QR code for my short link?",
        a: "Yes. After shortening, use Deskzy's free QR code generator to turn the link into a downloadable PNG.",
      },
      {
        q: "Is there an alternative to bit.ly without signup?",
        a: "Deskzy offers a free link shortener with no account wall — paste a URL and copy your short link immediately.",
      },
    ],
  },
  "merge-pdf": {
    intro:
      "Combine multiple PDF files into one document online. Files are merged locally in your browser — nothing is uploaded to a server.",
    steps: [
      "Select two or more PDF files from your device.",
      "Arrange the order if needed, then click Merge.",
      "Download the combined PDF instantly.",
    ],
    privacy:
      "Merge PDF runs 100% in your browser using Web APIs. Your documents never leave your device and are not stored on Deskzy servers.",
    faqs: [
      {
        q: "How do I merge PDF files without uploading?",
        a: "Open Deskzy Merge PDF, select your files, and merge locally. No cloud upload or signup required.",
      },
      {
        q: "Is there a file limit?",
        a: "Limits depend on your device memory. Most everyday merges work smoothly in modern browsers.",
      },
      {
        q: "Can I combine PDF and keep quality?",
        a: "Yes. Merging preserves the original page content; it does not re-compress unless you use Compress PDF afterward.",
      },
    ],
  },
  "compress-pdf": {
    intro:
      "Reduce PDF file size online without uploading to a third-party cloud. Choose quality presets and download a smaller PDF in seconds.",
    steps: [
      "Drop a PDF file into the tool.",
      "Pick a quality preset: balanced, smallest, or high.",
      "Click Compress and download the optimized file.",
    ],
    privacy:
      "Compression happens in your browser. Your PDF is not sent to Deskzy or any external server.",
    faqs: [
      {
        q: "How can I compress a PDF for email?",
        a: "Use the smallest or balanced preset, then download. Most files shrink enough for email attachments.",
      },
      {
        q: "Is this safer than cloud PDF compressors?",
        a: "Yes for sensitive docs — browser processing means your file stays on your device.",
      },
      {
        q: "Does compressing reduce text quality?",
        a: "Text stays sharp. Images inside the PDF may be recompressed based on the preset you choose.",
      },
    ],
  },
  "json-formatter": {
    intro:
      "Pretty-print, minify, and validate JSON instantly. Paste messy API responses or config files and get readable output in one click.",
    steps: [
      "Paste raw JSON into the editor.",
      "Click Format to pretty-print or validate.",
      "Copy the cleaned JSON for your project.",
    ],
    privacy:
      "JSON is processed entirely in your browser. Nothing is logged or sent to a server.",
    faqs: [
      {
        q: "Can this replace jsonlint?",
        a: "Yes. Deskzy formats and validates JSON locally with no signup, similar to jsonlint but private.",
      },
      {
        q: "Does my JSON get stored?",
        a: "No. Input is cleared when you leave the page.",
      },
      {
        q: "Can I minify JSON too?",
        a: "Yes. Format removes whitespace; invalid JSON shows a clear error message.",
      },
    ],
  },
  "qr-code": {
    intro:
      "Generate QR codes from any URL or text. Download as PNG for menus, business cards, or marketing — free and private.",
    steps: [
      "Enter a URL or text string.",
      "Click Generate to preview the QR code.",
      "Download the PNG or pair with the URL shortener first.",
    ],
    privacy:
      "QR generation runs in your browser. Your content is not uploaded.",
    faqs: [
      {
        q: "Can I make a QR code for a shortened link?",
        a: "Yes. Shorten your URL first, then paste the deskzy.xyz link into the QR generator.",
      },
      {
        q: "What format is the download?",
        a: "PNG image, suitable for print and digital use.",
      },
      {
        q: "Is the QR code generator free?",
        a: "Completely free with no watermark or signup.",
      },
    ],
  },
  "utm-builder": {
    intro:
      "Build tracked campaign URLs with UTM parameters. Add source, medium, campaign, term, and content — or start from presets for Google Ads, Instagram, LinkedIn, and newsletters.",
    steps: [
      "Paste your landing page URL and pick a preset or fill UTM fields.",
      "Watch the live preview update as you type.",
      "Generate the link, then copy, shorten, or make a QR code.",
    ],
    privacy:
      "UTM building runs entirely in your browser. Nothing is sent to Deskzy servers.",
    faqs: [
      {
        q: "What is a UTM parameter?",
        a: "UTM tags (utm_source, utm_medium, utm_campaign, etc.) help analytics tools attribute traffic to specific campaigns.",
      },
      {
        q: "Do I need all five UTM fields?",
        a: "Source, medium, and campaign are the most useful. Term and content are optional for finer breakdowns.",
      },
      {
        q: "Can I shorten a UTM link?",
        a: "Yes. Use Shorten with Deskzy from the builder to create a deskzy.xyz short link that keeps your UTM query string.",
      },
    ],
  },
  "whatsapp-link": {
    intro:
      "Create a WhatsApp click-to-chat link (wa.me) with country code and an optional prefilled message — perfect for support, sales, and social bios.",
    steps: [
      "Choose a country code and enter the phone number.",
      "Optionally add a prefilled message.",
      "Generate the wa.me link, copy it, or make a QR code.",
    ],
    privacy:
      "WhatsApp link generation is local. Deskzy never stores your number or message.",
    faqs: [
      {
        q: "What is a wa.me link?",
        a: "It opens WhatsApp (app or web) to a chat with the specified number, optionally with a draft message.",
      },
      {
        q: "Do I include the + in the phone number?",
        a: "No. Pick the country dial code separately and enter the national number without leading zeros if your country uses them.",
      },
      {
        q: "Can I put this in a QR code?",
        a: "Yes. Use Make QR after generating the link so phones can open the chat by scanning.",
      },
    ],
  },
  "bio-link": {
    intro:
      "Build a simple link-in-bio page in your browser. Add a title, up to eight links, pick a theme, preview on a phone frame, then download standalone HTML or copy Markdown — Deskzy does not host the page.",
    steps: [
      "Enter your title and add labeled links (reorder as needed).",
      "Choose a theme and preview the phone layout.",
      "Download HTML to host anywhere, or copy Markdown for docs.",
    ],
    privacy:
      "Everything stays in your browser. Downloaded HTML is yours to host; Deskzy does not create public bio URLs in this tool.",
    faqs: [
      {
        q: "Is this a Linktree alternative?",
        a: "It is a private builder that exports HTML — a lightweight Linktree-style page without an account or Deskzy hosting.",
      },
      {
        q: "Where do I publish the page?",
        a: "Upload the downloaded HTML to any static host (GitHub Pages, Cloudflare Pages, Netlify, your own site).",
      },
      {
        q: "How many links can I add?",
        a: "Up to eight links in this version, with up/down reorder controls.",
      },
    ],
  },
};

function browserFileContent(tool: ToolDefinition): ToolSeoContent {
  const verb = tool.slug.includes("compress")
    ? "Compress"
    : tool.slug.includes("merge")
      ? "Merge"
      : tool.slug.includes("split")
        ? "Split"
        : tool.slug.includes("convert") || tool.slug.includes("webp")
          ? "Convert"
          : tool.slug.includes("resize")
            ? "Resize"
            : tool.slug.includes("reorder")
              ? "Reorder"
              : tool.slug.includes("pdf-to")
                ? "Convert"
                : "Process";

  return {
    intro: `${tool.description} Use Deskzy's free ${tool.name.toLowerCase()} tool online — private, no signup, files stay in your browser.`,
    steps: [
      `Select ${tool.input === "files" ? "your files" : "a file"} from your device.`,
      `Configure options if needed, then click ${verb}.`,
      "Download the result instantly.",
    ],
    privacy:
      "This tool runs entirely in your browser. Files are not uploaded to Deskzy servers.",
    faqs: [
      {
        q: `Is ${tool.name.toLowerCase()} free?`,
        a: `Yes. Deskzy's ${tool.name.toLowerCase()} is free with no account required.`,
      },
      {
        q: "Are my files uploaded to a server?",
        a: "No. Processing happens locally in your browser for maximum privacy.",
      },
      {
        q: `What is a good alternative search term for this tool?`,
        a: `People also search for: ${tool.aliases.slice(0, 3).join(", ")}.`,
      },
    ],
  };
}

function textToolContent(tool: ToolDefinition): ToolSeoContent {
  const isGenerator =
    tool.slug.includes("generator") || tool.slug === "qr-code";

  return {
    intro: `${tool.description} Free, instant, and private — runs in your browser with no signup.`,
    steps: isGenerator
      ? [
          "Set options if available (length, count, etc.).",
          "Click Generate to create output.",
          "Copy or download the result.",
        ]
      : [
          "Paste or type your input in the field.",
          "Choose mode or options if needed.",
          "Click Run and copy the output.",
        ],
    privacy:
      tool.runtime === "hybrid"
        ? "Only URL strings are sent to the API for hybrid tools. All other text tools run locally."
        : "Text is processed in your browser and is never sent to a server.",
    faqs: [
      {
        q: `Is this ${tool.name.toLowerCase()} free?`,
        a: "Yes. No signup, no paywall.",
      },
      {
        q: "Is my input stored?",
        a: "No. Deskzy does not persist your text on our servers.",
      },
      {
        q: "What related searches does this tool cover?",
        a: `Common searches: ${tool.aliases.slice(0, 4).join(", ")}.`,
      },
    ],
  };
}

export function getToolSeoContent(tool: ToolDefinition): ToolSeoContent {
  if (OVERRIDES[tool.slug]) return OVERRIDES[tool.slug]!;
  if (tool.input === "file" || tool.input === "files") {
    return browserFileContent(tool);
  }
  if (tool.input === "form" || tool.category === "links") {
    return textToolContent(tool);
  }
  return textToolContent(tool);
}
