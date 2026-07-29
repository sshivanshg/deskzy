"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { BillingCycle } from "@/lib/pricing";
import { formatInr, proTotalInr } from "@/lib/pricing";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function ProCheckoutButton({
  cycle,
  seats,
  loggedIn,
}: {
  cycle: BillingCycle;
  seats: number;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(async () => {
    setError(null);
    if (!loggedIn) {
      const next = `/pricing?checkout=1&cycle=${cycle}&seats=${seats}`;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    setBusy(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error("Could not load Razorpay Checkout");
      }

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cycle, seats }),
      });
      const data = (await res.json()) as {
        error?: string;
        subscriptionId?: string;
        keyId?: string;
      };
      if (!res.ok || !data.subscriptionId || !data.keyId) {
        throw new Error(data.error || "Checkout failed");
      }

      const total = formatInr(proTotalInr(seats, cycle));
      const rzp = new window.Razorpay({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Deskzy",
        description: `Pro · ${seats} seat${seats > 1 ? "s" : ""} · ${total}`,
        theme: { color: "#1f6b57" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          const verify = await fetch("/api/billing/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (!verify.ok) {
            const v = (await verify.json()) as { error?: string };
            setError(v.error || "Payment verification failed");
            return;
          }
          router.push("/account?upgraded=1");
          router.refresh();
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }, [cycle, seats, loggedIn, router]);

  return (
    <div>
      <button
        type="button"
        className="btn-primary w-full !rounded-full"
        onClick={startCheckout}
        disabled={busy}
      >
        {busy ? "Starting checkout…" : loggedIn ? "Go Pro" : "Log in to Go Pro"}
      </button>
      {error ? (
        <p className="mt-2 text-center text-xs text-[var(--warn-ink)]">{error}</p>
      ) : (
        <p className="mt-2 text-center text-xs text-[var(--muted)]">
          Secure checkout with Razorpay (UPI, cards, netbanking).
        </p>
      )}
    </div>
  );
}
