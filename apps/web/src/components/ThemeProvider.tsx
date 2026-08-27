"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentType, ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  storageKey?: string;
  disableTransitionOnChange?: boolean;
};

// next-themes ThemeProviderProps + React 19 types drop `children` in this monorepo.
const Provider = NextThemesProvider as ComponentType<ProviderProps>;

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <Provider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="site-theme-v2"
      disableTransitionOnChange
    >
      {children}
    </Provider>
  );
}
