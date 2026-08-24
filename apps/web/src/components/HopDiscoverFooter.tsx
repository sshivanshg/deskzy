import { SITE_URL } from "@/lib/seo/site";

/** Slim bottom credit — main discovery lives in HopDiscoverHeader. */
export function HopDiscoverFooter() {
  return (
    <footer className="mt-auto pt-5 pb-1">
      <div className="mx-auto max-w-max rounded-full border border-white/70 bg-white/55 px-4 py-2 shadow-[0_10px_25px_rgba(106,83,126,0.06)] backdrop-blur-md">
        <p className="text-center text-[11px] text-[var(--muted)]">
          <a
            href={SITE_URL}
            rel="noopener noreferrer"
            className="underline-offset-2 hover:text-[var(--ink)] hover:underline"
          >
            deskzy.xyz
          </a>
        </p>
      </div>
    </footer>
  );
}
