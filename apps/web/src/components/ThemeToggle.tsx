"use client";

import { Desktop, Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ORDER = ["light", "dark", "system"] as const;
type ThemeChoice = (typeof ORDER)[number];

function nextTheme(current: string | undefined): ThemeChoice {
  const idx = ORDER.indexOf((current as ThemeChoice) || "system");
  return ORDER[(idx + 1) % ORDER.length];
}

function labelFor(theme: string | undefined): string {
  if (theme === "light") return "Light";
  if (theme === "dark") return "Dark";
  return "System";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = (theme as ThemeChoice | undefined) ?? "system";
  const next = nextTheme(current);

  return (
    <button
      type="button"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] text-[var(--ink)] transition-colors hover:border-[var(--stroke-strong)] hover:text-[var(--accent)] md:rounded-full ${className}`}
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${labelFor(current)}. Switch to ${labelFor(next)}`}
      title={`Theme: ${labelFor(current)}`}
    >
      {!mounted ? (
        <Sun size={18} weight="duotone" aria-hidden />
      ) : current === "dark" ? (
        <Moon size={18} weight="duotone" aria-hidden />
      ) : current === "system" ? (
        <Desktop size={18} weight="duotone" aria-hidden />
      ) : (
        <Sun size={18} weight="duotone" aria-hidden />
      )}
    </button>
  );
}
