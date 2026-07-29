"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AcceptInviteButton({ token }: { token: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/seats/accept/${encodeURIComponent(token)}`, {
        method: "POST",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not accept invite");
      router.push("/account?joined=1");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        type="button"
        className="btn-primary"
        disabled={busy}
        onClick={() => void accept()}
      >
        {busy ? "Joining…" : "Accept invite"}
      </button>
      {error ? (
        <p className="mt-3 text-sm text-[var(--warn-ink)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
