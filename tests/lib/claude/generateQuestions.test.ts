import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { GeneratedQuestion } from '@/types'

const mockCreate = vi.fn()

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}))

import { generateQuestions } from '@/lib/claude/generateQuestions'

describe('generateQuestions', () => {
  beforeEach(() => {
    mockCreate.mockReset()
  })

  it('returns parsed questions array from Claude response', async () => {
    const mockQuestions: GeneratedQuestion[] = [
      { question_text: 'Tell me about yourself.', order_index: 1 },
      { question_text: 'What is your experience with React?', order_index: 2 },
    ]
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(mockQuestions) }],
    })

    const result = await generateQuestions('Software Engineer role', 'Experienced developer')

    expect(result).toEqual(mockQuestions)
    expect(result).toHaveLength(2)
  })

  it('passes jobDescription and resumeText to Claude', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '[]' }],
    })

    await generateQuestions('Senior SWE at Acme', 'John Doe, 10 years exp')

    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[0].content).toContain('Senior SWE at Acme')
    expect(callArgs.messages[0].content).toContain('John Doe, 10 years exp')
  })

  it('throws when Claude returns non-text content', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'image', source: {} }],
    })

    await expect(generateQuestions('job', 'resume')).rejects.toThrow(
      'Unexpected response type from Claude'
    )
  })

  it('throws when response is invalid JSON', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'not valid json {{{' }],
    })

    await expect(generateQuestions('job', 'resume')).rejects.toThrow()
  })
})
