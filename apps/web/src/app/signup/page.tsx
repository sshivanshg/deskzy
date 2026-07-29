import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign up",
  description: "Create a Deskzy account to upgrade to Pro with Razorpay.",
  path: "/signup",
});

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Sign up</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Free to start. Upgrade anytime from Pricing.
      </p>
      <div className="mt-8">
        <Suspense fallback={<div className="shell"><div className="shell-core p-6 text-sm text-[var(--muted)]">Loading…</div></div>}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
    </div>
  );
}
