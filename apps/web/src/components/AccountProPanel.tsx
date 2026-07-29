"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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

export function AccountProPanel({ paid }: { paid: boolean }) {
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [presets, setPresets] = useState<PresetRow[]>([]);
  const [seats, setSeats] = useState(1);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    last7: { day: string; clicks: number }[];
    clicks30: number;
  } | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [linksRes, seatsRes, presetsRes] = await Promise.all([
        fetch("/api/links"),
        fetch("/api/seats"),
        paid ? fetch("/api/presets") : Promise.resolve(null),
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
        setSeats(data.seats ?? 1);
      }
      if (presetsRes?.ok) {
        const data = (await presetsRes.json()) as { presets?: PresetRow[] };
        setPresets(data.presets ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, [paid]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadStats = async (code: string) => {
    setSelectedCode(code);
    setStats(null);
    const res = await fetch(`/api/links/${encodeURIComponent(code)}/stats`);
    if (!res.ok) return;
    const data = (await res.json()) as {
      last7: { day: string; clicks: number }[];
      clicks30: number;
    };
    setStats({ last7: data.last7, clicks30: data.clicks30 });
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

  return (
    <div className="mt-8 space-y-8">
      {error ? (
        <p className="rounded-xl bg-[var(--warn-bg)] px-3 py-2 text-sm text-[var(--warn-ink)]" role="alert">
          {error}
        </p>
      ) : null}

      <section className="shell">
        <div className="shell-core p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-semibold">Your short links</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Links created while signed in appear here
                {paid ? " with click analytics" : ""}.
              </p>
            </div>
            <Link
              href="/tools/url-shortener"
              className="text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Create link
            </Link>
          </div>

          {links.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted)]">No owned links yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--stroke)]">
              {links.map((l) => (
                <li key={l.code} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <a
                      href={`/r/${l.code}`}
                      className="font-mono text-sm font-medium text-[var(--accent-ink)] hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      deskzy.xyz/r/{l.code}
                    </a>
                    <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{l.dest}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[var(--muted)]">{l.hits} clicks</span>
                    {paid ? (
                      <button
                        type="button"
                        className="font-medium text-[var(--accent)]"
                        onClick={() => void loadStats(l.code)}
                      >
                        Stats
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {paid && selectedCode && stats ? (
            <div className="mt-4 rounded-xl border border-[var(--stroke)] bg-[var(--surface)]/50 p-4">
              <p className="text-sm font-medium">
                /r/{selectedCode} · {stats.clicks30} clicks (30d)
              </p>
              <div className="mt-3 flex items-end gap-1.5">
                {stats.last7.map((d) => {
                  const max = Math.max(1, ...stats.last7.map((x) => x.clicks));
                  const h = Math.round((d.clicks / max) * 48) + 4;
                  return (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-sm bg-[var(--accent)]/80"
                        style={{ height: h }}
                        title={`${d.day}: ${d.clicks}`}
                      />
                      <span className="text-[9px] text-[var(--muted)]">{d.day.slice(8)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {!paid ? (
            <p className="mt-4 text-sm text-[var(--muted)]">
              <Link href="/pricing" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
                Upgrade to Pro
              </Link>{" "}
              for custom slugs and click charts.
            </p>
          ) : null}
        </div>
      </section>

      {paid ? (
        <>
          <section className="shell">
            <div className="shell-core p-5">
              <h2 className="font-display text-lg font-semibold">Team seats</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Invite teammates to your Pro subscription ({seats} seat{seats === 1 ? "" : "s"}).
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  className="field min-w-0 flex-1 !rounded-xl"
                />
                <button
                  type="button"
                  className="btn-primary"
                  disabled={busy || !inviteEmail.trim()}
                  onClick={() => void sendInvite()}
                >
                  {busy ? "…" : "Invite"}
                </button>
              </div>
              {inviteUrl ? (
                <p className="mt-3 break-all rounded-xl bg-[var(--ok-bg)] px-3 py-2 text-sm text-[var(--ok-ink)]">
                  Invite link: {inviteUrl}
                </p>
              ) : null}
              {invites.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm">
                  {invites.map((inv) => (
                    <li
                      key={inv.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--stroke)] px-3 py-2"
                    >
                      <span>
                        {inv.email}{" "}
                        <span className="text-[var(--muted)]">({inv.status})</span>
                      </span>
                      {inv.status === "pending" ? (
                        <button
                          type="button"
                          className="text-[var(--warn-ink)]"
                          onClick={() => void revokeInvite(inv.id)}
                        >
                          Revoke
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>

          <section className="shell">
            <div className="shell-core p-5">
              <h2 className="font-display text-lg font-semibold">Saved presets</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Save UTM or image presets from tool pages — they sync here.
              </p>
              {presets.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--muted)]">
                  No presets yet. Open{" "}
                  <Link href="/tools/utm-builder" className="text-[var(--accent)] underline-offset-2 hover:underline">
                    UTM Builder
                  </Link>{" "}
                  or{" "}
                  <Link href="/tools/compress-image" className="text-[var(--accent)] underline-offset-2 hover:underline">
                    Compress Image
                  </Link>
                  .
                </p>
              ) : (
                <ul className="mt-4 space-y-2 text-sm">
                  {presets.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-[var(--stroke)] px-3 py-2"
                    >
                      <span>
                        <span className="font-medium">{p.name}</span>{" "}
                        <span className="text-[var(--muted)]">({p.kind})</span>
                      </span>
                      <button
                        type="button"
                        className="text-[var(--warn-ink)]"
                        onClick={() => void deletePreset(p.id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
