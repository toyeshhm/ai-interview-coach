# AI Interview Coach

An AI-powered interview coaching application built with Next.js 15, Anthropic Claude, and Supabase.

## Overview

AI Interview Coach helps candidates prepare for job interviews through AI-driven mock interviews, real-time feedback, and personalized coaching — powered by Claude.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | React 19, shadcn/ui, Tailwind CSS v4 |
| AI | Anthropic Claude API (`@anthropic-ai/sdk`) |
| Backend | Supabase (Auth + PostgreSQL) |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

## Setup

**1. Clone and install dependencies**

```bash
git clone https://github.com/toyeshhm/ai-interview-coach.git
cd ai-interview-coach
npm install
```

**2. Configure environment variables**

Copy `.env.local` and fill in your credentials:

```bash
cp .env.local .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (server-side only) |

**3. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/              # Next.js App Router pages and layouts
components/
  ui/             # shadcn/ui primitives (Button, Card, Input, etc.)
lib/
  utils.ts        # Shared utility functions
tests/            # Vitest test files
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI) |

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/toyeshhm/ai-interview-coach)

Set the three environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`) in your Vercel project settings before deploying.
