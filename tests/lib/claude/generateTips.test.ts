import { describe, it, expect, vi, beforeEach } from 'vitest'

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

import { generateTips } from '@/lib/claude/generateTips'

const sampleQAPairs = [
  { question: 'Tell me about yourself.', answer: 'I am a developer.', score: 5 },
  { question: 'What is your strength?', answer: 'Problem solving.', score: 7 },
]

describe('generateTips', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
  })

  it('returns array of tip strings', async () => {
    const mockTips = ['Practice STAR method.', 'Be more specific.', 'Show enthusiasm.']
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => JSON.stringify(mockTips) },
    })

    const result = await generateTips('SWE role', sampleQAPairs)

    expect(result).toEqual(mockTips)
    expect(result).toHaveLength(3)
  })

  it('includes Q&A pairs in the prompt', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => '["tip"]' },
    })

    await generateTips('Engineer role', sampleQAPairs)

    const callArgs = mockGenerateContent.mock.calls[0][0]
    const textContent = callArgs.contents[0].parts[0].text
    expect(textContent).toContain('Tell me about yourself.')
    expect(textContent).toContain('I am a developer.')
  })

  it('throws when response is invalid JSON', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => 'not valid json' },
    })

    await expect(generateTips('job', sampleQAPairs)).rejects.toThrow()
  })
})
