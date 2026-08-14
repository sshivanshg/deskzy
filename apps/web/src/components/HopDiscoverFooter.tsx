import { SITE_URL } from "@/lib/seo/site";

/** Slim bottom credit — main discovery lives in HopDiscoverHeader. */
export function HopDiscoverFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--stroke)] pt-5 pb-1">
      <p className="text-center text-[11px] text-[var(--muted)]">
        <a
          href={SITE_URL}
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-[var(--ink)] hover:underline"
        >
          deskzy.xyz
        </a>
      </p>
    </footer>
  );
}
