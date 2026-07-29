import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Log in",
  description: "Log in to Deskzy to manage your Pro subscription and seats.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Access your account, billing, and Pro features.
      </p>
      <div className="mt-8">
        <Suspense fallback={<div className="shell"><div className="shell-core p-6 text-sm text-[var(--muted)]">Loading…</div></div>}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  );
}
