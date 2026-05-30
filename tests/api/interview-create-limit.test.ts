import { NextRequest } from 'next/server'
import { vi, beforeEach, describe, it, expect } from 'vitest'

vi.mock('@/lib/supabase/server')
vi.mock('@/lib/claude/generateQuestions', () => ({
  generateQuestions: vi.fn().mockResolvedValue([
    { question_text: 'Tell me about yourself', order_index: 1 },
  ]),
}))

import { createClient } from '@/lib/supabase/server'
import { POST } from '@/app/api/interview/create/route'

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/interview/create', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function makeSupabaseMock({
  plan,
  sessionCount,
  insertedSession = { id: 'session-1' },
}: {
  plan: 'free' | 'pro'
  sessionCount: number
  insertedSession?: object
}) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-1', email: 'test@example.com' } },
      }),
    },
    from: vi.fn((table: string) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: { plan }, error: null }),
        }
      }
      if (table === 'sessions') {
        return {
          select: vi.fn().mockImplementation((_cols: string, opts?: { count?: string }) => {
            if (opts?.count === 'exact') {
              return {
                eq: vi.fn().mockResolvedValue({ count: sessionCount, error: null }),
              }
            }
            return {
              single: vi.fn().mockResolvedValue({ data: insertedSession, error: null }),
            }
          }),
          insert: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        }
      }
      if (table === 'questions') {
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
        }
      }
    }),
  }
}

describe('POST /api/interview/create — session limit', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 403 session_limit_reached when free user has 5 sessions', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock({ plan: 'free', sessionCount: 5 }) as any)

    const res = await POST(makeRequest({ jobDescription: 'Engineer', resumeText: 'My resume' }))

    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toBe('session_limit_reached')
  })

  it('allows a free user with 4 sessions to create another', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock({ plan: 'free', sessionCount: 4 }) as any)

    const res = await POST(makeRequest({ jobDescription: 'Engineer', resumeText: 'My resume' }))

    expect(res.status).toBe(200)
  })

  it('allows a pro user regardless of session count', async () => {
    vi.mocked(createClient).mockResolvedValue(makeSupabaseMock({ plan: 'pro', sessionCount: 99 }) as any)

    const res = await POST(makeRequest({ jobDescription: 'Engineer', resumeText: 'My resume' }))

    expect(res.status).toBe(200)
  })
})
