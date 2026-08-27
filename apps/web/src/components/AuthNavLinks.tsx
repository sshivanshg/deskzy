"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/client";

function initials(email: string) {
  const local = email.split("@")[0] || "D";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
}

export function AuthNavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "pro" | "business">("free");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setReady(true);
      return;
    }
    const supabase = createClient();

    const refreshPlan = async (userId: string | undefined) => {
      if (!userId) {
        setPlan("free");
        return;
      }
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan,status")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const active =
        sub &&
        (sub.plan === "pro" || sub.plan === "business") &&
        (sub.status === "active" || sub.status === "authenticated");
      setPlan(active ? (sub.plan as "pro" | "business") : "free");
    };

    void supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      void refreshPlan(data.user?.id).finally(() => setReady(true));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      void refreshPlan(session?.user?.id);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready || !isSupabaseConfigured()) return null;

  if (email) {
    const av = initials(email);
    const paid = plan !== "free";
    const active = pathname === "/account";

    if (mobile) {
      return (
        <li>
          <Link
            href="/account"
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] ${
              active
                ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                : "text-[var(--ink)]"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white ${
                paid ? "bg-[var(--accent)]" : "bg-[var(--ink)]"
              }`}
            >
              {av}
            </span>
            <span className="min-w-0 flex-1 truncate">Account</span>
            {paid ? (
              <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-white">
                Pro
              </span>
            ) : null}
          </Link>
        </li>
      );
    }

    return (
      <Link
        href="/account"
        title={email}
        className={`hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full p-1 text-sm sm:inline-flex min-[1380px]:pr-2.5 ${
          active
            ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
            : "text-[var(--muted)] hover:bg-[var(--panel-muted)] hover:text-[var(--ink)]"
        }`}
      >
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ${
            paid ? "bg-[var(--accent)]" : "bg-[var(--ink)]"
          }`}
        >
          {av}
        </span>
        <span className="hidden max-w-[6.5rem] truncate min-[1380px]:inline">{email.split("@")[0]}</span>
        {paid ? (
          <span className="hidden rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white min-[1380px]:inline">
            Pro
          </span>
        ) : null}
      </Link>
    );
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
