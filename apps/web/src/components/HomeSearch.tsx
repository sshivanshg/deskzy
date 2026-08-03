"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { searchTools } from "@/lib/tools/registry";

export function HomeSearch({
  id = "home-tool-search",
}: {
  id?: string;
} = {}) {
  const [q, setQ] = useState("");
  const results = useMemo(() => searchTools(q), [q]);

  return (
    <div className="shell !rounded-2xl">
      <div className="shell-core !rounded-[1.15rem] p-3 sm:p-4">
        <label
          htmlFor={id}
          className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] sm:text-xs sm:font-medium"
        >
          Find a tool
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">
            <MagnifyingGlass size={18} weight="bold" />
          </span>
          <input
            id={id}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="shorten url, compress pdf, qr…"
            className="field !rounded-xl !py-3 !pl-11 !pr-4 !text-base sm:!rounded-2xl sm:!py-3.5"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>

        {q.trim() ? (
          <div className="mt-3 max-h-64 overflow-auto overscroll-contain rounded-xl border border-[var(--stroke)] bg-[var(--panel-soft)] sm:max-h-72 sm:rounded-2xl">
            {results.length === 0 ? (
              <p className="px-4 py-4 text-sm text-[var(--muted)]">
                No tools matched. Try “shorten”, “pdf”, or “image”.
              </p>
            ) : (
              results.slice(0, 7).map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="group flex items-center justify-between gap-3 border-b border-[var(--stroke)] px-3.5 py-3.5 last:border-b-0 active:bg-[var(--surface)] sm:px-4 sm:py-3 sm:hover:bg-[var(--surface)]"
                >
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium text-[var(--ink)] sm:text-sm">
                      {t.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
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
          <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {["shorten url", "compress pdf", "webp to png", "qr code"].map(
              (hint) => (
                <button
                  key={hint}
                  type="button"
                  className="chip shrink-0"
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
  );
}
