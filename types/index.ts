export type SessionStatus = 'in_progress' | 'completed'

export interface Session {
  id: string
  user_id: string
  job_description: string
  resume_text: string
  status: SessionStatus
  overall_score: number | null
  tips: string[] | null
  created_at: string
  questions?: Question[]
}

export interface Question {
  id: string
  session_id: string
  question_text: string
  order_index: number
  answers?: Answer[]
}

export interface Answer {
  id: string
  question_id: string
  answer_text: string
  score: number
  feedback: string
  created_at: string
}

export interface GeneratedQuestion {
  question_text: string
  order_index: number
}

export interface AnswerEvaluation {
  score: number
  feedback: string
}

export interface QAPair {
  question: string
  answer: string
  score: number
}
