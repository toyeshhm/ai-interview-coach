import Stripe from 'stripe'

// apiVersion is intentionally omitted — the SDK pins its own tested version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
