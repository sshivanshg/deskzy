import type { Metadata } from "next";
import { Suspense } from "react";
import { SignIn1 } from "@/components/ui/modern-stunning-sign-in";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Log in",
  description: "Log in to Deskzy to manage your Pro subscription and seats.",
  path: "/login",
});

function AuthErrorBanner({ error }: { error?: string }) {
  if (error !== "auth" && error !== "auth_callback") return null;
  return (
    <p className="mx-auto mt-4 max-w-sm rounded-xl bg-[var(--warn-bg)] px-3 py-2 text-sm text-[var(--warn-ink)]">
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
    <div className="w-full">
      <AuthErrorBanner error={params.error} />
      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[min(100dvh,720px)] max-w-sm items-center justify-center px-4 text-sm text-[var(--muted)]">
            Loading…
          </div>
        }
      >
        <SignIn1 mode="login" />
      </Suspense>
    </div>
  );
}
