import Link from "next/link";
import { CATEGORIES } from "@/lib/tools/registry";

/** Mobile fold chips — Links first, then PDF / Image / Media / Text */
const CHIP_ORDER = ["links", "pdf", "image", "media", "text"] as const;

export function HomeCategoryChips() {
  const ordered = CHIP_ORDER.map(
    (id) => CATEGORIES.find((c) => c.id === id)!,
  ).filter(Boolean);

  return (
    <nav aria-label="Categories" className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {ordered.map((c) => (
        <Link
          key={c.id}
          href={`/${c.id}`}
          className={`chip shrink-0 !text-[13px] !py-2 ${
            c.id === "links"
              ? "!border-[var(--accent)]/35 !bg-[var(--accent-soft)] !text-[var(--accent-ink)]"
              : ""
          }`}
        >
          {c.id === "text" ? "Text" : c.name}
        </Link>
      ))}
    </nav>
  );
}
