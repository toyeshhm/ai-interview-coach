import Anthropic from '@anthropic-ai/sdk'
import type { QAPair } from '@/types'

export async function generateTips(
  jobDescription: string,
  qaPairs: QAPair[]
): Promise<string[]> {
  // Instantiate client lazily so test mocks are in place before construction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client: any
  try {
    client = new Anthropic()
  } catch {
    client = (Anthropic as unknown as (...args: unknown[]) => unknown)()
  }

  const qaContent = qaPairs
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}\nScore: ${qa.score}/10`)
    .join('\n\n')

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 512,
    system: `You are an expert career coach reviewing a mock interview. Identify the top 3 most impactful areas for improvement. Return ONLY a valid JSON array of 3 strings — no markdown: ["tip1", "tip2", "tip3"]. Each tip must be specific and actionable (1–2 sentences).`,
    messages: [
      {
        role: 'user',
        content: `Job Description:\n${jobDescription}\n\nInterview Q&A:\n${qaContent}\n\nProvide top 3 improvement tips.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return JSON.parse(content.text) as string[]
}
