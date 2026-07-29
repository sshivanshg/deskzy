"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="inline-flex rounded-full border border-[var(--stroke)] bg-white/70 px-4 py-2 text-sm font-medium hover:border-[var(--stroke-strong)] disabled:opacity-50"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.push("/");
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
