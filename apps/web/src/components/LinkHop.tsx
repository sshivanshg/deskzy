"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  ArrowSquareOut,
  Check,
  CopySimple,
  LinkSimple,
  ShieldCheck,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { BrandLogo } from "@/components/BrandLogo";

type LinkHopProps = {
  dest: string;
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

export function LinkHop({ dest, code }: LinkHopProps) {
  const reduceMotion = useReducedMotion();
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
        : { staggerChildren: 0.07, delayChildren: 0.04 },
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
        className="flex flex-1 flex-col justify-center py-10"
        variants={container}
        initial="initial"
        animate="animate"
      >
        <motion.p
          className="text-sm font-medium tracking-wide text-[var(--muted)]"
          variants={item}
        >
          You&apos;re opening
        </motion.p>

        <motion.div className="mt-4" variants={item}>
          <a
            href={dest}
            rel="noopener noreferrer"
            className="group block rounded-[1.35rem] border border-[var(--stroke)] bg-[color-mix(in_srgb,var(--bg-elevated)_90%,white)] px-5 py-5 shadow-[var(--shadow)] transition-[border-color,transform] duration-200 ease-[var(--ease)] hover:border-[var(--stroke-strong)] active:scale-[0.99]"
          >
            <p className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
              {host}
            </p>
            {rest ? (
              <p className="mt-2 break-all font-mono text-sm leading-relaxed text-[var(--muted)]">
                {rest.length > 96 ? `${rest.slice(0, 96)}…` : rest}
              </p>
            ) : null}
            <p className="mt-3 text-xs text-[var(--muted)] opacity-80">
              deskzy.xyz/r/{code}
            </p>
          </a>
        </motion.div>

        <motion.div
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch"
          variants={item}
        >
          <a
            href={dest}
            rel="noopener noreferrer"
            className="btn-primary min-h-12 flex-1 text-base"
          >
            Open link
            <ArrowSquareOut size={16} weight="bold" />
          </a>
          <button
            type="button"
            onClick={copyDest}
            className="btn-secondary min-h-12 sm:min-w-[8.5rem]"
            aria-label={copied ? "Copied destination URL" : "Copy destination URL"}
          >
            {copied ? (
              <>
                <span className="text-[var(--accent)]">
                  <Check size={16} weight="bold" />
                </span>
                Copied
              </>
            ) : (
              <>
                <CopySimple size={16} weight="bold" />
                Copy
              </>
            )}
          </button>
        </motion.div>

        <motion.p
          className="mt-8 text-center text-sm leading-relaxed text-[var(--muted)]"
          variants={item}
        >
          Shortened with Deskzy.{" "}
          <Link
            href="/tools/url-shortener"
            className="inline-flex items-center gap-1 font-medium text-[var(--accent-ink)] underline-offset-4 hover:underline"
          >
            <LinkSimple size={14} weight="bold" />
            Make your own
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
