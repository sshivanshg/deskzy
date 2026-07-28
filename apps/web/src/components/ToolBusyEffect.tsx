"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const LINES_BY_KIND: Record<string, string[]> = {
  compress: [
    "Reading your file…",
    "Finding the right quality…",
    "Shrinking safely…",
    "Almost there…",
  ],
  merge: [
    "Gathering pages…",
    "Stitching documents…",
    "Keeping order intact…",
    "Wrapping up…",
  ],
  split: [
    "Scanning pages…",
    "Cutting the range…",
    "Packaging the result…",
  ],
  image: [
    "Loading pixels…",
    "Tuning the encode…",
    "Balancing size & clarity…",
  ],
  pdf: [
    "Opening the PDF…",
    "Working through pages…",
    "Preparing download…",
  ],
  default: [
    "Working in your browser…",
    "Nothing leaves this device…",
    "Finishing up…",
  ],
};

function linesForSlug(slug: string): string[] {
  if (slug.includes("compress")) return LINES_BY_KIND.compress;
  if (slug.includes("merge")) return LINES_BY_KIND.merge;
  if (slug.includes("split")) return LINES_BY_KIND.split;
  if (slug.includes("image") || slug.includes("webp") || slug.includes("resize"))
    return LINES_BY_KIND.image;
  if (slug.includes("pdf") || slug.includes("reorder")) return LINES_BY_KIND.pdf;
  return LINES_BY_KIND.default;
}

export function ToolBusyEffect({
  active,
  slug,
  children,
}: {
  active: boolean;
  slug: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const lines = useMemo(() => linesForSlug(slug), [slug]);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setLineIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setLineIndex((i) => (i + 1) % lines.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [active, lines.length]);

  return (
    <div className="relative">
      <div
        className={
          active ? "pointer-events-none select-none opacity-[0.55]" : undefined
        }
        aria-hidden={active || undefined}
      >
        {children}
      </div>

      <AnimatePresence>
        {active ? (
          <>
            <motion.div
              key="shimmer"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[var(--radius-shell)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--bg)_35%,transparent)] backdrop-blur-[1px]" />
              {!reduce ? (
                <motion.div
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--accent)_18%,transparent)] to-transparent"
                  initial={{ x: "-60%" }}
                  animate={{ x: "220%" }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ) : null}
            </motion.div>

            <motion.div
              key="card"
              role="status"
              aria-live="polite"
              className="absolute inset-x-3 top-1/2 z-10 -translate-y-1/2 sm:inset-x-6"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <div className="shell !rounded-2xl !p-1.5 shadow-[var(--shadow)]">
                <div className="shell-core !rounded-[1.1rem] px-4 py-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                      <motion.span
                        className="absolute inset-0 rounded-2xl bg-[var(--accent-soft)]"
                        animate={
                          reduce
                            ? undefined
                            : { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }
                        }
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.span
                        className="relative h-2.5 w-2.5 rounded-full bg-[var(--accent)]"
                        animate={reduce ? undefined : { scale: [1, 0.85, 1] }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                        Working privately
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={lines[lineIndex]}
                          className="mt-1 truncate font-display text-base font-semibold tracking-tight text-[var(--ink)]"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22 }}
                        >
                          {lines[lineIndex]}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--accent)]"
                      initial={{ x: "-100%" }}
                      animate={
                        reduce
                          ? { x: "0%", width: "40%" }
                          : { x: ["-100%", "120%"] }
                      }
                      transition={
                        reduce
                          ? { duration: 0.3 }
                          : {
                              duration: 1.4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                      }
                      style={{ width: "42%" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
