"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides global header/footer on short-link hop routes for a focused experience. */
export function SiteChromeGate({
  children,
  mode,
}: {
  children: ReactNode;
  mode: "header" | "footer" | "main";
}) {
  const pathname = usePathname();
  const isHop = pathname?.startsWith("/r/") ?? false;

  if (mode === "main") {
    return (
      <main
        className={
          isHop ? "relative z-0 min-h-[100dvh]" : "relative z-0 min-h-[70dvh]"
        }
      >
        {children}
      </main>
    );
  }

  if (isHop) return null;
  return children;
}
