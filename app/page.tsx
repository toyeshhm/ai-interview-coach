import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-4">
          AI Interview Coach
        </h1>
        <p className="text-slate-300 text-xl mb-10 leading-relaxed">
          Paste your resume and job description. Get tailored questions,
          practice your answers, and receive instant AI-powered feedback.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth" className={cn(buttonVariants({ size: 'lg' }))}>
            Get Started Free
          </Link>
          <Link
            href="/auth?tab=login"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'text-white border-white hover:bg-white/10')}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
