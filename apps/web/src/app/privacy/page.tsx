import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import {
  buildOrganizationJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/json-ld";
import {
  buildPageMetadata,
  CONTACT_X_HANDLE,
  CONTACT_X_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/site";

const PRIVACY_DESCRIPTION =
  "Deskzy privacy policy: browser-first PDF and image tools that do not upload your files, what we store for short links, analytics, cookies, and how to contact us.";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy — Deskzy",
  description: PRIVACY_DESCRIPTION,
  path: "/privacy",
});

const updated = "28 July 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <JsonLd
        data={[
          buildOrganizationJsonLd(),
          buildWebPageJsonLd({
            name: "Privacy Policy",
            description: PRIVACY_DESCRIPTION,
            path: "/privacy",
          }),
        ]}
      />
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        Legal
      </p>
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">Last updated: {updated}</p>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
        This policy explains what {SITE_NAME} ({SITE_URL}) collects, why, and
        what we do not collect. It is written for a privacy-first toolkit — not
        a data business.
      </p>

      <div className="prose-legal mt-10 space-y-8 text-sm leading-relaxed text-[var(--ink)]">
        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            1. Who we are
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            {SITE_NAME} is an online toolkit for PDF, image, text, and link
            utilities. Contact for privacy questions:{" "}
            <a
              href={CONTACT_X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
            >
              @{CONTACT_X_HANDLE} on X
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            2. Browser tools (most of the product)
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Tools labeled “Stays in browser” process files and text locally in
            your device using Web APIs and WASM. Those inputs are{" "}
            <strong className="font-semibold text-[var(--ink)]">
              not uploaded
            </strong>{" "}
            to {SITE_NAME} servers. We cannot read, store, or sell the contents
            of those files because they never reach us.
          </p>
          <p className="mt-2 text-[var(--muted)]">
            Downloads you create stay on your device unless you choose to share
            them elsewhere.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            3. URL shortener (hybrid tool)
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            When you use the URL shortener, only the destination URL string is
            sent to our edge API and stored in Cloudflare KV so redirects can
            work. We store: short code, destination URL, and creation time. We
            do not require an account.
          </p>
          <p className="mt-2 text-[var(--muted)]">
            Short links may expire after a retention period (typically up to 12
            months) and may be removed earlier for abuse, legal requests, or
            operational reasons. Do not put secrets in URLs you shorten.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            4. Server logs and infrastructure
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Hosting (Cloudflare) may automatically process technical data such
            as IP address, user agent, request path, and timestamps to operate
            the service, prevent abuse, and diagnose outages. We do not sell
            this data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            5. Analytics
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            If Google Analytics (GA4) is enabled, it may collect usage metrics
            (pages viewed, approximate location derived from IP, device/browser
            type). When enabled, we configure IP anonymization where supported.
            Analytics is optional for product improvement and is not required to
            use browser tools. See Google’s policies for how Google processes
            data as a processor/controller for Analytics.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            6. Cookies and similar technologies
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Essential operation of the site does not require login cookies.
            Third-party analytics (if enabled) may set cookies or use local
            storage. You can block cookies in your browser; browser tools will
            still work.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            7. What we do not do
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--muted)]">
            <li>We do not sell your files or personal data.</li>
            <li>We do not run ads against your document contents.</li>
            <li>We do not require signup to use browser tools.</li>
            <li>
              We do not claim absolute anonymity — network providers and your
              device still see traffic you initiate.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            8. Legal bases and regions
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            Depending on where you live, data protection laws such as India’s
            Digital Personal Data Protection Act, the EU/UK GDPR, or similar
            rules may apply. We process short-link and technical data to provide
            the service you request, keep it secure, and (where enabled) measure
            aggregate usage. You may contact us to ask about access, correction,
            or deletion of short links you created, subject to verification and
            technical limits (we may not be able to identify you if you did not
            create an account).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            9. Children
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            {SITE_NAME} is not directed at children under 13 (or the minimum age
            in your region). Do not use the shortener to store personal data
            about children.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            10. Changes
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            We may update this policy. The “Last updated” date above will
            change. Continued use after updates means you accept the revised
            policy. Material changes to how we handle uploaded server-side data
            will be reflected here.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            11. Related
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            See also our{" "}
            <Link
              href="/terms"
              className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
            >
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link
              href="/about"
              className="font-medium text-[var(--ink)] underline-offset-4 hover:underline"
            >
              About
            </Link>{" "}
            page.
          </p>
        </section>
      </div>
    </div>
  );
}
