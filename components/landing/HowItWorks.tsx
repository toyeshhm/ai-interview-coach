'use client'

const STEPS = [
  {
    num: '01',
    title: 'Paste your resume\n& job description',
    body: 'Drop in both. The AI reads your experience alongside the actual job posting and maps exactly what the interviewer will want to probe.',
    asideLabel: 'What you bring',
    asideBody: 'Your resume in any format. The job description from the posting. No templates, no setup.',
  },
  {
    num: '02',
    title: 'Answer tailored\nquestions',
    body: "Behavioral, technical, and situational — questions calibrated to your background and the seniority of the role you're targeting.",
    asideLabel: 'Question types',
    asideBody: "Behavioral drawn from your specific past experience. Technical or system design matched to the role's stack and scope.",
  },
  {
    num: '03',
    title: 'Get scored,\nget better',
    body: 'Every answer is scored 1–10 with written feedback. After the session, one sharp improvement tip per answer — specific to what you said.',
    asideLabel: 'What you get',
    asideBody: 'A score per answer. Written feedback on what was strong and what to fix. Your overall score saved to session history.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-30 px-13" style={{ background: 'var(--cream)' }}>
      <div
        className="reveal flex items-end justify-between mb-18 pb-7"
        style={{ borderBottom: '1px solid var(--border-light)' }}
      >
        <h2
          className="font-serif italic font-bold leading-[1.05] tracking-[-0.02em]"
          style={{ fontSize: 46, color: 'var(--charcoal)' }}
        >
          Three steps to<br />your next offer.
        </h2>
        <p className="font-sans text-[13px] text-right max-w-[240px] leading-[1.7]" style={{ color: 'var(--warm-mid)' }}>
          No courses. No flashcards. Deliberate practice matched to the actual job.
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--border-light)' }}>
        {STEPS.map(step => (
          <div
            key={step.num}
            className="reveal group grid items-start py-13 -mx-13 px-13 transition-colors duration-200"
            style={{
              gridTemplateColumns: '80px 1fr 1fr',
              gap: '0 48px',
              borderBottom: '1px solid var(--border-light)',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--cream-warm)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <div
              className="font-serif font-black leading-none select-none -mt-2"
              style={{ fontSize: 64, color: 'var(--border-light)' }}
            >
              {step.num}
            </div>

            <div>
              <h3
                className="font-sans font-bold text-[20px] leading-[1.25] tracking-[-0.01em] mb-2.5"
                style={{ color: 'var(--charcoal)' }}
              >
                {step.title.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h3>
              <p className="font-sans text-[14px] leading-[1.8] max-w-[320px]" style={{ color: 'var(--warm-mid)' }}>
                {step.body}
              </p>
            </div>

            <div className="pl-12" style={{ borderLeft: '1px solid var(--border-light)' }}>
              <div
                className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase mb-2.5"
                style={{ color: 'var(--stone)' }}
              >
                {step.asideLabel}
              </div>
              <p className="font-sans text-[13px] leading-[1.75]" style={{ color: 'var(--warm-mid)' }}>
                {step.asideBody}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
