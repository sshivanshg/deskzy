import { SITE_URL } from "@/lib/seo/site";

/** Minimal 404 on share pages — no brand logo, no shortener tool slug. */
export default function PublishedNotFound() {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
      <p className="text-sm font-medium text-[var(--muted)]">Not found</p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
        It may have expired or the code was mistyped.
      </p>
      <p className="mt-8">
        <a
          href={SITE_URL}
          className="text-sm font-medium text-[var(--accent-ink)] underline underline-offset-4"
        >
          Continue
        </a>
      </p>
    </div>
  );
}
