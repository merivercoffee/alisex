import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { validateOpenAIEnv } from '@/lib/openai'

const ORIGINAL_ENV = process.env

describe('validateOpenAIEnv', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.OPENAI_API_KEY
    delete process.env.OPENAI_MODEL
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns invalid when OPENAI_API_KEY is missing', () => {
    const res = validateOpenAIEnv()
    expect(res).toEqual({ valid: false, error: 'Missing OPENAI_API_KEY environment variable' })
  })

  it('returns valid with default model when key is present', () => {
    process.env.OPENAI_API_KEY = 'sk-test'
    const res = validateOpenAIEnv()
    expect(res).toEqual({ valid: true, model: 'gpt-4o-mini' })
  })

  it('uses OPENAI_MODEL when provided', () => {
    process.env.OPENAI_API_KEY = 'sk-test'
    process.env.OPENAI_MODEL = 'gpt-4o'
    const res = validateOpenAIEnv()
    expect(res).toEqual({ valid: true, model: 'gpt-4o' })
  })
})
