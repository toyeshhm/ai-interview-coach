import Stripe from 'stripe'

// Constructed lazily: `new Stripe(undefined)` throws, so doing this at module
// scope broke `next build` on any machine without STRIPE_SECRET_KEY set —
// Next evaluates route modules to collect page data at build time.
// apiVersion is intentionally omitted — the SDK pins its own tested version.
let client: Stripe | null = null

export function getStripe(): Stripe {
  if (!client) {
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    client = new Stripe(apiKey)
  }
  return client
}
