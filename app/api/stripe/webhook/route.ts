import type { Stripe } from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  if (
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    // Resolve the Supabase user from the Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (!profile) {
      // Unknown customer — skip silently (e.g. test-mode orphan)
      return NextResponse.json({ received: true })
    }

    if (event.type === 'customer.subscription.updated' && subscription.status === 'active') {
      await supabase
        .from('profiles')
        .update({ plan: 'pro', stripe_subscription_id: subscription.id, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
    }

    if (event.type === 'customer.subscription.deleted') {
      await supabase
        .from('profiles')
        .update({ plan: 'free', stripe_subscription_id: null, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
    }
  }

  return NextResponse.json({ received: true })
}
