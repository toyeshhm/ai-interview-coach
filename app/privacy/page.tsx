import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — Prep.AI' }

const h2 = 'font-sans font-bold text-[16px] mb-3'
const h3 = 'font-sans font-semibold text-[14px] mb-2 mt-5'
const p = 'mb-4'
const ul = 'list-disc list-outside pl-5 space-y-1.5 mb-4'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--charcoal)' }}>
      <header
        className="flex items-center justify-between px-13 h-16 border-b"
        style={{ borderColor: 'var(--border-dark)' }}
      >
        <Link
          href="/"
          className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase"
          style={{ color: 'var(--cream)' }}
        >
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </Link>
        <Link href="/" className="font-sans text-[13px]" style={{ color: 'var(--stone)' }}>
          ← Back
        </Link>
      </header>

      <main className="max-w-[720px] mx-auto px-8 py-16">
        <h1
          className="font-serif italic font-bold mb-2 tracking-[-0.02em]"
          style={{ fontSize: 40, color: 'var(--cream)' }}
        >
          Privacy Policy
        </h1>
        <p className="font-mono text-[11px] mb-12" style={{ color: '#4a4540' }}>
          Last updated: May 30, 2026
        </p>

        <div className="space-y-10 font-sans text-[14px] leading-[1.85]" style={{ color: 'var(--stone)' }}>

          {/* 1 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>1. Introduction</h2>
            <p className={p}>
              Prep.AI (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the Prep.AI interview coaching
              platform accessible at prepai.app (the &ldquo;Service&rdquo;). This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our Service.
            </p>
            <p className={p}>
              By creating an account or using the Service, you agree to the collection and use of information in
              accordance with this policy. If you do not agree, please do not use the Service.
            </p>
            <p className={p}>
              This policy applies to all users worldwide. Additional rights may apply to you depending on your
              jurisdiction — see Section 9 (Your Privacy Rights) for details.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>2. Information We Collect</h2>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>2.1 Information you provide directly</h3>
            <ul className={ul}>
              <li><strong style={{ color: 'var(--cream)' }}>Account information:</strong> When you register, we collect your email address and a hashed password (managed by Supabase Auth). You may optionally provide a display name.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Session content:</strong> Job descriptions and resume text you submit when starting an interview session.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Interview responses:</strong> The answers you type during AI-powered interview sessions.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Contact messages:</strong> Name, email, subject, and message content submitted through our contact form.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Payment information:</strong> If you subscribe to a paid plan, billing details are collected and processed by Stripe. We never store raw card numbers.</li>
            </ul>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>2.2 Information collected automatically</h3>
            <ul className={ul}>
              <li><strong style={{ color: 'var(--cream)' }}>Log data:</strong> IP address, browser type and version, pages visited, time and date of visit, time spent on pages, and referring URL.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Device information:</strong> Device type, operating system, and screen resolution.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Usage data:</strong> Features used, session start and end times, number of sessions completed, and scores received.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Cookies and similar technologies:</strong> See Section 11 (Cookies) for full details.</li>
            </ul>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>2.3 Information from third parties</h3>
            <p className={p}>
              If you sign in using a third-party OAuth provider (such as Google), we receive your name and email
              address from that provider, subject to their own privacy policies. We do not receive your password from
              third-party providers.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>3. How We Use Your Information</h2>
            <p className={p}>We use the information we collect for the following purposes:</p>
            <ul className={ul}>
              <li><strong style={{ color: 'var(--cream)' }}>Providing the Service:</strong> Generating interview questions, evaluating your answers, and producing feedback using AI models.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Account management:</strong> Creating and managing your account, authenticating your identity, and communicating service-related notices.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Personalization:</strong> Displaying your session history, scores, and progress over time.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Billing:</strong> Processing payments for paid subscriptions and managing subscription status.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Customer support:</strong> Responding to contact form submissions and support requests.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Service improvement:</strong> Analyzing aggregated, anonymized usage patterns to improve features and performance. We do not use individual interview responses to train AI models without explicit consent.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Security:</strong> Detecting, preventing, and investigating fraudulent or unauthorized activity.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Legal compliance:</strong> Complying with applicable laws and enforcing our Terms of Service.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>4. How We Share Your Information</h2>
            <p className={p}>
              We do not sell your personal data. We may share information in the following limited circumstances:
            </p>
            <ul className={ul}>
              <li><strong style={{ color: 'var(--cream)' }}>Service providers:</strong> We share data with third-party vendors who help us operate the Service (see Section 5). These parties are contractually bound to use your data only to perform services on our behalf.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Legal requirements:</strong> We may disclose your information if required to do so by law or in response to valid legal process (such as a court order or government request).</li>
              <li><strong style={{ color: 'var(--cream)' }}>Protection of rights:</strong> We may disclose information where we believe it is necessary to investigate, prevent, or take action regarding illegal activities, suspected fraud, or situations involving potential threats to safety.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Business transfers:</strong> If Prep.AI is acquired or merged with another company, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website before your data is transferred and becomes subject to a different privacy policy.</li>
              <li><strong style={{ color: 'var(--cream)' }}>With your consent:</strong> We may share your information for other purposes with your explicit consent.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>5. Third-Party Services</h2>
            <p className={p}>
              The following third-party services process data on our behalf. We encourage you to review their
              respective privacy policies:
            </p>
            <ul className={ul}>
              <li><strong style={{ color: 'var(--cream)' }}>Supabase</strong> — database, authentication, and file storage. Data stored in the United States. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral)' }}>supabase.com/privacy</a></li>
              <li><strong style={{ color: 'var(--cream)' }}>Google (Gemini API)</strong> — AI model used to generate interview questions and evaluate answers. Your resume and job description text is sent to this API during sessions. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral)' }}>policies.google.com/privacy</a></li>
              <li><strong style={{ color: 'var(--cream)' }}>Stripe</strong> — payment processing for paid subscriptions. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral)' }}>stripe.com/privacy</a></li>
              <li><strong style={{ color: 'var(--cream)' }}>Vercel</strong> — hosting and infrastructure. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral)' }}>vercel.com/legal/privacy-policy</a></li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>6. Data Retention</h2>
            <p className={p}>
              We retain your personal data for as long as your account is active or as needed to provide the Service.
              Specific retention periods:
            </p>
            <ul className={ul}>
              <li><strong style={{ color: 'var(--cream)' }}>Account data:</strong> Retained until you delete your account.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Session content and interview responses:</strong> Retained until you delete your account or request deletion of specific sessions.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Contact form submissions:</strong> Retained for up to 2 years for support purposes.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Billing records:</strong> Retained for 7 years to comply with financial regulations, even after account deletion.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Log data:</strong> Retained for up to 90 days.</li>
            </ul>
            <p className={p}>
              When you delete your account, we will delete or anonymize your personal data within 30 days, except
              where retention is required by law.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>7. Security</h2>
            <p className={p}>
              We take the security of your data seriously and implement technical and organizational measures
              appropriate to the risk, including:
            </p>
            <ul className={ul}>
              <li>Encryption of data in transit using TLS/HTTPS</li>
              <li>Encryption of data at rest in our database</li>
              <li>Row-level security policies on all database tables</li>
              <li>Password hashing using bcrypt (managed by Supabase Auth)</li>
              <li>Access controls limiting employee access to user data on a need-to-know basis</li>
            </ul>
            <p className={p}>
              No method of transmission over the Internet or method of electronic storage is 100% secure. While we
              strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute
              security. In the event of a data breach that affects your rights or freedoms, we will notify you as
              required by applicable law.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>8. International Data Transfers</h2>
            <p className={p}>
              Prep.AI is operated from the United States. If you access the Service from outside the United States,
              your information may be transferred to, stored, and processed in the United States, where data protection
              laws may differ from those in your country.
            </p>
            <p className={p}>
              For users in the European Economic Area (EEA), United Kingdom, or Switzerland, we rely on appropriate
              safeguards for international transfers, including standard contractual clauses approved by the European
              Commission where required.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>9. Your Privacy Rights</h2>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>9.1 All users</h3>
            <p className={p}>Regardless of where you are located, you have the right to:</p>
            <ul className={ul}>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate or incomplete personal data</li>
              <li>Delete your account and personal data (subject to legal retention requirements)</li>
              <li>Opt out of non-essential communications</li>
            </ul>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>9.2 EU / EEA users (GDPR)</h3>
            <p className={p}>If you are located in the EU or EEA, you additionally have the right to:</p>
            <ul className={ul}>
              <li><strong style={{ color: 'var(--cream)' }}>Data portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Restriction of processing:</strong> Request that we limit processing of your data in certain circumstances.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Object to processing:</strong> Object to processing based on legitimate interests.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Withdraw consent:</strong> Where processing is based on consent, withdraw it at any time without affecting the lawfulness of prior processing.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Lodge a complaint:</strong> File a complaint with your local data protection authority.</li>
            </ul>
            <p className={p}>
              Our legal bases for processing are: performance of a contract (providing the Service), legitimate
              interests (security, fraud prevention, service improvement), legal obligation, and consent where
              explicitly obtained.
            </p>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>9.3 California users (CCPA / CPRA)</h3>
            <p className={p}>
              California residents have the right to know what personal information we collect, disclose, or sell;
              to delete personal information; to opt out of the sale of personal information (we do not sell personal
              information); and to non-discrimination for exercising these rights.
            </p>
            <p className={p}>
              To exercise any of the above rights, contact us at{' '}
              <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a>. We will
              respond within 30 days (or 45 days for complex requests).
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>10. Children&apos;s Privacy</h2>
            <p className={p}>
              The Service is not directed to children under the age of 13 (or 16 in the EEA). We do not knowingly
              collect personal data from children. If you become aware that a child has provided us with personal data
              without parental consent, please contact us at{' '}
              <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a> and we
              will take steps to delete such information.
            </p>
          </section>

          {/* 11 */}
          <section id="cookies">
            <h2 className={h2} style={{ color: 'var(--cream)' }}>11. Cookies and Tracking Technologies</h2>
            <p className={p}>
              Cookies are small text files placed on your device by a website. We use a minimal set of cookies that
              are strictly necessary for the Service to function.
            </p>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>11.1 Cookies we use</h3>
            <ul className={ul}>
              <li>
                <strong style={{ color: 'var(--cream)' }}>sb-access-token</strong> — A JWT issued by Supabase Auth
                that keeps you signed in. This is a session cookie and is deleted when you sign out or close your
                browser. Category: Strictly Necessary.
              </li>
              <li>
                <strong style={{ color: 'var(--cream)' }}>sb-refresh-token</strong> — A long-lived token used to
                silently refresh your session. Expires after 60 days of inactivity. Category: Strictly Necessary.
              </li>
            </ul>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>11.2 What we do not use</h3>
            <p className={p}>
              We do <strong style={{ color: 'var(--cream)' }}>not</strong> use advertising cookies, third-party
              analytics cookies (such as Google Analytics), tracking pixels, or any technology that tracks you across
              other websites.
            </p>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>11.3 Managing cookies</h3>
            <p className={p}>
              Because we only use strictly necessary cookies, disabling them will prevent the Service from functioning.
              You can clear cookies at any time through your browser settings. Doing so will sign you out.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>12. Changes to This Policy</h2>
            <p className={p}>
              We may update this Privacy Policy from time to time. When we make material changes, we will notify you
              by updating the &ldquo;Last updated&rdquo; date at the top of this page and, where required by law, by
              sending an email notification to your registered address at least 14 days before the changes take effect.
            </p>
            <p className={p}>
              Your continued use of the Service after the effective date of a revised policy constitutes your
              acceptance of the changes. If you disagree with the changes, you may delete your account before they
              take effect.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>13. Contact Us</h2>
            <p className={p}>
              If you have questions about this Privacy Policy, want to exercise your rights, or have a privacy
              concern, please contact us:
            </p>
            <ul className={ul}>
              <li>Email: <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a></li>
              <li>Contact form: <Link href="/contact" style={{ color: 'var(--coral)' }}>prepai.app/contact</Link></li>
            </ul>
            <p className={p}>
              We aim to respond to all privacy inquiries within 5 business days.
            </p>
          </section>

        </div>
      </main>
    </div>
  )
}
