import { GoogleGenerativeAI } from '@google/generative-ai'
import type { QAPair } from '@/types'

export async function generateTips(
  jobDescription: string,
  qaPairs: QAPair[]
): Promise<string[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

  const qaContent = qaPairs
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}\nScore: ${qa.score}/10`)
    .join('\n\n')

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `You are an expert career coach reviewing a mock interview. Identify the top 3 most impactful areas for improvement. Return a JSON array of exactly 3 strings: ["tip1", "tip2", "tip3"]. Each tip must be specific and actionable (1-2 sentences).`,
  })

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `Job Description:\n${jobDescription}\n\nInterview Q&A:\n${qaContent}` }] }],
    generationConfig: { responseMimeType: 'application/json' },
  })

  return JSON.parse(result.response.text()) as string[]
}
