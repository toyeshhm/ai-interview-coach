import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCreate = vi.fn()

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}))

import { generateTips } from '@/lib/claude/generateTips'

const sampleQAPairs = [
  { question: 'Tell me about yourself.', answer: 'I am a developer.', score: 5 },
  { question: 'What is your strength?', answer: 'Problem solving.', score: 7 },
]

describe('generateTips', () => {
  beforeEach(() => {
    mockCreate.mockReset()
  })

  it('returns array of 3 tip strings', async () => {
    const mockTips = ['Practice STAR method.', 'Be more specific.', 'Show enthusiasm.']
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(mockTips) }],
    })

    const result = await generateTips('SWE role', sampleQAPairs)

    expect(result).toEqual(mockTips)
    expect(result).toHaveLength(3)
  })

  it('includes Q&A pairs in the prompt', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '["tip"]' }],
    })

    await generateTips('Engineer role', sampleQAPairs)

    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages[0].content).toContain('Tell me about yourself.')
    expect(callArgs.messages[0].content).toContain('I am a developer.')
  })

  it('throws when Claude returns non-text content', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'image', source: {} }],
    })

    await expect(generateTips('job', sampleQAPairs)).rejects.toThrow(
      'Unexpected response type from Claude'
    )
  })
})
