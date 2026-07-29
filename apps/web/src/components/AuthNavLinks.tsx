"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

export function AuthNavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setReady(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready || !isSupabaseConfigured()) return null;

  const accountClass = mobile
    ? `flex items-center justify-between rounded-xl px-3 py-3 text-[15px] ${
        pathname === "/account"
          ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
          : "text-[var(--ink)]"
      }`
    : `hidden items-center rounded-full px-3 py-1.5 text-sm sm:inline-flex ${
        pathname === "/account"
          ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
          : "text-[var(--muted)] hover:text-[var(--ink)]"
      }`;

  if (email) {
    const link = (
      <Link href="/account" className={accountClass} title={email}>
        Account
      </Link>
    );
    return mobile ? <li>{link}</li> : link;
  }

  if (mobile) {
    return (
      <>
        <li>
          <Link
            href="/login"
            className="flex items-center rounded-xl px-3 py-3 text-[15px] text-[var(--ink)]"
          >
            Log in
          </Link>
        </li>
        <li>
          <Link
            href="/signup"
            className="flex items-center rounded-xl px-3 py-3 text-[15px] font-medium text-[var(--accent)]"
          >
            Sign up
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="hidden items-center rounded-full px-3 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--ink)] sm:inline-flex"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="hidden items-center rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--accent)] hover:opacity-90 sm:inline-flex"
      >
        Sign up
      </Link>
    </>
  );
}
