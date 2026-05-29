export default function Testimonial() {
  return (
    <section className="relative py-30 px-13 overflow-hidden" style={{ background: 'var(--cream-warm)' }}>
      <div
        className="absolute pointer-events-none select-none font-serif leading-none"
        style={{ fontSize: 320, color: 'var(--border-light)', top: -40, left: 32, lineHeight: 1 }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="reveal relative z-10 max-w-[720px]">
        <blockquote
          className="font-serif italic font-bold leading-[1.45] tracking-[-0.015em] mb-10"
          style={{ fontSize: 32, color: 'var(--charcoal)' }}
        >
          &ldquo;I did three sessions the night before my Google interview. The questions were scarily accurate — one came up almost word for word. The feedback helped me fix answers I didn&apos;t know were weak.&rdquo;
        </blockquote>

        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-[15px] font-bold text-white flex-shrink-0"
            style={{ background: 'var(--coral)' }}
          >
            S
          </div>
          <div>
            <div className="font-sans font-bold text-[14px] mb-1" style={{ color: 'var(--charcoal)' }}>
              Sarah K.
            </div>
            <div className="font-sans text-[12px]" style={{ color: 'var(--warm-mid)' }}>
              Software Engineer — now at Google
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
