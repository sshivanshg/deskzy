import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools/registry";

export function HomePopularStrip({ tools }: { tools: ToolDefinition[] }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold tracking-tight">Popular</h2>
      <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tools.slice(0, 6).map((t) => (
          <Link
            key={t.slug}
            href={`/tools/${t.slug}`}
            className="w-[9.5rem] shrink-0 rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-3.5 py-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {t.category}
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug text-[var(--ink)]">
              {t.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
