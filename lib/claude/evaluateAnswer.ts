import Anthropic from '@anthropic-ai/sdk'
import type { AnswerEvaluation } from '@/types'

export async function evaluateAnswer(
  jobDescription: string,
  question: string,
  answer: string
): Promise<AnswerEvaluation> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client: any
  try {
    client = new Anthropic()
  } catch {
    client = (Anthropic as unknown as (...args: unknown[]) => unknown)()
  }

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 512,
    system: `You are an expert interviewer evaluating candidate responses. Score the answer 1–10 (1=very poor, 5=average, 10=excellent) and give 2–3 sentences of constructive feedback. Return ONLY valid JSON — no markdown: { "score": number, "feedback": string }`,
    messages: [
      {
        role: 'user',
        content: `Job Description:\n${jobDescription}\n\nInterview Question:\n${question}\n\nCandidate Answer:\n${answer}\n\nEvaluate this answer.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return JSON.parse(content.text) as AnswerEvaluation
}
