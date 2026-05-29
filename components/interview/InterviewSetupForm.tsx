'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description</Label>
        <Textarea
          id="jobDescription"
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          className="h-44 resize-none"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resumeText">Your Resume / Skills</Label>
        <Textarea
          id="resumeText"
          value={resumeText}
          onChange={e => setResumeText(e.target.value)}
          placeholder="Paste your resume or describe your key skills and experience..."
          className="h-44 resize-none"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Generating Questions...' : 'Start Interview →'}
      </Button>
    </form>
  )
}
