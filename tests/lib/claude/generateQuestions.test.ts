import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { GeneratedQuestion } from '@/types'

const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
}))

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(function () {
    return {
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      }),
    }
  }),
}))

import { generateQuestions } from '@/lib/claude/generateQuestions'

describe('generateQuestions', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  it('returns parsed questions array from Gemini response', async () => {
    const mockQuestions: GeneratedQuestion[] = [
      { question_text: 'Tell me about yourself.', order_index: 1 },
      { question_text: 'What is your experience with React?', order_index: 2 },
    ]
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => JSON.stringify(mockQuestions) },
    })

    const result = await generateQuestions('Software Engineer role', 'Experienced developer')

    expect(result).toEqual(mockQuestions)
    expect(result).toHaveLength(2)
  })

  it('passes jobDescription and resumeText to Gemini', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => '[]' },
    })

    await generateQuestions('Senior SWE at Acme', 'John Doe, 10 years exp')

    const callArgs = mockGenerateContent.mock.calls[0][0]
    const textContent = callArgs.contents[0].parts[0].text
    expect(textContent).toContain('Senior SWE at Acme')
    expect(textContent).toContain('John Doe, 10 years exp')
  })

  it('throws when response is invalid JSON', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => 'not valid json {{{' },
    })

    await expect(generateQuestions('job', 'resume')).rejects.toThrow()
  })
})
