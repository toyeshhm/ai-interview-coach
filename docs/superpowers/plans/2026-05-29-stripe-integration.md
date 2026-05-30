# Stripe Freemium Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Stripe-powered freemium billing — 5 free sessions, then $9/month for unlimited — with an embedded Stripe Payment Element that expands inline on `/interview/new`.

**Architecture:** A new `profiles` Supabase table tracks each user's `plan` (`free`/`pro`) and Stripe IDs. `/api/interview/create` gates session creation server-side. A webhook at `/api/stripe/webhook` updates the profile on Stripe subscription events. The `UpgradeCard` client component calls `/api/stripe/create-subscription` to get a `clientSecret`, then renders `<PaymentElement>` from `@stripe/react-stripe-js`.

**Tech Stack:** `stripe` (server), `@stripe/stripe-js` + `@stripe/react-stripe-js` (client), Supabase (postgres + RLS), Next.js 15 App Router, Vitest + React Testing Library.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `types/index.ts` | Modify | Add `Profile` type |
| `supabase/migrations/20260529000000_profiles.sql` | Create | `profiles` table + trigger |
| `lib/stripe.ts` | Create | Stripe server singleton |
| `lib/supabase/admin.ts` | Create | Service-role Supabase client (bypasses RLS — webhook-only) |
| `app/api/stripe/create-subscription/route.ts` | Create | Create Stripe customer + subscription, return `clientSecret` |
| `app/api/stripe/webhook/route.ts` | Create | Handle subscription lifecycle events |
| `middleware.ts` | Modify | Exclude `/api/stripe/webhook` from auth |
| `app/api/interview/create/route.ts` | Modify | Gate free users at 5 sessions |
| `components/dashboard/UsageBanner.tsx` | Create | "X of 5 sessions" progress bar for free users |
| `components/interview/UpgradeCard.tsx` | Create | Limit card + inline Stripe Payment Element |
| `app/interview/new/page.tsx` | Modify | Conditionally render form or `UpgradeCard` |
| `app/dashboard/page.tsx` | Modify | Add `UsageBanner` + upgrade success banner |
| `tests/api/interview-create-limit.test.ts` | Create | Session limit gate tests |
| `tests/api/stripe-webhook.test.ts` | Create | Webhook handler tests |
| `tests/components/UsageBanner.test.tsx` | Create | Usage banner rendering tests |
| `tests/components/UpgradeCard.test.tsx` | Create | Upgrade card rendering tests |

---

## Task 1: Install packages and configure environment

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `.env.local`

- [ ] **Step 1: Install Stripe packages**

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

Expected: packages added to `node_modules`, `package.json` updated.

- [ ] **Step 2: Add env vars to `.env.local`**

Add these lines (fill in real values from Stripe Dashboard and your product setup):

```bash
# Stripe — server only
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Stripe — client
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase service role (server only — never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

To get these values:
- `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe Dashboard → Developers → API Keys
- `STRIPE_PRICE_ID`: Create a Product "Prep.AI Pro" → add recurring price $9/month → copy the Price ID
- `STRIPE_WEBHOOK_SECRET`: Create in Task 6 (local testing) or Task 12 (production)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard → Project Settings → API → `service_role` key (keep secret — bypasses RLS)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install stripe packages"
```

---

## Task 2: Add Profile type and database migration

**Files:**
- Modify: `types/index.ts`
- Create: `supabase/migrations/20260529000000_profiles.sql`

- [ ] **Step 1: Add `Profile` type to `types/index.ts`**

Add after the existing exports:

```ts
export interface Profile {
  id: string
  plan: 'free' | 'pro'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  updated_at: string
}
```

- [ ] **Step 2: Create migration file**

Create `supabase/migrations/20260529000000_profiles.sql`:

```sql
create table if not exists profiles (
  id                      uuid primary key references auth.users on delete cascade,
  plan                    text not null default 'free',
  stripe_customer_id      text,
  stripe_subscription_id  text,
  updated_at              timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users read/write own profile"
  on profiles for all
  using (auth.uid() = id);

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

- [ ] **Step 3: Apply migration to Supabase**

Option A — Supabase CLI:
```bash
supabase db push
```

Option B — Supabase Dashboard: open the SQL editor for your project at `https://supabase.com/dashboard/project/<your-ref>/sql` and run the SQL above.

- [ ] **Step 4: Commit**

```bash
git add types/index.ts supabase/migrations/20260529000000_profiles.sql
git commit -m "feat: add Profile type and profiles migration"
```

---

## Task 3: Stripe server client singleton

**Files:**
- Create: `lib/stripe.ts`

- [ ] **Step 1: Create `lib/stripe.ts`**

```ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})
```

- [ ] **Step 2: Commit**

```bash
git add lib/stripe.ts
git commit -m "feat: add Stripe server singleton"
```

---

## Task 4: Enforce session limit in `/api/interview/create`

**Files:**
- Create: `tests/api/interview-create-limit.test.ts`
- Modify: `app/api/interview/create/route.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/api/interview-create-limit.test.ts`:

```ts
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
```

- [ ] **Step 2: Run to confirm tests fail**

```bash
npm run test:run -- tests/api/interview-create-limit.test.ts
```

Expected: 3 tests fail (feature not implemented yet).

- [ ] **Step 3: Add the limit check to `app/api/interview/create/route.ts`**

Insert after the auth check and input validation, before the session insert:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateQuestions } from '@/lib/claude/generateQuestions'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { jobDescription, resumeText } = body as {
    jobDescription: string
    resumeText: string
  }

  if (!jobDescription?.trim() || !resumeText?.trim()) {
    return NextResponse.json(
      { error: 'Job description and resume are required' },
      { status: 400 }
    )
  }

  // --- Session limit gate ---
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'pro') {
    const { count } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count ?? 0) >= 5) {
      return NextResponse.json({ error: 'session_limit_reached' }, { status: 403 })
    }
  }
  // --- End gate ---

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      job_description: jobDescription,
      resume_text: resumeText,
    })
    .select()
    .single()

  if (sessionError || !session) {
    console.error('[create] session insert failed:', sessionError)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }

  let questions
  try {
    questions = await generateQuestions(jobDescription, resumeText)
  } catch (err) {
    console.error('[create] generateQuestions failed:', err)
    await supabase.from('sessions').delete().eq('id', session.id)
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  }

  const { error: questionsError } = await supabase
    .from('questions')
    .insert(questions.map(q => ({ session_id: session.id, ...q })))

  if (questionsError) {
    await supabase.from('sessions').delete().eq('id', session.id)
    return NextResponse.json({ error: 'Failed to save questions' }, { status: 500 })
  }

  return NextResponse.json({ sessionId: session.id })
}
```

- [ ] **Step 4: Run tests — all 3 should pass**

```bash
npm run test:run -- tests/api/interview-create-limit.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/api/interview/create/route.ts tests/api/interview-create-limit.test.ts
git commit -m "feat: gate session creation at 5 for free users"
```

---

## Task 5: `/api/stripe/create-subscription` route

**Files:**
- Create: `app/api/stripe/create-subscription/route.ts`
- Create: `tests/api/stripe-create-subscription.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/api/stripe-create-subscription.test.ts`:

```ts
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
```

- [ ] **Step 2: Run to confirm tests fail**

```bash
npm run test:run -- tests/api/stripe-create-subscription.test.ts
```

Expected: tests fail (file doesn't exist yet).

- [ ] **Step 3: Create `app/api/stripe/create-subscription/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id as string | null

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: process.env.STRIPE_PRICE_ID! }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  })

  const invoice = subscription.latest_invoice as import('stripe').Stripe.Invoice
  const paymentIntent = invoice.payment_intent as import('stripe').Stripe.PaymentIntent

  return NextResponse.json({
    subscriptionId: subscription.id,
    clientSecret: paymentIntent.client_secret,
  })
}
```

- [ ] **Step 4: Run tests — both should pass**

```bash
npm run test:run -- tests/api/stripe-create-subscription.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/api/stripe/create-subscription/route.ts tests/api/stripe-create-subscription.test.ts
git commit -m "feat: add create-subscription API route"
```

---

## Task 6: `/api/stripe/webhook` route

**Files:**
- Create: `app/api/stripe/webhook/route.ts`
- Create: `tests/api/stripe-webhook.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/api/stripe-webhook.test.ts`:

```ts
import { NextRequest } from 'next/server'
import { vi, beforeEach, describe, it, expect } from 'vitest'

vi.mock('@/lib/supabase/server')
vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}))

import { createClient } from '@/lib/supabase/server'
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

function makeSupabaseMock(userId = 'user-1') {
  return {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: userId }, error: null }),
      update: vi.fn().mockReturnThis(),
    })),
  }
}

describe('POST /api/stripe/webhook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sets plan to pro on subscription.updated with active status', async () => {
    const event = {
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_123',
          customer: 'cus_123',
          status: 'active',
        },
      },
    }
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(event as any)
    const mockSupabase = makeSupabaseMock()
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const res = await POST(makeWebhookRequest(event))

    expect(res.status).toBe(200)
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
  })

  it('sets plan to free on subscription.deleted', async () => {
    const event = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123',
          customer: 'cus_123',
          status: 'canceled',
        },
      },
    }
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue(event as any)
    const mockSupabase = makeSupabaseMock()
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

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
```

- [ ] **Step 2: Run to confirm tests fail**

```bash
npm run test:run -- tests/api/stripe-webhook.test.ts
```

- [ ] **Step 3: Create `app/api/stripe/webhook/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

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
```

- [ ] **Step 4: Run tests — all 3 should pass**

```bash
npm run test:run -- tests/api/stripe-webhook.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add app/api/stripe/webhook/route.ts tests/api/stripe-webhook.test.ts
git commit -m "feat: add Stripe webhook handler"
```

---

## Task 7: Exclude webhook from auth middleware

**Files:**
- Modify: `middleware.ts`

- [ ] **Step 1: Update the matcher in `middleware.ts`**

The webhook route is called by Stripe — it cannot have an auth cookie. Update the `config` export and add a guard:

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Stripe webhook must be unauthenticated
  if (request.nextUrl.pathname === '/api/stripe/webhook') {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const protectedPaths = ['/dashboard', '/interview']
  const isProtected = protectedPaths.some(p =>
    request.nextUrl.pathname.startsWith(p)
  )

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (request.nextUrl.pathname === '/auth' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: exclude Stripe webhook from auth middleware"
```

---

## Task 8: `UsageBanner` component

**Files:**
- Create: `components/dashboard/UsageBanner.tsx`
- Create: `tests/components/UsageBanner.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/UsageBanner.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import UsageBanner from '@/components/dashboard/UsageBanner'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('UsageBanner', () => {
  it('shows correct session count', () => {
    render(<UsageBanner sessionCount={3} />)
    expect(screen.getByText(/3 of 5 sessions used/i)).toBeInTheDocument()
  })

  it('shows upgrade link', () => {
    render(<UsageBanner sessionCount={3} />)
    expect(screen.getByRole('link', { name: /upgrade/i })).toHaveAttribute('href', '/interview/new')
  })

  it('shows urgent message at 5 sessions', () => {
    render(<UsageBanner sessionCount={5} />)
    expect(screen.getByText(/5 of 5 sessions used/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to confirm tests fail**

```bash
npm run test:run -- tests/components/UsageBanner.test.tsx
```

- [ ] **Step 3: Create `components/dashboard/UsageBanner.tsx`**

```tsx
import Link from 'next/link'

interface UsageBannerProps {
  sessionCount: number
}

export default function UsageBanner({ sessionCount }: UsageBannerProps) {
  const pct = Math.min((sessionCount / 5) * 100, 100)
  const isAtLimit = sessionCount >= 5

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-[5px] border"
      style={{ background: 'var(--surface)', borderColor: isAtLimit ? 'var(--coral)' : 'var(--border-dark)' }}
    >
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[11px] mb-1.5" style={{ color: isAtLimit ? 'var(--coral)' : 'var(--warm-mid)' }}>
          {sessionCount} of 5 sessions used
        </div>
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--border-dark)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: 'var(--coral)' }}
          />
        </div>
      </div>
      <Link
        href="/interview/new"
        className="font-sans font-bold text-[12px] whitespace-nowrap"
        style={{ color: 'var(--coral)' }}
      >
        Upgrade →
      </Link>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — all 3 should pass**

```bash
npm run test:run -- tests/components/UsageBanner.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/UsageBanner.tsx tests/components/UsageBanner.test.tsx
git commit -m "feat: add UsageBanner component"
```

---

## Task 9: `UpgradeCard` component

**Files:**
- Create: `components/interview/UpgradeCard.tsx`
- Create: `tests/components/UpgradeCard.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `tests/components/UpgradeCard.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, beforeEach, describe, it, expect } from 'vitest'

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div data-testid="stripe-elements">{children}</div>,
  PaymentElement: () => <div data-testid="payment-element" />,
  useStripe: () => ({ confirmPayment: vi.fn() }),
  useElements: () => ({}),
}))

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({}),
}))

global.fetch = vi.fn()

import UpgradeCard from '@/components/interview/UpgradeCard'

describe('UpgradeCard', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the limit card with pricing', () => {
    render(<UpgradeCard />)
    expect(screen.getByText(/upgrade for \$9/i)).toBeInTheDocument()
    expect(screen.getByText(/unlimited sessions/i)).toBeInTheDocument()
  })

  it('fetches clientSecret and shows payment form when Upgrade is clicked', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ clientSecret: 'pi_test_secret', subscriptionId: 'sub_123' }),
    } as Response)

    render(<UpgradeCard />)
    fireEvent.click(screen.getByRole('button', { name: /upgrade for \$9/i }))

    await waitFor(() => {
      expect(screen.getByTestId('stripe-elements')).toBeInTheDocument()
      expect(screen.getByTestId('payment-element')).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run to confirm tests fail**

```bash
npm run test:run -- tests/components/UpgradeCard.test.tsx
```

- [ ] **Step 3: Create `components/interview/UpgradeCard.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import type { Appearance } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const appearance: Appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#e8604c',
    colorBackground: '#2c2825',
    colorText: '#faf7f2',
    colorDanger: '#e8604c',
    borderRadius: '4px',
  },
}

function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?upgraded=true`,
      },
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed. Please try again.')
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      router.push('/dashboard?upgraded=true')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: '#6b6560' }}>
          Payment details
        </div>
        <PaymentElement />
      </div>
      {error && (
        <p className="font-sans text-[12px] mb-4" style={{ color: 'var(--coral)' }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full font-sans font-bold text-[13px] text-white py-3 rounded-[5px] transition-opacity disabled:opacity-60"
        style={{ background: 'var(--coral)' }}
      >
        {loading ? 'Processing…' : 'Subscribe — $9/month'}
      </button>
      <p className="font-mono text-[10px] text-center mt-3" style={{ color: '#6b6560' }}>
        Powered by Stripe · Cancel anytime
      </p>
    </form>
  )
}

export default function UpgradeCard() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe/create-subscription', { method: 'POST' })
    const data = await res.json()
    setClientSecret(data.clientSecret)
    setLoading(false)
  }

  if (clientSecret) {
    return (
      <div className="max-w-[400px] mx-auto">
        <div className="text-center mb-8">
          <h2
            className="font-serif italic font-bold leading-tight tracking-[-0.02em] mb-2"
            style={{ fontSize: 28, color: 'var(--cream)' }}
          >
            Upgrade to Prep.AI Pro
          </h2>
          <p className="font-sans text-[13px]" style={{ color: 'var(--warm-mid)' }}>
            $9 / month · cancel anytime
          </p>
        </div>
        <div
          className="rounded-[8px] p-6 border"
          style={{ background: '#2c2825', borderColor: 'var(--border-dark)' }}
        >
          <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
            <PaymentForm />
          </Elements>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div
        className="inline-block font-mono text-[11px] px-3 py-1 rounded border mb-6 tracking-[0.06em] uppercase"
        style={{ color: 'var(--warm-mid)', borderColor: 'var(--border-dark)', background: '#2c2825' }}
      >
        Free plan · 5 / 5 sessions used
      </div>
      <h2
        className="font-serif italic font-bold leading-tight tracking-[-0.02em] mb-3"
        style={{ fontSize: 36, color: 'var(--cream)' }}
      >
        You&apos;ve used all your free sessions.
      </h2>
      <p className="font-sans text-[14px] mb-10" style={{ color: 'var(--warm-mid)' }}>
        Upgrade to keep practicing.
      </p>
      <div
        className="inline-block rounded-[8px] p-7 border text-left"
        style={{ background: '#2c2825', borderColor: 'var(--border-dark)', minWidth: 300 }}
      >
        <div className="font-mono text-[11px] font-bold mb-2 tracking-[0.07em] uppercase" style={{ color: 'var(--coral)' }}>
          Prep.AI Pro
        </div>
        <div className="font-sans font-bold mb-1" style={{ fontSize: 32, color: 'var(--cream)' }}>
          $9<span className="font-normal text-[15px]" style={{ color: 'var(--warm-mid)' }}> / month</span>
        </div>
        <div className="my-4" style={{ height: 1, background: 'var(--border-dark)' }} />
        <ul className="font-sans text-[13px] space-y-2 mb-6" style={{ color: 'var(--warm-mid)' }}>
          <li>✓ Unlimited sessions</li>
          <li>✓ Full session history</li>
          <li>✓ Detailed AI feedback</li>
          <li>✓ Cancel anytime</li>
        </ul>
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full font-sans font-bold text-[13px] text-white py-3 rounded-[5px] transition-opacity disabled:opacity-60"
          style={{ background: 'var(--coral)' }}
        >
          {loading ? 'Loading…' : 'Upgrade for $9 / month →'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — both should pass**

```bash
npm run test:run -- tests/components/UpgradeCard.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add components/interview/UpgradeCard.tsx tests/components/UpgradeCard.test.tsx
git commit -m "feat: add UpgradeCard component with inline Stripe Payment Element"
```

---

## Task 10: Update `/interview/new` page

**Files:**
- Modify: `app/interview/new/page.tsx`

- [ ] **Step 1: Replace `app/interview/new/page.tsx`**

```tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import InterviewSetupForm from '@/components/interview/InterviewSetupForm'
import UpgradeCard from '@/components/interview/UpgradeCard'
import UsageBanner from '@/components/dashboard/UsageBanner'

export default async function NewInterviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from('profiles').select('plan').eq('id', user.id).single(),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const plan = profile?.plan ?? 'free'
  const sessionCount = count ?? 0
  const isAtLimit = plan === 'free' && sessionCount >= 5

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--charcoal)' }}>
      <header
        className="flex items-center justify-between px-13 h-16 border-b"
        style={{ background: 'rgba(28,25,23,0.92)', borderColor: 'var(--border-dark)' }}
      >
        <div className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </div>
        <Link href="/dashboard" className="font-sans text-[13px]" style={{ color: 'var(--stone)' }}>
          ← Dashboard
        </Link>
      </header>

      <main className="max-w-[680px] mx-auto px-8 py-16">
        {isAtLimit ? (
          <UpgradeCard />
        ) : (
          <>
            {plan === 'free' && (
              <div className="mb-8">
                <UsageBanner sessionCount={sessionCount} />
              </div>
            )}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-6" style={{ background: 'var(--coral)' }} />
                <span className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: '#5a5450' }}>
                  New session
                </span>
              </div>
              <h1 className="font-serif italic font-bold leading-[1.0] tracking-[-0.025em] text-cream mb-3" style={{ fontSize: 44 }}>
                Set up your interview.
              </h1>
              <p className="font-sans text-[14px] leading-[1.7]" style={{ color: 'var(--stone)' }}>
                Paste the job description and your resume below. The AI will generate tailored questions for the role.
              </p>
            </div>
            <InterviewSetupForm />
          </>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/interview/new/page.tsx
git commit -m "feat: conditionally render UpgradeCard or form on new interview page"
```

---

## Task 11: Update dashboard page

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Update `app/dashboard/page.tsx`**

Add `UsageBanner` for free users and an upgrade success banner when `?upgraded=true` is in the URL. The page receives `searchParams` as a prop in Next.js 15 App Router.

```tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SessionCard from '@/components/dashboard/SessionCard'
import UsageBanner from '@/components/dashboard/UsageBanner'
import type { Session } from '@/types'

interface Props {
  searchParams: Promise<{ upgraded?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const params = await searchParams
  const justUpgraded = params.upgraded === 'true'

  const [{ data: sessions }, { data: profile }, { count }] = await Promise.all([
    supabase.from('sessions').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('plan').eq('id', user.id).single(),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const plan = profile?.plan ?? 'free'
  const sessionCount = count ?? 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--charcoal)' }}>
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-13 h-16 border-b"
        style={{
          background: 'rgba(28,25,23,0.92)',
          backdropFilter: 'blur(14px)',
          borderColor: 'var(--border-dark)',
        }}
      >
        <div className="font-sans font-bold text-[13px] tracking-[0.07em] uppercase" style={{ color: 'var(--cream)' }}>
          Prep<span style={{ color: 'var(--coral)' }}>.</span>AI
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-[11px]" style={{ color: '#4a4540' }}>{user.email}</span>
          <Link
            href="/interview/new"
            className="font-sans font-bold text-[13px] text-white px-4 py-2 rounded-[5px] transition-colors"
            style={{ background: 'var(--coral)' }}
          >
            New interview
          </Link>
        </div>
      </header>

      <main className="max-w-[760px] mx-auto px-8 py-16">
        {justUpgraded && (
          <div
            className="mb-8 px-5 py-4 rounded-[6px] border font-sans text-[13px] font-bold"
            style={{ background: '#1a2e1a', borderColor: '#2d5a2d', color: '#6bcf6b' }}
          >
            ✓ You&apos;re now on Prep.AI Pro — enjoy unlimited sessions!
          </div>
        )}

        {plan === 'free' && sessionCount < 5 && (
          <div className="mb-8">
            <UsageBanner sessionCount={sessionCount} />
          </div>
        )}

        <div className="mb-12">
          <h1
            className="font-serif italic font-bold leading-[1.05] tracking-[-0.02em] mb-2"
            style={{ fontSize: 40, color: 'var(--cream)' }}
          >
            Your sessions.
          </h1>
          <p className="font-sans text-[13px]" style={{ color: 'var(--warm-mid)' }}>
            {sessions && sessions.length > 0
              ? (() => {
                  const completed = sessions.filter(s => s.status === 'completed').length
                  const total = sessions.length
                  return completed === total
                    ? `${total} session${total === 1 ? '' : 's'} completed`
                    : `${total} session${total === 1 ? '' : 's'} · ${completed} completed`
                })()
              : 'No sessions yet'}
          </p>
        </div>

        {sessions && sessions.length > 0 ? (
          <div style={{ borderTop: '1px solid var(--border-dark)' }}>
            {sessions.map(session => (
              <SessionCard key={session.id} session={session as Session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif italic font-bold mb-3 tracking-[-0.01em]" style={{ fontSize: 24, color: 'var(--stone)' }}>
              Nothing here yet.
            </p>
            <p className="font-sans text-[13px] mb-8" style={{ color: 'var(--warm-mid)' }}>
              Start a practice session to see your results here.
            </p>
            <Link
              href="/interview/new"
              className="font-sans font-bold text-[14px] text-white px-8 py-3 rounded-[5px] inline-block"
              style={{ background: 'var(--coral)' }}
            >
              Start your first interview →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: add UsageBanner and upgrade success banner to dashboard"
```

---

## Task 12: Add env vars to Vercel and deploy

- [ ] **Step 1: Add the four new env vars to Vercel**

```bash
echo "sk_live_..." | vercel env add STRIPE_SECRET_KEY production
echo "whsec_..." | vercel env add STRIPE_WEBHOOK_SECRET production
echo "price_..." | vercel env add STRIPE_PRICE_ID production
echo "pk_live_..." | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
```

- [ ] **Step 2: Register the webhook URL in Stripe Dashboard**

Go to Stripe Dashboard → Developers → Webhooks → Add endpoint:
- URL: `https://ai-interview-coach-wine-kappa.vercel.app/api/stripe/webhook`
- Events to listen for: `customer.subscription.updated`, `customer.subscription.deleted`
- Copy the signing secret → update `STRIPE_WEBHOOK_SECRET` in both Vercel and `.env.local`

- [ ] **Step 3: Deploy to production**

```bash
vercel deploy --prod --yes
```

Expected: build succeeds, deployment live.

- [ ] **Step 4: Run the full test suite**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 5: Final commit for any last changes**

```bash
git add -A
git status  # verify nothing unexpected is staged
git commit -m "feat: complete Stripe freemium integration"
```
