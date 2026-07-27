"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  FilePdf,
  Image as ImageIcon,
  MagnifyingGlass,
  MusicNotes,
  TextT,
} from "@phosphor-icons/react";
import {
  CATEGORIES,
  getPopularTools,
  searchTools,
  type ToolCategory,
} from "@/lib/tools/registry";

const CAT_ICON: Record<
  ToolCategory,
  typeof FilePdf
> = {
  pdf: FilePdf,
  media: MusicNotes,
  image: ImageIcon,
  text: TextT,
};

export default function HomePage() {
  const [q, setQ] = useState("");
  const popular = getPopularTools();
  const results = useMemo(() => searchTools(q), [q]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 md:pt-16">
      <section className="grid items-end gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
        <div className="reveal">
          <p className="mb-4 inline-flex items-center rounded-full border border-[var(--stroke)] bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Private file toolkit
          </p>
          <h1 className="font-display text-5xl font-semibold tracking-tight text-[var(--ink)] md:text-6xl md:leading-[0.95]">
            Deskzy
          </h1>
          <p className="mt-4 max-w-[28ch] text-lg leading-relaxed text-[var(--muted)] md:text-xl">
            Every file tool. One place.
          </p>
          <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-[var(--muted)]">
            Drop a file, get the result in seconds. Most tools never leave your
            browser.
          </p>
        </div>

        <div className="reveal reveal-delay-1">
          <div className="shell">
            <div className="shell-core p-3 md:p-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                Find a tool
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                  <MagnifyingGlass size={18} weight="bold" />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="compress pdf, json, qr…"
                  className="field !rounded-2xl !py-3.5 !pl-11 !pr-4"
                  autoFocus
                />
              </div>

              {q.trim() ? (
                <div className="mt-3 max-h-72 overflow-auto rounded-2xl border border-[var(--stroke)] bg-white/60">
                  {results.length === 0 ? (
                    <p className="px-4 py-4 text-sm text-[var(--muted)]">
                      No tools matched. Try “pdf”, “image”, or “url”.
                    </p>
                  ) : (
                    results.slice(0, 7).map((t) => (
                      <Link
                        key={t.slug}
                        href={`/tools/${t.slug}`}
                        className="group flex items-center justify-between gap-3 border-b border-[var(--stroke)] px-4 py-3 last:border-b-0 hover:bg-[var(--surface)]"
                      >
                        <span>
                          <span className="block text-sm font-medium text-[var(--ink)]">
                            {t.name}
                          </span>
                          <span className="block text-xs text-[var(--muted)]">
                            {t.description}
                          </span>
                        </span>
                        <span className="shrink-0 text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">
                          <ArrowRight size={16} />
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {["compress pdf", "webp to png", "json", "qr code"].map(
                    (hint) => (
                      <button
                        key={hint}
                        type="button"
                        className="chip"
                        onClick={() => setQ(hint)}
                      >
                        {hint}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 reveal reveal-delay-2 md:mt-24">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Popular right now
          </h2>
          <p className="hidden text-sm text-[var(--muted)] sm:block">
            Fast paths people come back for
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popular.slice(0, 6).map((t, i) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className={`group shell ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="shell-core flex h-full flex-col justify-between p-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {t.category}
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
                    {t.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {t.description}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
                  Open tool
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight size={14} />
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 reveal reveal-delay-3 md:mt-24">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Browse by category
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {CATEGORIES.map((c) => {
            const Icon = CAT_ICON[c.id];
            return (
              <Link key={c.id} href={`/${c.id}`} className="group shell">
                <div className="shell-core flex items-start gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon size={22} weight="duotone" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-lg font-semibold tracking-tight">
                        {c.name}
                      </span>
                      <span className="text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">
                        <ArrowRight size={16} />
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-[var(--muted)]">
                      {c.description}
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
