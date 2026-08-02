import type { ToolDefinition } from "@/lib/tools/registry";

export type ToolSeoContent = {
  intro: string;
  steps: [string, string, string];
  privacy: string;
  faqs: { q: string; a: string }[];
};

const OVERRIDES: Record<string, ToolSeoContent> = {
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
        a: "Short links are served on deskzy.xyz (for example deskzy.xyz/r/your-code). Visitors land on a Deskzy hop page that shows the destination, then open the original URL from there.",
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
      {
        q: "Is merge PDF free?",
        a: "Yes. Free with no account and no watermark.",
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
      {
        q: "Is compress PDF free?",
        a: "Yes. No signup and no paywall for normal use.",
      },
    ],
  },
  "split-pdf": {
    intro:
      "Split a PDF into separate files or extract the pages you need. Everything runs in your browser — free, private, no signup.",
    steps: [
      "Upload a PDF from your device.",
      "Choose how to split or which pages to extract.",
      "Download the resulting PDF file(s).",
    ],
    privacy:
      "Split PDF processes files locally in your browser. Documents are not uploaded to Deskzy servers.",
    faqs: [
      {
        q: "Can I extract specific pages from a PDF?",
        a: "Yes. Use Split PDF to pull out the pages you need without uploading to a cloud converter.",
      },
      {
        q: "Is splitting free?",
        a: "Yes. Free online split PDF with no account required.",
      },
      {
        q: "Will splitting change page quality?",
        a: "No. Pages are extracted as-is; content is not re-compressed.",
      },
      {
        q: "What if I need to recombine pages later?",
        a: "Use Merge PDF to join files again, or Reorder PDF to rearrange pages in one file.",
      },
    ],
  },
  "pdf-to-images": {
    intro:
      "Convert PDF pages to PNG images in your browser. Useful for slides, thumbnails, and sharing a single page without the full document.",
    steps: [
      "Select a PDF file from your device.",
      "Run the conversion to render pages as images.",
      "Download the PNG output for the pages you need.",
    ],
    privacy:
      "PDF to Images runs entirely in your browser. Your PDF is never uploaded.",
    faqs: [
      {
        q: "Can I convert PDF to PNG without uploading?",
        a: "Yes. Deskzy renders pages locally so the file stays on your device.",
      },
      {
        q: "Does it support PDF to JPG?",
        a: "Output is PNG today. You can convert PNGs further with Convert Image if you need JPG or WebP.",
      },
      {
        q: "Is PDF to images free?",
        a: "Yes. Free with no signup.",
      },
      {
        q: "Will image quality be high enough for print?",
        a: "Quality depends on the source PDF and your device. For email or web previews it is usually excellent.",
      },
    ],
  },
  "reorder-pdf": {
    intro:
      "Rearrange PDF pages online without uploading. Fix scan order, move cover pages, or reorganize a packet privately in your browser.",
    steps: [
      "Open a PDF from your device.",
      "Reorder pages into the sequence you want.",
      "Download the reorganized PDF.",
    ],
    privacy:
      "Reorder PDF runs in your browser. Page data never leaves your device.",
    faqs: [
      {
        q: "Can I rearrange PDF pages for free?",
        a: "Yes. Deskzy Reorder PDF is free and needs no account.",
      },
      {
        q: "Is my document uploaded?",
        a: "No. Reordering is local browser processing.",
      },
      {
        q: "Can I delete pages here?",
        a: "This tool focuses on order. Use Split PDF to extract only the pages you want to keep.",
      },
      {
        q: "What searches does this cover?",
        a: "People also look for organize PDF, rearrange PDF pages, and change PDF page order.",
      },
    ],
  },
  "compress-image": {
    intro:
      "Shrink JPG, PNG, and WebP photos with use-case presets or a target file size. Private image compression — nothing is uploaded.",
    steps: [
      "Drop an image into the tool.",
      "Pick a preset (Email, WhatsApp, Web, Avatar) or set a size target.",
      "Download the smaller image.",
    ],
    privacy:
      "Compress Image runs entirely in your browser. Photos are not sent to Deskzy servers.",
    faqs: [
      {
        q: "How do I compress an image for WhatsApp?",
        a: "Use the WhatsApp or Email-style preset, download, then send. Most chats prefer files under a couple of megabytes.",
      },
      {
        q: "Will compression ruin photo quality?",
        a: "You control the tradeoff. Higher quality keeps more detail; smaller targets prioritize file size.",
      },
      {
        q: "Is image compression free?",
        a: "Yes. Free online compress image with no signup.",
      },
      {
        q: "Which formats are supported?",
        a: "JPEG, PNG, and WebP.",
      },
    ],
  },
  "resize-image": {
    intro:
      "Resize images to exact pixel dimensions in your browser. Free, private, and fast — ideal for avatars, banners, and thumbnails.",
    steps: [
      "Select a JPG, PNG, WebP, or GIF image.",
      "Enter the width and height you need.",
      "Download the resized image.",
    ],
    privacy:
      "Resize Image processes files locally. Images are never uploaded.",
    faqs: [
      {
        q: "Can I resize without cropping?",
        a: "Set the dimensions you need; the tool scales to those sizes. Use Compress Image afterward if the file is still large.",
      },
      {
        q: "Is resize image free?",
        a: "Yes. No account required.",
      },
      {
        q: "Does GIF resize work?",
        a: "GIF is accepted for resize. Complex animated GIFs may be limited by browser capabilities.",
      },
      {
        q: "Are my images uploaded?",
        a: "No. Everything stays on your device.",
      },
    ],
  },
  "convert-image": {
    intro:
      "Convert between PNG, JPG, and WebP online without uploading. Free image format converter that runs in your browser.",
    steps: [
      "Choose an image file from your device.",
      "Pick the output format you need.",
      "Download the converted file.",
    ],
    privacy:
      "Convert Image runs locally in your browser. Files are not uploaded to Deskzy.",
    faqs: [
      {
        q: "Can I convert PNG to JPG online free?",
        a: "Yes. Use Convert Image, choose JPG, and download — no signup.",
      },
      {
        q: "What about WebP?",
        a: "WebP is supported. For a dedicated WebP → PNG flow, use the WebP to PNG tool.",
      },
      {
        q: "Is conversion private?",
        a: "Yes. Processing stays in your browser.",
      },
      {
        q: "Will colors change between formats?",
        a: "JPG is lossy and does not support transparency. Prefer PNG or WebP when you need an alpha channel.",
      },
    ],
  },
  "webp-to-png": {
    intro:
      "Convert WebP images to PNG privately in your browser. Free WebP to PNG converter with no signup — useful when apps or editors reject WebP.",
    steps: [
      "Select a WebP image from your device.",
      "Click convert to create a PNG.",
      "Download the PNG file.",
    ],
    privacy:
      "WebP to PNG runs entirely in your browser. Your image is not uploaded.",
    faqs: [
      {
        q: "Why convert WebP to PNG?",
        a: "Some design tools, email clients, and older apps still prefer PNG. Conversion unlocks those workflows.",
      },
      {
        q: "Is WebP to PNG free?",
        a: "Yes. Free online converter with no account.",
      },
      {
        q: "Does it keep transparency?",
        a: "PNG supports transparency; WebP alpha is preserved when the browser can decode it.",
      },
      {
        q: "Can I convert other formats too?",
        a: "Yes. Use Convert Image for PNG, JPG, and WebP combinations.",
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
      {
        q: "Is the JSON formatter free?",
        a: "Completely free for everyday use.",
      },
    ],
  },
  "base64": {
    intro:
      "Encode or decode Base64 text instantly in your browser. Free Base64 encoder/decoder for tokens, data URLs, and debugging — no signup.",
    steps: [
      "Paste the text or Base64 string.",
      "Choose encode or decode.",
      "Copy the result.",
    ],
    privacy:
      "Base64 conversion runs locally. Your input is never sent to Deskzy servers.",
    faqs: [
      {
        q: "Is Base64 encoding private?",
        a: "Yes. Everything stays in your browser.",
      },
      {
        q: "Can I decode a data URL?",
        a: "Paste the Base64 portion (or full string depending on your needs) and decode. Strip the data: prefix if required.",
      },
      {
        q: "Is this free?",
        a: "Yes. Free online Base64 encode/decode with no account.",
      },
      {
        q: "Should I paste secrets here?",
        a: "The tool does not upload input, but follow your org's policy for production secrets on any website.",
      },
    ],
  },
  "hash-generator": {
    intro:
      "Generate SHA-256 or SHA-1 hashes in your browser. Free checksum / hash generator for quick integrity checks — private and instant.",
    steps: [
      "Paste the text you want to hash.",
      "Choose the algorithm if options are available.",
      "Copy the hash output.",
    ],
    privacy:
      "Hashing runs in your browser. Input text is not uploaded.",
    faqs: [
      {
        q: "Is SHA-256 available?",
        a: "Yes. Deskzy focuses on modern browser crypto hashes such as SHA-256.",
      },
      {
        q: "Can I hash files?",
        a: "This tool hashes text input. Paste file contents or use a dedicated file hasher if you need binary hashing.",
      },
      {
        q: "Is the hash generator free?",
        a: "Yes. Free with no signup.",
      },
      {
        q: "Is my text stored?",
        a: "No. Nothing is persisted on Deskzy servers.",
      },
    ],
  },
  "uuid-generator": {
    intro:
      "Generate UUID v4 identifiers instantly. Free online GUID/UUID generator for databases, APIs, and testing — runs in your browser.",
    steps: [
      "Open the UUID generator.",
      "Click Generate to create a new UUID v4.",
      "Copy the value into your project.",
    ],
    privacy:
      "UUIDs are generated locally with browser crypto. Nothing is sent to a server.",
    faqs: [
      {
        q: "Are these UUID v4?",
        a: "Yes. Deskzy generates random UUID v4 values suitable for most app IDs.",
      },
      {
        q: "Is UUID generation free?",
        a: "Yes. No signup required.",
      },
      {
        q: "Can I generate multiple UUIDs?",
        a: "Click Generate again for a new value whenever you need another ID.",
      },
      {
        q: "Is this the same as a GUID?",
        a: "GUID and UUID are often used interchangeably; UUID v4 covers typical GUID needs.",
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
      {
        q: "Does generation upload my URL?",
        a: "No. Everything stays in your browser.",
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
      {
        q: "Is the UTM builder free?",
        a: "Yes. Free online UTM generator with no signup.",
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
      {
        q: "Is the WhatsApp link generator free?",
        a: "Yes. Free wa.me builder with no account.",
      },
    ],
  },
  "bio-link": {
    intro:
      "Build a link-in-bio page in your browser. Add a profile, unlimited rich blocks, customize the theme, preview live, then download standalone HTML, Markdown, or JSON — Deskzy does not host the page.",
    steps: [
      "Add your profile (photo, name, bio) and unlimited link, social, embed, section, or image blocks.",
      "Customize colors, background, button style, and fonts — preview updates as you type.",
      "Download self-contained HTML to host anywhere, or copy Markdown / JSON. Drafts save in your browser only.",
    ],
    privacy:
      "Everything stays in your browser. Avatars and images are embedded as base64 in your export; Deskzy does not create public bio URLs or upload your content.",
    faqs: [
      {
        q: "Is this a Linktree alternative?",
        a: "It is a private builder that exports HTML — a Linktree-style page without an account or Deskzy hosting.",
      },
      {
        q: "Where do I publish the page?",
        a: "Upload the downloaded HTML to any static host (GitHub Pages, Cloudflare Pages, Netlify, your own site).",
      },
      {
        q: "How many links can I add?",
        a: "Unlimited. Add link buttons, social icon rows, embeds, section headers, and images — drag to reorder.",
      },
      {
        q: "Is bio link creator free?",
        a: "Yes. Free export with no signup. Nothing is uploaded to Deskzy.",
      },
    ],
  },
  "url-encode": {
    intro:
      "URL-encode or decode strings in your browser. Free percent-encoding tool for query params, redirects, and debugging — private and instant.",
    steps: [
      "Paste the string to encode or decode.",
      "Run encode or decode.",
      "Copy the result into your URL or code.",
    ],
    privacy:
      "Encoding runs locally. Text is never sent to Deskzy servers.",
    faqs: [
      {
        q: "What is URL encoding?",
        a: "Percent-encoding replaces unsafe characters (spaces, symbols) so they can travel safely inside URLs.",
      },
      {
        q: "Is URL encode/decode free?",
        a: "Yes. Free with no signup.",
      },
      {
        q: "Should I encode a full URL or just a parameter?",
        a: "Usually encode individual query values, not the entire URL including https://.",
      },
      {
        q: "Is my text stored?",
        a: "No. Processing stays in your browser.",
      },
    ],
  },
  "word-counter": {
    intro:
      "Count words, characters, and sentences instantly. Free online word counter for essays, captions, and SEO drafts — runs in your browser.",
    steps: [
      "Paste or type your text.",
      "Read the live word and character counts.",
      "Edit until you hit your limit.",
    ],
    privacy:
      "Word counting is local. Your draft is not uploaded.",
    faqs: [
      {
        q: "Does it count characters with spaces?",
        a: "Yes — character counts typically include spaces. Use the on-screen breakdown for clarity.",
      },
      {
        q: "Is the word counter free?",
        a: "Yes. Free online counter with no account.",
      },
      {
        q: "Is my writing stored?",
        a: "No. Text stays in your browser session.",
      },
      {
        q: "Can I convert case after counting?",
        a: "Yes. Open Case Converter for upper, lower, and title case.",
      },
    ],
  },
  "case-converter": {
    intro:
      "Convert text between uppercase, lowercase, title case, and more. Free case converter online — private, instant, no signup.",
    steps: [
      "Paste your text into the tool.",
      "Choose the case style you need.",
      "Copy the converted output.",
    ],
    privacy:
      "Case conversion runs in your browser. Text is never uploaded.",
    faqs: [
      {
        q: "Can I convert to title case online?",
        a: "Yes. Paste text and switch to title case in one click.",
      },
      {
        q: "Is case converter free?",
        a: "Yes. Free with no signup.",
      },
      {
        q: "Does it change punctuation?",
        a: "It focuses on letter case. Punctuation generally stays as typed.",
      },
      {
        q: "Is my text stored?",
        a: "No. Everything stays local.",
      },
    ],
  },
  "markdown-to-html": {
    intro:
      "Convert Markdown to HTML in your browser. Free MD to HTML converter for docs, READMEs, and CMS drafts — private and fast.",
    steps: [
      "Paste Markdown into the editor.",
      "Convert to HTML.",
      "Copy the HTML output into your site or CMS.",
    ],
    privacy:
      "Markdown conversion runs locally. Your content is not sent to Deskzy.",
    faqs: [
      {
        q: "Which Markdown features are supported?",
        a: "Common Markdown via the marked library — headings, lists, links, code, and more.",
      },
      {
        q: "Is Markdown to HTML free?",
        a: "Yes. Free online converter with no account.",
      },
      {
        q: "Is my draft uploaded?",
        a: "No. Conversion stays in your browser.",
      },
      {
        q: "Can I count words in the Markdown first?",
        a: "Yes. Use Word Counter, then convert.",
      },
    ],
  },
  "password-generator": {
    intro:
      "Generate strong random passwords in your browser. Free password generator — private crypto randomness, no signup, nothing stored.",
    steps: [
      "Set length and options if available.",
      "Click Generate to create a password.",
      "Copy it into your password manager.",
    ],
    privacy:
      "Passwords are generated locally with browser crypto. Deskzy never sees or stores them.",
    faqs: [
      {
        q: "Are passwords truly random?",
        a: "Generation uses the browser's cryptographic random source when available.",
      },
      {
        q: "Is the password generator free?",
        a: "Yes. Free online generator with no account.",
      },
      {
        q: "Do you store generated passwords?",
        a: "No. They never leave your browser.",
      },
      {
        q: "Should I reuse passwords?",
        a: "No. Generate a unique password per account and store it in a password manager.",
      },
    ],
  },
  "video-to-mp3": {
    intro:
      "Convert video to MP3 / extract audio in your browser. Deskzy runs conversion with ffmpeg.wasm on your device — private, free, no signup wall.",
    steps: [
      "Select a video or audio file from your device.",
      "Confirm Video → Audio and MP3 (or switch format if you prefer WAV, M4A, or OGG).",
      "Convert, then download the extracted audio when processing completes.",
    ],
    privacy:
      "Conversion runs in your browser with ffmpeg.wasm. Your media stays on your device — nothing is uploaded to a remote converter farm.",
    faqs: [
      {
        q: "Does video to MP3 upload my file?",
        a: "No. Deskzy converts in-browser. Your media stays local during processing.",
      },
      {
        q: "What formats work?",
        a: "Common video containers (MP4, WebM, MOV, and more) work as input. Output audio can be MP3, WAV, M4A, or OGG. Need video-to-video or audio-to-audio? Use Media Converter.",
      },
      {
        q: "Is video to MP3 free?",
        a: "Yes. Free to use — no account required.",
      },
      {
        q: "Why is the first run slow?",
        a: "The browser loads the ffmpeg engine (~30 MB) once, then conversions are faster. Keep the tab open for repeat jobs.",
      },
    ],
  },
  "video-to-wav": {
    intro:
      "Extract lossless WAV audio from video in your browser. Private ffmpeg.wasm conversion — free, no signup, files stay on your device.",
    steps: [
      "Select a video file from your device.",
      "Keep Video → Audio and WAV selected (or switch to another audio format).",
      "Convert and download the WAV when processing finishes.",
    ],
    privacy:
      "Audio extraction runs locally with ffmpeg.wasm. Deskzy does not upload your clips to a remote farm.",
    faqs: [
      {
        q: "Is WAV better than MP3?",
        a: "WAV is uncompressed — larger files, no lossy compression. Use MP3 when you want a smaller shareable file.",
      },
      {
        q: "Can I convert to other audio formats?",
        a: "Yes. Switch the format chips to MP3, M4A, or OGG, or open Media Converter for video-to-video as well.",
      },
      {
        q: "Does this upload my video?",
        a: "No. Processing stays in your browser.",
      },
    ],
  },
  "audio-converter": {
    intro:
      "Convert audio between MP3, WAV, M4A, and OGG in your browser. Private, free, no signup — powered by ffmpeg.wasm on your device.",
    steps: [
      "Select an audio file (or a video if you need to extract audio).",
      "Choose Audio → Audio and your target format.",
      "Convert and download the result.",
    ],
    privacy:
      "Format conversion runs in-browser. Your audio never leaves your device during processing.",
    faqs: [
      {
        q: "Which formats can I convert between?",
        a: "MP3, WAV, M4A, and OGG. You can also switch to Video → Audio or Video → Video from the same workspace.",
      },
      {
        q: "Is there a file size limit?",
        a: "Yes — about 200 MB per file so the browser stays responsive. Shorter clips convert faster.",
      },
      {
        q: "Do I need an account?",
        a: "No. Audio Converter works without signup.",
      },
    ],
  },
  "media-converter": {
    intro:
      "One flexible media workspace: convert video to audio, video to video, or audio to audio — MP3, WAV, M4A, OGG, MP4, and WebM — privately in your browser.",
    steps: [
      "Drop a video or audio file.",
      "Pick Convert type (Video → Audio, Video → Video, or Audio → Audio) and the output format.",
      "Convert and download when ffmpeg finishes.",
    ],
    privacy:
      "All conversion runs locally with ffmpeg.wasm. Deskzy does not upload your media to a remote server for this tool.",
    faqs: [
      {
        q: "How is this different from Video to MP3?",
        a: "Video to MP3 is a focused SEO page that defaults to MP3 extraction. Media Converter exposes every convert type and format in one place.",
      },
      {
        q: "What can I convert?",
        a: "Video → Audio (MP3, WAV, M4A, OGG), Video → Video (MP4, WebM), and Audio → Audio across the same audio formats.",
      },
      {
        q: "Why does loading take a moment?",
        a: "The first conversion downloads the ffmpeg engine once (~30 MB). After that, jobs reuse the loaded engine in the same tab.",
      },
      {
        q: "Is Media Converter free?",
        a: "Yes. Free to use with no account required.",
      },
    ],
  },
};

function browserFileContent(tool: ToolDefinition): ToolSeoContent {
  return {
    intro: `${tool.description} Use Deskzy's free ${tool.name.toLowerCase()} tool online — private, no signup, files stay in your browser.`,
    steps: [
      `Select ${tool.input === "files" ? "your files" : "a file"} from your device.`,
      "Configure options if needed, then run the tool.",
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
        q: "What related searches does this tool cover?",
        a: `People also search for: ${tool.aliases.slice(0, 3).join(", ") || tool.name}.`,
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
        a: `Common searches: ${tool.aliases.slice(0, 4).join(", ") || tool.name}.`,
      },
    ],
  };
}

export function getToolSeoContent(tool: ToolDefinition): ToolSeoContent {
  if (OVERRIDES[tool.slug]) return OVERRIDES[tool.slug]!;
  if (tool.input === "file" || tool.input === "files") {
    return browserFileContent(tool);
  }
  return textToolContent(tool);
}
