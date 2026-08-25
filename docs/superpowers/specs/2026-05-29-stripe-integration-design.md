# Stripe Integration Design

**Date:** 2026-05-29  
**Status:** Approved  

## Overview

Add a freemium billing layer to Prep.AI using Stripe. Free users get 5 interview sessions; Pro users ($9/month) get unlimited. Payment is handled via an embedded Stripe Payment Element that expands inline on the `/interview/new` page when the limit is reached.

---

## Plans

| Plan | Sessions | Price |
|------|----------|-------|
| Free | 5 (lifetime) | $0 |
| Pro  | Unlimited | $9/month |

---

## Architecture

```
Supabase profiles table
  └─ tracks plan ('free' | 'pro'), stripe_customer_id, stripe_subscription_id

/interview/new (server component)
  └─ fetches plan + session count at render time
  └─ renders setup form OR inline upgrade card

Upgrade card → "Upgrade for $9/month" clicked
  └─ POST /api/stripe/create-subscription
       └─ creates/retrieves Stripe Customer
       └─ creates Subscription (payment_behavior: 'default_incomplete')
       └─ returns { clientSecret }
  └─ Stripe Payment Element renders inline with clientSecret

User pays → Stripe fires webhook
  └─ POST /api/stripe/webhook (excluded from auth middleware)
       └─ verifies Stripe signature
       └─ customer.subscription.updated (active) → plan='pro'
       └─ customer.subscription.deleted → plan='free'

/api/interview/create (modified)
  └─ pro users: no limit check
  └─ free users: count sessions, 403 if >= 5
```

---

## Database

New migration — `profiles` table:

```sql
create table profiles (
  id                      uuid primary key references auth.users on delete cascade,
  plan                    text not null default 'free',
  stripe_customer_id      text,
  stripe_subscription_id  text,
  updated_at              timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users read/write own profile"
  on profiles for all using (auth.uid() = id);

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

Existing users without a profile row are treated as `plan='free'` — no breakage.

---

## Environment Variables

| Variable | Side |
|----------|------|
| `STRIPE_SECRET_KEY` | Server only |
| `STRIPE_WEBHOOK_SECRET` | Server only |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client |

---

## New Files

### `lib/stripe.ts`
Stripe server client singleton. Initialised with `STRIPE_SECRET_KEY`.

### `app/api/stripe/create-subscription/route.ts`
`POST` — authenticated.  
1. Look up or create a Stripe Customer for the user (store `stripe_customer_id` in `profiles`).  
2. Create a Subscription with `payment_behavior: 'default_incomplete'` and `expand: ['latest_invoice.payment_intent']`.  
3. Return `{ subscriptionId, clientSecret }`.

### `app/api/stripe/webhook/route.ts`
`POST` — unauthenticated (called by Stripe).  
- Verify signature with `STRIPE_WEBHOOK_SECRET`.  
- Resolve user: every event carries a `customer` ID — look up the matching row in `profiles` by `stripe_customer_id` to get the Supabase `user_id`. Skip the event if no match (e.g. test-mode customers).  
- Handle `customer.subscription.updated`: if `status === 'active'`, set `plan='pro'` and save `stripe_subscription_id`.  
- Handle `customer.subscription.deleted`: set `plan='free'`, clear `stripe_subscription_id`.

### `components/interview/UpgradeCard.tsx`
Client component. Two internal states:
- **Limit state**: shows plan badge, $9/month pricing, feature list, "Upgrade" button.
- **Payment state**: shown after clicking Upgrade; renders `<PaymentElement>` from `@stripe/react-stripe-js` wrapped in `<Elements>` with the `clientSecret` fetched from `/api/stripe/create-subscription`. On success, redirects to `/dashboard?upgraded=true`.

### `components/dashboard/UsageBanner.tsx`
Shown in the dashboard header and at the top of `/interview/new` for free users who still have sessions remaining. Displays "X of 5 sessions used" with a coral progress bar and an "Upgrade →" link.

---

## Modified Files

### `app/interview/new/page.tsx`
Fetch `profiles` + session count server-side.  
- `plan === 'pro'` → render `<InterviewSetupForm>` as normal.  
- `plan === 'free' && count < 5` → render `<UsageBanner>` + `<InterviewSetupForm>`.  
- `plan === 'free' && count >= 5` → render `<UpgradeCard>` only.

### `app/dashboard/page.tsx`
- Add `<UsageBanner>` for free users.  
- If `?upgraded=true` query param present, show a one-time success toast ("You're now on Pro!").

### `app/api/interview/create/route.ts`
After auth check, before inserting the session:
```ts
const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
if (profile?.plan !== 'pro') {
  const { count } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: 'session_limit_reached' }, { status: 403 })
  }
}
```

### `middleware.ts`
Exclude `/api/stripe/webhook` from the auth check — Stripe cannot send a user session cookie.

---

## New Packages

```
stripe                    (server)
@stripe/stripe-js         (client)
@stripe/react-stripe-js   (client)
```

---

## UX States Summary

| User state | `/interview/new` shows |
|------------|------------------------|
| Pro | Setup form |
| Free, < 5 sessions | Usage banner + setup form |
| Free, 5 sessions used | Upgrade card |
| Free, clicked Upgrade | Upgrade card → payment form inline |
| Just upgraded | Redirect to `/dashboard?upgraded=true` |

---

## Out of Scope

- Annual pricing / discounts
- Team/multi-seat plans
- Stripe Customer Portal (subscription management UI)
- Invoice history
