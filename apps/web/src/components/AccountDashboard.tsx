"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowSquareOut,
  ChartLine,
  Check,
  CheckCircle,
  CopySimple,
  CrownSimple,
  Image as ImageIcon,
  Key,
  LinkSimple,
  LockSimple,
  Plus,
  Sparkle,
  Trash,
  UsersThree,
  WarningCircle,
} from "@phosphor-icons/react";
import { formatInr, PRO_FEATURES, proUnitInr, type BillingCycle } from "@/lib/pricing";
import { publicLinkUrl } from "@/lib/link-path";
import { CONTACT_X_URL } from "@/lib/seo/site";
import { ProAnalyticsPreview } from "@/components/ProAnalyticsPreview";
import { SignOutButton } from "@/components/SignOutButton";

type LinkRow = {
  code: string;
  dest: string;
  hits: number;
  is_custom: boolean;
  created_at: string;
};

type InviteRow = {
  id: string;
  email: string;
  status: string;
  token: string;
  created_at: string;
};

type PresetRow = {
  id: string;
  kind: string;
  name: string;
  payload: Record<string, unknown>;
  created_at: string;
};

type ApiKeyRow = {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
};

export type AccountDashboardProps = {
  email: string;
  paid: boolean;
  planLabel: "Free" | "Pro" | "Business";
  statusLabel: string;
  seats: number;
  billingCycle: BillingCycle | null;
  periodEnd: string | null;
  flash?: "upgraded" | "joined" | null;
};

type Tab = "overview" | "links" | "analytics" | "team" | "presets" | "api";

const TAB_IDS: Tab[] = [
  "overview",
  "links",
  "analytics",
  "team",
  "presets",
  "api",
];

function parseTab(raw: string | null): Tab | null {
  if (!raw) return null;
  return TAB_IDS.includes(raw as Tab) ? (raw as Tab) : null;
}

function initials(email: string) {
  const local = email.split("@")[0] || "D";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

function displayName(email: string) {
  const local = email.split("@")[0] || "there";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function AccountDashboard(props: AccountDashboardProps) {
  const {
    email,
    paid,
    planLabel,
    statusLabel,
    seats,
    billingCycle,
    periodEnd,
    flash,
  } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = parseTab(searchParams.get("tab"));
  const [tab, setTabState] = useState<Tab>(
    initialTab &&
      (initialTab === "team" ||
        initialTab === "presets" ||
        initialTab === "api") &&
      !paid
      ? "analytics"
      : (initialTab ?? "overview"),
  );

  const setTab = useCallback(
    (next: Tab) => {
      setTabState(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next === "overview") params.delete("tab");
      else params.set("tab", next);
      const qs = params.toString();
      router.replace(qs ? `/account?${qs}` : "/account", { scroll: false });
    },
    [router, searchParams],
  );
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [presets, setPresets] = useState<PresetRow[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyRow[]>([]);
  const [apiSecret, setApiSecret] = useState<string | null>(null);
  const [seatCap, setSeatCap] = useState(seats);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const name = useMemo(() => displayName(email), [email]);
  const avatar = useMemo(() => initials(email), [email]);

  const pendingInvites = invites.filter((i) => i.status === "pending").length;
  const acceptedInvites = invites.filter((i) => i.status === "accepted").length;
  const seatsUsed = Math.min(seatCap, 1 + acceptedInvites + pendingInvites);
  const totalClicks = links.reduce((n, l) => n + (l.hits || 0), 0);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [linksRes, seatsRes, presetsRes, keysRes] = await Promise.all([
        fetch("/api/links"),
        fetch("/api/seats"),
        paid ? fetch("/api/presets") : Promise.resolve(null),
        paid ? fetch("/api/keys") : Promise.resolve(null),
      ]);
      if (linksRes.ok) {
        const data = (await linksRes.json()) as { links?: LinkRow[] };
        setLinks(data.links ?? []);
      }
      if (seatsRes.ok) {
        const data = (await seatsRes.json()) as {
          invites?: InviteRow[];
          seats?: number;
        };
        setInvites(data.invites ?? []);
        setSeatCap(data.seats ?? seats);
      }
      if (keysRes?.ok) {
        const data = (await keysRes.json()) as { keys?: ApiKeyRow[] };
        setApiKeys(data.keys ?? []);
      }
      if (presetsRes?.ok) {
        const data = (await presetsRes.json()) as { presets?: PresetRow[] };
        setPresets(data.presets ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load account data");
    } finally {
      setLoading(false);
    }
  }, [paid, seats]);

  useEffect(() => {
    void load();
  }, [load]);

  const markCopied = (key: string) => {
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1400);
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim() || busy) return;
    setBusy(true);
    setError(null);
    setInviteUrl(null);
    try {
      const res = await fetch("/api/seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      const data = (await res.json()) as {
        error?: string;
        inviteUrl?: string;
      };
      if (!res.ok) throw new Error(data.error || "Invite failed");
      setInviteUrl(data.inviteUrl || null);
      setInviteEmail("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invite failed");
    } finally {
      setBusy(false);
    }
  };

  const revokeInvite = async (id: string) => {
    await fetch(`/api/seats?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  };

  const deletePreset = async (id: string) => {
    await fetch(`/api/presets?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  };

  const createApiKey = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setApiSecret(null);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Default" }),
      });
      const data = (await res.json()) as {
        error?: string;
        secret?: string;
      };
      if (!res.ok) throw new Error(data.error || "Could not create key");
      setApiSecret(data.secret ?? null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create key");
    } finally {
      setBusy(false);
    }
  };

  const revokeApiKey = async (id: string) => {
    await fetch(`/api/keys?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  };

  const tabs: { id: Tab; label: string; hint?: string }[] = [
    { id: "overview", label: "Overview" },
    {
      id: "links",
      label: "Links",
      hint: links.length ? String(links.length) : undefined,
    },
    {
      id: "analytics",
      label: "Analytics",
      hint: paid ? undefined : "Pro",
    },
    ...(paid
      ? [
          {
            id: "team" as const,
            label: "Team",
            hint: `${seatsUsed}/${seatCap}`,
          },
          {
            id: "presets" as const,
            label: "Presets",
            hint: presets.length ? String(presets.length) : undefined,
          },
          {
            id: "api" as const,
            label: "API",
            hint: apiKeys.length ? String(apiKeys.length) : undefined,
          },
        ]
      : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {flash === "upgraded" ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--accent)]/20 bg-[var(--ok-bg)] px-4 py-3 text-sm text-[var(--ok-ink)]">
          <CheckCircle size={20} weight="fill" />
          <div>
            <p className="font-semibold">Welcome to Deskzy Pro</p>
            <p className="mt-0.5 opacity-90">
              Unlimited processing, custom slugs, analytics, API keys, and team seats are unlocked.
            </p>
          </div>
        </div>
      ) : null}
      {flash === "joined" ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--accent)]/20 bg-[var(--ok-bg)] px-4 py-3 text-sm text-[var(--ok-ink)]">
          <CheckCircle size={20} weight="fill" />
          <p>You joined a Pro team seat. Unlimited tools are ready.</p>
        </div>
      ) : null}

      {/* Profile hero */}
      <header className="shell overflow-hidden">
        <div className="shell-core relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-semibold tracking-tight text-white md:h-16 md:w-16 md:text-xl ${
                  paid ? "bg-[var(--accent)]" : "bg-[var(--ink)]"
                }`}
                aria-hidden
              >
                {avatar}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  Membership
                </p>
                <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
                  {name}
                </h1>
                <p className="mt-1 truncate text-sm text-[var(--muted)]">{email}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      paid
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--surface)] text-[var(--muted)]"
                    }`}
                  >
                    {paid ? <CrownSimple size={14} weight="fill" /> : null}
                    {planLabel}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[var(--stroke)] bg-[var(--panel-soft)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              {paid ? (
                <>
                  <Link href="/tools/url-shortener" className="btn-primary !rounded-full">
                    <LinkSimple size={16} weight="bold" />
                    Create short link
                  </Link>
                  <a
                    href={CONTACT_X_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !rounded-full"
                  >
                    Priority support
                    <ArrowSquareOut size={14} weight="bold" />
                  </a>
                </>
              ) : (
                <Link href="/pricing" className="btn-primary !rounded-full">
                  <Sparkle size={16} weight="fill" />
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>

          {paid && (billingCycle || periodEnd || seats) ? (
            <div className="relative mt-6 grid gap-3 border-t border-[var(--stroke)] pt-5 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Billing
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                  {billingCycle
                    ? `${formatInr(proUnitInr(billingCycle))} / user / ${billingCycle === "yearly" ? "year" : "month"}`
                    : "Active"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Seats
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                  {seatCap} included
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Renews
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                  {periodEnd ? formatDay(periodEnd) : "—"}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-[var(--stroke)] pb-px">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative shrink-0 rounded-t-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {t.label}
                {t.hint ? (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                      active
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "bg-[var(--surface)] text-[var(--muted)]"
                    }`}
                  >
                    {t.hint}
                  </span>
                ) : null}
              </span>
              {active ? (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--accent)]" />
              ) : null}
            </button>
          );
        })}
      </div>

      {error ? (
        <p
          className="mt-4 flex items-start gap-2 rounded-xl bg-[var(--warn-bg)] px-3 py-2 text-sm text-[var(--warn-ink)]"
          role="alert"
        >
          <WarningCircle size={18} weight="fill" />
          {error}
        </p>
      ) : null}

      <div className="mt-6">
        {tab === "overview" ? (
          <OverviewTab
            paid={paid}
            loading={loading}
            linkCount={links.length}
            totalClicks={totalClicks}
            presetCount={presets.length}
            seatsUsed={seatsUsed}
            seatCap={seatCap}
            onOpenLinks={() => setTab("links")}
            onOpenTeam={() => setTab("team")}
            onOpenAnalytics={() => setTab("analytics")}
          />
        ) : null}

        {tab === "links" ? (
          <LinksTab
            paid={paid}
            loading={loading}
            links={links}
            copied={copied}
            onCopy={async (code, key) => {
              await copyText(publicLinkUrl(code));
              markCopied(key);
            }}
          />
        ) : null}

        {tab === "analytics" ? (
          <ProAnalyticsPreview
            locked={!paid}
            liveClicks={totalClicks}
            liveLinks={links.length}
          />
        ) : null}

        {tab === "team" && paid ? (
          <TeamTab
            seatCap={seatCap}
            seatsUsed={seatsUsed}
            invites={invites}
            inviteEmail={inviteEmail}
            inviteUrl={inviteUrl}
            busy={busy}
            copied={copied}
            onInviteEmail={setInviteEmail}
            onSend={() => void sendInvite()}
            onRevoke={(id) => void revokeInvite(id)}
            onCopyInvite={async (url) => {
              await copyText(url);
              markCopied("invite");
            }}
          />
        ) : null}

        {tab === "presets" && paid ? (
          <PresetsTab
            presets={presets}
            loading={loading}
            onDelete={(id) => void deletePreset(id)}
          />
        ) : null}

        {tab === "api" && paid ? (
          <ApiTab
            keys={apiKeys}
            loading={loading}
            busy={busy}
            secret={apiSecret}
            copied={copied}
            onCreate={() => void createApiKey()}
            onRevoke={(id) => void revokeApiKey(id)}
            onDismissSecret={() => setApiSecret(null)}
            onCopySecret={async (secret) => {
              await copyText(secret);
              markCopied("api-secret");
            }}
            onCopyCurl={async () => {
              await copyText(
                `curl -X POST https://deskzy.xyz/api/links \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"url":"https://example.com"}'`,
              );
              markCopied("api-curl");
            }}
          />
        ) : null}
      </div>

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--stroke)] pt-6">
        <p className="text-xs text-[var(--muted)]">
          Signed in as <span className="text-[var(--ink)]">{email}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/pricing"
            className="inline-flex rounded-full border border-[var(--stroke)] bg-[var(--panel-soft)] px-4 py-2 text-sm font-medium hover:border-[var(--stroke-strong)]"
          >
            {paid ? "Manage plan" : "View pricing"}
          </Link>
          <SignOutButton />
        </div>
      </footer>
    </div>
  );
}

function OverviewTab({
  paid,
  loading,
  linkCount,
  totalClicks,
  presetCount,
  seatsUsed,
  seatCap,
  onOpenLinks,
  onOpenTeam,
  onOpenAnalytics,
}: {
  paid: boolean;
  loading: boolean;
  linkCount: number;
  totalClicks: number;
  presetCount: number;
  seatsUsed: number;
  seatCap: number;
  onOpenLinks: () => void;
  onOpenTeam: () => void;
  onOpenAnalytics: () => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="shell">
        <div className="shell-core p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              {paid ? "Included with Pro" : "What Pro unlocks"}
            </h2>
            {paid ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
                <CheckCircle size={14} weight="fill" />
                Active
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {paid
              ? "Everything below is available on your membership right now."
              : "Free keeps tools usable with daily PDF & image limits. Pro removes the ceiling."}
          </p>
          <ul className="mt-5 space-y-3">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    paid
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "bg-[var(--surface)] text-[var(--muted)]"
                  }`}
                >
                  {paid ? (
                    <Check size={12} weight="bold" />
                  ) : (
                    <LockSimple size={11} weight="bold" />
                  )}
                </span>
                <span className={paid ? "text-[var(--ink)]" : "text-[var(--muted)]"}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
          {!paid ? (
            <Link href="/pricing" className="btn-primary mt-6 w-full !rounded-full sm:w-auto">
              See Pro pricing
            </Link>
          ) : null}
        </div>
      </section>

      <div className="space-y-4">
        {!paid ? (
          <button
            type="button"
            onClick={onOpenAnalytics}
            className="shell w-full text-left transition hover:opacity-95"
          >
            <div className="shell-core flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-white">
                <ChartLine size={20} weight="bold" />
              </span>
              <span className="min-w-0">
                <span className="font-display text-base font-semibold tracking-tight text-[var(--ink)]">
                  Preview Pro Analytics
                </span>
                <span className="mt-1 block text-sm text-[var(--muted)]">
                  Geography, referrers, devices, and live clicks — from{" "}
                  {formatInr(proUnitInr("monthly"))}/mo
                </span>
              </span>
            </div>
          </button>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Owned links"
            value={loading ? "—" : String(linkCount)}
            onClick={onOpenLinks}
          />
          <StatCard
            label="Total clicks"
            value={loading ? "—" : String(totalClicks)}
            onClick={onOpenLinks}
          />
          {paid ? (
            <>
              <StatCard
                label="Seats used"
                value={`${seatsUsed}/${seatCap}`}
                onClick={onOpenTeam}
              />
              <StatCard label="Presets" value={loading ? "—" : String(presetCount)} />
            </>
          ) : (
            <>
              <StatCard label="PDF / day" value="2 each" muted />
              <StatCard label="Images / day" value="5 each" muted />
            </>
          )}
        </div>

        <section className="shell">
          <div className="shell-core p-5">
            <h3 className="font-display text-base font-semibold">Quick start</h3>
            <div className="mt-3 grid gap-2">
              <QuickLink href="/tools/url-shortener" label="Share a URL" icon={<LinkSimple size={16} weight="bold" />} />
              <QuickLink href="/tools/compress-pdf" label="Compress a PDF" icon={<Sparkle size={16} weight="bold" />} />
              <QuickLink href="/tools/utm-builder" label="Build a UTM link" icon={<ChartLine size={16} weight="bold" />} />
              {paid ? (
                <button
                  type="button"
                  onClick={onOpenTeam}
                  className="flex items-center gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 py-2.5 text-left text-sm font-medium transition hover:border-[var(--stroke-strong)]"
                >
                  <span className="text-[var(--accent)]">
                    <UsersThree size={16} weight="bold" />
                  </span>
                  Invite a teammate
                </button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  muted,
  onClick,
}: {
  label: string;
  value: string;
  muted?: boolean;
  onClick?: () => void;
}) {
  const className = `rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] p-4 text-left ${
    onClick ? "transition hover:border-[var(--stroke-strong)]" : ""
  }`;
  const body = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`mt-1 font-display text-2xl font-semibold tracking-tight tabular-nums ${
          muted ? "text-[var(--muted)]" : "text-[var(--ink)]"
        }`}
      >
        {value}
      </p>
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {body}
      </button>
    );
  }
  return <div className={className}>{body}</div>;
}

function QuickLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 py-2.5 text-sm font-medium transition hover:border-[var(--stroke-strong)]"
    >
      <span className="text-[var(--accent)]">{icon}</span>
      {label}
    </Link>
  );
}

function LinksTab({
  paid,
  loading,
  links,
  copied,
  onCopy,
}: {
  paid: boolean;
  loading: boolean;
  links: LinkRow[];
  copied: string | null;
  onCopy: (code: string, key: string) => Promise<void>;
}) {
  if (loading) {
    return (
      <div className="shell">
        <div className="shell-core space-y-3 p-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-[var(--surface)]/80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="shell">
        <div className="shell-core p-5 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight">
                Your shared links
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Links created while signed in are owned by you
                {paid ? " and include click analytics" : ""}.
              </p>
            </div>
            <Link href="/tools/url-shortener" className="btn-secondary !rounded-full !py-2">
              <Plus size={14} weight="bold" />
              New link
            </Link>
          </div>

          {links.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[var(--stroke)] bg-[var(--surface)]/40 px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <LinkSimple size={22} weight="bold" />
              </div>
              <p className="mt-4 font-display text-lg font-semibold">No owned links yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--muted)]">
                Share a URL while signed in to track it here
                {paid ? " with custom slugs and charts" : ""}.
              </p>
              <Link href="/tools/url-shortener" className="btn-primary mt-5 !rounded-full">
                Create your first link
              </Link>
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-[var(--stroke)]">
              {links.map((l) => (
                <li
                  key={l.code}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={publicLinkUrl(l.code)}
                        className="font-mono text-sm font-semibold text-[var(--accent-ink)] hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        yoururl.buzz/p/{l.code}
                      </a>
                      {l.is_custom ? (
                        <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                          Custom
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-xs text-[var(--muted)]">{l.dest}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-medium tabular-nums text-[var(--muted)]">
                      {l.hits} clicks
                    </span>
                    <button
                      type="button"
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--stroke)] px-3.5 py-2 text-xs font-medium hover:border-[var(--stroke-strong)] active:scale-[0.98]"
                      onClick={() => void onCopy(l.code, l.code)}
                    >
                      <CopySimple size={14} weight="bold" />
                      {copied === l.code ? "Copied" : "Copy"}
                    </button>
                    <Link
                      href={`/account/links/${encodeURIComponent(l.code)}`}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--accent)]/35 bg-[var(--accent-soft)]/50 px-3.5 py-2 text-xs font-semibold text-[var(--accent)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] active:scale-[0.98]"
                    >
                      <ChartLine size={14} weight="bold" />
                      Stats
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!paid ? (
            <div className="mt-5 flex flex-col gap-2 rounded-xl bg-[var(--accent-soft)]/60 px-3 py-3 text-sm text-[var(--accent-ink)] sm:flex-row sm:items-center sm:justify-between">
              <p>
                Want geography, referrers, and live click feeds?{" "}
                <Link
                  href="/link-analytics"
                  className="font-semibold underline-offset-2 hover:underline"
                >
                  See Pro Analytics
                </Link>
              </p>
              <Link
                href="/link-analytics#upgrade"
                className="btn-primary !rounded-full !px-4 !py-2 text-xs"
              >
                Upgrade to Pro
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function TeamTab({
  seatCap,
  seatsUsed,
  invites,
  inviteEmail,
  inviteUrl,
  busy,
  copied,
  onInviteEmail,
  onSend,
  onRevoke,
  onCopyInvite,
}: {
  seatCap: number;
  seatsUsed: number;
  invites: InviteRow[];
  inviteEmail: string;
  inviteUrl: string | null;
  busy: boolean;
  copied: string | null;
  onInviteEmail: (v: string) => void;
  onSend: () => void;
  onRevoke: (id: string) => void;
  onCopyInvite: (url: string) => Promise<void>;
}) {
  const pct = Math.min(100, Math.round((seatsUsed / Math.max(1, seatCap)) * 100));

  return (
    <section className="shell">
      <div className="shell-core p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">Team seats</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Share your Pro membership. Each invite uses one seat until revoked.
            </p>
          </div>
          <Link href="/pricing" className="text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline">
            Adjust seats
          </Link>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--stroke)] bg-[var(--surface)]/40 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--ink)]">
              {seatsUsed} of {seatCap} seats in use
            </span>
            <span className="tabular-nums text-[var(--muted)]">{pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--panel-soft)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="seat-invite-email">
            Teammate email
          </label>
          <input
            id="seat-invite-email"
            type="email"
            value={inviteEmail}
            onChange={(e) => onInviteEmail(e.target.value)}
            placeholder="teammate@company.com"
            className="field min-w-0 flex-1 !rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
          />
          <button
            type="button"
            className="btn-primary !rounded-full"
            disabled={busy || !inviteEmail.trim() || seatsUsed >= seatCap}
            onClick={onSend}
          >
            <UsersThree size={16} weight="bold" />
            {busy ? "Sending…" : "Send invite"}
          </button>
        </div>

        {inviteUrl ? (
          <div className="mt-4 flex flex-col gap-2 rounded-xl bg-[var(--ok-bg)] px-3 py-3 text-sm text-[var(--ok-ink)] sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 break-all">
              <span className="font-semibold">Invite ready.</span> Share this link with your teammate.
            </p>
            <button
              type="button"
              className="shrink-0 rounded-full border border-[var(--accent)]/30 bg-[var(--panel-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-ink)]"
              onClick={() => void onCopyInvite(inviteUrl)}
            >
              {copied === "invite" ? "Copied" : "Copy link"}
            </button>
          </div>
        ) : null}

        {invites.length === 0 ? (
          <p className="mt-6 text-sm text-[var(--muted)]">
            No invites yet. Add a teammate email above to share Pro.
          </p>
        ) : (
          <ul className="mt-6 space-y-2">
            {invites.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 py-2.5 text-sm"
              >
                <div>
                  <p className="font-medium text-[var(--ink)]">{inv.email}</p>
                  <p className="text-xs capitalize text-[var(--muted)]">{inv.status}</p>
                </div>
                {inv.status === "pending" ? (
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--warn-ink)]"
                    onClick={() => onRevoke(inv.id)}
                  >
                    Revoke
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function PresetsTab({
  presets,
  loading,
  onDelete,
}: {
  presets: PresetRow[];
  loading: boolean;
  onDelete: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className="shell">
        <div className="shell-core space-y-3 p-5">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-[var(--surface)]/80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="shell">
      <div className="shell-core p-5 md:p-6">
        <h2 className="font-display text-xl font-semibold tracking-tight">Synced presets</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Save from UTM Builder or Compress Image — they appear here across devices.
        </p>

        {presets.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[var(--stroke)] bg-[var(--surface)]/40 px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <ImageIcon size={22} weight="bold" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold">No presets saved</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--muted)]">
              Open a tool, tune your settings, and hit Save under Synced presets.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link href="/tools/utm-builder" className="btn-secondary !rounded-full !py-2">
                UTM Builder
              </Link>
              <Link href="/tools/compress-image" className="btn-secondary !rounded-full !py-2">
                Compress Image
              </Link>
            </div>
          </div>
        ) : (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {presets.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-[var(--ink)]">{p.name}</p>
                  <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{p.kind}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-[var(--warn-ink)] hover:bg-[var(--warn-bg)]"
                  aria-label={`Delete ${p.name}`}
                  onClick={() => onDelete(p.id)}
                >
                  <Trash size={16} weight="bold" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ApiTab({
  keys,
  loading,
  busy,
  secret,
  copied,
  onCreate,
  onRevoke,
  onDismissSecret,
  onCopySecret,
  onCopyCurl,
}: {
  keys: ApiKeyRow[];
  loading: boolean;
  busy: boolean;
  secret: string | null;
  copied: string | null;
  onCreate: () => void;
  onRevoke: (id: string) => void;
  onDismissSecret: () => void;
  onCopySecret: (secret: string) => Promise<void>;
  onCopyCurl: () => Promise<void>;
}) {
  return (
    <section className="shell">
      <div className="shell-core p-5 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Short-link API
            </h2>
            <p className="mt-1 max-w-xl text-sm text-[var(--muted)]">
              Create shared links from scripts with{" "}
              <code className="rounded bg-[var(--surface)] px-1 py-0.5 text-xs">
                POST /api/links
              </code>
              . Keys bypass the public IP rate limit and attach links to your account.
            </p>
          </div>
          <button
            type="button"
            className="btn-primary shrink-0 !rounded-full"
            disabled={busy || keys.length >= 5}
            onClick={onCreate}
          >
            <Key size={16} weight="bold" />
            {busy ? "Creating…" : "Generate key"}
          </button>
        </div>

        {secret ? (
          <div className="mt-5 rounded-2xl border border-[var(--accent)]/25 bg-[var(--ok-bg)] px-4 py-4 text-sm text-[var(--ok-ink)]">
            <p className="font-semibold">Copy your key now — it won&apos;t be shown again.</p>
            <code className="mt-2 block break-all rounded-xl bg-[var(--panel-soft)] px-3 py-2 font-mono text-xs text-[var(--ink)]">
              {secret}
            </code>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary !rounded-full !py-1.5 !text-xs"
                onClick={() => void onCopySecret(secret)}
              >
                {copied === "api-secret" ? (
                  <>
                    <Check size={14} weight="bold" /> Copied
                  </>
                ) : (
                  <>
                    <CopySimple size={14} weight="bold" /> Copy key
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn-secondary !rounded-full !py-1.5 !text-xs"
                onClick={onDismissSecret}
              >
                Done
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Example
            </p>
            <button
              type="button"
              className="text-xs font-semibold text-[var(--accent)]"
              onClick={() => void onCopyCurl()}
            >
              {copied === "api-curl" ? "Copied" : "Copy curl"}
            </button>
          </div>
          <pre className="mt-2 overflow-x-auto text-xs leading-relaxed text-[var(--ink)]">
{`curl -X POST https://deskzy.xyz/api/links \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com"}'`}
          </pre>
        </div>

        {loading ? (
          <div className="mt-6 space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl bg-[var(--surface)]/80"
              />
            ))}
          </div>
        ) : keys.length === 0 ? (
          <p className="mt-6 text-sm text-[var(--muted)]">
            No API keys yet. Generate one to start creating links from your scripts.
          </p>
        ) : (
          <ul className="mt-6 space-y-2">
            {keys.map((k) => (
              <li
                key={k.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-[var(--ink)]">{k.name}</p>
                  <p className="font-mono text-xs text-[var(--muted)]">
                    {k.key_prefix}…
                    {k.last_used_at
                      ? ` · last used ${formatDay(k.last_used_at)}`
                      : " · never used"}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--warn-ink)] hover:bg-[var(--warn-bg)]"
                  onClick={() => onRevoke(k.id)}
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
