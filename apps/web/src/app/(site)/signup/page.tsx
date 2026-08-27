import type { Metadata } from "next";
import { Suspense } from "react";
import { SignIn1 } from "@/components/ui/modern-stunning-sign-in";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign up",
  description: "Create a free Deskzy account and get an API key with 25 requests per day.",
  path: "/signup",
});

export default function SignupPage() {
  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[min(100dvh,720px)] max-w-sm items-center justify-center px-4 text-sm text-[var(--muted)]">
            Loading…
          </div>
        }
      >
        <SignIn1 mode="signup" />
      </Suspense>
    </div>
  );
}
