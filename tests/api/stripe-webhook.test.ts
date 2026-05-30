import { NextRequest } from 'next/server'
import { vi, beforeEach, describe, it, expect } from 'vitest'

vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}))

// Use a module-level variable with vi.hoisted so it's available when the factory runs
const mockFrom = vi.hoisted(() =>
  vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 'user-1' }, error: null }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }),
  }))
)

vi.mock('@/lib/supabase/admin', () => ({
  supabaseAdmin: { from: mockFrom },
}))

import { stripe } from '@/lib/stripe'
import { POST } from '@/app/api/stripe/webhook/route'

function makeWebhookRequest(payload: object) {
  return new NextRequest('http://localhost/api/stripe/webhook', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'stripe-signature': 'test-sig',
      'Content-Type': 'application/json',
    },
  })
}

describe('POST /api/stripe/webhook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sets plan to pro on subscription.updated with active status', async () => {
    const event = {
      type: 'customer.subscription.updated',
      data: {
        object: { id: 'sub_123', customer: 'cus_123', status: 'active' },
      },
    }
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(event as any)

    const res = await POST(makeWebhookRequest(event))

    expect(res.status).toBe(200)
    expect(mockFrom).toHaveBeenCalledWith('profiles')
  })

  it('sets plan to free on subscription.deleted', async () => {
    const event = {
      type: 'customer.subscription.deleted',
      data: {
        object: { id: 'sub_123', customer: 'cus_123', status: 'canceled' },
      },
    }
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(event as any)

    const res = await POST(makeWebhookRequest(event))

    expect(res.status).toBe(200)
  })

  it('returns 400 when signature verification fails', async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockImplementation(() => {
      throw new Error('Invalid signature')
    })

    const res = await POST(makeWebhookRequest({}))

    expect(res.status).toBe(400)
  })
})
