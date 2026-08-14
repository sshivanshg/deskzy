"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Buildings,
  ChartLine,
  CurrencyInr,
  FilePdf,
  Image as ImageIcon,
  LinkSimple,
  List,
  MagnifyingGlass,
  ShieldCheck,
  TextT,
  VideoCamera,
  X,
  XLogo,
} from "@phosphor-icons/react";
import { BrandLogo } from "@/components/BrandLogo";
import { AuthNavLinks } from "@/components/AuthNavLinks";
import { NavToolsMenu } from "@/components/NavToolsMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CONTACT_X_HANDLE, CONTACT_X_URL } from "@/lib/seo/site";
import {
  CATEGORIES,
  getPopularTools,
  searchTools,
  type ToolCategory,
} from "@/lib/tools/registry";

const CATEGORY_ICON: Record<ToolCategory, typeof FilePdf> = {
  links: LinkSimple,
  pdf: FilePdf,
  image: ImageIcon,
  media: VideoCamera,
  text: TextT,
};

export function SiteHeader() {
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => (q.trim() ? searchTools(q).slice(0, 8) : []),
    [q],
  );
  const popular = useMemo(() => getPopularTools().slice(0, 4), []);

  const closeOverlays = () => {
    setMenuOpen(false);
    setMobileSearchOpen(false);
    setQ("");
  };

  useEffect(() => {
    closeOverlays();
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen && !mobileSearchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen, mobileSearchOpen]);

  useEffect(() => {
    if (mobileSearchOpen) {
      const t = window.setTimeout(() => mobileSearchRef.current?.focus(), 40);
      return () => window.clearTimeout(t);
    }
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (!menuOpen && !mobileSearchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlays();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, mobileSearchOpen]);

  const openMobileSearch = () => {
    setMenuOpen(false);
    setMobileSearchOpen(true);
  };

  const openMenu = () => {
    setMobileSearchOpen(false);
    setMenuOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 px-3 pt-3 md:px-4 md:pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="shell !rounded-2xl !p-1.5 backdrop-blur-xl md:!rounded-full">
            <div className="shell-core !rounded-[1.1rem] flex items-center gap-1.5 px-2 py-1.5 md:!rounded-full md:gap-2 md:px-3">
              <BrandLogo onClick={closeOverlays} priority />

              <NavToolsMenu pathname={pathname} />

              <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
                <div className="relative hidden w-[13rem] lg:block xl:w-[15rem]">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                    <MagnifyingGlass size={16} weight="bold" />
                  </span>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => setDesktopSearchOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setDesktopSearchOpen(false), 160)
                    }
                    placeholder="Search tools"
                    className="field !rounded-full !py-2 !pl-9 !pr-3 !text-sm"
                    aria-label="Search tools"
                  />
                  {desktopSearchOpen && results.length > 0 && (
                    <div className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]">
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
                  href="/tools/url-shortener"
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors md:hidden ${
                    pathname === "/tools/url-shortener"
                      ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  <LinkSimple size={16} weight="bold" />
                  Share
                </Link>

                <Link
                  href="/pricing"
                  className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors sm:inline-flex ${
                    pathname === "/pricing"
                      ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  Pricing
                </Link>

                <AuthNavLinks />

                <ThemeToggle />

                <button
                  type="button"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors md:rounded-full lg:hidden ${
                    mobileSearchOpen
                      ? "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--stroke)] bg-[var(--panel-muted)] text-[var(--ink)]"
                  }`}
                  onClick={() =>
                    mobileSearchOpen ? closeOverlays() : openMobileSearch()
                  }
                  aria-label={mobileSearchOpen ? "Close search" : "Search tools"}
                  aria-expanded={mobileSearchOpen}
                >
                  {mobileSearchOpen ? (
                    <X size={18} weight="bold" />
                  ) : (
                    <MagnifyingGlass size={18} weight="bold" />
                  )}
                </button>
                <button
                  type="button"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors md:hidden ${
                    menuOpen
                      ? "border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--stroke)] bg-[var(--panel-muted)] text-[var(--ink)]"
                  }`}
                  onClick={() => (menuOpen ? closeOverlays() : openMenu())}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? (
                    <X size={18} weight="bold" />
                  ) : (
                    <List size={18} weight="bold" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-[2px]"
            aria-label="Dismiss search"
            onClick={closeOverlays}
          />
          <div className="relative mx-3 mt-[4.6rem] max-h-[min(70dvh,28rem)] overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--bg-elevated)] shadow-[var(--shadow)] md:mx-4 md:mt-[5rem]">
            <div className="border-b border-[var(--stroke)] p-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                  <MagnifyingGlass size={18} weight="bold" />
                </span>
                <input
                  ref={mobileSearchRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search tools…"
                  className="field !rounded-xl !border-[var(--stroke)] !bg-[var(--panel)] !py-3 !pl-11 !pr-10 !text-base"
                  aria-label="Search tools"
                  autoComplete="off"
                  autoCorrect="off"
                />
                {q ? (
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                    onClick={() => setQ("")}
                    aria-label="Clear search"
                  >
                    <X size={16} weight="bold" />
                  </button>
                ) : null}
              </div>
            </div>
            <div className="max-h-[min(52dvh,20rem)] overflow-y-auto overscroll-contain">
              {!q.trim() ? (
                <p className="px-4 py-5 text-sm text-[var(--muted)]">
                  Try “pdf”, “compress”, “qr”, or “shorten”.
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-5 text-sm text-[var(--muted)]">
                  No tools matched. Try a shorter keyword.
                </p>
              ) : (
                results.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    onClick={closeOverlays}
                    className="flex items-center justify-between gap-3 border-b border-[var(--stroke)] px-4 py-3.5 last:border-b-0 active:bg-[var(--surface)]"
                  >
                    <span className="min-w-0">
                      <span className="block text-[15px] font-medium text-[var(--ink)]">
                        {t.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
                        {t.description}
                      </span>
                    </span>
                    <ArrowRight size={16} color="var(--muted)" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-[2px]"
            aria-label="Dismiss menu"
            onClick={closeOverlays}
          />
          <nav
            className="relative mx-3 mt-[4.6rem] flex max-h-[min(78dvh,40rem)] flex-col overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]"
            aria-label="Mobile"
          >
            <div className="overflow-y-auto overscroll-contain p-2">
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Categories
              </p>
              <ul className="space-y-0.5">
                {CATEGORIES.map((c) => {
                  const Icon = CATEGORY_ICON[c.id];
                  const href = `/${c.id}`;
                  const active = pathname === href;
                  return (
                    <li key={c.id}>
                      <Link
                        href={href}
                        onClick={closeOverlays}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] transition-colors ${
                          active
                            ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                            : "text-[var(--ink)] active:bg-[var(--surface)]"
                        }`}
                      >
                        <Icon size={18} weight="duotone" />
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="my-2 border-t border-[var(--stroke)]" />

              <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Solutions
              </p>
              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/business"
                    onClick={closeOverlays}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-[var(--ink)] active:bg-[var(--surface)]"
                  >
                    <Buildings size={18} weight="duotone" />
                    Business
                  </Link>
                </li>
                <li>
                  <Link
                    href="/link-analytics"
                    onClick={closeOverlays}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-[var(--ink)] active:bg-[var(--surface)]"
                  >
                    <ChartLine size={18} weight="duotone" />
                    Link analytics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    onClick={closeOverlays}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] active:bg-[var(--surface)] ${
                      pathname === "/pricing"
                        ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                        : "text-[var(--ink)]"
                    }`}
                  >
                    <CurrencyInr size={18} weight="duotone" />
                    Pricing
                  </Link>
                </li>
              </ul>

              <div className="my-2 border-t border-[var(--stroke)]" />

              <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Popular
              </p>
              <ul className="space-y-0.5">
                {popular.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      onClick={closeOverlays}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] text-[var(--ink)] active:bg-[var(--surface)]"
                    >
                      {t.name}
                      <span className="opacity-40">
                        <ArrowRight size={14} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="my-2 border-t border-[var(--stroke)]" />

              <ul className="space-y-0.5">
                <AuthNavLinks mobile />
                <li>
                  <Link
                    href="/privacy"
                    onClick={closeOverlays}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-[var(--ink)] active:bg-[var(--surface)]"
                  >
                    <ShieldCheck size={18} weight="duotone" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a
                    href={CONTACT_X_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeOverlays}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] text-[var(--ink)] active:bg-[var(--surface)]"
                  >
                    <XLogo size={18} weight="bold" />
                    Contact on X
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-auto border-t border-[var(--stroke)] bg-[var(--surface)]/60 px-4 py-3">
              <p className="text-xs leading-relaxed text-[var(--muted)]">
                Questions or feedback? DM{" "}
                <a
                  href={CONTACT_X_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--ink)] underline-offset-2 hover:underline"
                  onClick={closeOverlays}
                >
                  @{CONTACT_X_HANDLE}
                </a>
              </p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
