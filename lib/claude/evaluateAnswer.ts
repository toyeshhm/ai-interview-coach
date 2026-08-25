import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AnswerEvaluation } from '@/types'

export async function evaluateAnswer(
  jobDescription: string,
  question: string,
  answer: string
): Promise<AnswerEvaluation> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `You are an expert interviewer evaluating candidate responses. Score the answer 1-10 (1=very poor, 5=average, 10=excellent) and provide 2-3 sentences of constructive feedback. Return JSON: { "score": number, "feedback": string }`,
  })

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `Job Description:\n${jobDescription}\n\nInterview Question:\n${question}\n\nCandidate Answer:\n${answer}` }] }],
    generationConfig: { responseMimeType: 'application/json' },
  })

  const raw = result.response.text()
  try {
    return JSON.parse(raw) as AnswerEvaluation
  } catch {
    throw new Error(`AI returned an invalid response format: ${raw.slice(0, 100)}`)
  }
}
