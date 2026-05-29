'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function InterviewSetupForm() {
  const router = useRouter()
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/interview/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription, resumeText }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.push(`/interview/${data.sessionId}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="space-y-2">
        <Label
          htmlFor="jobDescription"
          className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase block"
          style={{ color: 'var(--stone)' }}
        >
          Job Description
        </Label>
        <Textarea
          id="jobDescription"
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here…"
          className="h-44 resize-none font-sans text-[14px] rounded-[5px]"
          style={{
            background: '#211e1a',
            border: '1px solid var(--border-dark)',
            color: 'var(--cream)',
          }}
          required
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="resumeText"
          className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase block"
          style={{ color: 'var(--stone)' }}
        >
          Your Resume / Skills
        </Label>
        <Textarea
          id="resumeText"
          value={resumeText}
          onChange={e => setResumeText(e.target.value)}
          placeholder="Paste your resume or describe your key skills and experience…"
          className="h-44 resize-none font-sans text-[14px] rounded-[5px]"
          style={{
            background: '#211e1a',
            border: '1px solid var(--border-dark)',
            color: 'var(--cream)',
          }}
          required
        />
      </div>

      {error && <p className="font-sans text-[13px]" style={{ color: '#e07070' }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full font-sans font-bold text-[14px] text-white py-4 rounded-[5px] transition-colors disabled:opacity-50"
        style={{ background: 'var(--coral)' }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--coral-hover)' }}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--coral)'}
      >
        {loading ? 'Generating questions…' : 'Start interview →'}
      </button>
    </form>
  )
}
