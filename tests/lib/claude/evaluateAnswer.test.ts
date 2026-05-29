import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AnswerEvaluation } from '@/types'

const mockCreate = vi.fn()

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}))

import { evaluateAnswer } from '@/lib/claude/evaluateAnswer'

describe('evaluateAnswer', () => {
  beforeEach(() => {
    mockCreate.mockReset()
  })

  it('returns score and feedback from Claude response', async () => {
    const mockEval: AnswerEvaluation = { score: 8, feedback: 'Strong answer with good examples.' }
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(mockEval) }],
    })

    const result = await evaluateAnswer('SWE role', 'Tell me about yourself.', 'I have 5 years of experience...')

    expect(result.score).toBe(8)
    expect(result.feedback).toBe('Strong answer with good examples.')
  })

  it('passes all context to Claude', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify({ score: 7, feedback: 'ok' }) }],
    })

    await evaluateAnswer('React Engineer', 'Explain hooks.', 'Hooks are functions...')

    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[0].content).toContain('React Engineer')
    expect(callArgs.messages[0].content).toContain('Explain hooks.')
    expect(callArgs.messages[0].content).toContain('Hooks are functions...')
  })

  it('throws when Claude returns non-text content', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'image', source: {} }],
    })

    await expect(evaluateAnswer('job', 'question', 'answer')).rejects.toThrow(
      'Unexpected response type from Claude'
    )
  })
})
