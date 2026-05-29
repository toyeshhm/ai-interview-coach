import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AnswerEvaluation } from '@/types'

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

import { evaluateAnswer } from '@/lib/claude/evaluateAnswer'

describe('evaluateAnswer', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  it('returns score and feedback from Gemini response', async () => {
    const mockEval: AnswerEvaluation = { score: 8, feedback: 'Strong answer with good examples.' }
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => JSON.stringify(mockEval) },
    })

    const result = await evaluateAnswer('SWE role', 'Tell me about yourself.', 'I have 5 years of experience...')

    expect(result.score).toBe(8)
    expect(result.feedback).toBe('Strong answer with good examples.')
  })

  it('passes all context to Gemini', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => JSON.stringify({ score: 7, feedback: 'ok' }) },
    })

    await evaluateAnswer('React Engineer', 'Explain hooks.', 'Hooks are functions...')

    const callArgs = mockGenerateContent.mock.calls[0][0]
    const textContent = callArgs.contents[0].parts[0].text
    expect(textContent).toContain('React Engineer')
    expect(textContent).toContain('Explain hooks.')
    expect(textContent).toContain('Hooks are functions...')
  })

  it('throws when response is invalid JSON', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => 'not valid json' },
    })

    await expect(evaluateAnswer('job', 'question', 'answer')).rejects.toThrow()
  })
})
