import Link from 'next/link'

export const metadata = { title: 'Terms of Service — Prep.AI' }

const h2 = 'font-sans font-bold text-[16px] mb-3'
const h3 = 'font-sans font-semibold text-[14px] mb-2 mt-5'
const p = 'mb-4'
const ul = 'list-disc list-outside pl-5 space-y-1.5 mb-4'

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="font-mono text-[11px] mb-12" style={{ color: '#4a4540' }}>
          Last updated: May 30, 2026
        </p>

        <div className="space-y-10 font-sans text-[14px] leading-[1.85]" style={{ color: 'var(--stone)' }}>

          {/* 1 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>1. Acceptance of Terms</h2>
            <p className={p}>
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you and
              Prep.AI (&ldquo;Prep.AI,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) governing
              your use of the Prep.AI interview coaching platform and all related services (collectively, the
              &ldquo;Service&rdquo;).
            </p>
            <p className={p}>
              By creating an account, clicking &ldquo;I agree,&rdquo; or otherwise accessing or using the Service,
              you confirm that you have read, understood, and agree to be bound by these Terms and our{' '}
              <Link href="/privacy" style={{ color: 'var(--coral)' }}>Privacy Policy</Link>, which is incorporated
              herein by reference.
            </p>
            <p className={p}>
              If you do not agree to these Terms, you must not access or use the Service.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>2. Description of Service</h2>
            <p className={p}>
              Prep.AI is an AI-powered interview preparation platform that allows users to practice job interviews
              by submitting a resume and job description, receiving AI-generated interview questions, providing
              answers, and receiving automated feedback and scores.
            </p>
            <p className={p}>
              The Service is provided for personal, non-commercial practice and educational purposes. It is intended
              to help you prepare for real interviews — it is not a hiring platform and does not connect you with
              employers.
            </p>
            <p className={p}>
              We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time
              with or without notice, and we will not be liable to you or any third party for any such modification,
              suspension, or discontinuation.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>3. Eligibility</h2>
            <p className={p}>
              To use the Service, you must:
            </p>
            <ul className={ul}>
              <li>Be at least 13 years of age (or 16 in the EU/EEA)</li>
              <li>Have the legal capacity to enter into a binding agreement in your jurisdiction</li>
              <li>Not be prohibited from using the Service under applicable law</li>
              <li>Not have had a previous Prep.AI account terminated for violations of these Terms</li>
            </ul>
            <p className={p}>
              If you are using the Service on behalf of an organization, you represent that you have the authority
              to bind that organization to these Terms.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>4. Account Registration and Security</h2>
            <p className={p}>
              To access most features of the Service, you must create an account. You agree to:
            </p>
            <ul className={ul}>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password confidential and not share it with any third party</li>
              <li>Notify us immediately at <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a> if you suspect unauthorized access to your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
            <p className={p}>
              You may only create one account per person. Creating multiple accounts to circumvent usage limits or
              other restrictions is a violation of these Terms.
            </p>
            <p className={p}>
              We reserve the right to refuse registration or cancel accounts at our sole discretion.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>5. Acceptable Use</h2>
            <p className={p}>
              You agree to use the Service only for lawful purposes and in a manner that does not infringe upon the
              rights of others or restrict or inhibit anyone&apos;s use or enjoyment of the Service.
            </p>
            <p className={p}>You may use the Service to:</p>
            <ul className={ul}>
              <li>Practice for real job interviews</li>
              <li>Improve your interview skills through AI-generated feedback</li>
              <li>Review your session history and track progress</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>6. Prohibited Activities</h2>
            <p className={p}>You agree not to:</p>
            <ul className={ul}>
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws or regulations</li>
              <li>Submit false, misleading, defamatory, obscene, or otherwise objectionable content</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
              <li>Attempt to gain unauthorized access to any part of the Service, other accounts, or systems connected to the Service</li>
              <li>Use automated tools, bots, scrapers, or crawlers to access the Service without our written permission</li>
              <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of the Service</li>
              <li>Interfere with or disrupt the integrity or performance of the Service or its underlying infrastructure</li>
              <li>Use the Service to develop a competing product or service</li>
              <li>Circumvent any technical measures we implement to limit use of the Service</li>
              <li>Submit content that contains viruses, malware, or any other harmful code</li>
              <li>Harvest, collect, or store personal information about other users</li>
              <li>Use the Service in any manner that could impose an unreasonable or disproportionately large load on our infrastructure</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>7. Content You Submit</h2>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>7.1 Your content</h3>
            <p className={p}>
              You retain ownership of the content you submit to the Service, including your resume text, job
              descriptions, and interview answers (&ldquo;User Content&rdquo;).
            </p>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>7.2 License to Prep.AI</h3>
            <p className={p}>
              By submitting User Content, you grant Prep.AI a non-exclusive, worldwide, royalty-free, sublicensable
              license to use, store, process, and transmit your User Content solely for the purposes of providing,
              operating, and improving the Service. This includes transmitting relevant portions of your content to
              third-party AI providers (such as Google Gemini) to generate interview questions and feedback.
            </p>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>7.3 Your representations</h3>
            <p className={p}>
              You represent and warrant that: (a) you own or have the necessary rights to submit the User Content;
              (b) the User Content does not violate the rights of any third party, including intellectual property
              rights, privacy rights, or publicity rights; and (c) the User Content complies with these Terms and
              applicable law.
            </p>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>7.4 No sensitive data</h3>
            <p className={p}>
              Please do not submit sensitive personal information such as Social Security numbers, passport numbers,
              financial account numbers, medical information, or the personal data of third parties. We are not
              responsible for any consequences arising from your submission of such information.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>8. Intellectual Property</h2>
            <p className={p}>
              The Service and its original content (excluding User Content), features, functionality, design,
              trademarks, logos, and underlying technology are and will remain the exclusive property of Prep.AI
              and its licensors. These materials are protected by copyright, trademark, patent, trade secret, and
              other intellectual property laws.
            </p>
            <p className={p}>
              AI-generated content produced by the Service (interview questions, feedback, scores) is provided for
              your personal use only. You may not reproduce, distribute, or commercially exploit AI-generated content
              without our written permission.
            </p>
            <p className={p}>
              Nothing in these Terms grants you a right or license to use any of our trademarks, logos, domain
              names, or other brand features.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>9. Paid Services and Billing</h2>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>9.1 Free tier</h3>
            <p className={p}>
              Prep.AI offers a free tier that includes a limited number of interview sessions per month. Specific
              limits are described on our pricing page.
            </p>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>9.2 Paid subscriptions</h3>
            <p className={p}>
              Paid plans provide unlimited or expanded access to the Service. By subscribing, you authorize us to
              charge your payment method on a recurring basis (monthly or annually, as selected) until you cancel.
            </p>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>9.3 Billing and payment</h3>
            <ul className={ul}>
              <li>Payments are processed by Stripe. We do not store your raw payment card information.</li>
              <li>All fees are non-refundable except as required by law or as expressly stated in these Terms.</li>
              <li>We reserve the right to change pricing at any time. Price changes will be communicated at least 14 days in advance and will apply at your next renewal.</li>
              <li>If a payment fails, we may suspend your access until payment is resolved.</li>
            </ul>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>9.4 Cancellation and refunds</h3>
            <p className={p}>
              You may cancel your subscription at any time from your account settings. Cancellation takes effect at
              the end of the current billing period — you will retain access to paid features until that date. We
              do not provide prorated refunds for partial billing periods, except where required by law.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>10. AI-Generated Content Disclaimer</h2>
            <p className={p}>
              The interview questions, feedback, scores, and tips generated by the Service are produced by AI
              models and are provided for educational and practice purposes only.
            </p>
            <ul className={ul}>
              <li>AI-generated content may contain errors, inaccuracies, or outdated information.</li>
              <li>Feedback does not constitute professional career, legal, or psychological advice.</li>
              <li>We make no guarantee that using Prep.AI will result in job offers, improved performance, or any particular outcome.</li>
              <li>AI systems can reflect biases present in their training data. We encourage you to use your own judgment when evaluating feedback.</li>
            </ul>
          </section>

          {/* 11 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>11. Disclaimers of Warranties</h2>
            <p className={p}>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY
              KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND AVAILABILITY.
            </p>
            <p className={p}>
              We do not warrant that: (a) the Service will be uninterrupted, timely, secure, or error-free;
              (b) the results obtained from use of the Service will be accurate or reliable; (c) the quality of
              any products, services, information, or other material obtained through the Service will meet your
              expectations.
            </p>
            <p className={p}>
              Some jurisdictions do not allow the exclusion of implied warranties, so some of the above exclusions
              may not apply to you.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>12. Limitation of Liability</h2>
            <p className={p}>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PREP.AI, ITS DIRECTORS,
              EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA,
              USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul className={ul}>
              <li>Your access to or use of (or inability to access or use) the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
            <p className={p}>
              IN NO EVENT WILL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS RELATED TO THE SERVICE EXCEED THE GREATER
              OF (A) THE AMOUNT YOU PAID TO PREP.AI IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED
              US DOLLARS (USD $100).
            </p>
            <p className={p}>
              Some jurisdictions do not allow the limitation of liability for consequential or incidental damages,
              so the above limitation may not apply to you.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>13. Indemnification</h2>
            <p className={p}>
              You agree to defend, indemnify, and hold harmless Prep.AI and its officers, directors, employees,
              contractors, agents, licensors, and suppliers from and against any claims, liabilities, damages,
              judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees)
              arising out of or relating to:
            </p>
            <ul className={ul}>
              <li>Your violation of these Terms</li>
              <li>Your User Content</li>
              <li>Your use of the Service in a manner not authorized by these Terms</li>
              <li>Your violation of any rights of another person or entity</li>
            </ul>
          </section>

          {/* 14 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>14. Termination</h2>
            <p className={p}>
              We reserve the right to suspend or terminate your account and access to the Service at our sole
              discretion, without notice, for any reason, including but not limited to a breach of these Terms.
            </p>
            <p className={p}>
              You may terminate your account at any time by contacting us at{' '}
              <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a> or
              through account settings (when available). Upon termination, your right to use the Service ceases
              immediately.
            </p>
            <p className={p}>
              Provisions of these Terms that by their nature should survive termination will survive, including
              Sections 7 (Content), 8 (Intellectual Property), 11–13 (Disclaimers, Liability, Indemnification),
              and 15–16 (Governing Law, Disputes).
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>15. Governing Law</h2>
            <p className={p}>
              These Terms shall be governed by and construed in accordance with the laws of the State of California,
              United States, without regard to its conflict of law provisions.
            </p>
            <p className={p}>
              If you are a consumer in the EU, you may also benefit from any mandatory provisions of the laws of
              the country in which you reside.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>16. Dispute Resolution</h2>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>16.1 Informal resolution</h3>
            <p className={p}>
              Before initiating any formal dispute, you agree to first contact us at{' '}
              <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a> and
              give us 30 days to attempt to resolve the dispute informally.
            </p>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>16.2 Binding arbitration</h3>
            <p className={p}>
              For disputes that cannot be resolved informally, you and Prep.AI agree to resolve any claim, dispute,
              or controversy arising out of or relating to these Terms through binding individual arbitration
              administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules,
              rather than in court. This does not apply to users in the EU, UK, or other jurisdictions where such
              clauses are not enforceable.
            </p>

            <h3 className={h3} style={{ color: 'var(--cream)' }}>16.3 Class action waiver</h3>
            <p className={p}>
              YOU AND PREP.AI AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL
              CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>17. General Provisions</h2>
            <ul className={ul}>
              <li><strong style={{ color: 'var(--cream)' }}>Entire agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and Prep.AI regarding the Service.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Waiver:</strong> Our failure to enforce any right or provision of these Terms will not constitute a waiver of that right or provision.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign these Terms without restriction.</li>
              <li><strong style={{ color: 'var(--cream)' }}>Notices:</strong> Notices to you may be provided via email to your registered address or through the Service interface.</li>
            </ul>
          </section>

          {/* 18 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>18. Changes to These Terms</h2>
            <p className={p}>
              We reserve the right to update these Terms at any time. When we make material changes, we will notify
              you by updating the &ldquo;Last updated&rdquo; date at the top of this page and, for significant
              changes, by email to your registered address at least 14 days before the changes take effect.
            </p>
            <p className={p}>
              Your continued use of the Service after the effective date of revised Terms constitutes your acceptance
              of the changes. If you disagree with the new Terms, you must stop using the Service.
            </p>
          </section>

          {/* 19 */}
          <section>
            <h2 className={h2} style={{ color: 'var(--cream)' }}>19. Contact Us</h2>
            <p className={p}>
              If you have questions about these Terms, please contact us:
            </p>
            <ul className={ul}>
              <li>Email: <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a></li>
              <li>Contact form: <Link href="/contact" style={{ color: 'var(--coral)' }}>prepai.app/contact</Link></li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  )
}
