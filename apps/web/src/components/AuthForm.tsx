"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <div className="shell">
        <div className="shell-core p-6 text-sm text-[var(--muted)]">
          Auth is not configured yet. Add{" "}
          <code className="text-[var(--ink)]">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-[var(--ink)]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          to <code className="text-[var(--ink)]">apps/web/.env.local</code>, then
          restart the dev server.
        </div>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
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
  }

  return (
    <form onSubmit={onSubmit} className="shell">
      <div className="shell-core space-y-4 p-5 md:p-6">
        {mode === "signup" ? (
          <label className="block">
            <span className="text-xs font-medium text-[var(--muted)]">Name</span>
            <input
              className="field mt-1.5"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
            />
          </label>
        ) : null}
        <label className="block">
          <span className="text-xs font-medium text-[var(--muted)]">Email</span>
          <input
            className="field mt-1.5"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@company.com"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-[var(--muted)]">Password</span>
          <input
            className="field mt-1.5"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="At least 8 characters"
          />
        </label>

        {error ? (
          <p className="rounded-xl bg-[var(--warn-bg)] px-3 py-2 text-sm text-[var(--warn-ink)]">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-xl bg-[var(--ok-bg)] px-3 py-2 text-sm text-[var(--ok-ink)]">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          className="btn-primary w-full !rounded-full"
          disabled={busy}
        >
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
        </button>

        <p className="text-center text-sm text-[var(--muted)]">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Log in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link
                href={`/signup?next=${encodeURIComponent(next)}`}
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
