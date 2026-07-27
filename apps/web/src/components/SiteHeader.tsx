"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  List,
  MagnifyingGlass,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";
import { searchTools } from "@/lib/tools/registry";

const NAV = [
  { href: "/pdf", label: "PDF" },
  { href: "/media", label: "Media" },
  { href: "/image", label: "Image" },
  { href: "/text", label: "Text" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const results = useMemo(
    () => (q.trim() ? searchTools(q).slice(0, 8) : []),
    [q],
  );

  return (
    <>
      <div className="sticky top-0 z-40 px-3 pt-3 md:px-4 md:pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="shell !rounded-full !p-1.5 backdrop-blur-xl">
            <div className="shell-core !rounded-full flex items-center gap-2 px-2 py-1.5 md:gap-3 md:px-3">
              <Link
                href="/"
                className="font-display shrink-0 px-2 text-lg font-semibold tracking-tight text-[var(--ink)]"
                onClick={() => setMenuOpen(false)}
              >
                Deskzy
              </Link>

              <nav className="hidden items-center gap-0.5 md:flex">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors duration-200 ${
                        active
                          ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                          : "text-[var(--muted)] hover:text-[var(--ink)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="relative ml-auto hidden w-full max-w-[15rem] lg:block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                  <MagnifyingGlass size={16} weight="bold" />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 160)}
                  placeholder="Search tools"
                  className="field !rounded-full !py-2 !pl-9 !pr-3 !text-sm"
                />
                {searchOpen && results.length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.4rem)] overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]">
                    {results.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/tools/${t.slug}`}
                        className="block px-3.5 py-2.5 text-sm transition-colors hover:bg-[var(--surface)]"
                      >
                        <span className="font-medium text-[var(--ink)]">
                          {t.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--muted)]">
                          {t.category.toUpperCase()}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)] lg:inline-flex"
              >
                <ShieldCheck size={16} weight="duotone" />
                Privacy
              </Link>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--stroke)] bg-white/50 text-[var(--ink)] md:hidden"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-[rgba(26,28,25,0.28)] px-3 pt-[4.8rem] backdrop-blur-sm md:hidden">
          <div className="shell mx-auto max-w-6xl reveal">
            <div className="shell-core space-y-4 p-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                  <MagnifyingGlass size={16} weight="bold" />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search tools"
                  className="field !pl-9"
                  autoFocus
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="chip"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="chip"
                >
                  Privacy
                </Link>
              </div>

              <div className="divide-y divide-[var(--stroke)] overflow-hidden rounded-2xl border border-[var(--stroke)] bg-white/50">
                {(q.trim() ? results : searchTools("").slice(0, 6)).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 transition-colors hover:bg-[var(--surface)]"
                  >
                    <p className="text-sm font-medium text-[var(--ink)]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {t.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
