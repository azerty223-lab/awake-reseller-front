import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for AW Tickets — how we collect, use, and protect your personal data in accordance with GDPR and Dutch law.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://awtickets.nl"}/privacy` },
};

const CONTACT_EMAIL = "awtickets@outlook.com";
const SITE_NAME = "AW Tickets";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://awtickets.nl";
const LAST_UPDATED = "30 June 2026";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="mb-10">
    <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
    <div className="space-y-3 text-zinc-400 text-sm leading-relaxed">{children}</div>
  </section>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#06B6D4]/70 mb-3">
          Legal
        </p>
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="h-px bg-white/[0.06] mb-10" />

      {/* Intro */}
      <p className="text-zinc-400 text-sm leading-relaxed mb-10">
        {SITE_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates {SITE_URL}. This
        Privacy Policy explains what personal data we collect when you use our website, why we
        collect it, how we use it, and your rights under the General Data Protection Regulation
        (GDPR) and applicable Dutch law.
      </p>

      <Section id="who-we-are" title="1. Who We Are">
        <p>
          {SITE_NAME} is a verified resale platform for Awakenings Festival 2026 tickets.
          We are the data controller for personal data processed through this website.
        </p>
        <p>
          Contact:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#06B6D4] hover:underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </Section>

      <Section id="data-we-collect" title="2. Data We Collect">
        <p>We collect the following categories of personal data:</p>
        <ul className="list-disc list-inside space-y-2 pl-1">
          <li>
            <span className="text-zinc-300 font-medium">Account data</span> — your name and
            email address when you create an account (via email/password, Google, or Facebook).
          </li>
          <li>
            <span className="text-zinc-300 font-medium">Profile picture</span> — if you sign
            in with Google or Facebook, we may receive and store your profile photo.
          </li>
          <li>
            <span className="text-zinc-300 font-medium">Order data</span> — name, email, phone
            number, and payment details submitted during checkout.
          </li>
          <li>
            <span className="text-zinc-300 font-medium">Communication data</span> — messages
            you send through our contact form.
          </li>
          <li>
            <span className="text-zinc-300 font-medium">Technical data</span> — IP address,
            browser type, and pages visited, collected automatically for security and analytics.
          </li>
        </ul>
        <p>We do <span className="text-zinc-300 font-medium">not</span> store full payment card
        numbers. Card processing is handled entirely by Stripe.</p>
      </Section>

      <Section id="how-we-use" title="3. How We Use Your Data">
        <ul className="list-disc list-inside space-y-2 pl-1">
          <li>To create and manage your account</li>
          <li>To process your ticket purchase and send you your e-ticket</li>
          <li>To communicate order status and respond to your enquiries</li>
          <li>To detect and prevent fraud or abuse</li>
          <li>To comply with legal obligations</li>
        </ul>
      </Section>

      <Section id="legal-basis" title="4. Legal Basis for Processing (GDPR)">
        <ul className="list-disc list-inside space-y-2 pl-1">
          <li>
            <span className="text-zinc-300 font-medium">Contract</span> — processing your order
            and delivering your ticket (Art. 6(1)(b) GDPR)
          </li>
          <li>
            <span className="text-zinc-300 font-medium">Legitimate interests</span> — fraud
            prevention, security, and site analytics (Art. 6(1)(f) GDPR)
          </li>
          <li>
            <span className="text-zinc-300 font-medium">Consent</span> — social login via
            Google or Facebook, which you can withdraw at any time by deleting your account
          </li>
          <li>
            <span className="text-zinc-300 font-medium">Legal obligation</span> — retaining
            transaction records as required by Dutch tax law
          </li>
        </ul>
      </Section>

      <Section id="third-parties" title="5. Third Parties We Share Data With">
        <ul className="list-disc list-inside space-y-2 pl-1">
          <li>
            <span className="text-zinc-300 font-medium">Stripe</span> — payment processing.
            Your card data goes directly to Stripe and is never stored on our servers.
          </li>
          <li>
            <span className="text-zinc-300 font-medium">Google</span> — if you use Google
            login. Governed by Google&apos;s Privacy Policy.
          </li>
          <li>
            <span className="text-zinc-300 font-medium">Meta (Facebook)</span> — if you use
            Facebook login. Governed by Meta&apos;s Privacy Policy.
          </li>
          <li>
            <span className="text-zinc-300 font-medium">Railway / hosting provider</span> —
            our infrastructure provider processes data solely on our behalf.
          </li>
        </ul>
        <p>We do not sell your personal data to any third party.</p>
      </Section>

      <Section id="data-retention" title="6. Data Retention">
        <p>
          We retain your account data for as long as your account is active. Order and
          transaction records are retained for 7 years to comply with Dutch accounting law.
          You may request deletion of your account at any time (see Section 7).
        </p>
      </Section>

      <Section id="your-rights" title="7. Your Rights">
        <p>Under GDPR you have the right to:</p>
        <ul className="list-disc list-inside space-y-2 pl-1">
          <li><span className="text-zinc-300 font-medium">Access</span> — request a copy of your personal data</li>
          <li><span className="text-zinc-300 font-medium">Rectification</span> — correct inaccurate data</li>
          <li><span className="text-zinc-300 font-medium">Erasure</span> — request deletion of your account and associated data</li>
          <li><span className="text-zinc-300 font-medium">Portability</span> — receive your data in a structured, machine-readable format</li>
          <li><span className="text-zinc-300 font-medium">Objection</span> — object to processing based on legitimate interests</li>
          <li><span className="text-zinc-300 font-medium">Lodge a complaint</span> — with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens) at{" "}
            <span className="text-zinc-300">autoriteitpersoonsgegevens.nl</span>
          </li>
        </ul>
        <p>
          To exercise any right, email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#06B6D4] hover:underline">
            {CONTACT_EMAIL}
          </a>
          . We will respond within 30 days.
        </p>
      </Section>

      <Section id="user-data-deletion" title="8. Account & Data Deletion">
        <p>
          To delete your account and all associated personal data, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#06B6D4] hover:underline">
            {CONTACT_EMAIL}
          </a>{" "}
          with the subject line <span className="text-zinc-300">&quot;Delete my account&quot;</span>.
          We will process your request within 30 days. Note that transaction records required
          by law will be anonymised rather than deleted.
        </p>
      </Section>

      <Section id="cookies" title="9. Cookies">
        <p>
          We use only essential cookies required for authentication (session token) and
          security. We do not use advertising or tracking cookies.
        </p>
      </Section>

      <Section id="security" title="10. Security">
        <p>
          All data is transmitted over HTTPS. Passwords are hashed using bcrypt and are never
          stored in plain text. Access to our database is restricted and protected.
        </p>
      </Section>

      <Section id="changes" title="11. Changes to This Policy">
        <p>
          We may update this policy from time to time. The &quot;Last updated&quot; date at the
          top of this page will reflect any changes. Continued use of the site after changes
          constitutes acceptance of the updated policy.
        </p>
      </Section>

      <Section id="contact" title="12. Contact">
        <p>
          Questions about this policy? Contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#06B6D4] hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <div className="h-px bg-white/[0.06] mt-4 mb-8" />

      <div className="flex items-center justify-between text-xs text-zinc-600">
        <span>{SITE_NAME} © 2026</span>
        <Link href="/" className="text-[#06B6D4]/70 hover:text-[#06B6D4]">
          Back to home
        </Link>
      </div>
    </div>
  );
}
