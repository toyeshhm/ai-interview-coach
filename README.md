# AI Interview Coach

An AI-powered mock interview app that generates tailored questions from your job description and resume, scores your answers in real time, and gives you actionable feedback.

**Live demo:** https://ai-interview-coach-wine-kappa.vercel.app

## Features

- Paste a job description + resume → get 6–8 tailored interview questions
- Answer questions one at a time in a live interview session
- Each answer is scored 1–10 with immediate feedback
- Results page with overall score breakdown and top 3 improvement tips
- Dashboard to review all past sessions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | React 19, shadcn/ui, Tailwind CSS v4 |
| AI | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Backend | Supabase (Auth + PostgreSQL) |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

## Setup

**1. Clone and install**

```bash
git clone https://github.com/toyeshhm/ai-interview-coach.git
cd ai-interview-coach
npm install
```

**2. Configure environment variables**

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | [Supabase](https://supabase.com) → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page, anon/public key |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |

**3. Run locally**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx                        # Landing / redirect
  auth/page.tsx                   # Sign in / sign up
  dashboard/page.tsx              # Past sessions list
  interview/new/page.tsx          # Setup form (JD + resume)
  interview/[id]/page.tsx         # Live interview
  interview/[id]/results/page.tsx # Score breakdown + tips
  api/interview/
    create/route.ts               # Generate questions
    [id]/answer/route.ts          # Score an answer
    [id]/complete/route.ts        # Finalize + generate tips
components/
  interview/   # InterviewClient, InterviewSetupForm
  dashboard/   # SessionCard
  results/     # ResultsSummary
  ui/          # shadcn/ui primitives
lib/
  claude/      # generateQuestions, evaluateAnswer, generateTips
  supabase/    # client + server helpers
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test:run` | Run tests once |

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/toyeshhm/ai-interview-coach)

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY` in your Vercel project settings.
