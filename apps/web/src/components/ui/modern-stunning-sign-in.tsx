"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { SITE_NAME } from "@/lib/seo/site";

const AVATARS = [
  {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&auto=format",
    alt: "Deskzy user",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
    alt: "Deskzy user",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&auto=format",
    alt: "Deskzy user",
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format",
    alt: "Deskzy user",
  },
] as const;

type SignIn1Props = {
  mode?: "login" | "signup";
};

const SignIn1 = ({ mode = "login" }: SignIn1Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto w-full max-w-sm rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-8 text-sm text-[var(--muted)] shadow-[var(--shadow)]">
        Auth is not configured yet. Add{" "}
        <code className="text-[var(--ink)]">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="text-[var(--ink)]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
        to <code className="text-[var(--ink)]">apps/web/.env.local</code>, then
        restart the dev server.
      </div>
    );
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");
    setMessage("");
    setBusy(true);

    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error: signError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (signError) throw signError;
        if (data.session) {
          router.push(next);
          router.refresh();
          return;
        }
        setMessage("Check your email to confirm your account, then log in.");
      } else {
        const { error: signError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signError) throw signError;
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-[min(100dvh,720px)] w-full flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, var(--body-glow-a), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 100%, var(--body-glow-b), transparent 55%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-3xl border border-[var(--stroke)] bg-[color-mix(in_srgb,var(--bg-elevated)_88%,transparent)] p-8 shadow-[var(--shadow)] backdrop-blur-md">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] shadow-sm">
          <Image
            src="/logo-mark.png"
            alt={SITE_NAME}
            width={28}
            height={28}
            className="h-7 w-7 object-contain dark:brightness-[1.55] dark:saturate-[1.15]"
            priority
          />
        </div>

        <h2 className="font-display mb-2 text-center text-2xl font-semibold tracking-tight text-[var(--ink)]">
          {SITE_NAME}
        </h2>
        <p className="mb-6 text-center text-sm text-[var(--muted)]">
          {mode === "signup"
            ? "Create an account to manage Pro and seats."
            : "Access your account, billing, and Pro features."}
        </p>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-3">
            {mode === "signup" ? (
              <input
                placeholder="Your name"
                type="text"
                value={fullName}
                autoComplete="name"
                className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--field-bg)] px-5 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition focus:border-[var(--accent)] focus:bg-[var(--field-bg-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                onChange={(e) => setFullName(e.target.value)}
              />
            ) : null}
            <input
              placeholder="Email"
              type="email"
              value={email}
              autoComplete="email"
              className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--field-bg)] px-5 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition focus:border-[var(--accent)] focus:bg-[var(--field-bg-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder={
                mode === "signup" ? "Password (at least 8 characters)" : "Password"
              }
              type="password"
              value={password}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--field-bg)] px-5 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] transition focus:border-[var(--accent)] focus:bg-[var(--field-bg-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleSignIn();
              }}
            />
            {error ? (
              <div className="rounded-xl bg-[var(--warn-bg)] px-3 py-2 text-left text-sm text-[var(--warn-ink)]">
                {error}
              </div>
            ) : null}
            {message ? (
              <div className="rounded-xl bg-[var(--ok-bg)] px-3 py-2 text-left text-sm text-[var(--ok-ink)]">
                {message}
              </div>
            ) : null}
          </div>

          <hr className="border-[var(--stroke)] opacity-60" />

          <div>
            <button
              type="button"
              onClick={() => void handleSignIn()}
              disabled={busy}
              className="mb-3 w-full rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--primary-foreground)] shadow-sm transition hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy
                ? "Please wait…"
                : mode === "signup"
                  ? "Create account"
                  : "Sign in"}
            </button>

            <div className="mt-2 w-full text-center">
              <span className="text-xs text-[var(--muted)]">
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <Link
                      href={`/login?next=${encodeURIComponent(next)}`}
                      className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
                    >
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link
                      href={`/signup?next=${encodeURIComponent(next)}`}
                      className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
                    >
                      Sign up, it&apos;s free!
                    </Link>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 flex flex-col items-center text-center">
        <p className="mb-3 max-w-xs text-sm text-[var(--muted)]">
          Short links, private file tools, and Pro analytics — all in one place
          with{" "}
          <span className="font-medium text-[var(--ink)]">{SITE_NAME}</span>.
        </p>
        <div className="flex -space-x-2">
          {AVATARS.map((avatar) => (
            // eslint-disable-next-line @next/next/no-img-element -- remote Unsplash avatars for social proof
            <img
              key={avatar.src}
              src={avatar.src}
              alt={avatar.alt}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border-2 border-[var(--bg)] object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { SignIn1 };
