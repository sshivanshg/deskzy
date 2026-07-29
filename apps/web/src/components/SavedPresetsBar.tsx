"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Preset = {
  id: string;
  name: string;
  payload: Record<string, unknown>;
};

type Props = {
  kind: "utm" | "image";
  current: Record<string, string>;
  onApply: (payload: Record<string, string>) => void;
};

export function SavedPresetsBar({ kind, current, onApply }: Props) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [isPro, setIsPro] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/presets?kind=${kind}`);
      if (res.status === 401) {
        setIsPro(false);
        setPresets([]);
        return;
      }
      if (!res.ok) return;
      const data = (await res.json()) as {
        presets?: Preset[];
        plan?: string;
      };
      setPresets(data.presets ?? []);
      setIsPro(data.plan === "pro" || data.plan === "business");
    } catch {
      /* ignore */
    }
  }, [kind]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!name.trim() || busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: name.trim(),
          payload: current,
        }),
      });
      const data = (await res.json()) as { error?: string; upgradeUrl?: string };
      if (res.status === 401) {
        setMsg("Log in to save presets");
        return;
      }
      if (res.status === 402) {
        setMsg("Pro required to sync presets");
        setIsPro(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Save failed");
      setName("");
      setMsg("Saved");
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-[var(--stroke)] bg-[var(--surface)]/40 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Synced presets · Pro
        </p>
        {isPro === false ? (
          <Link
            href="/pricing"
            className="text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            Upgrade
          </Link>
        ) : null}
      </div>

      {presets.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              onClick={() => {
                const payload: Record<string, string> = {};
                for (const [k, v] of Object.entries(p.payload || {})) {
                  if (v != null) payload[k] = String(v);
                }
                onApply(payload);
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Preset name"
          className="field min-w-0 flex-1 !rounded-xl !py-2 !text-sm"
        />
        <button
          type="button"
          className="btn-secondary !py-2 !text-sm"
          disabled={busy || !name.trim()}
          onClick={() => void save()}
        >
          Save
        </button>
      </div>
      {msg ? <p className="mt-1.5 text-xs text-[var(--muted)]">{msg}</p> : null}
    </div>
  );
}
