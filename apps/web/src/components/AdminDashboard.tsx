"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowClockwise,
  LockSimple,
  MagnifyingGlass,
  ShieldCheck,
  LinkSimple,
  CircleNotch,
} from "@phosphor-icons/react";

type AdminPayload = {
  totals: {
    links: number;
    clicks: number;
    users: number;
    apiKeys: number;
    invites: number;
    listLinks: number;
    singleLinks: number;
  };
  links: Array<{
    code: string;
    dest: string;
    hits: number;
    created_at: string;
    user_id: string | null;
    is_custom: boolean;
    kind?: string | null;
    urls?: string[] | null;
    shortUrl: string;
    destHost: string | null;
    urlCount: number;
  }>;
  clicks: Array<{
    code: string;
    referrer: string | null;
    user_agent: string | null;
    country: string | null;
    colo: string | null;
    clicked_at: string;
  }>;
  subscriptions: Array<{
    id: string;
    user_id: string;
    plan: string;
    status: string;
    billing_cycle: string | null;
    seats: number;
    razorpay_subscription_id: string | null;
    current_period_end: string | null;
    updated_at: string;
  }>;
  apiKeys: Array<{
    id: string;
    user_id: string | null;
    name: string;
    key_prefix: string;
    created_at: string;
    last_used_at: string | null;
    revoked_at: string | null;
  }>;
  invites: Array<{
    id: string;
    subscription_id: string;
    email: string;
    status: string;
    token: string;
    created_at: string;
    invited_by: string | null;
  }>;
  topReferrers: { label: string; count: number }[];
  topCountries: { label: string; count: number }[];
  topColos: { label: string; count: number }[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function hostFromUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminPayload | null>(null);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const json = (await res.json()) as AdminPayload & { error?: string };
      if (res.status === 403) {
        setUnlocked(false);
        setData(null);
        return;
      }
      if (!res.ok) throw new Error(json.error || "Could not load admin dashboard");
      setData(json);
      setUnlocked(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const unlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Unlock failed");
      setPassword("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unlock failed");
    } finally {
      setBusy(false);
    }
  };

  const filteredLinks = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data.links;
    return data.links.filter((link) => {
      const blob = [
        link.code,
        link.dest,
        link.destHost,
        link.shortUrl,
        link.user_id,
        link.kind,
        ...(link.urls ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [data, query]);

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-2xl items-center px-4 py-10">
        <div className="w-full rounded-[2rem] border border-[var(--stroke)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow)] md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-ink)]">
            <LockSimple size={12} weight="bold" />
            Admin
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
            Admin dashboard
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            This panel exposes the link inventory, click sources, subscription rows,
            API keys, and seat invites that exist in the current app.
          </p>

          <form onSubmit={unlock} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--ink)]">
                Passphrase
              </span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                className="field w-full rounded-2xl px-4 py-3 text-base"
                placeholder="Enter passphrase"
              />
            </label>
            <button type="submit" className="btn-primary w-full" disabled={busy}>
              {busy ? (
                <span className="inline-flex animate-spin">
                  <CircleNotch size={18} />
                </span>
              ) : (
                <ShieldCheck size={18} weight="bold" />
              )}
              Open dashboard
            </button>
          </form>
          {error ? (
            <p className="mt-4 rounded-2xl border border-[var(--warn-ink)]/20 bg-[var(--warn-bg)] px-4 py-3 text-sm text-[var(--warn-ink)]">
              {error}
            </p>
          ) : null}
          <p className="mt-4 text-xs text-[var(--muted)]">
            Server gate is active. In this build the passphrase is the one you requested, so treat this as an internal-only admin surface.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
      <header className="shell overflow-hidden">
        <div className="shell-core px-5 py-5 md:px-7 md:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--stroke)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-ink)]">
                <ShieldCheck size={12} weight="bold" />
                Admin dashboard
              </div>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
                Full link intelligence
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
                Search everything the app knows about short links, source referrers,
                countries, colos, subscriptions, API keys, and invites from one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => void load()} className="btn-secondary">
                <ArrowClockwise size={16} weight="bold" />
                Refresh
              </button>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/admin/lock", { method: "POST" });
                  setUnlocked(false);
                }}
                className="btn-secondary"
              >
                <LockSimple size={16} weight="bold" />
                Lock session
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[
          ["Links", data?.totals.links ?? 0],
          ["Clicks", data?.totals.clicks ?? 0],
          ["Users", data?.totals.users ?? 0],
          ["API keys", data?.totals.apiKeys ?? 0],
          ["Invites", data?.totals.invites ?? 0],
          ["List links", data?.totals.listLinks ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="shell">
            <div className="shell-core p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                {label}
              </p>
              <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-[var(--ink)]">
                {Number(value).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="shell">
          <div className="shell-core p-5 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Search inventory
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--ink)]">
                  Every short link and destination
                </h2>
              </div>
              <div className="relative w-full md:max-w-sm">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                  <MagnifyingGlass size={16} weight="bold" />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by code, source, destination, user, URL"
                  className="field w-full rounded-2xl py-3 pl-9 pr-4 text-sm"
                />
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--stroke)]">
              <div className="grid grid-cols-12 gap-3 border-b border-[var(--stroke)] bg-[var(--surface)]/40 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                <div className="col-span-3">Short</div>
                <div className="col-span-4">Destination</div>
                <div className="col-span-1 text-right">Hits</div>
                <div className="col-span-2">Source</div>
                <div className="col-span-2 text-right">Created</div>
              </div>
              <div className="divide-y divide-[var(--stroke)]">
                {filteredLinks.length ? (
                  filteredLinks.slice(0, 50).map((link) => (
                      <div key={link.code} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm">
                      <div className="col-span-3 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="shrink-0 text-[var(--accent)]">
                            <LinkSimple size={15} weight="bold" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[var(--ink)]">{link.shortUrl}</p>
                            <p className="truncate text-xs text-[var(--muted)]">/{link.code}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-4 min-w-0">
                        <p className="truncate font-medium text-[var(--ink)]">{link.dest}</p>
                        <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                          {link.destHost ?? hostFromUrl(link.dest)} · {link.kind || "single"} · {link.urlCount} URL{link.urlCount === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="col-span-1 text-right font-mono text-[var(--ink)]">{link.hits.toLocaleString("en-IN")}</div>
                      <div className="col-span-2 truncate text-xs text-[var(--muted)]">
                        {link.is_custom ? "custom" : "random"}
                        {link.user_id ? ` · ${link.user_id.slice(0, 8)}` : ""}
                      </div>
                      <div className="col-span-2 text-right text-xs text-[var(--muted)]">{formatDate(link.created_at)}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-10 text-sm text-[var(--muted)]">
                    No links match this filter.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="shell">
            <div className="shell-core p-5 md:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Top sources
              </p>
              <div className="mt-4 space-y-3">
                {data?.topReferrers?.length ? data.topReferrers.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4">
                    <span className="truncate text-sm text-[var(--ink)]">{row.label}</span>
                    <span className="font-mono text-sm text-[var(--muted)]">{row.count}</span>
                  </div>
                )) : <p className="text-sm text-[var(--muted)]">No referrer data yet.</p>}
              </div>
            </div>
          </div>

          <div className="shell">
            <div className="shell-core p-5 md:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Geography
              </p>
              <div className="mt-4 grid gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Countries</p>
                  <div className="mt-2 space-y-2">
                    {data?.topCountries?.length ? data.topCountries.map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-sm text-[var(--ink)]">{row.label}</span>
                        <span className="font-mono text-sm text-[var(--muted)]">{row.count}</span>
                      </div>
                    )) : <p className="text-sm text-[var(--muted)]">No country data yet.</p>}
                  </div>
                </div>
                <div className="border-t border-[var(--stroke)] pt-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Colos</p>
                  <div className="mt-2 space-y-2">
                    {data?.topColos?.length ? data.topColos.map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-sm text-[var(--ink)]">{row.label}</span>
                        <span className="font-mono text-sm text-[var(--muted)]">{row.count}</span>
                      </div>
                    )) : <p className="text-sm text-[var(--muted)]">No colo data yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shell">
            <div className="shell-core p-5 md:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Recent clicks
              </p>
              <div className="mt-4 space-y-3">
                {data?.clicks?.length ? data.clicks.slice(0, 8).map((click) => (
                  <div key={`${click.code}-${click.clicked_at}`} className="rounded-2xl border border-[var(--stroke)] px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-sm text-[var(--ink)]">/{click.code}</span>
                      <span className="text-xs text-[var(--muted)]">{formatDate(click.clicked_at)}</span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {click.referrer ? hostFromUrl(click.referrer) : "Direct"} · {click.country || "??"} · {click.colo || "??"}
                    </p>
                  </div>
                )) : <p className="text-sm text-[var(--muted)]">No click rows yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="shell">
          <div className="shell-core p-5 md:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Subscriptions
            </p>
            <div className="mt-4 space-y-3">
              {data?.subscriptions?.length ? data.subscriptions.map((sub) => (
                <div key={sub.id} className="rounded-2xl border border-[var(--stroke)] px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-[var(--ink)]">{sub.plan.toUpperCase()}</span>
                    <span className="font-mono text-xs text-[var(--muted)]">{sub.status}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-[var(--muted)]">{sub.user_id} · {sub.billing_cycle || "n/a"} · {sub.seats} seats</p>
                </div>
              )) : <p className="text-sm text-[var(--muted)]">No subscription rows yet.</p>}
            </div>
          </div>
        </div>
        <div className="shell">
          <div className="shell-core p-5 md:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              API keys and invites
            </p>
            <div className="mt-4 grid gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Keys</p>
                <div className="mt-2 space-y-2">
                  {data?.apiKeys?.length ? data.apiKeys.map((key) => (
                    <div key={key.id} className="rounded-2xl border border-[var(--stroke)] px-3 py-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-[var(--ink)]">{key.name}</span>
                        <span className="font-mono text-xs text-[var(--muted)]">{key.key_prefix}</span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {key.user_id || "no user"} · {key.last_used_at ? `used ${formatDate(key.last_used_at)}` : "never used"}
                      </p>
                    </div>
                  )) : <p className="text-sm text-[var(--muted)]">No API keys yet.</p>}
                </div>
              </div>
              <div className="border-t border-[var(--stroke)] pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Invites</p>
                <div className="mt-2 space-y-2">
                  {data?.invites?.length ? data.invites.map((invite) => (
                    <div key={invite.id} className="rounded-2xl border border-[var(--stroke)] px-3 py-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate font-medium text-[var(--ink)]">{invite.email}</span>
                        <span className="font-mono text-xs text-[var(--muted)]">{invite.status}</span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted)]">{invite.subscription_id.slice(0, 8)} · {formatDate(invite.created_at)}</p>
                    </div>
                  )) : <p className="text-sm text-[var(--muted)]">No invites yet.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="fixed inset-x-4 bottom-4 rounded-2xl border border-[var(--stroke)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--muted)] shadow-[var(--shadow)] md:left-1/2 md:right-auto md:w-fit md:-translate-x-1/2">
          Loading live admin data…
        </div>
      ) : null}
      {error ? (
        <div className="fixed inset-x-4 bottom-4 rounded-2xl border border-[var(--warn-ink)]/20 bg-[var(--warn-bg)] px-4 py-3 text-sm text-[var(--warn-ink)] shadow-[var(--shadow)] md:left-1/2 md:right-auto md:w-fit md:-translate-x-1/2">
          {error}
        </div>
      ) : null}
    </div>
  );
}
