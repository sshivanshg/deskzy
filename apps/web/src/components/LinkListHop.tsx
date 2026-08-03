"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowSquareOut,
  Check,
  CopySimple,
  LinkSimple,
  ListBullets,
  ShieldCheck,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { BrandLogo } from "@/components/BrandLogo";

type LinkListHopProps = {
  urls: string[];
  code: string;
};

function splitDest(dest: string): { host: string; rest: string } {
  try {
    const u = new URL(dest);
    const rest = `${u.pathname === "/" ? "" : u.pathname}${u.search}${u.hash}`;
    return { host: u.host, rest: rest || "/" };
  } catch {
    return { host: dest, rest: "" };
  }
}

function trackHopClick(code: string) {
  const url = `/api/links/${encodeURIComponent(code)}/click`;
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(url);
      return;
    }
  } catch {
    /* fall through */
  }
  void fetch(url, { method: "POST", keepalive: true }).catch(() => {});
}

function ListRow({
  dest,
  index,
  itemVariants,
}: {
  dest: string;
  index: number;
  itemVariants: {
    initial: { opacity: number; y?: number };
    animate: {
      opacity: number;
      y?: number;
      transition?: { type: "spring"; stiffness: number; damping: number };
    };
  };
}) {
  const { host, rest } = splitDest(dest);
  const [copied, setCopied] = useState(false);

  const copyDest = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(dest);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [dest]);

  return (
    <motion.li variants={itemVariants} className="list-none">
      <div className="rounded-[1.2rem] border border-[var(--stroke)] bg-[color-mix(in_srgb,var(--bg-elevated)_90%,white)] px-4 py-4 shadow-[var(--shadow)] sm:px-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-ink)]">
            {index + 1}
          </span>
          <a
            href={dest}
            rel="noopener noreferrer"
            className="min-w-0 flex-1 group"
          >
            <p className="font-display text-lg font-semibold tracking-tight text-[var(--ink)] group-hover:text-[var(--accent-ink)] sm:text-xl">
              {host}
            </p>
            {rest ? (
              <p className="mt-1 break-all font-mono text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
                {rest.length > 80 ? `${rest.slice(0, 80)}…` : rest}
              </p>
            ) : null}
          </a>
        </div>
        <div className="mt-3 flex gap-2 pl-10">
          <a
            href={dest}
            rel="noopener noreferrer"
            className="btn-primary !min-h-10 flex-1 !py-2 text-sm"
          >
            Open
            <ArrowSquareOut size={14} weight="bold" />
          </a>
          <button
            type="button"
            onClick={() => void copyDest()}
            className="btn-secondary !min-h-10 sm:min-w-[6.5rem] !py-2 text-sm"
            aria-label={
              copied ? `Copied link ${index + 1}` : `Copy link ${index + 1}`
            }
          >
            {copied ? (
              <>
                <span className="text-[var(--accent)]">
                  <Check size={14} weight="bold" />
                </span>
                Copied
              </>
            ) : (
              <>
                <CopySimple size={14} weight="bold" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </motion.li>
  );
}

export function LinkListHop({ urls, code }: LinkListHopProps) {
  const reduceMotion = useReducedMotion();
  const tracked = useRef(false);
  const count = urls.length;

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackHopClick(code);
  }, [code]);

  const fade = reduceMotion
    ? { initial: false, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
      };

  const container = {
    initial: {},
    animate: {
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.06, delayChildren: 0.04 },
    },
  };

  const item = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { type: "spring" as const, stiffness: 380, damping: 28 },
        },
      };

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-4 py-8 sm:px-6">
      <motion.header
        className="flex items-center justify-between"
        {...fade}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      >
        <BrandLogo priority />
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
          <span className="text-[var(--accent)]">
            <ShieldCheck size={14} weight="bold" />
          </span>
          Safe hop
        </span>
      </motion.header>

      <motion.div
        className="flex flex-1 flex-col py-8"
        variants={container}
        initial="initial"
        animate="animate"
      >
        <motion.div className="mb-6" variants={item}>
          <p className="inline-flex items-center gap-1.5 text-sm font-medium tracking-wide text-[var(--muted)]">
            <ListBullets size={16} weight="bold" />
            {count} {count === 1 ? "link" : "links"}
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
            Pick a destination
          </p>
          <p className="mt-1 font-mono text-xs text-[var(--muted)] opacity-80">
            deskzy.xyz/r/{code}
          </p>
        </motion.div>

        <ul className="flex flex-col gap-3">
          {urls.map((dest, i) => (
            <ListRow
              key={`${i}-${dest}`}
              dest={dest}
              index={i}
              itemVariants={item}
            />
          ))}
        </ul>

        <motion.p
          className="mt-10 text-center text-sm leading-relaxed text-[var(--muted)]"
          variants={item}
        >
          Shared with Deskzy.{" "}
          <Link
            href="/tools/link-list"
            className="inline-flex items-center gap-1 font-medium text-[var(--accent-ink)] underline-offset-4 hover:underline"
          >
            <LinkSimple size={14} weight="bold" />
            Share your own list
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
