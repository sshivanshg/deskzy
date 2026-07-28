import type { Metadata } from "next";
import Link from "next/link";
import {
  LockSimple,
  Lightning,
  GlobeHemisphereWest,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";
import {
  buildPageMetadata,
  CONTACT_X_HANDLE,
  CONTACT_X_URL,
} from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "About Deskzy — privacy-first file tools",
  description:
    "How Deskzy handles your files. Browser-first processing, no signup wall, and clear labels for hybrid tools like the URL shortener.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Trust
      </p>
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        About &amp; privacy
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
        Deskzy is a global file toolkit designed to feel fast, calm, and honest
        — especially with your private documents.
      </p>

      <div className="mt-10 grid gap-3">
        {[
          {
            icon: LockSimple,
            title: "Browser-first by default",
            body: "Tools marked “Stays in browser” process files locally with Web APIs and WASM. Those files are not uploaded to our servers.",
          },
          {
            icon: Lightning,
            title: "No signup wall",
            body: "Free tools work immediately. No fake download buttons, no email gate, no dark patterns.",
          },
          {
            icon: GlobeHemisphereWest,
            title: "Hybrid tools are labeled",
            body: "The URL shortener only sends the URL string to the API. When a tool needs a server, we say so clearly.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="shell">
            <div className="shell-core flex gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Icon size={22} weight="duotone" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
                  {body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 shell">
        <div className="shell-core flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Contact
            </h2>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[var(--muted)]">
              Feedback, bug reports, or freelance work — DM on X.
            </p>
          </div>
          <a
            href={CONTACT_X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <XLogo size={18} weight="bold" />
            @{CONTACT_X_HANDLE}
          </a>
        </div>
      </div>

      <p className="mt-10 text-sm text-[var(--muted)]">
        Brand promise:{" "}
        <span className="font-medium text-[var(--ink)]">
          Drop. Done. Private.
        </span>
        {" · "}
        <Link
          href="/privacy"
          className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
        >
          Privacy Policy
        </Link>
        {" · "}
        <Link
          href="/terms"
          className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
        >
          Terms
        </Link>
      </p>
    </div>
  );
}
