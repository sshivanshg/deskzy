import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function ShortLinkNotFound() {
  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-4 py-8 sm:px-6">
      <BrandLogo priority />
      <div className="flex flex-1 flex-col justify-center py-12">
        <p className="text-sm font-medium text-[var(--muted)]">Link not found</p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">
          This short link doesn&apos;t exist
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          It may have expired or the code was mistyped. Create a new short link
          in a few seconds.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/tools/url-shortener" className="btn-primary min-h-12">
            Shorten a URL
          </Link>
          <Link href="/" className="btn-secondary min-h-12">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
