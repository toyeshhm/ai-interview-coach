import type { Stripe } from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!user.email) {
    return NextResponse.json({ error: 'User email required' }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id ?? null

  if (!customerId) {
    try {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
    } catch {
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save customer' }, { status: 500 })
    }
  }

  let subscription: Stripe.Subscription
  try {
    subscription = await getStripe().subscriptions.create({
      customer: customerId,
      items: [{ price: process.env.STRIPE_PRICE_ID! }],
      payment_behavior: 'default_incomplete',
      // Basil (2025-03-31) removed Invoice.payment_intent; the client secret now
      // comes from the invoice's confirmation_secret.
      expand: ['latest_invoice.confirmation_secret'],
    })
  } catch {
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }

  const invoice = subscription.latest_invoice as Stripe.Invoice
  const clientSecret = invoice.confirmation_secret?.client_secret

  if (!clientSecret) {
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
  }

  return NextResponse.json({
    subscriptionId: subscription.id,
    clientSecret,
  })
}
