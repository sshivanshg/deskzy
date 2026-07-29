import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AcceptInviteButton } from "@/components/AcceptInviteButton";
import { buildPageMetadata } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

type Props = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Accept seat invite",
    description: "Join a Deskzy Pro team seat.",
    path: "/invite",
  }),
  robots: { index: false, follow: false },
};

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  let email: string | null = null;
  let status: string | null = null;
  let loggedIn = false;
  let userEmail: string | undefined;

  try {
    const admin = createServiceClient();
    const { data: invite } = await admin
      .from("seat_invites")
      .select("email,status")
      .eq("token", token)
      .maybeSingle();
    email = invite?.email ?? null;
    status = invite?.status ?? null;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    loggedIn = Boolean(user);
    userEmail = user?.email ?? undefined;
  } catch {
    /* ignore */
  }

  if (!email) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="font-display text-3xl font-semibold">Invite not found</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          This invite link is invalid or expired.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Go home
        </Link>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="font-display text-3xl font-semibold">Already accepted</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          This invite for {email} was already used.
        </p>
        <Link href="/account" className="btn-primary mt-6 inline-flex">
          Open account
        </Link>
      </div>
    );
  }

  if (status === "revoked") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="font-display text-3xl font-semibold">Invite revoked</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Ask the Pro owner to send a new invite.
        </p>
      </div>
    );
  }

  if (!loggedIn) {
    redirect(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Join Pro team
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        You&apos;re invited as <span className="text-[var(--ink)]">{email}</span>
        {userEmail ? (
          <>
            . Signed in as <span className="text-[var(--ink)]">{userEmail}</span>.
          </>
        ) : null}
      </p>
      <AcceptInviteButton token={token} />
    </div>
  );
}
