import type { Metadata } from "next";
import Link from "next/link";
import {
  buildPageMetadata,
  CONTACT_X_HANDLE,
  CONTACT_X_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use — Deskzy",
  description:
    "Terms of use and acceptable use for Deskzy file tools and URL shortener.",
  path: "/terms",
});

const updated = "28 July 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Legal
      </p>
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Terms of Use
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">Last updated: {updated}</p>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
        By using {SITE_NAME} ({SITE_URL}) you agree to these terms. If you do
        not agree, do not use the service.
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-[var(--ink)]">
        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            1. The service
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            {SITE_NAME} provides free utility tools (PDF, image, text, links).
            Most tools run in your browser. The URL shortener uses our servers
            to store destination URLs. Features may change, rate limits may
            apply, and availability is not guaranteed.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            2. No warranty
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            The service is provided <strong className="text-[var(--ink)]">“as
            is”</strong> and <strong className="text-[var(--ink)]">“as
            available”</strong> without warranties of any kind, express or
            implied, including fitness for a particular purpose, accuracy, or
            uninterrupted operation. Always keep your own copies of important
            files. Verify outputs before relying on them for legal, medical,
            financial, or production use.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            3. Limitation of liability
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            To the maximum extent permitted by law, {SITE_NAME} and its
            operators are not liable for any indirect, incidental, special,
            consequential, or punitive damages, or for loss of data, profits, or
            goodwill, arising from your use of the tools or short links —
            including malware, phishing, or third-party sites reached via a
            shortened URL. Your sole remedy for dissatisfaction is to stop using
            the service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            4. Acceptable use (especially URL shortener)
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            You may not use {SITE_NAME} to:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--muted)]">
            <li>
              Create or distribute phishing, malware, scam, or fraud links
            </li>
            <li>
              Hide destinations that promote illegal activity, CSAM, or violent
              crime
            </li>
            <li>Harass, spam, or attack people or systems</li>
            <li>
              Circumvent rate limits, scrape aggressively, or overload the
              service
            </li>
            <li>
              Infringe copyrights, trademarks, or others’ privacy rights
            </li>
            <li>
              Misrepresent {SITE_NAME} as endorsing your content or destination
            </li>
          </ul>
          <p className="mt-2 text-[var(--muted)]">
            We may refuse, delete, or disable short links and block access
            without notice when we reasonably believe these rules are broken, or
            when required by law or infrastructure providers (e.g. Cloudflare).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            5. Your content and responsibility
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            You are solely responsible for files you process locally and for
            URLs you shorten. Short links redirect to destinations you choose;
            {SITE_NAME} does not control those third-party sites. Do not shorten
            URLs containing passwords, tokens, or other secrets.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            6. Intellectual property
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            {SITE_NAME} branding, site design, and software remain ours (or our
            licensors’). You keep ownership of your own files and URLs. Open-
            source libraries used in the product remain under their respective
            licenses.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            7. Abuse reports
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Report phishing or abusive short links via{" "}
            <a
              href={CONTACT_X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
            >
              @{CONTACT_X_HANDLE}
            </a>{" "}
            with the short URL and a brief description. We aim to act on clear
            abuse reports as quickly as practical.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            8. Indemnity
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            You agree to defend and hold harmless {SITE_NAME} and its operators
            from claims arising out of your misuse of the service, including
            shortened URLs you create or content you process.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            9. Governing law
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            These terms are governed by the laws of India, without regard to
            conflict-of-law rules, unless mandatory consumer protections in your
            country say otherwise. Courts in India have exclusive jurisdiction
            for disputes that cannot be resolved informally, subject to those
            mandatory protections.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            10. Changes
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            We may update these terms. The “Last updated” date will change.
            Continued use after an update constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            11. Privacy
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Our{" "}
            <Link
              href="/privacy"
              className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            explains data handling and is part of how we operate the service.
          </p>
        </section>
      </div>
    </div>
  );
}
