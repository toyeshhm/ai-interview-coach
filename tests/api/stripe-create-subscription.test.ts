import { NextRequest } from 'next/server'
import { vi, beforeEach, describe, it, expect } from 'vitest'

vi.mock('@/lib/supabase/server')
vi.mock('@/lib/stripe', () => ({
  stripe: {
    customers: {
      create: vi.fn().mockResolvedValue({ id: 'cus_test123' }),
    },
    subscriptions: {
      create: vi.fn().mockResolvedValue({
        id: 'sub_test123',
        latest_invoice: {
          payment_intent: {
            client_secret: 'pi_test_secret',
          },
        },
      }),
    },
  },
}))

import { createClient } from '@/lib/supabase/server'
import { POST } from '@/app/api/stripe/create-subscription/route'

describe('POST /api/stripe/create-subscription', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns clientSecret and subscriptionId for authenticated user', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'test@example.com' } },
        }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { stripe_customer_id: null }, error: null }),
        update: vi.fn().mockReturnThis(),
      })),
    } as any)

    const req = new NextRequest('http://localhost/api/stripe/create-subscription', {
      method: 'POST',
    })
    const res = await POST(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.clientSecret).toBe('pi_test_secret')
    expect(body.subscriptionId).toBe('sub_test123')
  })

  it('returns 401 for unauthenticated request', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as any)

    const req = new NextRequest('http://localhost/api/stripe/create-subscription', {
      method: 'POST',
    })
    const res = await POST(req)

    expect(res.status).toBe(401)
  })
})
