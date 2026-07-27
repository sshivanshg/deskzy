import type { Metadata } from "next";
import { LockSimple, Lightning, GlobeHemisphereWest } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "About & privacy",
  description: "How Deskzy handles your files and privacy.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Trust
      </p>
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        About & privacy
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
        Deskzy is a global file toolkit designed to feel fast, calm, and honest —
        especially with your private documents.
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
            body: "The URL shortener only sends the URL string to the Go API. When a tool needs a server, we say so clearly.",
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

      <p className="mt-10 text-sm text-[var(--muted)]">
        Brand promise:{" "}
        <span className="font-medium text-[var(--ink)]">
          Drop. Done. Private.
        </span>
      </p>
    </div>
  );
}
