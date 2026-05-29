import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GeneratedQuestion } from '@/types'

export async function generateQuestions(
  jobDescription: string,
  resumeText: string
): Promise<GeneratedQuestion[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-pro',
    systemInstruction: `You are an expert technical interviewer. Generate 6-8 tailored interview questions based on the job description and candidate resume. Return a JSON array where each element has: "question_text" (string) and "order_index" (integer starting at 1). Mix behavioral, technical, and situational questions relevant to the role.`,
  })

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `Job Description:\n${jobDescription}\n\nCandidate Resume:\n${resumeText}` }] }],
    generationConfig: { responseMimeType: 'application/json' },
  })

  return JSON.parse(result.response.text()) as GeneratedQuestion[]
}
