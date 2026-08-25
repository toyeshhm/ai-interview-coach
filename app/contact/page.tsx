'use client'

import Link from 'next/link'
import { useState } from 'react'

const inputClass = 'w-full font-sans text-[13px] text-cream rounded-lg px-3.5 py-2.5 outline-none placeholder:text-[#4a4540]'
const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-dark)' }

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--charcoal)' }}>
      <header className="flex items-center justify-between px-13 h-16 border-b" style={{ borderColor: 'var(--border-dark)' }}>
        <Link href="/" className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </Link>
        <Link href="/" className="font-sans text-[13px]" style={{ color: 'var(--stone)' }}>← Back</Link>
      </header>

      <main className="max-w-[560px] mx-auto px-8 py-16">
        <h1 className="font-serif italic font-bold mb-2 tracking-[-0.02em]" style={{ fontSize: 40, color: 'var(--cream)' }}>
          Contact
        </h1>
        <p className="font-sans text-[14px] mb-10 leading-[1.7]" style={{ color: 'var(--stone)' }}>
          Questions, bugs, or feedback — we read everything. You can also email directly at{' '}
          <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a>.
        </p>

        {status === 'sent' ? (
          <div
            className="rounded-xl px-6 py-8 text-center"
            style={{ border: '1px solid rgba(201,100,66,0.25)', background: 'rgba(201,100,66,0.06)' }}
          >
            <p className="font-sans font-semibold text-[15px] text-cream mb-1">Message sent</p>
            <p className="font-sans text-[13px]" style={{ color: 'var(--stone)' }}>
              We&apos;ll get back to you at {form.email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-[12px] font-medium text-cream mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block font-sans text-[12px] font-medium text-cream mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-[12px] font-medium text-cream mb-1.5">Subject</label>
              <select
                required
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className={inputClass}
                style={{ ...inputStyle, color: form.subject ? 'var(--cream)' : '#4a4540' }}
              >
                <option value="" style={{ background: '#1c1917' }}>Select a topic</option>
                <option value="General question" style={{ background: '#1c1917' }}>General question</option>
                <option value="Bug report" style={{ background: '#1c1917' }}>Bug report</option>
                <option value="Feature request" style={{ background: '#1c1917' }}>Feature request</option>
                <option value="Privacy / data" style={{ background: '#1c1917' }}>Privacy / data</option>
                <option value="Other" style={{ background: '#1c1917' }}>Other</option>
              </select>
            </div>

            <div>
              <label className="block font-sans text-[12px] font-medium text-cream mb-1.5">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us how we can help…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </div>

            {status === 'error' && (
              <p className="font-sans text-[13px]" style={{ color: '#ef4444' }}>
                Something went wrong. Try emailing{' '}
                <a href="mailto:toyeshhm@gmail.com" style={{ color: 'var(--coral)' }}>toyeshhm@gmail.com</a> directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full font-sans font-bold text-[13px] text-white py-3 rounded-[5px] transition-colors disabled:opacity-50"
              style={{ background: 'var(--coral)' }}
              onMouseEnter={e => { if (status !== 'sending') (e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)' }}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--coral)')}
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
