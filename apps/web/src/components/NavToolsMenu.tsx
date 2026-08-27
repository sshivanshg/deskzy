"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowRight,
  Buildings,
  CaretDown,
  ChartLine,
  FilePdf,
  Image as ImageIcon,
  LinkSimple,
  ShieldCheck,
  SquaresFour,
  TextT,
  VideoCamera,
} from "@phosphor-icons/react";
import {
  CATEGORIES,
  getPopularTools,
  type ToolCategory,
} from "@/lib/tools/registry";

const CATEGORY_ICON: Record<
  ToolCategory,
  typeof FilePdf
> = {
  links: LinkSimple,
  pdf: FilePdf,
  image: ImageIcon,
  media: VideoCamera,
  text: TextT,
};

const TOP_TOOLS = [
  { href: "/tools/merge-pdf", label: "Merge PDF" },
  { href: "/tools/split-pdf", label: "Split PDF" },
  { href: "/tools/compress-pdf", label: "Compress PDF" },
] as const;

type NavToolsMenuProps = {
  pathname: string;
};

export function NavToolsMenu({ pathname }: NavToolsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const popular = getPopularTools().slice(0, 5);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative hidden items-center gap-0.5 md:flex">
      <Link
        href="/tools/url-shortener"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
          pathname === "/tools/url-shortener"
            ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
            : "text-[var(--muted)] hover:text-[var(--ink)]"
        }`}
      >
        <LinkSimple size={16} weight="bold" />
        Share
      </Link>

      {TOP_TOOLS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`hidden rounded-full px-3 py-1.5 text-sm transition-colors xl:inline-flex ${
              active
                ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}

      <button
        type="button"
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors ${
          open
            ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
            : "text-[var(--muted)] hover:text-[var(--ink)]"
        }`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        Tool system
        <span
          className={`inline-flex transition-transform ${open ? "rotate-180" : ""}`}
        >
          <CaretDown size={14} weight="bold" />
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          role="menu"
          className="absolute left-0 top-[calc(100%+0.65rem)] z-50 w-[min(calc(100vw-2rem),40rem)] overflow-hidden rounded-2xl border border-[var(--stroke)] bg-[var(--bg-elevated)] shadow-[var(--shadow)] lg:w-[44rem]"
        >
          <div className="grid gap-0 sm:grid-cols-[1.1fr_1fr_0.85fr]">
            <div className="border-b border-[var(--stroke)] p-4 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Categories
              </p>
              <ul className="mt-3 space-y-0.5">
                {CATEGORIES.map((c) => {
                  const Icon = CATEGORY_ICON[c.id];
                  const href = `/${c.id}`;
                  const active = pathname === href;
                  return (
                    <li key={c.id}>
                      <Link
                        href={href}
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className={`flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors ${
                          active
                            ? "bg-[var(--accent-soft)]"
                            : "hover:bg-[var(--surface)]"
                        }`}
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--accent)]">
                          <Icon size={18} weight="duotone" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-[var(--ink)]">
                            {c.name}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-[var(--muted)]">
                            {c.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-b border-[var(--stroke)] p-4 sm:border-b-0 sm:border-r">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Solutions
              </p>
              <ul className="mt-3 space-y-0.5">
                <li>
                  <Link
                    href="/business"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-[var(--surface)]"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Buildings size={18} weight="duotone" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-[var(--ink)]">
                        Business
                      </span>
                      <span className="mt-0.5 block text-xs text-[var(--muted)]">
                        Teams, SSO, and custom plans
                      </span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/link-analytics"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-[var(--surface)]"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                      <ChartLine size={18} weight="duotone" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-[var(--ink)]">
                        Link analytics
                      </span>
                      <span className="mt-0.5 block text-xs text-[var(--muted)]">
                        See who opens your shared links
                      </span>
                    </span>
                  </Link>
                </li>
              </ul>

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Popular
              </p>
              <ul className="mt-2 space-y-0.5">
                {popular.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--surface)]"
                    >
                      {t.name}
                      <span className="text-[var(--muted)]">
                        <ArrowRight size={14} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                More
              </p>
              <ul className="mt-3 space-y-0.5">
                {[
                  { href: "/pricing", label: "Pricing", icon: SquaresFour },
                  { href: "/privacy", label: "Security & privacy", icon: ShieldCheck },
                  { href: "/about", label: "About", icon: SquaresFour },
                  { href: "/guides", label: "Guides", icon: FilePdf },
                ].map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--surface)]"
                    >
                      <span className="text-[var(--muted)]">
                        <Icon size={16} weight="duotone" />
                      </span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
