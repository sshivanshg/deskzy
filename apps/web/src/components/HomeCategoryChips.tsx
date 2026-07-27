import Link from "next/link";
import { CATEGORIES } from "@/lib/tools/registry";

/** Mobile fold chips — PDF / Media / Image / Text / Links */
export function HomeCategoryChips() {
  return (
    <nav aria-label="Categories" className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((c) => (
        <Link
          key={c.id}
          href={`/${c.id}`}
          className="chip shrink-0 !text-[13px] !py-2"
        >
          {c.id === "text" ? "Text" : c.name}
        </Link>
      ))}
    </nav>
  );
}
