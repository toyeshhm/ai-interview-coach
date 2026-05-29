'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function AuthForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<'login' | 'signup'>(
    searchParams.get('tab') === 'login' ? 'login' : 'signup'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleForgotPassword() {
    if (!email) { setError('Enter your email first.'); return }
    setLoading(true)
    setError('')
    await supabase.auth.resetPasswordForEmail(email)
    setResetSent(true)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (tab === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      if (!data.session) { setConfirmationSent(true); setLoading(false); return }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left — brand panel */}
      <div
        className="grid-bg relative hidden md:flex flex-col justify-between p-14 overflow-hidden"
        style={{ backgroundColor: 'var(--charcoal)' }}
      >
        {/* Glow */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(201,100,66,0.1) 0%, transparent 60%)',
            bottom: -150, right: -100,
          }}
        />
        {/* Logo */}
        <div className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase relative z-10" style={{ color: 'var(--cream)' }}>
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </div>
        {/* Headline */}
        <div className="relative z-10">
          <h1
            className="font-serif italic font-black leading-[0.97] tracking-[-0.03em] text-cream mb-6"
            style={{ fontSize: 'clamp(42px, 4vw, 58px)' }}
          >
            Your next offer<br />
            starts{' '}
            <span style={{ color: 'var(--coral)', fontStyle: 'normal' }}>here.</span>
          </h1>
          <div className="flex flex-col gap-2">
            {[
              'Tailored questions from your actual resume',
              'Scored answers with specific feedback',
              'Session history to track improvement',
            ].map(item => (
              <div key={item} className="flex items-baseline gap-3 font-sans text-[13px] font-light" style={{ color: 'var(--stone)' }}>
                <span style={{ color: 'var(--coral)', fontSize: 11 }}>—</span>
                {item}
              </div>
            ))}
          </div>
        </div>
        {/* Bottom note */}
        <p className="font-mono text-[11px] tracking-[0.06em] relative z-10" style={{ color: '#4a4540' }}>
          No credit card required
        </p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-14" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="w-full max-w-[380px]">
          {confirmationSent ? (
            <div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(201,100,66,0.1)', border: '1px solid rgba(201,100,66,0.2)' }}
              >
                <span style={{ color: 'var(--coral)', fontSize: 18 }}>✉</span>
              </div>
              <h2 className="font-serif italic font-bold mb-3 tracking-[-0.01em]" style={{ fontSize: 28, color: 'var(--charcoal)' }}>
                Check your email.
              </h2>
              <p className="font-sans text-[14px] leading-[1.7] mb-6" style={{ color: 'var(--warm-mid)' }}>
                We sent a confirmation link to <strong style={{ color: 'var(--charcoal)' }}>{email}</strong>. Click it to activate your account, then sign in.
              </p>
              <button
                onClick={() => { setConfirmationSent(false); setTab('login'); setPassword('') }}
                className="font-sans font-semibold text-[13px] transition-colors"
                style={{ color: 'var(--coral)' }}
              >
                Back to sign in →
              </button>
            </div>
          ) : (
          <>
          {/* Tab switcher */}
          <div className="flex mb-10 border-b" style={{ borderColor: 'var(--border-light)' }}>
            {(['signup', 'login'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className="font-sans font-semibold text-[13px] pb-3 mr-6 border-b-2 transition-colors"
                style={{
                  color: tab === t ? 'var(--charcoal)' : 'var(--warm-mid)',
                  borderBottomColor: tab === t ? 'var(--coral)' : 'transparent',
                }}
              >
                {t === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            ))}
          </div>

          <h2
            className="font-serif italic font-bold mb-8 tracking-[-0.01em]"
            style={{ fontSize: 28, color: 'var(--charcoal)' }}
          >
            {tab === 'login' ? 'Welcome back.' : 'Start practicing.'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-sans text-[13px] font-medium" style={{ color: 'var(--warm-mid)' }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="font-sans text-[14px] h-11 rounded-[5px]"
                style={{ borderColor: 'var(--border-light)', background: 'white' }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-sans text-[13px] font-medium" style={{ color: 'var(--warm-mid)' }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="font-sans text-[14px] h-11 rounded-[5px]"
                style={{ borderColor: 'var(--border-light)', background: 'white' }}
              />
            </div>
            {error && <p className="font-sans text-[13px]" style={{ color: '#c0392b' }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-sans font-bold text-[14px] text-white py-3 rounded-[5px] transition-colors disabled:opacity-60 mt-2"
              style={{ background: 'var(--coral)' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)' }}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--coral)'}
            >
              {loading ? 'Loading…' : tab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {tab === 'login' && (
            <div className="mt-4 text-center">
              {resetSent ? (
                <p className="font-sans text-[13px]" style={{ color: 'var(--warm-mid)' }}>
                  Reset link sent — check your email.
                </p>
              ) : forgotMode ? (
                <div className="space-y-3">
                  <p className="font-sans text-[13px]" style={{ color: 'var(--warm-mid)' }}>
                    Enter your email above, then:
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="font-sans font-semibold text-[13px] disabled:opacity-50"
                      style={{ color: 'var(--coral)' }}
                    >
                      {loading ? 'Sending…' : 'Send reset link'}
                    </button>
                    <button
                      onClick={() => { setForgotMode(false); setError('') }}
                      className="font-sans text-[13px]"
                      style={{ color: 'var(--warm-mid)' }}
                    >
                      Cancel
                    </button>
                  </div>
                  {error && <p className="font-sans text-[12px]" style={{ color: '#c0392b' }}>{error}</p>}
                </div>
              ) : (
                <button
                  onClick={() => { setForgotMode(true); setError('') }}
                  className="font-sans text-[13px] transition-colors"
                  style={{ color: 'var(--warm-mid)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--charcoal)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--warm-mid)')}
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          <p className="font-sans text-[13px] text-center mt-6" style={{ color: 'var(--warm-mid)' }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setForgotMode(false); setResetSent(false); setError('') }}
              className="font-semibold transition-colors"
              style={{ color: 'var(--coral)' }}
            >
              {tab === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
