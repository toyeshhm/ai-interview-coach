import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import InterviewSetupForm from '@/components/interview/InterviewSetupForm'

export default function NewInterviewPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">New Interview</h1>
            <p className="text-slate-600 mt-1">
              Claude will generate 6–8 tailored questions based on the role and your background.
            </p>
          </div>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: 'ghost' }))}>
            ← Back
          </Link>
        </div>
        <InterviewSetupForm />
      </div>
    </div>
  )
}
