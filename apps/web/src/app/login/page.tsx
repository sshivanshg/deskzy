import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Log in",
  description: "Log in to Deskzy to manage your Pro subscription and seats.",
  path: "/login",
});

function AuthErrorBanner({ error }: { error?: string }) {
  if (error !== "auth" && error !== "auth_callback") return null;
  return (
    <p className="mt-4 rounded-xl bg-[var(--warn-bg)] px-3 py-2 text-sm text-[var(--warn-ink)]">
      Email confirmation failed or expired. Try logging in, or request a new
      signup email.
    </p>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Access your account, billing, and Pro features.
      </p>
      <AuthErrorBanner error={params.error} />
      <div className="mt-8">
        <Suspense
          fallback={
            <div className="shell">
              <div className="shell-core p-6 text-sm text-[var(--muted)]">
                Loading…
              </div>
            </div>
          }
        >
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  );
}
