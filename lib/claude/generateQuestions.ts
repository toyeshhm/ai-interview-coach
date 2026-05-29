import AnthropicSdk from '@anthropic-ai/sdk'
import type { GeneratedQuestion } from '@/types'

export async function generateQuestions(
  jobDescription: string,
  resumeText: string
): Promise<GeneratedQuestion[]> {
  // Instantiate client lazily so test mocks are in place before construction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client: any
  try {
    client = new AnthropicSdk()
  } catch {
    client = (AnthropicSdk as unknown as (...args: unknown[]) => unknown)()
  }

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    system: `You are an expert technical interviewer. Generate 6-8 tailored interview questions based on the job description and candidate resume. Return ONLY a valid JSON array — no markdown, no explanation. Each element: { "question_text": string, "order_index": number (starting at 1) }. Mix behavioral, technical, and situational questions relevant to the role.`,
    messages: [
      {
        role: 'user',
        content: `Job Description:\n${jobDescription}\n\nCandidate Resume:\n${resumeText}\n\nGenerate interview questions as a JSON array.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude')
  }

  return JSON.parse(content.text) as GeneratedQuestion[]
}
